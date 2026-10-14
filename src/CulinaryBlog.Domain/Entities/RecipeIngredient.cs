namespace CulinaryBlog.Domain.Entities;

using CulinaryBlog.Domain.Exceptions;

public class RecipeIngredient
{
    public Guid Id { get; private set; }
    public Guid RecipeId { get; private set; }
    public Recipe Recipe { get; private set; } = null!;

    public string Name { get; private set; } = string.Empty;
    public string? Quantity { get; private set; }
    public string? Unit { get; private set; }
    public string? Notes { get; private set; }
    public int OrderIndex { get; private set; }

    public static RecipeIngredient Create(Guid recipeId, string name, string? quantity, string? unit, string? notes, int orderIndex)
    {
        if (string.IsNullOrWhiteSpace(name) || orderIndex <= 0)
        {
            throw new ValidationException("Nguyên liệu cần có tên và orderIndex lớn hơn 0.");
        }

        return new RecipeIngredient
        {
            Id = Guid.NewGuid(),
            RecipeId = recipeId,
            Name = name.Trim(),
            Quantity = quantity?.Trim(),
            Unit = unit?.Trim(),
            Notes = string.IsNullOrWhiteSpace(notes) ? null : notes.Trim(),
            OrderIndex = orderIndex
        };
    }

    public void Update(string name, string? quantity, string? unit, string? notes, int orderIndex)
    {
        if (string.IsNullOrWhiteSpace(name) || orderIndex <= 0)
        {
            throw new ValidationException("Nguyên liệu cần có tên và orderIndex lớn hơn 0.");
        }

        Name = name.Trim();
        Quantity = quantity?.Trim();
        Unit = unit?.Trim();
        Notes = string.IsNullOrWhiteSpace(notes) ? null : notes.Trim();
        OrderIndex = orderIndex;
    }
}
