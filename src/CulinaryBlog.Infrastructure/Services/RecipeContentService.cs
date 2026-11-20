using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Exceptions;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Infrastructure.Services;

public sealed class RecipeContentService(ApplicationDbContext context) : IRecipeContentService
{
    public async Task<RecipeIngredientDto> CreateIngredientAsync(Guid recipeId, CreateRecipeIngredientDto input, CancellationToken cancellationToken)
    {
        var order = await context.RecipeIngredients.CountAsync(item => item.RecipeId == recipeId, cancellationToken) + 1;
        var item = RecipeIngredient.Create(recipeId, input.Name, input.Quantity, input.Unit, input.Notes, order);
        context.RecipeIngredients.Add(item);
        (await context.Recipes.FindAsync([recipeId], cancellationToken))!.Touch();
        await context.SaveChangesAsync(cancellationToken);
        return ToDto(item);
    }

    public async Task UpdateIngredientAsync(Guid recipeId, Guid id, UpdateRecipeIngredientDto input, CancellationToken cancellationToken)
    {
        var item = await context.RecipeIngredients.FirstOrDefaultAsync(row => row.Id == id && row.RecipeId == recipeId, cancellationToken)
            ?? throw new NotFoundException("Không tìm thấy nguyên liệu cần cập nhật.");
        item.Update(input.Name, input.Quantity, input.Unit, input.Notes, item.OrderIndex);
        (await context.Recipes.FindAsync([recipeId], cancellationToken))!.Touch();
        await context.SaveChangesAsync(cancellationToken);
        if (input.OrderIndex.HasValue && input.OrderIndex.Value != item.OrderIndex)
        {
            var rows = await context.RecipeIngredients.Where(row => row.RecipeId == recipeId).OrderBy(row => row.OrderIndex).ToListAsync(cancellationToken);
            rows.Remove(item);
            rows.Insert(Math.Clamp(input.OrderIndex.Value, 1, rows.Count + 1) - 1, item);
            await ReindexIngredientsAsync(recipeId, rows, cancellationToken);
        }
    }

    public async Task DeleteIngredientAsync(Guid recipeId, Guid id, CancellationToken cancellationToken)
    {
        var item = await context.RecipeIngredients.FirstOrDefaultAsync(row => row.Id == id && row.RecipeId == recipeId, cancellationToken)
            ?? throw new NotFoundException("Không tìm thấy nguyên liệu cần xóa.");
        context.RecipeIngredients.Remove(item);
        (await context.Recipes.FindAsync([recipeId], cancellationToken))!.Touch();
        await context.SaveChangesAsync(cancellationToken);
        var rows = await context.RecipeIngredients.Where(row => row.RecipeId == recipeId).OrderBy(row => row.OrderIndex).ToListAsync(cancellationToken);
        await ReindexIngredientsAsync(recipeId, rows, cancellationToken);
    }

    public async Task<RecipeStepDto> CreateStepAsync(Guid recipeId, CreateRecipeStepDto input, CancellationToken cancellationToken)
    {
        var number = await context.RecipeSteps.CountAsync(item => item.RecipeId == recipeId, cancellationToken) + 1;
        var item = RecipeStep.Create(recipeId, input.Title, input.Description, number, input.TimerMinutes, input.ImageUrl);
        context.RecipeSteps.Add(item);
        (await context.Recipes.FindAsync([recipeId], cancellationToken))!.Touch();
        await context.SaveChangesAsync(cancellationToken);
        return ToDto(item);
    }

    public async Task UpdateStepAsync(Guid recipeId, Guid id, UpdateRecipeStepDto input, CancellationToken cancellationToken)
    {
        var item = await context.RecipeSteps.FirstOrDefaultAsync(row => row.Id == id && row.RecipeId == recipeId, cancellationToken)
            ?? throw new NotFoundException("Không tìm thấy bước làm cần cập nhật.");
        item.Update(input.Title, input.Description, input.TimerMinutes, input.ImageUrl);
        (await context.Recipes.FindAsync([recipeId], cancellationToken))!.Touch();
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteStepAsync(Guid recipeId, Guid id, CancellationToken cancellationToken)
    {
        var item = await context.RecipeSteps.FirstOrDefaultAsync(row => row.Id == id && row.RecipeId == recipeId, cancellationToken)
            ?? throw new NotFoundException("Không tìm thấy bước làm cần xóa.");
        context.RecipeSteps.Remove(item);
        (await context.Recipes.FindAsync([recipeId], cancellationToken))!.Touch();
        await context.SaveChangesAsync(cancellationToken);
        var rows = await context.RecipeSteps.Where(row => row.RecipeId == recipeId).OrderBy(row => row.StepNumber).ToListAsync(cancellationToken);
        await ReindexStepsAsync(recipeId, rows, cancellationToken);
    }

    private async Task ReindexIngredientsAsync(Guid recipeId, List<RecipeIngredient> rows, CancellationToken token)
    {
        if (!context.Database.IsRelational())
        {
            for (var index = 0; index < rows.Count; index++) rows[index].Update(rows[index].Name, rows[index].Quantity, rows[index].Unit, rows[index].Notes, index + 1);
            await context.SaveChangesAsync(token);
            return;
        }
        await context.RecipeIngredients.Where(item => item.RecipeId == recipeId)
            .ExecuteUpdateAsync(setters => setters.SetProperty(item => item.OrderIndex, item => item.OrderIndex + 1_000_000), token);
        for (var index = 0; index < rows.Count; index++)
        {
            var id = rows[index].Id;
            var order = index + 1;
            await context.RecipeIngredients.Where(item => item.Id == id)
                .ExecuteUpdateAsync(setters => setters.SetProperty(item => item.OrderIndex, order), token);
        }
        context.ChangeTracker.Clear();
    }

    private async Task ReindexStepsAsync(Guid recipeId, List<RecipeStep> rows, CancellationToken token)
    {
        if (!context.Database.IsRelational())
        {
            for (var index = 0; index < rows.Count; index++) rows[index].SetStepNumber(index + 1);
            await context.SaveChangesAsync(token);
            return;
        }
        await context.RecipeSteps.Where(item => item.RecipeId == recipeId)
            .ExecuteUpdateAsync(setters => setters.SetProperty(item => item.StepNumber, item => item.StepNumber + 1_000_000), token);
        for (var index = 0; index < rows.Count; index++)
        {
            var id = rows[index].Id;
            var number = index + 1;
            await context.RecipeSteps.Where(item => item.Id == id)
                .ExecuteUpdateAsync(setters => setters.SetProperty(item => item.StepNumber, number), token);
        }
        context.ChangeTracker.Clear();
    }

    private static RecipeIngredientDto ToDto(RecipeIngredient item) => new()
    {
        Id = item.Id, RecipeId = item.RecipeId, Name = item.Name, Quantity = item.Quantity,
        Unit = item.Unit, Notes = item.Notes, OrderIndex = item.OrderIndex
    };

    private static RecipeStepDto ToDto(RecipeStep item) => new()
    {
        Id = item.Id, RecipeId = item.RecipeId, Title = item.Title, Description = item.Description,
        StepNumber = item.StepNumber, TimerMinutes = item.TimerMinutes, ImageUrl = item.ImageUrl
    };
}

