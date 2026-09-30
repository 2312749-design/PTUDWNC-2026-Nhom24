using CulinaryBlog.Domain.Entities;

namespace CulinaryBlog.Application.Abstractions.Repositories;

public interface IRecipeIngredientRepository
{
    Task<IReadOnlyList<RecipeIngredient>> GetByRecipeAsync(
        Guid recipeId,
        CancellationToken cancellationToken = default);

    Task<RecipeIngredient?> GetByIdAsync(
        Guid recipeId,
        Guid ingredientId,
        bool trackChanges = false,
        CancellationToken cancellationToken = default);

    void Add(RecipeIngredient ingredient);

    void Remove(RecipeIngredient ingredient);
}
