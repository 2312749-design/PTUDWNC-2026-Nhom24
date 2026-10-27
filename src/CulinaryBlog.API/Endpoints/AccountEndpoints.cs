using CulinaryBlog.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace CulinaryBlog.API.Endpoints;

public static class AccountEndpoints
{
    public static void MapAccount(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/v1/account/me", (AccountHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.GetMe(); })
            .WithTags("Account").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPut("/api/v1/account/profile", (AccountHandlers handler, HttpContext context, AccountHandlers.ProfileRequest request) => { handler.HttpContext = context; return handler.UpdateProfile(request); })
            .WithTags("Account").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/account/avatar", (AccountHandlers handler, HttpContext context, IFormFile file) => { handler.HttpContext = context; return handler.UploadAvatar(file); })
            .WithTags("Account").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization().RequireRateLimiting("upload").DisableAntiforgery().WithMetadata(new RequestSizeLimitAttribute(5 * 1024 * 1024));
        app.MapPut("/api/v1/account/password", (AccountHandlers handler, HttpContext context, AccountHandlers.ChangePasswordRequest request) => { handler.HttpContext = context; return handler.ChangePassword(request); })
            .WithTags("Account").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapGet("/api/v1/account/security", (AccountHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.SecurityOverview(); })
            .WithTags("Account security").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/account/2fa/setup", (AccountHandlers handler, HttpContext context, AccountHandlers.CurrentPasswordRequest request) => { handler.HttpContext = context; return handler.SetupTwoFactor(request); })
            .WithTags("Account security").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/account/2fa/enable", (AccountHandlers handler, HttpContext context, AccountHandlers.TwoFactorCodeRequest request) => { handler.HttpContext = context; return handler.EnableTwoFactor(request); })
            .WithTags("Account security").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/account/2fa/disable", (AccountHandlers handler, HttpContext context, AccountHandlers.TwoFactorDisableRequest request) => { handler.HttpContext = context; return handler.DisableTwoFactor(request); })
            .WithTags("Account security").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/account/2fa/recovery-codes", (AccountHandlers handler, HttpContext context, AccountHandlers.TwoFactorDisableRequest request) => { handler.HttpContext = context; return handler.RegenerateRecoveryCodes(request); })
            .WithTags("Account security").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapDelete("/api/v1/account/sessions/{id:guid}", (AccountHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.RevokeSession(id); })
            .WithTags("Account security").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/account/sessions/revoke-others", (AccountHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.RevokeOtherSessions(); })
            .WithTags("Account security").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/account/email-change/request", (AccountHandlers handler, HttpContext context, AccountHandlers.EmailChangeStartRequest request) => { handler.HttpContext = context; return handler.RequestEmailChange(request); })
            .WithTags("Account security").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization().RequireRateLimiting("auth");
        app.MapPost("/api/v1/account/email-change/confirm", (AccountHandlers handler, HttpContext context, AccountHandlers.EmailChangeConfirmRequest request) => { handler.HttpContext = context; return handler.ConfirmEmailChange(request); })
            .WithTags("Account security").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization().RequireRateLimiting("auth");
    }
}
