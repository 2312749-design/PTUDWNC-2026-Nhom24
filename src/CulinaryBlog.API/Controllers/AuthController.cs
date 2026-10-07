using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Jobs;
using CulinaryBlog.Infrastructure.Persistence;
using Google.Apis.Auth;
using Hangfire;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CulinaryBlog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ITokenService _tokenService;
        private readonly IBackgroundJobClient _backgroundJobs;
        private readonly PasswordHasher<ApplicationUser> _passwordHasher = new();

        public AuthController(ApplicationDbContext context, ITokenService tokenService, IBackgroundJobClient backgroundJobs)
        {
            _context = context;
            _tokenService = tokenService;
            _backgroundJobs = backgroundJobs;
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
                // Dữ liệu hash cũ có thể không đúng định dạng Identity; fallback so login vẫn hoạt động.
            }

            return user.PasswordHash == password;
        }

        // DTOs nội bộ dùng cho Register, Login và Google Login
        public class RegisterDto
        {
            public string FullName { get; set; } = string.Empty;
            public string Username { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
            public string ConfirmPassword { get; set; } = string.Empty;
            public string CaptchaQuestion { get; set; } = string.Empty;
            public string CaptchaAnswer { get; set; } = string.Empty;
        }

        public class LoginDto
        {
            public string Email { get; set; } = string.Empty;
            public string Username { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        public class GoogleLoginDto
        {
            public string IdToken { get; set; } = string.Empty;
        }

        public class RefreshTokenDto
        {
            public string RefreshToken { get; set; } = string.Empty;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            if (string.IsNullOrWhiteSpace(model.FullName) || string.IsNullOrWhiteSpace(model.Username) || string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password))
            {
                return BadRequest(new { message = "Vui lòng điền đầy đủ thông tin." });
            }

            if (model.Password != model.ConfirmPassword)
            {
                return BadRequest(new { message = "Mật khẩu xác nhận không khớp." });
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

            if (await _context.Users.AnyAsync(u => u.Email == model.Email || u.UserName == model.Username))
            {
                return BadRequest(new { message = "Tài khoản hoặc email đã tồn tại trong hệ thống!" });
            }

            var user = new ApplicationUser
            {
                FullName = model.FullName.Trim(),
                UserName = model.Username,
                Email = model.Email,
                PasswordHash = _passwordHasher.HashPassword(new ApplicationUser(), model.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            _backgroundJobs.Enqueue<WelcomeEmailJob>(job => job.SendWelcomeEmail(model.Email));

            return Ok(new { message = "Đăng ký tài khoản thành công!" });
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var accountValue = !string.IsNullOrWhiteSpace(model.Email) ? model.Email : model.Username;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == accountValue || u.UserName == accountValue);
            if (user == null || !VerifyPassword(user, model.Password))
            {
                return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không chính xác!" });
            }

            var accessToken = _tokenService.GenerateAccessToken(user);
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
            var refreshToken = _tokenService.GenerateRefreshToken(user.Id, ipAddress);
            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Đăng nhập thành công!",
                accessToken = accessToken,
                refreshToken = refreshToken.Token,
                refreshTokenExpires = refreshToken.ExpiresAt
            });
        }

        [HttpPost("refresh")]
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
                return Unauthorized(new { code = "AUTH_REFRESH_TOKEN_EXPIRED", message = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." });
            }

            await using var transaction = await _context.Database.BeginTransactionAsync();
            var consumed = await _context.RefreshTokens
                .Where(token => token.TokenHash == tokenHash
                    && !token.IsRevoked
                    && !token.IsUsed
                    && token.ExpiresAt > DateTime.UtcNow)
                .ExecuteUpdateAsync(setters => setters.SetProperty(
                    token => token.IsUsed,
                    true));

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

            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
            var nextRefreshToken = _tokenService.GenerateRefreshToken(storedToken.UserId, ipAddress, storedToken.TokenFamilyId);
            _context.RefreshTokens.Add(nextRefreshToken);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new
            {
                accessToken = _tokenService.GenerateAccessToken(storedToken.User),
                refreshToken = nextRefreshToken.Token,
                refreshTokenExpires = nextRefreshToken.ExpiresAt
            });
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout([FromBody] RefreshTokenDto? model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();

            IQueryable<RefreshToken> tokens;
            if (!string.IsNullOrWhiteSpace(model?.RefreshToken))
            {
                var tokenHash = RefreshToken.Hash(model.RefreshToken);
                tokens = _context.RefreshTokens.Where(token =>
                    token.TokenHash == tokenHash && token.UserId == userId);
            }
            else
            {
                tokens = _context.RefreshTokens.Where(token => token.UserId == userId);
            }

            var matchingTokens = await tokens.ToListAsync();
            if (matchingTokens.Count == 0)
            {
                return NoContent();
            }

            var tokenFamilyIds = matchingTokens.Select(token => token.TokenFamilyId).Distinct().ToList();
            var familyTokens = await _context.RefreshTokens
                .Where(token => token.UserId == userId && tokenFamilyIds.Contains(token.TokenFamilyId))
                .ToListAsync();
            familyTokens.ForEach(token => token.Revoke());
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // POST: api/auth/google-login
        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto model)
        {
            try
            {
                // 1. Xác thực Google ID Token gửi từ client lên
                var settings = new GoogleJsonWebSignature.ValidationSettings();
                var payload = await GoogleJsonWebSignature.ValidateAsync(model.IdToken, settings);

                if (payload == null)
                {
                    return BadRequest(new { message = "Google Token không hợp lệ!" });
                }

                // 2. Kiểm tra xem email đã tồn tại trong database chưa
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == payload.Email);

                if (user == null)
                {
                    // Nếu chưa có, tự động tạo mới tài khoản cho người dùng đăng nhập bằng Google
                    user = new ApplicationUser
                    {
                        UserName = payload.Name ?? payload.Email.Split('@')[0],
                        Email = payload.Email,
                        PasswordHash = _passwordHasher.HashPassword(new ApplicationUser(), "GOOGLE_OAUTH_USER")
                    };

                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();
                }

                // 3. Cấp phát Access Token và Refresh Token của hệ thống
                var accessToken = _tokenService.GenerateAccessToken(user);
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
                var refreshToken = _tokenService.GenerateRefreshToken(user.Id, ipAddress);
                _context.RefreshTokens.Add(refreshToken);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Đăng nhập Google thành công!",
                    accessToken = accessToken,
                    refreshToken = refreshToken.Token,
                    refreshTokenExpires = refreshToken.ExpiresAt
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Xác thực Google thất bại!", error = ex.Message });
            }
        }
    }
}