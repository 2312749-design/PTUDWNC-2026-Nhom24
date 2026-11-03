using CulinaryBlog.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace CulinaryBlog.API.Endpoints;

public static class ArticlesEndpoints
{
    public static void MapArticles(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/v1/articles", (ArticlesHandlers handler, HttpContext context, [FromQuery] int take = 12) => { handler.HttpContext = context; return handler.GetArticles(take); })
            .WithTags("Articles").AddEndpointFilter<RequestValidationFilter>();
        app.MapGet("/api/v1/articles/{slug}", (ArticlesHandlers handler, HttpContext context, string slug) => { handler.HttpContext = context; return handler.GetBySlug(slug); })
            .WithTags("Articles").AddEndpointFilter<RequestValidationFilter>();
        app.MapPost("/api/v1/articles", (ArticlesHandlers handler, HttpContext context, [FromBody] ArticlesHandlers.ArticleRequest request) => { handler.HttpContext = context; return handler.Create(request); })
            .WithTags("Articles").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPut("/api/v1/articles/{id:guid}", (ArticlesHandlers handler, HttpContext context, Guid id, [FromBody] ArticlesHandlers.ArticleRequest request) => { handler.HttpContext = context; return handler.Update(id, request); })
            .WithTags("Articles").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapDelete("/api/v1/articles/{id:guid}", (ArticlesHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.Delete(id); })
            .WithTags("Articles").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
    }
}
