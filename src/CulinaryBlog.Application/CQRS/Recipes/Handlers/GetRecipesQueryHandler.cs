using CulinaryBlog.Application.CQRS.Recipes.Queries;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.CQRS.Recipes.Handlers;

public class GetRecipesQueryHandler : IRequestHandler<GetRecipesQuery, IEnumerable<RecipeDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICacheService _cache;

    public GetRecipesQueryHandler(IUnitOfWork unitOfWork, ICacheService cache)
    {
        _unitOfWork = unitOfWork;
        _cache = cache;
    }

    public async Task<IEnumerable<RecipeDto>> Handle(GetRecipesQuery request, CancellationToken cancellationToken)
    {
        var cached = await _cache.GetAsync<IEnumerable<RecipeDto>>(CacheKeys.Recipes, cancellationToken);
        if (cached != null && cached.All(recipe => recipe.CreatedAt != default))
            return cached.OrderByDescending(recipe => recipe.CreatedAt).ThenBy(recipe => recipe.Id).ToList();

        var allRecipes = await _unitOfWork.Repository<CulinaryBlog.Domain.Entities.Recipe>().GetAllAsync(cancellationToken);
        var categories = await _unitOfWork.Repository<CulinaryBlog.Domain.Entities.Category>().GetAllAsync(cancellationToken);
        var categoryById = categories.ToDictionary(category => category.Id);
        var recipes = allRecipes
            .Where(r => !r.IsDeleted && r.Status == CulinaryBlog.Domain.Entities.RecipeStatus.Published && categoryById.TryGetValue(r.CategoryId, out var category) && !category.IsDeleted && category.IsVisible)
            .OrderByDescending(r => r.CreatedAt)
            .ThenBy(r => r.Id)
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
                CategoryName = categoryById[r.CategoryId].Name,
                AuthorId = r.AuthorId,
                Status = r.Status,
                CreatedAt = r.CreatedAt,
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
            .ToList();
        await _cache.SetAsync(CacheKeys.Recipes, recipes, TimeSpan.FromMinutes(5), cancellationToken);
        return recipes;
    }
}
