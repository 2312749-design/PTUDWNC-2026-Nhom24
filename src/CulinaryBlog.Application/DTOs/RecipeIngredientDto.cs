using System.ComponentModel.DataAnnotations;

namespace CulinaryBlog.Application.DTOs;

public class RecipeIngredientDto
{
    public Guid Id { get; set; }
    public Guid RecipeId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Quantity { get; set; }
    public string? Unit { get; set; }
    public string? Notes { get; set; }
    public int OrderIndex { get; set; }
}

public class CreateRecipeIngredientDto
{
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    [MaxLength(100)]
    public string? Quantity { get; set; }
    [MaxLength(50)]
    public string? Unit { get; set; }
    [MaxLength(500)]
    public string? Notes { get; set; }
    [Range(1, 1000)]
    public int? OrderIndex { get; set; }
}

public class UpdateRecipeIngredientDto
{
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    [MaxLength(100)]
    public string? Quantity { get; set; }
    [MaxLength(50)]
    public string? Unit { get; set; }
    [MaxLength(500)]
    public string? Notes { get; set; }
    [Range(1, 1000)]
    public int? OrderIndex { get; set; }
}
