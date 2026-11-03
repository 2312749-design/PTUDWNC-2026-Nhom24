namespace CulinaryBlog.Domain.Entities;

public class ChallengeSubmission
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ChallengeId { get; set; }
    public CookingChallenge Challenge { get; set; } = null!;
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    public Guid RecipeId { get; set; }
    public Recipe Recipe { get; set; } = null!;
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
}