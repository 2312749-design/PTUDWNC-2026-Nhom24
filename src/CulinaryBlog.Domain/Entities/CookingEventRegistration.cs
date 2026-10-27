namespace CulinaryBlog.Domain.Entities;

public class CookingEventRegistration
{
    public Guid EventId { get; set; }
    public CookingEvent Event { get; set; } = null!;
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    public Guid? SubmittedRecipeId { get; set; }
    public Recipe? SubmittedRecipe { get; set; }
    public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
    public DateTime? SubmittedAt { get; set; }
}
