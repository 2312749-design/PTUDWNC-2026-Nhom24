namespace CulinaryBlog.Domain.Entities;

public class RecipeStep
{
    public Guid Id { get; private set; }
    public Guid RecipeId { get; private set; }
    public Recipe Recipe { get; private set; } = null!;

    public string Title { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public int Order { get; private set; }

    public static RecipeStep Create(Guid recipeId, string title, string description, int order)
    {
        return new RecipeStep
        {
            Id = Guid.NewGuid(),
            RecipeId = recipeId,
            Title = title.Trim(),
            Description = description.Trim(),
            Order = order
        };
    }

    public void Update(string title, string description, int order)
    {
        Title = title.Trim();
        Description = description.Trim();
        Order = order;
    }
}
