using CulinaryBlog.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace CulinaryBlog.API.Endpoints;

public static class RecipeFeaturesEndpoints
{
    public static void MapRecipeFeatures(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/features/bookmarks", (RecipeFeaturesHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.Bookmarks(); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapGet("/api/v1/features/bookmarks", (RecipeFeaturesHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.Bookmarks(); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/features/recipes/{recipeId:guid}/bookmark", (RecipeFeaturesHandlers handler, HttpContext context, Guid recipeId) => { handler.HttpContext = context; return handler.SaveRecipe(recipeId); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/features/recipes/{recipeId:guid}/bookmark", (RecipeFeaturesHandlers handler, HttpContext context, Guid recipeId) => { handler.HttpContext = context; return handler.SaveRecipe(recipeId); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapDelete("/api/features/recipes/{recipeId:guid}/bookmark", (RecipeFeaturesHandlers handler, HttpContext context, Guid recipeId) => { handler.HttpContext = context; return handler.UnsaveRecipe(recipeId); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapDelete("/api/v1/features/recipes/{recipeId:guid}/bookmark", (RecipeFeaturesHandlers handler, HttpContext context, Guid recipeId) => { handler.HttpContext = context; return handler.UnsaveRecipe(recipeId); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapGet("/api/features/collections", (RecipeFeaturesHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.Collections(); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapGet("/api/v1/features/collections", (RecipeFeaturesHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.Collections(); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/features/collections", (RecipeFeaturesHandlers handler, HttpContext context, RecipeFeaturesHandlers.CollectionRequest request) => { handler.HttpContext = context; return handler.CreateCollection(request); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/features/collections", (RecipeFeaturesHandlers handler, HttpContext context, RecipeFeaturesHandlers.CollectionRequest request) => { handler.HttpContext = context; return handler.CreateCollection(request); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapDelete("/api/features/collections/{id:guid}", (RecipeFeaturesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.DeleteCollection(id); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapDelete("/api/v1/features/collections/{id:guid}", (RecipeFeaturesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.DeleteCollection(id); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/features/collections/{id:guid}/recipes/{recipeId:guid}", (RecipeFeaturesHandlers handler, HttpContext context, Guid id, Guid recipeId) => { handler.HttpContext = context; return handler.AddToCollection(id, recipeId); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/features/collections/{id:guid}/recipes/{recipeId:guid}", (RecipeFeaturesHandlers handler, HttpContext context, Guid id, Guid recipeId) => { handler.HttpContext = context; return handler.AddToCollection(id, recipeId); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapDelete("/api/features/collections/{id:guid}/recipes/{recipeId:guid}", (RecipeFeaturesHandlers handler, HttpContext context, Guid id, Guid recipeId) => { handler.HttpContext = context; return handler.RemoveFromCollection(id, recipeId); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapDelete("/api/v1/features/collections/{id:guid}/recipes/{recipeId:guid}", (RecipeFeaturesHandlers handler, HttpContext context, Guid id, Guid recipeId) => { handler.HttpContext = context; return handler.RemoveFromCollection(id, recipeId); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapGet("/api/features/recipes/{recipeId:guid}/reviews", (RecipeFeaturesHandlers handler, HttpContext context, Guid recipeId) => { handler.HttpContext = context; return handler.Reviews(recipeId); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().AllowAnonymous();
        app.MapGet("/api/v1/features/recipes/{recipeId:guid}/reviews", (RecipeFeaturesHandlers handler, HttpContext context, Guid recipeId) => { handler.HttpContext = context; return handler.Reviews(recipeId); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().AllowAnonymous();
        app.MapPost("/api/features/recipes/{recipeId:guid}/reviews", (RecipeFeaturesHandlers handler, HttpContext context, Guid recipeId, RecipeFeaturesHandlers.ReviewRequest request) => { handler.HttpContext = context; return handler.SaveReview(recipeId, request); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/features/recipes/{recipeId:guid}/reviews", (RecipeFeaturesHandlers handler, HttpContext context, Guid recipeId, RecipeFeaturesHandlers.ReviewRequest request) => { handler.HttpContext = context; return handler.SaveReview(recipeId, request); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapGet("/api/features/meal-plan", (RecipeFeaturesHandlers handler, HttpContext context, [FromQuery] DateOnly? weekStart = null) => { handler.HttpContext = context; return handler.MealPlan(weekStart); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapGet("/api/v1/features/meal-plan", (RecipeFeaturesHandlers handler, HttpContext context, [FromQuery] DateOnly? weekStart = null) => { handler.HttpContext = context; return handler.MealPlan(weekStart); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/features/meal-plan", (RecipeFeaturesHandlers handler, HttpContext context, RecipeFeaturesHandlers.MealPlanRequest request) => { handler.HttpContext = context; return handler.AddMealPlan(request); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/features/meal-plan", (RecipeFeaturesHandlers handler, HttpContext context, RecipeFeaturesHandlers.MealPlanRequest request) => { handler.HttpContext = context; return handler.AddMealPlan(request); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapDelete("/api/features/meal-plan/{id:guid}", (RecipeFeaturesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.RemoveMealPlan(id); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapDelete("/api/v1/features/meal-plan/{id:guid}", (RecipeFeaturesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.RemoveMealPlan(id); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapGet("/api/features/meal-plan/shopping-list", (RecipeFeaturesHandlers handler, HttpContext context, [FromQuery] DateOnly? weekStart = null) => { handler.HttpContext = context; return handler.ShoppingList(weekStart); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapGet("/api/v1/features/meal-plan/shopping-list", (RecipeFeaturesHandlers handler, HttpContext context, [FromQuery] DateOnly? weekStart = null) => { handler.HttpContext = context; return handler.ShoppingList(weekStart); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPut("/api/features/meal-plan/shopping-list", (RecipeFeaturesHandlers handler, HttpContext context, RecipeFeaturesHandlers.GroceryCheckRequest request) => { handler.HttpContext = context; return handler.SetGroceryCheck(request); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPut("/api/v1/features/meal-plan/shopping-list", (RecipeFeaturesHandlers handler, HttpContext context, RecipeFeaturesHandlers.GroceryCheckRequest request) => { handler.HttpContext = context; return handler.SetGroceryCheck(request); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapGet("/api/features/notifications", (RecipeFeaturesHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.Notifications(); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapGet("/api/v1/features/notifications", (RecipeFeaturesHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.Notifications(); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPut("/api/features/notifications/read-all", (RecipeFeaturesHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.ReadAllNotifications(); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPut("/api/v1/features/notifications/read-all", (RecipeFeaturesHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.ReadAllNotifications(); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPut("/api/features/notifications/{id:guid}/read", (RecipeFeaturesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.ReadNotification(id); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPut("/api/v1/features/notifications/{id:guid}/read", (RecipeFeaturesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.ReadNotification(id); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapGet("/api/features/challenges", (RecipeFeaturesHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.Challenges(); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().AllowAnonymous();
        app.MapGet("/api/v1/features/challenges", (RecipeFeaturesHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.Challenges(); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().AllowAnonymous();
        app.MapPost("/api/features/challenges/{id:guid}/submit", (RecipeFeaturesHandlers handler, HttpContext context, Guid id, RecipeFeaturesHandlers.ChallengeEntryRequest request) => { handler.HttpContext = context; return handler.SubmitChallenge(id, request); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/features/challenges/{id:guid}/submit", (RecipeFeaturesHandlers handler, HttpContext context, Guid id, RecipeFeaturesHandlers.ChallengeEntryRequest request) => { handler.HttpContext = context; return handler.SubmitChallenge(id, request); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapGet("/api/features/creator/stats", (RecipeFeaturesHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.CreatorStats(); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapGet("/api/v1/features/creator/stats", (RecipeFeaturesHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.CreatorStats(); })
            .WithTags("RecipeFeatures").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
    }
}
