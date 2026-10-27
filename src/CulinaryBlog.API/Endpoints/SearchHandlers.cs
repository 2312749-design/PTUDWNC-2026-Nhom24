using System.Globalization;
using System.Text;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NpgsqlTypes;

namespace CulinaryBlog.API.Endpoints;

public class SearchHandlers : EndpointHandler
{
    private static readonly HashSet<string> SupportedSortFields = new(StringComparer.OrdinalIgnoreCase)
    {
        "title", "createdAt", "cookTimeMinutes"
    };

    private static readonly HashSet<string> SupportedDifficulties = new(StringComparer.Ordinal)
    {
        "Easy", "Medium", "Hard", "Expert"
    };

    private readonly ApplicationDbContext _context;

    public SearchHandlers(ApplicationDbContext context) => _context = context;

    public async Task<ApiResponseResult> SearchRecipes(
        [FromQuery] string? q = null,
        [FromQuery] Guid? categoryId = null,
        [FromQuery] int? maxMinutes = null,
        [FromQuery] string? difficulty = null,
        [FromQuery] bool? vegetarian = null,
        [FromQuery] string? ingredient = null,
        [FromQuery] int? minServings = null,
        [FromQuery] string? sortBy = null,
        [FromQuery] string? sortOrder = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12)
    {
        var keyword = (q ?? string.Empty).Trim();
        var normalizedDifficulty = NormalizeDifficulty(difficulty);
        var normalizedSortBy = string.IsNullOrWhiteSpace(sortBy) ? "title" : sortBy.Trim();
        var normalizedSortOrder = string.IsNullOrWhiteSpace(sortOrder) ? "asc" : sortOrder.Trim();

        if (keyword.Length is > 0 and < 2)
            return ValidationError("q", "Từ khóa tìm kiếm phải có ít nhất 2 ký tự.");
        if (maxMinutes is <= 0)
            return ValidationError("maxMinutes", "Thời gian nấu tối đa phải lớn hơn 0.");
        if (minServings is <= 0)
            return ValidationError("minServings", "Số khẩu phần tối thiểu phải lớn hơn 0.");
        if (page < 1)
            return ValidationError("page", "Trang phải bắt đầu từ 1.");
        if (pageSize is < 1 or > 50)
            return ValidationError("pageSize", "Kích thước trang phải từ 1 đến 50.");
        if (!SupportedSortFields.Contains(normalizedSortBy))
            return ValidationError("sortBy", "sortBy chỉ nhận title, createdAt hoặc cookTimeMinutes.");
        if (!string.Equals(normalizedSortOrder, "asc", StringComparison.OrdinalIgnoreCase) &&
            !string.Equals(normalizedSortOrder, "desc", StringComparison.OrdinalIgnoreCase))
            return ValidationError("sortOrder", "sortOrder chỉ nhận asc hoặc desc.");
        if (difficulty is not null && normalizedDifficulty is null)
            return ValidationError("difficulty", "difficulty chỉ nhận Easy, Medium, Hard hoặc Expert.");

        var searchText = string.Join(" ", new[] { keyword, ingredient?.Trim() }
            .Where(value => !string.IsNullOrWhiteSpace(value)));
        var query = _context.Recipes
            .AsNoTracking()
            .Where(recipe => !recipe.IsDeleted && recipe.Status == RecipeStatus.Published)
            .Include(recipe => recipe.Category)
            .Where(recipe => !recipe.Category.IsDeleted && recipe.Category.IsVisible)
            .AsQueryable();

        if (categoryId.HasValue)
            query = query.Where(recipe => recipe.CategoryId == categoryId.Value);
        if (maxMinutes.HasValue)
            query = query.Where(recipe => recipe.CookTimeMinutes <= maxMinutes.Value);
        if (minServings.HasValue)
            query = query.Where(recipe => recipe.Servings >= minServings.Value);
        if (normalizedDifficulty is not null)
            query = query.Where(recipe => recipe.Difficulty == normalizedDifficulty);
        if (vegetarian.HasValue)
            query = query.Where(recipe => recipe.IsVegetarian == vegetarian.Value);

        var descending = string.Equals(normalizedSortOrder, "desc", StringComparison.OrdinalIgnoreCase);
        if (!string.IsNullOrWhiteSpace(searchText) && _context.Database.IsNpgsql())
        {
            // The trigger stores unaccented terms, so normalize the query before PostgreSQL FTS.
            var normalizedSearchText = NormalizeForSearch(searchText);
            // Provider-only functions must stay inside the expression tree so
            // Npgsql can translate them into SQL instead of invoking them in C#.
            query = query.Where(recipe => EF.Property<NpgsqlTsVector>(recipe, "SearchVector")
                .Matches(EF.Functions.WebSearchToTsQuery("simple", normalizedSearchText)));
        }

        if (!string.IsNullOrWhiteSpace(searchText) && !_context.Database.IsNpgsql())
        {
            // SQLite is used in automated tests and does not implement PostgreSQL FTS/unaccent.
            var recipes = await query.ToListAsync();
            var matched = recipes.Where(recipe => ContainsSearchTerms(recipe, searchText)).ToList();
            var total = matched.Count;
            var items = OrderInMemory(matched, normalizedSortBy, descending)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(ToDto)
                .ToList();

            return Ok(new { total, page, pageSize, items });
        }

        var totalCount = await query.CountAsync();
        var ordered = OrderQuery(query, normalizedSortBy, descending);
        var result = await ordered
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(recipe => new RecipeDto
            {
                Id = recipe.Id,
                Title = recipe.Title,
                Slug = recipe.Slug,
                Description = recipe.Description,
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
            .ToListAsync();

        return Ok(new { total = totalCount, page, pageSize, items = result });
    }

    private static ApiResponseResult ValidationError(string field, string message) =>
        StatusCode(422, new { message, errors = new Dictionary<string, string[]> { [field] = [message] } });

    private static string? NormalizeDifficulty(string? difficulty)
    {
        if (string.IsNullOrWhiteSpace(difficulty)) return null;
        var candidate = Recipe.NormalizeDifficulty(difficulty);
        return SupportedDifficulties.Contains(candidate) ? candidate : null;
    }

    private static IOrderedQueryable<Recipe> OrderQuery(IQueryable<Recipe> query, string sortBy, bool descending) =>
        sortBy.ToLowerInvariant() switch
        {
            "createdat" => descending ? query.OrderByDescending(recipe => recipe.CreatedAt).ThenBy(recipe => recipe.Id) : query.OrderBy(recipe => recipe.CreatedAt).ThenBy(recipe => recipe.Id),
            "cooktimeminutes" => descending ? query.OrderByDescending(recipe => recipe.CookTimeMinutes).ThenBy(recipe => recipe.Id) : query.OrderBy(recipe => recipe.CookTimeMinutes).ThenBy(recipe => recipe.Id),
            _ => descending ? query.OrderByDescending(recipe => recipe.Title).ThenBy(recipe => recipe.Id) : query.OrderBy(recipe => recipe.Title).ThenBy(recipe => recipe.Id)
        };

    private static IOrderedEnumerable<Recipe> OrderInMemory(IEnumerable<Recipe> recipes, string sortBy, bool descending) =>
        sortBy.ToLowerInvariant() switch
        {
            "createdat" => descending ? recipes.OrderByDescending(recipe => recipe.CreatedAt).ThenBy(recipe => recipe.Id) : recipes.OrderBy(recipe => recipe.CreatedAt).ThenBy(recipe => recipe.Id),
            "cooktimeminutes" => descending ? recipes.OrderByDescending(recipe => recipe.CookTimeMinutes).ThenBy(recipe => recipe.Id) : recipes.OrderBy(recipe => recipe.CookTimeMinutes).ThenBy(recipe => recipe.Id),
            _ => descending ? recipes.OrderByDescending(recipe => recipe.Title).ThenBy(recipe => recipe.Id) : recipes.OrderBy(recipe => recipe.Title).ThenBy(recipe => recipe.Id)
        };

    private static bool ContainsSearchTerms(Recipe recipe, string searchText)
    {
        var haystack = NormalizeForSearch(string.Join(' ', new[]
        {
            recipe.Title,
            recipe.Description,
            string.Join(' ', recipe.Ingredients),
            string.Join(' ', recipe.Instructions)
        }));
        return NormalizeForSearch(searchText)
            .Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .All(term => haystack.Contains(term, StringComparison.Ordinal));
    }

    private static string NormalizeForSearch(string value)
    {
        var decomposed = value.Trim().ToLowerInvariant().Normalize(NormalizationForm.FormD);
        var builder = new StringBuilder(decomposed.Length);
        foreach (var character in decomposed)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(character) != UnicodeCategory.NonSpacingMark)
                builder.Append(character is 'đ' ? 'd' : character);
        }
        return builder.ToString().Normalize(NormalizationForm.FormC);
    }

    private static RecipeDto ToDto(Recipe recipe) => new()
    {
        Id = recipe.Id,
        Title = recipe.Title,
        Slug = recipe.Slug,
        Description = recipe.Description,
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
