using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Jobs;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace CulinaryBlog.API.Tests;

public sealed class StorageMaintenanceJobTests : IAsyncLifetime
{
    private readonly SqliteConnection _connection = new("DataSource=:memory:");
    private StorageTestDbContext _context = null!;

    public async Task InitializeAsync()
    {
        await _connection.OpenAsync();
        _context = new StorageTestDbContext(new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseSqlite(_connection)
            .Options);
        await _context.Database.EnsureCreatedAsync();
    }

    public async Task DisposeAsync()
    {
        await _context.DisposeAsync();
        await _connection.DisposeAsync();
    }

    [Fact]
    public async Task InspectAsync_RemovesOrphansAcrossAllManagedStorageNamespaces()
    {
        var author = new ApplicationUser
        {
            Id = "storage-author",
            UserName = "storageauthor",
            NormalizedUserName = "STORAGEAUTHOR",
            Email = "storage@example.com",
            NormalizedEmail = "STORAGE@EXAMPLE.COM",
            FullName = "Storage Author",
            AvatarUrl = "/uploads/avatars/keep.jpg"
        };
        var category = Category.Create("Storage category", "Category image reference", "/uploads/categories/keep.png");
        var article = BlogArticle.Create("Storage article", "storage-article", "Summary", "Content", "/uploads/articles/keep.webp", author.Id);
        var post = new CommunityPost
        {
            AuthorId = author.Id,
            Content = "A post with an image",
            MediaUrl = "/uploads/community/keep.png",
            MediaType = "image"
        };
        _context.Users.Add(author);
        _context.Categories.Add(category);
        _context.BlogArticles.Add(article);
        _context.CommunityPosts.Add(post);
        await _context.SaveChangesAsync();

        var storage = new MemoryFileStorage(
        [
            "community/keep.png", "community/keep-thumb.webp", "community/keep-medium.webp", "community/orphan.png",
            "avatars/keep.jpg", "avatars/orphan.jpg",
            "categories/keep.png", "categories/orphan.png",
            "articles/keep.webp", "articles/orphan.webp",
            "recipes/orphan.webp"
        ]);
        var job = new StorageMaintenanceJob(_context, storage, NullLogger<StorageMaintenanceJob>.Instance);

        await job.InspectAsync();

        Assert.DoesNotContain("community/keep.png", storage.Deleted);
        Assert.DoesNotContain("community/keep-thumb.webp", storage.Deleted);
        Assert.DoesNotContain("community/keep-medium.webp", storage.Deleted);
        Assert.DoesNotContain("avatars/keep.jpg", storage.Deleted);
        Assert.DoesNotContain("categories/keep.png", storage.Deleted);
        Assert.DoesNotContain("articles/keep.webp", storage.Deleted);
        Assert.Equal(
            ["articles/orphan.webp", "avatars/orphan.jpg", "categories/orphan.png", "community/orphan.png", "recipes/orphan.webp"],
            storage.Deleted.OrderBy(key => key).ToArray());
    }

    private sealed class StorageTestDbContext(DbContextOptions<ApplicationDbContext> options) : ApplicationDbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Recipe>().Ignore("SearchVector");
        }
    }

    private sealed class MemoryFileStorage(IEnumerable<string> keys) : IFileStorageService
    {
        private readonly HashSet<string> _keys = new(keys, StringComparer.Ordinal);
        public List<string> Deleted { get; } = [];

        public Task<string> UploadAsync(Stream content, string fileName, string contentType, CancellationToken cancellationToken = default) =>
            throw new NotSupportedException();
        public Task<string> UploadThumbnailAsync(Stream content, string fileName, string contentType, CancellationToken cancellationToken = default) =>
            throw new NotSupportedException();
        public Task DeleteAsync(string objectKey, CancellationToken cancellationToken = default)
        {
            _keys.Remove(objectKey);
            Deleted.Add(objectKey);
            return Task.CompletedTask;
        }
        public Task<IReadOnlyList<string>> ListKeysAsync(string prefix, CancellationToken cancellationToken = default) =>
            Task.FromResult<IReadOnlyList<string>>(_keys.Where(key => key.StartsWith(prefix, StringComparison.Ordinal)).ToList());
        public string GetPublicUrl(string objectKey) => $"/uploads/{objectKey}";
    }
}
