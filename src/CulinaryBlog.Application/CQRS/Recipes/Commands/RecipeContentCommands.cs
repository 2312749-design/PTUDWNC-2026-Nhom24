using CulinaryBlog.Application.DTOs;
using MediatR;

namespace CulinaryBlog.Application.CQRS.Recipes.Commands;

public sealed record CreateRecipeIngredientCommand(Guid RecipeId, string CurrentUserId, bool IsAdmin, CreateRecipeIngredientDto Input)
    : IRequest<RecipeIngredientDto>;
public sealed record UpdateRecipeIngredientCommand(Guid RecipeId, Guid Id, string CurrentUserId, bool IsAdmin, UpdateRecipeIngredientDto Input)
    : IRequest;
public sealed record DeleteRecipeIngredientCommand(Guid RecipeId, Guid Id, string CurrentUserId, bool IsAdmin)
    : IRequest;
public sealed record CreateRecipeStepCommand(Guid RecipeId, string CurrentUserId, bool IsAdmin, CreateRecipeStepDto Input)
    : IRequest<RecipeStepDto>;
public sealed record UpdateRecipeStepCommand(Guid RecipeId, Guid Id, string CurrentUserId, bool IsAdmin, UpdateRecipeStepDto Input)
    : IRequest;
public sealed record DeleteRecipeStepCommand(Guid RecipeId, Guid Id, string CurrentUserId, bool IsAdmin)
    : IRequest;

