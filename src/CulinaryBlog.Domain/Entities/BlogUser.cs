namespace CulinaryBlog.Domain.Entities;

public sealed class BlogUser
{
    public Guid Id { get; set; }

    public string Email { get; set; } = string.Empty;

    public string DisplayName { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string Role { get; set; } = "Author";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
