using CulinaryBlog.Application.CQRS.Categories.Queries;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.Interfaces; // Sử dụng Interface thay vì tầng Infrastructure
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.CQRS.Categories.Handlers;

public class GetCategoriesQueryHandler : IRequestHandler<GetCategoriesQuery, IEnumerable<CategoryDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICacheService _cache;

    public GetCategoriesQueryHandler(IApplicationDbContext context, ICacheService cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<IEnumerable<CategoryDto>> Handle(GetCategoriesQuery request, CancellationToken cancellationToken)
    {
        var cached = await _cache.GetAsync<IEnumerable<CategoryDto>>(CacheKeys.Categories, cancellationToken);
        if (cached != null) return cached;

        var categories = await _context.Categories
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                ImageUrl = c.ImageUrl
            })
            .ToListAsync(cancellationToken);
        await _cache.SetAsync(CacheKeys.Categories, categories, TimeSpan.FromMinutes(10), cancellationToken);
        return categories;
    }
}