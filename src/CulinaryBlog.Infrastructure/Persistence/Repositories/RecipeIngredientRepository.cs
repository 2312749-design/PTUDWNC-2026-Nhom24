using CulinaryBlog.Application.Abstractions.Repositories;
using CulinaryBlog.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Infrastructure.Persistence.Repositories;

public sealed class RecipeIngredientRepository(ApplicationDbContext dbContext)
    : IRecipeIngredientRepository
{
    public async Task<IReadOnlyList<RecipeIngredient>> GetByRecipeAsync(
        Guid recipeId,
        CancellationToken cancellationToken = default)
    {
        return await dbContext.RecipeIngredients
            .AsNoTracking()
            .Where(ingredient => ingredient.RecipeId == recipeId)
            .OrderBy(ingredient => ingredient.OrderIndex)
            .ToListAsync(cancellationToken);
    }

    public Task<RecipeIngredient?> GetByIdAsync(
        Guid recipeId,
        Guid ingredientId,
        bool trackChanges = false,
        CancellationToken cancellationToken = default)
    {
        var query = dbContext.RecipeIngredients.AsQueryable();
        if (!trackChanges)
        {
            query = query.AsNoTracking();
        }

        return query.FirstOrDefaultAsync(
            ingredient => ingredient.Id == ingredientId && ingredient.RecipeId == recipeId,
            cancellationToken);
    }

    public void Add(RecipeIngredient ingredient) => dbContext.RecipeIngredients.Add(ingredient);

    public void Remove(RecipeIngredient ingredient) => dbContext.RecipeIngredients.Remove(ingredient);
}
