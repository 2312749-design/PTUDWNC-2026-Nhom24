using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;
using CulinaryBlog.Domain.Entities;

namespace CulinaryBlog.Application.DTOs;

public class RecipeDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public List<string> Ingredients { get; set; } = new();
    public List<string> Instructions { get; set; } = new();
    public List<RecipeIngredientDto> RecipeIngredients { get; set; } = new();
    public List<RecipeStepDto> RecipeSteps { get; set; } = new();
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string AuthorId { get; set; } = string.Empty;
    public RecipeStatus Status { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int PrepTimeMinutes { get; set; }
    public int CookTimeMinutes { get; set; }
    public int Servings { get; set; }
    public int? CookingTimeMinutes { get; set; }
    public string Difficulty { get; set; } = "Medium";
    public bool IsVegetarian { get; set; }
    public RecipeNutritionDto? Nutrition { get; set; }
}

/// <summary>Nutrition per serving: calories in kcal, macros and fiber in grams, sodium in milligrams.</summary>
public sealed class RecipeNutritionDto
{
    [Range(0, 1000000)]
    public decimal? Calories { get; set; }
    [Range(0, 1000000)]
    public decimal? Protein { get; set; }
    [Range(0, 1000000)]
    public decimal? Carbohydrates { get; set; }
    [Range(0, 1000000)]
    public decimal? Fat { get; set; }
    [Range(0, 1000000)]
    public decimal? Fiber { get; set; }
    [Range(0, 1000000)]
    public decimal? Sodium { get; set; }
}
