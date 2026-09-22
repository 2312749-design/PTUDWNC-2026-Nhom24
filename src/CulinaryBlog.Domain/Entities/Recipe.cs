namespace CulinaryBlog.Domain.Entities;

public class Recipe
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public int CookTimeMinutes { get; set; }

    public int Servings { get; set; }

    public string Difficulty { get; set; } = string.Empty;

    public string Status { get; set; } = "Draft";

    public Guid CategoryId { get; set; }

    public Guid AuthorId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<RecipeIngredient> Ingredients { get; set; }
        = new List<RecipeIngredient>();

    public ICollection<RecipeStep> Steps { get; set; }
        = new List<RecipeStep>();
}
