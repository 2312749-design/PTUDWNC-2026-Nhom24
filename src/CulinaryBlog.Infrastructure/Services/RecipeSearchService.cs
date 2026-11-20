using System.Globalization;
using System.Text;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Application.Models;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using NpgsqlTypes;

namespace CulinaryBlog.Infrastructure.Services;

public sealed class RecipeSearchService(ApplicationDbContext context) : IRecipeSearchService
{
    public async Task<RecipeSearchResult> SearchAsync(RecipeSearchCriteria criteria, CancellationToken cancellationToken = default)
    {
        var keyword = criteria.Query?.Trim() ?? string.Empty;
        var ingredient = criteria.Ingredient?.Trim() ?? string.Empty;
        var searchText = string.Join(' ', new[] { keyword, ingredient }.Where(value => value.Length > 0));
        var difficulty = string.IsNullOrWhiteSpace(criteria.Difficulty) ? null : Recipe.NormalizeDifficulty(criteria.Difficulty);
        var descending = criteria.SortOrder.Equals("desc", StringComparison.OrdinalIgnoreCase);

        var query = context.Recipes.AsNoTracking()
            .Where(recipe => !recipe.IsDeleted && recipe.Status == RecipeStatus.Published)
            .Include(recipe => recipe.Category)
            .Where(recipe => !recipe.Category.IsDeleted && recipe.Category.IsVisible);

        if (criteria.CategoryId.HasValue) query = query.Where(recipe => recipe.CategoryId == criteria.CategoryId.Value);
        if (criteria.MaxMinutes.HasValue) query = query.Where(recipe => recipe.CookTimeMinutes <= criteria.MaxMinutes.Value);
        if (criteria.MinServings.HasValue) query = query.Where(recipe => recipe.Servings >= criteria.MinServings.Value);
        if (difficulty is not null) query = query.Where(recipe => recipe.Difficulty == difficulty);
        if (criteria.Vegetarian.HasValue) query = query.Where(recipe => recipe.IsVegetarian == criteria.Vegetarian.Value);

        if (searchText.Length > 0 && context.Database.IsNpgsql())
        {
            var normalized = Normalize(searchText);
            query = query.Where(recipe => EF.Property<NpgsqlTsVector>(recipe, "SearchVector")
                .Matches(EF.Functions.WebSearchToTsQuery("simple", normalized)));
        }

        if (searchText.Length > 0 && !context.Database.IsNpgsql())
        {
            var matches = (await query.ToListAsync(cancellationToken))
                .Where(recipe => ContainsTerms(recipe, searchText));
            var orderedMatches = OrderInMemory(matches, criteria.SortBy, descending).ToList();
            return new RecipeSearchResult(
                orderedMatches.Count,
                criteria.Page,
                criteria.PageSize,
                orderedMatches.Skip((criteria.Page - 1) * criteria.PageSize).Take(criteria.PageSize).Select(ToDto).ToList());
        }

        var total = await query.CountAsync(cancellationToken);
        var items = await Order(query, criteria.SortBy, descending)
            .Skip((criteria.Page - 1) * criteria.PageSize)
            .Take(criteria.PageSize)
            .Select(recipe => new RecipeDto
            {
                Id = recipe.Id,
                Title = recipe.Title,
                Slug = recipe.Slug,
                Description = recipe.Description,
                ImageUrl = recipe.ImageUrl,
                Ingredients = recipe.Ingredients,
                Instructions = recipe.Instructions,
                CategoryId = recipe.CategoryId,
                CategoryName = recipe.Category.Name,
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
            })
            .ToListAsync(cancellationToken);
        return new RecipeSearchResult(total, criteria.Page, criteria.PageSize, items);
    }

    private static IOrderedQueryable<Recipe> Order(IQueryable<Recipe> query, string field, bool descending) => field.ToLowerInvariant() switch
    {
        "createdat" => descending ? query.OrderByDescending(recipe => recipe.CreatedAt).ThenBy(recipe => recipe.Id) : query.OrderBy(recipe => recipe.CreatedAt).ThenBy(recipe => recipe.Id),
        "cooktimeminutes" => descending ? query.OrderByDescending(recipe => recipe.CookTimeMinutes).ThenBy(recipe => recipe.Id) : query.OrderBy(recipe => recipe.CookTimeMinutes).ThenBy(recipe => recipe.Id),
        _ => descending ? query.OrderByDescending(recipe => recipe.Title).ThenBy(recipe => recipe.Id) : query.OrderBy(recipe => recipe.Title).ThenBy(recipe => recipe.Id)
    };

    private static IOrderedEnumerable<Recipe> OrderInMemory(IEnumerable<Recipe> recipes, string field, bool descending) => field.ToLowerInvariant() switch
    {
        "createdat" => descending ? recipes.OrderByDescending(recipe => recipe.CreatedAt).ThenBy(recipe => recipe.Id) : recipes.OrderBy(recipe => recipe.CreatedAt).ThenBy(recipe => recipe.Id),
        "cooktimeminutes" => descending ? recipes.OrderByDescending(recipe => recipe.CookTimeMinutes).ThenBy(recipe => recipe.Id) : recipes.OrderBy(recipe => recipe.CookTimeMinutes).ThenBy(recipe => recipe.Id),
        _ => descending ? recipes.OrderByDescending(recipe => recipe.Title).ThenBy(recipe => recipe.Id) : recipes.OrderBy(recipe => recipe.Title).ThenBy(recipe => recipe.Id)
    };

    private static bool ContainsTerms(Recipe recipe, string searchText)
    {
        var haystack = Normalize(string.Join(' ', recipe.Title, recipe.Description, string.Join(' ', recipe.Ingredients), string.Join(' ', recipe.Instructions)));
        return Normalize(searchText).Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .All(term => haystack.Contains(term, StringComparison.Ordinal));
    }

    private static string Normalize(string value)
    {
        var decomposed = value.Trim().ToLowerInvariant().Normalize(NormalizationForm.FormD);
        var builder = new StringBuilder(decomposed.Length);
        foreach (var character in decomposed)
            if (CharUnicodeInfo.GetUnicodeCategory(character) != UnicodeCategory.NonSpacingMark)
                builder.Append(character is 'đ' ? 'd' : character);
        return builder.ToString().Normalize(NormalizationForm.FormC);
    }

    private static RecipeDto ToDto(Recipe recipe) => new()
    {
        Id = recipe.Id,
        Title = recipe.Title,
        Slug = recipe.Slug,
        Description = recipe.Description,
        ImageUrl = recipe.ImageUrl,
        Ingredients = recipe.Ingredients,
        Instructions = recipe.Instructions,
        CategoryId = recipe.CategoryId,
        CategoryName = recipe.Category?.Name ?? string.Empty,
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
