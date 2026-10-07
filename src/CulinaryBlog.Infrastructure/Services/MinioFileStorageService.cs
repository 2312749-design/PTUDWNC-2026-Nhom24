using CulinaryBlog.Application.Interfaces;
using Microsoft.Extensions.Options;
using Minio;
using Minio.DataModel.Args;

namespace CulinaryBlog.Infrastructure.Services;

public sealed class MinioFileStorageService : IFileStorageService
{
    private readonly IMinioClient _client;
    private readonly string _bucket;
    private readonly string _publicBaseUrl;

    public MinioFileStorageService(IMinioClient client, IOptions<MinioOptions> options)
    {
        _client = client;
        var value = options.Value;
        _bucket = value.Bucket;
        _publicBaseUrl = value.PublicBaseUrl;
    }

    public async Task<string> UploadAsync(Stream content, string fileName, string contentType, CancellationToken cancellationToken = default)
    {
        return await UploadObjectAsync(content, fileName, contentType, cancellationToken);
    }

    public async Task<string> UploadThumbnailAsync(Stream content, string fileName, string contentType, CancellationToken cancellationToken = default)
    {
        return await UploadObjectAsync(content, fileName, contentType, cancellationToken);
    }

    private async Task<string> UploadObjectAsync(Stream content, string fileName, string contentType, CancellationToken cancellationToken)
    {
        var key = fileName.Replace('\\', '/');
        var request = new PutObjectArgs()
            .WithBucket(_bucket)
            .WithObject(key)
            .WithStreamData(content)
            .WithObjectSize(content.Length)
            .WithContentType(contentType);
        await _client.PutObjectAsync(request, cancellationToken);
        return GetPublicUrl(key);
    }

    public async Task DeleteAsync(string objectKey, CancellationToken cancellationToken = default)
    {
        await _client.RemoveObjectAsync(new RemoveObjectArgs()
            .WithBucket(_bucket)
            .WithObject(objectKey), cancellationToken);
    }

    public string GetPublicUrl(string objectKey) => $"{_publicBaseUrl.TrimEnd('/')}/{_bucket}/{objectKey.TrimStart('/')}";
}

public sealed class MinioOptions
{
    public string Endpoint { get; set; } = string.Empty;
    public string AccessKey { get; set; } = string.Empty;
    public string SecretKey { get; set; } = string.Empty;
    public string Bucket { get; set; } = "culinary-blog";
    public string Region { get; set; } = "us-east-1";
    public string PublicBaseUrl { get; set; } = string.Empty;
    public bool Enabled { get; set; }
}
