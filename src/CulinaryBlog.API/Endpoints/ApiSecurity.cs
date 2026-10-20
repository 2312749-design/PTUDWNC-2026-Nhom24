using Microsoft.AspNetCore.Http;
using System.Threading.RateLimiting;

namespace CulinaryBlog.API.Endpoints;

public static class ApiSecurity
{
    public static IServiceCollection AddApiSecurity(this IServiceCollection services, IConfiguration configuration)
    {
        var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
            ?? ["http://localhost:3000", "http://127.0.0.1:3000"];
        allowedOrigins = allowedOrigins
            .Where(origin => Uri.TryCreate(origin, UriKind.Absolute, out var uri)
                && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();
        if (allowedOrigins.Length == 0)
            throw new InvalidOperationException("Cors:AllowedOrigins must contain at least one absolute HTTP(S) origin.");

        services.AddCors(options => options.AddPolicy("FrontendPolicy", policy => policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader().AllowAnyMethod()));
        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            options.OnRejected = async (context, cancellationToken) =>
            {
                var retryAfter = context.Lease.TryGetMetadata(MetadataName.RetryAfter, out TimeSpan retryAfterValue)
                    ? Math.Max(1, (int)Math.Ceiling(retryAfterValue.TotalSeconds))
                    : 60;
                context.HttpContext.Response.Headers["Retry-After"] = retryAfter.ToString(System.Globalization.CultureInfo.InvariantCulture);
                await Results.Problem(
                    statusCode: StatusCodes.Status429TooManyRequests,
                    title: "Too Many Requests",
                    detail: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.")
                    .ExecuteAsync(context.HttpContext);
            };
            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
                RateLimitPartition.GetFixedWindowLimiter(context.Connection.RemoteIpAddress?.ToString() ?? "unknown", _ => Window("Default", 200)));
            options.AddPolicy("auth", context => RateLimitPartition.GetFixedWindowLimiter(
                context.Connection.RemoteIpAddress?.ToString() ?? "unknown", _ => Window("Login", 5)));
            options.AddPolicy("registration", context => RateLimitPartition.GetFixedWindowLimiter(
                context.Connection.RemoteIpAddress?.ToString() ?? "unknown", _ => Window("Registration", 3)));
            options.AddPolicy("upload", context => RateLimitPartition.GetFixedWindowLimiter(
                context.User.Identity?.Name ?? context.Connection.RemoteIpAddress?.ToString() ?? "unknown", _ => Window("Upload", 10)));
        });
        return services;

        FixedWindowRateLimiterOptions Window(string name, int permits) => new()
        {
            PermitLimit = configuration.GetValue($"RateLimiting:{name}PermitLimit", permits),
            Window = TimeSpan.FromMinutes(configuration.GetValue($"RateLimiting:{name}WindowMinutes", 1)),
            QueueLimit = 0,
            AutoReplenishment = true
        };
    }
}
