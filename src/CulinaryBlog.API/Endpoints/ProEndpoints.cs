using System.Security.Claims;
using System.Text;
using System.Text.Json;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.API.Endpoints;

/// <summary>
/// Additive endpoints for the professional experience. They deliberately live
/// under /pro so the established recipe, account and admin contracts remain stable.
/// </summary>
public static class ProEndpoints
{
    public static void MapPro(this IEndpointRouteBuilder app)
    {
        var discovery = app.MapGroup("/api/v1/pro").WithTags("Pro experience");
        discovery.MapGet("/discovery", Discovery).AllowAnonymous();
        discovery.MapGet("/suggestions", Suggestions).AllowAnonymous();
        discovery.MapGet("/recipes/{id:guid}/related", Related).AllowAnonymous();
        discovery.MapGet("/recipes/compare", Compare).AllowAnonymous();
        discovery.MapGet("/recipes/{id:guid}/allergens", Allergens).AllowAnonymous();
        discovery.MapGet("/history", History).RequireAuthorization();
        discovery.MapGet("/preferences", Preferences).RequireAuthorization();
        discovery.MapPut("/preferences", SavePreferences).RequireAuthorization();
        discovery.MapGet("/profile-insights", ProfileInsights).RequireAuthorization();
        discovery.MapGet("/recipes/{id:guid}/revisions", Revisions).RequireAuthorization();
        discovery.MapPost("/recipes/{id:guid}/revisions/{revisionId:guid}/restore", RestoreRevision).RequireAuthorization();

        var admin = app.MapGroup("/api/v1/pro/admin").WithTags("Pro administration")
            .RequireAuthorization(policy => policy.RequireRole("Admin"));
        admin.MapGet("/permissions", () => new ApiResponseResult(200, new
        {
            roles = new[]
            {
                new { key = "Moderator", label = "Moderator", capabilities = new[] { "Xem/xử lý báo cáo", "Ẩn bài viết", "Khóa bình luận" } },
                new { key = "ContentManager", label = "Content Manager", capabilities = new[] { "Duyệt công thức", "Quản lý danh mục", "Dùng mẫu phản hồi" } },
                new { key = "SystemAdmin", label = "System Admin", capabilities = new[] { "Quản lý thành viên", "Xuất CSV", "Theo dõi cảnh báo hệ thống" } },
                new { key = "Admin", label = "Admin", capabilities = new[] { "Toàn quyền quản trị" } }
            }
        }));
        admin.MapPost("/preview-role", (RolePreviewRequest request) => new ApiResponseResult(200, new
        {
            role = request.Role?.Trim(),
            message = "Chế độ xem trước chỉ thay đổi giao diện trong phiên hiện tại; không thay đổi tài khoản hay quyền thật.",
            navigation = request.Role switch
            {
                "Moderator" => new[] { "Báo cáo", "Bảng tin", "Hàng đợi ưu tiên" },
                "ContentManager" => new[] { "Chờ duyệt", "Công thức", "Danh mục" },
                "SystemAdmin" => new[] { "Thành viên", "Cảnh báo", "Xuất báo cáo" },
                _ => new[] { "Trang chủ", "Công thức", "Hồ sơ" }
            }
        }));
        admin.MapGet("/exports/{kind}.csv", ExportCsv);
    }

    private static async Task<ApiResponseResult> Discovery(ApplicationDbContext db)
    {
        var recipes = await db.Recipes.AsNoTracking().Include(recipe => recipe.Category)
            .Where(recipe => !recipe.IsDeleted && recipe.Status == RecipeStatus.Published)
            .OrderByDescending(recipe => recipe.UpdatedAt).Take(120).ToListAsync();
        var recipeIds = recipes.Select(recipe => recipe.Id).ToList();
        var ingredients = await db.RecipeIngredients.AsNoTracking().Where(item => recipeIds.Contains(item.RecipeId))
            .Select(item => new { item.RecipeId, item.Name }).ToListAsync();
        var views = await db.RecipeViews.AsNoTracking().Where(view => recipeIds.Contains(view.RecipeId))
            .GroupBy(view => view.RecipeId).Select(group => new { recipeId = group.Key, count = group.Count() }).ToListAsync();
        var viewCounts = views.ToDictionary(item => item.recipeId, item => item.count);
        var topIngredients = ingredients.Select(item => IngredientKey(item.Name)).Where(item => item.Length > 1)
            .GroupBy(item => item).OrderByDescending(group => group.Count()).ThenBy(group => group.Key).Take(12)
            .Select(group => new { name = group.Key, recipeCount = group.Count() }).ToList();
        var trends = recipes.OrderByDescending(recipe => viewCounts.GetValueOrDefault(recipe.Id))
            .ThenByDescending(recipe => recipe.UpdatedAt).Take(6)
            .Select(recipe => new { recipe.Id, recipe.Title, recipe.Slug, recipe.ImageUrl, category = recipe.Category.Name, views = viewCounts.GetValueOrDefault(recipe.Id), recipe.Difficulty, recipe.CookingTimeMinutes }).ToList();
        var categories = await db.Categories.AsNoTracking().Where(category => !category.IsDeleted && category.IsVisible)
            .OrderBy(category => category.DisplayOrder).ThenBy(category => category.Name)
            .Select(category => new { category.Id, category.Name, category.Slug, category.Description, category.ImageUrl, recipeCount = category.Recipes.Count(recipe => !recipe.IsDeleted && recipe.Status == RecipeStatus.Published) }).ToListAsync();
        return new ApiResponseResult(200, new { categories, topIngredients, trends, regions = new[]
        {
            new { region = "Bắc", examples = new[] { "Phở", "Bún chả", "Chả cá" } },
            new { region = "Trung", examples = new[] { "Bún bò", "Mì Quảng", "Cơm hến" } },
            new { region = "Nam", examples = new[] { "Cơm tấm", "Hủ tiếu", "Bánh xèo" } }
        }});
    }

    private static async Task<ApiResponseResult> Suggestions(ApplicationDbContext db, string? q = null)
    {
        var term = (q ?? string.Empty).Trim().ToLowerInvariant();
        if (term.Length < 1) return new ApiResponseResult(200, new { items = Array.Empty<object>() });
        var recipes = await db.Recipes.AsNoTracking().Where(recipe => !recipe.IsDeleted && recipe.Status == RecipeStatus.Published && recipe.Title.ToLower().Contains(term))
            .OrderByDescending(recipe => recipe.UpdatedAt).Take(6).Select(recipe => new { type = "recipe", label = recipe.Title, value = recipe.Slug, detail = recipe.Category.Name }).ToListAsync();
        var categories = await db.Categories.AsNoTracking().Where(category => !category.IsDeleted && category.IsVisible && category.Name.ToLower().Contains(term))
            .Take(4).Select(category => new { type = "category", label = category.Name, value = category.Slug, detail = category.Description }).ToListAsync();
        var ingredients = await db.RecipeIngredients.AsNoTracking().Where(item => item.Name.ToLower().Contains(term)).Select(item => item.Name).Take(30).ToListAsync();
        var ingredientItems = ingredients.Select(IngredientKey).Distinct(StringComparer.OrdinalIgnoreCase).Take(6)
            .Select(name => new { type = "ingredient", label = name, value = name, detail = "Tìm công thức chứa nguyên liệu này" });
        return new ApiResponseResult(200, new { items = recipes.Cast<object>().Concat(categories).Concat(ingredientItems).ToList() });
    }

    private static async Task<ApiResponseResult> Related(Guid id, ApplicationDbContext db)
    {
        var recipe = await db.Recipes.AsNoTracking().FirstOrDefaultAsync(item => item.Id == id && !item.IsDeleted && item.Status == RecipeStatus.Published);
        if (recipe is null) return new ApiResponseResult(404, new { message = "Không tìm thấy công thức." });
        var sourceIngredients = await IngredientNames(db, id);
        var candidates = await db.Recipes.AsNoTracking().Include(item => item.Category)
            .Where(item => item.Id != id && !item.IsDeleted && item.Status == RecipeStatus.Published).Take(80).ToListAsync();
        var candidateIds = candidates.Select(item => item.Id).ToList();
        var rawIngredients = await db.RecipeIngredients.AsNoTracking().Where(item => candidateIds.Contains(item.RecipeId))
            .Select(item => new { item.RecipeId, item.Name }).ToListAsync();
        var byRecipe = rawIngredients.GroupBy(item => item.RecipeId).ToDictionary(group => group.Key, group => group.Select(item => IngredientKey(item.Name)).ToHashSet());
        var sourceSet = sourceIngredients.Select(IngredientKey).ToHashSet();
        var items = candidates.Select(candidate => new
        {
            candidate.Id, candidate.Title, candidate.Slug, candidate.ImageUrl, category = candidate.Category.Name, candidate.Difficulty,
            score = (candidate.CategoryId == recipe.CategoryId ? 3 : 0) + (candidate.IsVegetarian == recipe.IsVegetarian ? 1 : 0) + byRecipe.GetValueOrDefault(candidate.Id, []).Count(sourceSet.Contains)
        }).OrderByDescending(item => item.score).ThenBy(item => item.Title).Take(6).ToList();
        return new ApiResponseResult(200, new { items });
    }

    private static async Task<ApiResponseResult> Compare(Guid left, Guid right, ApplicationDbContext db)
    {
        if (left == right) return new ApiResponseResult(400, new { message = "Hãy chọn hai công thức khác nhau để so sánh." });
        var recipes = await db.Recipes.AsNoTracking().Include(item => item.Category)
            .Where(item => (item.Id == left || item.Id == right) && !item.IsDeleted && item.Status == RecipeStatus.Published).ToListAsync();
        if (recipes.Count != 2) return new ApiResponseResult(404, new { message = "Một trong hai công thức không còn khả dụng." });
        var map = new Dictionary<Guid, List<string>>();
        foreach (var recipe in recipes) map[recipe.Id] = await IngredientNames(db, recipe.Id);
        object Shape(Recipe recipe) => new { recipe.Id, recipe.Title, recipe.Slug, recipe.ImageUrl, category = recipe.Category.Name, totalMinutes = recipe.PrepTimeMinutes + recipe.CookTimeMinutes, recipe.Difficulty, recipe.Servings, recipe.IsVegetarian, ingredients = map[recipe.Id], nutrition = recipe.Nutrition };
        return new ApiResponseResult(200, new { left = Shape(recipes.Single(item => item.Id == left)), right = Shape(recipes.Single(item => item.Id == right)) });
    }

    private static async Task<ApiResponseResult> Allergens(Guid id, ApplicationDbContext db)
    {
        var names = await IngredientNames(db, id);
        if (names.Count == 0) return new ApiResponseResult(404, new { message = "Không tìm thấy nguyên liệu công thức." });
        var text = string.Join(' ', names).ToLowerInvariant();
        var rules = new[] { ("gluten", new[] { "bột mì", "mì", "lúa mì", "bread" }), ("hải sản", new[] { "tôm", "cua", "cá", "mực", "sò" }), ("đậu phộng", new[] { "đậu phộng", "lạc" }), ("sữa", new[] { "sữa", "bơ", "phô mai", "kem" }), ("trứng", new[] { "trứng" }), ("đậu nành", new[] { "xì dầu", "đậu nành", "đậu phụ" }) };
        var found = rules.Where(rule => rule.Item2.Any(term => text.Contains(term))).Select(rule => rule.Item1).ToList();
        return new ApiResponseResult(200, new { allergens = found, note = "Cảnh báo được suy luận từ tên nguyên liệu; hãy kiểm tra nhãn sản phẩm khi có dị ứng nghiêm trọng." });
    }

    private static async Task<ApiResponseResult> History(HttpContext context, ApplicationDbContext db)
    {
        var userId = UserId(context);
        var items = await db.RecipeViews.AsNoTracking().Where(view => view.UserId == userId).OrderByDescending(view => view.ViewedAt).Take(20)
            .Select(view => new { view.RecipeId, view.ViewedAt, view.Recipe.Title, view.Recipe.Slug, view.Recipe.ImageUrl, category = view.Recipe.Category.Name }).ToListAsync();
        return new ApiResponseResult(200, new { items });
    }

    private static async Task<ApiResponseResult> Preferences(HttpContext context, ApplicationDbContext db)
    {
        var preference = await db.UserPreferences.AsNoTracking().FirstOrDefaultAsync(item => item.UserId == UserId(context));
        return new ApiResponseResult(200, new { settings = ReadSettings(preference?.SettingsJson) });
    }

    private static async Task<ApiResponseResult> SavePreferences(UserPreferenceRequest request, HttpContext context, ApplicationDbContext db)
    {
        if (request.Settings.ValueKind != JsonValueKind.Object) return new ApiResponseResult(400, new { message = "Cài đặt phải có dạng đối tượng JSON." });
        var json = request.Settings.GetRawText();
        if (json.Length > 12000) return new ApiResponseResult(400, new { message = "Cài đặt quá lớn." });
        var userId = UserId(context);
        var preference = await db.UserPreferences.FindAsync(userId);
        if (preference is null) { preference = new UserPreference { UserId = userId }; db.UserPreferences.Add(preference); }
        preference.SettingsJson = json;
        preference.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return new ApiResponseResult(200, new { settings = ReadSettings(json), preference.UpdatedAt });
    }

    private static async Task<ApiResponseResult> ProfileInsights(HttpContext context, ApplicationDbContext db)
    {
        var userId = UserId(context);
        var recipeCount = await db.Recipes.CountAsync(recipe => recipe.AuthorId == userId && !recipe.IsDeleted);
        var postCount = await db.CommunityPosts.CountAsync(post => post.AuthorId == userId && !post.IsDraft);
        var reviewCount = await db.RecipeReviews.CountAsync(review => review.UserId == userId);
        var cookedCount = await db.RecipeReviews.CountAsync(review => review.UserId == userId && review.IsCooked);
        var commentCount = await db.PostComments.CountAsync(comment => comment.AuthorId == userId);
        var points = recipeCount * 100 + postCount * 15 + reviewCount * 25 + cookedCount * 30 + commentCount * 5;
        var level = points >= 1200 ? "Đầu bếp thạo nghề" : points >= 500 ? "Đầu bếp tiến bộ" : points >= 150 ? "Người vào bếp" : "Đầu bếp mới";
        var badges = new List<string> { "Đầu bếp mới" };
        if (recipeCount >= 5) badges.Add("Tác giả nổi bật");
        if (cookedCount >= 10) badges.Add("Người thực hành tích cực");
        if (commentCount >= 20) badges.Add("Người chia sẻ hữu ích");
        return new ApiResponseResult(200, new { points, level, recipeCount, postCount, reviewCount, cookedCount, commentCount, badges });
    }

    private static async Task<ApiResponseResult> Revisions(Guid id, HttpContext context, ApplicationDbContext db)
    {
        if (!await CanManageRecipe(id, context, db)) return new ApiResponseResult(403, new { message = "Bạn không có quyền xem lịch sử phiên bản này." });
        var items = await db.RecipeRevisions.AsNoTracking().Where(revision => revision.RecipeId == id).OrderByDescending(revision => revision.Version)
            .Select(revision => new { revision.Id, revision.Version, revision.CreatedAt, author = revision.CreatedBy.FullName ?? revision.CreatedBy.UserName }).ToListAsync();
        return new ApiResponseResult(200, new { items });
    }

    private static async Task<ApiResponseResult> RestoreRevision(Guid id, Guid revisionId, HttpContext context, ApplicationDbContext db, ICacheService cache)
    {
        if (!await CanManageRecipe(id, context, db)) return new ApiResponseResult(403, new { message = "Bạn không có quyền khôi phục phiên bản này." });
        var revision = await db.RecipeRevisions.FirstOrDefaultAsync(item => item.Id == revisionId && item.RecipeId == id);
        var recipe = await db.Recipes.FirstOrDefaultAsync(item => item.Id == id && !item.IsDeleted);
        if (revision is null || recipe is null) return new ApiResponseResult(404, new { message = "Không tìm thấy phiên bản công thức." });
        var snapshot = JsonSerializer.Deserialize<RecipeRevisionSnapshot>(revision.SnapshotJson, new JsonSerializerOptions(JsonSerializerDefaults.Web));
        if (snapshot is null || !await db.Categories.AnyAsync(category => category.Id == snapshot.CategoryId && !category.IsDeleted)) return new ApiResponseResult(400, new { message = "Phiên bản cũ không còn có thể khôi phục an toàn." });
        recipe.Update(snapshot.Title, snapshot.Description, snapshot.Ingredients, snapshot.Instructions, snapshot.CategoryId, snapshot.ImageUrl, difficulty: snapshot.Difficulty, isVegetarian: snapshot.IsVegetarian, prepTimeMinutes: snapshot.PrepTimeMinutes, cookTimeMinutes: snapshot.CookTimeMinutes, servings: snapshot.Servings);
        recipe.SetNutrition(snapshot.Nutrition);
        db.RecipeIngredients.RemoveRange(db.RecipeIngredients.Where(item => item.RecipeId == id));
        db.RecipeSteps.RemoveRange(db.RecipeSteps.Where(item => item.RecipeId == id));
        db.RecipeIngredients.AddRange(snapshot.Ingredients.Where(item => !string.IsNullOrWhiteSpace(item)).Select((item, index) => RecipeIngredient.Create(id, item, null, null, null, index + 1)));
        db.RecipeSteps.AddRange(snapshot.Instructions.Where(item => !string.IsNullOrWhiteSpace(item)).Select((item, index) => RecipeStep.Create(id, null, item, index + 1, null, null)));
        await db.SaveChangesAsync();
        await cache.RemoveAsync(CacheKeys.Recipe(id));
        return new ApiResponseResult(200, new { message = $"Đã khôi phục phiên bản {revision.Version}.", recipe.Id, recipe.UpdatedAt });
    }

    private static async Task<IResult> ExportCsv(string kind, ApplicationDbContext db)
    {
        static string Escape(string? value) => $"\"{(value ?? string.Empty).Replace("\"", "\"\"")}\"";
        kind = kind.Trim().ToLowerInvariant();
        var lines = new List<string>();
        switch (kind)
        {
            case "users":
                lines.Add("Tên đăng nhập,Họ tên,Email,Vai trò,Ngày tạo,Đăng nhập gần nhất,Đang khóa");
                foreach (var user in await db.Users.AsNoTracking().OrderBy(item => item.CreatedAt).ToListAsync()) lines.Add(string.Join(',', Escape(user.UserName), Escape(user.FullName), Escape(user.Email), Escape(user.Role), Escape(user.CreatedAt.ToString("O")), Escape(user.LastLoginAt?.ToString("O")), user.IsSuspended));
                break;
            case "recipes":
                lines.Add("Công thức,Danh mục,Tác giả,Trạng thái,Ngày cập nhật");
                foreach (var recipe in await db.Recipes.AsNoTracking().Include(item => item.Category).Include(item => item.Author).Where(item => !item.IsDeleted).OrderByDescending(item => item.UpdatedAt).ToListAsync()) lines.Add(string.Join(',', Escape(recipe.Title), Escape(recipe.Category.Name), Escape(recipe.Author.FullName), recipe.Status, Escape(recipe.UpdatedAt.ToString("O"))));
                break;
            case "reports":
                lines.Add("Loại đối tượng,Lý do,Người báo cáo,Ngày tạo,Đã xử lý");
                foreach (var report in await db.ContentReports.AsNoTracking().Include(item => item.Reporter).OrderByDescending(item => item.CreatedAt).ToListAsync()) lines.Add(string.Join(',', Escape(report.TargetType), Escape(report.Reason), Escape(report.Reporter.FullName), Escape(report.CreatedAt.ToString("O")), Escape(report.ResolvedAt?.ToString("O"))));
                break;
            case "analytics":
                lines.Add("Chỉ số,Giá trị");
                lines.Add($"Thành viên,{await db.Users.CountAsync()}"); lines.Add($"Công thức,{await db.Recipes.CountAsync(item => !item.IsDeleted)}"); lines.Add($"Báo cáo mở,{await db.ContentReports.CountAsync(item => item.ResolvedAt == null)}");
                break;
            default: return Results.Problem(statusCode: 400, detail: "Chỉ hỗ trợ users, recipes, reports hoặc analytics.");
        }
        var bytes = Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(string.Join("\r\n", lines))).ToArray();
        return Results.File(bytes, "text/csv; charset=utf-8", $"culinary-{kind}.csv");
    }

    private static async Task<bool> CanManageRecipe(Guid id, HttpContext context, ApplicationDbContext db) => context.User.IsInRole("Admin") || await db.Recipes.AnyAsync(recipe => recipe.Id == id && recipe.AuthorId == UserId(context));
    private static string UserId(HttpContext context) => context.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
    private static JsonElement ReadSettings(string? json) { try { using var document = JsonDocument.Parse(string.IsNullOrWhiteSpace(json) ? "{}" : json); return document.RootElement.Clone(); } catch { using var document = JsonDocument.Parse("{}"); return document.RootElement.Clone(); } }
    private static async Task<List<string>> IngredientNames(ApplicationDbContext db, Guid recipeId) { var structured = await db.RecipeIngredients.AsNoTracking().Where(item => item.RecipeId == recipeId).OrderBy(item => item.OrderIndex).Select(item => item.Name).ToListAsync(); if (structured.Count > 0) return structured; return await db.Recipes.Where(item => item.Id == recipeId).Select(item => item.Ingredients).FirstOrDefaultAsync() ?? []; }
    private static string IngredientKey(string value) => value.Trim().ToLowerInvariant().Split(',', ';', '(')[0].Trim();
}

public sealed class UserPreferenceRequest { public JsonElement Settings { get; set; } }
public sealed class RolePreviewRequest { public string? Role { get; set; } }
