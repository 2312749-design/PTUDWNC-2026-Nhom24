using CulinaryBlog.Application.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.CQRS.Recipes.Commands;

public sealed record UploadRecipeImageCommand(Guid RecipeId, string CurrentUserId, bool IsAdmin, byte[] Content, string? AltText, bool? Primary)
    : IRequest<RecipeImageWorkflowResult>;
public sealed record UpdateRecipeImageCommand(Guid RecipeId, Guid ImageId, string CurrentUserId, bool IsAdmin, string? AltText, bool? IsPrimary, int? OrderIndex)
    : IRequest<RecipeImageWorkflowResult>;
public sealed record DeleteRecipeImageCommand(Guid RecipeId, Guid ImageId, string CurrentUserId, bool IsAdmin) : IRequest;

