namespace CulinaryBlog.Domain.Entities;

/// <summary>
/// Per-user preference document for privacy, notifications, accessibility,
/// nutrition goals and saved searches. It is persisted server-side for use
/// across browsers while remaining isolated from identity and recipe records.
/// </summary>
public class UserPreference
{
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    public string SettingsJson { get; set; } = "{}";
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

