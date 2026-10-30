namespace CulinaryBlog.Domain.Entities;

/// <summary>Server-side autosave for long-form editor work.</summary>
public class UserWorkspaceDraft
{
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    public string DraftKey { get; set; } = string.Empty;
    public string ContentJson { get; set; } = "{}";
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
