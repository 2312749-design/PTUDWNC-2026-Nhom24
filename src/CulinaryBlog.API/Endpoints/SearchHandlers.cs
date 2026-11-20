using CulinaryBlog.Application.CQRS.Recipes.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CulinaryBlog.API.Endpoints;

/// <summary>Thin HTTP adapter; validation and search orchestration run through MediatR.</summary>
public sealed class SearchHandlers(IMediator mediator) : EndpointHandler
{
    public async Task<ApiResponseResult> SearchRecipes(
        [FromQuery] string? q = null,
        [FromQuery] Guid? categoryId = null,
        [FromQuery] int? maxMinutes = null,
        [FromQuery] string? difficulty = null,
        [FromQuery] bool? vegetarian = null,
        [FromQuery] string? ingredient = null,
        [FromQuery] int? minServings = null,
        [FromQuery] string? sortBy = null,
        [FromQuery] string? sortOrder = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12)
    {
        var result = await mediator.Send(new SearchRecipesQuery(
            q, categoryId, maxMinutes, difficulty, vegetarian, ingredient,
            minServings, sortBy, sortOrder, page, pageSize));
        return Ok(new { total = result.Total, page = result.Page, pageSize = result.PageSize, items = result.Items });
    }
}
