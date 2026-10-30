using System.Net;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text.Encodings.Web;
using CulinaryBlog.API.Endpoints;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Infrastructure.Persistence;
using Hangfire;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace CulinaryBlog.API.Tests;

public class HttpSecurityTests : IAsyncLifetime
{
    private WebApplication _app = null!;
    private HttpClient _client = null!;
    public async Task InitializeAsync()
    {
        var builder = WebApplication.CreateBuilder();
        builder.WebHost.UseTestServer();
        builder.Services.AddApiSecurity(builder.Configuration);
        builder.Services.AddAuthentication("Test").AddScheme<AuthenticationSchemeOptions, TestAuthentication>("Test", _ => { });
        builder.Services.AddAuthorization();
        builder.Services.AddApplicationHandlers();
        builder.Services.AddDbContext<ApplicationDbContext>(o => o.UseSqlite("DataSource=:memory:"));
        builder.Services.AddSingleton(Mock.Of<ITokenService>());
        builder.Services.AddSingleton(Mock.Of<IBackgroundJobClient>());
        _app = builder.Build();
        _app.UseRouting();
        _app.UseCors("FrontendPolicy");
        _app.UseRateLimiter();
        _app.UseAuthentication();
        _app.UseAuthorization();
        _app.MapAuth();
        _app.MapAdmin();
        _app.MapPost("/test/upload", () => Results.NoContent()).RequireRateLimiting("upload");
        await _app.StartAsync();
        _client = _app.GetTestClient();
    }
    public async Task DisposeAsync() { _client.Dispose(); await _app.DisposeAsync(); }

    [Theory]
    [InlineData("http://localhost:3000", true)]
    [InlineData("https://attacker.example", false)]
    [InlineData("http://localhost:3000.attacker.example", false)]
    public async Task Cors_OnlyAllowsConfiguredFrontend(string origin, bool allowed)
    {
        using var request = new HttpRequestMessage(HttpMethod.Options, "/api/v1/auth/login");
        request.Headers.Add("Origin", origin);
        request.Headers.Add("Access-Control-Request-Method", "POST");
        var response = await _client.SendAsync(request);
        Assert.Equal(allowed, response.Headers.Contains("Access-Control-Allow-Origin"));
        if (allowed)
        {
            Assert.Equal(origin, response.Headers.GetValues("Access-Control-Allow-Origin").Single());
            Assert.Equal("true", response.Headers.GetValues("Access-Control-Allow-Credentials").Single());
        }
    }

    [Fact]
    public async Task Registration_VersionedRoutesShareLimit_AndLoginHasSeparateBudget()
    {
        foreach (var route in new[] { "/api/v1/auth/register", "/api/v1/auth/signup", "/api/v1/auth/register" })
        {
            var response = await _client.PostAsJsonAsync(route, new { });
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            Assert.Contains("errors", await response.Content.ReadAsStringAsync());
        }
        var rejected = await _client.PostAsJsonAsync("/api/v1/auth/register", new { });
        Assert.Equal(HttpStatusCode.TooManyRequests, rejected.StatusCode);
        Assert.True(rejected.Headers.Contains("Retry-After"));
        Assert.Equal(HttpStatusCode.BadRequest, (await _client.PostAsJsonAsync("/api/v1/auth/login", new { })).StatusCode);
    }

    [Fact]
    public async Task PreVersionedRoutes_AreNotExposed()
    {
        Assert.Equal(HttpStatusCode.NotFound, (await _client.PostAsJsonAsync("/api/auth/login", new { })).StatusCode);
    }

    [Fact]
    public async Task UploadRateLimit_ReturnsRetryAfterAndProblemDetails()
    {
        // The default upload policy is intentionally stricter than the general API policy.
        for (var attempt = 0; attempt < 10; attempt++)
            Assert.Equal(HttpStatusCode.NoContent, (await _client.PostAsync("/test/upload", null)).StatusCode);

        var rejected = await _client.PostAsync("/test/upload", null);

        Assert.Equal(HttpStatusCode.TooManyRequests, rejected.StatusCode);
        Assert.True(rejected.Headers.Contains("Retry-After"));
        Assert.Equal("application/problem+json", rejected.Content.Headers.ContentType?.MediaType);
    }

    [Fact]
    public async Task Admin_RejectsAnonymousAndOrdinaryMembers()
    {
        Assert.Equal(HttpStatusCode.Unauthorized, (await _client.GetAsync("/api/v1/admin/overview")).StatusCode);
        _client.DefaultRequestHeaders.Add("X-Test-Role", "User");
        Assert.Equal(HttpStatusCode.Forbidden, (await _client.GetAsync("/api/v1/admin/users")).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await _client.PutAsync($"/api/v1/admin/reports/{Guid.NewGuid()}/resolve", null)).StatusCode);
    }

    private sealed class TestAuthentication(IOptionsMonitor<AuthenticationSchemeOptions> options, ILoggerFactory logger, UrlEncoder encoder)
        : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
    {
        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (!Request.Headers.TryGetValue("X-Test-Role", out var role)) return Task.FromResult(AuthenticateResult.NoResult());
            var principal = new ClaimsPrincipal(new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, "test"), new Claim(ClaimTypes.Role, role.ToString())], "Test"));
            return Task.FromResult(AuthenticateResult.Success(new AuthenticationTicket(principal, "Test")));
        }
    }
}
