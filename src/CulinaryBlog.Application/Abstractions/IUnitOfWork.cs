using CulinaryBlog.Application.Abstractions.Repositories;

namespace CulinaryBlog.Application.Abstractions;

public interface IUnitOfWork
{
    IRecipeRepository Recipes { get; }

    IRecipeIngredientRepository RecipeIngredients { get; }

    IRecipeStepRepository RecipeSteps { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
