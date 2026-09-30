using System.Security.Claims;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.API.Controllers;

[Route("api/account")]
[ApiController]
[Authorize]
public class AccountController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _environment;

    public AccountController(ApplicationDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var user = await GetCurrentUser();
        return user == null ? Unauthorized() : Ok(ToProfile(user));
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile(ProfileRequest request)
    {
        var user = await GetCurrentUser();
        if (user == null) return Unauthorized();
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.FullName) || string.IsNullOrWhiteSpace(request.Email))
            return BadRequest(new { message = "Tên hiển thị, username và email là bắt buộc." });

        var username = request.Username.Trim();
        var email = request.Email.Trim();
        if (await _context.Users.AnyAsync(other => other.Id != user.Id && (other.UserName == username || other.Email == email)))
            return Conflict(new { message = "Username hoặc email đã được sử dụng." });

        user.UserName = username;
        user.NormalizedUserName = username.ToUpperInvariant();
        user.Email = email;
        user.NormalizedEmail = email.ToUpperInvariant();
        user.FullName = request.FullName.Trim();
        user.PhoneNumber = string.IsNullOrWhiteSpace(request.PhoneNumber) ? null : request.PhoneNumber.Trim();
        user.BirthDate = request.BirthDate.HasValue
            ? DateTime.SpecifyKind(request.BirthDate.Value.Date, DateTimeKind.Utc)
            : null;
        user.AvatarUrl = string.IsNullOrWhiteSpace(request.AvatarUrl) ? null : request.AvatarUrl.Trim();
        user.Bio = string.IsNullOrWhiteSpace(request.Bio) ? null : request.Bio.Trim();
        await _context.SaveChangesAsync();
        return Ok(ToProfile(user));
    }

    [HttpPost("avatar")]
    [RequestSizeLimit(5 * 1024 * 1024)]
    public async Task<IActionResult> UploadAvatar(IFormFile file)
    {
        if (file == null || file.Length == 0 || file.Length > 5 * 1024 * 1024)
            return BadRequest(new { message = "Ảnh đại diện phải nhỏ hơn 5 MB." });

        var extension = file.ContentType.ToLowerInvariant() switch
        {
            "image/jpeg" => ".jpg",
            "image/png" => ".png",
            "image/webp" => ".webp",
            "image/gif" => ".gif",
            _ => null
        };
        if (extension == null)
            return BadRequest(new { message = "Chỉ hỗ trợ ảnh JPG, PNG, WebP hoặc GIF." });

        var user = await GetCurrentUser();
        if (user == null) return Unauthorized();

        var webRoot = _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");
        var uploadFolder = Path.Combine(webRoot, "uploads", "avatars");
        Directory.CreateDirectory(uploadFolder);
        var fileName = $"{Guid.NewGuid():N}{extension}";
        await using (var stream = new FileStream(Path.Combine(uploadFolder, fileName), FileMode.CreateNew))
        {
            await file.CopyToAsync(stream);
        }

        user.AvatarUrl = $"{Request.Scheme}://{Request.Host}/uploads/avatars/{fileName}";
        await _context.SaveChangesAsync();
        return Ok(new { avatarUrl = user.AvatarUrl, message = "Ảnh đại diện đã được cập nhật." });
    }

    [HttpPut("password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 8)
            return BadRequest(new { message = "Mật khẩu mới cần có ít nhất 8 ký tự." });
        var user = await GetCurrentUser();
        if (user == null) return Unauthorized();

        var hasher = new PasswordHasher<ApplicationUser>();
        var check = hasher.VerifyHashedPassword(user, user.PasswordHash ?? string.Empty, request.CurrentPassword ?? string.Empty);
        if (check == PasswordVerificationResult.Failed && user.PasswordHash != request.CurrentPassword)
            return BadRequest(new { message = "Mật khẩu hiện tại không chính xác." });

        user.PasswordHash = hasher.HashPassword(user, request.NewPassword);
        user.SecurityStamp = Guid.NewGuid().ToString();
        await _context.SaveChangesAsync();
        return Ok(new { message = "Đổi mật khẩu thành công. Hãy đăng nhập lại trên các thiết bị khác." });
    }

    private Task<ApplicationUser?> GetCurrentUser()
    {
        var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return id == null ? Task.FromResult<ApplicationUser?>(null) : _context.Users.FirstOrDefaultAsync(user => user.Id == id);
    }

    internal static object ToProfile(ApplicationUser user) => new
    {
        id = user.Id,
        username = user.UserName,
        fullName = user.FullName,
        email = user.Email,
        phoneNumber = user.PhoneNumber,
        birthDate = user.BirthDate,
        avatarUrl = user.AvatarUrl,
        bio = user.Bio,
        createdAt = user.CreatedAt
    };

    public sealed class ProfileRequest
    {
        public string Username { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? AvatarUrl { get; set; }
        public string? Bio { get; set; }
    }

    public sealed class ChangePasswordRequest
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}