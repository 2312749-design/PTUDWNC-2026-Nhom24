namespace CulinaryBlog.Domain.Entities;

/// <summary>
/// Immutable, recoverable snapshot created immediately before a recipe is edited.
/// It is separate from Recipe, preserving existing recipe URLs and workflows.
/// </summary>
public class RecipeRevision
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid RecipeId { get; set; }
    public Recipe Recipe { get; set; } = null!;
    public int Version { get; set; }
    public string SnapshotJson { get; set; } = string.Empty;
    public string CreatedById { get; set; } = string.Empty;
    public ApplicationUser CreatedBy { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>Portable data shape shared by the capture and restore flows.</summary>
public sealed class RecipeRevisionSnapshot
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public Guid CategoryId { get; set; }
    public List<string> Ingredients { get; set; } = [];
    public List<string> Instructions { get; set; } = [];
    public int PrepTimeMinutes { get; set; }
    public int CookTimeMinutes { get; set; }
    public int Servings { get; set; }
    public string Difficulty { get; set; } = "Medium";
    public bool IsVegetarian { get; set; }
    public RecipeNutrition? Nutrition { get; set; }
}

