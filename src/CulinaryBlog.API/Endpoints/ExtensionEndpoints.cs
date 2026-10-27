using System.Security.Claims;
using System.Text.Json;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.API.Endpoints;

/// <summary>Independent modules for the remaining community, event and editor features.</summary>
public static class ExtensionEndpoints
{
    private static readonly HashSet<string> ReactionTypes = new(StringComparer.OrdinalIgnoreCase) { "like", "love", "helpful", "want-to-try" };
    private static readonly HashSet<string> StaffRoles = new(StringComparer.Ordinal) { "Moderator", "ContentManager", "SystemAdmin", "Admin", "Author", "User" };

    public static void MapExtensions(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1/extensions").WithTags("Community and editor extensions");
        group.MapGet("/categories/tree", CategoryTree).AllowAnonymous();
        group.MapGet("/posts/{id:guid}/reactions", Reactions).AllowAnonymous();
        group.MapPut("/posts/{id:guid}/reaction", SetReaction).RequireAuthorization();
        group.MapGet("/hashtags/{tag}", HashtagFeed).AllowAnonymous();
        group.MapGet("/events", Events).AllowAnonymous();
        group.MapPost("/events/{id:guid}/register", RegisterForEvent).RequireAuthorization();
        group.MapPost("/events/{id:guid}/submit", SubmitEvent).RequireAuthorization();
        group.MapGet("/leaderboard", Leaderboard).AllowAnonymous();
        group.MapGet("/drafts/{key}", GetDraft).RequireAuthorization();
        group.MapPut("/drafts/{key}", SaveDraft).RequireAuthorization();
        group.MapDelete("/drafts/{key}", DeleteDraft).RequireAuthorization();

        var admin = group.MapGroup("/admin").RequireAuthorization(policy => policy.RequireRole("Admin"));
        admin.MapPut("/categories/{childId:guid}/parent", SetCategoryParent);
        admin.MapPost("/events", CreateEvent);
        admin.MapPut("/users/{id}/role", SetStaffRole);
        admin.MapPost("/users/{id}/author-verification", VerifyAuthor);
    }

    private static async Task<ApiResponseResult> CategoryTree(ApplicationDbContext db)
    {
        var categories = await db.Categories.AsNoTracking().Where(item => !item.IsDeleted && item.IsVisible).OrderBy(item => item.DisplayOrder).ThenBy(item => item.Name)
            .Select(item => new { item.Id, item.Name, item.Slug, item.Description, item.ImageUrl, recipeCount = item.Recipes.Count(recipe => !recipe.IsDeleted && recipe.Status == RecipeStatus.Published) }).ToListAsync();
        var parents = await db.CategoryRelationships.AsNoTracking().ToDictionaryAsync(item => item.ChildCategoryId, item => item.ParentCategoryId);
        object Shape(Guid id) { var item = categories.Single(category => category.Id == id); return new { item.Id, item.Name, item.Slug, item.Description, item.ImageUrl, item.recipeCount, children = categories.Where(child => parents.GetValueOrDefault(child.Id) == id).Select(child => Shape(child.Id)).ToList() }; }
        return new ApiResponseResult(200, new { items = categories.Where(item => !parents.ContainsKey(item.Id)).Select(item => Shape(item.Id)).ToList() });
    }

    private static async Task<ApiResponseResult> SetCategoryParent(Guid childId, CategoryParentRequest request, ApplicationDbContext db)
    {
        if (request.ParentCategoryId == childId) return new ApiResponseResult(400, new { message = "Danh mục không thể là danh mục cha của chính nó." });
        if (!await db.Categories.AnyAsync(item => item.Id == childId && !item.IsDeleted)) return new ApiResponseResult(404, new { message = "Không tìm thấy danh mục con." });
        if (request.ParentCategoryId.HasValue && !await db.Categories.AnyAsync(item => item.Id == request.ParentCategoryId && !item.IsDeleted)) return new ApiResponseResult(404, new { message = "Không tìm thấy danh mục cha." });
        var link = await db.CategoryRelationships.FindAsync(childId);
        if (!request.ParentCategoryId.HasValue) { if (link is not null) db.CategoryRelationships.Remove(link); }
        else if (link is null) db.CategoryRelationships.Add(new CategoryRelationship { ChildCategoryId = childId, ParentCategoryId = request.ParentCategoryId.Value });
        else link.ParentCategoryId = request.ParentCategoryId.Value;
        await db.SaveChangesAsync();
        return new ApiResponseResult(200, new { childId, request.ParentCategoryId });
    }

    private static async Task<ApiResponseResult> Reactions(Guid id, HttpContext context, ApplicationDbContext db)
    {
        if (!await db.CommunityPosts.AnyAsync(item => item.Id == id && !item.IsDraft && !item.IsHidden)) return new ApiResponseResult(404, new { message = "Không tìm thấy bài viết." });
        var items = await db.PostReactions.AsNoTracking().Where(item => item.PostId == id).GroupBy(item => item.Type).Select(group => new { type = group.Key, count = group.Count() }).ToListAsync();
        var mine = context.User.Identity?.IsAuthenticated == true ? await db.PostReactions.AsNoTracking().Where(item => item.PostId == id && item.UserId == UserId(context)).Select(item => item.Type).FirstOrDefaultAsync() : null;
        return new ApiResponseResult(200, new { items, mine });
    }

    private static async Task<ApiResponseResult> SetReaction(Guid id, ReactionRequest request, HttpContext context, ApplicationDbContext db)
    {
        var type = request.Type?.Trim().ToLowerInvariant() ?? string.Empty;
        if (type.Length > 0 && !ReactionTypes.Contains(type)) return new ApiResponseResult(400, new { message = "Reaction không hợp lệ." });
        if (!await db.CommunityPosts.AnyAsync(item => item.Id == id && !item.IsDraft && !item.IsHidden)) return new ApiResponseResult(404, new { message = "Không tìm thấy bài viết." });
        var userId = UserId(context); var reaction = await db.PostReactions.FindAsync(id, userId);
        if (type.Length == 0) { if (reaction is not null) db.PostReactions.Remove(reaction); }
        else if (reaction is null) db.PostReactions.Add(new PostReaction { PostId = id, UserId = userId, Type = type });
        else { reaction.Type = type; reaction.UpdatedAt = DateTime.UtcNow; }
        await db.SaveChangesAsync();
        return await Reactions(id, context, db);
    }

    private static async Task<ApiResponseResult> HashtagFeed(string tag, ApplicationDbContext db)
    {
        var normalized = tag.Trim().TrimStart('#').ToLowerInvariant();
        if (normalized.Length is < 2 or > 60) return new ApiResponseResult(400, new { message = "Hashtag cần từ 2 đến 60 ký tự." });
        var token = $"#{normalized}";
        var items = await db.CommunityPosts.AsNoTracking().Where(post => !post.IsDraft && !post.IsHidden && post.Content.ToLower().Contains(token)).OrderByDescending(post => post.CreatedAt).Take(40)
            .Select(post => new { post.Id, post.Content, post.MediaUrl, post.MediaType, post.CreatedAt, author = new { username = post.Author.UserName, fullName = post.Author.FullName, avatarUrl = post.Author.AvatarUrl } }).ToListAsync();
        return new ApiResponseResult(200, new { tag = normalized, items });
    }

    private static async Task<ApiResponseResult> Events(HttpContext context, ApplicationDbContext db)
    {
        var userId = context.User.Identity?.IsAuthenticated == true ? UserId(context) : null;
        var items = await db.CookingEvents.AsNoTracking().OrderBy(item => item.StartsAt).Take(50).Select(item => new { item.Id, item.Title, item.Description, item.CoverImageUrl, item.StartsAt, item.EndsAt, item.Capacity, createdBy = item.CreatedBy.FullName, registrations = db.CookingEventRegistrations.Count(registration => registration.EventId == item.Id), registeredByMe = userId != null && db.CookingEventRegistrations.Any(registration => registration.EventId == item.Id && registration.UserId == userId) }).ToListAsync();
        return new ApiResponseResult(200, new { items });
    }

    private static async Task<ApiResponseResult> CreateEvent(EventRequest request, HttpContext context, ApplicationDbContext db)
    {
        if (string.IsNullOrWhiteSpace(request.Title) || request.Title.Trim().Length > 160 || string.IsNullOrWhiteSpace(request.Description) || request.Description.Trim().Length > 3000 || request.EndsAt <= request.StartsAt || request.Capacity is < 1 or > 100000) return new ApiResponseResult(400, new { message = "Thông tin sự kiện không hợp lệ." });
        var item = new CookingEvent { Title = request.Title.Trim(), Description = request.Description.Trim(), CoverImageUrl = string.IsNullOrWhiteSpace(request.CoverImageUrl) ? null : request.CoverImageUrl.Trim(), StartsAt = request.StartsAt.ToUniversalTime(), EndsAt = request.EndsAt.ToUniversalTime(), Capacity = request.Capacity, CreatedById = UserId(context) };
        db.CookingEvents.Add(item); await db.SaveChangesAsync(); return new ApiResponseResult(201, new { item.Id, item.Title, item.StartsAt, item.EndsAt });
    }

    private static async Task<ApiResponseResult> RegisterForEvent(Guid id, HttpContext context, ApplicationDbContext db)
    {
        var item = await db.CookingEvents.FindAsync(id); if (item is null || item.EndsAt <= DateTime.UtcNow) return new ApiResponseResult(404, new { message = "Sự kiện không còn mở đăng ký." });
        var userId = UserId(context); if (await db.CookingEventRegistrations.FindAsync(id, userId) is not null) return new ApiResponseResult(200, new { registered = true, message = "Bạn đã đăng ký sự kiện này." });
        if (item.Capacity.HasValue && await db.CookingEventRegistrations.CountAsync(registration => registration.EventId == id) >= item.Capacity.Value) return new ApiResponseResult(409, new { message = "Sự kiện đã đủ chỗ." });
        db.CookingEventRegistrations.Add(new CookingEventRegistration { EventId = id, UserId = userId }); await db.SaveChangesAsync(); return new ApiResponseResult(201, new { registered = true });
    }

    private static async Task<ApiResponseResult> SubmitEvent(Guid id, EventSubmissionRequest request, HttpContext context, ApplicationDbContext db)
    {
        var userId = UserId(context); var entry = await db.CookingEventRegistrations.FindAsync(id, userId); if (entry is null) return new ApiResponseResult(404, new { message = "Bạn chưa đăng ký sự kiện." });
        if (!await db.Recipes.AnyAsync(recipe => recipe.Id == request.RecipeId && recipe.AuthorId == userId && !recipe.IsDeleted)) return new ApiResponseResult(400, new { message = "Bạn chỉ có thể nộp công thức của chính mình." });
        entry.SubmittedRecipeId = request.RecipeId; entry.SubmittedAt = DateTime.UtcNow; await db.SaveChangesAsync(); return new ApiResponseResult(200, new { submitted = true, entry.SubmittedAt });
    }

    private static async Task<ApiResponseResult> Leaderboard(ApplicationDbContext db)
    {
        var reactions = await db.PostReactions.AsNoTracking().GroupBy(item => item.UserId).Select(group => new { userId = group.Key, points = group.Count() }).ToDictionaryAsync(item => item.userId, item => item.points);
        var challenges = await db.ChallengeSubmissions.AsNoTracking().GroupBy(item => item.UserId).Select(group => new { userId = group.Key, points = group.Count() * 10 }).ToDictionaryAsync(item => item.userId, item => item.points);
        var users = await db.Users.AsNoTracking().Where(user => reactions.ContainsKey(user.Id) || challenges.ContainsKey(user.Id)).Select(user => new { user.Id, user.UserName, user.FullName, user.AvatarUrl }).ToListAsync();
        var items = users.Select(user => new { user.UserName, user.FullName, user.AvatarUrl, points = reactions.GetValueOrDefault(user.Id) + challenges.GetValueOrDefault(user.Id) }).OrderByDescending(item => item.points).Take(20).ToList();
        return new ApiResponseResult(200, new { items });
    }

    private static async Task<ApiResponseResult> GetDraft(string key, HttpContext context, ApplicationDbContext db)
    {
        var draft = await db.UserWorkspaceDrafts.AsNoTracking().FirstOrDefaultAsync(item => item.UserId == UserId(context) && item.DraftKey == key); return new ApiResponseResult(200, new { key, content = ReadJson(draft?.ContentJson), draft?.UpdatedAt });
    }
    private static async Task<ApiResponseResult> SaveDraft(string key, DraftRequest request, HttpContext context, ApplicationDbContext db)
    {
        if (key.Length is < 2 or > 120 || request.Content.ValueKind != JsonValueKind.Object || request.Content.GetRawText().Length > 30000) return new ApiResponseResult(400, new { message = "Bản nháp không hợp lệ." });
        var userId = UserId(context); var draft = await db.UserWorkspaceDrafts.FindAsync(userId, key); if (draft is null) { draft = new UserWorkspaceDraft { UserId = userId, DraftKey = key }; db.UserWorkspaceDrafts.Add(draft); } draft.ContentJson = request.Content.GetRawText(); draft.UpdatedAt = DateTime.UtcNow; await db.SaveChangesAsync(); return new ApiResponseResult(200, new { key, draft.UpdatedAt });
    }
    private static async Task<ApiResponseResult> DeleteDraft(string key, HttpContext context, ApplicationDbContext db) { var draft = await db.UserWorkspaceDrafts.FindAsync(UserId(context), key); if (draft is not null) { db.UserWorkspaceDrafts.Remove(draft); await db.SaveChangesAsync(); } return new ApiResponseResult(204); }

    private static async Task<ApiResponseResult> SetStaffRole(string id, StaffRoleRequest request, ApplicationDbContext db)
    {
        var role = request.Role?.Trim() ?? string.Empty; if (!StaffRoles.Contains(role)) return new ApiResponseResult(400, new { message = "Vai trò không hợp lệ." });
        var user = await db.Users.FindAsync(id); if (user is null) return new ApiResponseResult(404, new { message = "Không tìm thấy thành viên." });
        user.Role = role;
        db.AdminAuditLogs.Add(new AdminAuditLog { ActorId = id, Action = "staff.role.updated", TargetType = "user", TargetId = id, Summary = $"Vai trò mới: {role}" }); await db.SaveChangesAsync(); return new ApiResponseResult(200, new { user.Id, user.Role, message = "Vai trò sẽ có hiệu lực sau lần đăng nhập kế tiếp." });
    }
    private static async Task<ApiResponseResult> VerifyAuthor(string id, HttpContext context, ApplicationDbContext db)
    {
        if (!await db.Users.AnyAsync(user => user.Id == id)) return new ApiResponseResult(404, new { message = "Không tìm thấy tác giả." });
        var badge = await db.UserBadges.FindAsync(id, "verified-author"); if (badge is null) db.UserBadges.Add(new UserBadge { UserId = id, Code = "verified-author", Name = "Tác giả đã xác minh" }); await db.SaveChangesAsync(); return new ApiResponseResult(200, new { verified = true });
    }

    private static string UserId(HttpContext context) => context.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
    private static JsonElement ReadJson(string? value) { using var doc = JsonDocument.Parse(string.IsNullOrWhiteSpace(value) ? "{}" : value); return doc.RootElement.Clone(); }
}
public sealed class CategoryParentRequest { public Guid? ParentCategoryId { get; set; } }
public sealed class ReactionRequest { public string? Type { get; set; } }
public sealed class EventRequest { public string? Title { get; set; } public string? Description { get; set; } public string? CoverImageUrl { get; set; } public DateTime StartsAt { get; set; } public DateTime EndsAt { get; set; } public int? Capacity { get; set; } }
public sealed class EventSubmissionRequest { public Guid RecipeId { get; set; } }
public sealed class DraftRequest { public JsonElement Content { get; set; } }
public sealed class StaffRoleRequest { public string? Role { get; set; } }
