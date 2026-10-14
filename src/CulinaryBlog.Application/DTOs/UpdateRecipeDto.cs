using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace CulinaryBlog.Application.DTOs;

public class UpdateRecipeDto
{
    [Required, MinLength(3), MaxLength(160)]
    public string Title { get; set; } = string.Empty;
    [MaxLength(2000)]
    public string? Description { get; set; }
    [Url, MaxLength(2048)]
    public string? ImageUrl { get; set; }
    public List<string> Ingredients { get; set; } = new();
    public List<string> Instructions { get; set; } = new();
    public List<CreateRecipeIngredientDto>? RecipeIngredients { get; set; }
    public List<CreateRecipeStepDto>? RecipeSteps { get; set; }
    public Guid CategoryId { get; set; }
    [Range(1, 1440)]
    public int? PrepTimeMinutes { get; set; }
    [Range(0, 1440)]
    public int? CookTimeMinutes { get; set; }
    [Range(1, 100)]
    public int? Servings { get; set; }
    [RegularExpression("^(Easy|Medium|Hard|Expert)$")]
    public string? Difficulty { get; set; }
    public bool IsVegetarian { get; set; }
    public JsonElement Nutrition { get; set; }
}
