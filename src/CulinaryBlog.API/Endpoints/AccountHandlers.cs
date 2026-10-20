using System.Security.Claims;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using CulinaryBlog.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.API.Endpoints;
public class AccountHandlers : EndpointHandler
{
    private readonly ApplicationDbContext _context;
    private readonly IFileStorageService _fileStorageService;

    public AccountHandlers(ApplicationDbContext context, IFileStorageService fileStorageService)
    {
        _context = context;
        _fileStorageService = fileStorageService;
    }
    public async Task<ApiResponseResult> GetMe()
    {
        var user = await GetCurrentUser();
        return user == null ? Unauthorized() : Ok(ToProfile(user));
    }
    public async Task<ApiResponseResult> UpdateProfile(ProfileRequest request)
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
    public async Task<ApiResponseResult> UploadAvatar(IFormFile file)
    {
        var user = await GetCurrentUser();
        if (user == null) return Unauthorized();

        var validation = await ImageUploadValidationService.ValidateAsync(file);
        if (validation.Image is null) return BadRequest(new { message = validation.Error });

        var previousAvatar = user.AvatarUrl;
        var image = validation.Image;
        var fileName = $"avatars/{Guid.NewGuid():N}{image.Extension}";
        await using var stream = new MemoryStream(image.Content, writable: false);
        user.AvatarUrl = await _fileStorageService.UploadAsync(stream, fileName, image.ContentType);
        await _context.SaveChangesAsync();
        if (TryGetObjectKey(previousAvatar, out var previousKey))
            await _fileStorageService.DeleteAsync(previousKey);
        return Ok(new { avatarUrl = user.AvatarUrl, message = "Ảnh đại diện đã được cập nhật." });
    }
    public async Task<ApiResponseResult> ChangePassword(ChangePasswordRequest request)
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

    private static bool TryGetObjectKey(string? url, out string key)
    {
        key = string.Empty;
        if (string.IsNullOrWhiteSpace(url)) return false;
        var path = Uri.TryCreate(url, UriKind.Absolute, out var uri) ? uri.AbsolutePath : url;
        var segments = path.Trim('/').Split('/', StringSplitOptions.RemoveEmptyEntries);
        if (segments.Length == 0) return false;
        key = segments[0].Equals("uploads", StringComparison.OrdinalIgnoreCase)
            ? string.Join('/', segments.Skip(1))
            : string.Join('/', segments.Skip(1)); // MinIO public URLs include the bucket as their first segment.
        return key.StartsWith("avatars/", StringComparison.Ordinal);
    }

    internal static object ToProfile(ApplicationUser user) => new
    {
        id = user.Id,
        username = user.UserName,
        fullName = user.FullName,
        role = user.Role,
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
