using CulinaryBlog.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace CulinaryBlog.API.Endpoints;

public static class RecipeIngredientsEndpoints
{
    public static void MapRecipeIngredients(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/v1/recipes/{recipeId:guid}/ingredients", (RecipeIngredientsHandlers handler, HttpContext context, Guid recipeId) => { handler.HttpContext = context; return handler.GetIngredients(recipeId); })
            .WithTags("RecipeIngredients").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/recipes/{recipeId:guid}/ingredients", (RecipeIngredientsHandlers handler, HttpContext context, Guid recipeId, [FromBody] CreateRecipeIngredientDto dto) => { handler.HttpContext = context; return handler.CreateIngredient(recipeId, dto); })
            .WithTags("RecipeIngredients").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPut("/api/v1/recipes/{recipeId:guid}/ingredients/{id:guid}", (RecipeIngredientsHandlers handler, HttpContext context, Guid recipeId, Guid id, [FromBody] UpdateRecipeIngredientDto dto) => { handler.HttpContext = context; return handler.UpdateIngredient(recipeId, id, dto); })
            .WithTags("RecipeIngredients").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapDelete("/api/v1/recipes/{recipeId:guid}/ingredients/{id:guid}", (RecipeIngredientsHandlers handler, HttpContext context, Guid recipeId, Guid id) => { handler.HttpContext = context; return handler.DeleteIngredient(recipeId, id); })
            .WithTags("RecipeIngredients").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
    }
}
