namespace CulinaryBlog.Domain.Entities;

public class PostReaction
{
    public Guid PostId { get; set; }
    public CommunityPost Post { get; set; } = null!;
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    public string Type { get; set; } = "like";
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
