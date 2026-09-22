using Microsoft.AspNetCore.Identity;

namespace CulinaryBlog.Domain.Entities;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string? Bio { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

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