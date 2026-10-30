using Microsoft.AspNetCore.Mvc;

namespace CulinaryBlog.API.Endpoints;

public static class SearchEndpoints
{
    public static void MapSearch(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/v1/search/recipes", Search)
            .WithTags("Search").AddEndpointFilter<RequestValidationFilter>().AllowAnonymous();
    }

    private static Task<ApiResponseResult> Search(
        SearchHandlers handler,
        HttpContext context,
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
        handler.HttpContext = context;
        return handler.SearchRecipes(q, categoryId, maxMinutes, difficulty, vegetarian, ingredient, minServings, sortBy, sortOrder, page, pageSize);
    }
}
