using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CulinaryBlog.API.Controllers;

[Route("api/recipes/{recipeId:guid}/ingredients")]
[Route("api/v1/recipes/{recipeId:guid}/ingredients")]
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
        var recipe = await _context.Recipes.FirstOrDefaultAsync(r => r.Id == recipeId && !r.IsDeleted);
        if (recipe == null)
        {
            return NotFound(new { message = "Không tìm thấy công thức." });
        }
        var items = await _context.RecipeIngredients
            .Where(x => x.RecipeId == recipeId)
            .OrderBy(x => x.OrderIndex)
            .Select(x => new RecipeIngredientDto
            {
                Id = x.Id,
                RecipeId = x.RecipeId,
                Name = x.Name,
                Quantity = x.Quantity,
                Unit = x.Unit,
                Notes = x.Notes,
                OrderIndex = x.OrderIndex
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

        var recipe = await _context.Recipes.FirstOrDefaultAsync(r => r.Id == recipeId && !r.IsDeleted);
        if (recipe == null)
        {
            return NotFound(new { message = "Không tìm thấy công thức." });
        }
        if (!CanManageRecipe(recipe.AuthorId)) return Forbid();

        var nextOrderIndex = await _context.RecipeIngredients.CountAsync(item => item.RecipeId == recipeId) + 1;
        var ingredient = RecipeIngredient.Create(recipeId, dto.Name, dto.Quantity, dto.Unit, dto.Notes, nextOrderIndex);
        _context.RecipeIngredients.Add(ingredient);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetIngredients), new { recipeId }, new RecipeIngredientDto
        {
            Id = ingredient.Id,
            RecipeId = ingredient.RecipeId,
            Name = ingredient.Name,
            Quantity = ingredient.Quantity,
            Unit = ingredient.Unit,
            Notes = ingredient.Notes,
            OrderIndex = ingredient.OrderIndex
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
        if (!await CanManageRecipeAsync(recipeId)) return Forbid();

        ingredient.Update(dto.Name, dto.Quantity, dto.Unit, dto.Notes, ingredient.OrderIndex);
        if (dto.OrderIndex.HasValue && dto.OrderIndex.Value != ingredient.OrderIndex)
        {
            var rows = await _context.RecipeIngredients.Where(item => item.RecipeId == recipeId)
                .OrderBy(item => item.OrderIndex).ToListAsync();
            var requestedIndex = Math.Clamp(dto.OrderIndex.Value, 1, rows.Count);
            rows.Remove(ingredient);
            rows.Insert(requestedIndex - 1, ingredient);
            await ReindexIngredientsAsync(recipeId, rows);
        }
        else
        {
            await _context.SaveChangesAsync();
        }

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
        if (!await CanManageRecipeAsync(recipeId)) return Forbid();

        await using var transaction = await _context.Database.BeginTransactionAsync();
        _context.RecipeIngredients.Remove(ingredient);
        await _context.SaveChangesAsync();
        var remaining = await _context.RecipeIngredients.Where(item => item.RecipeId == recipeId)
            .OrderBy(item => item.OrderIndex).ToListAsync();
        await ReindexIngredientsAsync(recipeId, remaining, beginTransaction: false);
        await transaction.CommitAsync();

        return Ok(new { message = "Xóa nguyên liệu thành công." });
    }

    private bool CanManageRecipe(string authorId) =>
        User.IsInRole("Admin") || User.FindFirstValue(ClaimTypes.NameIdentifier) == authorId;

    private Task<bool> CanManageRecipeAsync(Guid recipeId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var isAdmin = User.IsInRole("Admin");
        return _context.Recipes.AnyAsync(recipe => recipe.Id == recipeId && !recipe.IsDeleted &&
            (recipe.AuthorId == userId || isAdmin));
    }

    private async Task ReindexIngredientsAsync(Guid recipeId, List<RecipeIngredient> rows, bool beginTransaction = true)
    {
        await using var transaction = beginTransaction ? await _context.Database.BeginTransactionAsync() : null;
        await _context.RecipeIngredients.Where(item => item.RecipeId == recipeId)
            .ExecuteUpdateAsync(setters => setters.SetProperty(item => item.OrderIndex, item => item.OrderIndex + 1_000_000));
        for (var index = 0; index < rows.Count; index++)
        {
            rows[index].Update(rows[index].Name, rows[index].Quantity, rows[index].Unit, rows[index].Notes, index + 1);
            _context.Entry(rows[index]).Property(item => item.OrderIndex).IsModified = true;
        }
        await _context.SaveChangesAsync();
        if (transaction != null) await transaction.CommitAsync();
    }
}
