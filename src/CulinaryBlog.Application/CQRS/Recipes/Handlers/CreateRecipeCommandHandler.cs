using CulinaryBlog.Application.CQRS.Recipes.Commands;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.Interfaces; // Dùng IApplicationDbContext chuẩn Clean Architecture
using CulinaryBlog.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.CQRS.Recipes.Handlers;

public class CreateRecipeCommandHandler : IRequestHandler<CreateRecipeCommand, RecipeDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICacheService _cache;

    public CreateRecipeCommandHandler(IApplicationDbContext context, ICacheService cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<RecipeDto> Handle(CreateRecipeCommand request, CancellationToken cancellationToken)
    {
        // 1. Kiểm tra Category có tồn tại không
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId, cancellationToken);
        if (!categoryExists)
        {
            throw new Exception("Danh mục (CategoryId) không tồn tại trong hệ thống!");
        }

        // 2. Sử dụng Domain Factory Method (Recipe.Create) theo thiết kế DDD hiện tại
        var recipe = Recipe.Create(
            request.Title,
            request.Description,
            request.Ingredients,
            request.Instructions,
            request.CategoryId,
            request.AuthorId,
            request.ImageUrl,
            request.CookingTimeMinutes,
            request.Difficulty,
            request.IsVegetarian
        );

        var recipeIngredients = request.RecipeIngredients
            .Where(item => !string.IsNullOrWhiteSpace(item.Name))
            .Select((ingredient, index) => RecipeIngredient.Create(
                recipe.Id,
                ingredient.Name,
                ingredient.Quantity,
                ingredient.Unit,
                ingredient.Order > 0 ? ingredient.Order : index + 1))
            .ToList();
        _context.RecipeIngredients.AddRange(recipeIngredients);

        var recipeSteps = request.RecipeSteps
            .Where(item => !string.IsNullOrWhiteSpace(item.Title) && !string.IsNullOrWhiteSpace(item.Description))
            .Select((step, index) => RecipeStep.Create(
                recipe.Id,
                step.Title,
                step.Description,
                step.Order > 0 ? step.Order : index + 1))
            .ToList();
        _context.RecipeSteps.AddRange(recipeSteps);

        // Persist the recipe and its structured children together.
        _context.Recipes.Add(recipe);
        await _context.SaveChangesAsync(cancellationToken);
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
                Order = ingredient.Order
            }).ToList(),
            RecipeSteps = recipeSteps.Select(step => new RecipeStepDto
            {
                Id = step.Id,
                RecipeId = recipe.Id,
                Title = step.Title,
                Description = step.Description,
                Order = step.Order
            }).ToList(),
            CategoryId = recipe.CategoryId,
            AuthorId = recipe.AuthorId,
            Status = recipe.Status,
            CookingTimeMinutes = recipe.CookingTimeMinutes,
            Difficulty = recipe.Difficulty,
            IsVegetarian = recipe.IsVegetarian
        };
    }
}