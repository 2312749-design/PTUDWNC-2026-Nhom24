using CulinaryBlog.Application.Interfaces;
using Microsoft.Extensions.Options;
using Minio;
using Minio.DataModel.Args;
using System.Collections.Concurrent;
using System.Text.Json;

namespace CulinaryBlog.Infrastructure.Services;

public sealed class MinioFileStorageService : IFileStorageService
{
    private static readonly SemaphoreSlim BucketInitializationLock = new(1, 1);
    private static readonly ConcurrentDictionary<string, byte> InitializedBuckets = new(StringComparer.Ordinal);
    private readonly IMinioClient _client;
    private readonly string _bucket;
    private readonly string _bucketKey;
    private readonly string _publicBaseUrl;

    public MinioFileStorageService(IMinioClient client, IOptions<MinioOptions> options)
    {
        _client = client;
        var value = options.Value;
        _bucket = value.Bucket;
        _bucketKey = $"{value.Endpoint.TrimEnd('/')}/{_bucket}";
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
        await EnsureBucketAsync(cancellationToken);
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

    private async Task EnsureBucketAsync(CancellationToken cancellationToken)
    {
        if (InitializedBuckets.ContainsKey(_bucketKey)) return;

        await BucketInitializationLock.WaitAsync(cancellationToken);
        try
        {
            if (InitializedBuckets.ContainsKey(_bucketKey)) return;

            var exists = await _client.BucketExistsAsync(
                new BucketExistsArgs().WithBucket(_bucket), cancellationToken);
            if (!exists)
            {
                await _client.MakeBucketAsync(
                    new MakeBucketArgs().WithBucket(_bucket), cancellationToken);
            }

            var policy = JsonSerializer.Serialize(new
            {
                Version = "2012-10-17",
                Statement = new[]
                {
                    new
                    {
                        Effect = "Allow",
                        Principal = new { AWS = new[] { "*" } },
                        Action = new[] { "s3:GetObject" },
                        Resource = new[] { $"arn:aws:s3:::{_bucket}/*" }
                    }
                }
            });
            await _client.SetPolicyAsync(
                new SetPolicyArgs().WithBucket(_bucket).WithPolicy(policy), cancellationToken);

            InitializedBuckets.TryAdd(_bucketKey, 0);
        }
        finally
        {
            BucketInitializationLock.Release();
        }
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
