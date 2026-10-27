using System.Security.Claims;
using CulinaryBlog.API.Endpoints;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace CulinaryBlog.API.Tests;

public sealed class RecipeImageHandlersTests : IAsyncLifetime
{
    private SqliteConnection _connection = null!;
    private TestApplicationDbContext _context = null!;
    private Recipe _recipe = null!;
    private RecipeImage _primary = null!;
    private RecipeImage _secondary = null!;

    public async Task InitializeAsync()
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        await _connection.OpenAsync();
        _context = new TestApplicationDbContext(new DbContextOptionsBuilder<ApplicationDbContext>().UseSqlite(_connection).Options);
        await _context.Database.EnsureCreatedAsync();
        var user = ApplicationUser.Create("Image owner", "images@example.com", "images");
        user.Id = "image-owner";
        var category = Category.Create("Images", "Image recipes", null);
        _recipe = Recipe.Create("Image recipe", "Recipe with images", ["tomato"], ["Cook it"], category.Id, user.Id,
            prepTimeMinutes: 5, cookTimeMinutes: 10, servings: 2, difficulty: "Easy");
        _recipe.Publish(true, true);
        _primary = new RecipeImage
        {
            RecipeId = _recipe.Id,
            Url = "/uploads/recipes/one.jpg",
            ThumbnailUrl = "/uploads/recipes/one-thumb.webp",
            MediumUrl = "/uploads/recipes/one-medium.webp",
            IsPrimary = true,
            CreatedAt = DateTime.UtcNow.AddMinutes(-1)
        };
        _secondary = new RecipeImage
        {
            RecipeId = _recipe.Id,
            Url = "/uploads/recipes/two.jpg",
            ThumbnailUrl = "/uploads/recipes/two-thumb.webp",
            MediumUrl = "/uploads/recipes/two-medium.webp",
            IsPrimary = false
        };
        _recipe.SetImageUrl(_primary.Url);
        _context.AddRange(user, category, _recipe, _primary, _secondary);
        await _context.SaveChangesAsync();
    }

    public async Task DisposeAsync()
    {
        await _context.DisposeAsync();
        await _connection.DisposeAsync();
    }

    [Fact]
    public async Task DeletePrimaryImage_SelectsTheOldestRemainingImageWithoutDeletingRecipe()
    {
        var storage = new RecordingStorage();
        var handler = new RecipesHandlers(new Mock<IMediator>().Object, _context, new NoOpCache(), storage)
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, "image-owner")], "Test"))
            }
        };

        ResponseAssert.Status(204, await handler.DeleteRecipeImage(_recipe.Id, _primary.Id));

        Assert.False(_recipe.IsDeleted);
        Assert.Equal(_secondary.Url, _recipe.ImageUrl);
        Assert.True(_secondary.IsPrimary);
        Assert.Empty(await _context.RecipeImages.Where(image => image.Id == _primary.Id).ToListAsync());
        Assert.Equal(3, storage.DeletedKeys.Count);
    }

    private sealed class TestApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : ApplicationDbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Recipe>().Ignore("SearchVector");
        }
    }

    private sealed class RecordingStorage : IFileStorageService
    {
        public List<string> DeletedKeys { get; } = [];
        public Task<string> UploadAsync(Stream content, string fileName, string contentType, CancellationToken cancellationToken = default) => Task.FromResult($"/uploads/{fileName}");
        public Task<string> UploadThumbnailAsync(Stream content, string fileName, string contentType, CancellationToken cancellationToken = default) => Task.FromResult($"/uploads/{fileName}");
        public Task DeleteAsync(string objectKey, CancellationToken cancellationToken = default) { DeletedKeys.Add(objectKey); return Task.CompletedTask; }
        public Task<IReadOnlyList<string>> ListKeysAsync(string prefix, CancellationToken cancellationToken = default) => Task.FromResult<IReadOnlyList<string>>([]);
        public string GetPublicUrl(string objectKey) => $"/uploads/{objectKey}";
    }

    private sealed class NoOpCache : ICacheService
    {
        public Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default) => Task.FromResult(default(T));
        public Task SetAsync<T>(string key, T value, TimeSpan? expiry = null, CancellationToken cancellationToken = default) => Task.CompletedTask;
        public Task RemoveAsync(string key, CancellationToken cancellationToken = default) => Task.CompletedTask;
    }
}
