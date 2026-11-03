namespace CulinaryBlog.Domain.Entities;

public class BlogArticle
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public string Title { get; private set; } = string.Empty;
    public string Slug { get; private set; } = string.Empty;
    public string Summary { get; private set; } = string.Empty;
    public string Content { get; private set; } = string.Empty;
    public string? CoverImageUrl { get; private set; }
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; private set; }
    public string AuthorId { get; private set; } = string.Empty;
    public ApplicationUser Author { get; private set; } = null!;

    public static BlogArticle Create(string title, string slug, string summary, string content, string? coverImageUrl, string authorId)
    {
        return new BlogArticle
        {
            Title = title.Trim(),
            Slug = slug,
            Summary = summary.Trim(),
            Content = content.Trim(),
            CoverImageUrl = string.IsNullOrWhiteSpace(coverImageUrl) ? null : coverImageUrl.Trim(),
            AuthorId = authorId
        };
    }

    public void Update(string title, string slug, string summary, string content, string? coverImageUrl)
    {
        Title = title.Trim();
        Slug = slug;
        Summary = summary.Trim();
        Content = content.Trim();
        CoverImageUrl = string.IsNullOrWhiteSpace(coverImageUrl) ? null : coverImageUrl.Trim();
        UpdatedAt = DateTime.UtcNow;
    }
}
