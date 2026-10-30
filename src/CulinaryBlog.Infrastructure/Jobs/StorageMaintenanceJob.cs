using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CulinaryBlog.Infrastructure.Jobs;

/// <summary>
/// Removes files no longer referenced by application data. Soft-deleted
/// recipes deliberately retain their image records so they can be restored.
/// </summary>
public sealed class StorageMaintenanceJob(
    ApplicationDbContext context,
    IFileStorageService fileStorage,
    ILogger<StorageMaintenanceJob> logger)
{
    private static readonly string[] ManagedPrefixes = ["recipes/", "community/", "avatars/", "categories/", "articles/"];

    public async Task InspectAsync()
    {
        await InspectAndReportAsync(removeOrphans: true);
    }

    public async Task<StorageMaintenanceSummary> InspectAndReportAsync(bool removeOrphans)
    {
        var retainedImages = await context.RecipeImages.CountAsync(image => image.Recipe.IsDeleted);
        var recipesWithoutPrimary = await context.RecipeImages
            .GroupBy(image => image.RecipeId)
            .CountAsync(group => !group.Any(image => image.IsPrimary));

        var referencedKeys = await GetReferencedKeysAsync();
        var orphanKeys = new List<string>();
        foreach (var prefix in ManagedPrefixes)
        {
            var storedKeys = await fileStorage.ListKeysAsync(prefix);
            orphanKeys.AddRange(storedKeys.Where(key => !referencedKeys.Contains(key)));
        }

        var distinctOrphans = orphanKeys.Distinct(StringComparer.Ordinal).ToList();
        if (removeOrphans) foreach (var key in distinctOrphans)
        {
            await fileStorage.DeleteAsync(key);
        }

        logger.LogInformation(
            "Storage maintenance completed. {RetainedImages} images retained for soft-deleted recipes; {RecipesWithoutPrimary} recipes need a primary-image review; {OrphanCount} orphan files removed across recipe, community, avatar, category and article storage.",
            retainedImages,
            recipesWithoutPrimary,
            distinctOrphans.Count);
        return new StorageMaintenanceSummary(retainedImages, recipesWithoutPrimary, distinctOrphans.Count, removeOrphans);
    }

    private async Task<HashSet<string>> GetReferencedKeysAsync()
    {
        var urls = new List<string?>();
        var recipeImages = await context.RecipeImages.AsNoTracking()
            .Select(image => new[] { image.Url, image.ThumbnailUrl, image.MediumUrl })
            .ToListAsync();
        urls.AddRange(recipeImages.SelectMany(value => value));

        urls.AddRange(await context.Recipes.AsNoTracking().Select(recipe => recipe.ImageUrl).ToListAsync());
        urls.AddRange(await context.RecipeSteps.AsNoTracking().Select(step => step.ImageUrl).ToListAsync());
        urls.AddRange(await context.CommunityPosts.AsNoTracking().Select(post => post.MediaUrl).ToListAsync());
        urls.AddRange(await context.Users.AsNoTracking().Select(user => user.AvatarUrl).ToListAsync());
        urls.AddRange(await context.Categories.AsNoTracking().Select(category => category.ImageUrl).ToListAsync());
        urls.AddRange(await context.BlogArticles.AsNoTracking().Select(article => article.CoverImageUrl).ToListAsync());

        var keys = urls
            .Select(ToStorageKey)
            .Where(key => key is not null)
            .Select(key => key!)
            .ToHashSet(StringComparer.Ordinal);

        // Community thumbnails are created asynchronously. Their names are
        // deterministic for new uploads although a post stores only the
        // original media URL.
        foreach (var key in keys.Where(key => key.StartsWith("community/", StringComparison.Ordinal)).ToArray())
        {
            var extension = Path.GetExtension(key);
            if (string.IsNullOrEmpty(extension)) continue;
            var stem = key[..^extension.Length];
            keys.Add($"{stem}-thumb.webp");
            keys.Add($"{stem}-medium.webp");
        }

        return keys;
    }

    private static string? ToStorageKey(string? url)
    {
        if (string.IsNullOrWhiteSpace(url)) return null;
        var path = Uri.TryCreate(url, UriKind.Absolute, out var uri) ? uri.AbsolutePath : url;
        var segments = path.Trim('/', '\\').Split('/', StringSplitOptions.RemoveEmptyEntries);
        var index = Array.FindIndex(segments, segment => ManagedPrefixes.Any(prefix =>
            segment.Equals(prefix.TrimEnd('/'), StringComparison.OrdinalIgnoreCase)));
        return index < 0 ? null : string.Join('/', segments[index..]);
    }
}

public sealed record StorageMaintenanceSummary(int RetainedImages, int RecipesWithoutPrimary, int OrphanCount, bool OrphansRemoved);
