using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Jobs;
using CulinaryBlog.Infrastructure.Persistence;
using CulinaryBlog.Infrastructure.Services;
using Google.Apis.Auth;
using Hangfire;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace CulinaryBlog.API.Endpoints
{
    public class AuthHandlers : EndpointHandler
    {
        private readonly ApplicationDbContext _context;
        private readonly ITokenService _tokenService;
        private readonly IBackgroundJobClient _backgroundJobs;
        private readonly string? _googleClientId;
        private readonly IGoogleIdentityVerifier _googleVerifier;
        private readonly PasswordHasher<ApplicationUser> _passwordHasher = new();

        public AuthHandlers(ApplicationDbContext context, ITokenService tokenService, IBackgroundJobClient backgroundJobs, IConfiguration? configuration = null, IGoogleIdentityVerifier? googleVerifier = null)
        {
            _context = context;
            _tokenService = tokenService;
            _backgroundJobs = backgroundJobs;
            _googleClientId = configuration?["Google:ClientId"];
            _googleVerifier = googleVerifier ?? new GoogleIdentityVerifier();
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
                    role = user.Role,
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
            [Url, StringLength(2048)]
            public string? AvatarUrl { get; set; }
            [StringLength(500)]
            public string? Bio { get; set; }
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
            [StringLength(254)]
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
            [Required, StringLength(16384)]
            public string IdToken { get; set; } = string.Empty;
        }

        public class RefreshTokenDto
        {
            [StringLength(1024)]
            public string? RefreshToken { get; set; }
        }
        public async Task<ApiResponseResult> Register([FromBody] RegisterDto model)
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

            if (username.Length > 50 || username.Any(char.IsWhiteSpace))
                return BadRequest(new { message = "Tên đăng nhập tối đa 50 ký tự và không chứa khoảng trắng.", errors = new { username = new[] { "Tên đăng nhập không hợp lệ." } } });

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
                AvatarUrl = string.IsNullOrWhiteSpace(model.AvatarUrl) ? null : model.AvatarUrl.Trim(),
                Bio = string.IsNullOrWhiteSpace(model.Bio) ? null : model.Bio.Trim(),
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
        public async Task<ApiResponseResult> Login([FromBody] LoginDto model)
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
        public async Task<ApiResponseResult> GetCurrentUser()
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
                    role = user.Role,
                    username = user.UserName,
                    avatarUrl = user.AvatarUrl,
                    bio = user.Bio,
                    createdAt = user.CreatedAt
                }
            });
        }
        public async Task<ApiResponseResult> UpdateCurrentUser([FromBody] MeUpdateDto model)
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

            if (model.DisplayName is not null && string.IsNullOrWhiteSpace(model.DisplayName))
                return BadRequest(new { message = "Tên hiển thị không được để trống.", errors = new { displayName = new[] { "Tên hiển thị không được để trống." } } });

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
                    role = user.Role,
                    username = user.UserName,
                    avatarUrl = user.AvatarUrl,
                    bio = user.Bio
                }
            });
        }
        public async Task<ApiResponseResult> Refresh([FromBody] RefreshTokenDto model)
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

            if ((storedToken.ExpiresAt <= DateTime.UtcNow && !storedToken.IsUsed && !storedToken.IsRevoked) || storedToken.User == null)
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
                        role = storedToken.User.Role,
                        username = storedToken.User.UserName
                    }
                }
            });
        }
        public async Task<ApiResponseResult> Logout([FromBody] RefreshTokenDto? model)
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
        public async Task<ApiResponseResult> GoogleLogin([FromBody] GoogleLoginDto model)
        {
            if (string.IsNullOrWhiteSpace(_googleClientId))
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, new { message = "Google OAuth chưa được cấu hình." });
            }

            if (string.IsNullOrWhiteSpace(model.IdToken))
            {
                return BadRequest(new { message = "Google ID Token không hợp lệ." });
            }

            GoogleIdentity identity;
            try
            {
                identity = await _googleVerifier.VerifyAsync(model.IdToken, _googleClientId);
            }
            catch (Google.Apis.Auth.InvalidJwtException)
            {
                return Unauthorized(new { code = "AUTH_GOOGLE_INVALID_TOKEN", message = "Xác thực Google thất bại." });
            }
            catch (HttpRequestException)
            {
                return StatusCode(503, new { message = "Không thể kết nối dịch vụ xác thực Google. Vui lòng thử lại." });
            }

            if (!identity.EmailVerified || string.IsNullOrWhiteSpace(identity.Subject) ||
                !new EmailAddressAttribute().IsValid(identity.Email) || identity.Email.Length > 254)
                return Unauthorized(new { code = "AUTH_GOOGLE_UNVERIFIED", message = "Google token không hợp lệ hoặc email chưa được xác minh." });

            // Google's stable subject identifies an account even if its email changes.
            var linkedLogin = await _context.UserLogins.SingleOrDefaultAsync(login =>
                login.LoginProvider == "Google" && login.ProviderKey == identity.Subject);
            ApplicationUser? user;
            if (linkedLogin is not null)
            {
                user = await _context.Users.FindAsync(linkedLogin.UserId);
                if (user is null) return Unauthorized(new { message = "Tài khoản liên kết không còn tồn tại." });
            }
            else
            {
                var email = identity.Email.Trim();
                var normalizedEmail = email.ToUpperInvariant();
                user = await _context.Users.FirstOrDefaultAsync(u => u.NormalizedEmail == normalizedEmail ||
                    (u.Email != null && u.Email.ToUpper() == normalizedEmail));
                if (user is not null)
                {
                    var authoritative = email.EndsWith("@gmail.com", StringComparison.OrdinalIgnoreCase) ||
                        !string.IsNullOrWhiteSpace(identity.HostedDomain);
                    var authenticatedOwner = User.Identity?.IsAuthenticated == true && User.FindFirstValue(ClaimTypes.NameIdentifier) == user.Id;
                    if (!authoritative && !authenticatedOwner)
                        return Conflict(new { code = "AUTH_GOOGLE_LINK_REQUIRED", message = "Hãy đăng nhập tài khoản hiện có trước khi liên kết Google với email này." });
                    if (await _context.UserLogins.AnyAsync(login => login.LoginProvider == "Google" && login.UserId == user.Id))
                        return Conflict(new { code = "AUTH_GOOGLE_ALREADY_LINKED", message = "Tài khoản đã liên kết với một tài khoản Google khác." });
                }
                else
                {
                    var username = email.Split('@')[0];
                    username = username[..Math.Min(username.Length, 40)];
                    while (await _context.Users.AnyAsync(existing => existing.NormalizedUserName == username.ToUpperInvariant() ||
                        (existing.UserName != null && existing.UserName.ToUpper() == username.ToUpperInvariant())))
                        username = $"{username[..Math.Min(username.Length, 40)]}-{Guid.NewGuid().ToString("N")[..8]}";
                    user = new ApplicationUser
                    {
                        FullName = string.IsNullOrWhiteSpace(identity.Name) ? username : identity.Name.Trim()[..Math.Min(identity.Name.Trim().Length, 100)],
                        UserName = username,
                        NormalizedUserName = username.ToUpperInvariant(),
                        Email = email,
                        NormalizedEmail = normalizedEmail,
                        EmailConfirmed = true,
                        AvatarUrl = Uri.TryCreate(identity.Picture, UriKind.Absolute, out var picture) && picture.Scheme == "https" ? picture.AbsoluteUri : null
                    };
                    _context.Users.Add(user);
                }
                _context.UserLogins.Add(new IdentityUserLogin<string>
                {
                    LoginProvider = "Google", ProviderKey = identity.Subject, ProviderDisplayName = "Google", UserId = user.Id
                });
                await _context.SaveChangesAsync();
            }
            return Ok(new { data = await CreateTokenBundleAsync(user) });
        }
    }
}
