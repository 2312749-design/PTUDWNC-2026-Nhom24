using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Api.Endpoints;

public static class AdminEndpoints
{
    public static void MapAdminEndpoints(this RouteGroupBuilder apiV1)
    {
        var admin = apiV1.MapGroup("/admin")
            .WithTags("Administration")
            .RequireAuthorization("Admin");

        admin.MapGet("/users", async (
            int page,
            int pageSize,
            string? role,
            ApplicationDbContext dbContext,
            CancellationToken cancellationToken) =>
        {
            page = Math.Max(page, 1);
            pageSize = pageSize is < 1 or > 100 ? 20 : pageSize;
            var query = dbContext.BlogUsers.AsNoTracking();
            if (!string.IsNullOrWhiteSpace(role))
            {
                query = query.Where(user => user.Role == role.Trim());
            }

            var total = await query.CountAsync(cancellationToken);
            var users = await query
                .OrderBy(user => user.DisplayName)
                .ThenBy(user => user.Email)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(user => new
                {
                    user.Id,
                    user.Email,
                    user.DisplayName,
                    user.Role,
                    user.CreatedAt
                })
                .ToListAsync(cancellationToken);

            return Results.Ok(new
            {
                data = users,
                pagination = new
                {
                    page,
                    pageSize,
                    total,
                    totalPages = (int)Math.Ceiling(total / (double)pageSize)
                }
            });
        });
    }
}
