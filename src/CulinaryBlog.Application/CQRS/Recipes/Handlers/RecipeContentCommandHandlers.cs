using CulinaryBlog.Application.CQRS.Recipes.Commands;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Exceptions;
using MediatR;

namespace CulinaryBlog.Application.CQRS.Recipes.Handlers;

public sealed class RecipeContentCommandHandlers(IUnitOfWork unitOfWork, IRecipeContentService contentService) :
    IRequestHandler<CreateRecipeIngredientCommand, RecipeIngredientDto>,
    IRequestHandler<UpdateRecipeIngredientCommand>,
    IRequestHandler<DeleteRecipeIngredientCommand>,
    IRequestHandler<CreateRecipeStepCommand, RecipeStepDto>,
    IRequestHandler<UpdateRecipeStepCommand>,
    IRequestHandler<DeleteRecipeStepCommand>
{
    public async Task<RecipeIngredientDto> Handle(CreateRecipeIngredientCommand request, CancellationToken cancellationToken)
    {
        await EnsureCanManageAsync(request.RecipeId, request.CurrentUserId, request.IsAdmin, cancellationToken);
        return await contentService.CreateIngredientAsync(request.RecipeId, request.Input, cancellationToken);
    }

    public async Task Handle(UpdateRecipeIngredientCommand request, CancellationToken cancellationToken)
    {
        await EnsureCanManageAsync(request.RecipeId, request.CurrentUserId, request.IsAdmin, cancellationToken);
        await contentService.UpdateIngredientAsync(request.RecipeId, request.Id, request.Input, cancellationToken);
    }

    public async Task Handle(DeleteRecipeIngredientCommand request, CancellationToken cancellationToken)
    {
        await EnsureCanManageAsync(request.RecipeId, request.CurrentUserId, request.IsAdmin, cancellationToken);
        var count = (await unitOfWork.Repository<RecipeIngredient>().ListAsync(item => item.RecipeId == request.RecipeId, cancellationToken)).Count;
        if (count <= Recipe.MinimumIngredientCount)
            throw new ValidationException($"Mỗi công thức phải giữ ít nhất {Recipe.MinimumIngredientCount} nguyên liệu.");
        await contentService.DeleteIngredientAsync(request.RecipeId, request.Id, cancellationToken);
    }

    public async Task<RecipeStepDto> Handle(CreateRecipeStepCommand request, CancellationToken cancellationToken)
    {
        await EnsureCanManageAsync(request.RecipeId, request.CurrentUserId, request.IsAdmin, cancellationToken);
        return await contentService.CreateStepAsync(request.RecipeId, request.Input, cancellationToken);
    }

    public async Task Handle(UpdateRecipeStepCommand request, CancellationToken cancellationToken)
    {
        await EnsureCanManageAsync(request.RecipeId, request.CurrentUserId, request.IsAdmin, cancellationToken);
        await contentService.UpdateStepAsync(request.RecipeId, request.Id, request.Input, cancellationToken);
    }

    public async Task Handle(DeleteRecipeStepCommand request, CancellationToken cancellationToken)
    {
        await EnsureCanManageAsync(request.RecipeId, request.CurrentUserId, request.IsAdmin, cancellationToken);
        var count = (await unitOfWork.Repository<RecipeStep>().ListAsync(item => item.RecipeId == request.RecipeId, cancellationToken)).Count;
        if (count <= Recipe.MinimumStepCount)
            throw new ValidationException($"Mỗi công thức phải giữ ít nhất {Recipe.MinimumStepCount} bước nấu.");
        await contentService.DeleteStepAsync(request.RecipeId, request.Id, cancellationToken);
    }

    private async Task EnsureCanManageAsync(Guid recipeId, string currentUserId, bool isAdmin, CancellationToken cancellationToken)
    {
        var recipe = await unitOfWork.Repository<Recipe>().GetByIdAsync(recipeId, cancellationToken);
        if (recipe is null || recipe.IsDeleted) throw new NotFoundException("Không tìm thấy công thức.");
        if (!isAdmin && recipe.AuthorId != currentUserId) throw new ForbiddenException("Bạn không có quyền sửa công thức này.");
    }
}

