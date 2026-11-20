using CulinaryBlog.Application.CQRS.Recipes.Queries;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using MediatR;

namespace CulinaryBlog.Application.CQRS.Recipes.Handlers;

public sealed class RecipeContentQueryHandlers(IUnitOfWork unitOfWork)
    : IRequestHandler<GetRecipeIngredientsQuery, IReadOnlyList<RecipeIngredientDto>?>,
      IRequestHandler<GetRecipeStepsQuery, IReadOnlyList<RecipeStepDto>?>
{
    private async Task<bool> CanRead(Guid id, string? userId, bool isAdmin, CancellationToken token)
    {
        var recipe = await unitOfWork.Repository<Recipe>().GetByIdAsync(id, token);
        if (recipe is null || recipe.IsDeleted) return false;
        if (isAdmin || recipe.AuthorId == userId) return true;
        if (recipe.Status != RecipeStatus.Published) return false;
        var category = await unitOfWork.Repository<Category>().GetByIdAsync(recipe.CategoryId, token);
        return category is { IsDeleted: false, IsVisible: true };
    }

    public async Task<IReadOnlyList<RecipeIngredientDto>?> Handle(GetRecipeIngredientsQuery request, CancellationToken cancellationToken)
    {
        if (!await CanRead(request.RecipeId, request.UserId, request.IsAdmin, cancellationToken)) return null;
        var rows = await unitOfWork.Repository<RecipeIngredient>().ListAsync(x => x.RecipeId == request.RecipeId, cancellationToken);
        return rows.OrderBy(x => x.OrderIndex).Select(x => new RecipeIngredientDto
        { Id = x.Id, RecipeId = x.RecipeId, Name = x.Name, Quantity = x.Quantity, Unit = x.Unit, Notes = x.Notes, OrderIndex = x.OrderIndex }).ToList();
    }

    public async Task<IReadOnlyList<RecipeStepDto>?> Handle(GetRecipeStepsQuery request, CancellationToken cancellationToken)
    {
        if (!await CanRead(request.RecipeId, request.UserId, request.IsAdmin, cancellationToken)) return null;
        var rows = await unitOfWork.Repository<RecipeStep>().ListAsync(x => x.RecipeId == request.RecipeId, cancellationToken);
        return rows.OrderBy(x => x.StepNumber).Select(x => new RecipeStepDto
        { Id = x.Id, RecipeId = x.RecipeId, Title = x.Title, Description = x.Description, StepNumber = x.StepNumber, TimerMinutes = x.TimerMinutes, ImageUrl = x.ImageUrl }).ToList();
    }
}
