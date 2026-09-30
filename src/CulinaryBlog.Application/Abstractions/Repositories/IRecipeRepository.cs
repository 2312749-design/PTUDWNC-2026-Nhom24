using CulinaryBlog.Domain.Entities;

namespace CulinaryBlog.Application.Abstractions.Repositories;

public interface IRecipeRepository
{
    Task<IReadOnlyList<Recipe>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<Recipe?> GetByIdAsync(
        Guid id,
        bool trackChanges = false,
        CancellationToken cancellationToken = default);

    Task<Recipe?> GetPublishedBySlugAsync(
        string slug,
        CancellationToken cancellationToken = default);

    Task<(IReadOnlyList<Recipe> Recipes, int Total)> SearchPublishedAsync(
        string keyword,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default);

    void Add(Recipe recipe);

    void Remove(Recipe recipe);
}
