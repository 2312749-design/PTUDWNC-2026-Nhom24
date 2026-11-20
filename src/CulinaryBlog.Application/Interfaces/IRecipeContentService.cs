using CulinaryBlog.Application.DTOs;

namespace CulinaryBlog.Application.Interfaces;

public interface IRecipeContentService
{
    Task<RecipeIngredientDto> CreateIngredientAsync(Guid recipeId, CreateRecipeIngredientDto input, CancellationToken cancellationToken);
    Task UpdateIngredientAsync(Guid recipeId, Guid id, UpdateRecipeIngredientDto input, CancellationToken cancellationToken);
    Task DeleteIngredientAsync(Guid recipeId, Guid id, CancellationToken cancellationToken);
    Task<RecipeStepDto> CreateStepAsync(Guid recipeId, CreateRecipeStepDto input, CancellationToken cancellationToken);
    Task UpdateStepAsync(Guid recipeId, Guid id, UpdateRecipeStepDto input, CancellationToken cancellationToken);
    Task DeleteStepAsync(Guid recipeId, Guid id, CancellationToken cancellationToken);
}

