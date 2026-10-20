using CulinaryBlog.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace CulinaryBlog.API.Endpoints;

public static class TestEndpoints
{
    public static void MapTest(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/test/secure-data", (TestHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.GetSecureData(); })
            .WithTags("Test").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapGet("/api/v1/test/secure-data", (TestHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.GetSecureData(); })
            .WithTags("Test").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
    }
}
