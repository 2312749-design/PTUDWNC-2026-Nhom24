using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.CQRS.Recipes.Commands;
using CulinaryBlog.Application.CQRS.Recipes.Queries;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using MediatR;

namespace CulinaryBlog.API.Endpoints;

public class RecipeIngredientsHandlers(IMediator mediator) : EndpointHandler
{
    public async Task<ApiResponseResult> GetIngredients(Guid recipeId)
    {
        var items = await mediator.Send(new GetRecipeIngredientsQuery(recipeId,
            User.FindFirstValue(ClaimTypes.NameIdentifier), User.IsInRole("Admin")), HttpContext.RequestAborted);
        return items is null ? NotFound(new { message = "Không tìm thấy công thức." }) : Ok(items);
    }
    public async Task<ApiResponseResult> CreateIngredient(Guid recipeId, [FromBody] CreateRecipeIngredientDto dto)
    {
        var item = await mediator.Send(new CreateRecipeIngredientCommand(recipeId, CurrentUserId(), User.IsInRole("Admin"), dto), HttpContext.RequestAborted);
        return Created($"/api/v1/recipes/{recipeId}/ingredients", item);
    }
    public async Task<ApiResponseResult> UpdateIngredient(Guid recipeId, Guid id, [FromBody] UpdateRecipeIngredientDto dto)
    {
        await mediator.Send(new UpdateRecipeIngredientCommand(recipeId, id, CurrentUserId(), User.IsInRole("Admin"), dto), HttpContext.RequestAborted);
        return Ok(new { message = "Cập nhật thành công." });
    }
    public async Task<ApiResponseResult> DeleteIngredient(Guid recipeId, Guid id)
    {
        await mediator.Send(new DeleteRecipeIngredientCommand(recipeId, id, CurrentUserId(), User.IsInRole("Admin")), HttpContext.RequestAborted);
        return Ok(new { message = "Xóa thành công." });
    }
    private string CurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new UnauthorizedAccessException("Phiên đăng nhập không hợp lệ.");
}
