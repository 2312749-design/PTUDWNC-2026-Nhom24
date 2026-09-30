namespace CulinaryBlog.Domain.Entities;

public class CommunityPost
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string AuthorId { get; set; } = string.Empty;
    public ApplicationUser Author { get; set; } = null!;
    public string Content { get; set; } = string.Empty;
    public string? MediaUrl { get; set; }
    public string? MediaType { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsDraft { get; set; }
    public bool CommentsEnabled { get; set; } = true;
    public ICollection<PostLike> Likes { get; set; } = new List<PostLike>();
    public ICollection<PostComment> Comments { get; set; } = new List<PostComment>();
}