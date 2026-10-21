using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Security.Claims;
using System.Text;
using CulinaryBlog.Api.Endpoints.Requests;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Exceptions;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace CulinaryBlog.Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(
        this RouteGroupBuilder apiV1,
        string issuer,
        string audience,
        string signingKey,
        int tokenLifetimeMinutes)
    {
        var auth = apiV1.MapGroup("/auth")
            .WithTags("Authentication")
            .RequireRateLimiting("auth");

        auth.MapPost("/register", async (
            RegisterRequest request,
            ApplicationDbContext dbContext,
            IPasswordHasher<BlogUser> passwordHasher,
            CancellationToken cancellationToken) =>
        {
            var email = request.Email?.Trim().ToLowerInvariant() ?? string.Empty;
            var displayName = request.DisplayName?.Trim() ?? string.Empty;
            var password = request.Password ?? string.Empty;
            if (!new System.ComponentModel.DataAnnotations.EmailAddressAttribute().IsValid(email) ||
                email.Length > 320 ||
                displayName.Length is < 1 or > 100 ||
                password.Length is < 8 or > 128)
            {
                return Results.BadRequest(new
                {
                    message = "Email, tên hiển thị hoặc mật khẩu không hợp lệ."
                });
            }

            if (await dbContext.BlogUsers.AnyAsync(
                    user => user.Email == email,
                    cancellationToken))
            {
                return Results.Conflict(new { message = "Email đã được sử dụng." });
            }

            var user = new BlogUser
            {
                Id = Guid.NewGuid(),
                Email = email,
                DisplayName = displayName,
                Role = "Author"
            };
            user.PasswordHash = passwordHasher.HashPassword(user, password);
            dbContext.BlogUsers.Add(user);
            await dbContext.SaveChangesAsync(cancellationToken);

            return Results.Ok(CreateAuthResponse(
                user,
                issuer,
                audience,
                signingKey,
                tokenLifetimeMinutes));
        })
        .AllowAnonymous()
        .WithSummary("Register an author account");

        auth.MapPost("/login", async (
            LoginRequest request,
            ApplicationDbContext dbContext,
            IPasswordHasher<BlogUser> passwordHasher,
            CancellationToken cancellationToken) =>
        {
            var email = request.Email?.Trim().ToLowerInvariant() ?? string.Empty;
            var password = request.Password ?? string.Empty;
            var user = await dbContext.BlogUsers.SingleOrDefaultAsync(
                account => account.Email == email,
                cancellationToken);
            if (user is null ||
                passwordHasher.VerifyHashedPassword(
                    user,
                    user.PasswordHash,
                    password) == PasswordVerificationResult.Failed)
            {
                return Results.Unauthorized();
            }

            return Results.Ok(CreateAuthResponse(
                user,
                issuer,
                audience,
                signingKey,
                tokenLifetimeMinutes));
        })
        .AllowAnonymous()
        .WithSummary("Sign in and receive a bearer token");

        auth.MapGet("/profile", async (
            ClaimsPrincipal principal,
            ApplicationDbContext dbContext,
            CancellationToken cancellationToken) =>
        {
            var user = await GetUserAsync(principal, dbContext, cancellationToken);
            return Results.Ok(new { data = ToProfile(user) });
        }).RequireAuthorization("Author");

        auth.MapPut("/profile", async (
            UpdateProfileRequest request,
            ClaimsPrincipal principal,
            ApplicationDbContext dbContext,
            CancellationToken cancellationToken) =>
        {
            var user = await GetUserAsync(
                principal,
                dbContext,
                cancellationToken,
                trackChanges: true);
            var displayName = request.DisplayName?.Trim() ?? string.Empty;
            var bio = request.Bio?.Trim() ?? string.Empty;
            var avatarUrl = request.AvatarUrl?.Trim();
            if (displayName.Length is < 1 or > 100 ||
                bio.Length > 500 ||
                (avatarUrl is not null &&
                 (avatarUrl.Length > 500 ||
                  !Uri.TryCreate(avatarUrl, UriKind.Absolute, out var avatarUri) ||
                  avatarUri.Scheme is not ("http" or "https"))))
            {
                return Results.BadRequest(new { message = "Thông tin hồ sơ không hợp lệ." });
            }

            user.DisplayName = displayName;
            user.Bio = bio;
            user.AvatarUrl = string.IsNullOrEmpty(avatarUrl) ? null : avatarUrl;
            await dbContext.SaveChangesAsync(cancellationToken);
            return Results.Ok(new { data = ToProfile(user) });
        }).RequireAuthorization("Author");

        auth.MapPost("/change-password", async (
            ChangePasswordRequest request,
            ClaimsPrincipal principal,
            ApplicationDbContext dbContext,
            IPasswordHasher<BlogUser> passwordHasher,
            CancellationToken cancellationToken) =>
        {
            var user = await GetUserAsync(
                principal,
                dbContext,
                cancellationToken,
                trackChanges: true);
            if (string.IsNullOrEmpty(request.CurrentPassword) ||
                passwordHasher.VerifyHashedPassword(
                    user,
                    user.PasswordHash,
                    request.CurrentPassword) == PasswordVerificationResult.Failed)
            {
                return Results.BadRequest(new { message = "Mật khẩu hiện tại không chính xác." });
            }

            if (request.NewPassword is null ||
                request.NewPassword.Length is < 8 or > 128)
            {
                return Results.BadRequest(new { message = "Mật khẩu mới phải có từ 8 đến 128 ký tự." });
            }

            user.PasswordHash = passwordHasher.HashPassword(user, request.NewPassword);
            await dbContext.PasswordResetTokens
                .Where(token => token.UserId == user.Id)
                .ExecuteDeleteAsync(cancellationToken);
            await dbContext.SaveChangesAsync(cancellationToken);
            return Results.Ok(new { message = "Đổi mật khẩu thành công." });
        }).RequireAuthorization("Author");

        auth.MapPost("/forgot-password", async (
            ForgotPasswordRequest request,
            ApplicationDbContext dbContext,
            CulinaryBlog.Api.Services.SmtpEmailSender emailSender,
            IConfiguration configuration,
            CancellationToken cancellationToken) =>
        {
            var email = request.Email?.Trim().ToLowerInvariant() ?? string.Empty;
            var user = await dbContext.BlogUsers.SingleOrDefaultAsync(
                account => account.Email == email,
                cancellationToken);
            if (user is not null)
            {
                await dbContext.PasswordResetTokens
                    .Where(token => token.UserId == user.Id)
                    .ExecuteDeleteAsync(cancellationToken);

                var token = WebEncoders.Base64UrlEncode(
                    RandomNumberGenerator.GetBytes(32));
                var tokenHash = Convert.ToHexString(
                    SHA256.HashData(Encoding.UTF8.GetBytes(token)));
                dbContext.PasswordResetTokens.Add(new PasswordResetToken
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    TokenHash = tokenHash,
                    ExpiresAt = DateTime.UtcNow.AddMinutes(30)
                });
                await dbContext.SaveChangesAsync(cancellationToken);

                var frontendBaseUrl = configuration["Frontend:BaseUrl"];
                if (!Uri.TryCreate(frontendBaseUrl, UriKind.Absolute, out var frontendUri) ||
                    frontendUri.Scheme is not ("http" or "https"))
                {
                    throw new InvalidOperationException(
                        "Configure Frontend:BaseUrl with the public frontend URL.");
                }

                var resetUrl = $"{frontendUri.ToString().TrimEnd('/')}/reset-password" +
                    $"?email={Uri.EscapeDataString(email)}&token={Uri.EscapeDataString(token)}";
                await emailSender.SendPasswordResetAsync(
                    email,
                    resetUrl,
                    cancellationToken);
            }

            return Results.Ok(new
            {
                message = "Nếu email tồn tại, hướng dẫn đặt lại mật khẩu sẽ được gửi."
            });
        })
        .AllowAnonymous()
        .WithSummary("Send a password reset link");

        auth.MapPost("/reset-password", async (
            ResetPasswordRequest request,
            ApplicationDbContext dbContext,
            IPasswordHasher<BlogUser> passwordHasher,
            CancellationToken cancellationToken) =>
        {
            var email = request.Email?.Trim().ToLowerInvariant() ?? string.Empty;
            if (request.NewPassword is null ||
                request.NewPassword.Length is < 8 or > 128 ||
                string.IsNullOrWhiteSpace(request.Token))
            {
                return Results.BadRequest(new { message = "Liên kết hoặc mật khẩu mới không hợp lệ." });
            }

            var user = await dbContext.BlogUsers.SingleOrDefaultAsync(
                account => account.Email == email,
                cancellationToken);
            var tokenHash = Convert.ToHexString(
                SHA256.HashData(Encoding.UTF8.GetBytes(request.Token)));
            var resetToken = user is null
                ? null
                : await dbContext.PasswordResetTokens.SingleOrDefaultAsync(
                    item => item.UserId == user.Id &&
                            item.TokenHash == tokenHash &&
                            item.UsedAt == null &&
                            item.ExpiresAt > DateTime.UtcNow,
                    cancellationToken);
            if (user is null || resetToken is null ||
                !CryptographicOperations.FixedTimeEquals(
                    Convert.FromHexString(resetToken.TokenHash),
                    Convert.FromHexString(tokenHash)))
            {
                return Results.BadRequest(new { message = "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn." });
            }

            user.PasswordHash = passwordHasher.HashPassword(user, request.NewPassword);
            await dbContext.PasswordResetTokens
                .Where(item => item.UserId == user.Id)
                .ExecuteDeleteAsync(cancellationToken);
            await dbContext.SaveChangesAsync(cancellationToken);
            return Results.Ok(new { message = "Đặt lại mật khẩu thành công." });
        })
        .AllowAnonymous()
        .WithSummary("Reset a password with a one-time email token");
    }

    private static async Task<BlogUser> GetUserAsync(
        ClaimsPrincipal principal,
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken,
        bool trackChanges = false)
    {
        var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userId, out var id))
        {
            throw new UnauthorizedException("Phiên đăng nhập không hợp lệ.");
        }

        var query = dbContext.BlogUsers.AsQueryable();
        if (!trackChanges)
        {
            query = query.AsNoTracking();
        }

        return await query.SingleOrDefaultAsync(
            user => user.Id == id,
            cancellationToken)
            ?? throw new UnauthorizedException("Tài khoản không còn tồn tại.");
    }

    private static object ToProfile(BlogUser user) => new
    {
        user.Id,
        user.Email,
        user.DisplayName,
        user.Bio,
        user.AvatarUrl,
        user.Role,
        user.CreatedAt
    };

    private static object CreateAuthResponse(
        BlogUser user,
        string issuer,
        string audience,
        string signingKey,
        int tokenLifetimeMinutes)
    {
        var now = DateTime.UtcNow;
        var expiresAt = now.AddMinutes(tokenLifetimeMinutes);
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.DisplayName),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };
        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey)),
            SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer,
            audience,
            claims,
            now,
            expiresAt,
            credentials);

        return new
        {
            accessToken = new JwtSecurityTokenHandler().WriteToken(token),
            tokenType = "Bearer",
            expiresAt,
            user = new
            {
                id = user.Id,
                email = user.Email,
                displayName = user.DisplayName,
                role = user.Role
            }
        };
    }
}
