namespace CulinaryBlog.Domain.Entities;

public class MealPlanEntry
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    public Guid RecipeId { get; set; }
    public Recipe Recipe { get; set; } = null!;
    public DateOnly PlannedFor { get; set; }
    public string MealType { get; set; } = "Bữa tối";
    public int Servings { get; set; } = 2;
}