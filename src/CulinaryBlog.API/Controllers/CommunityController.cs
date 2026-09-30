using System.Security.Claims;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;

namespace CulinaryBlog.API.Controllers;

[Route("api/community")]
[ApiController]
public class CommunityController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _environment;
    public CommunityController(ApplicationDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    [HttpGet("feed")]
    public async Task<IActionResult> Feed([FromQuery] string? username = null, [FromQuery] string scope = "discover", [FromQuery] string sort = "recent")
    {
        var viewerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var query = _context.CommunityPosts.AsNoTracking().Where(post => !post.IsDraft).AsQueryable();
        if (!string.IsNullOrWhiteSpace(username))
            query = query.Where(post => post.Author.UserName == username);
        if (viewerId != null)
        {
            query = query.Where(post => !_context.UserBlocks.Any(block =>
                (block.BlockerId == viewerId && block.BlockedId == post.AuthorId) ||
                (block.BlockedId == viewerId && block.BlockerId == post.AuthorId)));
            if (scope == "following")
                query = query.Where(post => _context.UserFollows.Any(follow => follow.FollowerId == viewerId && follow.FollowedId == post.AuthorId));
        }

        query = sort == "popular"
            ? query.OrderByDescending(post => post.Likes.Count * 2 + post.Comments.Count).ThenByDescending(post => post.CreatedAt)
            : query.OrderByDescending(post => post.CreatedAt);

        var posts = await query.Take(50)
            .Select(post => new
            {
                id = post.Id,
                content = post.Content,
                mediaUrl = post.MediaUrl,
                mediaType = post.MediaType,
                createdAt = post.CreatedAt,
                commentsEnabled = post.CommentsEnabled,
                author = new { username = post.Author.UserName, fullName = post.Author.FullName, avatarUrl = post.Author.AvatarUrl },
                likesCount = post.Likes.Count,
                likedByMe = viewerId != null && post.Likes.Any(like => like.UserId == viewerId),
                comments = post.Comments.OrderBy(comment => comment.CreatedAt).Select(comment => new
                {
                    id = comment.Id,
                    content = comment.Content,
                    createdAt = comment.CreatedAt,
                    parentCommentId = comment.ParentCommentId,
                    author = new { username = comment.Author.UserName, fullName = comment.Author.FullName, avatarUrl = comment.Author.AvatarUrl }
                }).Take(20).ToList()
            }).ToListAsync();
        return Ok(posts);
    }

        [HttpGet("drafts")]
        [Authorize]
        public async Task<IActionResult> Drafts()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var drafts = await _context.CommunityPosts.Where(post => post.AuthorId == userId && post.IsDraft)
                .OrderByDescending(post => post.CreatedAt)
                .Select(post => new { post.Id, post.Content, post.MediaUrl, post.MediaType, post.CreatedAt, post.CommentsEnabled })
                .ToListAsync();
            return Ok(drafts);
        }

    [HttpGet("users")]
    public async Task<IActionResult> SearchUsers([FromQuery] string? q = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 24)
    {
        var keyword = (q ?? string.Empty).Trim();
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 50);
        var viewerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var query = _context.Users.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(keyword))
            query = query.Where(user => EF.Functions.ILike(user.UserName!, $"%{keyword}%") || EF.Functions.ILike(user.FullName, $"%{keyword}%"));
        if (viewerId != null)
            query = query.Where(user => !_context.UserBlocks.Any(block =>
                (block.BlockerId == viewerId && block.BlockedId == user.Id) ||
                (block.BlockedId == viewerId && block.BlockerId == user.Id)));

        var total = await query.CountAsync();
        var users = await query
            .OrderByDescending(user => user.CreatedAt)
            .ThenBy(user => user.UserName)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .Select(user => new
            {
                username = user.UserName,
                fullName = user.FullName,
                avatarUrl = user.AvatarUrl,
                bio = user.Bio,
                isSelf = user.Id == viewerId,
                isFollowing = viewerId != null && _context.UserFollows.Any(follow => follow.FollowerId == viewerId && follow.FollowedId == user.Id)
            }).ToListAsync();
        return Ok(new { total, page, pageSize, items = users });
    }

    [HttpGet("profiles/{username}")]
    public async Task<IActionResult> Profile(string username)
    {
        var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(candidate => candidate.UserName == username);
        if (user == null) return NotFound(new { message = "Không tìm thấy thành viên." });
        var viewerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (viewerId != null && await _context.UserBlocks.AnyAsync(block =>
            (block.BlockerId == viewerId && block.BlockedId == user.Id) ||
            (block.BlockedId == viewerId && block.BlockerId == user.Id)))
            return NotFound(new { message = "Không tìm thấy thành viên." });
        var posts = await _context.CommunityPosts.AsNoTracking().Where(post => post.AuthorId == user.Id && (!post.IsDraft || viewerId == user.Id))
            .OrderByDescending(post => post.CreatedAt).Take(50)
            .Select(post => new { id = post.Id, content = post.Content, mediaUrl = post.MediaUrl, mediaType = post.MediaType, createdAt = post.CreatedAt, isDraft = post.IsDraft, likesCount = post.Likes.Count, likedByMe = viewerId != null && post.Likes.Any(like => like.UserId == viewerId) })
            .ToListAsync();
        return Ok(new
        {
            profile = new { username = user.UserName, fullName = user.FullName, avatarUrl = user.AvatarUrl, bio = user.Bio, createdAt = user.CreatedAt },
            posts,
            followersCount = _context.UserFollows.Count(follow => follow.FollowedId == user.Id),
            followingCount = _context.UserFollows.Count(follow => follow.FollowerId == user.Id),
            isFollowing = viewerId != null && _context.UserFollows.Any(follow => follow.FollowerId == viewerId && follow.FollowedId == user.Id),
            isOwnProfile = viewerId == user.Id
        });
    }

    [HttpGet("profiles/{username}/followers")]
    public async Task<IActionResult> Followers(string username)
    {
        var profileId = await _context.Users.Where(user => user.UserName == username).Select(user => user.Id).FirstOrDefaultAsync();
        if (profileId == null) return NotFound(new { message = "Không tìm thấy thành viên." });
        var viewerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var users = await _context.UserFollows.Where(follow => follow.FollowedId == profileId)
            .OrderByDescending(follow => follow.CreatedAt)
            .Select(follow => new
            {
                username = follow.Follower.UserName,
                fullName = follow.Follower.FullName,
                avatarUrl = follow.Follower.AvatarUrl,
                bio = follow.Follower.Bio,
                isFollowing = viewerId != null && _context.UserFollows.Any(item => item.FollowerId == viewerId && item.FollowedId == follow.FollowerId)
            }).ToListAsync();
        return Ok(users);
    }

    [HttpGet("profiles/{username}/following")]
    public async Task<IActionResult> Following(string username)
    {
        var profileId = await _context.Users.Where(user => user.UserName == username).Select(user => user.Id).FirstOrDefaultAsync();
        if (profileId == null) return NotFound(new { message = "Không tìm thấy thành viên." });
        var viewerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var users = await _context.UserFollows.Where(follow => follow.FollowerId == profileId)
            .OrderByDescending(follow => follow.CreatedAt)
            .Select(follow => new
            {
                username = follow.Followed.UserName,
                fullName = follow.Followed.FullName,
                avatarUrl = follow.Followed.AvatarUrl,
                bio = follow.Followed.Bio,
                isFollowing = viewerId != null && _context.UserFollows.Any(item => item.FollowerId == viewerId && item.FollowedId == follow.FollowedId)
            }).ToListAsync();
        return Ok(users);
    }

    [HttpPost("posts")]
    [Authorize]
    public async Task<IActionResult> CreatePost(PostRequest request)
    {
        var content = (request.Content ?? string.Empty).Trim();
        if (content.Length > 3000 || (content.Length == 0 && string.IsNullOrWhiteSpace(request.MediaUrl))) return BadRequest(new { message = "Bài viết cần có nội dung hoặc ảnh/video đính kèm." });
        if (!IsValidPostMedia(request.MediaUrl, request.MediaType)) return BadRequest(new { message = "Tệp đính kèm không hợp lệ." });
        var post = new CommunityPost { AuthorId = User.FindFirstValue(ClaimTypes.NameIdentifier)!, Content = content, MediaUrl = request.MediaUrl, MediaType = request.MediaType, IsDraft = request.IsDraft ?? false, CommentsEnabled = request.CommentsEnabled ?? true };
        _context.CommunityPosts.Add(post);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Feed), new { id = post.Id }, new { id = post.Id, content = post.Content, mediaUrl = post.MediaUrl, mediaType = post.MediaType, createdAt = post.CreatedAt });
    }

    [HttpPost("upload-media")]
    [Authorize]
    [RequestSizeLimit(55_000_000)]
    [RequestFormLimits(MultipartBodyLengthLimit = 55_000_000)]
    public async Task<IActionResult> UploadMedia(IFormFile file)
    {
        if (file == null || file.Length == 0) return BadRequest(new { message = "Vui lòng chọn ảnh hoặc video." });
        var contentType = file.ContentType.ToLowerInvariant();
        var extension = contentType switch
        {
            "image/jpeg" => ".jpg",
            "image/png" => ".png",
            "image/webp" => ".webp",
            "image/gif" => ".gif",
            "video/mp4" => ".mp4",
            "video/webm" => ".webm",
            _ => null
        };
        if (extension == null) return BadRequest(new { message = "Chỉ hỗ trợ ảnh JPG/PNG/WebP/GIF hoặc video MP4/WebM." });
        var isVideo = contentType.StartsWith("video/", StringComparison.Ordinal);
        var maxLength = isVideo ? 50L * 1024 * 1024 : 8L * 1024 * 1024;
        if (file.Length > maxLength) return BadRequest(new { message = isVideo ? "Video tối đa 50 MB." : "Ảnh tối đa 8 MB." });

        var webRoot = _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");
        var uploadFolder = Path.Combine(webRoot, "uploads", "community");
        Directory.CreateDirectory(uploadFolder);
        var fileName = $"{Guid.NewGuid():N}{extension}";
        await using (var stream = new FileStream(Path.Combine(uploadFolder, fileName), FileMode.CreateNew))
        {
            await file.CopyToAsync(stream);
        }
        var mediaUrl = $"{Request.Scheme}://{Request.Host}/uploads/community/{fileName}";
        return Ok(new { mediaUrl, mediaType = isVideo ? "video" : "image" });
    }

    [HttpPut("posts/{id:guid}")]
    [Authorize]
    public async Task<IActionResult> UpdatePost(Guid id, PostRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var post = await _context.CommunityPosts.FirstOrDefaultAsync(item => item.Id == id && item.AuthorId == userId);
        if (post == null) return NotFound(new { message = "Không tìm thấy bài viết của bạn." });
        var content = (request.Content ?? string.Empty).Trim();
        if (content.Length > 3000 || (content.Length == 0 && string.IsNullOrWhiteSpace(request.MediaUrl ?? post.MediaUrl)))
            return BadRequest(new { message = "Bài viết cần có nội dung hoặc ảnh/video đính kèm." });
        post.Content = content;
        if (!string.IsNullOrWhiteSpace(request.MediaUrl))
        {
            if (!IsValidPostMedia(request.MediaUrl, request.MediaType)) return BadRequest(new { message = "Tệp đính kèm không hợp lệ." });
            post.MediaUrl = request.MediaUrl;
            post.MediaType = request.MediaType;
        }
        if (request.IsDraft.HasValue) post.IsDraft = request.IsDraft.Value;
        if (request.CommentsEnabled.HasValue) post.CommentsEnabled = request.CommentsEnabled.Value;
        await _context.SaveChangesAsync();
        return Ok(new { id = post.Id, content = post.Content, createdAt = post.CreatedAt });
    }

    [HttpPost("posts/{id:guid}/like")]
    [Authorize]
    public async Task<IActionResult> ToggleLike(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        if (!await _context.CommunityPosts.AnyAsync(post => post.Id == id)) return NotFound();
        var like = await _context.PostLikes.FindAsync(id, userId);
        if (like == null)
        {
            var authorId = await _context.CommunityPosts.Where(post => post.Id == id).Select(post => post.AuthorId).FirstAsync();
            _context.PostLikes.Add(new PostLike { PostId = id, UserId = userId });
            AddNotification(authorId, userId, "like", "đã thích bài viết của bạn.", $"/members/{User.Identity?.Name}");
        }
        else _context.PostLikes.Remove(like);
        await _context.SaveChangesAsync();
        return Ok(new { liked = like == null });
    }

    [HttpPost("posts/{id:guid}/comments")]
    [Authorize]
    public async Task<IActionResult> Comment(Guid id, CommentRequest request)
    {
        var content = (request.Content ?? string.Empty).Trim();
        if (content.Length == 0 || content.Length > 1000) return BadRequest(new { message = "Bình luận cần có nội dung từ 1 đến 1000 ký tự." });
        var post = await _context.CommunityPosts.FirstOrDefaultAsync(item => item.Id == id && !item.IsDraft);
        if (post == null) return NotFound();
        if (!post.CommentsEnabled) return BadRequest(new { message = "Tác giả đã tắt bình luận cho bài viết này." });
        Guid? parentCommentId = null;
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        if (request.ParentCommentId.HasValue)
        {
            var parent = await _context.PostComments.FirstOrDefaultAsync(item => item.Id == request.ParentCommentId && item.PostId == id);
            if (parent == null) return BadRequest(new { message = "Không tìm thấy bình luận cần trả lời." });
            parentCommentId = parent.Id;
            AddNotification(parent.AuthorId, userId, "reply", "đã trả lời bình luận của bạn.", $"/community");
        }
        else AddNotification(post.AuthorId, userId, "comment", "đã bình luận bài viết của bạn.", $"/community");
        var comment = new PostComment { PostId = id, AuthorId = userId, Content = content, ParentCommentId = parentCommentId };
        _context.PostComments.Add(comment);
        await _context.SaveChangesAsync();
        return Ok(new { id = comment.Id, content, createdAt = comment.CreatedAt, parentCommentId = comment.ParentCommentId });
    }

    [HttpDelete("posts/{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeletePost(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var post = await _context.CommunityPosts.FirstOrDefaultAsync(item => item.Id == id && item.AuthorId == userId);
        if (post == null) return NotFound(new { message = "Không tìm thấy bài viết của bạn." });
        var mediaUrl = post.MediaUrl;
        _context.CommunityPosts.Remove(post);
        await _context.SaveChangesAsync();
        if (Uri.TryCreate(mediaUrl, UriKind.Absolute, out var mediaUri) && mediaUri.AbsolutePath.StartsWith("/uploads/community/", StringComparison.Ordinal))
        {
            var webRoot = _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");
            var filePath = Path.Combine(webRoot, "uploads", "community", Path.GetFileName(mediaUri.LocalPath));
            try { if (System.IO.File.Exists(filePath)) System.IO.File.Delete(filePath); }
            catch (IOException) { }
        }
        return NoContent();
    }

    [HttpPost("users/{username}/follow")]
    [Authorize]
    public async Task<IActionResult> ToggleFollow(string username)
    {
        var followerId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var followedId = await _context.Users.Where(user => user.UserName == username).Select(user => user.Id).FirstOrDefaultAsync();
        if (followedId == null) return NotFound(new { message = "Không tìm thấy thành viên." });
        if (followerId == followedId) return BadRequest(new { message = "Bạn không thể theo dõi chính mình." });
        var follow = await _context.UserFollows.FindAsync(followerId, followedId);
        if (follow == null)
        {
            _context.UserFollows.Add(new UserFollow { FollowerId = followerId, FollowedId = followedId });
            AddNotification(followedId, followerId, "follow", "đã bắt đầu theo dõi bạn.", $"/members/{User.Identity?.Name}");
        }
        else _context.UserFollows.Remove(follow);
        await _context.SaveChangesAsync();
        return Ok(new { following = follow == null });
    }

    [HttpDelete("users/{username}/follow")]
    [Authorize]
    public async Task<IActionResult> Unfollow(string username)
    {
        var followerId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var followedId = await _context.Users.Where(user => user.UserName == username).Select(user => user.Id).FirstOrDefaultAsync();
        if (followedId == null) return NotFound(new { message = "Không tìm thấy thành viên." });
        var follow = await _context.UserFollows.FindAsync(followerId, followedId);
        if (follow != null)
        {
            _context.UserFollows.Remove(follow);
            await _context.SaveChangesAsync();
        }
        return NoContent();
    }

    [HttpDelete("users/{username}/followers")]
    [Authorize]
    public async Task<IActionResult> RemoveFollower(string username)
    {
        var ownerId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var followerId = await _context.Users.Where(user => user.UserName == username).Select(user => user.Id).FirstOrDefaultAsync();
        if (followerId == null) return NotFound(new { message = "Không tìm thấy thành viên." });
        var follow = await _context.UserFollows.FindAsync(followerId, ownerId);
        if (follow != null)
        {
            _context.UserFollows.Remove(follow);
            await _context.SaveChangesAsync();
        }
        return NoContent();
    }

    [HttpPut("posts/{id:guid}/comments-enabled")]
    [Authorize]
    public async Task<IActionResult> SetCommentsEnabled(Guid id, CommentsEnabledRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var post = await _context.CommunityPosts.FirstOrDefaultAsync(item => item.Id == id && item.AuthorId == userId);
        if (post == null) return NotFound();
        post.CommentsEnabled = request.Enabled;
        await _context.SaveChangesAsync();
        return Ok(new { post.CommentsEnabled });
    }

    [HttpPost("posts/{id:guid}/report")]
    [Authorize]
    public async Task<IActionResult> ReportPost(Guid id, ReportRequest request)
    {
        var reason = (request.Reason ?? string.Empty).Trim();
        if (reason.Length is < 5 or > 500) return BadRequest(new { message = "Vui lòng mô tả lý do từ 5 đến 500 ký tự." });
        if (!await _context.CommunityPosts.AnyAsync(post => post.Id == id)) return NotFound();
        if (await _context.ContentReports.AnyAsync(report => report.ReporterId == UserId && report.TargetType == "post" && report.TargetId == id.ToString()))
            return Conflict(new { message = "Bạn đã báo cáo bài viết này." });
        _context.ContentReports.Add(new ContentReport { ReporterId = UserId, TargetType = "post", TargetId = id.ToString(), Reason = reason });
        await _context.SaveChangesAsync();
        return Ok(new { message = "Đã gửi báo cáo để đội ngũ xem xét." });
    }

    [HttpPost("users/{username}/report")]
    [Authorize]
    public async Task<IActionResult> ReportUser(string username, ReportRequest request)
    {
        var reason = (request.Reason ?? string.Empty).Trim();
        if (reason.Length is < 5 or > 500) return BadRequest(new { message = "Vui lòng mô tả lý do từ 5 đến 500 ký tự." });
        var targetId = await _context.Users.Where(user => user.UserName == username).Select(user => user.Id).FirstOrDefaultAsync();
        if (targetId == null) return NotFound(new { message = "Không tìm thấy thành viên." });
        if (targetId == UserId) return BadRequest(new { message = "Bạn không thể báo cáo chính mình." });
        if (await _context.ContentReports.AnyAsync(report => report.ReporterId == UserId && report.TargetType == "user" && report.TargetId == targetId))
            return Conflict(new { message = "Bạn đã báo cáo thành viên này." });
        _context.ContentReports.Add(new ContentReport { ReporterId = UserId, TargetType = "user", TargetId = targetId, Reason = reason });
        await _context.SaveChangesAsync();
        return Ok(new { message = "Đã gửi báo cáo để đội ngũ xem xét." });
    }

    [HttpGet("reports/mine")]
    [Authorize]
    public async Task<IActionResult> MyReports()
    {
        var items = await _context.ContentReports.Where(report => report.ReporterId == UserId)
            .OrderByDescending(report => report.CreatedAt)
            .Select(report => new { report.Id, report.TargetType, report.TargetId, report.Reason, report.CreatedAt, report.ResolvedAt })
            .ToListAsync();
        return Ok(items);
    }

    [HttpPost("users/{username}/block")]
    [Authorize]
    public async Task<IActionResult> BlockUser(string username)
    {
        var blockerId = UserId;
        var blockedId = await _context.Users.Where(user => user.UserName == username).Select(user => user.Id).FirstOrDefaultAsync();
        if (blockedId == null) return NotFound(new { message = "Không tìm thấy thành viên." });
        if (blockedId == blockerId) return BadRequest(new { message = "Bạn không thể chặn chính mình." });
        if (!await _context.UserBlocks.AnyAsync(block => block.BlockerId == blockerId && block.BlockedId == blockedId))
            _context.UserBlocks.Add(new UserBlock { BlockerId = blockerId, BlockedId = blockedId });
        var follows = await _context.UserFollows.Where(follow => (follow.FollowerId == blockerId && follow.FollowedId == blockedId) || (follow.FollowerId == blockedId && follow.FollowedId == blockerId)).ToListAsync();
        _context.UserFollows.RemoveRange(follows);
        await _context.SaveChangesAsync();
        return Ok(new { blocked = true });
    }

    [HttpDelete("users/{username}/block")]
    [Authorize]
    public async Task<IActionResult> UnblockUser(string username)
    {
        var blockedId = await _context.Users.Where(user => user.UserName == username).Select(user => user.Id).FirstOrDefaultAsync();
        if (blockedId == null) return NotFound();
        var block = await _context.UserBlocks.FindAsync(UserId, blockedId);
        if (block != null) { _context.UserBlocks.Remove(block); await _context.SaveChangesAsync(); }
        return NoContent();
    }

    [HttpGet("blocks")]
    [Authorize]
    public async Task<IActionResult> BlockedUsers()
    {
        var users = await _context.UserBlocks.Where(block => block.BlockerId == UserId)
            .Select(block => new { username = block.Blocked.UserName, fullName = block.Blocked.FullName, avatarUrl = block.Blocked.AvatarUrl, block.CreatedAt })
            .ToListAsync();
        return Ok(users);
    }

    private void AddNotification(string recipientId, string actorId, string type, string message, string? targetUrl)
    {
        if (recipientId == actorId) return;
        _context.AppNotifications.Add(new AppNotification { UserId = recipientId, ActorId = actorId, Type = type, Message = message, TargetUrl = targetUrl });
    }

    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    private static bool IsValidPostMedia(string? mediaUrl, string? mediaType)
    {
        if (string.IsNullOrWhiteSpace(mediaUrl) && string.IsNullOrWhiteSpace(mediaType)) return true;
        return Uri.TryCreate(mediaUrl, UriKind.Absolute, out var uri)
            && uri.AbsolutePath.StartsWith("/uploads/community/", StringComparison.Ordinal)
            && (mediaType == "image" || mediaType == "video");
    }

    public sealed class PostRequest { public string Content { get; set; } = string.Empty; public string? MediaUrl { get; set; } public string? MediaType { get; set; } public bool? IsDraft { get; set; } public bool? CommentsEnabled { get; set; } }
    public sealed class CommentRequest { public string Content { get; set; } = string.Empty; public Guid? ParentCommentId { get; set; } }
    public sealed class CommentsEnabledRequest { public bool Enabled { get; set; } }
    public sealed class ReportRequest { public string Reason { get; set; } = string.Empty; }
}