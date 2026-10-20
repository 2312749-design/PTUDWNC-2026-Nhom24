using System.Net;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Encodings.Web;
using CulinaryBlog.API.Endpoints;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Hangfire;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace CulinaryBlog.API.Tests;

public sealed class AuthEndpointContractTests : IAsyncLifetime
{
    private readonly SqliteConnection _connection = new("DataSource=:memory:");
    private WebApplication _app = null!;
    private HttpClient _client = null!;

    public async Task InitializeAsync()
    {
        await _connection.OpenAsync();
        var builder = WebApplication.CreateBuilder();
        builder.WebHost.UseTestServer();
        builder.Configuration.AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["RateLimiting:DefaultPermitLimit"] = "1000",
            ["RateLimiting:LoginPermitLimit"] = "1000",
            ["RateLimiting:RegistrationPermitLimit"] = "1000"
        });
        builder.Services.AddApiSecurity(builder.Configuration);
        builder.Services.AddAuthentication("Test").AddScheme<AuthenticationSchemeOptions, TestAuthentication>("Test", _ => { });
        builder.Services.AddAuthorization();
        builder.Services.AddApplicationHandlers();
        builder.Services.AddDbContext<SqliteApplicationDbContext>(options => options.UseSqlite(_connection));
        builder.Services.AddScoped<ApplicationDbContext>(provider => provider.GetRequiredService<SqliteApplicationDbContext>());
        builder.Services.AddSingleton<ITokenService, TestTokenService>();
        builder.Services.AddSingleton(Mock.Of<IBackgroundJobClient>());

        _app = builder.Build();
        _app.UseRouting();
        _app.UseCors("FrontendPolicy");
        _app.UseRateLimiter();
        _app.UseAuthentication();
        _app.UseAuthorization();
        _app.MapAuth();
        using (var scope = _app.Services.CreateScope())
            await scope.ServiceProvider.GetRequiredService<ApplicationDbContext>().Database.EnsureCreatedAsync();
        await _app.StartAsync();
        _client = _app.GetTestClient();
    }

    public async Task DisposeAsync()
    {
        _client.Dispose();
        await _app.DisposeAsync();
        await _connection.DisposeAsync();
    }

    [Fact]
    public async Task Register_UsesVersionedContractAndReturnsTokenBundle()
    {
        var response = await RegisterAsync("register@example.com", "registerchef");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var document = await ReadJsonAsync(response);
        var data = document.RootElement.GetProperty("data");
        Assert.True(data.TryGetProperty("accessToken", out _));
        Assert.True(data.TryGetProperty("refreshToken", out _));
        Assert.Equal("Người nấu thử", data.GetProperty("user").GetProperty("displayName").GetString());
    }

    [Fact]
    public async Task Register_PasswordMismatchReturnsProblemDetailsWithErrors()
    {
        var response = await _client.PostAsJsonAsync("/api/v1/auth/register", new
        {
            displayName = "Người nấu thử", username = "mismatch", email = "mismatch@example.com",
            password = "Password1!", confirmPassword = "Different1!"
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
        using var document = await ReadJsonAsync(response);
        Assert.True(document.RootElement.TryGetProperty("errors", out var errors));
        Assert.True(errors.EnumerateObject().Any());
    }

    [Fact]
    public async Task Login_AcceptsCorrectPasswordAndRejectsWrongPassword()
    {
        await RegisterAsync("login@example.com", "loginchef");
        var success = await _client.PostAsJsonAsync("/api/v1/auth/login", new { email = "login@example.com", password = "Password1!" });
        var failure = await _client.PostAsJsonAsync("/api/v1/auth/login", new { email = "login@example.com", password = "Wrongpass1!" });

        Assert.Equal(HttpStatusCode.OK, success.StatusCode);
        using var successBody = await ReadJsonAsync(success);
        Assert.True(successBody.RootElement.GetProperty("data").TryGetProperty("accessToken", out _));
        Assert.Equal(HttpStatusCode.Unauthorized, failure.StatusCode);
        using var failureBody = await ReadJsonAsync(failure);
        Assert.Equal(401, failureBody.RootElement.GetProperty("status").GetInt32());
    }

    [Fact]
    public async Task Refresh_RotatesTokenAndReplayRevokesItsFamily()
    {
        var registration = await RegisterAsync("refresh@example.com", "refreshchef");
        using var registrationBody = await ReadJsonAsync(registration);
        var initialRefreshToken = registrationBody.RootElement.GetProperty("data").GetProperty("refreshToken").GetString()!;

        var refresh = await _client.PostAsJsonAsync("/api/v1/auth/refresh", new { refreshToken = initialRefreshToken });
        using var refreshBody = await ReadJsonAsync(refresh);
        var rotatedRefreshToken = refreshBody.RootElement.GetProperty("data").GetProperty("refreshToken").GetString()!;
        var replay = await _client.PostAsJsonAsync("/api/v1/auth/refresh", new { refreshToken = initialRefreshToken });
        var familyAfterReplay = await _client.PostAsJsonAsync("/api/v1/auth/refresh", new { refreshToken = rotatedRefreshToken });

        Assert.Equal(HttpStatusCode.OK, refresh.StatusCode);
        Assert.NotEqual(initialRefreshToken, rotatedRefreshToken);
        Assert.Equal(HttpStatusCode.Unauthorized, replay.StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, familyAfterReplay.StatusCode);
    }

    [Fact]
    public async Task Logout_RevokesThePresentedSession()
    {
        var registration = await RegisterAsync("logout@example.com", "logoutchef");
        using var registrationBody = await ReadJsonAsync(registration);
        var refreshToken = registrationBody.RootElement.GetProperty("data").GetProperty("refreshToken").GetString()!;

        var logout = await _client.PostAsJsonAsync("/api/v1/auth/logout", new { refreshToken });
        var refreshAfterLogout = await _client.PostAsJsonAsync("/api/v1/auth/refresh", new { refreshToken });

        Assert.Equal(HttpStatusCode.NoContent, logout.StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, refreshAfterLogout.StatusCode);
    }

    private Task<HttpResponseMessage> RegisterAsync(string email, string username) =>
        _client.PostAsJsonAsync("/api/v1/auth/register", new
        {
            displayName = "Người nấu thử", username, email,
            password = "Password1!", confirmPassword = "Password1!"
        });

    private static async Task<JsonDocument> ReadJsonAsync(HttpResponseMessage response) =>
        JsonDocument.Parse(await response.Content.ReadAsStringAsync());

    private sealed class TestTokenService : ITokenService
    {
        private int _sequence;
        public string GenerateAccessToken(ApplicationUser user) => $"access-{user.Id}";
        public RefreshToken GenerateRefreshToken(string userId, string ipAddress, string? tokenFamilyId = null) =>
            RefreshToken.Create(userId, $"refresh-{Interlocked.Increment(ref _sequence)}-{Guid.NewGuid():N}", 14, tokenFamilyId);
    }

    private sealed class SqliteApplicationDbContext(DbContextOptions<SqliteApplicationDbContext> options)
        : ApplicationDbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Recipe>().Ignore(recipe => recipe.SearchVector);
        }
    }

    private sealed class TestAuthentication(IOptionsMonitor<AuthenticationSchemeOptions> options, ILoggerFactory logger, UrlEncoder encoder)
        : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
    {
        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (!Request.Headers.TryGetValue("X-Test-User", out var userId)) return Task.FromResult(AuthenticateResult.NoResult());
            var principal = new ClaimsPrincipal(new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, userId.ToString())], "Test"));
            return Task.FromResult(AuthenticateResult.Success(new AuthenticationTicket(principal, "Test")));
        }
    }
}
