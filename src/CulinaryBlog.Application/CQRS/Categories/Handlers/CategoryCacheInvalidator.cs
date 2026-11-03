using CulinaryBlog.Application.Interfaces;

namespace CulinaryBlog.Application.CQRS.Categories.Handlers;

internal static class CategoryCacheInvalidator
{
    public static async Task InvalidateAsync(ICacheService cache, Guid categoryId, CancellationToken cancellationToken)
    {
        await cache.RemoveAsync(CacheKeys.Categories, cancellationToken);
        await cache.RemoveAsync(CacheKeys.Category(categoryId), cancellationToken);
        await cache.RemoveAsync(CacheKeys.Recipes, cancellationToken);
    }
}
