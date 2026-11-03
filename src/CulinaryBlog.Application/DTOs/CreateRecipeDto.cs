using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;
using CulinaryBlog.Application.Validation;

namespace CulinaryBlog.Application.DTOs;

public class CreateRecipeDto
{
    [Required, MinLength(3), MaxLength(160)]
    public string Title { get; set; } = string.Empty;
    [MaxLength(2000)]
    public string? Description { get; set; }
    [StoredMediaUrl, MaxLength(2048)]
    public string? ImageUrl { get; set; }
    public List<string> Ingredients { get; set; } = new();
    public List<string> Instructions { get; set; } = new();
    public List<CreateRecipeIngredientDto> RecipeIngredients { get; set; } = new();
    public List<CreateRecipeStepDto> RecipeSteps { get; set; } = new();
    public Guid CategoryId { get; set; }
    [Required, Range(1, 1440)]
    public int? PrepTimeMinutes { get; set; }
    [Required, Range(0, 1440)]
    public int? CookTimeMinutes { get; set; }
    [Required, Range(1, 100)]
    public int? Servings { get; set; }
    [RegularExpression("^(Easy|Medium|Hard|Expert)$")]
    public string Difficulty { get; set; } = "Medium";
    public bool IsVegetarian { get; set; }
    public RecipeNutritionDto? Nutrition { get; set; }
}
