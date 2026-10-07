using CulinaryBlog.API.Controllers;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Xunit;

namespace CulinaryBlog.API.Tests;

public class RecipeCacheInvalidationTests : IAsyncLifetime
{
    private SqliteConnection _connection = null!;
    private ApplicationDbContext _context = null!;
    private InMemoryCacheService _cache = null!;
    private RecipesController _controller = null!;

    public async Task InitializeAsync()
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        await _connection.OpenAsync();
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseSqlite(_connection)
            .Options;
        _context = new TestApplicationDbContext(options);
        await _context.Database.EnsureCreatedAsync();
        _cache = new InMemoryCacheService();
        _controller = new RecipesController(
            new MockMediator(),
            _context,
            _cache)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(
                        [new Claim(ClaimTypes.NameIdentifier, "user-1")], "Test"))
                }
            }
        };
    }

    public async Task DisposeAsync()
    {
        await _context.DisposeAsync();
        await _connection.DisposeAsync();
    }

    [Fact]
    public async Task UpdateRecipe_RemovesCachedRecipe()
    {
        var recipe = CreateRecipe();
        _context.Recipes.Add(recipe);
        await _context.SaveChangesAsync();
        await _cache.SetAsync(CacheKeys.Recipe(recipe.Id), new RecipeDto { Id = recipe.Id }, TimeSpan.FromMinutes(10));

        var result = await _controller.UpdateRecipe(recipe.Id, new UpdateRecipeDto
        {
            Title = "Updated title",
            CategoryId = recipe.CategoryId
        });

        Assert.IsType<OkObjectResult>(result);
        Assert.Null(await _cache.GetAsync<RecipeDto>(CacheKeys.Recipe(recipe.Id)));
        Assert.Null(await _cache.GetAsync<IEnumerable<RecipeDto>>(CacheKeys.Recipes));
    }

    [Fact]
    public async Task DeleteRecipe_RemovesCachedRecipe()
    {
        var recipe = CreateRecipe();
        _context.Recipes.Add(recipe);
        await _context.SaveChangesAsync();
        await _cache.SetAsync(CacheKeys.Recipe(recipe.Id), new RecipeDto { Id = recipe.Id }, TimeSpan.FromMinutes(10));

        var result = await _controller.DeleteRecipe(recipe.Id);

        Assert.IsType<OkObjectResult>(result);
        Assert.Null(await _cache.GetAsync<RecipeDto>(CacheKeys.Recipe(recipe.Id)));
        Assert.Null(await _cache.GetAsync<IEnumerable<RecipeDto>>(CacheKeys.Recipes));
    }

    private Recipe CreateRecipe()
    {
        var category = new Category { Name = "Dessert", Description = "Desserts" };
        var user = new ApplicationUser
        {
            Id = "user-1",
            UserName = "user@example.com",
            Email = "user@example.com"
        };
        _context.Categories.Add(category);
        _context.Users.Add(user);
        var recipe = Recipe.Create(
            "Cake",
            "Cake description",
            ["Flour"],
            ["Mix"],
            category.Id,
            user.Id);
        return recipe;
    }

    private sealed class MockMediator : MediatR.IMediator
    {
        public Task<TResponse> Send<TResponse>(MediatR.IRequest<TResponse> request, CancellationToken cancellationToken = default) =>
            throw new NotSupportedException();

        public Task Send<TRequest>(TRequest request, CancellationToken cancellationToken = default)
            where TRequest : MediatR.IRequest =>
            throw new NotSupportedException();

        public Task<object?> Send(object request, CancellationToken cancellationToken = default) =>
            throw new NotSupportedException();

        public IAsyncEnumerable<TResponse> CreateStream<TResponse>(
            MediatR.IStreamRequest<TResponse> request,
            CancellationToken cancellationToken = default) =>
            throw new NotSupportedException();

        public IAsyncEnumerable<object?> CreateStream(
            object request,
            CancellationToken cancellationToken = default) =>
            throw new NotSupportedException();

        public Task Publish<TNotification>(TNotification notification, CancellationToken cancellationToken = default)
            where TNotification : MediatR.INotification =>
            throw new NotSupportedException();

        public Task Publish(object notification, CancellationToken cancellationToken = default) =>
            throw new NotSupportedException();
    }

    private sealed class InMemoryCacheService : ICacheService
    {
        private readonly Dictionary<string, object> _values = new();

        public Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default) =>
            Task.FromResult(_values.TryGetValue(key, out var value) ? (T)value : default);

        public Task SetAsync<T>(string key, T value, TimeSpan? expiry = null, CancellationToken cancellationToken = default)
        {
            _values[key] = value!;
            return Task.CompletedTask;
        }

        public Task RemoveAsync(string key, CancellationToken cancellationToken = default)
        {
            _values.Remove(key);
            return Task.CompletedTask;
        }
    }

    private sealed class TestApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : ApplicationDbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Recipe>().Ignore(recipe => recipe.SearchVector);
        }
    }
}
