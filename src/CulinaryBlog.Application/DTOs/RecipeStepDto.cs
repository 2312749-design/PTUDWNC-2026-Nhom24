using System.ComponentModel.DataAnnotations;

namespace CulinaryBlog.Application.DTOs;

public class RecipeStepDto
{
    public Guid Id { get; set; }
    public Guid RecipeId { get; set; }
    public string? Title { get; set; }
    public string Description { get; set; } = string.Empty;
    public int StepNumber { get; set; }
    public int? TimerMinutes { get; set; }
    public string? ImageUrl { get; set; }
}

public class CreateRecipeStepDto
{
    [MaxLength(200)]
    public string? Title { get; set; }
    [Required, MaxLength(2000)]
    public string Description { get; set; } = string.Empty;
    [Range(0, 1440)]
    public int? TimerMinutes { get; set; }
    [Url, MaxLength(2048)]
    public string? ImageUrl { get; set; }
}

public class UpdateRecipeStepDto
{
    [MaxLength(200)]
    public string? Title { get; set; }
    [Required, MaxLength(2000)]
    public string Description { get; set; } = string.Empty;
    [Range(0, 1440)]
    public int? TimerMinutes { get; set; }
    [Url, MaxLength(2048)]
    public string? ImageUrl { get; set; }
}
