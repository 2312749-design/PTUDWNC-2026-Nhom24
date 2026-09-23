using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ITokenService _tokenService;
        private readonly PasswordHasher<ApplicationUser> _passwordHasher = new();

        public AuthController(ApplicationDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        private bool VerifyPassword(ApplicationUser user, string password)
        {
            if (string.IsNullOrWhiteSpace(user.PasswordHash))
            {
                return false;
            }

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
            if (result == PasswordVerificationResult.Success || result == PasswordVerificationResult.SuccessRehashNeeded)
            {
                return true;
            }

            return user.PasswordHash == password;
        }

        // DTOs nội bộ dùng cho Register, Login và Google Login
        public class RegisterDto
        {
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

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            if (string.IsNullOrWhiteSpace(model.Username) || string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password))
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
                UserName = model.Username,
                Email = model.Email,
                PasswordHash = _passwordHasher.HashPassword(new ApplicationUser(), model.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

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
            var refreshToken = _tokenService.GenerateRefreshToken(ipAddress);

            return Ok(new
            {
                message = "Đăng nhập thành công!",
                accessToken = accessToken,
                refreshToken = refreshToken.Token,
                refreshTokenExpires = refreshToken.ExpiresAt
            });
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
                var refreshToken = _tokenService.GenerateRefreshToken(ipAddress);

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