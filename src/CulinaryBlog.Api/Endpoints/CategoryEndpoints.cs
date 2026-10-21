using System.Text.RegularExpressions;
using CulinaryBlog.Api.Endpoints.Requests;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Exceptions;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Api.Endpoints;

public static partial class CategoryEndpoints
{
    public static void MapCategoryEndpoints(this RouteGroupBuilder apiV1)
    {
        var categories = apiV1.MapGroup("/categories")
            .WithTags("Categories");

        categories.MapGet("/", async (
            ApplicationDbContext dbContext,
            CancellationToken cancellationToken) =>
        {
            var result = await dbContext.Categories
                .AsNoTracking()
                .OrderBy(category => category.Name)
                .Select(category => new
                {
                    category.Id,
                    category.Name,
                    category.Slug,
                    category.Description,
                    RecipeCount = category.Recipes.Count(
                        recipe => recipe.Status == "Published")
                })
                .ToListAsync(cancellationToken);
            return Results.Ok(new { data = result });
        });

        categories.MapGet("/{id:guid}/recipes", async (
            Guid id,
            int page,
            int pageSize,
            ApplicationDbContext dbContext,
            CancellationToken cancellationToken) =>
        {
            var categoryExists = await dbContext.Categories
                .AnyAsync(category => category.Id == id, cancellationToken);
            if (!categoryExists)
            {
                throw new NotFoundException("Không tìm thấy danh mục.");
            }

            page = Math.Max(page, 1);
            pageSize = pageSize is < 1 or > 100 ? 10 : pageSize;
            var query = dbContext.Recipes
                .AsNoTracking()
                .Where(recipe =>
                    recipe.CategoryId == id &&
                    recipe.Status == "Published");
            var total = await query.CountAsync(cancellationToken);
            var result = await query
                .OrderByDescending(recipe => recipe.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return Results.Ok(new
            {
                data = result,
                pagination = new
                {
                    page,
                    pageSize,
                    total,
                    totalPages = (int)Math.Ceiling(total / (double)pageSize)
                }
            });
        });

        categories.MapPost("/", async (
            CreateCategoryRequest request,
            ApplicationDbContext dbContext,
            CancellationToken cancellationToken) =>
        {
            var name = request.Name?.Trim() ?? string.Empty;
            var slug = request.Slug?.Trim().ToLowerInvariant() ?? string.Empty;
            var description = request.Description?.Trim() ?? string.Empty;
            if (name.Length is < 1 or > 100 ||
                description.Length > 500 ||
                slug.Length is < 1 or > 120 ||
                !SlugPattern().IsMatch(slug))
            {
                return Results.BadRequest(new { message = "Thông tin danh mục không hợp lệ." });
            }

            if (await dbContext.Categories.AnyAsync(
                    category => category.Slug == slug,
                    cancellationToken))
            {
                return Results.Conflict(new { message = "Slug danh mục đã được sử dụng." });
            }

            var category = new Category
            {
                Id = Guid.NewGuid(),
                Name = name,
                Slug = slug,
                Description = description
            };
            dbContext.Categories.Add(category);
            await dbContext.SaveChangesAsync(cancellationToken);
            return Results.Created($"/api/v1/categories/{category.Id}", category);
        }).RequireAuthorization("Author");
    }

    [GeneratedRegex("^[a-z0-9]+(?:-[a-z0-9]+)*$", RegexOptions.CultureInvariant)]
    private static partial Regex SlugPattern();
}
