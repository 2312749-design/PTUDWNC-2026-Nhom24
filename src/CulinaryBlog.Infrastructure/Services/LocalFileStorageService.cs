using CulinaryBlog.Application.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace CulinaryBlog.Infrastructure.Services;

public sealed class LocalFileStorageService : IFileStorageService
{
    private readonly string _root;

    public LocalFileStorageService(IWebHostEnvironment environment, IConfiguration configuration)
    {
        _root = Path.Combine(environment.WebRootPath ?? Path.Combine(environment.ContentRootPath, "wwwroot"), "uploads");
    }

    public async Task<string> UploadAsync(Stream content, string fileName, string contentType, CancellationToken cancellationToken = default)
    {
        return await UploadFileAsync(content, fileName, cancellationToken);
    }

    public async Task<string> UploadThumbnailAsync(Stream content, string fileName, string contentType, CancellationToken cancellationToken = default)
    {
        return await UploadFileAsync(content, fileName, cancellationToken);
    }

    private async Task<string> UploadFileAsync(Stream content, string fileName, CancellationToken cancellationToken)
    {
        var relativePath = fileName.Replace('\\', '/').TrimStart('/');
        var path = Path.GetFullPath(Path.Combine(_root, relativePath.Replace('/', Path.DirectorySeparatorChar)));
        var root = Path.GetFullPath(_root) + Path.DirectorySeparatorChar;
        if (!path.StartsWith(root, StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException("Đường dẫn tệp không hợp lệ.");
        Directory.CreateDirectory(Path.GetDirectoryName(path)!);
        await using var output = new FileStream(path, FileMode.CreateNew, FileAccess.Write, FileShare.None);
        await content.CopyToAsync(output, cancellationToken);
        return $"/uploads/{relativePath}";
    }

    public Task DeleteAsync(string objectKey, CancellationToken cancellationToken = default)
    {
        var path = Path.GetFullPath(Path.Combine(_root, objectKey.TrimStart('/', '\\').Replace('/', Path.DirectorySeparatorChar)));
        var root = Path.GetFullPath(_root) + Path.DirectorySeparatorChar;
        if (!path.StartsWith(root, StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException("Đường dẫn tệp không hợp lệ.");
        if (File.Exists(path)) File.Delete(path);
        return Task.CompletedTask;
    }

    public Task<IReadOnlyList<string>> ListKeysAsync(string prefix, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        var normalizedPrefix = prefix.Trim('/', '\\').Replace('\\', '/');
        var directory = Path.Combine(_root, normalizedPrefix.Replace('/', Path.DirectorySeparatorChar));
        if (!Directory.Exists(directory)) return Task.FromResult<IReadOnlyList<string>>([]);

        IReadOnlyList<string> keys = Directory.EnumerateFiles(directory, "*", SearchOption.AllDirectories)
            .Select(path => Path.GetRelativePath(_root, path).Replace('\\', '/'))
            .ToList();
        return Task.FromResult(keys);
    }

    public Task<IReadOnlyList<StorageObjectInfo>> ListObjectsAsync(string prefix, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        var normalizedPrefix = prefix.Trim('/', '\\').Replace('\\', '/');
        var directory = Path.Combine(_root, normalizedPrefix.Replace('/', Path.DirectorySeparatorChar));
        if (!Directory.Exists(directory)) return Task.FromResult<IReadOnlyList<StorageObjectInfo>>([]);
        IReadOnlyList<StorageObjectInfo> files = Directory.EnumerateFiles(directory, "*", SearchOption.AllDirectories)
            .Select(path => new StorageObjectInfo(Path.GetRelativePath(_root, path).Replace('\\', '/'), new FileInfo(path).Length))
            .ToList();
        return Task.FromResult(files);
    }

    public string GetPublicUrl(string objectKey) => $"/uploads/{objectKey.Replace('\\', '/') }";
}
