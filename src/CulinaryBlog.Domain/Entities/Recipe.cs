using System.ComponentModel.DataAnnotations.Schema;

namespace CulinaryBlog.Domain.Entities;

public class Recipe
{
    public Guid Id { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Slug { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public List<string> Ingredients { get; private set; } = new();
    public List<string> Instructions { get; private set; } = new();

    [NotMapped]
    public List<string> Steps
    {
        get => Instructions;
        set => Instructions = value;
    }

    public Guid CategoryId { get; private set; }
    public Category Category { get; private set; } = null!;
    public string AuthorId { get; private set; } = string.Empty;
    public ApplicationUser Author { get; private set; } = null!;
    public int Status { get; private set; } // 0: Draft, 1: Published

    public static Recipe Create(string title, string? description, List<string> ingredients, List<string> instructions, Guid categoryId, string authorId)
    {
        return new Recipe
        {
            Id = Guid.NewGuid(),
            Title = title.Trim(),
            Slug = title.ToLower().Replace(" ", "-"),
            Description = description?.Trim(),
            Ingredients = ingredients,
            Instructions = instructions,
            CategoryId = categoryId,
            AuthorId = authorId,
            Status = 0
        };
    }

    public void Update(string title, string? description, List<string> ingredients, List<string> instructions, Guid categoryId, int status)
    {
        Title = title.Trim();
        Slug = title.ToLower().Replace(" ", "-");
        Description = description?.Trim();
        Ingredients = ingredients;
        Instructions = instructions;
        CategoryId = categoryId;
        Status = status;
    }
}