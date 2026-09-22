namespace CulinaryBlog.Domain.Entities;

public class RecipeStep
{
    public Guid Id { get; set; }

    public Guid RecipeId { get; set; }

    public int StepNumber { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public int? TimerMinutes { get; set; }

    public string? ImageUrl { get; set; }

    public Recipe Recipe { get; set; } = null!;
}