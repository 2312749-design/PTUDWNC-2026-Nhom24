using CulinaryBlog.Application.DTOs;
using MediatR;

namespace CulinaryBlog.Application.CQRS.Recipes.Commands;

public sealed class UpdateRecipeCommand : IRequest<RecipeDto>
{
    public Guid Id { get; init; }
    public string CurrentUserId { get; init; } = string.Empty;
    public bool IsAdmin { get; init; }
    public DateTime? ExpectedUpdatedAt { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? ImageUrl { get; init; }
    public List<string> Ingredients { get; init; } = [];
    public List<string> Instructions { get; init; } = [];
    public List<CreateRecipeIngredientDto>? RecipeIngredients { get; init; }
    public List<CreateRecipeStepDto>? RecipeSteps { get; init; }
    public Guid CategoryId { get; init; }
    public int? PrepTimeMinutes { get; init; }
    public int? CookTimeMinutes { get; init; }
    public int? Servings { get; init; }
    public string? Difficulty { get; init; }
    public bool IsVegetarian { get; init; }
    public bool NutritionSpecified { get; init; }
    public RecipeNutritionDto? Nutrition { get; init; }
}

public enum RecipeStatusTransition { Publish, Unpublish, Archive, Restore, Delete }

public sealed record ChangeRecipeStatusCommand(
    Guid Id,
    string CurrentUserId,
    bool IsAdmin,
    RecipeStatusTransition Transition) : IRequest<RecipeTransitionResult>;

public sealed record RecipeTransitionResult(Guid Id, int Status, bool Changed, DateTime UpdatedAt);
