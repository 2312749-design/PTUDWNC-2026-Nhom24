using CulinaryBlog.Application.CQRS.Recipes.Queries;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.CQRS.Recipes.Handlers;

public class GetRecipesQueryHandler : IRequestHandler<GetRecipesQuery, IEnumerable<RecipeDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICacheService _cache;

    public GetRecipesQueryHandler(IApplicationDbContext context, ICacheService cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<IEnumerable<RecipeDto>> Handle(GetRecipesQuery request, CancellationToken cancellationToken)
    {
        var cached = await _cache.GetAsync<IEnumerable<RecipeDto>>(CacheKeys.Recipes, cancellationToken);
        if (cached != null) return cached;

        var recipes = await _context.Recipes
            .Where(r => !r.IsDeleted && r.Status == CulinaryBlog.Domain.Entities.RecipeStatus.Published && !r.Category.IsDeleted)
            .Include(r => r.Category)
            .Include(r => r.Author)
            .Select(r => new RecipeDto
            {
                Id = r.Id,
                Title = r.Title,
                Slug = r.Slug,
                Description = r.Description,
                ImageUrl = r.ImageUrl,
                Ingredients = r.Ingredients,
                Instructions = r.Instructions,
                CategoryId = r.CategoryId,
                CategoryName = r.Category != null ? r.Category.Name : string.Empty,
                AuthorId = r.AuthorId,
                Status = r.Status,
                UpdatedAt = r.UpdatedAt,
                PrepTimeMinutes = r.PrepTimeMinutes,
                CookTimeMinutes = r.CookTimeMinutes,
                Servings = r.Servings,
                CookingTimeMinutes = r.CookingTimeMinutes,
                Difficulty = r.Difficulty,
                IsVegetarian = r.IsVegetarian,
                Nutrition = r.Nutrition == null ? null : new RecipeNutritionDto
                {
                    Calories = r.Nutrition.Calories,
                    Protein = r.Nutrition.Protein,
                    Carbohydrates = r.Nutrition.Carbohydrates,
                    Fat = r.Nutrition.Fat,
                    Fiber = r.Nutrition.Fiber,
                    Sodium = r.Nutrition.Sodium
                }
            })
            .ToListAsync(cancellationToken);
        await _cache.SetAsync(CacheKeys.Recipes, recipes, TimeSpan.FromMinutes(5), cancellationToken);
        return recipes;
    }
}