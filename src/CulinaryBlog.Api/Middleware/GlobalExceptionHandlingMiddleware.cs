using CulinaryBlog.Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace CulinaryBlog.Api.Middleware;

public sealed class GlobalExceptionHandlingMiddleware(
    RequestDelegate next,
    ILogger<GlobalExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (OperationCanceledException) when (context.RequestAborted.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception exception)
        {
            var (status, title, detail) = exception switch
            {
                NotFoundException => (
                    StatusCodes.Status404NotFound,
                    "Resource not found",
                    exception.Message),
                ValidationException => (
                    StatusCodes.Status400BadRequest,
                    "Validation failed",
                    exception.Message),
                ConflictException => (
                    StatusCodes.Status409Conflict,
                    "Conflict",
                    exception.Message),
                DomainException => (
                    StatusCodes.Status400BadRequest,
                    "Request failed",
                    exception.Message),
                _ => (
                    StatusCodes.Status500InternalServerError,
                    "An unexpected error occurred",
                    "An unexpected error occurred while processing the request.")
            };

            if (status == StatusCodes.Status500InternalServerError)
            {
                logger.LogError(exception, "Unhandled exception while processing {Path}", context.Request.Path);
            }
            else
            {
                logger.LogInformation(exception, "Request failed with status {StatusCode}", status);
            }

            if (context.Response.HasStarted)
            {
                throw;
            }

            context.Response.Clear();
            context.Response.StatusCode = status;
            context.Response.ContentType = "application/problem+json";

            var problem = new ProblemDetails
            {
                Status = status,
                Title = title,
                Detail = detail,
                Instance = context.Request.Path
            };
            problem.Extensions["traceId"] = context.TraceIdentifier;

            await JsonSerializer.SerializeAsync(
                context.Response.Body,
                problem,
                new JsonSerializerOptions(JsonSerializerDefaults.Web),
                context.RequestAborted);
        }
    }
}
