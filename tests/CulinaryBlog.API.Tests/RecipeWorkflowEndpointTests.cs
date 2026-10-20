using System.Net;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Text.Json;
using CulinaryBlog.API.Endpoints;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using MediatR;
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
using Xunit;

namespace CulinaryBlog.API.Tests;

public sealed class RecipeWorkflowEndpointTests : IAsyncLifetime
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
            ["RateLimiting:RegistrationPermitLimit"] = "1000",
            ["RateLimiting:UploadPermitLimit"] = "1000"
        });
        builder.Services.AddApiSecurity(builder.Configuration);
        builder.Services.AddAuthentication("Test").AddScheme<AuthenticationSchemeOptions, TestAuthentication>("Test", _ => { });
        builder.Services.AddAuthorization();
        builder.Services.AddApplicationHandlers();
        builder.Services.AddMediatR(configuration => configuration.RegisterServicesFromAssembly(typeof(CulinaryBlog.Application.DTOs.RecipeDto).Assembly));
        builder.Services.AddDbContext<SqliteApplicationDbContext>(options => options.UseSqlite(_connection));
        builder.Services.AddScoped<ApplicationDbContext>(provider => provider.GetRequiredService<SqliteApplicationDbContext>());
        builder.Services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());
        builder.Services.AddSingleton<ICacheService, TestCacheService>();

        _app = builder.Build();
        _app.UseRouting();
        _app.UseCors("FrontendPolicy");
        _app.UseRateLimiter();
        _app.UseAuthentication();
        _app.UseAuthorization();
        _app.MapRecipes();
        _app.MapCategories();
        _app.MapSearch();
        using (var scope = _app.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            await context.Database.EnsureCreatedAsync();
            context.Users.Add(new ApplicationUser
            {
                Id = "recipe-author",
                UserName = "recipeauthor",
                NormalizedUserName = "RECIPEAUTHOR",
                Email = "recipeauthor@example.com",
                NormalizedEmail = "RECIPEAUTHOR@EXAMPLE.COM",
                FullName = "Recipe Author",
                Role = "User"
            });
            await context.SaveChangesAsync();
        }
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
    public async Task RecipeWorkflow_UsesVersionedEndpointsAndSoftDeletesRelatedCategory()
    {
        var categoryResponse = await SendAsAsync(HttpMethod.Post, "/api/v1/categories", new
        {
            name = "Integration recipes", description = "Created through the HTTP contract"
        }, "admin", "Admin");
        Assert.Equal(HttpStatusCode.Created, categoryResponse.StatusCode);
        var categoryId = await DataIdAsync(categoryResponse);

        var createRecipe = await SendAsAsync(HttpMethod.Post, "/api/v1/recipes", new
        {
            title = "Integration tomato soup",
            description = "A soup created through the versioned API.",
            categoryId,
            prepTimeMinutes = 10,
            cookTimeMinutes = 20,
            servings = 2,
            difficulty = "Easy",
            isVegetarian = true,
            recipeIngredients = new[] { new { name = "Tomato", quantity = "4", unit = "pcs", orderIndex = 1 } },
            recipeSteps = new[] { new { description = "Cook until tender." } }
        }, "recipe-author", "User");
        Assert.Equal(HttpStatusCode.Created, createRecipe.StatusCode);
        var recipeId = await DataIdAsync(createRecipe);

        var publish = await SendAsAsync(HttpMethod.Post, $"/api/v1/recipes/{recipeId}/publish", null, "recipe-author", "User");
        Assert.Equal(HttpStatusCode.OK, publish.StatusCode);

        var search = await _client.GetAsync("/api/v1/search/recipes?q=tomato&sortBy=title&sortOrder=asc");
        Assert.Equal(HttpStatusCode.OK, search.StatusCode);
        using (var searchJson = JsonDocument.Parse(await search.Content.ReadAsStringAsync()))
        {
            Assert.Contains(searchJson.RootElement.GetProperty("data").EnumerateArray(), item => item.GetProperty("id").GetGuid().ToString() == recipeId);
        }

        var deleteRecipe = await SendAsAsync(HttpMethod.Delete, $"/api/v1/recipes/{recipeId}", null, "recipe-author", "User");
        Assert.Equal(HttpStatusCode.OK, deleteRecipe.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await _client.GetAsync($"/api/v1/recipes/{recipeId}")).StatusCode);

        var deleteCategory = await SendAsAsync(HttpMethod.Delete, $"/api/v1/categories/{categoryId}", null, "admin", "Admin");
        Assert.Equal(HttpStatusCode.OK, deleteCategory.StatusCode);
        var categories = await _client.GetAsync("/api/v1/categories");
        using var categoriesJson = JsonDocument.Parse(await categories.Content.ReadAsStringAsync());
        Assert.DoesNotContain(categoriesJson.RootElement.GetProperty("data").EnumerateArray(), item => item.GetProperty("id").GetGuid().ToString() == categoryId);
    }

    private async Task<HttpResponseMessage> SendAsAsync(HttpMethod method, string path, object? body, string userId, string role)
    {
        using var request = new HttpRequestMessage(method, path);
        request.Headers.Add("X-Test-User", userId);
        request.Headers.Add("X-Test-Role", role);
        if (body is not null) request.Content = JsonContent.Create(body);
        return await _client.SendAsync(request);
    }

    private static async Task<string> DataIdAsync(HttpResponseMessage response)
    {
        using var document = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        return document.RootElement.GetProperty("data").GetProperty("id").GetGuid().ToString();
    }

    private sealed class SqliteApplicationDbContext(DbContextOptions<SqliteApplicationDbContext> options) : ApplicationDbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Recipe>().Ignore(recipe => recipe.SearchVector);
        }
    }

    private sealed class TestCacheService : ICacheService
    {
        public Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default) => Task.FromResult(default(T));
        public Task SetAsync<T>(string key, T value, TimeSpan? expiry = null, CancellationToken cancellationToken = default) => Task.CompletedTask;
        public Task RemoveAsync(string key, CancellationToken cancellationToken = default) => Task.CompletedTask;
    }

    private sealed class TestAuthentication(IOptionsMonitor<AuthenticationSchemeOptions> options, ILoggerFactory logger, UrlEncoder encoder)
        : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
    {
        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (!Request.Headers.TryGetValue("X-Test-User", out var userId)) return Task.FromResult(AuthenticateResult.NoResult());
            var role = Request.Headers.TryGetValue("X-Test-Role", out var requestedRole) ? requestedRole.ToString() : "User";
            var principal = new ClaimsPrincipal(new ClaimsIdentity([
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Name, userId.ToString()),
                new Claim(ClaimTypes.Role, role)
            ], "Test"));
            return Task.FromResult(AuthenticateResult.Success(new AuthenticationTicket(principal, "Test")));
        }
    }
}
