using CulinaryBlog.Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace CulinaryBlog.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Unhandled exception occurred.");

            var problem = CreateProblemDetails(exception);

            if (context.Response.HasStarted)
            {
                throw;
            }

            context.Response.StatusCode = problem.Status ?? StatusCodes.Status500InternalServerError;
            context.Response.ContentType = "application/problem+json";
            await context.Response.WriteAsync(JsonSerializer.Serialize(problem, problem.GetType(), new JsonSerializerOptions(JsonSerializerDefaults.Web)));
        }
    }

    private static ProblemDetails CreateProblemDetails(Exception exception)
    {
        return exception switch
        {
            FluentValidation.ValidationException fluentValidation => CreateValidationProblem(fluentValidation),
            BadHttpRequestException badRequest => new ProblemDetails
            {
                Status = badRequest.StatusCode,
                Title = "Invalid request",
                Detail = "Nội dung JSON, kiểu dữ liệu hoặc tham số của yêu cầu không hợp lệ."
            },
            NotFoundException => new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Resource not found",
                Detail = exception.Message,
                Type = "https://httpstatuses.com/404"
            },
            ValidationException => new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Validation failed",
                Detail = exception.Message,
                Type = "https://httpstatuses.com/400"
            },
            UnauthorizedAccessException => new ProblemDetails
            {
                Status = StatusCodes.Status401Unauthorized,
                Title = "Unauthorized",
                Detail = exception.Message,
                Type = "https://httpstatuses.com/401"
            },
            ForbiddenException => new ProblemDetails
            {
                Status = StatusCodes.Status403Forbidden,
                Title = "Forbidden",
                Detail = exception.Message,
                Type = "https://httpstatuses.com/403"
            },
            Microsoft.EntityFrameworkCore.DbUpdateConcurrencyException => new ProblemDetails
            {
                Status = StatusCodes.Status409Conflict,
                Title = "Concurrent update",
                Detail = "Dữ liệu đã thay đổi. Hãy tải lại trước khi lưu."
            },
            ConcurrencyConflictException => new ProblemDetails
            {
                Status = StatusCodes.Status412PreconditionFailed,
                Title = "Concurrent update",
                Detail = exception.Message,
                Type = "https://httpstatuses.com/412"
            },
            ConflictException => new ProblemDetails
            {
                Status = StatusCodes.Status409Conflict,
                Title = "Conflict",
                Detail = exception.Message,
                Type = "https://httpstatuses.com/409"
            },
            _ => new ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Title = "Internal server error",
                Detail = "An unexpected error occurred. Please try again later.",
                Type = "https://httpstatuses.com/500"
            }
        };
    }

    private static HttpValidationProblemDetails CreateValidationProblem(
        FluentValidation.ValidationException exception)
    {
        var errors = exception.Errors
            .GroupBy(error => string.IsNullOrWhiteSpace(error.PropertyName) ? "request" : error.PropertyName)
            .ToDictionary(
                group => group.Key,
                group => group.Select(error => error.ErrorMessage).Distinct().ToArray());

        return new HttpValidationProblemDetails(errors)
        {
            Status = StatusCodes.Status422UnprocessableEntity,
            Title = "Validation failed",
            Detail = "Dữ liệu gửi lên không đáp ứng quy tắc nghiệp vụ.",
            Type = "https://httpstatuses.com/422"
        };
    }
}
