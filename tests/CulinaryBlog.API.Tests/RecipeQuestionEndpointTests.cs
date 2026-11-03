using System.Net;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Text.Json;
using CulinaryBlog.API.Endpoints;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Hangfire;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace CulinaryBlog.API.Tests;

public sealed class RecipeQuestionEndpointTests : IAsyncLifetime
{
    private readonly SqliteConnection _connection = new("DataSource=:memory:");
    private WebApplication _app = null!;
    private HttpClient _client = null!;

    public async Task InitializeAsync()
    {
        await _connection.OpenAsync();
        var builder = WebApplication.CreateBuilder();
        builder.WebHost.UseTestServer();
        builder.Services.AddAuthentication("Test").AddScheme<AuthenticationSchemeOptions, TestAuthentication>("Test", _ => { });
        builder.Services.AddAuthorization();
        builder.Services.AddDbContext<TestApplicationDbContext>(options => options.UseSqlite(_connection));
        builder.Services.AddScoped<ApplicationDbContext>(services => services.GetRequiredService<TestApplicationDbContext>());
        builder.Services.AddScoped<CommunityHandlers>();
        builder.Services.AddSingleton(Mock.Of<IFileStorageService>());
        builder.Services.AddSingleton(Mock.Of<IBackgroundJobClient>());
        _app = builder.Build();
        _app.UseRouting();
        _app.UseAuthentication();
        _app.UseAuthorization();
        _app.MapRecipeQuestions();
        _app.MapCookingSessions();
        _app.MapExtensions();
        _app.MapCommunity();
        using (var scope = _app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            await db.Database.EnsureCreatedAsync();
            db.Users.AddRange(
                new ApplicationUser { Id = "asker", UserName = "asker", FullName = "Người hỏi", Email = "asker@example.invalid" },
                new ApplicationUser { Id = "responder", UserName = "responder", FullName = "Người trả lời", Email = "responder@example.invalid" });
            await db.SaveChangesAsync();
        }
        await _app.StartAsync();
        _client = _app.GetTestClient();
    }

    public async Task DisposeAsync()
    {
        _client.Dispose();
        await _app.DisposeAsync();
        await _connection.DisposeAsync();
    }

    [Fact]
    public async Task AnonymousCanReadQuestionsButCannotCreateOne()
    {
        using var list = await _client.GetAsync("/api/v1/features/questions");
        Assert.Equal(HttpStatusCode.OK, list.StatusCode);
        using var document = JsonDocument.Parse(await list.Content.ReadAsStringAsync());
        Assert.Empty(document.RootElement.GetProperty("data").GetProperty("items").EnumerateArray());
        using var create = await _client.PostAsJsonAsync("/api/v1/features/questions", new { recipe = "Phở bò", question = "Nấu bao lâu?" });
        Assert.Equal(HttpStatusCode.Unauthorized, create.StatusCode);
        using var scope = _app.Services.CreateScope();
        Assert.Empty(await scope.ServiceProvider.GetRequiredService<ApplicationDbContext>().CommunityPosts.ToListAsync());
    }

    [Fact]
    public async Task CreatedQuestionAndExistingCommunityAnswerSurviveFreshReads()
    {
        const string question = "Nêm 1.5 thìa nước mắm được không?\nTôi muốn vị nhẹ. Cảm ơn!";
        using var create = await PostAs("/api/v1/features/questions", new { recipe = "  Canh chua cá lóc  ", question }, "asker");
        Assert.Equal(HttpStatusCode.Created, create.StatusCode);
        using var createdJson = JsonDocument.Parse(await create.Content.ReadAsStringAsync());
        var id = createdJson.RootElement.GetProperty("data").GetProperty("id").GetGuid();
        using (var scope = _app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var persisted = await db.CommunityPosts.AsNoTracking().SingleAsync(post => post.Id == id);
            Assert.Equal("#hoi-dap-bep-nha\nMón: Canh chua cá lóc\n" + question, persisted.Content);
            Assert.Equal("asker", persisted.AuthorId);
        }
        const string answer = "Bạn nên nêm từ ít đến nhiều và nếm lại trước khi tắt bếp.";
        using var reply = await PostAs($"/api/v1/community/posts/{id}/comments", new { content = answer }, "responder");
        Assert.Equal(HttpStatusCode.OK, reply.StatusCode);
        using var read = await _client.GetAsync("/api/v1/features/questions");
        using var document = JsonDocument.Parse(await read.Content.ReadAsStringAsync());
        var item = Assert.Single(document.RootElement.GetProperty("data").GetProperty("items").EnumerateArray());
        Assert.Equal(id, item.GetProperty("id").GetGuid());
        Assert.Equal("Canh chua cá lóc", item.GetProperty("recipe").GetString());
        Assert.Equal(question, item.GetProperty("text").GetString());
        Assert.Equal("Người hỏi", item.GetProperty("author").GetString());
        Assert.Equal(answer, item.GetProperty("answer").GetString());
        Assert.Equal("Người trả lời", item.GetProperty("answeredBy").GetString());
        Assert.Single(item.GetProperty("answers").EnumerateArray());
        Assert.False(item.TryGetProperty("email", out _));
    }

    [Fact]
    public async Task InvalidQuestionsAreRejectedAndDraftHiddenOrLockedPostsStayProtected()
    {
        foreach (var input in new[]
        {
            new { recipe = " ", question = "Câu hỏi hợp lệ" },
            new { recipe = new string('a', 201), question = "Câu hỏi hợp lệ" },
            new { recipe = "Canh\nMón khác", question = "Câu hỏi hợp lệ" },
            new { recipe = "Canh", question = " " },
            new { recipe = "Canh", question = new string('a', 2001) }
        })
        {
            using var invalid = await PostAs("/api/v1/features/questions", input, "asker");
            Assert.Equal(HttpStatusCode.BadRequest, invalid.StatusCode);
        }
        var hidden = new CommunityPost { AuthorId = "asker", Content = "#hoi-dap-bep-nha\nMón: Món ẩn\nKhông công khai", IsHidden = true };
        var draft = new CommunityPost { AuthorId = "asker", Content = "#hoi-dap-bep-nha\nMón: Món nháp\nChưa xuất bản", IsDraft = true };
        var locked = new CommunityPost { AuthorId = "asker", Content = "#hoi-dap-bep-nha\nMón: Món khóa\nĐã khóa bình luận", CommentsEnabled = false };
        using (var scope = _app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            db.CommunityPosts.AddRange(hidden, draft, locked);
            await db.SaveChangesAsync();
        }
        using var read = await _client.GetAsync("/api/v1/features/questions");
        using var document = JsonDocument.Parse(await read.Content.ReadAsStringAsync());
        var item = Assert.Single(document.RootElement.GetProperty("data").GetProperty("items").EnumerateArray());
        Assert.Equal(locked.Id, item.GetProperty("id").GetGuid());
        Assert.False(item.GetProperty("commentsEnabled").GetBoolean());
        using var hiddenReply = await PostAs($"/api/v1/community/posts/{hidden.Id}/comments", new { content = "Không được thêm" }, "responder");
        using var draftReply = await PostAs($"/api/v1/community/posts/{draft.Id}/comments", new { content = "Không được thêm" }, "responder");
        using var lockedReply = await PostAs($"/api/v1/community/posts/{locked.Id}/comments", new { content = "Không được thêm" }, "responder");
        Assert.Equal(HttpStatusCode.NotFound, hiddenReply.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, draftReply.StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, lockedReply.StatusCode);
    }

    [Fact]
    public async Task CookingSessionPersistsAndOnlyHostCanCancelWithCapacityEnforced()
    {
        var path = "/api/v1/features/cooking-sessions";
        var body = new { title = "Nấu canh cùng nhau", description = "Buổi nấu kiểm thử", startsAt = DateTime.UtcNow.AddDays(1), durationMinutes = 45, capacity = 2 };
        using var anonymous = await _client.PostAsJsonAsync(path, body);
        Assert.Equal(HttpStatusCode.Unauthorized, anonymous.StatusCode);
        using var created = await PostAs(path, body, "asker");
        Assert.Equal(HttpStatusCode.Created, created.StatusCode);
        using var createdJson = JsonDocument.Parse(await created.Content.ReadAsStringAsync());
        var id = createdJson.RootElement.GetProperty("data").GetProperty("id").GetGuid();
        using var join = await PostAs($"/api/v1/extensions/events/{id}/register", new { }, "responder");
        Assert.Equal(HttpStatusCode.Created, join.StatusCode);
        using (var scope = _app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            db.Users.Add(new ApplicationUser { Id = "third", UserName = "third", FullName = "Người thứ ba" });
            await db.SaveChangesAsync();
        }
        using var full = await PostAs($"/api/v1/extensions/events/{id}/register", new { }, "third");
        Assert.Equal(HttpStatusCode.Conflict, full.StatusCode);
        using var read = await _client.GetAsync(path);
        using var listJson = JsonDocument.Parse(await read.Content.ReadAsStringAsync());
        var item = Assert.Single(listJson.RootElement.GetProperty("data").GetProperty("items").EnumerateArray());
        Assert.Equal(2, item.GetProperty("joined").GetInt32());
        using var denied = new HttpRequestMessage(HttpMethod.Delete, $"{path}/{id}");
        denied.Headers.Add("X-Test-User", "responder");
        using var forbidden = await _client.SendAsync(denied);
        Assert.Equal(HttpStatusCode.Forbidden, forbidden.StatusCode);
        using var leave = new HttpRequestMessage(HttpMethod.Delete, $"{path}/{id}/join");
        leave.Headers.Add("X-Test-User", "responder");
        using var left = await _client.SendAsync(leave);
        Assert.Equal(HttpStatusCode.OK, left.StatusCode);
        using var cancel = new HttpRequestMessage(HttpMethod.Delete, $"{path}/{id}");
        cancel.Headers.Add("X-Test-User", "asker");
        using var cancelled = await _client.SendAsync(cancel);
        Assert.Equal(HttpStatusCode.OK, cancelled.StatusCode);
        using var finalScope = _app.Services.CreateScope();
        var finalDb = finalScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        Assert.Empty(await finalDb.CookingEvents.ToListAsync());
        Assert.Empty(await finalDb.CookingEventRegistrations.ToListAsync());
    }

    [Fact]
    public async Task CookingSessionRejectsPastDatesAndInvalidCapacityWithoutWriting()
    {
        using var invalid = await PostAs("/api/v1/features/cooking-sessions", new { title = "Nấu canh", startsAt = DateTime.UtcNow.AddDays(-1), durationMinutes = 45, capacity = 2 }, "asker");
        using var invalidCapacity = await PostAs("/api/v1/features/cooking-sessions", new { title = "Nấu canh", startsAt = DateTime.UtcNow.AddDays(1), durationMinutes = 45, capacity = 1 }, "asker");
        Assert.Equal(HttpStatusCode.BadRequest, invalid.StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, invalidCapacity.StatusCode);
        using var scope = _app.Services.CreateScope();
        Assert.Empty(await scope.ServiceProvider.GetRequiredService<ApplicationDbContext>().CookingEvents.ToListAsync());
    }

    private async Task<HttpResponseMessage> PostAs(string path, object body, string userId)
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, path) { Content = JsonContent.Create(body) };
        request.Headers.Add("X-Test-User", userId);
        return await _client.SendAsync(request);
    }

    private sealed class TestApplicationDbContext(DbContextOptions<TestApplicationDbContext> options) : ApplicationDbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Recipe>().Ignore("SearchVector");
        }
    }

    private sealed class TestAuthentication(IOptionsMonitor<AuthenticationSchemeOptions> options, ILoggerFactory logger, UrlEncoder encoder)
        : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
    {
        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (!Request.Headers.TryGetValue("X-Test-User", out var id)) return Task.FromResult(AuthenticateResult.NoResult());
            var user = new ClaimsPrincipal(new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, id.ToString()), new Claim(ClaimTypes.Role, "User")], "Test"));
            return Task.FromResult(AuthenticateResult.Success(new AuthenticationTicket(user, "Test")));
        }
    }
}
