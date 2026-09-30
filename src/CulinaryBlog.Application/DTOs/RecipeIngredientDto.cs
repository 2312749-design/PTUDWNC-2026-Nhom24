namespace CulinaryBlog.Application.DTOs;

public class RecipeIngredientDto
{
    public Guid Id { get; set; }
    public Guid RecipeId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Quantity { get; set; }
    public string? Unit { get; set; }
    public int Order { get; set; }
}

public class CreateRecipeIngredientDto
{
    public string Name { get; set; } = string.Empty;
    public string? Quantity { get; set; }
    public string? Unit { get; set; }
    public int Order { get; set; }
}

public class UpdateRecipeIngredientDto
{
    public string Name { get; set; } = string.Empty;
    public string? Quantity { get; set; }
    public string? Unit { get; set; }
    public int Order { get; set; }
}
