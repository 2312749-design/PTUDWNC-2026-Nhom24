using Microsoft.AspNetCore.Identity;

namespace CulinaryBlog.Domain.Entities;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = "User";
    public string? AvatarUrl { get; set; }
    public string? Bio { get; set; }
    public DateTime? BirthDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    // Account moderation is kept on the user record so an administrator can
    // suspend sign-in without deleting the member or their content.
    public bool IsSuspended { get; set; }
    public DateTime? SuspendedUntil { get; set; }
    public string? SuspensionReason { get; set; }
    public string? TwoFactorSecretProtected { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public string? LastLoginIp { get; set; }
    public string? LastLoginUserAgent { get; set; }

    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    public static ApplicationUser Create(string fullName, string email, string username)
    {
        return new ApplicationUser { FullName = fullName, Email = email, UserName = username };
    }

    public static ApplicationUser CreateFromGoogle(string email, string fullName, string? avatarUrl)
    {
        return new ApplicationUser { FullName = fullName, Email = email, UserName = email, AvatarUrl = avatarUrl, EmailConfirmed = true };
    }
}
