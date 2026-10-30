using System.Security.Claims;
using System.Text;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using CulinaryBlog.Infrastructure.Jobs;
using CulinaryBlog.Application.Interfaces;
using Hangfire;
using StackExchange.Redis;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.API.Endpoints;

public static class AdminEndpoints
{
    public static void MapAdmin(this IEndpointRouteBuilder app)
    {
        var admin = app.MapGroup("/api/v1/admin").WithTags("Admin").RequireAuthorization(p => p.RequireRole("Admin"));
        admin.MapGet("/overview", async (ApplicationDbContext db) => new ApiResponseResult(200, new
        {
            users = await db.Users.CountAsync(),
            recipes = await db.Recipes.CountAsync(r => !r.IsDeleted),
            categories = await db.Categories.CountAsync(c => !c.IsDeleted),
            posts = await db.CommunityPosts.CountAsync(),
            articles = await db.BlogArticles.CountAsync(),
            pendingReports = await db.ContentReports.CountAsync(r => r.ResolvedAt == null)
        }));
        admin.MapGet("/users", async (ApplicationDbContext db, string? q = null, string? role = null, bool? suspended = null, bool? twoFactorEnabled = null, DateTime? createdFrom = null, DateTime? createdTo = null, DateTime? activeSince = null, int page = 1, int pageSize = 20) =>
        {
            page = Math.Max(1, page); pageSize = Math.Clamp(pageSize, 1, 100);
            var query = db.Users.AsNoTracking().AsQueryable();
            if (!string.IsNullOrWhiteSpace(q))
            {
                var keyword = q.Trim().ToLower();
                query = query.Where(user => user.UserName!.ToLower().Contains(keyword) || user.FullName.ToLower().Contains(keyword) || user.Email!.ToLower().Contains(keyword));
            }
            if (role is "User" or "Author" or "Admin") query = query.Where(user => user.Role == role);
            if (suspended.HasValue) query = query.Where(user => user.IsSuspended == suspended.Value);
            if (twoFactorEnabled.HasValue) query = twoFactorEnabled.Value
                ? query.Where(user => !string.IsNullOrEmpty(user.TwoFactorSecretProtected))
                : query.Where(user => string.IsNullOrEmpty(user.TwoFactorSecretProtected));
            if (createdFrom.HasValue) query = query.Where(user => user.CreatedAt >= createdFrom.Value.ToUniversalTime());
            if (createdTo.HasValue) query = query.Where(user => user.CreatedAt <= createdTo.Value.Date.AddDays(1).AddTicks(-1).ToUniversalTime());
            if (activeSince.HasValue) query = query.Where(user => user.LastLoginAt != null && user.LastLoginAt >= activeSince.Value.ToUniversalTime());
            var total = await query.CountAsync();
            return new ApiResponseResult(200, new
            {
                items = await query.OrderByDescending(u => u.LastLoginAt ?? u.CreatedAt).ThenBy(u => u.Id).Skip((page - 1) * pageSize).Take(pageSize)
                    .Select(u => new { u.Id, u.UserName, u.FullName, u.Email, u.Role, u.CreatedAt, u.IsSuspended, u.SuspendedUntil, u.LastLoginAt, twoFactorEnabled = !string.IsNullOrWhiteSpace(u.TwoFactorSecretProtected) }).ToListAsync(),
                page, pageSize, total
            });
        });
        admin.MapGet("/reports", async (ApplicationDbContext db, bool resolved = false, int page = 1, int pageSize = 20) =>
        {
            page = Math.Max(1, page); pageSize = Math.Clamp(pageSize, 1, 100);
            var query = db.ContentReports.AsNoTracking().Where(r => (r.ResolvedAt != null) == resolved);
            return new ApiResponseResult(200, new { items = await query.OrderByDescending(r => r.CreatedAt).ThenBy(r => r.Id)
                .Skip((page - 1) * pageSize).Take(pageSize)
                .Select(r => new { r.Id, r.TargetType, r.TargetId, r.Reason, r.CreatedAt, r.ResolvedAt, r.ResolutionAction, r.ResolutionNote, resolverName = r.ResolvedBy == null ? null : r.ResolvedBy.FullName }).ToListAsync(),
                page, pageSize, total = await query.CountAsync() });
        });
        admin.MapPut("/reports/{id:guid}/resolve", (Guid id, AdminReportResolutionRequest? request, HttpContext context, ApplicationDbContext db) => ResolveReport(id, request, context, db));
        admin.MapGet("/recipes", async (ApplicationDbContext db, string? q = null, int page = 1, int pageSize = 20) =>
        {
            page = Math.Max(1, page); pageSize = Math.Clamp(pageSize, 1, 100);
            var query = db.Recipes.AsNoTracking().Where(recipe => !recipe.IsDeleted);
            if (!string.IsNullOrWhiteSpace(q))
            {
                var keyword = q.Trim().ToLower();
                query = query.Where(recipe => recipe.Title.ToLower().Contains(keyword));
            }
            var total = await query.CountAsync();
            var items = await query.OrderByDescending(recipe => recipe.UpdatedAt).ThenBy(recipe => recipe.Id)
                .Skip((page - 1) * pageSize).Take(pageSize)
                .Select(recipe => new { recipe.Id, recipe.Title, recipe.Slug, recipe.Status, recipe.ReviewStatus, recipe.ReviewNote, recipe.ReviewRequestedAt, recipe.ReviewedAt, recipe.CategoryId, categoryName = recipe.Category.Name, recipe.AuthorId, authorName = recipe.Author.FullName, recipe.UpdatedAt })
                .ToListAsync();
            return new ApiResponseResult(200, new { items, page, pageSize, total });
        });
        admin.MapGet("/recipes/{id:guid}", (Guid id, ApplicationDbContext db) => GetRecipeDetail(id, db));
        admin.MapGet("/recipes/{id:guid}/history", async (Guid id, ApplicationDbContext db) => new ApiResponseResult(200, new
        {
            items = await db.AdminAuditLogs.AsNoTracking().Where(log => log.TargetType == "recipe" && log.TargetId == id.ToString())
                .OrderByDescending(log => log.CreatedAt).Select(log => new { log.Id, log.Action, log.Summary, log.CreatedAt, actor = log.Actor.FullName ?? log.Actor.UserName }).ToListAsync()
        }));
        admin.MapGet("/posts", async (ApplicationDbContext db, int page = 1, int pageSize = 20) =>
        {
            page = Math.Max(1, page); pageSize = Math.Clamp(pageSize, 1, 100);
            var query = db.CommunityPosts.AsNoTracking();
            var total = await query.CountAsync();
            var items = await query.OrderByDescending(post => post.CreatedAt).ThenBy(post => post.Id)
                .Skip((page - 1) * pageSize).Take(pageSize)
                .Select(post => new { post.Id, post.Content, post.IsDraft, post.IsHidden, post.HiddenReason, post.CommentsEnabled, post.CreatedAt, post.AuthorId, authorName = post.Author.FullName, authorUsername = post.Author.UserName, commentCount = post.Comments.Count, likeCount = post.Likes.Count })
                .ToListAsync();
            return new ApiResponseResult(200, new { items, page, pageSize, total });
        });
        admin.MapGet("/articles", async (ApplicationDbContext db, int page = 1, int pageSize = 20) =>
        {
            page = Math.Max(1, page); pageSize = Math.Clamp(pageSize, 1, 100);
            var query = db.BlogArticles.AsNoTracking();
            var total = await query.CountAsync();
            var items = await query.OrderByDescending(article => article.CreatedAt).ThenBy(article => article.Id)
                .Skip((page - 1) * pageSize).Take(pageSize)
                .Select(article => new { article.Id, article.Title, article.Slug, article.Summary, article.CreatedAt, article.UpdatedAt, article.AuthorId, authorName = article.Author.FullName })
                .ToListAsync();
            return new ApiResponseResult(200, new { items, page, pageSize, total });
        });
        admin.MapPut("/users/{id}/role", async (string id, AdminRoleRequest request, HttpContext context, IServiceProvider services, ApplicationDbContext db) =>
        {
            // Resolve these only for this privileged action. Lightweight test
            // hosts can still expose the read-only admin endpoints without
            // having to boot ASP.NET Identity's role stores.
            var userManager = services.GetService<UserManager<ApplicationUser>>();
            var roleManager = services.GetService<RoleManager<IdentityRole>>();
            if (userManager is null || roleManager is null)
                return new ApiResponseResult(501, new { message = "Dịch vụ quản lý vai trò chưa được cấu hình." });
            var role = request.Role?.Trim();
            if (role is not ("Admin" or "Author" or "User")) return new ApiResponseResult(400, new { message = "Vai trò chỉ có thể là Admin, Author hoặc User." });
            var target = await userManager.FindByIdAsync(id);
            if (target is null) return new ApiResponseResult(404, new { message = "Không tìm thấy thành viên." });
            var actorId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (target.Id == actorId && role != "Admin") return new ApiResponseResult(400, new { message = "Quản trị viên không thể tự hạ quyền của chính mình." });
            if (!await roleManager.RoleExistsAsync(role)) await roleManager.CreateAsync(new IdentityRole(role));
            var existingRoles = await userManager.GetRolesAsync(target);
            if (existingRoles.Count > 0) await userManager.RemoveFromRolesAsync(target, existingRoles);
            var addResult = await userManager.AddToRoleAsync(target, role);
            if (!addResult.Succeeded) return new ApiResponseResult(400, new { message = string.Join(" ", addResult.Errors.Select(error => error.Description)) });
            target.Role = role;
            await userManager.UpdateAsync(target);
            await Audit(db, actorId ?? "system", "user.role.changed", "user", target.Id, $"Đổi vai trò của {target.UserName} thành {role}.");
            return new ApiResponseResult(200, new { target.Id, target.UserName, target.FullName, target.Role });
        });
        admin.MapPut("/users/{id}/suspension", (string id, AdminSuspensionRequest request, HttpContext context, ApplicationDbContext db) => SetSuspension(id, request, context, db));
        admin.MapPost("/users/{id}/sessions/revoke", (string id, HttpContext context, ApplicationDbContext db) => RevokeUserSessions(id, context, db));
        admin.MapGet("/users/{id}", (string id, ApplicationDbContext db) => GetUserDetail(id, db));
        admin.MapPut("/users/{id}/profile", (string id, AdminUserProfileRequest request, HttpContext context, ApplicationDbContext db) => UpdateUserProfile(id, request, context, db));
        admin.MapPut("/users/{id}/password", (string id, AdminPasswordResetRequest request, HttpContext context, ApplicationDbContext db) => ResetUserPassword(id, request, context, db));
        admin.MapGet("/audit-logs", (ApplicationDbContext db, int page = 1, int pageSize = 30) => GetAuditLogs(db, page, pageSize));
        admin.MapGet("/review-templates", () => new ApiResponseResult(200, new[]
        {
            new { key = "missing-image", label = "Thiếu ảnh minh họa", note = "Vui lòng bổ sung ít nhất một ảnh món ăn rõ nét trước khi gửi duyệt lại." },
            new { key = "missing-steps", label = "Thiếu bước chế biến", note = "Vui lòng mô tả đầy đủ từng bước chế biến để người đọc có thể thực hiện món ăn." },
            new { key = "missing-ingredients", label = "Thiếu nguyên liệu", note = "Vui lòng bổ sung định lượng và đơn vị cho các nguyên liệu còn thiếu." },
            new { key = "content-quality", label = "Cần cải thiện nội dung", note = "Nội dung cần được viết rõ ràng hơn và phù hợp với tiêu chuẩn cộng đồng trước khi xuất bản." }
        }));
        admin.MapGet("/priority-queue", async (ApplicationDbContext db, int take = 30) =>
        {
            take = Math.Clamp(take, 1, 100);
            var pendingReviews = await db.Recipes.AsNoTracking().Where(recipe => !recipe.IsDeleted && recipe.ReviewStatus == "PendingReview")
                .OrderBy(recipe => recipe.ReviewRequestedAt).Take(take).Select(recipe => new { type = "review", priority = 2, id = recipe.Id.ToString(), title = recipe.Title, detail = "Công thức chờ duyệt", createdAt = recipe.ReviewRequestedAt ?? recipe.UpdatedAt, author = recipe.Author.FullName }).ToListAsync();
            var reports = await db.ContentReports.AsNoTracking().Where(report => report.ResolvedAt == null)
                .OrderBy(report => report.CreatedAt).Take(take).Select(report => new { type = "report", priority = 1, id = report.Id.ToString(), title = report.TargetType, detail = report.Reason, createdAt = report.CreatedAt, author = report.Reporter.FullName }).ToListAsync();
            var suspendedUsers = await db.Users.AsNoTracking().Where(user => user.IsSuspended)
                .OrderByDescending(user => user.SuspendedUntil == null).ThenBy(user => user.SuspendedUntil).Take(take).Select(user => new { type = "suspended-user", priority = 3, id = user.Id, title = user.FullName, detail = user.SuspensionReason ?? "Tài khoản đang bị khóa", createdAt = user.SuspendedUntil ?? user.CreatedAt, author = user.UserName! }).ToListAsync();
            var items = pendingReviews.Concat(reports).Concat(suspendedUsers).OrderBy(item => item.priority).ThenBy(item => item.createdAt).Take(take);
            return new ApiResponseResult(200, new { items, total = pendingReviews.Count + reports.Count + suspendedUsers.Count });
        });
        admin.MapGet("/alerts", async (ApplicationDbContext db) =>
        {
            var since = DateTime.UtcNow.AddDays(-1);
            var pendingReports = await db.ContentReports.CountAsync(report => report.ResolvedAt == null);
            var pendingReviews = await db.Recipes.CountAsync(recipe => !recipe.IsDeleted && recipe.ReviewStatus == "PendingReview");
            var failedLogins = await db.UserActivityLogs.CountAsync(log => log.CreatedAt >= since && log.ActivityType.Contains("login.failed"));
            var alerts = new List<object>();
            if (pendingReports > 0) alerts.Add(new { severity = pendingReports >= 5 ? "high" : "medium", code = "pending-reports", title = $"{pendingReports} báo cáo chưa xử lý", message = "Mở khu vực Báo cáo để kiểm duyệt nội dung.", target = "reports" });
            if (pendingReviews > 0) alerts.Add(new { severity = "medium", code = "pending-reviews", title = $"{pendingReviews} công thức chờ duyệt", message = "Tác giả đang chờ phản hồi trước khi xuất bản.", target = "reviews" });
            if (failedLogins >= 5) alerts.Add(new { severity = "high", code = "failed-logins", title = $"{failedLogins} lượt đăng nhập thất bại trong 24 giờ", message = "Kiểm tra nhật ký bảo mật và các tài khoản liên quan.", target = "audit" });
            return new ApiResponseResult(200, new { generatedAt = DateTime.UtcNow, items = alerts });
        });
        admin.MapGet("/internal-notes/{targetType}/{targetId}", async (string targetType, string targetId, ApplicationDbContext db) => new ApiResponseResult(200, new
        {
            items = await db.AdminAuditLogs.AsNoTracking().Where(log => log.Action == "admin.internal.note" && log.TargetType == targetType && log.TargetId == targetId)
                .OrderByDescending(log => log.CreatedAt).Select(log => new { log.Id, log.CreatedAt, log.Summary, author = log.Actor.FullName ?? log.Actor.UserName }).ToListAsync()
        }));
        admin.MapPost("/internal-notes", async (InternalNoteRequest request, HttpContext context, ApplicationDbContext db) =>
        {
            var targetType = request.TargetType?.Trim(); var targetId = request.TargetId?.Trim(); var note = request.Note?.Trim();
            if (string.IsNullOrWhiteSpace(targetType) || string.IsNullOrWhiteSpace(targetId) || string.IsNullOrWhiteSpace(note)) return new ApiResponseResult(400, new { message = "Cần nhập đối tượng và nội dung ghi chú." });
            if (note.Length > 2000) return new ApiResponseResult(400, new { message = "Ghi chú tối đa 2000 ký tự." });
            await Audit(db, ActorId(context), "admin.internal.note", targetType, targetId, note);
            return new ApiResponseResult(201, new { message = "Đã lưu ghi chú nội bộ." });
        });
        admin.MapGet("/exports/users.csv", async (ApplicationDbContext db) =>
        {
            var rows = await db.Users.AsNoTracking().OrderBy(user => user.CreatedAt).Select(user => new { user.UserName, user.FullName, user.Email, user.Role, user.CreatedAt, user.LastLoginAt, user.IsSuspended }).ToListAsync();
            static string Escape(string? value) => $"\"{(value ?? string.Empty).Replace("\"", "\"\"")}\"";
            var csv = new StringBuilder("Username,Họ tên,Email,Vai trò,Ngày tạo,Đăng nhập gần nhất,Đang khóa\r\n");
            foreach (var row in rows) csv.AppendJoin(',', Escape(row.UserName), Escape(row.FullName), Escape(row.Email), Escape(row.Role), Escape(row.CreatedAt.ToString("O")), Escape(row.LastLoginAt?.ToString("O")), row.IsSuspended).Append("\r\n");
            return Results.File(Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(csv.ToString())).ToArray(), "text/csv; charset=utf-8", "thanh-vien.csv");
        });

        admin.MapGet("/reviews", (ApplicationDbContext db, int page = 1, int pageSize = 20) => GetReviewQueue(db, page, pageSize));
        admin.MapPost("/recipes/{id:guid}/review", (Guid id, RecipeReviewRequest request, HttpContext context, ApplicationDbContext db) => ReviewRecipe(id, request, context, db));
        admin.MapPost("/recipes/{id:guid}/moderate", (Guid id, ModerationRequest request, HttpContext context, ApplicationDbContext db) => ModerateRecipe(id, request, context, db));
        admin.MapPost("/posts/{id:guid}/moderate", (Guid id, ModerationRequest request, HttpContext context, ApplicationDbContext db) => ModeratePost(id, request, context, db));

        admin.MapGet("/categories", (ApplicationDbContext db) => GetCategories(db));
        admin.MapPut("/categories/{id:guid}/visibility", (Guid id, CategoryVisibilityRequest request, HttpContext context, ApplicationDbContext db, [FromServices] ICacheService cache) => SetCategoryVisibility(id, request, context, db, cache));
        admin.MapPost("/categories/{id:guid}/recipes/move", (Guid id, CategoryMoveRequest request, HttpContext context, ApplicationDbContext db) => MoveCategoryRecipes(id, request, context, db));

        admin.MapGet("/analytics", (ApplicationDbContext db, int days = 30) => GetAnalytics(db, days));
        admin.MapGet("/media/summary", (ApplicationDbContext db, [FromServices] IFileStorageService storage) => GetMediaSummary(db, storage));
        admin.MapPost("/media/cleanup", ([FromServices] StorageMaintenanceJob job, HttpContext context, ApplicationDbContext db) => CleanupMedia(job, context, db));
        admin.MapGet("/system-status", (ApplicationDbContext db, IServiceProvider services, [FromServices] IFileStorageService storage) => GetSystemStatus(db, services, storage));
    }

    private static async Task<ApiResponseResult> SetSuspension(string id, AdminSuspensionRequest request, HttpContext context, ApplicationDbContext db)
    {
        var target = await db.Users.FirstOrDefaultAsync(user => user.Id == id);
        if (target is null) return new ApiResponseResult(404, new { message = "Không tìm thấy thành viên." });
        var actorId = ActorId(context);
        if (target.Id == actorId) return new ApiResponseResult(400, new { message = "Bạn không thể tự khóa tài khoản quản trị của mình." });
        if (request.Suspended)
        {
            if (string.IsNullOrWhiteSpace(request.Reason)) return new ApiResponseResult(400, new { message = "Cần ghi lý do khóa tài khoản." });
            target.IsSuspended = true;
            target.SuspendedUntil = request.Until?.ToUniversalTime();
            target.SuspensionReason = request.Reason.Trim();
            var tokens = await db.RefreshTokens.Where(token => token.UserId == target.Id && !token.IsRevoked).ToListAsync();
            tokens.ForEach(token => token.Revoke());
        }
        else { target.IsSuspended = false; target.SuspendedUntil = null; target.SuspensionReason = null; }
        await db.SaveChangesAsync();
        await Audit(db, actorId, request.Suspended ? "user.suspended" : "user.restored", "user", target.Id, request.Suspended ? $"Khóa {target.UserName}: {target.SuspensionReason}" : $"Mở khóa {target.UserName}.");
        return new ApiResponseResult(200, new { target.Id, target.IsSuspended, target.SuspendedUntil, target.SuspensionReason });
    }

    private static async Task<ApiResponseResult> RevokeUserSessions(string id, HttpContext context, ApplicationDbContext db)
    {
        if (!await db.Users.AnyAsync(user => user.Id == id)) return new ApiResponseResult(404, new { message = "Không tìm thấy thành viên." });
        var tokens = await db.RefreshTokens.Where(token => token.UserId == id && !token.IsRevoked).ToListAsync();
        tokens.ForEach(token => token.Revoke());
        await db.SaveChangesAsync();
        await Audit(db, ActorId(context), "user.sessions.revoked", "user", id, $"Thu hồi {tokens.Count} phiên làm mới token.");
        return new ApiResponseResult(200, new { revokedSessions = tokens.Count });
    }

    private static async Task<ApiResponseResult> GetUserDetail(string id, ApplicationDbContext db)
    {
        var user = await db.Users.AsNoTracking().FirstOrDefaultAsync(item => item.Id == id);
        if (user is null) return new ApiResponseResult(404, new { message = "Không tìm thấy thành viên." });

        var recipes = db.Recipes.AsNoTracking().Where(recipe => recipe.AuthorId == id && !recipe.IsDeleted);
        var posts = db.CommunityPosts.AsNoTracking().Where(post => post.AuthorId == id);
        return new ApiResponseResult(200, new
        {
            profile = new { user.Id, user.UserName, user.FullName, user.Email, user.EmailConfirmed, user.Role, user.AvatarUrl, user.Bio, user.BirthDate, user.CreatedAt, user.IsSuspended, user.SuspendedUntil, user.SuspensionReason, user.LastLoginAt, user.LastLoginIp, user.LastLoginUserAgent, twoFactorEnabled = !string.IsNullOrWhiteSpace(user.TwoFactorSecretProtected) },
            statistics = new
            {
                recipes = await recipes.CountAsync(),
                publishedRecipes = await recipes.CountAsync(recipe => recipe.Status == RecipeStatus.Published),
                draftRecipes = await recipes.CountAsync(recipe => recipe.Status == RecipeStatus.Draft),
                archivedRecipes = await recipes.CountAsync(recipe => recipe.Status == RecipeStatus.Archived),
                posts = await posts.CountAsync(),
                comments = await db.PostComments.CountAsync(comment => comment.AuthorId == id),
                articles = await db.BlogArticles.CountAsync(article => article.AuthorId == id),
                reportsSubmitted = await db.ContentReports.CountAsync(report => report.ReporterId == id),
                activeSessions = await db.RefreshTokens.CountAsync(token => token.UserId == id && !token.IsRevoked && token.ExpiresAt > DateTime.UtcNow)
            },
            recentRecipes = await recipes.OrderByDescending(recipe => recipe.UpdatedAt).Take(6).Select(recipe => new { recipe.Id, recipe.Title, recipe.Status, recipe.UpdatedAt, categoryName = recipe.Category.Name }).ToListAsync(),
            recentPosts = await posts.OrderByDescending(post => post.CreatedAt).Take(6).Select(post => new { post.Id, post.Content, post.CreatedAt, post.IsHidden, post.IsDraft, post.CommentsEnabled }).ToListAsync(),
            recentActivity = await db.UserActivityLogs.AsNoTracking().Where(activity => activity.UserId == id).OrderByDescending(activity => activity.CreatedAt).Take(12).Select(activity => new { activity.Id, activity.ActivityType, activity.Description, activity.CreatedAt, activity.IpAddress, activity.UserAgent }).ToListAsync()
        });
    }

    private static async Task<ApiResponseResult> GetRecipeDetail(Guid id, ApplicationDbContext db)
    {
        var recipe = await db.Recipes.AsNoTracking()
            .Include(item => item.Category).Include(item => item.Author).Include(item => item.Images)
            .FirstOrDefaultAsync(item => item.Id == id && !item.IsDeleted);
        if (recipe is null) return new ApiResponseResult(404, new { message = "Không tìm thấy công thức." });

        var reviews = db.RecipeReviews.AsNoTracking().Where(review => review.RecipeId == id);
        return new ApiResponseResult(200, new
        {
            recipe = new
            {
                recipe.Id, recipe.Title, recipe.Slug, recipe.Description, recipe.ImageUrl, recipe.Status, recipe.ReviewStatus, recipe.ReviewNote,
                recipe.ReviewRequestedAt, recipe.ReviewedAt, recipe.CreatedAt, recipe.UpdatedAt, recipe.PrepTimeMinutes, recipe.CookTimeMinutes,
                recipe.CookingTimeMinutes, recipe.Servings, recipe.Difficulty, recipe.IsVegetarian, recipe.Ingredients, recipe.Instructions,
                category = new { recipe.Category.Id, recipe.Category.Name, recipe.Category.Slug },
                author = new { recipe.Author.Id, recipe.Author.UserName, recipe.Author.FullName, recipe.Author.Email, recipe.Author.AvatarUrl },
                nutrition = recipe.Nutrition == null ? null : new { recipe.Nutrition.Calories, recipe.Nutrition.Protein, recipe.Nutrition.Carbohydrates, recipe.Nutrition.Fat, recipe.Nutrition.Fiber, recipe.Nutrition.Sodium },
                images = recipe.Images.OrderByDescending(image => image.IsPrimary).ThenBy(image => image.CreatedAt).Select(image => new { image.Id, image.Url, image.ThumbnailUrl, image.MediumUrl, image.IsPrimary, image.CreatedAt })
            },
            engagement = new { views = await db.RecipeViews.CountAsync(view => view.RecipeId == id), bookmarks = await db.RecipeBookmarks.CountAsync(bookmark => bookmark.RecipeId == id), reviewCount = await reviews.CountAsync(), averageRating = await reviews.Select(review => (double?)review.Rating).AverageAsync() ?? 0 },
            recentReviews = await reviews.OrderByDescending(review => review.UpdatedAt).Take(12).Select(review => new { review.Id, review.Rating, review.Content, review.IsCooked, review.CreatedAt, review.UpdatedAt, reviewer = review.User.FullName }).ToListAsync(),
            reports = await db.ContentReports.AsNoTracking().Where(report => report.TargetType == "Recipe" && report.TargetId == id.ToString()).OrderByDescending(report => report.CreatedAt).Take(12).Select(report => new { report.Id, report.Reason, report.CreatedAt, report.ResolvedAt, report.ResolutionAction, report.ResolutionNote, reporter = report.Reporter.FullName }).ToListAsync()
        });
    }

    private static async Task<ApiResponseResult> UpdateUserProfile(string id, AdminUserProfileRequest request, HttpContext context, ApplicationDbContext db)
    {
        var target = await db.Users.FirstOrDefaultAsync(user => user.Id == id);
        if (target is null) return new ApiResponseResult(404, new { message = "Không tìm thấy thành viên." });
        var fullName = request.FullName?.Trim() ?? string.Empty;
        var email = request.Email?.Trim() ?? string.Empty;
        if (fullName.Length is < 2 or > 120) return new ApiResponseResult(400, new { message = "Họ tên cần có từ 2 đến 120 ký tự." });
        if (!new System.ComponentModel.DataAnnotations.EmailAddressAttribute().IsValid(email)) return new ApiResponseResult(400, new { message = "Email không hợp lệ." });
        if (await db.Users.AnyAsync(user => user.Id != id && user.NormalizedEmail == email.ToUpperInvariant())) return new ApiResponseResult(400, new { message = "Email này đã được dùng bởi thành viên khác." });
        if (request.Bio?.Length > 500) return new ApiResponseResult(400, new { message = "Giới thiệu tối đa 500 ký tự." });
        if (request.AvatarUrl?.Length > 2000) return new ApiResponseResult(400, new { message = "Đường dẫn ảnh đại diện không hợp lệ." });

        target.FullName = fullName;
        target.Email = email;
        target.NormalizedEmail = email.ToUpperInvariant();
        target.EmailConfirmed = request.EmailConfirmed;
        target.Bio = string.IsNullOrWhiteSpace(request.Bio) ? null : request.Bio.Trim();
        target.AvatarUrl = string.IsNullOrWhiteSpace(request.AvatarUrl) ? null : request.AvatarUrl.Trim();
        target.BirthDate = request.BirthDate?.Date;
        await db.SaveChangesAsync();
        await Audit(db, ActorId(context), "user.profile.updated", "user", target.Id, $"Cập nhật hồ sơ của {target.UserName}.");
        AddNotification(db, target.Id, ActorId(context), "user.profile.updated", "Hồ sơ của bạn vừa được quản trị viên cập nhật.", "/account");
        await db.SaveChangesAsync();
        return new ApiResponseResult(200, new { target.Id, target.FullName, target.Email, target.EmailConfirmed, target.Bio, target.AvatarUrl, target.BirthDate });
    }

    private static async Task<ApiResponseResult> ResetUserPassword(string id, AdminPasswordResetRequest request, HttpContext context, ApplicationDbContext db)
    {
        var target = await db.Users.FirstOrDefaultAsync(user => user.Id == id);
        if (target is null) return new ApiResponseResult(404, new { message = "Không tìm thấy thành viên." });
        var actorId = ActorId(context);
        if (target.Id == actorId) return new ApiResponseResult(400, new { message = "Hãy đổi mật khẩu của chính bạn trong phần Bảo mật tài khoản." });
        var password = request.TemporaryPassword ?? string.Empty;
        if (!IsStrongPassword(password)) return new ApiResponseResult(400, new { message = "Mật khẩu tạm cần tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt." });
        if (!string.Equals(password, request.ConfirmTemporaryPassword, StringComparison.Ordinal)) return new ApiResponseResult(400, new { message = "Xác nhận mật khẩu tạm không khớp." });

        target.PasswordHash = new PasswordHasher<ApplicationUser>().HashPassword(target, password);
        target.SecurityStamp = Guid.NewGuid().ToString("N");
        var tokens = await db.RefreshTokens.Where(token => token.UserId == target.Id && !token.IsRevoked).ToListAsync();
        tokens.ForEach(token => token.Revoke());
        await db.SaveChangesAsync();
        await Audit(db, actorId, "user.password.reset", "user", target.Id, $"Đặt lại mật khẩu tạm và thu hồi {tokens.Count} phiên của {target.UserName}.");
        AddNotification(db, target.Id, actorId, "user.password.reset", "Mật khẩu tài khoản đã được quản trị viên đặt lại. Hãy đổi mật khẩu ngay sau khi đăng nhập.", "/security");
        await db.SaveChangesAsync();
        return new ApiResponseResult(200, new { passwordChanged = true, revokedSessions = tokens.Count });
    }

    private static bool IsStrongPassword(string password) => password.Length >= 8 && password.Any(char.IsUpper) && password.Any(char.IsLower) && password.Any(char.IsDigit) && password.Any(character => !char.IsLetterOrDigit(character));

    private static async Task<ApiResponseResult> ResolveReport(Guid id, AdminReportResolutionRequest? request, HttpContext context, ApplicationDbContext db)
    {
        var report = await db.ContentReports.FirstOrDefaultAsync(item => item.Id == id);
        if (report is null) return new ApiResponseResult(404);
        var action = string.IsNullOrWhiteSpace(request?.Action) ? "reviewed" : request!.Action!.Trim().ToLowerInvariant();
        var note = request?.Note?.Trim();
        var success = await ApplyReportAction(db, report, action, note);
        if (!success) return new ApiResponseResult(400, new { message = "Hành động không phù hợp với đối tượng được báo cáo." });
        report.ResolvedAt = DateTime.UtcNow;
        report.ResolvedById = ActorId(context);
        report.ResolutionAction = action;
        report.ResolutionNote = note;
        AddNotification(db, report.ReporterId, report.ResolvedById, "report.resolved", $"Báo cáo của bạn đã được quản trị viên xử lý: {action}.", "/notifications");
        await db.SaveChangesAsync();
        await Audit(db, report.ResolvedById, "report.resolved", "report", report.Id.ToString(), $"{report.TargetType}/{report.TargetId}: {action}. {note}".Trim());
        return new ApiResponseResult(200, new { report.Id, report.ResolvedAt, report.ResolutionAction, report.ResolutionNote });
    }

    private static async Task<ApiResponseResult> ReviewRecipe(Guid id, RecipeReviewRequest request, HttpContext context, ApplicationDbContext db)
    {
        var recipe = await db.Recipes.FirstOrDefaultAsync(item => item.Id == id && !item.IsDeleted);
        if (recipe is null) return new ApiResponseResult(404, new { message = "Không tìm thấy công thức." });
        var actorId = ActorId(context);
        try { recipe.CompleteReview(request.Decision?.Trim() ?? string.Empty, request.Note, actorId); }
        catch (Exception exception) { return new ApiResponseResult(400, new { message = exception.Message }); }
        var reviewMessage = recipe.ReviewStatus == "Approved"
            ? $"Công thức “{recipe.Title}” đã được duyệt và sẵn sàng xuất bản."
            : $"Công thức “{recipe.Title}” cần chỉnh sửa. {recipe.ReviewNote}";
        AddNotification(db, recipe.AuthorId, actorId, recipe.ReviewStatus == "Approved" ? "recipe.approved" : "recipe.changes_requested", reviewMessage, $"/recipes/{recipe.Id}");
        await db.SaveChangesAsync();
        await Audit(db, actorId, "recipe.reviewed", "recipe", recipe.Id.ToString(), $"{recipe.Title}: {recipe.ReviewStatus}. {recipe.ReviewNote}".Trim());
        return new ApiResponseResult(200, new { recipe.Id, recipe.ReviewStatus, recipe.ReviewNote, recipe.ReviewedAt });
    }

    private static async Task<ApiResponseResult> ModerateRecipe(Guid id, ModerationRequest request, HttpContext context, ApplicationDbContext db)
    {
        var recipe = await db.Recipes.FirstOrDefaultAsync(item => item.Id == id && !item.IsDeleted);
        if (recipe is null) return new ApiResponseResult(404, new { message = "Không tìm thấy công thức." });
        var action = request.Action?.Trim().ToLowerInvariant();
        var actorId = ActorId(context);
        try
        {
            switch (action) { case "archive": recipe.Archive(); break; case "restore": recipe.RestoreToDraft(); break; case "delete": recipe.SoftDelete(); break; default: return new ApiResponseResult(400, new { message = "Hành động công thức không hợp lệ." }); }
        }
        catch (Exception exception) { return new ApiResponseResult(400, new { message = exception.Message }); }
        var actionLabel = action switch { "archive" => "đã bị lưu trữ", "restore" => "đã được khôi phục về bản nháp", "delete" => "đã bị xóa mềm", _ => "đã được cập nhật" };
        AddNotification(db, recipe.AuthorId, actorId, $"recipe.{action}", $"Công thức “{recipe.Title}” {actionLabel}. {request.Note}".Trim(), "/recipes");
        await db.SaveChangesAsync();
        await Audit(db, actorId, $"recipe.{action}", "recipe", recipe.Id.ToString(), $"{recipe.Title}. {request.Note}".Trim());
        return new ApiResponseResult(200, new { recipe.Id, recipe.Status, recipe.IsDeleted });
    }

    private static async Task<ApiResponseResult> ModeratePost(Guid id, ModerationRequest request, HttpContext context, ApplicationDbContext db)
    {
        var post = await db.CommunityPosts.FirstOrDefaultAsync(item => item.Id == id);
        if (post is null) return new ApiResponseResult(404, new { message = "Không tìm thấy bài đăng." });
        var action = request.Action?.Trim().ToLowerInvariant();
        switch (action)
        {
            case "hide": post.IsHidden = true; post.HiddenAt = DateTime.UtcNow; post.HiddenReason = request.Note?.Trim(); break;
            case "show": post.IsHidden = false; post.HiddenAt = null; post.HiddenReason = null; break;
            case "lock-comments": post.CommentsEnabled = false; break;
            case "unlock-comments": post.CommentsEnabled = true; break;
            case "delete": db.CommunityPosts.Remove(post); break;
            default: return new ApiResponseResult(400, new { message = "Hành động bài đăng không hợp lệ." });
        }
        AddNotification(db, post.AuthorId, ActorId(context), $"post.{action}", $"Bài đăng cộng đồng của bạn đã được quản trị viên xử lý: {action}.", "/community");
        await db.SaveChangesAsync();
        await Audit(db, ActorId(context), $"post.{action}", "post", id.ToString(), request.Note?.Trim() ?? post.Content[..Math.Min(post.Content.Length, 120)]);
        return new ApiResponseResult(200, new { id, action, post.IsHidden, post.CommentsEnabled });
    }

    private static async Task<ApiResponseResult> GetCategories(ApplicationDbContext db)
    {
        var items = await db.Categories.AsNoTracking().Where(category => !category.IsDeleted).OrderBy(category => category.DisplayOrder).ThenBy(category => category.Name)
            .Select(category => new { category.Id, category.Name, category.Slug, category.IsVisible, category.DisplayOrder, category.ImageUrl, recipeCount = category.Recipes.Count(recipe => !recipe.IsDeleted), publishedRecipeCount = category.Recipes.Count(recipe => !recipe.IsDeleted && recipe.Status == RecipeStatus.Published) }).ToListAsync();
        return new ApiResponseResult(200, new { items });
    }

    private static async Task<ApiResponseResult> SetCategoryVisibility(Guid id, CategoryVisibilityRequest request, HttpContext context, ApplicationDbContext db, ICacheService cache)
    {
        var category = await db.Categories.FirstOrDefaultAsync(item => item.Id == id && !item.IsDeleted);
        if (category is null) return new ApiResponseResult(404, new { message = "Không tìm thấy danh mục." });
        category.IsVisible = request.IsVisible;
        if (request.DisplayOrder.HasValue) category.DisplayOrder = request.DisplayOrder.Value;
        category.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        await cache.RemoveAsync(CacheKeys.Categories);
        await Audit(db, ActorId(context), category.IsVisible ? "category.shown" : "category.hidden", "category", id.ToString(), category.Name);
        return new ApiResponseResult(200, new { category.Id, category.IsVisible, category.DisplayOrder });
    }

    private static async Task<ApiResponseResult> MoveCategoryRecipes(Guid id, CategoryMoveRequest request, HttpContext context, ApplicationDbContext db)
    {
        if (id == request.TargetCategoryId) return new ApiResponseResult(400, new { message = "Danh mục đích phải khác danh mục nguồn." });
        if (!await db.Categories.AnyAsync(category => category.Id == request.TargetCategoryId && !category.IsDeleted)) return new ApiResponseResult(400, new { message = "Danh mục đích không hợp lệ." });
        var recipes = db.Recipes.Where(recipe => recipe.CategoryId == id && !recipe.IsDeleted);
        if (request.RecipeIds is { Count: > 0 }) recipes = recipes.Where(recipe => request.RecipeIds.Contains(recipe.Id));
        var moved = await recipes.ExecuteUpdateAsync(setters => setters.SetProperty(recipe => recipe.CategoryId, request.TargetCategoryId).SetProperty(recipe => recipe.UpdatedAt, DateTime.UtcNow));
        await Audit(db, ActorId(context), "category.recipes.moved", "category", id.ToString(), $"Chuyển {moved} công thức sang {request.TargetCategoryId}.");
        return new ApiResponseResult(200, new { moved });
    }

    private static async Task<ApiResponseResult> GetAuditLogs(ApplicationDbContext db, int page, int pageSize)
    {
        page = Math.Max(1, page); pageSize = Math.Clamp(pageSize, 1, 100);
        var query = db.AdminAuditLogs.AsNoTracking();
        return new ApiResponseResult(200, new { items = await query.OrderByDescending(log => log.CreatedAt).Skip((page - 1) * pageSize).Take(pageSize).Select(log => new { log.Id, log.Action, log.TargetType, log.TargetId, log.Summary, log.CreatedAt, actorName = log.Actor.FullName, actorUsername = log.Actor.UserName }).ToListAsync(), page, pageSize, total = await query.CountAsync() });
    }

    private static async Task<ApiResponseResult> GetReviewQueue(ApplicationDbContext db, int page, int pageSize)
    {
        page = Math.Max(1, page); pageSize = Math.Clamp(pageSize, 1, 100);
        var query = db.Recipes.AsNoTracking().Where(recipe => !recipe.IsDeleted && recipe.ReviewStatus == "PendingReview");
        return new ApiResponseResult(200, new { items = await query.OrderBy(recipe => recipe.ReviewRequestedAt).Skip((page - 1) * pageSize).Take(pageSize).Select(recipe => new { recipe.Id, recipe.Title, recipe.AuthorId, authorName = recipe.Author.FullName, recipe.ReviewRequestedAt, recipe.Description, categoryName = recipe.Category.Name }).ToListAsync(), page, pageSize, total = await query.CountAsync() });
    }

    private static async Task<ApiResponseResult> GetAnalytics(ApplicationDbContext db, int days)
    {
        days = Math.Clamp(days, 7, 90); var from = DateTime.UtcNow.Date.AddDays(1 - days);
        var categories = await db.Categories.AsNoTracking().Where(category => !category.IsDeleted).OrderByDescending(category => category.Recipes.Count(recipe => !recipe.IsDeleted && recipe.Status == RecipeStatus.Published)).Take(8).Select(category => new { category.Id, category.Name, recipeCount = category.Recipes.Count(recipe => !recipe.IsDeleted && recipe.Status == RecipeStatus.Published) }).ToListAsync();
        var recipes = await db.Recipes.AsNoTracking().Where(recipe => !recipe.IsDeleted && recipe.Status == RecipeStatus.Published).OrderByDescending(recipe => db.RecipeViews.Count(view => view.RecipeId == recipe.Id)).ThenByDescending(recipe => recipe.UpdatedAt).Take(8).Select(recipe => new { recipe.Id, recipe.Title, recipe.Slug, categoryName = recipe.Category.Name, viewCount = db.RecipeViews.Count(view => view.RecipeId == recipe.Id) }).ToListAsync();
        return new ApiResponseResult(200, new { days, from, members = await db.Users.CountAsync(user => user.CreatedAt >= from), recipesCreated = await db.Recipes.CountAsync(recipe => !recipe.IsDeleted && recipe.CreatedAt >= from), posts = await db.CommunityPosts.CountAsync(post => post.CreatedAt >= from), reports = await db.ContentReports.CountAsync(report => report.CreatedAt >= from), resolvedReports = await db.ContentReports.CountAsync(report => report.ResolvedAt != null && report.ResolvedAt >= from), categoryLeaderboard = categories, recipeLeaderboard = recipes });
    }

    private static async Task<ApiResponseResult> GetMediaSummary(ApplicationDbContext db, IFileStorageService storage)
    {
        var groups = new List<StorageGroup>();
        var storageAvailable = true;
        foreach (var prefix in new[] { "recipes/", "community/", "avatars/", "categories/", "articles/" })
        {
            try
            {
                var objects = await storage.ListObjectsAsync(prefix);
                groups.Add(new StorageGroup(prefix.TrimEnd('/'), objects.Count, objects.Sum(item => item.SizeBytes)));
            }
            catch
            {
                storageAvailable = false;
                groups.Add(new StorageGroup(prefix.TrimEnd('/'), 0, 0));
            }
        }
        return new ApiResponseResult(200, new { groups, storageAvailable, totalBytes = groups.Sum(group => group.Bytes), recipeImageRecords = await db.RecipeImages.CountAsync() });
    }

    private static async Task<ApiResponseResult> CleanupMedia(StorageMaintenanceJob job, HttpContext context, ApplicationDbContext db)
    {
        var summary = await job.InspectAndReportAsync(removeOrphans: true);
        await Audit(db, ActorId(context), "storage.orphans.cleaned", "storage", "all", $"Đã xóa {summary.OrphanCount} tệp không còn liên kết.");
        return new ApiResponseResult(200, summary);
    }

    private static async Task<ApiResponseResult> GetSystemStatus(ApplicationDbContext db, IServiceProvider services, IFileStorageService storage)
    {
        var database = await db.Database.CanConnectAsync(); var cache = services.GetService<IConnectionMultiplexer>(); var storageAvailable = true;
        try { await storage.ListKeysAsync("recipes/"); } catch { storageAvailable = false; }
        return new ApiResponseResult(200, new { api = new { status = "Healthy", utc = DateTime.UtcNow }, database = new { status = database ? "Healthy" : "Unhealthy" }, cache = new { status = cache is null ? "Disabled" : cache.IsConnected ? "Healthy" : "Unhealthy" }, storage = new { status = storageAvailable ? "Healthy" : "Unhealthy" }, jobs = new { dashboardUrl = "/hangfire", storageMaintenance = "weekly", sitemapGeneration = "daily" } });
    }

    private static async Task<bool> ApplyReportAction(ApplicationDbContext db, ContentReport report, string action, string? note)
    {
        if (action == "reviewed") return true;
        if (report.TargetType == "post" && Guid.TryParse(report.TargetId, out var postId)) { var post = await db.CommunityPosts.FindAsync(postId); if (post is null) return false; if (action == "hide") { post.IsHidden = true; post.HiddenAt = DateTime.UtcNow; post.HiddenReason = note; return true; } if (action == "lock-comments") { post.CommentsEnabled = false; return true; } if (action == "delete") { db.CommunityPosts.Remove(post); return true; } }
        if (report.TargetType == "recipe" && Guid.TryParse(report.TargetId, out var recipeId)) { var recipe = await db.Recipes.FindAsync(recipeId); if (recipe is null) return false; if (action == "hide") { recipe.Archive(); return true; } if (action == "delete") { recipe.SoftDelete(); return true; } }
        if (report.TargetType == "user") { var user = await db.Users.FindAsync(report.TargetId); if (user is null) return false; if (action == "suspend") { user.IsSuspended = true; user.SuspensionReason = note ?? "Bị khóa sau khi kiểm duyệt báo cáo."; user.SuspendedUntil = null; return true; } }
        return false;
    }

    private static async Task Audit(ApplicationDbContext db, string actorId, string action, string targetType, string targetId, string summary)
    {
        db.AdminAuditLogs.Add(new AdminAuditLog { ActorId = actorId, Action = action, TargetType = targetType, TargetId = targetId, Summary = string.IsNullOrWhiteSpace(summary) ? action : summary[..Math.Min(summary.Length, 1000)] });
        await db.SaveChangesAsync();
    }

    private static void AddNotification(ApplicationDbContext db, string recipientId, string actorId, string type, string message, string? targetUrl)
    {
        if (string.IsNullOrWhiteSpace(recipientId) || string.IsNullOrWhiteSpace(actorId) || recipientId == actorId || actorId == "system") return;
        db.AppNotifications.Add(new AppNotification
        {
            UserId = recipientId,
            ActorId = actorId,
            Type = type,
            Message = message[..Math.Min(message.Length, 1000)],
            TargetUrl = targetUrl
        });
    }

    private static string ActorId(HttpContext context) => context.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system";
}

public sealed record AdminRoleRequest(string? Role);
public sealed record AdminSuspensionRequest(bool Suspended, DateTime? Until, string? Reason);
public sealed record AdminUserProfileRequest(string? FullName, string? Email, bool EmailConfirmed, string? Bio, string? AvatarUrl, DateTime? BirthDate);
public sealed record AdminPasswordResetRequest(string? TemporaryPassword, string? ConfirmTemporaryPassword);
public sealed record InternalNoteRequest(string? TargetType, string? TargetId, string? Note);
public sealed record AdminReportResolutionRequest(string? Action, string? Note);
public sealed record RecipeReviewRequest(string? Decision, string? Note);
public sealed record ModerationRequest(string? Action, string? Note);
public sealed record CategoryVisibilityRequest(bool IsVisible, int? DisplayOrder);
public sealed record CategoryMoveRequest(Guid TargetCategoryId, List<Guid>? RecipeIds);
public sealed record StorageGroup(string Prefix, int FileCount, long Bytes);
