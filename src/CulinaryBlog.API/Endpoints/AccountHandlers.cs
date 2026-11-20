using System.Security.Claims;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using CulinaryBlog.Infrastructure.Services;
using CulinaryBlog.API.Services;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.API.Endpoints;
public class AccountHandlers : EndpointHandler
{
    private readonly ApplicationDbContext _context;
    private readonly IFileStorageService _fileStorageService;
    private readonly AccountSecurityService? _security;
    private readonly IEmailSender? _emailSender;
    private readonly IConfiguration? _configuration;

    public AccountHandlers(ApplicationDbContext context, IFileStorageService fileStorageService, AccountSecurityService? security = null, IEmailSender? emailSender = null, IConfiguration? configuration = null)
    {
        _context = context;
        _fileStorageService = fileStorageService;
        _security = security;
        _emailSender = emailSender;
        _configuration = configuration;
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
        if (!string.Equals(email, user.Email, StringComparison.OrdinalIgnoreCase))
            return BadRequest(new { message = "Để đổi email, hãy dùng phần Bảo mật và xác nhận mã gửi tới email mới." });
        if (await _context.Users.AnyAsync(other => other.Id != user.Id && other.UserName == username))
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
        await LogAsync(user.Id, "profile.updated", "Cập nhật hồ sơ cá nhân.");
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
        var sessions = await _context.RefreshTokens.Where(token => token.UserId == user.Id && !token.IsRevoked).ToListAsync();
        sessions.ForEach(token => token.Revoke());
        await _context.SaveChangesAsync();
        await LogAsync(user.Id, "password.changed", "Đổi mật khẩu và thu hồi các phiên làm mới.");
        await _context.SaveChangesAsync();
        return Ok(new { message = "Đổi mật khẩu thành công. Các phiên đăng nhập sẽ cần đăng nhập lại khi token hết hạn." });
    }

    public async Task<ApiResponseResult> SecurityOverview()
    {
        var user = await GetCurrentUser();
        if (user is null) return Unauthorized();
        var currentHash = RefreshToken.Hash(HttpContext.Request.Cookies[AuthHandlers.RefreshTokenCookieName] ?? string.Empty);
        var sessions = await _context.RefreshTokens.AsNoTracking().Where(token => token.UserId == user.Id && !token.IsRevoked && token.ExpiresAt > DateTime.UtcNow)
            .OrderByDescending(token => token.LastUsedAt ?? token.CreatedAt).Select(token => new { token.Id, token.CreatedAt, token.ExpiresAt, token.LastUsedAt, token.IpAddress, token.UserAgent, isCurrent = token.TokenHash == currentHash }).ToListAsync();
        var activities = await _context.UserActivityLogs.AsNoTracking().Where(item => item.UserId == user.Id).OrderByDescending(item => item.CreatedAt).Take(30)
            .Select(item => new { item.Id, item.ActivityType, item.Description, item.CreatedAt, item.IpAddress }).ToListAsync();
        return Ok(new { twoFactorEnabled = user.TwoFactorEnabled, hasPendingTwoFactorSetup = !user.TwoFactorEnabled && user.TwoFactorSecretProtected != null, user.LastLoginAt, user.LastLoginIp, sessions, activities });
    }

    public async Task<ApiResponseResult> SetupTwoFactor(CurrentPasswordRequest request)
    {
        var user = await GetCurrentUser();
        if (user is null) return Unauthorized();
        if (!VerifyCurrentPassword(user, request.CurrentPassword)) return BadRequest(new { message = "Mật khẩu hiện tại không chính xác." });
        if (_security is null) return StatusCode(503, new { message = "Dịch vụ bảo mật chưa được cấu hình." });
        var setup = _security.CreateSetup(user.UserName ?? user.Email ?? user.Id);
        user.TwoFactorSecretProtected = _security.ProtectSecret(setup.Secret);
        user.TwoFactorEnabled = false;
        await LogAsync(user.Id, "two_factor.setup_started", "Bắt đầu thiết lập xác thực hai lớp.");
        await _context.SaveChangesAsync();
        return Ok(new { qrCodeDataUrl = setup.QrCodeDataUrl, manualKey = setup.Secret, issuer = "Bếp Nhà", account = user.UserName ?? user.Email });
    }

    public async Task<ApiResponseResult> EnableTwoFactor(TwoFactorCodeRequest request)
    {
        var user = await GetCurrentUser();
        if (user is null) return Unauthorized();
        if (_security is null || string.IsNullOrWhiteSpace(user.TwoFactorSecretProtected)) return BadRequest(new { message = "Hãy bắt đầu thiết lập 2FA trước." });
        if (!_security.VerifyCode(user.TwoFactorSecretProtected, request.Code)) return BadRequest(new { message = "Mã xác thực không đúng hoặc đã hết hạn." });
        user.TwoFactorEnabled = true;
        await LogAsync(user.Id, "two_factor.enabled", "Bật xác thực hai lớp.");
        await _context.SaveChangesAsync();
        return Ok(new { message = "Đã bật xác thực hai lớp." });
    }

    public async Task<ApiResponseResult> DisableTwoFactor(TwoFactorDisableRequest request)
    {
        var user = await GetCurrentUser();
        if (user is null) return Unauthorized();
        if (!VerifyCurrentPassword(user, request.CurrentPassword)) return BadRequest(new { message = "Mật khẩu hiện tại không chính xác." });
        if (!user.TwoFactorEnabled || _security is null || string.IsNullOrWhiteSpace(user.TwoFactorSecretProtected) || !_security.VerifyCode(user.TwoFactorSecretProtected, request.Code))
            return BadRequest(new { message = "Mã 2FA sáu số không đúng hoặc đã hết hạn." });
        user.TwoFactorEnabled = false; user.TwoFactorSecretProtected = null;
        await LogAsync(user.Id, "two_factor.disabled", "Tắt xác thực hai lớp.");
        await _context.SaveChangesAsync();
        return Ok(new { message = "Đã tắt xác thực hai lớp." });
    }

    public async Task<ApiResponseResult> RevokeSession(Guid id)
    {
        var user = await GetCurrentUser();
        if (user is null) return Unauthorized();
        var session = await _context.RefreshTokens.FirstOrDefaultAsync(token => token.Id == id && token.UserId == user.Id);
        if (session is null) return NotFound(new { message = "Không tìm thấy phiên đăng nhập." });
        session.Revoke();
        await LogAsync(user.Id, "session.revoked", "Thu hồi một phiên đăng nhập.");
        await _context.SaveChangesAsync();
        return NoContent();
    }

    public async Task<ApiResponseResult> RevokeOtherSessions()
    {
        var user = await GetCurrentUser();
        if (user is null) return Unauthorized();
        var currentHash = RefreshToken.Hash(HttpContext.Request.Cookies[AuthHandlers.RefreshTokenCookieName] ?? string.Empty);
        var sessions = await _context.RefreshTokens.Where(token => token.UserId == user.Id && !token.IsRevoked && token.TokenHash != currentHash).ToListAsync();
        sessions.ForEach(token => token.Revoke());
        await LogAsync(user.Id, "sessions.revoked_others", $"Thu hồi {sessions.Count} phiên đăng nhập khác.");
        await _context.SaveChangesAsync();
        return Ok(new { revokedSessions = sessions.Count });
    }

    public async Task<ApiResponseResult> RequestEmailChange(EmailChangeStartRequest request)
    {
        var user = await GetCurrentUser();
        if (user is null) return Unauthorized();
        var email = request.NewEmail?.Trim();
        if (string.IsNullOrWhiteSpace(email) || !new System.ComponentModel.DataAnnotations.EmailAddressAttribute().IsValid(email)) return BadRequest(new { message = "Email mới không hợp lệ." });
        if (!VerifyCurrentPassword(user, request.CurrentPassword)) return BadRequest(new { message = "Mật khẩu hiện tại không chính xác." });
        if (string.Equals(user.Email, email, StringComparison.OrdinalIgnoreCase)) return BadRequest(new { message = "Đây đã là email hiện tại." });
        if (await _context.Users.AnyAsync(other => other.Id != user.Id && other.NormalizedEmail == email.ToUpperInvariant())) return Conflict(new { message = "Email này đã được sử dụng." });
        if (_emailSender is null || _configuration?.GetValue<bool>("Email:Enabled") != true) return StatusCode(503, new { message = "Gửi email chưa được cấu hình. Cần Email:Enabled=true và thông tin SMTP." });
        var code = AccountSecurityService.CreateEmailCode();
        _context.EmailChangeRequests.RemoveRange(await _context.EmailChangeRequests.Where(item => item.UserId == user.Id && item.ConfirmedAt == null).ToListAsync());
        _context.EmailChangeRequests.Add(new EmailChangeRequest { UserId = user.Id, NewEmail = email, CodeHash = AccountSecurityService.Hash(code), ExpiresAt = DateTime.UtcNow.AddMinutes(15) });
        await _context.SaveChangesAsync();
        try { await _emailSender.SendAsync(email, "Xác nhận đổi email Bếp Nhà", $"<p>Mã xác nhận đổi email của bạn là <strong>{code}</strong>.</p><p>Mã hết hạn sau 15 phút.</p>"); }
        catch { return StatusCode(503, new { message = "Không gửi được email xác nhận. Vui lòng thử lại sau." }); }
        await LogAsync(user.Id, "email_change.requested", $"Yêu cầu đổi email sang {email}.");
        await _context.SaveChangesAsync();
        return Ok(new { message = "Đã gửi mã xác nhận tới email mới." });
    }

    public async Task<ApiResponseResult> ConfirmEmailChange(EmailChangeConfirmRequest request)
    {
        var user = await GetCurrentUser();
        if (user is null) return Unauthorized();
        var pending = await _context.EmailChangeRequests.Where(item => item.UserId == user.Id && item.ConfirmedAt == null && item.ExpiresAt > DateTime.UtcNow).OrderByDescending(item => item.CreatedAt).FirstOrDefaultAsync();
        if (pending is null || !FixedEquals(pending.CodeHash, AccountSecurityService.Hash(request.Code ?? string.Empty))) return BadRequest(new { message = "Mã xác nhận không đúng hoặc đã hết hạn." });
        user.Email = pending.NewEmail; user.NormalizedEmail = pending.NewEmail.ToUpperInvariant(); user.EmailConfirmed = true; pending.ConfirmedAt = DateTime.UtcNow;
        var sessions = await _context.RefreshTokens.Where(token => token.UserId == user.Id && !token.IsRevoked).ToListAsync(); sessions.ForEach(token => token.Revoke());
        await LogAsync(user.Id, "email_change.confirmed", "Đã xác nhận đổi email và thu hồi phiên làm mới.");
        await _context.SaveChangesAsync();
        return Ok(new { message = "Đổi email thành công. Vui lòng đăng nhập lại.", email = user.Email });
    }

    public async Task<ApiResponseResult> DeleteAccount(DeleteAccountRequest request)
    {
        var user = await GetCurrentUser();
        if (user is null) return Unauthorized();
        if (!VerifyCurrentPassword(user, request.CurrentPassword))
            return BadRequest(new { message = "Mật khẩu hiện tại không chính xác." });
        if (!string.Equals(request.Confirmation, "XOA TAI KHOAN", StringComparison.Ordinal))
            return BadRequest(new { message = "Hãy nhập chính xác XOA TAI KHOAN để xác nhận." });

        var formerId = user.Id;
        var compactId = formerId.Replace("-", string.Empty, StringComparison.Ordinal);
        var suffix = compactId[..Math.Min(12, compactId.Length)];
        var sessions = await _context.RefreshTokens.Where(token => token.UserId == formerId && !token.IsRevoked).ToListAsync();
        sessions.ForEach(token => token.Revoke());

        user.FullName = "Tài khoản đã xóa";
        user.UserName = $"deleted-{suffix}";
        user.NormalizedUserName = user.UserName.ToUpperInvariant();
        user.Email = $"deleted-{suffix}@invalid.local";
        user.NormalizedEmail = user.Email.ToUpperInvariant();
        user.EmailConfirmed = false;
        user.PhoneNumber = null;
        user.PhoneNumberConfirmed = false;
        user.AvatarUrl = null;
        user.Bio = null;
        user.BirthDate = null;
        user.PasswordHash = Convert.ToHexString(RandomNumberGenerator.GetBytes(64));
        user.SecurityStamp = Guid.NewGuid().ToString();
        user.TwoFactorEnabled = false;
        user.TwoFactorSecretProtected = null;
        user.IsSuspended = true;
        user.SuspendedUntil = DateTime.MaxValue;
        user.SuspensionReason = "Tài khoản do người dùng tự xóa.";
        user.LastLoginIp = null;
        user.LastLoginUserAgent = null;

        _context.EmailChangeRequests.RemoveRange(_context.EmailChangeRequests.Where(item => item.UserId == formerId));
        _context.TwoFactorRecoveryCodes.RemoveRange(_context.TwoFactorRecoveryCodes.Where(item => item.UserId == formerId));
        await _context.SaveChangesAsync();
        HttpContext.Response.Cookies.Delete(AuthHandlers.RefreshTokenCookieName);
        return Ok(new { message = "Tài khoản đã được xóa và dữ liệu cá nhân đã được ẩn danh.", revokedSessions = sessions.Count });
    }

    private Task<ApplicationUser?> GetCurrentUser()
    {
        var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return id == null ? Task.FromResult<ApplicationUser?>(null) : _context.Users.FirstOrDefaultAsync(user => user.Id == id);
    }

    private bool VerifyCurrentPassword(ApplicationUser user, string? password)
    {
        if (string.IsNullOrWhiteSpace(user.PasswordHash)) return false;
        try { return new PasswordHasher<ApplicationUser>().VerifyHashedPassword(user, user.PasswordHash, password ?? string.Empty) is PasswordVerificationResult.Success or PasswordVerificationResult.SuccessRehashNeeded; }
        catch (FormatException) { return false; }
    }

    private Task LogAsync(string userId, string activityType, string description) => _security is null
        ? Task.CompletedTask
        : _security.LogAsync(_context, userId, activityType, description, HttpContext);

    private static bool FixedEquals(string left, string right) => CryptographicOperations.FixedTimeEquals(System.Text.Encoding.UTF8.GetBytes(left), System.Text.Encoding.UTF8.GetBytes(right));

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
        createdAt = user.CreatedAt,
        twoFactorEnabled = user.TwoFactorEnabled,
        lastLoginAt = user.LastLoginAt
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
    public sealed class CurrentPasswordRequest { public string CurrentPassword { get; set; } = string.Empty; }
    public sealed class TwoFactorCodeRequest { public string? Code { get; set; } }
    public sealed class TwoFactorDisableRequest { public string? CurrentPassword { get; set; } public string? Code { get; set; } }
    public sealed class EmailChangeStartRequest { public string? NewEmail { get; set; } public string? CurrentPassword { get; set; } }
    public sealed class EmailChangeConfirmRequest { public string? Code { get; set; } }
    public sealed class DeleteAccountRequest { public string? CurrentPassword { get; set; } public string? Confirmation { get; set; } }
}
