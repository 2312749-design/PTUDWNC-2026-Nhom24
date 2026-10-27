using CulinaryBlog.Application.CQRS.Recipes.Commands;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Exceptions;
using MediatR;

namespace CulinaryBlog.Application.CQRS.Recipes.Handlers;

public class CreateRecipeCommandHandler : IRequestHandler<CreateRecipeCommand, RecipeDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICacheService _cache;

    public CreateRecipeCommandHandler(IUnitOfWork unitOfWork, ICacheService cache)
    {
        _unitOfWork = unitOfWork;
        _cache = cache;
    }

    public async Task<RecipeDto> Handle(CreateRecipeCommand request, CancellationToken cancellationToken)
    {
        // 1. Kiểm tra Category có tồn tại không
        var categoryExists = await _unitOfWork.Repository<Category>().ExistsAsync(c => c.Id == request.CategoryId && !c.IsDeleted, cancellationToken);
        if (!categoryExists)
        {
            throw new NotFoundException("Danh mục (CategoryId) không tồn tại trong hệ thống.");
        }

        // JSON clients may explicitly send a collection as null. Treat it as an
        // empty collection so the domain validation returns a useful 400 instead
        // of leaking a NullReferenceException as a 500 response.
        var ingredientInputs = (request.RecipeIngredients ?? [])
            .Where(item => !string.IsNullOrWhiteSpace(item.Name))
            .Select((item, index) => new { Item = item, Index = index })
            .OrderBy(entry => entry.Item.OrderIndex ?? entry.Index + 1)
            .ThenBy(entry => entry.Index)
            .Select(entry => entry.Item)
            .ToList();

        if (ingredientInputs.Count == 0)
        {
            ingredientInputs = (request.Ingredients ?? [])
                .Where(item => !string.IsNullOrWhiteSpace(item))
                .Select((item, index) => new CreateRecipeIngredientDto { Name = item, OrderIndex = index + 1 })
                .ToList();
        }

        var stepInputs = (request.RecipeSteps ?? [])
            .Where(item => !string.IsNullOrWhiteSpace(item.Description))
            .ToList();

        if (stepInputs.Count == 0)
        {
            stepInputs = (request.Instructions ?? [])
                .Where(item => !string.IsNullOrWhiteSpace(item))
                .Select(item => new CreateRecipeStepDto { Description = item })
                .ToList();
        }

        var ingredientNames = ingredientInputs.Select(item => item.Name.Trim()).ToList();
        var stepDescriptions = stepInputs.Select(item => item.Description.Trim()).ToList();
        Recipe.EnsureMinimumContent(ingredientNames.Count, stepDescriptions.Count);
        var recipe = Recipe.Create(
            request.Title,
            request.Description,
            ingredientNames,
            stepDescriptions,
            request.CategoryId,
            request.AuthorId,
            request.ImageUrl,
            difficulty: request.Difficulty,
            isVegetarian: request.IsVegetarian,
            prepTimeMinutes: request.PrepTimeMinutes,
            cookTimeMinutes: request.CookTimeMinutes,
            servings: request.Servings);

        var slugBase = Recipe.CreateSlug(request.Title);
        var slug = slugBase;
        var suffix = 2;
        while (await _unitOfWork.Repository<Recipe>().ExistsAsync(existing => existing.Slug == slug, cancellationToken))
        {
            slug = $"{slugBase}-{suffix++}";
        }
        recipe.SetSlug(slug);

        recipe.SetNutrition(request.Nutrition == null ? null : new RecipeNutrition(
            request.Nutrition.Calories,
            request.Nutrition.Protein,
            request.Nutrition.Carbohydrates,
            request.Nutrition.Fat,
            request.Nutrition.Fiber,
            request.Nutrition.Sodium));

        var recipeIngredients = ingredientInputs
            .Select((item, index) => RecipeIngredient.Create(
                recipe.Id,
                item.Name,
                item.Quantity,
                item.Unit,
                item.Notes,
                index + 1))
            .ToList();
        var recipeSteps = stepInputs
            .Select((item, index) => RecipeStep.Create(
                recipe.Id,
                item.Title,
                item.Description,
                index + 1,
                item.TimerMinutes,
                item.ImageUrl))
            .ToList();
        foreach (var ingredient in recipeIngredients) await _unitOfWork.Repository<RecipeIngredient>().AddAsync(ingredient, cancellationToken);
        foreach (var step in recipeSteps) await _unitOfWork.Repository<RecipeStep>().AddAsync(step, cancellationToken);

        // Persist the recipe and its structured children together.
        await _unitOfWork.Repository<Recipe>().AddAsync(recipe, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        await _cache.RemoveAsync(CacheKeys.Recipes, cancellationToken);

        // 4. Trả về Response DTO
        return new RecipeDto
        {
            Id = recipe.Id,
            Title = recipe.Title,
            Slug = recipe.Slug,
            Description = recipe.Description,
            ImageUrl = recipe.ImageUrl,
            Ingredients = recipe.Ingredients,
            Instructions = recipe.Instructions,
            RecipeIngredients = recipeIngredients.Select(ingredient => new RecipeIngredientDto
            {
                Id = ingredient.Id,
                RecipeId = recipe.Id,
                Name = ingredient.Name,
                Quantity = ingredient.Quantity,
                Unit = ingredient.Unit,
                Notes = ingredient.Notes,
                OrderIndex = ingredient.OrderIndex
            }).ToList(),
            RecipeSteps = recipeSteps.Select(step => new RecipeStepDto
            {
                Id = step.Id,
                RecipeId = recipe.Id,
                Title = step.Title,
                Description = step.Description,
                StepNumber = step.StepNumber,
                TimerMinutes = step.TimerMinutes,
                ImageUrl = step.ImageUrl
            }).ToList(),
            CategoryId = recipe.CategoryId,
            AuthorId = recipe.AuthorId,
            Status = recipe.Status,
            CreatedAt = recipe.CreatedAt,
            UpdatedAt = recipe.UpdatedAt,
            PrepTimeMinutes = recipe.PrepTimeMinutes,
            CookTimeMinutes = recipe.CookTimeMinutes,
            Servings = recipe.Servings,
            CookingTimeMinutes = recipe.CookingTimeMinutes,
            Difficulty = recipe.Difficulty,
            IsVegetarian = recipe.IsVegetarian,
            Nutrition = recipe.Nutrition == null ? null : new RecipeNutritionDto
            {
                Calories = recipe.Nutrition.Calories,
                Protein = recipe.Nutrition.Protein,
                Carbohydrates = recipe.Nutrition.Carbohydrates,
                Fat = recipe.Nutrition.Fat,
                Fiber = recipe.Nutrition.Fiber,
                Sodium = recipe.Nutrition.Sodium
            }
        };
    }
}
