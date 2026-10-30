namespace CulinaryBlog.Domain.Entities;

public class CookingChallenge
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Theme { get; set; } = string.Empty;
    public DateTime StartsAt { get; set; }
    public DateTime EndsAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<ChallengeSubmission> Submissions { get; set; } = new List<ChallengeSubmission>();
}