using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.API.Controllers;

[Route("api/recipes/{recipeId:guid}/ingredients")]
[ApiController]
public class RecipeIngredientsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public RecipeIngredientsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<RecipeIngredientDto>>> GetIngredients(Guid recipeId)
    {
        var recipeExists = await _context.Recipes.AnyAsync(r => r.Id == recipeId);
        if (!recipeExists)
        {
            return NotFound(new { message = "Không tìm thấy công thức." });
        }

        var items = await _context.RecipeIngredients
            .Where(x => x.RecipeId == recipeId)
            .OrderBy(x => x.Order)
            .Select(x => new RecipeIngredientDto
            {
                Id = x.Id,
                RecipeId = x.RecipeId,
                Name = x.Name,
                Quantity = x.Quantity,
                Unit = x.Unit,
                Order = x.Order
            })
            .ToListAsync();

        return Ok(items);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<RecipeIngredientDto>> CreateIngredient(Guid recipeId, [FromBody] CreateRecipeIngredientDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            return BadRequest(new { message = "Tên nguyên liệu không được để trống." });
        }

        var recipeExists = await _context.Recipes.AnyAsync(r => r.Id == recipeId);
        if (!recipeExists)
        {
            return NotFound(new { message = "Không tìm thấy công thức." });
        }

        var ingredient = RecipeIngredient.Create(recipeId, dto.Name, dto.Quantity, dto.Unit, dto.Order);
        _context.RecipeIngredients.Add(ingredient);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetIngredients), new { recipeId }, new RecipeIngredientDto
        {
            Id = ingredient.Id,
            RecipeId = ingredient.RecipeId,
            Name = ingredient.Name,
            Quantity = ingredient.Quantity,
            Unit = ingredient.Unit,
            Order = ingredient.Order
        });
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> UpdateIngredient(Guid recipeId, Guid id, [FromBody] UpdateRecipeIngredientDto dto)
    {
        var ingredient = await _context.RecipeIngredients.FirstOrDefaultAsync(x => x.Id == id && x.RecipeId == recipeId);
        if (ingredient == null)
        {
            return NotFound(new { message = "Không tìm thấy nguyên liệu cần cập nhật." });
        }

        ingredient.Update(dto.Name, dto.Quantity, dto.Unit, dto.Order);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Cập nhật nguyên liệu thành công." });
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteIngredient(Guid recipeId, Guid id)
    {
        var ingredient = await _context.RecipeIngredients.FirstOrDefaultAsync(x => x.Id == id && x.RecipeId == recipeId);
        if (ingredient == null)
        {
            return NotFound(new { message = "Không tìm thấy nguyên liệu cần xóa." });
        }

        _context.RecipeIngredients.Remove(ingredient);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Xóa nguyên liệu thành công." });
    }
}
