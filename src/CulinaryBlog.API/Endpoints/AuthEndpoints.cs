using CulinaryBlog.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace CulinaryBlog.API.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuth(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/v1/auth/register", (AuthHandlers handler, HttpContext context, [FromBody] AuthHandlers.RegisterDto model) => { handler.HttpContext = context; return handler.Register(model); })
            .WithTags("Auth").AddEndpointFilter<RequestValidationFilter>().RequireRateLimiting("registration");
        app.MapPost("/api/auth/register", (AuthHandlers handler, HttpContext context, [FromBody] AuthHandlers.RegisterDto model) => { handler.HttpContext = context; return handler.Register(model); })
            .WithTags("Auth").AddEndpointFilter<RequestValidationFilter>().RequireRateLimiting("registration");
        app.MapPost("/api/v1/auth/signup", (AuthHandlers handler, HttpContext context, [FromBody] AuthHandlers.RegisterDto model) => { handler.HttpContext = context; return handler.Register(model); })
            .WithTags("Auth").AddEndpointFilter<RequestValidationFilter>().RequireRateLimiting("registration");
        app.MapPost("/api/auth/signup", (AuthHandlers handler, HttpContext context, [FromBody] AuthHandlers.RegisterDto model) => { handler.HttpContext = context; return handler.Register(model); })
            .WithTags("Auth").AddEndpointFilter<RequestValidationFilter>().RequireRateLimiting("registration");
        app.MapPost("/api/v1/auth/login", (AuthHandlers handler, HttpContext context, [FromBody] AuthHandlers.LoginDto model) => { handler.HttpContext = context; return handler.Login(model); })
            .WithTags("Auth").AddEndpointFilter<RequestValidationFilter>().RequireRateLimiting("auth");
        app.MapPost("/api/auth/login", (AuthHandlers handler, HttpContext context, [FromBody] AuthHandlers.LoginDto model) => { handler.HttpContext = context; return handler.Login(model); })
            .WithTags("Auth").AddEndpointFilter<RequestValidationFilter>().RequireRateLimiting("auth");
        app.MapGet("/api/v1/auth/me", (AuthHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.GetCurrentUser(); })
            .WithTags("Auth").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapGet("/api/auth/me", (AuthHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.GetCurrentUser(); })
            .WithTags("Auth").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPatch("/api/v1/auth/me", (AuthHandlers handler, HttpContext context, [FromBody] AuthHandlers.MeUpdateDto model) => { handler.HttpContext = context; return handler.UpdateCurrentUser(model); })
            .WithTags("Auth").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPatch("/api/auth/me", (AuthHandlers handler, HttpContext context, [FromBody] AuthHandlers.MeUpdateDto model) => { handler.HttpContext = context; return handler.UpdateCurrentUser(model); })
            .WithTags("Auth").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/auth/refresh", (AuthHandlers handler, HttpContext context, [FromBody] AuthHandlers.RefreshTokenDto model) => { handler.HttpContext = context; return handler.Refresh(model); })
            .WithTags("Auth").AddEndpointFilter<RequestValidationFilter>().RequireRateLimiting("auth");
        app.MapPost("/api/auth/refresh", (AuthHandlers handler, HttpContext context, [FromBody] AuthHandlers.RefreshTokenDto model) => { handler.HttpContext = context; return handler.Refresh(model); })
            .WithTags("Auth").AddEndpointFilter<RequestValidationFilter>().RequireRateLimiting("auth");
        app.MapPost("/api/v1/auth/logout", (AuthHandlers handler, HttpContext context, [FromBody] AuthHandlers.RefreshTokenDto? model) => { handler.HttpContext = context; return handler.Logout(model); })
            .WithTags("Auth").AddEndpointFilter<RequestValidationFilter>().AllowAnonymous();
        app.MapPost("/api/auth/logout", (AuthHandlers handler, HttpContext context, [FromBody] AuthHandlers.RefreshTokenDto? model) => { handler.HttpContext = context; return handler.Logout(model); })
            .WithTags("Auth").AddEndpointFilter<RequestValidationFilter>().AllowAnonymous();
        app.MapPost("/api/v1/auth/google", (AuthHandlers handler, HttpContext context, [FromBody] AuthHandlers.GoogleLoginDto model) => { handler.HttpContext = context; return handler.GoogleLogin(model); })
            .WithTags("Auth").AddEndpointFilter<RequestValidationFilter>().RequireRateLimiting("auth");
        app.MapPost("/api/auth/google", (AuthHandlers handler, HttpContext context, [FromBody] AuthHandlers.GoogleLoginDto model) => { handler.HttpContext = context; return handler.GoogleLogin(model); })
            .WithTags("Auth").AddEndpointFilter<RequestValidationFilter>().RequireRateLimiting("auth");
        app.MapPost("/api/v1/auth/google-login", (AuthHandlers handler, HttpContext context, [FromBody] AuthHandlers.GoogleLoginDto model) => { handler.HttpContext = context; return handler.GoogleLogin(model); })
            .WithTags("Auth").AddEndpointFilter<RequestValidationFilter>().RequireRateLimiting("auth");
        app.MapPost("/api/auth/google-login", (AuthHandlers handler, HttpContext context, [FromBody] AuthHandlers.GoogleLoginDto model) => { handler.HttpContext = context; return handler.GoogleLogin(model); })
            .WithTags("Auth").AddEndpointFilter<RequestValidationFilter>().RequireRateLimiting("auth");
    }
}
