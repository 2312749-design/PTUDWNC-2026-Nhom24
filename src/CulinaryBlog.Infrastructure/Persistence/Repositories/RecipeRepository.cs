using CulinaryBlog.Application.Abstractions.Repositories;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Infrastructure.Persistence.Repositories;

public sealed class RecipeRepository(ApplicationDbContext dbContext) : IRecipeRepository
{
    public async Task<IReadOnlyList<Recipe>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        return await dbContext.Recipes
            .AsNoTracking()
            .Where(recipe => recipe.Status == "Published")
            .OrderByDescending(recipe => recipe.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public Task<Recipe?> GetByIdAsync(
        Guid id,
        bool trackChanges = false,
        CancellationToken cancellationToken = default)
    {
        var query = dbContext.Recipes.AsQueryable();
        if (!trackChanges)
        {
            query = query.AsNoTracking();
        }

        return query.FirstOrDefaultAsync(recipe => recipe.Id == id, cancellationToken);
    }

    public Task<Recipe?> GetPublishedBySlugAsync(
        string slug,
        CancellationToken cancellationToken = default)
    {
        return dbContext.Recipes
            .AsNoTracking()
            .FirstOrDefaultAsync(
                recipe => recipe.Slug == slug && recipe.Status == "Published",
                cancellationToken);
    }

    public async Task<(IReadOnlyList<Recipe> Recipes, int Total)> SearchPublishedAsync(
        string keyword,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        var terms = keyword
            .Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(term => string.Concat(term.Where(char.IsLetterOrDigit)))
            .Where(term => term.Length > 0)
            .Select(term => $"{term}:*")
            .ToArray();
        if (terms.Length == 0)
        {
            throw new ValidationException("Từ khóa tìm kiếm không chứa ký tự hợp lệ.");
        }

        var tsQuery = string.Join(" & ", terms);

        var query = dbContext.Recipes
            .FromSqlInterpolated($@"
                SELECT *
                FROM ""Recipes""
                WHERE ""Status"" = 'Published'
                  AND ""SearchVector"" @@ to_tsquery(
                        'simple',
                        {tsQuery}
                  )
            ")
            .AsNoTracking();

        var total = await query.CountAsync(cancellationToken);
        var recipes = await query
            .OrderByDescending(recipe => recipe.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (recipes, total);
    }

    public void Add(Recipe recipe) => dbContext.Recipes.Add(recipe);

    public void Remove(Recipe recipe) => dbContext.Recipes.Remove(recipe);
}
