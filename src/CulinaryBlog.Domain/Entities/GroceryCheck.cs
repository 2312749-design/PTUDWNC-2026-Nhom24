namespace CulinaryBlog.Domain.Entities;

public class GroceryCheck
{
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    public DateOnly WeekStart { get; set; }
    public string IngredientKey { get; set; } = string.Empty;
    public string Ingredient { get; set; } = string.Empty;
    public bool IsChecked { get; set; }
}