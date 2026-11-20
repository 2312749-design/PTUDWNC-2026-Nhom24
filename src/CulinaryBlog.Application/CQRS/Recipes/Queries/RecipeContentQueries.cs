using CulinaryBlog.Application.DTOs;
using MediatR;

namespace CulinaryBlog.Application.CQRS.Recipes.Queries;

public sealed record GetRecipeIngredientsQuery(Guid RecipeId, string? UserId, bool IsAdmin)
    : IRequest<IReadOnlyList<RecipeIngredientDto>?>;
public sealed record GetRecipeStepsQuery(Guid RecipeId, string? UserId, bool IsAdmin)
    : IRequest<IReadOnlyList<RecipeStepDto>?>;
