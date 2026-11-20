using CulinaryBlog.API.Endpoints;
using CulinaryBlog.API.Middleware;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace CulinaryBlog.API.Tests;

public sealed class CsrfProtectionMiddlewareTests
{
    private static IConfiguration Configuration() => new ConfigurationBuilder()
        .AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["Cors:AllowedOrigins:0"] = "http://localhost:3000"
        })
        .Build();

    [Fact]
    public async Task CookieAuthenticatedMutation_RejectsMissingCsrfToken()
    {
        var reachedEndpoint = false;
        var middleware = new CsrfProtectionMiddleware(_ =>
        {
            reachedEndpoint = true;
            return Task.CompletedTask;
        }, Configuration());
        var context = new DefaultHttpContext();
        context.RequestServices = new ServiceCollection().AddLogging().AddProblemDetails().BuildServiceProvider();
        context.Request.Method = HttpMethods.Post;
        context.Request.Headers.Cookie = $"{AuthHandlers.AccessTokenCookieName}=access-token";
        context.Response.Body = new MemoryStream();

        await middleware.InvokeAsync(context);

        Assert.False(reachedEndpoint);
        Assert.Equal(StatusCodes.Status403Forbidden, context.Response.StatusCode);
    }

    [Fact]
    public async Task CookieAuthenticatedMutation_AllowsMatchingDoubleSubmitToken()
    {
        var reachedEndpoint = false;
        var middleware = new CsrfProtectionMiddleware(_ =>
        {
            reachedEndpoint = true;
            return Task.CompletedTask;
        }, Configuration());
        var context = new DefaultHttpContext();
        context.RequestServices = new ServiceCollection().AddLogging().AddProblemDetails().BuildServiceProvider();
        context.Request.Method = HttpMethods.Patch;
        context.Request.Headers.Origin = "http://localhost:3000";
        context.Request.Headers.Cookie = $"{AuthHandlers.AccessTokenCookieName}=access-token; {AuthHandlers.CsrfTokenCookieName}=csrf-token";
        context.Request.Headers[AuthHandlers.CsrfTokenHeaderName] = "csrf-token";

        await middleware.InvokeAsync(context);

        Assert.True(reachedEndpoint);
    }

    [Fact]
    public async Task CookieAuthenticatedMutation_RejectsUntrustedOrigin()
    {
        var middleware = new CsrfProtectionMiddleware(_ => Task.CompletedTask, Configuration());
        var context = new DefaultHttpContext();
        context.RequestServices = new ServiceCollection().AddLogging().AddProblemDetails().BuildServiceProvider();
        context.Request.Method = HttpMethods.Delete;
        context.Request.Headers.Origin = "https://attacker.invalid";
        context.Request.Headers.Cookie = $"{AuthHandlers.RefreshTokenCookieName}=refresh-token; {AuthHandlers.CsrfTokenCookieName}=csrf-token";
        context.Request.Headers[AuthHandlers.CsrfTokenHeaderName] = "csrf-token";
        context.Response.Body = new MemoryStream();

        await middleware.InvokeAsync(context);

        Assert.Equal(StatusCodes.Status403Forbidden, context.Response.StatusCode);
    }
}
