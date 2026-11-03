using CulinaryBlog.Domain.Exceptions;

namespace CulinaryBlog.Domain.Entities;

public sealed class RecipeNutrition : IEquatable<RecipeNutrition>
{
    private const decimal MaximumValue = 1_000_000;

    private RecipeNutrition()
    {
    }

    public RecipeNutrition(decimal? calories, decimal? protein, decimal? carbohydrates, decimal? fat, decimal? fiber, decimal? sodium)
    {
        Calories = Validate(calories, nameof(calories));
        Protein = Validate(protein, nameof(protein));
        Carbohydrates = Validate(carbohydrates, nameof(carbohydrates));
        Fat = Validate(fat, nameof(fat));
        Fiber = Validate(fiber, nameof(fiber));
        Sodium = Validate(sodium, nameof(sodium));
    }

    public decimal? Calories { get; private set; }
    public decimal? Protein { get; private set; }
    public decimal? Carbohydrates { get; private set; }
    public decimal? Fat { get; private set; }
    public decimal? Fiber { get; private set; }
    public decimal? Sodium { get; private set; }
    public bool IsEmpty => Calories == null && Protein == null && Carbohydrates == null && Fat == null && Fiber == null && Sodium == null;

    public bool Equals(RecipeNutrition? other) => other != null && Calories == other.Calories && Protein == other.Protein &&
        Carbohydrates == other.Carbohydrates && Fat == other.Fat && Fiber == other.Fiber && Sodium == other.Sodium;

    public override bool Equals(object? obj) => obj is RecipeNutrition other && Equals(other);
    public override int GetHashCode() => HashCode.Combine(Calories, Protein, Carbohydrates, Fat, Fiber, Sodium);

    private static decimal? Validate(decimal? value, string fieldName)
    {
        if (value is < 0 or > MaximumValue)
        {
            throw new ValidationException($"Nutrition.{fieldName} phải từ 0 đến {MaximumValue}.");
        }

        return value;
    }
}