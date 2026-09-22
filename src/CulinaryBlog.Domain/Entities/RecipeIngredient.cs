namespace CulinaryBlog.Domain.Entities;

public class RecipeIngredient
{
    public Guid Id { get; set; }

    public Guid RecipeId { get; set; }

    public string Name { get; set; } = string.Empty;

    public decimal? Quantity { get; set; }

    public string? Unit { get; set; }

    public string? Notes { get; set; }

    public int OrderIndex { get; set; }

    public Recipe Recipe { get; set; } = null!;
}