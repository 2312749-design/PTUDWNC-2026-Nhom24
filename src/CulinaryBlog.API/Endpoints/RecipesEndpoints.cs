using CulinaryBlog.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace CulinaryBlog.API.Endpoints;

public static class RecipesEndpoints
{
    public static void MapRecipes(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/v1/recipes", (RecipesHandlers handler, SearchHandlers search, HttpContext context,
            [FromQuery] int? page, [FromQuery] int? pageSize, [FromQuery] Guid? categoryId,
            [FromQuery] int? maxMinutes, [FromQuery] string? difficulty, [FromQuery] bool? vegetarian,
            [FromQuery] string? sortBy, [FromQuery] string? sortOrder) =>
        {
            handler.HttpContext = context;
            if (context.Request.Query.Count == 0) return handler.GetAllRecipes();
            search.HttpContext = context;
            return search.SearchRecipes(null, categoryId, maxMinutes, difficulty, vegetarian, null, null, sortBy, sortOrder, page ?? 1, pageSize ?? 12);
        })
            .WithTags("Recipes");
        app.MapGet("/api/v1/recipes/{id:guid}", (RecipesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.GetRecipeById(id); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().AllowAnonymous();
        app.MapGet("/api/v1/recipes/{slug}", (RecipesHandlers handler, HttpContext context, string slug) => { handler.HttpContext = context; return handler.GetRecipeBySlug(slug); })
            .WithTags("Recipes").AllowAnonymous();
        app.MapGet("/api/v1/recipes/slug/{slug}", (RecipesHandlers handler, HttpContext context, string slug) => { handler.HttpContext = context; return handler.GetRecipeBySlug(slug); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().AllowAnonymous();
        app.MapGet("/api/v1/recipes/mine", (RecipesHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.GetMyRecipes(); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapGet("/api/v1/recipes/sitemap", (RecipesHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.GetSitemapRecipes(); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().AllowAnonymous();
        app.MapPost("/api/v1/recipes/{id:guid}/view", (RecipesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.RecordView(id); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/recipes", (RecipesHandlers handler, HttpContext context, [FromBody] CreateRecipeDto dto) => { handler.HttpContext = context; return handler.CreateRecipe(dto); })
            // The product has two account groups: administrators and members.
            // Every signed-in member may contribute a recipe; ownership checks
            // still protect later updates, publishing and deletion.
            .WithTags("Recipes").RequireAuthorization();
        app.MapPut("/api/v1/recipes/{id:guid}", (RecipesHandlers handler, HttpContext context, Guid id, [FromBody] UpdateRecipeDto dto) => { handler.HttpContext = context; return handler.UpdateRecipe(id, dto); })
            .WithTags("Recipes").RequireAuthorization();
        app.MapPatch("/api/v1/recipes/{id:guid}", (RecipesHandlers handler, HttpContext context, Guid id, [FromBody] PatchRecipeDto dto) => { handler.HttpContext = context; return handler.PatchRecipe(id, dto); })
            .WithTags("Recipes").RequireAuthorization();
        app.MapMethods("/api/v1/recipes/{id:guid}/publish", [HttpMethods.Patch, HttpMethods.Post], (RecipesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.PublishRecipe(id); })
            .WithTags("Recipes").RequireAuthorization();
        app.MapPost("/api/v1/recipes/{id:guid}/submit-review", (RecipesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.SubmitForReview(id); })
            .WithTags("Recipes").RequireAuthorization();
        app.MapMethods("/api/v1/recipes/{id:guid}/unpublish", [HttpMethods.Patch, HttpMethods.Post], (RecipesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.UnpublishRecipe(id); })
            .WithTags("Recipes").RequireAuthorization();
        app.MapMethods("/api/v1/recipes/{id:guid}/archive", [HttpMethods.Patch, HttpMethods.Post], (RecipesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.ArchiveRecipe(id); })
            .WithTags("Recipes").RequireAuthorization();
        app.MapPost("/api/v1/recipes/{id:guid}/restore", (RecipesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.RestoreRecipe(id); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/recipes/{id:guid}/images", (RecipesHandlers handler, HttpContext context, Guid id, IFormFile file, [FromForm] string? altText, [FromForm(Name = "isPrimary")] bool? primary) => { handler.HttpContext = context; return handler.UploadRecipeImage(id, file, altText, primary); })
            .WithTags("Recipe images").RequireAuthorization().RequireRateLimiting("upload").DisableAntiforgery();
        app.MapPut("/api/v1/recipes/{id:guid}/images/{imageId:guid}/primary", (RecipesHandlers handler, HttpContext context, Guid id, Guid imageId) => { handler.HttpContext = context; return handler.SetPrimaryRecipeImage(id, imageId); })
            .WithTags("Recipe images").RequireAuthorization();
        app.MapPatch("/api/v1/recipes/{id:guid}/images/{imageId:guid}", (RecipesHandlers handler, HttpContext context, Guid id, Guid imageId, [FromBody] RecipeImageMetadata request) => { handler.HttpContext = context; return handler.UpdateRecipeImage(id, imageId, request); })
            .WithTags("Recipe images").RequireAuthorization();
        app.MapDelete("/api/v1/recipes/{id:guid}/images/{imageId:guid}", (RecipesHandlers handler, HttpContext context, Guid id, Guid imageId) => { handler.HttpContext = context; return handler.DeleteRecipeImage(id, imageId); })
            .WithTags("Recipe images").RequireAuthorization();
        app.MapDelete("/api/v1/recipes/{id:guid}", (RecipesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.DeleteRecipe(id); })
            .WithTags("Recipes").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
    }
}

public sealed record RecipeImageMetadata(string? AltText, bool? IsPrimary, int? OrderIndex);
