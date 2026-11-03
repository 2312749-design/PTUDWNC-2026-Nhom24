namespace CulinaryBlog.Domain.Entities;

public class RecipeCollection
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string OwnerId { get; set; } = string.Empty;
    public ApplicationUser Owner { get; set; } = null!;
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<RecipeCollectionItem> Items { get; set; } = new List<RecipeCollectionItem>();
}