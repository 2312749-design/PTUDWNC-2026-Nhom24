using CulinaryBlog.Application.CQRS.Categories.Commands;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Exceptions;
using MediatR;

namespace CulinaryBlog.Application.CQRS.Categories.Handlers;

/// <summary>
/// Updates a category through the application boundary. The API project no
/// longer owns category persistence rules or talks directly to EF Core.
/// </summary>
public sealed class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand, CategoryDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICacheService _cache;

    public UpdateCategoryCommandHandler(IUnitOfWork unitOfWork, ICacheService cache)
    {
        _unitOfWork = unitOfWork;
        _cache = cache;
    }

    public async Task<CategoryDto> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var categories = _unitOfWork.Repository<Category>();
        var existing = await categories.GetByIdAsync(request.Id, cancellationToken);
        if (existing is null || existing.IsDeleted)
            throw new NotFoundException("Không tìm thấy danh mục cần cập nhật.");

        var name = request.Name?.Trim() ?? string.Empty;
        var slug = Category.CreateSlug(name);
        if (await categories.ExistsAsync(category => category.Id != request.Id &&
            (category.Name.ToUpper() == name.ToUpper() || category.Slug == slug), cancellationToken))
        {
            throw new ConflictException("Tên hoặc slug danh mục đã tồn tại.");
        }

        existing.Update(name, request.Description, request.ImageUrl);
        await categories.UpdateAsync(existing, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        await CategoryCacheInvalidator.InvalidateAsync(_cache, existing.Id, cancellationToken);

        return new CategoryDto
        {
            Id = existing.Id,
            Name = existing.Name,
            Slug = existing.Slug,
            Description = existing.Description,
            ImageUrl = existing.ImageUrl
        };
    }
}
