using CulinaryBlog.API.Endpoints;
using CulinaryBlog.Application.CQRS.Categories.Commands;
using CulinaryBlog.Application.CQRS.Categories.Handlers;
using CulinaryBlog.Application.CQRS.Categories.Queries;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Exceptions;
using CulinaryBlog.Infrastructure.Persistence;
using MediatR;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace CulinaryBlog.API.Tests;

public sealed class CategoryLifecycleTests : IAsyncLifetime
{
    private SqliteConnection _connection = null!;
    private TestApplicationDbContext _context = null!;
    private TestCacheService _cache = null!;

    public async Task InitializeAsync()
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        await _connection.OpenAsync();
        var options = new DbContextOptionsBuilder<ApplicationDbContext>().UseSqlite(_connection).Options;
        _context = new TestApplicationDbContext(options);
        await _context.Database.EnsureCreatedAsync();
        _cache = new TestCacheService();
    }

    public async Task DisposeAsync()
    {
        await _context.DisposeAsync();
        await _connection.DisposeAsync();
    }

    [Fact]
    public async Task CreateCategory_AssignsSlugAndRejectsDuplicateName()
    {
        var handler = new CreateCategoryCommandHandler(_context, _cache);
        var created = await handler.Handle(new CreateCategoryCommand
        {
            Name = "Món Việt", Description = "Món ăn Việt Nam"
        }, CancellationToken.None);

        Assert.Equal("mon-viet", created.Slug);
        await Assert.ThrowsAsync<ConflictException>(() => handler.Handle(new CreateCategoryCommand
        {
            Name = "MÓN VIỆT", Description = "Bản trùng"
        }, CancellationToken.None));
    }

    [Fact]
    public async Task DeleteCategory_RejectsWhenAnActiveRecipeStillUsesIt()
    {
        var category = Category.Create("Món chính", "", null);
        var user = ApplicationUser.Create("Chef", "chef@example.com", "chef");
        var recipe = Recipe.Create("Món chính ngon", "Mô tả hợp lệ", [], [], category.Id, user.Id);
        _context.AddRange(category, user, recipe);
        await _context.SaveChangesAsync();

        var handler = CreateHandler();
        ResponseAssert.Status(409, await handler.DeleteCategory(category.Id));
        Assert.False(category.IsDeleted);
        Assert.False(recipe.IsDeleted);
    }

    [Fact]
    public async Task DeleteCategory_SoftDeletesOnlyWhenNoActiveRecipeRemains()
    {
        var category = Category.Create("Món chay", "", null);
        var user = ApplicationUser.Create("Chef", "chef@example.com", "chef");
        var deletedRecipe = Recipe.Create("Đậu hũ kho", "Mô tả hợp lệ", [], [], category.Id, user.Id);
        deletedRecipe.SoftDelete();
        _context.AddRange(category, user, deletedRecipe);
        await _context.SaveChangesAsync();

        ResponseAssert.Status(200, await CreateHandler().DeleteCategory(category.Id));
        Assert.True(category.IsDeleted);
        Assert.True(deletedRecipe.IsDeleted);

        var visible = await new GetCategoriesQueryHandler(_context, _cache)
            .Handle(new GetCategoriesQuery(), CancellationToken.None);
        Assert.DoesNotContain(visible, item => item.Id == category.Id);
    }

    [Fact]
    public async Task UpdateCategory_RejectsDeletedCategory()
    {
        var category = Category.Create("Món hấp", "", null);
        category.SoftDelete();
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        ResponseAssert.Status(404, await CreateHandler().UpdateCategory(category.Id, new CreateCategoryDto
        {
            Name = "Món hấp mới", Description = ""
        }));
    }

    private CategoriesHandlers CreateHandler() => new(Mock.Of<IMediator>(), _context, _cache);

    private sealed class TestApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : ApplicationDbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Recipe>().Ignore(recipe => recipe.SearchVector);
        }
    }

    private sealed class TestCacheService : ICacheService
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
}
