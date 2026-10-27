using System.Net;
using System.Net.Http.Json;
using CulinaryBlog.API.Middleware;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.TestHost;
using Xunit;

namespace CulinaryBlog.API.Tests;

public sealed class CorrelationIdMiddlewareTests : IAsyncLifetime
{
    private WebApplication _app = null!;
    private HttpClient _client = null!;

    public async Task InitializeAsync()
    {
        var builder = WebApplication.CreateBuilder();
        builder.WebHost.UseTestServer();
        _app = builder.Build();
        _app.UseMiddleware<CorrelationIdMiddleware>();
        _app.MapGet("/probe", (HttpContext context) => Results.Ok(new
        {
            traceIdentifier = context.TraceIdentifier,
            item = context.Items[CorrelationIdMiddleware.HttpContextItemKey]?.ToString()
        }));
        await _app.StartAsync();
        _client = _app.GetTestClient();
    }

    public async Task DisposeAsync()
    {
        _client.Dispose();
        await _app.DisposeAsync();
    }

    [Fact]
    public async Task SuppliedSafeCorrelationId_IsPropagatedToResponseAndRequestContext()
    {
        const string correlationId = "browser-flow-42";
        using var request = new HttpRequestMessage(HttpMethod.Get, "/probe");
        request.Headers.Add(CorrelationIdMiddleware.HeaderName, correlationId);

        var response = await _client.SendAsync(request);
        var payload = await response.Content.ReadFromJsonAsync<ProbeResponse>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(correlationId, response.Headers.GetValues(CorrelationIdMiddleware.HeaderName).Single());
        Assert.Equal(correlationId, response.Headers.GetValues(CorrelationIdMiddleware.LegacyRequestIdHeaderName).Single());
        Assert.Equal(correlationId, payload?.TraceIdentifier);
        Assert.Equal(correlationId, payload?.Item);
    }

    [Fact]
    public async Task UnsafeCorrelationId_IsReplacedWithServerGeneratedValue()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/probe");
        request.Headers.Add(CorrelationIdMiddleware.HeaderName, "has spaces and punctuation!");

        var response = await _client.SendAsync(request);
        var generatedValue = response.Headers.GetValues(CorrelationIdMiddleware.HeaderName).Single();
        var payload = await response.Content.ReadFromJsonAsync<ProbeResponse>();

        Assert.Matches("^[a-f0-9]{32}$", generatedValue);
        Assert.Equal(generatedValue, payload?.TraceIdentifier);
        Assert.Equal(generatedValue, payload?.Item);
    }

    private sealed record ProbeResponse(string TraceIdentifier, string Item);
}
