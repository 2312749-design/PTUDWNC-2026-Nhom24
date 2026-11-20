using CulinaryBlog.Application.CQRS.Categories.Queries;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Application.Mapping;
using CulinaryBlog.Domain.Entities;
using MediatR;

namespace CulinaryBlog.Application.CQRS.Categories.Handlers;

public sealed class GetCategoryDetailQueryHandler(IUnitOfWork work)
    : IRequestHandler<GetCategoryDetailQuery, CategoryDetailDto?>
{
    public async Task<CategoryDetailDto?> Handle(GetCategoryDetailQuery request, CancellationToken cancellationToken)
    {
        var categories = await work.Repository<Category>().ListAsync(category => !category.IsDeleted
            && (request.Id.HasValue ? category.Id == request.Id.Value : category.Slug == request.Slug)
            && (category.IsVisible || request.IsAdmin), cancellationToken);
        var category = categories.FirstOrDefault();
        if (category is null) return null;
        var rows = await work.Repository<Recipe>().ListAsync(recipe => !recipe.IsDeleted
            && recipe.CategoryId == category.Id && (request.IsAdmin || recipe.Status == RecipeStatus.Published), cancellationToken);
        var recipes = rows.OrderByDescending(recipe => recipe.UpdatedAt).Select(recipe => recipe.ToDto(category.Name)).ToList();
        return new CategoryDetailDto(new CategoryDto
        {
            Id = category.Id, Name = category.Name, Slug = category.Slug, Description = category.Description,
            ImageUrl = category.ImageUrl, RecipeCount = recipes.Count,
            PublishedRecipeCount = recipes.Count(recipe => recipe.Status == RecipeStatus.Published)
        }, recipes.Count, recipes);
    }
}
