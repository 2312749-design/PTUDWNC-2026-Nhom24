using CulinaryBlog.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace CulinaryBlog.API.Endpoints;

public static class AccountEndpoints
{
    public static void MapAccount(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/account/me", (AccountHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.GetMe(); })
            .WithTags("Account").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapGet("/api/v1/account/me", (AccountHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.GetMe(); })
            .WithTags("Account").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPut("/api/account/profile", (AccountHandlers handler, HttpContext context, AccountHandlers.ProfileRequest request) => { handler.HttpContext = context; return handler.UpdateProfile(request); })
            .WithTags("Account").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPut("/api/v1/account/profile", (AccountHandlers handler, HttpContext context, AccountHandlers.ProfileRequest request) => { handler.HttpContext = context; return handler.UpdateProfile(request); })
            .WithTags("Account").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/account/avatar", (AccountHandlers handler, HttpContext context, IFormFile file) => { handler.HttpContext = context; return handler.UploadAvatar(file); })
            .WithTags("Account").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization().RequireRateLimiting("upload").DisableAntiforgery().WithMetadata(new RequestSizeLimitAttribute(5 * 1024 * 1024));
        app.MapPost("/api/v1/account/avatar", (AccountHandlers handler, HttpContext context, IFormFile file) => { handler.HttpContext = context; return handler.UploadAvatar(file); })
            .WithTags("Account").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization().RequireRateLimiting("upload").DisableAntiforgery().WithMetadata(new RequestSizeLimitAttribute(5 * 1024 * 1024));
        app.MapPut("/api/account/password", (AccountHandlers handler, HttpContext context, AccountHandlers.ChangePasswordRequest request) => { handler.HttpContext = context; return handler.ChangePassword(request); })
            .WithTags("Account").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPut("/api/v1/account/password", (AccountHandlers handler, HttpContext context, AccountHandlers.ChangePasswordRequest request) => { handler.HttpContext = context; return handler.ChangePassword(request); })
            .WithTags("Account").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
    }
}
