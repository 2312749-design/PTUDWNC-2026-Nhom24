using System.Net;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Text.Json;
using CulinaryBlog.API.Endpoints;
using CulinaryBlog.Application.CQRS.Recipes.Commands;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Exceptions;
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
        builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
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
            recipeIngredients = Enumerable.Range(1, 10).Select(index => new { name = $"Ingredient {index}", quantity = "1", unit = "pcs", orderIndex = index }),
            recipeSteps = Enumerable.Range(1, 5).Select(index => new { description = $"Step {index}: cook until tender." })
        }, "recipe-author", "User");
        Assert.Equal(HttpStatusCode.Created, createRecipe.StatusCode);
        var recipeId = await DataIdAsync(createRecipe);
        using (var createdJson = JsonDocument.Parse(await createRecipe.Content.ReadAsStringAsync()))
        {
            Assert.NotEqual(default, createdJson.RootElement.GetProperty("data").GetProperty("createdAt").GetDateTime());
        }

        var publish = await SendAsAsync(HttpMethod.Post, $"/api/v1/recipes/{recipeId}/publish", null, "recipe-author", "User");
        Assert.Equal(HttpStatusCode.OK, publish.StatusCode);

        // The category page must use the persisted CategoryId relationship,
        // rather than trying to assemble its own stale client-side list.
        var categoryDetail = await _client.GetAsync($"/api/v1/categories/{categoryId}");
        Assert.Equal(HttpStatusCode.OK, categoryDetail.StatusCode);
        using (var categoryJson = JsonDocument.Parse(await categoryDetail.Content.ReadAsStringAsync()))
        {
            var data = categoryJson.RootElement.GetProperty("data");
            Assert.Equal(categoryId, data.GetProperty("category").GetProperty("id").GetGuid().ToString());
            var recipe = Assert.Single(data.GetProperty("recipes").EnumerateArray(), item => item.GetProperty("id").GetGuid().ToString() == recipeId);
            Assert.NotEqual(default, recipe.GetProperty("createdAt").GetDateTime());
        }

        var search = await _client.GetAsync("/api/v1/search/recipes?q=tomato&sortBy=title&sortOrder=asc");
        Assert.Equal(HttpStatusCode.OK, search.StatusCode);
        using (var searchJson = JsonDocument.Parse(await search.Content.ReadAsStringAsync()))
        {
            var recipe = Assert.Single(searchJson.RootElement.GetProperty("data").EnumerateArray(), item => item.GetProperty("id").GetGuid().ToString() == recipeId);
            Assert.NotEqual(default, recipe.GetProperty("createdAt").GetDateTime());
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

    [Fact]
    public async Task PublicRecipeList_OrdersByCreationTimeAndRefreshesLegacyCachedDates()
    {
        using var scope = _app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var category = Category.Create("Newest recipes", "A category for the home page", null);
        context.Categories.Add(category);
        var oldDate = new DateTime(2026, 10, 1, 12, 0, 0, DateTimeKind.Utc);
        var newDate = oldDate.AddDays(5);
        var latestEdit = oldDate.AddDays(20);

        Recipe AddRecipe(string title, DateTime createdAt, DateTime updatedAt, bool published = true)
        {
            var recipe = Recipe.Create(title, "A complete recipe for the home page.",
                Enumerable.Range(1, 10).Select(index => $"Ingredient {index}").ToList(),
                Enumerable.Range(1, 5).Select(index => $"Step {index}: cook until tender.").ToList(),
                category.Id, "recipe-author", cookingTimeMinutes: 30);
            if (published) recipe.Publish(10, 5);
            context.Recipes.Add(recipe);
            context.Entry(recipe).Property(item => item.CreatedAt).CurrentValue = createdAt;
            context.Entry(recipe).Property(item => item.UpdatedAt).CurrentValue = updatedAt;
            return recipe;
        }

        var older = AddRecipe("Older soup with a recent edit", oldDate, latestEdit);
        var newer = AddRecipe("Newer tomato soup", newDate, newDate);
        var tied = AddRecipe("Another newer soup", newDate, newDate);
        AddRecipe("Newest private draft", latestEdit, latestEdit, published: false);
        await context.SaveChangesAsync();

        var cache = scope.ServiceProvider.GetRequiredService<ICacheService>();
        await cache.SetAsync<IEnumerable<RecipeDto>>(CacheKeys.Recipes,
            [new RecipeDto { Id = older.Id, Status = RecipeStatus.Published }]);
        await cache.SetAsync(CacheKeys.Recipe(older.Id),
            new RecipeDto { Id = older.Id, Status = RecipeStatus.Published });
        var expectedIds = new[] { newer.Id, tied.Id }.OrderBy(id => id).Append(older.Id).ToArray();

        // Cover both a pre-upgrade cache entry and the newly populated cache.
        for (var request = 0; request < 2; request++)
        {
            var response = await _client.GetAsync("/api/v1/recipes");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            using var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
            var recipes = json.RootElement.GetProperty("data").EnumerateArray().ToArray();
            Assert.Equal(expectedIds, recipes.Select(item => item.GetProperty("id").GetGuid()));
            Assert.Equal(new[] { newDate, newDate, oldDate }, recipes.Select(item => item.GetProperty("createdAt").GetDateTime()));
            Assert.Equal(latestEdit, recipes[^1].GetProperty("updatedAt").GetDateTime());
        }

        var detail = await _client.GetAsync($"/api/v1/recipes/{older.Id}");
        Assert.Equal(HttpStatusCode.OK, detail.StatusCode);
        using var detailJson = JsonDocument.Parse(await detail.Content.ReadAsStringAsync());
        Assert.Equal(oldDate, detailJson.RootElement.GetProperty("data").GetProperty("createdAt").GetDateTime());
    }

    [Fact]
    public async Task CreateRecipe_WithExplicitNullCollections_ReturnsValidationException()
    {
        using var scope = _app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var category = Category.Create($"Null-safe-{Guid.NewGuid():N}", "", null);
        context.Categories.Add(category);
        await context.SaveChangesAsync();

        var mediator = scope.ServiceProvider.GetRequiredService<IMediator>();
        var exception = await Assert.ThrowsAsync<ValidationException>(() => mediator.Send(new CreateRecipeCommand
        {
            Title = "Recipe with null collections",
            Description = "The handler should return a validation error instead of a server error.",
            CategoryId = category.Id,
            AuthorId = "recipe-author",
            PrepTimeMinutes = 10,
            CookTimeMinutes = 15,
            Servings = 2,
            Ingredients = null!,
            Instructions = null!,
            RecipeIngredients = null!,
            RecipeSteps = null!
        }));

        Assert.Contains("ít nhất", exception.Message);
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
            builder.Entity<Recipe>().Ignore("SearchVector");
        }
    }

    private sealed class TestCacheService : ICacheService
    {
        private readonly System.Collections.Concurrent.ConcurrentDictionary<string, object> _values = new();

        public Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default) =>
            Task.FromResult(_values.TryGetValue(key, out var value) && value is T typed ? typed : default);

        public Task SetAsync<T>(string key, T value, TimeSpan? expiry = null, CancellationToken cancellationToken = default)
        {
            if (value is not null) _values[key] = value;
            return Task.CompletedTask;
        }

        public Task RemoveAsync(string key, CancellationToken cancellationToken = default)
        {
            _values.TryRemove(key, out _);
            return Task.CompletedTask;
        }
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
