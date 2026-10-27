using CulinaryBlog.Application.CQRS.Categories.Commands;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Exceptions;
using MediatR;

namespace CulinaryBlog.Application.CQRS.Categories.Handlers;

public sealed class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, CategoryDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICacheService _cache;

    public CreateCategoryCommandHandler(IUnitOfWork unitOfWork, ICacheService cache)
    {
        _unitOfWork = unitOfWork;
        _cache = cache;
    }

    public async Task<CategoryDto> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        var name = request.Name?.Trim() ?? string.Empty;
        var slug = Category.CreateSlug(name);
        var categories = _unitOfWork.Repository<Category>();
        if (await categories.ExistsAsync(category =>
            category.Name.ToUpper() == name.ToUpper() || category.Slug == slug, cancellationToken))
        {
            throw new ConflictException("Tên hoặc slug danh mục đã tồn tại.");
        }

        var category = Category.Create(name, request.Description, request.ImageUrl);
        await categories.AddAsync(category, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        await CategoryCacheInvalidator.InvalidateAsync(_cache, category.Id, cancellationToken);

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Slug = category.Slug,
            Description = category.Description,
            ImageUrl = category.ImageUrl
        };
    }
}
