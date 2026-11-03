namespace CulinaryBlog.Domain.Entities;

public class UserFollow
{
    public string FollowerId { get; set; } = string.Empty;
    public ApplicationUser Follower { get; set; } = null!;
    public string FollowedId { get; set; } = string.Empty;
    public ApplicationUser Followed { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}