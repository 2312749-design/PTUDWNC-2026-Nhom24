using CulinaryBlog.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace CulinaryBlog.API.Endpoints;

public static class RecipeStepsEndpoints
{
    public static void MapRecipeSteps(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/recipes/{recipeId:guid}/steps", (RecipeStepsHandlers handler, HttpContext context, Guid recipeId) => { handler.HttpContext = context; return handler.GetSteps(recipeId); })
            .WithTags("RecipeSteps").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapGet("/api/v1/recipes/{recipeId:guid}/steps", (RecipeStepsHandlers handler, HttpContext context, Guid recipeId) => { handler.HttpContext = context; return handler.GetSteps(recipeId); })
            .WithTags("RecipeSteps").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/recipes/{recipeId:guid}/steps", (RecipeStepsHandlers handler, HttpContext context, Guid recipeId, [FromBody] CreateRecipeStepDto dto) => { handler.HttpContext = context; return handler.CreateStep(recipeId, dto); })
            .WithTags("RecipeSteps").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/recipes/{recipeId:guid}/steps", (RecipeStepsHandlers handler, HttpContext context, Guid recipeId, [FromBody] CreateRecipeStepDto dto) => { handler.HttpContext = context; return handler.CreateStep(recipeId, dto); })
            .WithTags("RecipeSteps").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPut("/api/recipes/{recipeId:guid}/steps/{id:guid}", (RecipeStepsHandlers handler, HttpContext context, Guid recipeId, Guid id, [FromBody] UpdateRecipeStepDto dto) => { handler.HttpContext = context; return handler.UpdateStep(recipeId, id, dto); })
            .WithTags("RecipeSteps").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPut("/api/v1/recipes/{recipeId:guid}/steps/{id:guid}", (RecipeStepsHandlers handler, HttpContext context, Guid recipeId, Guid id, [FromBody] UpdateRecipeStepDto dto) => { handler.HttpContext = context; return handler.UpdateStep(recipeId, id, dto); })
            .WithTags("RecipeSteps").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapDelete("/api/recipes/{recipeId:guid}/steps/{id:guid}", (RecipeStepsHandlers handler, HttpContext context, Guid recipeId, Guid id) => { handler.HttpContext = context; return handler.DeleteStep(recipeId, id); })
            .WithTags("RecipeSteps").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapDelete("/api/v1/recipes/{recipeId:guid}/steps/{id:guid}", (RecipeStepsHandlers handler, HttpContext context, Guid recipeId, Guid id) => { handler.HttpContext = context; return handler.DeleteStep(recipeId, id); })
            .WithTags("RecipeSteps").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
    }
}
