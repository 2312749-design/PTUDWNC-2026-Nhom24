namespace CulinaryBlog.Domain.Entities;

public class RefreshToken
{
    public Guid Id { get; private set; }
    public string Token { get; private set; } = string.Empty;
    public string UserId { get; private set; } = string.Empty;

    public bool IsRevoked { get; private set; }
    public bool IsUsed { get; private set; }
    public DateTime ExpiresAt { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public ApplicationUser? User { get; private set; }

    protected RefreshToken() { }

    public static RefreshToken Create(string userId, string tokenValue, int expiryDays)
    {
        return new RefreshToken
        {
            Id = Guid.NewGuid(),
            Token = tokenValue,
            UserId = userId,
            ExpiresAt = DateTime.UtcNow.AddDays(expiryDays),
            CreatedAt = DateTime.UtcNow
        };
    }

    public bool IsValid() => !IsRevoked && !IsUsed && ExpiresAt > DateTime.UtcNow;
    public void MarkUsed() { IsUsed = true; }
    public void Revoke() { IsRevoked = true; }
}