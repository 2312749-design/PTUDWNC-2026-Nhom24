using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NpgsqlTypes;

namespace CulinaryBlog.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SearchController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SearchController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("recipes")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<RecipeDto>>> SearchRecipes(
        [FromQuery] string? q = null,
        [FromQuery] Guid? categoryId = null,
        [FromQuery] int? maxMinutes = null,
        [FromQuery] string? difficulty = null,
        [FromQuery] bool? vegetarian = null,
        [FromQuery] string? ingredient = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var keyword = (q ?? string.Empty).Trim();
        var searchText = string.Join(" ", new[] { keyword, ingredient }.Where(value => !string.IsNullOrWhiteSpace(value)));
        var query = _context.Recipes
            .AsNoTracking()
            .Include(r => r.Category)
            .Include(r => r.Author)
            .AsQueryable();

        NpgsqlTsQuery? searchQuery = null;
        if (!string.IsNullOrWhiteSpace(searchText))
        {
            searchQuery = EF.Functions.WebSearchToTsQuery("simple", searchText);
            query = _context.Recipes
                .FromSqlInterpolated<Recipe>($"SELECT * FROM \"Recipes\" WHERE \"SearchVector\" @@ {searchQuery}");
        }
        if (categoryId.HasValue) query = query.Where(recipe => recipe.CategoryId == categoryId.Value);
        if (maxMinutes.HasValue) query = query.Where(recipe => recipe.CookingTimeMinutes != null && recipe.CookingTimeMinutes <= maxMinutes.Value);
        if (!string.IsNullOrWhiteSpace(difficulty)) query = query.Where(recipe => recipe.Difficulty == difficulty);
        if (vegetarian.HasValue) query = query.Where(recipe => recipe.IsVegetarian == vegetarian.Value);

        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 50);
        var total = await query.CountAsync();

        if (searchQuery != null)
        {
            query = query.OrderByDescending(recipe => recipe.SearchVector.Rank(searchQuery));
        }
        else
        {
            query = query.OrderBy(recipe => recipe.Title);
        }

        var result = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new RecipeDto
            {
                Id = r.Id,
                Title = r.Title,
                Slug = r.Slug,
                Description = r.Description,
                Ingredients = r.Ingredients,
                Instructions = r.Instructions,
                CategoryId = r.CategoryId,
                CategoryName = r.Category != null ? r.Category.Name : string.Empty,
                AuthorId = r.AuthorId,
                Status = r.Status,
                CookingTimeMinutes = r.CookingTimeMinutes,
                Difficulty = r.Difficulty,
                IsVegetarian = r.IsVegetarian
            })
            .ToListAsync();

        return Ok(new
        {
            total,
            page,
            pageSize,
            items = result
        });
    }
}
