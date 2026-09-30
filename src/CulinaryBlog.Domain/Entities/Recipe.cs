using System.ComponentModel.DataAnnotations.Schema;

namespace CulinaryBlog.Domain.Entities;

public class Recipe
{
    public Guid Id { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Slug { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public string? ImageUrl { get; private set; }
    public List<string> Ingredients { get; private set; } = new();
    public List<string> Instructions { get; private set; } = new();
    public int? CookingTimeMinutes { get; private set; }
    public string Difficulty { get; private set; } = "Trung bình";
    public bool IsVegetarian { get; private set; }

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

    public static Recipe Create(string title, string? description, List<string> ingredients, List<string> instructions, Guid categoryId, string authorId, string? imageUrl = null, int? cookingTimeMinutes = null, string difficulty = "Trung bình", bool isVegetarian = false)
    {
        return new Recipe
        {
            Id = Guid.NewGuid(),
            Title = title.Trim(),
            Slug = title.ToLower().Replace(" ", "-"),
            Description = description?.Trim(),
            ImageUrl = NormalizeImageUrl(imageUrl),
            Ingredients = ingredients,
            Instructions = instructions,
            CookingTimeMinutes = cookingTimeMinutes,
            Difficulty = difficulty,
            IsVegetarian = isVegetarian,
            CategoryId = categoryId,
            AuthorId = authorId,
            Status = 0
        };
    }

    public void Update(string title, string? description, List<string> ingredients, List<string> instructions, Guid categoryId, int status, string? imageUrl = null, int? cookingTimeMinutes = null, string difficulty = "Trung bình", bool isVegetarian = false)
    {
        Title = title.Trim();
        Slug = title.ToLower().Replace(" ", "-");
        Description = description?.Trim();

        if (imageUrl == null)
        {
            ImageUrl = null;
        }
        else if (string.IsNullOrWhiteSpace(imageUrl))
        {
            ImageUrl = null;
        }
        else
        {
            ImageUrl = NormalizeImageUrl(imageUrl);
        }

        Ingredients = ingredients;
        Instructions = instructions;
        CookingTimeMinutes = cookingTimeMinutes;
        Difficulty = difficulty;
        IsVegetarian = isVegetarian;
        CategoryId = categoryId;
        Status = status;
    }

    private static string? NormalizeImageUrl(string? imageUrl)
    {
        if (string.IsNullOrWhiteSpace(imageUrl))
        {
            return null;
        }

        return imageUrl.Trim();
    }
}