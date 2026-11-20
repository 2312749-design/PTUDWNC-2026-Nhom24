using CulinaryBlog.API.Endpoints;
using CulinaryBlog.Application.CQRS.Auth.Commands;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Infrastructure.Jobs;
using CulinaryBlog.Infrastructure.Persistence;
using Hangfire;
using Microsoft.AspNetCore.DataProtection;

namespace CulinaryBlog.API.Services;

/// <summary>
/// Bridges MediatR authentication commands to the existing secure-cookie and
/// refresh-rotation implementation without leaking ASP.NET types into Application.
/// </summary>
public sealed class AuthenticationWorkflowAdapter(
    ApplicationDbContext context,
    ITokenService tokenService,
    IBackgroundJobClient backgroundJobs,
    IConfiguration configuration,
    IGoogleIdentityVerifier googleVerifier,
    AccountSecurityService security,
    IEmailSender emailSender,
    IDataProtectionProvider dataProtectionProvider,
    ILogger<AuthHandlers> logger,
    IHttpContextAccessor httpContextAccessor) : IAuthenticationWorkflow
{
    public async Task<object> RegisterAsync(RegisterCommand command, CancellationToken cancellationToken)
    {
        var handler = CreateHandler();
        return await handler.Register(new AuthHandlers.RegisterDto
        {
            DisplayName = command.DisplayName, FullName = command.FullName, AvatarUrl = command.AvatarUrl,
            Bio = command.Bio, Username = command.Username, Email = command.Email, Password = command.Password,
            ConfirmPassword = command.ConfirmPassword, CaptchaQuestion = command.CaptchaQuestion, CaptchaAnswer = command.CaptchaAnswer
        });
    }

    public async Task<object> LoginAsync(LoginCommand command, CancellationToken cancellationToken)
    {
        var handler = CreateHandler();
        return await handler.Login(new AuthHandlers.LoginDto
        {
            Email = command.Email, Username = command.Username, Password = command.Password,
            TwoFactorCode = command.TwoFactorCode
        });
    }

    public async Task<object> RefreshAsync(RefreshSessionCommand command, CancellationToken cancellationToken)
    {
        var handler = CreateHandler();
        return await handler.Refresh(new AuthHandlers.RefreshTokenDto { RefreshToken = command.RefreshToken });
    }

    private AuthHandlers CreateHandler()
    {
        var httpContext = httpContextAccessor.HttpContext ?? throw new InvalidOperationException("HTTP context is unavailable.");
        return new AuthHandlers(context, tokenService, backgroundJobs, configuration, googleVerifier, security,
            emailSender, dataProtectionProvider, logger) { HttpContext = httpContext };
    }
}

