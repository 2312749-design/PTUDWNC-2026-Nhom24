using CulinaryBlog.Infrastructure.Persistence;
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
            pendingReports = await db.ContentReports.CountAsync(r => r.ResolvedAt == null)
        }));
        admin.MapGet("/users", async (ApplicationDbContext db, int page = 1, int pageSize = 20) =>
        {
            page = Math.Max(1, page); pageSize = Math.Clamp(pageSize, 1, 100);
            return new ApiResponseResult(200, new
            {
                items = await db.Users.AsNoTracking().OrderBy(u => u.Id).Skip((page - 1) * pageSize).Take(pageSize)
                    .Select(u => new { u.Id, u.UserName, u.FullName, u.Email, u.Role, u.CreatedAt }).ToListAsync(),
                page, pageSize, total = await db.Users.CountAsync()
            });
        });
        admin.MapGet("/reports", async (ApplicationDbContext db, bool resolved = false, int page = 1, int pageSize = 20) =>
        {
            page = Math.Max(1, page); pageSize = Math.Clamp(pageSize, 1, 100);
            var query = db.ContentReports.AsNoTracking().Where(r => (r.ResolvedAt != null) == resolved);
            return new ApiResponseResult(200, new { items = await query.OrderByDescending(r => r.CreatedAt).ThenBy(r => r.Id)
                .Skip((page - 1) * pageSize).Take(pageSize)
                .Select(r => new { r.Id, r.TargetType, r.TargetId, r.Reason, r.CreatedAt, r.ResolvedAt }).ToListAsync(),
                page, pageSize, total = await query.CountAsync() });
        });
        admin.MapPut("/reports/{id:guid}/resolve", async (Guid id, ApplicationDbContext db) =>
        {
            var report = await db.ContentReports.FindAsync(id);
            if (report is null) return new ApiResponseResult(404);
            report.ResolvedAt ??= DateTime.UtcNow;
            await db.SaveChangesAsync();
            return new ApiResponseResult(200, new { report.Id, report.ResolvedAt });
        });
    }
}
