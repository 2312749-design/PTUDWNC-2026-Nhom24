using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CulinaryBlog.API.Endpoints;
public class RecipeIngredientsHandlers : EndpointHandler
{
    private readonly ApplicationDbContext _context;

    public RecipeIngredientsHandlers(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<ApiResponseResult> GetIngredients(Guid recipeId)
    {
        var recipe = await _context.Recipes.FirstOrDefaultAsync(r => r.Id == recipeId && !r.IsDeleted);
        if (recipe == null)
        {
            return NotFound(new { message = "Không tìm thấy công thức." });
        }
        if (!CanViewRecipe(recipe))
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
    public async Task<ApiResponseResult> CreateIngredient(Guid recipeId, [FromBody] CreateRecipeIngredientDto dto)
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

        return Created($"/api/v1/recipes/{recipeId}/ingredients", new RecipeIngredientDto
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
    public async Task<ApiResponseResult> UpdateIngredient(Guid recipeId, Guid id, [FromBody] UpdateRecipeIngredientDto dto)
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
            // Save content changes before changing the unique (RecipeId, OrderIndex) sequence.
            // ReindexIngredientsAsync moves every row through a temporary range first.
            await _context.SaveChangesAsync();
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
    public async Task<ApiResponseResult> DeleteIngredient(Guid recipeId, Guid id)
    {
        var ingredient = await _context.RecipeIngredients.FirstOrDefaultAsync(x => x.Id == id && x.RecipeId == recipeId);
        if (ingredient == null)
        {
            return NotFound(new { message = "Không tìm thấy nguyên liệu cần xóa." });
        }
        if (!await CanManageRecipeAsync(recipeId)) return Forbid();

        var ingredientCount = await _context.RecipeIngredients.CountAsync(item => item.RecipeId == recipeId);
        if (ingredientCount <= Recipe.MinimumIngredientCount)
        {
            return BadRequest(new { message = $"Mỗi công thức phải giữ ít nhất {Recipe.MinimumIngredientCount} nguyên liệu." });
        }

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

    private bool CanViewRecipe(Recipe recipe) =>
        recipe.Status == RecipeStatus.Published || CanManageRecipe(recipe.AuthorId);

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
        if (!_context.Database.IsRelational())
        {
            for (var index = 0; index < rows.Count; index++)
                rows[index].Update(rows[index].Name, rows[index].Quantity, rows[index].Unit, rows[index].Notes, index + 1);
            await _context.SaveChangesAsync();
            if (transaction != null) await transaction.CommitAsync();
            return;
        }

        var orderedIds = rows.Select(item => item.Id).ToList();

        // EF tries to batch direct swaps in a unique index and detects a circular
        // dependency. Move all rows out of the active sequence first, then assign
        // the final positions with direct updates.
        await _context.RecipeIngredients.Where(item => item.RecipeId == recipeId)
            .ExecuteUpdateAsync(setters => setters.SetProperty(item => item.OrderIndex, item => item.OrderIndex + 1_000_000));
        for (var index = 0; index < orderedIds.Count; index++)
        {
            var ingredientId = orderedIds[index];
            await _context.RecipeIngredients.Where(item => item.Id == ingredientId)
                .ExecuteUpdateAsync(setters => setters.SetProperty(item => item.OrderIndex, index + 1));
        }
        // ExecuteUpdate bypasses the change tracker. Clear stale tracked order values
        // so a later query in this request observes the reindexed rows.
        _context.ChangeTracker.Clear();
        if (transaction != null) await transaction.CommitAsync();
    }
}
