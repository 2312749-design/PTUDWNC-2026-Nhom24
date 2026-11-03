using CulinaryBlog.Infrastructure.Services;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Options;
using Minio;
using Minio.DataModel.Args;

namespace CulinaryBlog.API.Health;

public sealed class MinioReadinessHealthCheck(
    IMinioClient client,
    IOptions<MinioOptions> options) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        var settings = options.Value;
        if (!settings.Enabled)
            return HealthCheckResult.Healthy("MinIO storage is disabled; local storage is active.");

        try
        {
            await client.BucketExistsAsync(new BucketExistsArgs().WithBucket(settings.Bucket), cancellationToken);
            return HealthCheckResult.Healthy("MinIO is reachable.");
        }
        catch (Exception exception)
        {
            return HealthCheckResult.Unhealthy("MinIO is unavailable.", exception);
        }
    }
}
