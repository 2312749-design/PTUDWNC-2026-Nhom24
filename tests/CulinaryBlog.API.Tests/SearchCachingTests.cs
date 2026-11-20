using CulinaryBlog.Application.CQRS.Recipes.Handlers;
using CulinaryBlog.Application.CQRS.Recipes.Queries;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Application.Models;
using Moq;
using Xunit;

namespace CulinaryBlog.API.Tests;

public sealed class SearchCachingTests
{
    [Fact]
    public async Task SearchUsesCachedResultsButNewGenerationAndFiltersMissCache()
    {
        var service = new Mock<IRecipeSearchService>();
        service.Setup(x => x.SearchAsync(It.IsAny<RecipeSearchCriteria>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new RecipeSearchResult(0, 1, 12, []));
        var cache = new MemoryCache();
        var handler = new SearchRecipesQueryHandler(service.Object, cache);
        var query = new SearchRecipesQuery(null, null, null, null, null, null, null, "title", "asc");
        await handler.Handle(query, default);
        await handler.Handle(query, default);
        service.Verify(x => x.SearchAsync(It.IsAny<RecipeSearchCriteria>(), It.IsAny<CancellationToken>()), Times.Once);
        await cache.SetAsync(CacheKeys.SearchVersion, "next");
        await handler.Handle(query, default);
        service.Verify(x => x.SearchAsync(It.IsAny<RecipeSearchCriteria>(), It.IsAny<CancellationToken>()), Times.Exactly(2));
        await handler.Handle(query with { Vegetarian = true }, default);
        service.Verify(x => x.SearchAsync(It.IsAny<RecipeSearchCriteria>(), It.IsAny<CancellationToken>()), Times.Exactly(3));
        Assert.Equal(TimeSpan.FromMinutes(1), cache.LastSearchExpiry);
    }

    private sealed class MemoryCache : ICacheService
    {
        private readonly Dictionary<string, object> values = [];
        public TimeSpan? LastSearchExpiry { get; private set; }
        public Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default) => Task.FromResult(values.TryGetValue(key, out var value) ? (T?)value : default);
        public Task SetAsync<T>(string key, T value, TimeSpan? expiry = null, CancellationToken cancellationToken = default)
        {
            values[key] = value!;
            if (key.StartsWith("recipes:search:")) LastSearchExpiry = expiry;
            return Task.CompletedTask;
        }
        public Task RemoveAsync(string key, CancellationToken cancellationToken = default) { values.Remove(key); return Task.CompletedTask; }
    }
}
