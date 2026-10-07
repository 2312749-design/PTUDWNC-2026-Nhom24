using System.ComponentModel.DataAnnotations.Schema;

namespace CulinaryBlog.Domain.Entities;

public class RefreshToken
{
    public Guid Id { get; private set; }
    public string TokenHash { get; private set; } = string.Empty;
    [NotMapped]
    public string Token { get; private set; } = string.Empty;
    public string UserId { get; private set; } = string.Empty;
    public string TokenFamilyId { get; private set; } = string.Empty;

    public bool IsRevoked { get; private set; }
    public bool IsUsed { get; private set; }
    public DateTime ExpiresAt { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? RevokedAt { get; private set; }

    public ApplicationUser? User { get; private set; }

    protected RefreshToken() { }

    public static RefreshToken Create(string userId, string tokenValue, int expiryDays, string? tokenFamilyId = null)
    {
        return new RefreshToken
        {
            Id = Guid.NewGuid(),
            TokenHash = Hash(tokenValue),
            Token = tokenValue,
            UserId = userId,
            TokenFamilyId = tokenFamilyId ?? Guid.NewGuid().ToString("N"),
            ExpiresAt = DateTime.UtcNow.AddDays(expiryDays),
            CreatedAt = DateTime.UtcNow
        };
    }

    public bool IsValid() => !IsRevoked && !IsUsed && ExpiresAt > DateTime.UtcNow;
    public void MarkUsed() { IsUsed = true; }
    public void Revoke() { IsRevoked = true; RevokedAt = DateTime.UtcNow; }

    public static string Hash(string tokenValue)
    {
        return Convert.ToHexString(System.Security.Cryptography.SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(tokenValue)));
    }
}