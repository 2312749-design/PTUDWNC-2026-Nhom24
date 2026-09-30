using CulinaryBlog.Domain.Entities;

namespace CulinaryBlog.Application.Abstractions.Repositories;

public interface IRecipeStepRepository
{
    Task<IReadOnlyList<RecipeStep>> GetByRecipeAsync(
        Guid recipeId,
        bool trackChanges = false,
        CancellationToken cancellationToken = default);

    Task<RecipeStep?> GetByIdAsync(
        Guid recipeId,
        Guid stepId,
        bool trackChanges = false,
        CancellationToken cancellationToken = default);

    Task<int> GetNextStepNumberAsync(
        Guid recipeId,
        CancellationToken cancellationToken = default);

    void Add(RecipeStep step);

    void Remove(RecipeStep step);
}
