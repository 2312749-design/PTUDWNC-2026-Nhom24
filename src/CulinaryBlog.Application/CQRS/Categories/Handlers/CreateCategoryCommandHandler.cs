using CulinaryBlog.Application.CQRS.Categories.Commands;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.Interfaces; // Dùng Interface chuẩn Clean Architecture
using CulinaryBlog.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.CQRS.Categories.Handlers;

public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, CategoryDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICacheService _cache;

    public CreateCategoryCommandHandler(IApplicationDbContext context, ICacheService cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<CategoryDto> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        var name = request.Name?.Trim() ?? string.Empty;
        var slug = Category.CreateSlug(name);
        if (await _context.Categories.AnyAsync(category =>
            category.Name.ToUpper() == name.ToUpper() || category.Slug == slug, cancellationToken))
        {
            throw new CulinaryBlog.Domain.Exceptions.ConflictException("Tên hoặc slug danh mục đã tồn tại.");
        }

        var category = Category.Create(name, request.Description, request.ImageUrl);

        _context.Categories.Add(category);
        await _context.SaveChangesAsync(cancellationToken);
        await _cache.RemoveAsync(CacheKeys.Categories, cancellationToken);

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
