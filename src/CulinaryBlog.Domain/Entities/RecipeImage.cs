namespace CulinaryBlog.Domain.Entities;

public class RecipeImage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid RecipeId { get; set; }
    public Recipe Recipe { get; set; } = null!;
    public string Url { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public string MediumUrl { get; set; } = string.Empty;
    public bool IsPrimary { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
