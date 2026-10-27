namespace CulinaryBlog.Domain.Entities;

/// <summary>Immutable record of a privileged management action.</summary>
public class AdminAuditLog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string ActorId { get; set; } = string.Empty;
    public ApplicationUser Actor { get; set; } = null!;
    public string Action { get; set; } = string.Empty;
    public string TargetType { get; set; } = string.Empty;
    public string TargetId { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
