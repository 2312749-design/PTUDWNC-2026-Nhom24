using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.WebUtilities;

namespace CulinaryBlog.API.Endpoints;

public abstract class EndpointHandler
{
    public HttpContext HttpContext { get; set; } = null!;
    protected ClaimsPrincipal User => HttpContext.User;
    protected HttpRequest Request => HttpContext.Request;
    protected static ApiResponseResult Ok(object? value) => new(200, value);
    protected static ApiResponseResult Created(string location, object? value) => new(201, value, location);
    protected static ApiResponseResult NoContent() => new(204);
    protected static ApiResponseResult BadRequest(object? value = null) => new(400, value);
    protected static ApiResponseResult Unauthorized(object? value = null) => new(401, value);
    protected static ApiResponseResult Forbid() => new(403);
    protected static ApiResponseResult NotFound(object? value = null) => new(404, value);
    protected static ApiResponseResult Conflict(object? value = null) => new(409, value);
    protected static ApiResponseResult StatusCode(int status, object? value = null) => new(status, value);
}

// One HTTP contract for all Minimal API handlers, including paginated responses.
public sealed record ApiResponseResult(int StatusCode, object? Value = null, string? Location = null) : IResult
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);
    public async Task ExecuteAsync(HttpContext context)
    {
        if (Location is not null) context.Response.Headers.Location = Location;
        if (StatusCode == 204) { context.Response.StatusCode = 204; return; }
        var payload = JsonSerializer.SerializeToElement(Value, JsonOptions);
        if (StatusCode >= 400)
        {
            string? Get(string key) => payload.ValueKind == JsonValueKind.Object && payload.TryGetProperty(key, out var v) ? v.ToString() : null;
            var extensions = new Dictionary<string, object?>();
            if (Get("code") is { } code) extensions["code"] = code;
            if (payload.ValueKind == JsonValueKind.Object && payload.TryGetProperty("errors", out var errors)) extensions["errors"] = errors;
            await Results.Problem(statusCode: StatusCode, title: Get("title") ?? ReasonPhrases.GetReasonPhrase(StatusCode),
                detail: Get("detail") ?? Get("message") ?? ReasonPhrases.GetReasonPhrase(StatusCode), extensions: extensions).ExecuteAsync(context);
            return;
        }
        object envelope = new { data = payload };
        if (payload.ValueKind == JsonValueKind.Object)
        {
            if (payload.TryGetProperty("items", out var items) && payload.TryGetProperty("page", out var page)
                && payload.TryGetProperty("pageSize", out var pageSize) && payload.TryGetProperty("total", out var total))
                envelope = new { data = items, meta = new { page, pageSize, total, totalPages = (int)Math.Ceiling((double)total.GetInt32() / Math.Max(1, pageSize.GetInt32())) } };
            else if (payload.TryGetProperty("data", out _)) envelope = payload;
        }
        await Results.Json(envelope, statusCode: StatusCode).ExecuteAsync(context);
    }
}
