using System.Text.Json;
using CulinaryBlog.Application.Interfaces;
using StackExchange.Redis;

namespace CulinaryBlog.Infrastructure.Services;

public sealed class RedisCacheService : ICacheService
{
    private readonly IConnectionMultiplexer _connection;
    private readonly JsonSerializerOptions _jsonOptions = new(JsonSerializerDefaults.Web);

    public RedisCacheService(IConnectionMultiplexer connection) => _connection = connection;

    public async Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default)
    {
        var value = await _connection.GetDatabase().StringGetAsync(key);
        return value.HasValue ? JsonSerializer.Deserialize<T>(value!.ToString(), _jsonOptions) : default;
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiry = null, CancellationToken cancellationToken = default)
    {
        var serialized = JsonSerializer.Serialize(value, _jsonOptions);
        await _connection.GetDatabase().StringSetAsync(key, serialized, expiry);
    }

    public async Task RemoveAsync(string key, CancellationToken cancellationToken = default)
    {
        await _connection.GetDatabase().KeyDeleteAsync(key);
    }
}

public sealed class NoOpCacheService : ICacheService
{
    public Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default) => Task.FromResult<T?>(default);
    public Task SetAsync<T>(string key, T value, TimeSpan? expiry = null, CancellationToken cancellationToken = default) => Task.CompletedTask;
    public Task RemoveAsync(string key, CancellationToken cancellationToken = default) => Task.CompletedTask;
}
