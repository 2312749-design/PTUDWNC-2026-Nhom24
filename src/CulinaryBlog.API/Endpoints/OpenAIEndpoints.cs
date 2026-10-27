using CulinaryBlog.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace CulinaryBlog.API.Endpoints;

public static class OpenAIEndpoints
{
    public static void MapOpenAI(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/v1/openai/chat", (OpenAIHandlers handler, HttpContext context, [FromBody] OpenAiChatRequest request, CancellationToken cancellationToken) => { handler.HttpContext = context; return handler.Chat(request, cancellationToken); })
            .WithTags("OpenAI").AddEndpointFilter<RequestValidationFilter>();
    }
}
