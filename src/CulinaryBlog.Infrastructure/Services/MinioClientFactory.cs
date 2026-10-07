using Microsoft.Extensions.Options;
using Minio;

namespace CulinaryBlog.Infrastructure.Services;

public static class MinioClientFactory
{
    public static IMinioClient Create(IOptions<MinioOptions> options)
    {
        var value = options.Value;
        return new MinioClient()
            .WithEndpoint(value.Endpoint)
            .WithCredentials(value.AccessKey, value.SecretKey)
            .WithSSL(value.Endpoint.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
            .Build();
    }
}
