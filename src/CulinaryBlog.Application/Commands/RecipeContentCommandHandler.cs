using CulinaryBlog.Application.Abstractions;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Exceptions;

namespace CulinaryBlog.Application.Commands;

public sealed class RecipeContentCommandHandler(IUnitOfWork unitOfWork)
{
    public async Task<RecipeIngredient> HandleAsync(
        AddRecipeIngredientCommand command,
        CancellationToken cancellationToken = default)
    {
        var ingredient = new RecipeIngredient
        {
            Id = Guid.NewGuid(),
            RecipeId = command.RecipeId,
            Name = command.Name,
            Quantity = command.Quantity,
            Unit = command.Unit,
            Notes = command.Notes,
            OrderIndex = command.OrderIndex
        };

        unitOfWork.RecipeIngredients.Add(ingredient);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return ingredient;
    }

    public async Task<RecipeIngredient> HandleAsync(
        UpdateRecipeIngredientCommand command,
        CancellationToken cancellationToken = default)
    {
        var ingredient = await unitOfWork.RecipeIngredients.GetByIdAsync(
            command.RecipeId,
            command.IngredientId,
            trackChanges: true,
            cancellationToken)
            ?? throw new NotFoundException("Không tìm thấy nguyên liệu.");

        ingredient.Name = command.Name;
        ingredient.Quantity = command.Quantity;
        ingredient.Unit = command.Unit;
        ingredient.Notes = command.Notes;
        ingredient.OrderIndex = command.OrderIndex;
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return ingredient;
    }

    public async Task HandleAsync(
        DeleteRecipeIngredientCommand command,
        CancellationToken cancellationToken = default)
    {
        var ingredient = await unitOfWork.RecipeIngredients.GetByIdAsync(
            command.RecipeId,
            command.IngredientId,
            trackChanges: true,
            cancellationToken)
            ?? throw new NotFoundException("Không tìm thấy nguyên liệu.");

        unitOfWork.RecipeIngredients.Remove(ingredient);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task<RecipeStep> HandleAsync(
        AddRecipeStepCommand command,
        CancellationToken cancellationToken = default)
    {
        var step = new RecipeStep
        {
            Id = Guid.NewGuid(),
            RecipeId = command.RecipeId,
            StepNumber = await unitOfWork.RecipeSteps.GetNextStepNumberAsync(
                command.RecipeId,
                cancellationToken),
            Title = command.Title,
            Description = command.Description,
            TimerMinutes = command.TimerMinutes,
            ImageUrl = command.ImageUrl
        };

        unitOfWork.RecipeSteps.Add(step);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return step;
    }

    public async Task<RecipeStep> HandleAsync(
        UpdateRecipeStepCommand command,
        CancellationToken cancellationToken = default)
    {
        var step = await unitOfWork.RecipeSteps.GetByIdAsync(
            command.RecipeId,
            command.StepId,
            trackChanges: true,
            cancellationToken)
            ?? throw new NotFoundException("Không tìm thấy bước làm.");

        step.Title = command.Title;
        step.Description = command.Description;
        step.TimerMinutes = command.TimerMinutes;
        step.ImageUrl = command.ImageUrl;
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return step;
    }

    public async Task HandleAsync(
        DeleteRecipeStepCommand command,
        CancellationToken cancellationToken = default)
    {
        var step = await unitOfWork.RecipeSteps.GetByIdAsync(
            command.RecipeId,
            command.StepId,
            trackChanges: true,
            cancellationToken)
            ?? throw new NotFoundException("Không tìm thấy bước làm.");
        var remainingSteps = await unitOfWork.RecipeSteps.GetByRecipeAsync(
            command.RecipeId,
            trackChanges: true,
            cancellationToken);

        unitOfWork.RecipeSteps.Remove(step);
        var stepNumber = 1;
        foreach (var remainingStep in remainingSteps.Where(
                     item => item.Id != command.StepId))
        {
            remainingStep.StepNumber = stepNumber++;
        }

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
