using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Jobs;
using CulinaryBlog.Infrastructure.Persistence;
using Google.Apis.Auth;
using Hangfire;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace CulinaryBlog.API.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ITokenService _tokenService;
        private readonly IBackgroundJobClient _backgroundJobs;
        private readonly string? _googleClientId;
        private readonly PasswordHasher<ApplicationUser> _passwordHasher = new();

        public AuthController(ApplicationDbContext context, ITokenService tokenService, IBackgroundJobClient backgroundJobs, IConfiguration? configuration = null)
        {
            _context = context;
            _tokenService = tokenService;
            _backgroundJobs = backgroundJobs;
            _googleClientId = configuration?["Google:ClientId"];
        }

        private bool VerifyPassword(ApplicationUser user, string password)
        {
            if (string.IsNullOrWhiteSpace(user.PasswordHash))
            {
                return false;
            }

            try
            {
                var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
                if (result == PasswordVerificationResult.Success || result == PasswordVerificationResult.SuccessRehashNeeded)
                {
                    return true;
                }
            }
            catch (FormatException)
            {
                return false;
            }

            return false;
        }

        private static bool IsStrongPassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password) || password.Length < 8)
            {
                return false;
            }

            return password.Any(char.IsUpper) &&
                   password.Any(char.IsLower) &&
                   password.Any(char.IsDigit) &&
                   password.Any(ch => !char.IsLetterOrDigit(ch));
        }

        private async Task<object> CreateTokenBundleAsync(ApplicationUser user)
        {
            var accessToken = _tokenService.GenerateAccessToken(user);
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
            var refreshToken = _tokenService.GenerateRefreshToken(user.Id, ipAddress);

            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync();

            return new
            {
                accessToken,
                refreshToken = refreshToken.Token,
                expiresAt = refreshToken.ExpiresAt,
                user = new
                {
                    id = user.Id,
                    email = user.Email,
                    displayName = user.FullName,
                    username = user.UserName,
                    avatarUrl = user.AvatarUrl,
                    bio = user.Bio
                }
            };
        }

        public class RegisterDto
        {
            [StringLength(100)]
            public string? DisplayName { get; set; }
            [StringLength(100)]
            public string? FullName { get; set; }
            [StringLength(50)]
            public string? Username { get; set; }
            [Required]
            [EmailAddress]
            [StringLength(254)]
            public string? Email { get; set; }
            [Required]
            [StringLength(128, MinimumLength = 8)]
            public string? Password { get; set; }
            [Required]
            [Compare(nameof(Password))]
            public string? ConfirmPassword { get; set; }
            [StringLength(30)]
            public string? CaptchaQuestion { get; set; }
            [StringLength(10)]
            public string? CaptchaAnswer { get; set; }
        }

        public class LoginDto
        {
            public string? Email { get; set; }
            [StringLength(50)]
            public string? Username { get; set; }
            [Required]
            [StringLength(128)]
            public string? Password { get; set; }
        }

        public class MeUpdateDto
        {
            [StringLength(100)]
            public string? DisplayName { get; set; }
            [Url]
            [StringLength(2048)]
            public string? AvatarUrl { get; set; }
            [StringLength(500)]
            public string? Bio { get; set; }
        }

        public class GoogleLoginDto
        {
            [Required]
            public string IdToken { get; set; } = string.Empty;
        }

        public class RefreshTokenDto
        {
            public string? RefreshToken { get; set; }
        }

        [HttpPost("register")]
        [HttpPost("signup")]
        [EnableRateLimiting("registration")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            if (model == null)
            {
                return BadRequest(new { message = "Dữ liệu đăng ký không hợp lệ." });
            }

            var displayName = (model.DisplayName ?? model.FullName ?? string.Empty).Trim();
            var email = (model.Email ?? string.Empty).Trim();
            var normalizedEmail = email.ToUpperInvariant();
            var username = string.IsNullOrWhiteSpace(model.Username) ? email.Split('@')[0] : model.Username.Trim();
            var normalizedUsername = username.ToUpperInvariant();
            var password = model.Password ?? string.Empty;
            var confirmPassword = model.ConfirmPassword ?? string.Empty;

            if (string.IsNullOrWhiteSpace(displayName) || string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            {
                return BadRequest(new { message = "Vui lòng điền đầy đủ thông tin." });
            }

            if (!string.Equals(password, confirmPassword, StringComparison.Ordinal))
            {
                return BadRequest(new { message = "Mật khẩu xác nhận không khớp." });
            }

            if (!IsStrongPassword(password))
            {
                return BadRequest(new { message = "Mật khẩu phải tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt." });
            }

            if (!string.IsNullOrWhiteSpace(model.CaptchaQuestion) && !string.IsNullOrWhiteSpace(model.CaptchaAnswer))
            {
                var parts = model.CaptchaQuestion.Split('+', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);
                if (parts.Length == 2 && int.TryParse(parts[0], out var left) && int.TryParse(parts[1], out var right))
                {
                    if (int.TryParse(model.CaptchaAnswer, out var answer) && answer != left + right)
                    {
                        return BadRequest(new { message = "Xác minh người thật không đúng. Vui lòng làm lại." });
                    }
                }
            }

            if (string.IsNullOrWhiteSpace(displayName))
            {
                return BadRequest(new { message = "Tên hiển thị không được để trống." });
            }

            if (await _context.Users.AnyAsync(u =>
                u.NormalizedEmail == normalizedEmail ||
                u.NormalizedUserName == normalizedUsername ||
                (u.Email != null && u.Email.ToUpper() == normalizedEmail) ||
                (u.UserName != null && u.UserName.ToUpper() == normalizedUsername)))
            {
                return BadRequest(new { message = "Tài khoản hoặc email đã tồn tại trong hệ thống!" });
            }

            var user = new ApplicationUser
            {
                FullName = displayName,
                UserName = username,
                Email = email,
                NormalizedUserName = normalizedUsername,
                NormalizedEmail = normalizedEmail
            };
            user.PasswordHash = _passwordHasher.HashPassword(user, password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            _backgroundJobs.Enqueue<WelcomeEmailJob>(job => job.SendWelcomeEmail(email));

            var tokenBundle = await CreateTokenBundleAsync(user);
            return Ok(new
            {
                message = "Đăng ký tài khoản thành công!",
                data = tokenBundle
            });
        }

        [HttpPost("login")]
        [EnableRateLimiting("auth")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            if (model == null)
            {
                return BadRequest(new { message = "Dữ liệu đăng nhập không hợp lệ." });
            }

            var accountValue = (!string.IsNullOrWhiteSpace(model.Email) ? model.Email : model.Username)?.Trim();
            if (string.IsNullOrWhiteSpace(accountValue))
            {
                return BadRequest(new { message = "Vui lòng nhập tên đăng nhập hoặc email." });
            }

            var normalizedAccount = accountValue.ToUpperInvariant();
            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.NormalizedEmail == normalizedAccount ||
                u.NormalizedUserName == normalizedAccount ||
                (u.Email != null && u.Email.ToUpper() == normalizedAccount) ||
                (u.UserName != null && u.UserName.ToUpper() == normalizedAccount));
            if (user == null || !VerifyPassword(user, model.Password ?? string.Empty))
            {
                return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không chính xác!" });
            }

            user.NormalizedEmail ??= user.Email?.ToUpperInvariant();
            user.NormalizedUserName ??= user.UserName?.ToUpperInvariant();

            var tokenBundle = await CreateTokenBundleAsync(user);
            return Ok(new
            {
                message = "Đăng nhập thành công!",
                data = tokenBundle
            });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(new { message = "Phiên đăng nhập không hợp lệ." });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return NotFound(new { message = "Không tìm thấy người dùng." });
            }

            return Ok(new
            {
                data = new
                {
                    id = user.Id,
                    email = user.Email,
                    displayName = user.FullName,
                    username = user.UserName,
                    avatarUrl = user.AvatarUrl,
                    bio = user.Bio,
                    createdAt = user.CreatedAt
                }
            });
        }

        [HttpPatch("me")]
        [Authorize]
        public async Task<IActionResult> UpdateCurrentUser([FromBody] MeUpdateDto model)
        {
            if (model == null)
            {
                return BadRequest(new { message = "Dữ liệu cập nhật không hợp lệ." });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(new { message = "Phiên đăng nhập không hợp lệ." });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return NotFound(new { message = "Không tìm thấy người dùng." });
            }

            if (!string.IsNullOrWhiteSpace(model.DisplayName))
            {
                user.FullName = model.DisplayName.Trim();
            }

            if (model.AvatarUrl != null)
            {
                user.AvatarUrl = string.IsNullOrWhiteSpace(model.AvatarUrl) ? null : model.AvatarUrl.Trim();
            }

            if (model.Bio != null)
            {
                user.Bio = string.IsNullOrWhiteSpace(model.Bio) ? null : model.Bio.Trim();
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cập nhật hồ sơ thành công!",
                data = new
                {
                    id = user.Id,
                    email = user.Email,
                    displayName = user.FullName,
                    username = user.UserName,
                    avatarUrl = user.AvatarUrl,
                    bio = user.Bio
                }
            });
        }

        [HttpPost("refresh")]
        [EnableRateLimiting("auth")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenDto model)
        {
            if (string.IsNullOrWhiteSpace(model.RefreshToken))
            {
                return BadRequest(new { message = "Refresh token không được để trống." });
            }

            var tokenHash = RefreshToken.Hash(model.RefreshToken);
            var storedToken = await _context.RefreshTokens
                .Include(token => token.User)
                .FirstOrDefaultAsync(token => token.TokenHash == tokenHash);

            if (storedToken == null)
            {
                return Unauthorized(new { message = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." });
            }

            if (storedToken.ExpiresAt <= DateTime.UtcNow || storedToken.User == null)
            {
                storedToken.Revoke();
                await _context.SaveChangesAsync();
                return Unauthorized(new { code = "AUTH_REFRESH_TOKEN_EXPIRED", message = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." });
            }

            await using var transaction = await _context.Database.BeginTransactionAsync();
            var consumed = await _context.RefreshTokens
                .Where(token => token.TokenHash == tokenHash
                    && !token.IsRevoked
                    && !token.IsUsed
                    && token.ExpiresAt > DateTime.UtcNow)
                .ExecuteUpdateAsync(setters => setters.SetProperty(token => token.IsUsed, true));

            if (consumed == 0)
            {
                var familyTokens = await _context.RefreshTokens
                    .Where(token => token.UserId == storedToken.UserId && token.TokenFamilyId == storedToken.TokenFamilyId)
                    .ToListAsync();
                familyTokens.ForEach(token => token.Revoke());
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return Unauthorized(new { code = "AUTH_REFRESH_TOKEN_REPLAYED", message = "Phiên đăng nhập đã bị thu hồi do sử dụng lại token." });
            }

            storedToken.MarkUsed();
            storedToken.Revoke();
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
            var nextRefreshToken = _tokenService.GenerateRefreshToken(storedToken.UserId, ipAddress, storedToken.TokenFamilyId);
            _context.RefreshTokens.Add(nextRefreshToken);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            var refreshedAccessToken = _tokenService.GenerateAccessToken(storedToken.User);
            return Ok(new
            {
                message = "Làm mới token thành công!",
                data = new
                {
                    accessToken = refreshedAccessToken,
                    refreshToken = nextRefreshToken.Token,
                    expiresAt = nextRefreshToken.ExpiresAt,
                    user = new
                    {
                        id = storedToken.User.Id,
                        email = storedToken.User.Email,
                        displayName = storedToken.User.FullName,
                        username = storedToken.User.UserName
                    }
                }
            });
        }

        [HttpPost("logout")]
        [AllowAnonymous]
        public async Task<IActionResult> Logout([FromBody] RefreshTokenDto? model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            IQueryable<RefreshToken> tokens;
            if (!string.IsNullOrWhiteSpace(model?.RefreshToken))
            {
                var tokenHash = RefreshToken.Hash(model.RefreshToken);
                tokens = _context.RefreshTokens.Where(token => token.TokenHash == tokenHash &&
                    (userId == null || token.UserId == userId));
            }
            else
            {
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Unauthorized(new { message = "Cần access token hoặc refresh token để đăng xuất." });
                }
                tokens = _context.RefreshTokens.Where(token => token.UserId == userId);
            }

            var matchingTokens = await tokens.ToListAsync();
            if (matchingTokens.Count == 0)
            {
                return NoContent();
            }

            var tokenFamilyIds = matchingTokens.Select(token => token.TokenFamilyId).Distinct().ToList();
            var sessionUserId = matchingTokens[0].UserId;
            var familyTokens = await _context.RefreshTokens
                .Where(token => token.UserId == sessionUserId && tokenFamilyIds.Contains(token.TokenFamilyId))
                .ToListAsync();
            familyTokens.ForEach(token => token.Revoke());
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("google")]
        [HttpPost("google-login")]
        [EnableRateLimiting("auth")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto model)
        {
            if (string.IsNullOrWhiteSpace(_googleClientId))
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, new { message = "Google OAuth chưa được cấu hình." });
            }

            if (string.IsNullOrWhiteSpace(model.IdToken))
            {
                return BadRequest(new { message = "Google ID Token không hợp lệ." });
            }

            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = [_googleClientId]
                };
                var payload = await GoogleJsonWebSignature.ValidateAsync(model.IdToken, settings);

                if (payload == null || payload.EmailVerified != true || string.IsNullOrWhiteSpace(payload.Email))
                {
                    return Unauthorized(new { message = "Google token không hợp lệ hoặc email chưa được xác minh." });
                }

                var email = payload.Email.Trim();
                var normalizedEmail = email.ToUpperInvariant();
                var user = await _context.Users.FirstOrDefaultAsync(u =>
                    u.NormalizedEmail == normalizedEmail || (u.Email != null && u.Email.ToUpper() == normalizedEmail));

                if (user == null)
                {
                    var username = email.Split('@')[0];
                    if (await _context.Users.AnyAsync(existing => existing.NormalizedUserName == username.ToUpperInvariant()))
                    {
                        username = $"{username}-{Guid.NewGuid():N}"[..Math.Min(username.Length + 9, username.Length + 33)];
                    }

                    user = new ApplicationUser
                    {
                        FullName = string.IsNullOrWhiteSpace(payload.Name) ? username : payload.Name.Trim(),
                        UserName = username,
                        NormalizedUserName = username.ToUpperInvariant(),
                        Email = email,
                        NormalizedEmail = normalizedEmail,
                        EmailConfirmed = true,
                        PasswordHash = _passwordHasher.HashPassword(new ApplicationUser(), Guid.NewGuid().ToString("N"))
                    };

                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();
                }

                var tokenBundle = await CreateTokenBundleAsync(user);
                return Ok(new
                {
                    message = "Đăng nhập Google thành công!",
                    data = tokenBundle
                });
            }
            catch
            {
                return Unauthorized(new { message = "Xác thực Google thất bại." });
            }
        }
    }
}