using CulinaryBlog.Application.CQRS.Categories.Commands;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Exceptions;
using MediatR;

namespace CulinaryBlog.Application.CQRS.Categories.Handlers;

/// <summary>
/// Soft-deletes a category only when no active recipe still refers to it.
/// The invariant belongs in the application layer so every transport follows
/// the same rule.
/// </summary>
public sealed class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICacheService _cache;

    public DeleteCategoryCommandHandler(IUnitOfWork unitOfWork, ICacheService cache)
    {
        _unitOfWork = unitOfWork;
        _cache = cache;
    }

    public async Task Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        var categories = _unitOfWork.Repository<Category>();
        var category = await categories.GetByIdAsync(request.Id, cancellationToken);
        if (category is null || category.IsDeleted)
            throw new NotFoundException("Không tìm thấy danh mục cần xóa.");

        var hasActiveRecipe = await _unitOfWork.Repository<Recipe>()
            .ExistsAsync(recipe => recipe.CategoryId == request.Id && !recipe.IsDeleted, cancellationToken);
        if (hasActiveRecipe)
            throw new ConflictException("Không thể xóa danh mục khi còn công thức đang hoạt động.");

        category.SoftDelete();
        await categories.UpdateAsync(category, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        await CategoryCacheInvalidator.InvalidateAsync(_cache, category.Id, cancellationToken);
    }
}
