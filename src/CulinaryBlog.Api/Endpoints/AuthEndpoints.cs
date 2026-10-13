using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CulinaryBlog.Api.Endpoints.Requests;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
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
    }

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
