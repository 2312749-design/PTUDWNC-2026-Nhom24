using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        var query = _context.Recipes
            .AsNoTracking()
            .Include(r => r.Category)
            .Include(r => r.Author).AsQueryable();

        if (!string.IsNullOrWhiteSpace(keyword))
            query = query.Where(recipe => EF.Functions.ILike(recipe.Title, $"%{keyword}%") || EF.Functions.ILike(recipe.Description!, $"%{keyword}%"));
        if (categoryId.HasValue) query = query.Where(recipe => recipe.CategoryId == categoryId.Value);
        if (maxMinutes.HasValue) query = query.Where(recipe => recipe.CookingTimeMinutes != null && recipe.CookingTimeMinutes <= maxMinutes.Value);
        if (!string.IsNullOrWhiteSpace(difficulty)) query = query.Where(recipe => recipe.Difficulty == difficulty);
        if (vegetarian.HasValue) query = query.Where(recipe => recipe.IsVegetarian == vegetarian.Value);
        if (!string.IsNullOrWhiteSpace(ingredient)) query = query.Where(recipe => recipe.Ingredients.Any(item => EF.Functions.ILike(item, $"%{ingredient.Trim()}%")));

        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 50);
        var total = await query.CountAsync();

        var result = await query
            .OrderBy(recipe => recipe.Title)
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
