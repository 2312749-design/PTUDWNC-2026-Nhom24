using CulinaryBlog.Application.CQRS.Categories.Queries;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using MediatR;

namespace CulinaryBlog.Application.CQRS.Categories.Handlers;

public sealed class GetCategoriesQueryHandler : IRequestHandler<GetCategoriesQuery, IEnumerable<CategoryDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICacheService _cache;

    public GetCategoriesQueryHandler(IUnitOfWork unitOfWork, ICacheService cache)
    {
        _unitOfWork = unitOfWork;
        _cache = cache;
    }

    public async Task<IEnumerable<CategoryDto>> Handle(GetCategoriesQuery request, CancellationToken cancellationToken)
    {
        var cached = await _cache.GetAsync<IEnumerable<CategoryDto>>(CacheKeys.Categories, cancellationToken);
        if (cached is not null) return cached;

        // Categories are a small catalogue. The repository keeps EF Core out of
        // the application layer while this projection remains simple and cacheable.
        var categories = (await _unitOfWork.Repository<Category>().GetAllAsync(cancellationToken))
            .Where(category => !category.IsDeleted && category.IsVisible)
            .ToList();
        var recipes = await _unitOfWork.Repository<Recipe>().GetAllAsync(cancellationToken);
        var recipeCounts = recipes
            .Where(recipe => !recipe.IsDeleted)
            .GroupBy(recipe => recipe.CategoryId)
            .ToDictionary(group => group.Key, group => new
            {
                Total = group.Count(),
                Published = group.Count(recipe => recipe.Status == RecipeStatus.Published)
            });

        var result = categories
            .Select(category => new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Slug = category.Slug,
                Description = category.Description,
                ImageUrl = category.ImageUrl,
                RecipeCount = recipeCounts.TryGetValue(category.Id, out var count) ? count.Total : 0,
                PublishedRecipeCount = recipeCounts.TryGetValue(category.Id, out count) ? count.Published : 0
            })
            .ToList();

        await _cache.SetAsync(CacheKeys.Categories, result, TimeSpan.FromMinutes(10), cancellationToken);
        return result;
    }
}
