using CulinaryBlog.Application.CQRS.Recipes.Commands;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Exceptions;
using MediatR;

namespace CulinaryBlog.Application.CQRS.Recipes.Handlers;

public sealed class RecipeImageCommandHandlers(IUnitOfWork unitOfWork, IRecipeImageWorkflow workflow) :
    IRequestHandler<UploadRecipeImageCommand, RecipeImageWorkflowResult>,
    IRequestHandler<UpdateRecipeImageCommand, RecipeImageWorkflowResult>,
    IRequestHandler<DeleteRecipeImageCommand>
{
    public async Task<RecipeImageWorkflowResult> Handle(UploadRecipeImageCommand request, CancellationToken cancellationToken)
    {
        await EnsureCanManageAsync(request.RecipeId, request.CurrentUserId, request.IsAdmin, cancellationToken);
        return await workflow.UploadAsync(request.RecipeId, request.Content, request.AltText, request.Primary, cancellationToken);
    }

    public async Task<RecipeImageWorkflowResult> Handle(UpdateRecipeImageCommand request, CancellationToken cancellationToken)
    {
        await EnsureCanManageAsync(request.RecipeId, request.CurrentUserId, request.IsAdmin, cancellationToken);
        return await workflow.UpdateAsync(request.RecipeId, request.ImageId, request.AltText, request.IsPrimary, request.OrderIndex, cancellationToken);
    }

    public async Task Handle(DeleteRecipeImageCommand request, CancellationToken cancellationToken)
    {
        await EnsureCanManageAsync(request.RecipeId, request.CurrentUserId, request.IsAdmin, cancellationToken);
        await workflow.DeleteAsync(request.RecipeId, request.ImageId, cancellationToken);
    }

    private async Task EnsureCanManageAsync(Guid recipeId, string userId, bool isAdmin, CancellationToken cancellationToken)
    {
        var recipe = await unitOfWork.Repository<Recipe>().GetByIdAsync(recipeId, cancellationToken);
        if (recipe is null || recipe.IsDeleted) throw new NotFoundException("Không tìm thấy công thức.");
        if (!isAdmin && recipe.AuthorId != userId) throw new ForbiddenException("Bạn không có quyền quản lý ảnh của công thức này.");
    }
}

