using System.Net;
using System.Text.Json;
using CulinaryBlog.API.Endpoints;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace CulinaryBlog.API.Tests;

public sealed class CommunityLeaderboardEndpointTests : IAsyncLifetime
{
    private readonly SqliteConnection _connection = new("DataSource=:memory:");
    private WebApplication _app = null!;
    private HttpClient _client = null!;

    public async Task InitializeAsync()
    {
        await _connection.OpenAsync();
        var builder = WebApplication.CreateBuilder();
        builder.WebHost.UseTestServer();
        builder.Services.AddAuthorization();
        builder.Services.AddDbContext<TestApplicationDbContext>(options => options.UseSqlite(_connection));
        builder.Services.AddScoped<ApplicationDbContext>(services => services.GetRequiredService<TestApplicationDbContext>());
        _app = builder.Build();
        _app.UseRouting();
        _app.UseAuthorization();
        _app.MapExtensions();
        using var scope = _app.Services.CreateScope();
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
    public async Task Leaderboard_WithNoActivity_ReturnsAnEmptyPublicList()
    {
        using var response = await _client.GetAsync("/api/v1/extensions/leaderboard");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var document = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        Assert.Empty(document.RootElement.GetProperty("data").GetProperty("items").EnumerateArray());
    }

    [Fact]
    public async Task Leaderboard_CombinesActivityScoresAndReturnsTheTopTwentyWithoutPrivateFields()
    {
        using (var scope = _app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var chef = User("chef");
            var both = User("both");
            var reactor = User("reactor");
            var inactive = User("inactive");
            var fillers = Enumerable.Range(0, 22).Select(index => User($"filler{index}")).ToList();
            db.Users.AddRange([chef, both, reactor, inactive, .. fillers]);
            var category = Category.Create("Leaderboard category", "Fixture category", null);
            var recipe = Recipe.Create("Leaderboard recipe", "Recipe for a challenge", ["ingredient"], ["Prepare it"], category.Id, chef.Id);
            var firstChallenge = new CookingChallenge { Title = "First challenge", Theme = "Test" };
            var secondChallenge = new CookingChallenge { Title = "Second challenge", Theme = "Test" };
            var posts = Enumerable.Range(0, 4).Select(index => new CommunityPost { AuthorId = chef.Id, Content = $"Post {index}" }).ToList();
            db.AddRange(category, recipe, firstChallenge, secondChallenge);
            db.CommunityPosts.AddRange(posts);
            db.ChallengeSubmissions.AddRange(
                new ChallengeSubmission { ChallengeId = firstChallenge.Id, UserId = chef.Id, RecipeId = recipe.Id },
                new ChallengeSubmission { ChallengeId = secondChallenge.Id, UserId = chef.Id, RecipeId = recipe.Id },
                new ChallengeSubmission { ChallengeId = firstChallenge.Id, UserId = both.Id, RecipeId = recipe.Id });
            db.PostReactions.AddRange(posts.Select(post => new PostReaction { PostId = post.Id, UserId = reactor.Id }));
            db.PostReactions.AddRange(posts.Take(2).Select(post => new PostReaction { PostId = post.Id, UserId = both.Id }));
            db.PostReactions.AddRange(fillers.Select(user => new PostReaction { PostId = posts[0].Id, UserId = user.Id }));
            await db.SaveChangesAsync();
        }

        using var response = await _client.GetAsync("/api/v1/extensions/leaderboard");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var document = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        var items = document.RootElement.GetProperty("data").GetProperty("items").EnumerateArray().ToList();
        Assert.Equal(20, items.Count);
        Assert.Equal("chef", items[0].GetProperty("userName").GetString());
        Assert.Equal(20, items[0].GetProperty("points").GetInt32());
        Assert.Equal("both", items[1].GetProperty("userName").GetString());
        Assert.Equal(12, items[1].GetProperty("points").GetInt32());
        Assert.Equal("reactor", items[2].GetProperty("userName").GetString());
        Assert.Equal(4, items[2].GetProperty("points").GetInt32());
        Assert.DoesNotContain(items, item => item.GetProperty("userName").GetString() == "inactive");
        Assert.All(items, item =>
        {
            Assert.False(item.TryGetProperty("email", out _));
            Assert.False(item.TryGetProperty("passwordHash", out _));
            Assert.True(item.GetProperty("points").GetInt32() > 0);
        });
    }

    private static ApplicationUser User(string username) => new()
    {
        Id = username,
        UserName = username,
        Email = $"{username}@example.invalid",
        FullName = $"Public {username}",
        PasswordHash = "private-fixture-hash"
    };

    private sealed class TestApplicationDbContext(DbContextOptions<TestApplicationDbContext> options) : ApplicationDbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Recipe>().Ignore("SearchVector");
        }
    }
}
