namespace CulinaryBlog.Domain.Entities;

public class PostComment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid PostId { get; set; }
    public CommunityPost Post { get; set; } = null!;
    public string AuthorId { get; set; } = string.Empty;
    public ApplicationUser Author { get; set; } = null!;
    public string Content { get; set; } = string.Empty;
    public Guid? ParentCommentId { get; set; }
    public PostComment? ParentComment { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}