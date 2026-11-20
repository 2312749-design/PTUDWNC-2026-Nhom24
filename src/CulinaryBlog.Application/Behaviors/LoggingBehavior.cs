using System.Diagnostics;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CulinaryBlog.Application.Behaviors;

public sealed class LoggingBehavior<TRequest, TResponse>(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var started = Stopwatch.GetTimestamp();
        var requestName = typeof(TRequest).Name;
        // Never serialize requests: auth commands can contain passwords/tokens.
        logger.LogInformation("Handling {RequestName} TraceId={TraceId}", requestName, Activity.Current?.TraceId.ToString());
        try
        {
            var result = await next(cancellationToken);
            var elapsed = Stopwatch.GetElapsedTime(started).TotalMilliseconds;
            if (elapsed > 500) logger.LogWarning("Slow application request {RequestName} took {ElapsedMs} ms", requestName, elapsed);
            else logger.LogInformation("Handled {RequestName} in {ElapsedMs} ms", requestName, elapsed);
            return result;
        }
        catch
        {
            logger.LogWarning("Application request {RequestName} failed after {ElapsedMs} ms", requestName, Stopwatch.GetElapsedTime(started).TotalMilliseconds);
            throw;
        }
    }
}
