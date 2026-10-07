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
        var folder = Path.Combine(_root, Path.GetFileName(Path.GetDirectoryName(fileName)) ?? "");
        Directory.CreateDirectory(folder);
        var path = Path.Combine(_root, fileName);
        await using var output = new FileStream(path, FileMode.CreateNew, FileAccess.Write, FileShare.None);
        await content.CopyToAsync(output, cancellationToken);
        return $"/uploads/{fileName.Replace('\\', '/') }";
    }

    public Task DeleteAsync(string objectKey, CancellationToken cancellationToken = default)
    {
        var path = Path.Combine(_root, objectKey.Replace('/', Path.DirectorySeparatorChar));
        if (File.Exists(path)) File.Delete(path);
        return Task.CompletedTask;
    }

    public string GetPublicUrl(string objectKey) => $"/uploads/{objectKey.Replace('\\', '/') }";
}
