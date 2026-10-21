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

        return query.FirstOrDefaultAsync(
            recipe => recipe.Id == id,
            cancellationToken);
    }

    public Task<Recipe?> GetPublishedBySlugAsync(
        string slug,
        CancellationToken cancellationToken = default)
    {
        return dbContext.Recipes
            .AsNoTracking()
            .FirstOrDefaultAsync(
                recipe => recipe.Slug == slug &&
                          recipe.Status == "Published",
                cancellationToken);
    }

    public async Task<(IReadOnlyList<Recipe> Recipes, int Total)> SearchPublishedAsync(
        string keyword,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(keyword))
        {
            throw new ValidationException(
                "Từ khóa tìm kiếm không được để trống.");
        }

        if (page < 1)
        {
            throw new ValidationException(
                "Trang phải lớn hơn hoặc bằng 1.");
        }

        if (pageSize < 1)
        {
            throw new ValidationException(
                "Kích thước trang phải lớn hơn hoặc bằng 1.");
        }

        var tsQuery = EF.Functions.PlainToTsQuery(
            "simple",
            keyword.Trim());

        var query = dbContext.Recipes
            .AsNoTracking()
            .Where(recipe =>
                recipe.Status == "Published" &&
                EF.Property<NpgsqlTypes.NpgsqlTsVector>(
                    recipe,
                    "SearchVector")
                    .Matches(tsQuery));

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