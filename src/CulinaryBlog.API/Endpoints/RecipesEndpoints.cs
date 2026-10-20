using CulinaryBlog.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace CulinaryBlog.API.Endpoints;

public static class RecipesEndpoints
{
    public static void MapRecipes(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/recipes", (RecipesHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.GetAllRecipes(); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>();
        app.MapGet("/api/v1/recipes", (RecipesHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.GetAllRecipes(); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>();
        app.MapGet("/api/recipes/{id:guid}", (RecipesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.GetRecipeById(id); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().AllowAnonymous();
        app.MapGet("/api/v1/recipes/{id:guid}", (RecipesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.GetRecipeById(id); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().AllowAnonymous();
        app.MapGet("/api/recipes/slug/{slug}", (RecipesHandlers handler, HttpContext context, string slug) => { handler.HttpContext = context; return handler.GetRecipeBySlug(slug); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().AllowAnonymous();
        app.MapGet("/api/v1/recipes/slug/{slug}", (RecipesHandlers handler, HttpContext context, string slug) => { handler.HttpContext = context; return handler.GetRecipeBySlug(slug); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().AllowAnonymous();
        app.MapGet("/api/recipes/mine", (RecipesHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.GetMyRecipes(); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapGet("/api/v1/recipes/mine", (RecipesHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.GetMyRecipes(); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapGet("/api/recipes/sitemap", (RecipesHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.GetSitemapRecipes(); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().AllowAnonymous();
        app.MapGet("/api/v1/recipes/sitemap", (RecipesHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.GetSitemapRecipes(); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().AllowAnonymous();
        app.MapPost("/api/recipes/{id:guid}/view", (RecipesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.RecordView(id); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/recipes/{id:guid}/view", (RecipesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.RecordView(id); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/recipes", (RecipesHandlers handler, HttpContext context, [FromBody] CreateRecipeDto dto) => { handler.HttpContext = context; return handler.CreateRecipe(dto); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/recipes", (RecipesHandlers handler, HttpContext context, [FromBody] CreateRecipeDto dto) => { handler.HttpContext = context; return handler.CreateRecipe(dto); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPut("/api/recipes/{id:guid}", (RecipesHandlers handler, HttpContext context, Guid id, [FromBody] UpdateRecipeDto dto) => { handler.HttpContext = context; return handler.UpdateRecipe(id, dto); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPut("/api/v1/recipes/{id:guid}", (RecipesHandlers handler, HttpContext context, Guid id, [FromBody] UpdateRecipeDto dto) => { handler.HttpContext = context; return handler.UpdateRecipe(id, dto); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPatch("/api/recipes/{id:guid}", (RecipesHandlers handler, HttpContext context, Guid id, [FromBody] PatchRecipeDto dto) => { handler.HttpContext = context; return handler.PatchRecipe(id, dto); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPatch("/api/v1/recipes/{id:guid}", (RecipesHandlers handler, HttpContext context, Guid id, [FromBody] PatchRecipeDto dto) => { handler.HttpContext = context; return handler.PatchRecipe(id, dto); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/recipes/{id:guid}/publish", (RecipesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.PublishRecipe(id); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/recipes/{id:guid}/publish", (RecipesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.PublishRecipe(id); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/recipes/{id:guid}/unpublish", (RecipesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.UnpublishRecipe(id); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/recipes/{id:guid}/unpublish", (RecipesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.UnpublishRecipe(id); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/recipes/{id:guid}/archive", (RecipesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.ArchiveRecipe(id); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/recipes/{id:guid}/archive", (RecipesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.ArchiveRecipe(id); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/recipes/{id:guid}/restore", (RecipesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.RestoreRecipe(id); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/recipes/{id:guid}/restore", (RecipesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.RestoreRecipe(id); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/recipes/{id:guid}/images", (RecipesHandlers handler, HttpContext context, Guid id, IFormFile file) => { handler.HttpContext = context; return handler.UploadRecipeImage(id, file); })
            .WithTags("Recipe images").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization().RequireRateLimiting("upload");
        app.MapPost("/api/v1/recipes/{id:guid}/images", (RecipesHandlers handler, HttpContext context, Guid id, IFormFile file) => { handler.HttpContext = context; return handler.UploadRecipeImage(id, file); })
            .WithTags("Recipe images").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization().RequireRateLimiting("upload");
        app.MapPut("/api/recipes/{id:guid}/images/{imageId:guid}/primary", (RecipesHandlers handler, HttpContext context, Guid id, Guid imageId) => { handler.HttpContext = context; return handler.SetPrimaryRecipeImage(id, imageId); })
            .WithTags("Recipe images").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPut("/api/v1/recipes/{id:guid}/images/{imageId:guid}/primary", (RecipesHandlers handler, HttpContext context, Guid id, Guid imageId) => { handler.HttpContext = context; return handler.SetPrimaryRecipeImage(id, imageId); })
            .WithTags("Recipe images").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapDelete("/api/recipes/{id:guid}/images/{imageId:guid}", (RecipesHandlers handler, HttpContext context, Guid id, Guid imageId) => { handler.HttpContext = context; return handler.DeleteRecipeImage(id, imageId); })
            .WithTags("Recipe images").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapDelete("/api/v1/recipes/{id:guid}/images/{imageId:guid}", (RecipesHandlers handler, HttpContext context, Guid id, Guid imageId) => { handler.HttpContext = context; return handler.DeleteRecipeImage(id, imageId); })
            .WithTags("Recipe images").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapDelete("/api/recipes/{id:guid}", (RecipesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.DeleteRecipe(id); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapDelete("/api/v1/recipes/{id:guid}", (RecipesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.DeleteRecipe(id); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
    }
}
