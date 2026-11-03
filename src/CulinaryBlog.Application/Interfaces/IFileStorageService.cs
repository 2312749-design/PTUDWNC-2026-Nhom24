namespace CulinaryBlog.Application.Interfaces;

public interface IFileStorageService
{
    Task<string> UploadAsync(Stream content, string fileName, string contentType, CancellationToken cancellationToken = default);
    Task<string> UploadThumbnailAsync(Stream content, string fileName, string contentType, CancellationToken cancellationToken = default);
    Task DeleteAsync(string objectKey, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<string>> ListKeysAsync(string prefix, CancellationToken cancellationToken = default);
    async Task<IReadOnlyList<StorageObjectInfo>> ListObjectsAsync(string prefix, CancellationToken cancellationToken = default)
    {
        var keys = await ListKeysAsync(prefix, cancellationToken);
        return keys.Select(key => new StorageObjectInfo(key, 0)).ToList();
    }
    string GetPublicUrl(string objectKey);
}

public sealed record StorageObjectInfo(string Key, long SizeBytes);
