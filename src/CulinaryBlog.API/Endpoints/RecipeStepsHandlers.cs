using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CulinaryBlog.API.Endpoints;
public class RecipeStepsHandlers : EndpointHandler
{
    private readonly ApplicationDbContext _context;

    public RecipeStepsHandlers(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<ApiResponseResult> GetSteps(Guid recipeId)
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
        var items = await _context.RecipeSteps
            .Where(x => x.RecipeId == recipeId)
            .OrderBy(x => x.StepNumber)
            .Select(x => new RecipeStepDto
            {
                Id = x.Id,
                RecipeId = x.RecipeId,
                Title = x.Title,
                Description = x.Description,
                StepNumber = x.StepNumber,
                TimerMinutes = x.TimerMinutes,
                ImageUrl = x.ImageUrl
            })
            .ToListAsync();

        return Ok(items);
    }
    public async Task<ApiResponseResult> CreateStep(Guid recipeId, [FromBody] CreateRecipeStepDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Description))
        {
            return BadRequest(new { message = "Mô tả bước làm không được để trống." });
        }

        var recipe = await _context.Recipes.FirstOrDefaultAsync(r => r.Id == recipeId && !r.IsDeleted);
        if (recipe == null)
        {
            return NotFound(new { message = "Không tìm thấy công thức." });
        }
        if (!CanManageRecipe(recipe.AuthorId)) return Forbid();

        var stepNumber = await _context.RecipeSteps.CountAsync(item => item.RecipeId == recipeId) + 1;
        var step = RecipeStep.Create(recipeId, dto.Title, dto.Description, stepNumber, dto.TimerMinutes, dto.ImageUrl);
        _context.RecipeSteps.Add(step);
        await _context.SaveChangesAsync();

        return Created($"/api/v1/recipes/{recipeId}/steps", new RecipeStepDto
        {
            Id = step.Id,
            RecipeId = step.RecipeId,
            Title = step.Title,
            Description = step.Description,
            StepNumber = step.StepNumber,
            TimerMinutes = step.TimerMinutes,
            ImageUrl = step.ImageUrl
        });
    }
    public async Task<ApiResponseResult> UpdateStep(Guid recipeId, Guid id, [FromBody] UpdateRecipeStepDto dto)
    {
        var step = await _context.RecipeSteps.FirstOrDefaultAsync(x => x.Id == id && x.RecipeId == recipeId);
        if (step == null)
        {
            return NotFound(new { message = "Không tìm thấy bước làm cần cập nhật." });
        }
        if (!await CanManageRecipeAsync(recipeId)) return Forbid();

        step.Update(dto.Title, dto.Description, dto.TimerMinutes, dto.ImageUrl);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Cập nhật bước làm thành công." });
    }
    public async Task<ApiResponseResult> DeleteStep(Guid recipeId, Guid id)
    {
        var step = await _context.RecipeSteps.FirstOrDefaultAsync(x => x.Id == id && x.RecipeId == recipeId);
        if (step == null)
        {
            return NotFound(new { message = "Không tìm thấy bước làm cần xóa." });
        }
        if (!await CanManageRecipeAsync(recipeId)) return Forbid();

        var stepCount = await _context.RecipeSteps.CountAsync(item => item.RecipeId == recipeId);
        if (stepCount <= Recipe.MinimumStepCount)
        {
            return BadRequest(new { message = $"Mỗi công thức phải giữ ít nhất {Recipe.MinimumStepCount} bước nấu." });
        }

        await using var transaction = await _context.Database.BeginTransactionAsync();
        _context.RecipeSteps.Remove(step);
        await _context.SaveChangesAsync();
        var remaining = await _context.RecipeSteps.Where(item => item.RecipeId == recipeId)
            .OrderBy(item => item.StepNumber).ToListAsync();
        await ReindexStepsAsync(recipeId, remaining, beginTransaction: false);
        await transaction.CommitAsync();

        return Ok(new { message = "Xóa bước làm thành công." });
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

    private async Task ReindexStepsAsync(Guid recipeId, List<RecipeStep> rows, bool beginTransaction = true)
    {
        await using var transaction = beginTransaction ? await _context.Database.BeginTransactionAsync() : null;
        if (!_context.Database.IsRelational())
        {
            for (var index = 0; index < rows.Count; index++)
                rows[index].SetStepNumber(index + 1);
            await _context.SaveChangesAsync();
            if (transaction != null) await transaction.CommitAsync();
            return;
        }

        var orderedIds = rows.Select(item => item.Id).ToList();

        // Avoid EF's circular dependency when values in the unique order sequence
        // must be shifted after a step is removed.
        await _context.RecipeSteps.Where(item => item.RecipeId == recipeId)
            .ExecuteUpdateAsync(setters => setters.SetProperty(item => item.StepNumber, item => item.StepNumber + 1_000_000));
        for (var index = 0; index < orderedIds.Count; index++)
        {
            var stepId = orderedIds[index];
            await _context.RecipeSteps.Where(item => item.Id == stepId)
                .ExecuteUpdateAsync(setters => setters.SetProperty(item => item.StepNumber, index + 1));
        }
        // ExecuteUpdate bypasses the change tracker. Clear stale tracked order values
        // so a later query in this request observes the reindexed rows.
        _context.ChangeTracker.Clear();
        if (transaction != null) await transaction.CommitAsync();
    }
}
