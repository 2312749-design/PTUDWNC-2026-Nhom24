namespace CulinaryBlog.Domain.Entities;

public class PostLike
{
    public Guid PostId { get; set; }
    public CommunityPost Post { get; set; } = null!;
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}