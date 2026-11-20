using CulinaryBlog.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace CulinaryBlog.API.Endpoints;

public static class CategoriesEndpoints
{
    public static void MapCategories(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/v1/categories", (CategoriesHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.GetAllCategories(); })
            .WithTags("Categories");
        app.MapGet("/api/v1/categories/{id:guid}", (CategoriesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.GetCategoryDetail(id); })
            .WithTags("Categories");
        app.MapGet("/api/v1/categories/{slug}", (CategoriesHandlers handler, HttpContext context, string slug) => { handler.HttpContext = context; return handler.GetCategoryBySlug(slug); })
            .WithTags("Categories").AllowAnonymous();
        app.MapPost("/api/v1/categories", (CategoriesHandlers handler, HttpContext context, [FromBody] CreateCategoryDto dto) => { handler.HttpContext = context; return handler.CreateCategory(dto); })
            .WithTags("Categories").RequireAuthorization(policy => policy.RequireRole("Admin"));
        app.MapPut("/api/v1/categories/{id}", (CategoriesHandlers handler, HttpContext context, Guid id, [FromBody] CreateCategoryDto dto) => { handler.HttpContext = context; return handler.UpdateCategory(id, dto); })
            .WithTags("Categories").RequireAuthorization(policy => policy.RequireRole("Admin"));
        app.MapDelete("/api/v1/categories/{id}", (CategoriesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.DeleteCategory(id); })
            .WithTags("Categories").RequireAuthorization(policy => policy.RequireRole("Admin"));
    }
}
