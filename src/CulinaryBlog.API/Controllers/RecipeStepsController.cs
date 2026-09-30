using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.API.Controllers;

[Route("api/recipes/{recipeId:guid}/steps")]
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
        var recipeExists = await _context.Recipes.AnyAsync(r => r.Id == recipeId);
        if (!recipeExists)
        {
            return NotFound(new { message = "Không tìm thấy công thức." });
        }

        var items = await _context.RecipeSteps
            .Where(x => x.RecipeId == recipeId)
            .OrderBy(x => x.Order)
            .Select(x => new RecipeStepDto
            {
                Id = x.Id,
                RecipeId = x.RecipeId,
                Title = x.Title,
                Description = x.Description,
                Order = x.Order
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

        var recipeExists = await _context.Recipes.AnyAsync(r => r.Id == recipeId);
        if (!recipeExists)
        {
            return NotFound(new { message = "Không tìm thấy công thức." });
        }

        var step = RecipeStep.Create(recipeId, dto.Title, dto.Description, dto.Order);
        _context.RecipeSteps.Add(step);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSteps), new { recipeId }, new RecipeStepDto
        {
            Id = step.Id,
            RecipeId = step.RecipeId,
            Title = step.Title,
            Description = step.Description,
            Order = step.Order
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

        step.Update(dto.Title, dto.Description, dto.Order);
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

        _context.RecipeSteps.Remove(step);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Xóa bước làm thành công." });
    }
}
