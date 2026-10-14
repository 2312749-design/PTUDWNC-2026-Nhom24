using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.WebUtilities;

namespace CulinaryBlog.API.Filters;

public sealed class ApiContractFilter : IAsyncResultFilter
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task OnResultExecutionAsync(ResultExecutingContext context, ResultExecutionDelegate next)
    {
        var result = context.Result;
        if (result is ObjectResult objectResult)
        {
            var statusCode = objectResult.StatusCode ?? StatusCodes.Status200OK;
            if (statusCode >= 400)
            {
                context.Result = CreateProblemResult(objectResult.Value, statusCode);
            }
            else if (objectResult.Value != null)
            {
                context.Result = CreateSuccessResult(objectResult.Value, statusCode);
            }
        }
        else if (result is StatusCodeResult statusCodeResult && statusCodeResult.StatusCode >= 400)
        {
            context.Result = CreateProblemResult(null, statusCodeResult.StatusCode);
        }
        else if (result is UnauthorizedResult)
        {
            context.Result = CreateProblemResult(null, StatusCodes.Status401Unauthorized);
        }
        else if (result is ForbidResult)
        {
            context.Result = CreateProblemResult(null, StatusCodes.Status403Forbidden);
        }
        else if (result is NotFoundResult)
        {
            context.Result = CreateProblemResult(null, StatusCodes.Status404NotFound);
        }

        await next();
    }

    private static ObjectResult CreateSuccessResult(object value, int statusCode)
    {
        var payload = JsonSerializer.SerializeToElement(value, JsonOptions);
        var envelope = new Dictionary<string, object?>
        {
            ["data"] = payload
        };

        if (payload.ValueKind == JsonValueKind.Object &&
            payload.TryGetProperty("items", out var items) &&
            payload.TryGetProperty("page", out var page) &&
            payload.TryGetProperty("pageSize", out var pageSize) &&
            payload.TryGetProperty("total", out var total))
        {
            envelope["data"] = items;
            envelope["meta"] = new
            {
                page,
                pageSize,
                total,
                totalPages = (int)Math.Ceiling((double)total.GetInt32() / pageSize.GetInt32())
            };
        }
        else if (payload.ValueKind == JsonValueKind.Object && payload.TryGetProperty("data", out var existingData))
        {
            envelope["data"] = existingData;
            if (payload.TryGetProperty("meta", out var meta))
            {
                envelope["meta"] = meta;
            }
        }

        return new ObjectResult(envelope) { StatusCode = statusCode };
    }

    private static ObjectResult CreateProblemResult(object? value, int statusCode)
    {
        if (value is ProblemDetails problemDetails)
        {
            problemDetails.Status = statusCode;
            return new ObjectResult(problemDetails)
            {
                StatusCode = statusCode,
                ContentTypes = { "application/problem+json" }
            };
        }

        var payload = value == null ? default : JsonSerializer.SerializeToElement(value, JsonOptions);
        var detail = GetString(payload, "detail") ?? GetString(payload, "message");
        var title = GetString(payload, "title") ?? ReasonPhrases.GetReasonPhrase(statusCode);
        var errors = GetErrors(payload);
        ProblemDetails problem = errors.Count > 0
            ? new ValidationProblemDetails(errors) { Status = statusCode, Title = title, Detail = detail }
            : new ProblemDetails { Status = statusCode, Title = title, Detail = detail };
        var code = GetString(payload, "code");
        if (!string.IsNullOrWhiteSpace(code))
        {
            problem.Extensions["code"] = code;
        }

        return new ObjectResult(problem)
        {
            StatusCode = statusCode,
            ContentTypes = { "application/problem+json" }
        };
    }

    private static string? GetString(JsonElement payload, string propertyName) =>
        payload.ValueKind == JsonValueKind.Object && payload.TryGetProperty(propertyName, out var value) && value.ValueKind == JsonValueKind.String
            ? value.GetString()
            : null;

    private static IDictionary<string, string[]> GetErrors(JsonElement payload)
    {
        var errors = new Dictionary<string, string[]>(StringComparer.Ordinal);
        if (payload.ValueKind != JsonValueKind.Object || !payload.TryGetProperty("errors", out var errorObject) || errorObject.ValueKind != JsonValueKind.Object)
        {
            return errors;
        }

        foreach (var property in errorObject.EnumerateObject())
        {
            errors[property.Name] = property.Value.ValueKind == JsonValueKind.Array
                ? property.Value.EnumerateArray().Select(item => item.GetString() ?? string.Empty).ToArray()
                : [property.Value.ToString()];
        }

        return errors;
    }
}