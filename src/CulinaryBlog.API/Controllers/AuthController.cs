using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Google.Apis.Auth;
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

        public AuthController(ApplicationDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        // DTOs nội bộ dùng cho Register, Login và Google Login
        public class RegisterDto
        {
            public string Username { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        public class LoginDto
        {
            public string Email { get; set; } = string.Empty;
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
            if (await _context.Users.AnyAsync(u => u.Email == model.Email))
            {
                return BadRequest(new { message = "Email đã tồn tại trong hệ thống!" });
            }

            var user = new ApplicationUser
            {
                UserName = model.Username,
                Email = model.Email,
                PasswordHash = model.Password
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký tài khoản thành công!" });
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (user == null || user.PasswordHash != model.Password)
            {
                return Unauthorized(new { message = "Email hoặc mật khẩu không chính xác!" });
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
                        PasswordHash = "GOOGLE_OAUTH_USER" // Đánh dấu đây là tài khoản đăng nhập qua Google
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