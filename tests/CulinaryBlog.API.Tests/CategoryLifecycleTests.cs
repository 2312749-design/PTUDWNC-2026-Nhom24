using CulinaryBlog.Application.CQRS.Categories.Commands;
using CulinaryBlog.Application.CQRS.Categories.Handlers;
using CulinaryBlog.Application.CQRS.Categories.Queries;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Exceptions;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
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
        var handler = new CreateCategoryCommandHandler(CreateUnitOfWork(), _cache);
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

        var handler = new DeleteCategoryCommandHandler(CreateUnitOfWork(), _cache);
        await Assert.ThrowsAsync<ConflictException>(() => handler.Handle(new DeleteCategoryCommand { Id = category.Id }, CancellationToken.None));
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

        await new DeleteCategoryCommandHandler(CreateUnitOfWork(), _cache)
            .Handle(new DeleteCategoryCommand { Id = category.Id }, CancellationToken.None);
        Assert.True(category.IsDeleted);
        Assert.True(deletedRecipe.IsDeleted);

        var visible = await new GetCategoriesQueryHandler(CreateUnitOfWork(), _cache)
            .Handle(new GetCategoriesQuery(), CancellationToken.None);
        Assert.DoesNotContain(visible, item => item.Id == category.Id);
    }

    [Fact]
    public async Task UpdateCategory_UpdatesThroughUnitOfWorkAndInvalidatesCatalogCaches()
    {
        var category = Category.Create("Món hấp", "", null);
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        await _cache.SetAsync(CacheKeys.Categories, new object());
        await _cache.SetAsync(CacheKeys.Category(category.Id), new object());
        await _cache.SetAsync(CacheKeys.Recipes, new object());

        var updated = await new UpdateCategoryCommandHandler(CreateUnitOfWork(), _cache)
            .Handle(new UpdateCategoryCommand
            {
                Id = category.Id,
                Name = "Món hấp mới",
                Description = "Đã đổi tên"
            }, CancellationToken.None);

        Assert.Equal("mon-hap-moi", updated.Slug);
        Assert.Equal("Món hấp mới", category.Name);
        Assert.DoesNotContain(CacheKeys.Categories, _cache.Keys);
        Assert.DoesNotContain(CacheKeys.Category(category.Id), _cache.Keys);
        Assert.DoesNotContain(CacheKeys.Recipes, _cache.Keys);
    }

    [Fact]
    public async Task UpdateCategory_RejectsDeletedCategory()
    {
        var category = Category.Create("Món hấp", "", null);
        category.SoftDelete();
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        await Assert.ThrowsAsync<NotFoundException>(() => new UpdateCategoryCommandHandler(CreateUnitOfWork(), _cache)
            .Handle(new UpdateCategoryCommand { Id = category.Id, Name = "Món hấp mới" }, CancellationToken.None));
    }

    private UnitOfWork CreateUnitOfWork() => new(_context);

    private sealed class TestApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : ApplicationDbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Recipe>().Ignore("SearchVector");
        }
    }

    private sealed class TestCacheService : ICacheService
    {
        private readonly Dictionary<string, object> _values = new();
        public IEnumerable<string> Keys => _values.Keys;
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
