using CulinaryBlog.Application.CQRS.Categories.Commands;
using CulinaryBlog.Application.CQRS.Categories.Queries;
using CulinaryBlog.Application.DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CulinaryBlog.API.Endpoints;

/// <summary>
/// HTTP adapter for category use cases. Persistence rules are implemented by
/// MediatR command/query handlers in the Application layer.
/// </summary>
public sealed class CategoriesHandlers : EndpointHandler
{
    private readonly IMediator _mediator;

    public CategoriesHandlers(IMediator mediator)
    {
        _mediator = mediator;
    }

    public async Task<ApiResponseResult> GetAllCategories()
        => Ok(await _mediator.Send(new GetCategoriesQuery()));

    /// <summary>
    /// Gives the catalogue a single source of truth: recipes are selected from
    /// their CategoryId rather than maintained as a separate client-side list.
    /// Visitors see published recipes only; administrators can review every
    /// non-deleted lifecycle state from the same category screen.
    /// </summary>
    public async Task<ApiResponseResult> GetCategoryBySlug(string slug)
    {
        var result = await _mediator.Send(new GetCategoryDetailQuery(null, slug, User.IsInRole("Admin")), HttpContext.RequestAborted);
        return result is null ? NotFound(new { message = "Không tìm thấy danh mục." }) : Ok(result);
    }

    public async Task<ApiResponseResult> GetCategoryDetail(Guid id)
    {
        var result = await _mediator.Send(new GetCategoryDetailQuery(id, null, User.IsInRole("Admin")), HttpContext.RequestAborted);
        return result is null ? NotFound(new { message = "Không tìm thấy danh mục." }) : Ok(result);
    }

    public async Task<ApiResponseResult> CreateCategory([FromBody] CreateCategoryDto dto)
    {
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
