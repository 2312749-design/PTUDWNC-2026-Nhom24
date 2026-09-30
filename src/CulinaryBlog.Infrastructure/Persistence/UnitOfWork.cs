using CulinaryBlog.Application.Abstractions;
using CulinaryBlog.Application.Abstractions.Repositories;
using CulinaryBlog.Infrastructure.Persistence.Repositories;

namespace CulinaryBlog.Infrastructure.Persistence;

public sealed class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _dbContext;

    public UnitOfWork(
        ApplicationDbContext dbContext,
        IRecipeRepository recipes,
        IRecipeIngredientRepository recipeIngredients,
        IRecipeStepRepository recipeSteps)
    {
        _dbContext = dbContext;
        Recipes = recipes;
        RecipeIngredients = recipeIngredients;
        RecipeSteps = recipeSteps;
    }

    public IRecipeRepository Recipes { get; }

    public IRecipeIngredientRepository RecipeIngredients { get; }

    public IRecipeStepRepository RecipeSteps { get; }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return _dbContext.SaveChangesAsync(cancellationToken);
    }
}
