using Microsoft.Extensions.Options;
using Minio;

namespace CulinaryBlog.Infrastructure.Services;

public static class MinioClientFactory
{
    public static IMinioClient Create(IOptions<MinioOptions> options)
    {
        var value = options.Value;
        var endpoint = Uri.TryCreate(value.Endpoint, UriKind.Absolute, out var configuredUri)
            ? configuredUri
            : new Uri($"http://{value.Endpoint}", UriKind.Absolute);

        return new MinioClient()
            .WithEndpoint(endpoint.Authority)
            .WithCredentials(value.AccessKey, value.SecretKey)
            .WithSSL(endpoint.Scheme == Uri.UriSchemeHttps)
            .Build();
    }
}
