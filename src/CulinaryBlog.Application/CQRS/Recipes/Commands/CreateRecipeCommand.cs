using CulinaryBlog.Application.DTOs;
using MediatR;

namespace CulinaryBlog.Application.CQRS.Recipes.Commands;

public class CreateRecipeCommand : IRequest<RecipeDto>
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public List<string> Ingredients { get; set; } = new();
    public List<string> Instructions { get; set; } = new();
    public List<CreateRecipeIngredientDto> RecipeIngredients { get; set; } = new();
    public List<CreateRecipeStepDto> RecipeSteps { get; set; } = new();
    public Guid CategoryId { get; set; }
    public string AuthorId { get; set; } = string.Empty; // Nhận AuthorId từ Controller (lấy từ Token)
    public int PrepTimeMinutes { get; set; }
    public int CookTimeMinutes { get; set; }
    public int Servings { get; set; }
    public string Difficulty { get; set; } = "Medium";
    public bool IsVegetarian { get; set; }
    public RecipeNutritionDto? Nutrition { get; set; }
}