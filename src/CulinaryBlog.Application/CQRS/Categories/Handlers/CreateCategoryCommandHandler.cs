using CulinaryBlog.Application.CQRS.Categories.Commands;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.Interfaces; // Dùng Interface chuẩn Clean Architecture
using CulinaryBlog.Domain.Entities;
using MediatR;

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
        var category = new Category
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Description = request.Description?.Trim() ?? string.Empty,
            ImageUrl = request.ImageUrl
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync(cancellationToken);
        await _cache.RemoveAsync(CacheKeys.Categories, cancellationToken);

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            ImageUrl = category.ImageUrl
        };
    }
}