using System.Security.Cryptography;
using System.Text;
using CulinaryBlog.API.Endpoints;

namespace CulinaryBlog.API.Middleware;

public sealed class CsrfProtectionMiddleware(RequestDelegate next, IConfiguration configuration)
{
    private static readonly HashSet<string> SafeMethods = new(StringComparer.OrdinalIgnoreCase)
    {
        HttpMethods.Get, HttpMethods.Head, HttpMethods.Options, HttpMethods.Trace
    };

    private readonly HashSet<string> _allowedOrigins = configuration
        .GetSection("Cors:AllowedOrigins")
        .Get<string[]>()
        ?.Select(origin => origin.TrimEnd('/'))
        .ToHashSet(StringComparer.OrdinalIgnoreCase)
        ?? ["http://localhost:3000", "http://127.0.0.1:3000"];

    public async Task InvokeAsync(HttpContext context)
    {
        if (SafeMethods.Contains(context.Request.Method) || !UsesCookieAuthentication(context.Request))
        {
            await next(context);
            return;
        }

        if (!HasAllowedOrigin(context.Request) || !HasValidDoubleSubmitToken(context.Request))
        {
            await Results.Problem(
                statusCode: StatusCodes.Status403Forbidden,
                title: "CSRF validation failed",
                detail: "Yêu cầu thay đổi dữ liệu không có nguồn hoặc CSRF token hợp lệ.")
                .ExecuteAsync(context);
            return;
        }

        await next(context);
    }

    private static bool UsesCookieAuthentication(HttpRequest request) =>
        request.Cookies.ContainsKey(AuthHandlers.AccessTokenCookieName)
        || request.Cookies.ContainsKey(AuthHandlers.RefreshTokenCookieName);

    private bool HasAllowedOrigin(HttpRequest request)
    {
        if (!request.Headers.TryGetValue("Origin", out var origin) || string.IsNullOrWhiteSpace(origin))
            return true; // Non-browser clients still have to pass the double-submit token.

        return _allowedOrigins.Contains(origin.ToString().TrimEnd('/'));
    }

    private static bool HasValidDoubleSubmitToken(HttpRequest request)
    {
        var cookie = request.Cookies[AuthHandlers.CsrfTokenCookieName];
        var header = request.Headers[AuthHandlers.CsrfTokenHeaderName].ToString();
        if (string.IsNullOrWhiteSpace(cookie) || string.IsNullOrWhiteSpace(header)) return false;

        var left = Encoding.UTF8.GetBytes(cookie);
        var right = Encoding.UTF8.GetBytes(header);
        return left.Length == right.Length && CryptographicOperations.FixedTimeEquals(left, right);
    }
}
