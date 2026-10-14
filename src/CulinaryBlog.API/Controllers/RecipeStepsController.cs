using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CulinaryBlog.API.Controllers;

[Route("api/recipes/{recipeId:guid}/steps")]
[Route("api/v1/recipes/{recipeId:guid}/steps")]
[ApiController]
public class RecipeStepsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public RecipeStepsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<RecipeStepDto>>> GetSteps(Guid recipeId)
    {
        var recipe = await _context.Recipes.FirstOrDefaultAsync(r => r.Id == recipeId && !r.IsDeleted);
        if (recipe == null)
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

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<RecipeStepDto>> CreateStep(Guid recipeId, [FromBody] CreateRecipeStepDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title) || string.IsNullOrWhiteSpace(dto.Description))
        {
            return BadRequest(new { message = "Tiêu đề và mô tả bước làm không được để trống." });
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

        return CreatedAtAction(nameof(GetSteps), new { recipeId }, new RecipeStepDto
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

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> UpdateStep(Guid recipeId, Guid id, [FromBody] UpdateRecipeStepDto dto)
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

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteStep(Guid recipeId, Guid id)
    {
        var step = await _context.RecipeSteps.FirstOrDefaultAsync(x => x.Id == id && x.RecipeId == recipeId);
        if (step == null)
        {
            return NotFound(new { message = "Không tìm thấy bước làm cần xóa." });
        }
        if (!await CanManageRecipeAsync(recipeId)) return Forbid();

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
        await _context.RecipeSteps.Where(item => item.RecipeId == recipeId)
            .ExecuteUpdateAsync(setters => setters.SetProperty(item => item.StepNumber, item => item.StepNumber + 1_000_000));
        for (var index = 0; index < rows.Count; index++)
        {
            rows[index].SetStepNumber(index + 1);
            _context.Entry(rows[index]).Property(item => item.StepNumber).IsModified = true;
        }
        await _context.SaveChangesAsync();
        if (transaction != null) await transaction.CommitAsync();
    }
}
