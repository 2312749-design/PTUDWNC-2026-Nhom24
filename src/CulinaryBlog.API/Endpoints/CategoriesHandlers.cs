using CulinaryBlog.Application.CQRS.Categories.Commands;
using CulinaryBlog.Application.CQRS.Categories.Queries;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.API.Endpoints;

/// <summary>
/// HTTP adapter for category use cases. Persistence rules are implemented by
/// MediatR command/query handlers in the Application layer.
/// </summary>
public sealed class CategoriesHandlers : EndpointHandler
{
    private readonly IMediator _mediator;
    private readonly ApplicationDbContext _context;

    public CategoriesHandlers(IMediator mediator, ApplicationDbContext context)
    {
        _mediator = mediator;
        _context = context;
    }

    public async Task<ApiResponseResult> GetAllCategories()
        => Ok(await _mediator.Send(new GetCategoriesQuery()));

    /// <summary>
    /// Gives the catalogue a single source of truth: recipes are selected from
    /// their CategoryId rather than maintained as a separate client-side list.
    /// Visitors see published recipes only; administrators can review every
    /// non-deleted lifecycle state from the same category screen.
    /// </summary>
    public async Task<ApiResponseResult> GetCategoryDetail(Guid id)
    {
        var category = await _context.Categories.AsNoTracking()
            .FirstOrDefaultAsync(item => item.Id == id && !item.IsDeleted && (item.IsVisible || User.IsInRole("Admin")));
        if (category is null) return NotFound(new { message = "Không tìm thấy danh mục." });

        var canReviewAllStates = User.IsInRole("Admin");
        var recipes = _context.Recipes.AsNoTracking()
            .Where(item => !item.IsDeleted && item.CategoryId == id);
        if (!canReviewAllStates)
            recipes = recipes.Where(item => item.Status == RecipeStatus.Published);

        var items = await recipes.OrderByDescending(item => item.UpdatedAt)
            .Select(item => new RecipeDto
            {
                Id = item.Id,
                Title = item.Title,
                Slug = item.Slug,
                Description = item.Description,
                ImageUrl = item.ImageUrl,
                CategoryId = item.CategoryId,
                CategoryName = category.Name,
                AuthorId = item.AuthorId,
                Status = item.Status,
                CreatedAt = item.CreatedAt,
                UpdatedAt = item.UpdatedAt,
                PrepTimeMinutes = item.PrepTimeMinutes,
                CookTimeMinutes = item.CookTimeMinutes,
                Servings = item.Servings,
                CookingTimeMinutes = item.CookingTimeMinutes,
                Difficulty = item.Difficulty,
                IsVegetarian = item.IsVegetarian
            })
            .ToListAsync();

        return Ok(new
        {
            category = new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Slug = category.Slug,
                Description = category.Description,
                ImageUrl = category.ImageUrl,
                RecipeCount = items.Count,
                PublishedRecipeCount = items.Count(item => item.Status == RecipeStatus.Published)
            },
            recipeCount = items.Count,
            recipes = items
        });
    }

    public async Task<ApiResponseResult> CreateCategory([FromBody] CreateCategoryDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest(new { message = "Tên danh mục không được để trống!" });

        var result = await _mediator.Send(new CreateCategoryCommand
        {
            Name = dto.Name,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl
        });

        return Created("/api/v1/categories", result);
    }

    public async Task<ApiResponseResult> UpdateCategory(Guid id, [FromBody] CreateCategoryDto dto)
    {
        await _mediator.Send(new UpdateCategoryCommand
        {
            Id = id,
            Name = dto.Name,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl
        });
        return Ok(new { message = "Cập nhật danh mục thành công!" });
    }

    public async Task<ApiResponseResult> DeleteCategory(Guid id)
    {
        await _mediator.Send(new DeleteCategoryCommand { Id = id });
        return Ok(new { message = "Xóa mềm danh mục thành công." });
    }
}
