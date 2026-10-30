using System.Net;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Encodings.Web;
using CulinaryBlog.API.Endpoints;
using CulinaryBlog.API.Services;
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
using System.Security.Cryptography;
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
        builder.Services.AddDataProtection();
        builder.Services.AddScoped<AccountSecurityService>();
        builder.Services.AddDbContext<SqliteApplicationDbContext>(options => options.UseSqlite(_connection));
        builder.Services.AddScoped<ApplicationDbContext>(provider => provider.GetRequiredService<SqliteApplicationDbContext>());
        builder.Services.AddSingleton<ITokenService, TestTokenService>();
        builder.Services.AddSingleton(Mock.Of<IBackgroundJobClient>());
        builder.Services.AddSingleton(Mock.Of<IFileStorageService>());

        _app = builder.Build();
        _app.UseRouting();
        _app.UseCors("FrontendPolicy");
        _app.UseRateLimiter();
        _app.UseAuthentication();
        _app.UseAuthorization();
        _app.MapAuth();
        _app.MapAccount();
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
    public async Task Register_UsesVersionedContractAndStoresRefreshTokenInHttpOnlyCookie()
    {
        var response = await RegisterAsync("register@example.com", "registerchef");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var document = await ReadJsonAsync(response);
        var data = document.RootElement.GetProperty("data");
        Assert.True(data.TryGetProperty("accessToken", out _));
        Assert.False(data.TryGetProperty("refreshToken", out _));
        Assert.Contains(response.Headers.GetValues("Set-Cookie"), value => value.StartsWith($"{AuthHandlers.RefreshTokenCookieName}=", StringComparison.Ordinal) && value.Contains("httponly", StringComparison.OrdinalIgnoreCase));
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
        var initialRefreshToken = ReadRefreshCookie(registration);

        var refresh = await PostWithRefreshCookieAsync("/api/v1/auth/refresh", initialRefreshToken);
        var rotatedRefreshToken = ReadRefreshCookie(refresh);
        var replay = await PostWithRefreshCookieAsync("/api/v1/auth/refresh", initialRefreshToken);
        var familyAfterReplay = await PostWithRefreshCookieAsync("/api/v1/auth/refresh", rotatedRefreshToken);

        Assert.Equal(HttpStatusCode.OK, refresh.StatusCode);
        Assert.NotEqual(initialRefreshToken, rotatedRefreshToken);
        Assert.Equal(HttpStatusCode.Unauthorized, replay.StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, familyAfterReplay.StatusCode);
    }

    [Fact]
    public async Task Logout_RevokesThePresentedSession()
    {
        var registration = await RegisterAsync("logout@example.com", "logoutchef");
        var refreshToken = ReadRefreshCookie(registration);

        var logout = await PostWithRefreshCookieAsync("/api/v1/auth/logout", refreshToken);
        var refreshAfterLogout = await PostWithRefreshCookieAsync("/api/v1/auth/refresh", refreshToken);

        Assert.Equal(HttpStatusCode.NoContent, logout.StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, refreshAfterLogout.StatusCode);
    }

    [Fact]
    public async Task TwoFactorSetup_RequiresAuthenticatorCodeForLaterLogin_AndReturnsTenRecoveryCodes()
    {
        const string email = "two-factor@example.com";
        const string password = "Password1!";
        const string userId = "two-factor-user";
        using (var scope = _app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var user = ApplicationUser.Create("Người nấu 2FA", email, "twofactor");
            user.Id = userId;
            user.PasswordHash = new Microsoft.AspNetCore.Identity.PasswordHasher<ApplicationUser>().HashPassword(user, password);
            db.Users.Add(user);
            await db.SaveChangesAsync();
        }

        using var setupRequest = JsonRequest(HttpMethod.Post, "/api/v1/account/2fa/setup", new { currentPassword = password }, userId);
        var setupResponse = await _client.SendAsync(setupRequest);
        Assert.Equal(HttpStatusCode.OK, setupResponse.StatusCode);
        using var setupJson = await ReadJsonAsync(setupResponse);
        var manualKey = setupJson.RootElement.GetProperty("data").GetProperty("manualKey").GetString();
        Assert.False(string.IsNullOrWhiteSpace(manualKey));

        using var enableRequest = JsonRequest(HttpMethod.Post, "/api/v1/account/2fa/enable", new { code = CreateCurrentTotp(manualKey!) }, userId);
        var enableResponse = await _client.SendAsync(enableRequest);
        Assert.Equal(HttpStatusCode.OK, enableResponse.StatusCode);
        using var enableJson = await ReadJsonAsync(enableResponse);
        var enableData = enableJson.RootElement.GetProperty("data");
        Assert.Equal(10, enableData.GetProperty("recoveryCodes").GetArrayLength());
        var recoveryCode = enableData.GetProperty("recoveryCodes")[0].GetString();

        var missingCode = await _client.PostAsJsonAsync("/api/v1/auth/login", new { email, password });
        Assert.Equal(HttpStatusCode.Unauthorized, missingCode.StatusCode);
        using var missingCodeJson = await ReadJsonAsync(missingCode);
        Assert.Equal("AUTH_2FA_REQUIRED", missingCodeJson.RootElement.GetProperty("code").GetString());

        var verifiedLogin = await _client.PostAsJsonAsync("/api/v1/auth/login", new { email, password, twoFactorCode = CreateCurrentTotp(manualKey!) });
        Assert.Equal(HttpStatusCode.OK, verifiedLogin.StatusCode);

        var recoveryLogin = await _client.PostAsJsonAsync("/api/v1/auth/login", new { email, password, recoveryCode });
        Assert.Equal(HttpStatusCode.OK, recoveryLogin.StatusCode);
        var reusedRecoveryCode = await _client.PostAsJsonAsync("/api/v1/auth/login", new { email, password, recoveryCode });
        Assert.Equal(HttpStatusCode.Unauthorized, reusedRecoveryCode.StatusCode);

        using var overviewRequest = new HttpRequestMessage(HttpMethod.Get, "/api/v1/account/security");
        overviewRequest.Headers.Add("X-Test-User", userId);
        var overviewResponse = await _client.SendAsync(overviewRequest);
        Assert.Equal(HttpStatusCode.OK, overviewResponse.StatusCode);
        using var overviewJson = await ReadJsonAsync(overviewResponse);
        var overviewData = overviewJson.RootElement.GetProperty("data");
        Assert.True(overviewData.GetProperty("sessions").GetArrayLength() >= 2);
        Assert.Contains(overviewData.GetProperty("activities").EnumerateArray(), item => item.GetProperty("activityType").GetString() == "two_factor.enabled");

        var sessionId = overviewData.GetProperty("sessions")[0].GetProperty("id").GetGuid();
        using var revokeRequest = JsonRequest(HttpMethod.Delete, $"/api/v1/account/sessions/{sessionId}", new { }, userId);
        var revokeResponse = await _client.SendAsync(revokeRequest);
        Assert.Equal(HttpStatusCode.NoContent, revokeResponse.StatusCode);
    }

    private Task<HttpResponseMessage> RegisterAsync(string email, string username) =>
        _client.PostAsJsonAsync("/api/v1/auth/register", new
        {
            displayName = "Người nấu thử", username, email,
            password = "Password1!", confirmPassword = "Password1!"
        });

    private async Task<HttpResponseMessage> PostWithRefreshCookieAsync(string path, string refreshToken)
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, path)
        {
            Content = JsonContent.Create(new { })
        };
        request.Headers.TryAddWithoutValidation("Cookie", $"{AuthHandlers.RefreshTokenCookieName}={refreshToken}");
        return await _client.SendAsync(request);
    }

    private static HttpRequestMessage JsonRequest(HttpMethod method, string path, object payload, string userId)
    {
        var request = new HttpRequestMessage(method, path) { Content = JsonContent.Create(payload) };
        request.Headers.Add("X-Test-User", userId);
        return request;
    }

    private static string CreateCurrentTotp(string base32Secret)
    {
        const string alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        var buffer = 0;
        var bits = 0;
        var secret = new List<byte>();
        foreach (var character in base32Secret)
        {
            buffer = (buffer << 5) | alphabet.IndexOf(character);
            bits += 5;
            if (bits >= 8) { secret.Add((byte)(buffer >> (bits - 8))); bits -= 8; }
        }
        var counter = DateTimeOffset.UtcNow.ToUnixTimeSeconds() / 30;
        var counterBytes = BitConverter.GetBytes(counter);
        if (BitConverter.IsLittleEndian) Array.Reverse(counterBytes);
        using var hmac = new HMACSHA1(secret.ToArray());
        var hash = hmac.ComputeHash(counterBytes);
        var offset = hash[^1] & 0x0f;
        var binary = ((hash[offset] & 0x7f) << 24) | (hash[offset + 1] << 16) | (hash[offset + 2] << 8) | hash[offset + 3];
        return (binary % 1_000_000).ToString("D6", System.Globalization.CultureInfo.InvariantCulture);
    }

    private static string ReadRefreshCookie(HttpResponseMessage response)
    {
        var prefix = $"{AuthHandlers.RefreshTokenCookieName}=";
        var cookie = response.Headers.GetValues("Set-Cookie").Single(value => value.StartsWith(prefix, StringComparison.OrdinalIgnoreCase));
        return cookie[prefix.Length..].Split(';', 2)[0];
    }

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
            builder.Entity<Recipe>().Ignore("SearchVector");
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
