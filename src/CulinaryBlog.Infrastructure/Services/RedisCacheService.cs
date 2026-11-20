using System.Text.Json;
using CulinaryBlog.Application.Interfaces;
using StackExchange.Redis;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;

namespace CulinaryBlog.Infrastructure.Services;

public sealed class RedisCacheService : ICacheService
{
    private readonly IConnectionMultiplexer _connection;
    private readonly JsonSerializerOptions _jsonOptions = new(JsonSerializerDefaults.Web);

    private readonly ILogger<RedisCacheService> _logger;
    public RedisCacheService(IConnectionMultiplexer connection, ILogger<RedisCacheService>? logger = null)
    { _connection = connection; _logger = logger ?? NullLogger<RedisCacheService>.Instance; }

    public async Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default)
    {
        try
        {
            var value = await _connection.GetDatabase().StringGetAsync(key);
            if (!value.HasValue && key == CulinaryBlog.Application.Interfaces.CacheKeys.SearchVersion)
            {
                // Initialize atomically; never overwrite a generation rotated
                // by a concurrent content update.
                await _connection.GetDatabase().StringSetAsync(key,
                    JsonSerializer.Serialize(Guid.NewGuid().ToString("N")), when: When.NotExists);
                value = await _connection.GetDatabase().StringGetAsync(key);
            }
            return value.HasValue ? JsonSerializer.Deserialize<T>(value!.ToString(), _jsonOptions) : default;
        }
        catch (RedisException) { _logger.LogWarning("Redis unavailable; reading from the primary data source."); return default; }
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiry = null, CancellationToken cancellationToken = default)
    {
        var serialized = JsonSerializer.Serialize(value, _jsonOptions);
        try { await _connection.GetDatabase().StringSetAsync(key, serialized, expiry); }
        catch (RedisException) { _logger.LogWarning("Redis unavailable; cache write skipped."); }
    }

    public async Task RemoveAsync(string key, CancellationToken cancellationToken = default)
    {
        try {
        await _connection.GetDatabase().KeyDeleteAsync(key);
        if (key == CacheKeys.Recipes)
        {
            // Rotate a shared generation: in-flight reads may write the old
            // generation, but later readers will never retrieve those results.
            await SetAsync(CulinaryBlog.Application.Interfaces.CacheKeys.SearchVersion, Guid.NewGuid().ToString("N"), null, cancellationToken);
            await _connection.GetDatabase().KeyDeleteAsync(CacheKeys.Categories);
        }
        } catch (RedisException) { _logger.LogWarning("Redis unavailable; cache invalidation deferred to TTL."); }
    }
}

public sealed class NoOpCacheService : ICacheService
{
    public Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default) => Task.FromResult<T?>(default);
    public Task SetAsync<T>(string key, T value, TimeSpan? expiry = null, CancellationToken cancellationToken = default) => Task.CompletedTask;
    public Task RemoveAsync(string key, CancellationToken cancellationToken = default) => Task.CompletedTask;
}
