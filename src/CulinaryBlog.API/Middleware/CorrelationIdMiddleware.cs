using System.Diagnostics;
using Serilog.Context;

namespace CulinaryBlog.API.Middleware;

/// <summary>
/// Propagates a safe correlation identifier through the request, response, logs,
/// and the current activity so a single browser action can be followed across
/// API logs and telemetry.
/// </summary>
public sealed class CorrelationIdMiddleware
{
    public const string HeaderName = "X-Correlation-ID";
    public const string LegacyRequestIdHeaderName = "X-Request-ID";
    public const string HttpContextItemKey = "CorrelationId";

    private const int MaximumLength = 128;
    private readonly RequestDelegate _next;

    public CorrelationIdMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        var correlationId = GetCorrelationId(context.Request);

        // TraceIdentifier is what ASP.NET Core's request logging and many
        // framework diagnostics use. Keeping it aligned avoids two unrelated
        // identifiers for the same request.
        context.TraceIdentifier = correlationId;
        context.Items[HttpContextItemKey] = correlationId;
        context.Response.Headers[HeaderName] = correlationId;
        // Keep the response contract that existed before correlation support.
        context.Response.Headers[LegacyRequestIdHeaderName] = correlationId;

        Activity.Current?.SetTag("correlation.id", correlationId);
        using (LogContext.PushProperty("CorrelationId", correlationId))
        {
            await _next(context);
        }
    }

    private static string GetCorrelationId(HttpRequest request)
    {
        var suppliedValue = request.Headers[HeaderName];
        if (suppliedValue.Count == 1 && IsSafeCorrelationId(suppliedValue[0]))
        {
            return suppliedValue[0]!;
        }

        return Guid.NewGuid().ToString("N");
    }

    private static bool IsSafeCorrelationId(string? value)
    {
        if (string.IsNullOrWhiteSpace(value) || value.Length > MaximumLength)
        {
            return false;
        }

        foreach (var character in value)
        {
            if (!char.IsAsciiLetterOrDigit(character) && character is not '-' and not '_' and not '.')
            {
                return false;
            }
        }

        return true;
    }
}
