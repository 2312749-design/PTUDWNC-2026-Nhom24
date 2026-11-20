using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.CQRS.Recipes.Commands;
using CulinaryBlog.Application.CQRS.Recipes.Queries;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using MediatR;

namespace CulinaryBlog.API.Endpoints;

public class RecipeStepsHandlers(IMediator mediator) : EndpointHandler
{
    public async Task<ApiResponseResult> GetSteps(Guid recipeId)
    {
        var items = await mediator.Send(new GetRecipeStepsQuery(recipeId,
            User.FindFirstValue(ClaimTypes.NameIdentifier), User.IsInRole("Admin")), HttpContext.RequestAborted);
        return items is null ? NotFound(new { message = "Không tìm thấy công thức." }) : Ok(items);
    }
    public async Task<ApiResponseResult> CreateStep(Guid recipeId, [FromBody] CreateRecipeStepDto dto)
    {
        var item = await mediator.Send(new CreateRecipeStepCommand(recipeId, CurrentUserId(), User.IsInRole("Admin"), dto), HttpContext.RequestAborted);
        return Created($"/api/v1/recipes/{recipeId}/steps", item);
    }
    public async Task<ApiResponseResult> UpdateStep(Guid recipeId, Guid id, [FromBody] UpdateRecipeStepDto dto)
    {
        await mediator.Send(new UpdateRecipeStepCommand(recipeId, id, CurrentUserId(), User.IsInRole("Admin"), dto), HttpContext.RequestAborted);
        return Ok(new { message = "Cập nhật thành công." });
    }
    public async Task<ApiResponseResult> DeleteStep(Guid recipeId, Guid id)
    {
        await mediator.Send(new DeleteRecipeStepCommand(recipeId, id, CurrentUserId(), User.IsInRole("Admin")), HttpContext.RequestAborted);
        return Ok(new { message = "Xóa thành công." });
    }
    private string CurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new UnauthorizedAccessException("Phiên đăng nhập không hợp lệ.");
}
