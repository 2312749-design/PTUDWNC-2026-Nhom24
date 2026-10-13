namespace CulinaryBlog.Application.Commands;

public sealed record AddRecipeIngredientCommand(
    Guid RecipeId,
    string Name,
    decimal? Quantity,
    string? Unit,
    string? Notes,
    int OrderIndex);

public sealed record UpdateRecipeIngredientCommand(
    Guid RecipeId,
    Guid IngredientId,
    string Name,
    decimal? Quantity,
    string? Unit,
    string? Notes,
    int OrderIndex);

public sealed record DeleteRecipeIngredientCommand(
    Guid RecipeId,
    Guid IngredientId);

public sealed record AddRecipeStepCommand(
    Guid RecipeId,
    string Title,
    string Description,
    int? TimerMinutes,
    string? ImageUrl);

public sealed record UpdateRecipeStepCommand(
    Guid RecipeId,
    Guid StepId,
    string Title,
    string Description,
    int? TimerMinutes,
    string? ImageUrl);

public sealed record DeleteRecipeStepCommand(
    Guid RecipeId,
    Guid StepId);
