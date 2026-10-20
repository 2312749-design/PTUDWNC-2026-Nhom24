using CulinaryBlog.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace CulinaryBlog.API.Endpoints;

public static class CommunityEndpoints
{
    public static void MapCommunity(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/community/feed", (CommunityHandlers handler, HttpContext context, [FromQuery] string? username = null, [FromQuery] string scope = "discover", [FromQuery] string sort = "recent") => { handler.HttpContext = context; return handler.Feed(username, scope, sort); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>();
        app.MapGet("/api/v1/community/feed", (CommunityHandlers handler, HttpContext context, [FromQuery] string? username = null, [FromQuery] string scope = "discover", [FromQuery] string sort = "recent") => { handler.HttpContext = context; return handler.Feed(username, scope, sort); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>();
        app.MapGet("/api/community/drafts", (CommunityHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.Drafts(); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapGet("/api/v1/community/drafts", (CommunityHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.Drafts(); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapGet("/api/community/users", (CommunityHandlers handler, HttpContext context, [FromQuery] string? q = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 24) => { handler.HttpContext = context; return handler.SearchUsers(q, page, pageSize); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>();
        app.MapGet("/api/v1/community/users", (CommunityHandlers handler, HttpContext context, [FromQuery] string? q = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 24) => { handler.HttpContext = context; return handler.SearchUsers(q, page, pageSize); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>();
        app.MapGet("/api/community/profiles/{username}", (CommunityHandlers handler, HttpContext context, string username) => { handler.HttpContext = context; return handler.Profile(username); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>();
        app.MapGet("/api/v1/community/profiles/{username}", (CommunityHandlers handler, HttpContext context, string username) => { handler.HttpContext = context; return handler.Profile(username); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>();
        app.MapGet("/api/community/profiles/{username}/followers", (CommunityHandlers handler, HttpContext context, string username) => { handler.HttpContext = context; return handler.Followers(username); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>();
        app.MapGet("/api/v1/community/profiles/{username}/followers", (CommunityHandlers handler, HttpContext context, string username) => { handler.HttpContext = context; return handler.Followers(username); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>();
        app.MapGet("/api/community/profiles/{username}/following", (CommunityHandlers handler, HttpContext context, string username) => { handler.HttpContext = context; return handler.Following(username); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>();
        app.MapGet("/api/v1/community/profiles/{username}/following", (CommunityHandlers handler, HttpContext context, string username) => { handler.HttpContext = context; return handler.Following(username); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>();
        app.MapPost("/api/community/posts", (CommunityHandlers handler, HttpContext context, CommunityHandlers.PostRequest request) => { handler.HttpContext = context; return handler.CreatePost(request); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/community/posts", (CommunityHandlers handler, HttpContext context, CommunityHandlers.PostRequest request) => { handler.HttpContext = context; return handler.CreatePost(request); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/community/upload-media", (CommunityHandlers handler, HttpContext context, IFormFile file) => { handler.HttpContext = context; return handler.UploadMedia(file); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization().RequireRateLimiting("upload").DisableAntiforgery().WithMetadata(new RequestSizeLimitAttribute(5 * 1024 * 1024)).WithMetadata(new RequestFormLimitsAttribute { MultipartBodyLengthLimit = 5 * 1024 * 1024 });
        app.MapPost("/api/v1/community/upload-media", (CommunityHandlers handler, HttpContext context, IFormFile file) => { handler.HttpContext = context; return handler.UploadMedia(file); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization().RequireRateLimiting("upload").DisableAntiforgery().WithMetadata(new RequestSizeLimitAttribute(5 * 1024 * 1024)).WithMetadata(new RequestFormLimitsAttribute { MultipartBodyLengthLimit = 5 * 1024 * 1024 });
        app.MapPut("/api/community/posts/{id:guid}", (CommunityHandlers handler, HttpContext context, Guid id, CommunityHandlers.PostRequest request) => { handler.HttpContext = context; return handler.UpdatePost(id, request); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPut("/api/v1/community/posts/{id:guid}", (CommunityHandlers handler, HttpContext context, Guid id, CommunityHandlers.PostRequest request) => { handler.HttpContext = context; return handler.UpdatePost(id, request); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/community/posts/{id:guid}/like", (CommunityHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.ToggleLike(id); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/community/posts/{id:guid}/like", (CommunityHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.ToggleLike(id); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/community/posts/{id:guid}/comments", (CommunityHandlers handler, HttpContext context, Guid id, CommunityHandlers.CommentRequest request) => { handler.HttpContext = context; return handler.Comment(id, request); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/community/posts/{id:guid}/comments", (CommunityHandlers handler, HttpContext context, Guid id, CommunityHandlers.CommentRequest request) => { handler.HttpContext = context; return handler.Comment(id, request); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapDelete("/api/community/posts/{id:guid}", (CommunityHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.DeletePost(id); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapDelete("/api/v1/community/posts/{id:guid}", (CommunityHandlers handler, HttpContext context, Guid id) => { handler.HttpContext = context; return handler.DeletePost(id); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/community/users/{username}/follow", (CommunityHandlers handler, HttpContext context, string username) => { handler.HttpContext = context; return handler.ToggleFollow(username); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/community/users/{username}/follow", (CommunityHandlers handler, HttpContext context, string username) => { handler.HttpContext = context; return handler.ToggleFollow(username); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapDelete("/api/community/users/{username}/follow", (CommunityHandlers handler, HttpContext context, string username) => { handler.HttpContext = context; return handler.Unfollow(username); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapDelete("/api/v1/community/users/{username}/follow", (CommunityHandlers handler, HttpContext context, string username) => { handler.HttpContext = context; return handler.Unfollow(username); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapDelete("/api/community/users/{username}/followers", (CommunityHandlers handler, HttpContext context, string username) => { handler.HttpContext = context; return handler.RemoveFollower(username); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapDelete("/api/v1/community/users/{username}/followers", (CommunityHandlers handler, HttpContext context, string username) => { handler.HttpContext = context; return handler.RemoveFollower(username); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPut("/api/community/posts/{id:guid}/comments-enabled", (CommunityHandlers handler, HttpContext context, Guid id, CommunityHandlers.CommentsEnabledRequest request) => { handler.HttpContext = context; return handler.SetCommentsEnabled(id, request); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPut("/api/v1/community/posts/{id:guid}/comments-enabled", (CommunityHandlers handler, HttpContext context, Guid id, CommunityHandlers.CommentsEnabledRequest request) => { handler.HttpContext = context; return handler.SetCommentsEnabled(id, request); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/community/posts/{id:guid}/report", (CommunityHandlers handler, HttpContext context, Guid id, CommunityHandlers.ReportRequest request) => { handler.HttpContext = context; return handler.ReportPost(id, request); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/community/posts/{id:guid}/report", (CommunityHandlers handler, HttpContext context, Guid id, CommunityHandlers.ReportRequest request) => { handler.HttpContext = context; return handler.ReportPost(id, request); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/community/users/{username}/report", (CommunityHandlers handler, HttpContext context, string username, CommunityHandlers.ReportRequest request) => { handler.HttpContext = context; return handler.ReportUser(username, request); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/community/users/{username}/report", (CommunityHandlers handler, HttpContext context, string username, CommunityHandlers.ReportRequest request) => { handler.HttpContext = context; return handler.ReportUser(username, request); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapGet("/api/community/reports/mine", (CommunityHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.MyReports(); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapGet("/api/v1/community/reports/mine", (CommunityHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.MyReports(); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/community/users/{username}/block", (CommunityHandlers handler, HttpContext context, string username) => { handler.HttpContext = context; return handler.BlockUser(username); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapPost("/api/v1/community/users/{username}/block", (CommunityHandlers handler, HttpContext context, string username) => { handler.HttpContext = context; return handler.BlockUser(username); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapDelete("/api/community/users/{username}/block", (CommunityHandlers handler, HttpContext context, string username) => { handler.HttpContext = context; return handler.UnblockUser(username); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapDelete("/api/v1/community/users/{username}/block", (CommunityHandlers handler, HttpContext context, string username) => { handler.HttpContext = context; return handler.UnblockUser(username); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapGet("/api/community/blocks", (CommunityHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.BlockedUsers(); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
        app.MapGet("/api/v1/community/blocks", (CommunityHandlers handler, HttpContext context) => { handler.HttpContext = context; return handler.BlockedUsers(); })
            .WithTags("Community").AddEndpointFilter<RequestValidationFilter>().RequireAuthorization();
    }
}
