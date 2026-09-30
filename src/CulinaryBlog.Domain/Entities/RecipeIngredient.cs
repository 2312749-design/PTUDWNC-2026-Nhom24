namespace CulinaryBlog.Domain.Entities;

public class RecipeIngredient
{
    public Guid Id { get; private set; }
    public Guid RecipeId { get; private set; }
    public Recipe Recipe { get; private set; } = null!;

    public string Name { get; private set; } = string.Empty;
    public string? Quantity { get; private set; }
    public string? Unit { get; private set; }
    public int Order { get; private set; }

    public static RecipeIngredient Create(Guid recipeId, string name, string? quantity, string? unit, int order)
    {
        return new RecipeIngredient
        {
            Id = Guid.NewGuid(),
            RecipeId = recipeId,
            Name = name.Trim(),
            Quantity = quantity?.Trim(),
            Unit = unit?.Trim(),
            Order = order
        };
    }

    public void Update(string name, string? quantity, string? unit, int order)
    {
        Name = name.Trim();
        Quantity = quantity?.Trim();
        Unit = unit?.Trim();
        Order = order;
    }
}
