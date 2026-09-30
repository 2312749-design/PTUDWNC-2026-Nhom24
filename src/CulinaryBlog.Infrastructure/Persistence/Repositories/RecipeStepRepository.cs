using CulinaryBlog.Application.Abstractions.Repositories;
using CulinaryBlog.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Infrastructure.Persistence.Repositories;

public sealed class RecipeStepRepository(ApplicationDbContext dbContext) : IRecipeStepRepository
{
    public async Task<IReadOnlyList<RecipeStep>> GetByRecipeAsync(
        Guid recipeId,
        bool trackChanges = false,
        CancellationToken cancellationToken = default)
    {
        var query = dbContext.RecipeSteps
            .Where(step => step.RecipeId == recipeId);
        if (!trackChanges)
        {
            query = query.AsNoTracking();
        }

        return await query
            .OrderBy(step => step.StepNumber)
            .ToListAsync(cancellationToken);
    }

    public Task<RecipeStep?> GetByIdAsync(
        Guid recipeId,
        Guid stepId,
        bool trackChanges = false,
        CancellationToken cancellationToken = default)
    {
        var query = dbContext.RecipeSteps.AsQueryable();
        if (!trackChanges)
        {
            query = query.AsNoTracking();
        }

        return query.FirstOrDefaultAsync(
            step => step.Id == stepId && step.RecipeId == recipeId,
            cancellationToken);
    }

    public async Task<int> GetNextStepNumberAsync(
        Guid recipeId,
        CancellationToken cancellationToken = default)
    {
        var maxStepNumber = await dbContext.RecipeSteps
            .Where(step => step.RecipeId == recipeId)
            .Select(step => (int?)step.StepNumber)
            .MaxAsync(cancellationToken);

        return (maxStepNumber ?? 0) + 1;
    }

    public void Add(RecipeStep step) => dbContext.RecipeSteps.Add(step);

    public void Remove(RecipeStep step) => dbContext.RecipeSteps.Remove(step);
}
