using System.ComponentModel.DataAnnotations.Schema;
using CulinaryBlog.Domain.Exceptions;
using NpgsqlTypes;

namespace CulinaryBlog.Domain.Entities;

public enum RecipeStatus
{
    Draft = 0,
    Published = 1,
    Archived = 2
}

public class Recipe
{
    private static readonly HashSet<string> AllowedDifficulties = new(StringComparer.Ordinal)
    {
        "Easy", "Medium", "Hard", "Expert"
    };

    public Guid Id { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Slug { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public string? ImageUrl { get; private set; }
    public List<string> Ingredients { get; private set; } = new();
    public NpgsqlTsVector SearchVector { get; private set; } = NpgsqlTsVector.Empty;
    public List<string> Instructions { get; private set; } = new();
    public int PrepTimeMinutes { get; private set; } = 1;
    public int CookTimeMinutes { get; private set; }
    public int Servings { get; private set; } = 1;
    public int? CookingTimeMinutes { get; private set; }
    public string Difficulty { get; private set; } = "Medium";
    public bool IsVegetarian { get; private set; }
    public RecipeNutrition? Nutrition { get; private set; }
    public ICollection<RecipeImage> Images { get; private set; } = new List<RecipeImage>();

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
    public RecipeStatus Status { get; private set; } = RecipeStatus.Draft;
    public bool IsDeleted { get; private set; }
    public DateTime? DeletedAt { get; private set; }
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; private set; } = DateTime.UtcNow;

    public static Recipe Create(
        string title,
        string? description,
        List<string> ingredients,
        List<string> instructions,
        Guid categoryId,
        string authorId,
        string? imageUrl = null,
        int? cookingTimeMinutes = null,
        string difficulty = "Medium",
        bool isVegetarian = false,
        int? prepTimeMinutes = null,
        int? cookTimeMinutes = null,
        int servings = 1)
    {
        var normalizedTitle = ValidateTitle(title);
        var prepMinutes = prepTimeMinutes ?? 1;
        var cookMinutes = cookTimeMinutes ?? cookingTimeMinutes ?? 0;
        difficulty = NormalizeDifficulty(difficulty);
        ValidateCookingDetails(normalizedTitle, description, prepMinutes, cookMinutes, servings, difficulty);

        return new Recipe
        {
            Id = Guid.NewGuid(),
            Title = normalizedTitle,
            Slug = CreateSlug(normalizedTitle),
            Description = NormalizeDescription(description),
            ImageUrl = NormalizeImageUrl(imageUrl),
            Ingredients = NormalizeLines(ingredients),
            Instructions = NormalizeLines(instructions),
            PrepTimeMinutes = prepMinutes,
            CookTimeMinutes = cookMinutes,
            Servings = servings,
            CookingTimeMinutes = cookingTimeMinutes ?? prepMinutes + cookMinutes,
            Difficulty = difficulty,
            IsVegetarian = isVegetarian,
            CategoryId = categoryId,
            AuthorId = authorId,
            Status = RecipeStatus.Draft,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void Update(
        string title,
        string? description,
        List<string> ingredients,
        List<string> instructions,
        Guid categoryId,
        string? imageUrl = null,
        int? cookingTimeMinutes = null,
        string? difficulty = null,
        bool? isVegetarian = null,
        int? prepTimeMinutes = null,
        int? cookTimeMinutes = null,
        int? servings = null)
    {
        var normalizedTitle = ValidateTitle(title);
        var nextPrepMinutes = prepTimeMinutes ?? PrepTimeMinutes;
        var nextCookMinutes = cookTimeMinutes ?? (cookingTimeMinutes.HasValue
            ? Math.Max(0, cookingTimeMinutes.Value - nextPrepMinutes)
            : CookTimeMinutes);
        var nextServings = servings ?? Servings;
        var nextDifficulty = NormalizeDifficulty(difficulty ?? Difficulty);
        ValidateCookingDetails(normalizedTitle, description, nextPrepMinutes, nextCookMinutes, nextServings, nextDifficulty);

        Title = normalizedTitle;
        Slug = CreateSlug(normalizedTitle);
        Description = NormalizeDescription(description);
        ImageUrl = NormalizeImageUrl(imageUrl);
        Ingredients = NormalizeLines(ingredients);
        Instructions = NormalizeLines(instructions);
        CategoryId = categoryId;
        PrepTimeMinutes = nextPrepMinutes;
        CookTimeMinutes = nextCookMinutes;
        Servings = nextServings;
        CookingTimeMinutes = cookingTimeMinutes ?? nextPrepMinutes + nextCookMinutes;
        Difficulty = nextDifficulty;
        IsVegetarian = isVegetarian ?? IsVegetarian;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetSlug(string slug)
    {
        if (string.IsNullOrWhiteSpace(slug))
        {
            throw new ValidationException("Slug không được để trống.");
        }

        Slug = slug.Trim();
    }

    public void SetImageUrl(string? imageUrl)
    {
        ImageUrl = NormalizeImageUrl(imageUrl);
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetNutrition(RecipeNutrition? nutrition)
    {
        if (Nutrition?.Equals(nutrition) == true || (Nutrition == null && nutrition == null))
        {
            return;
        }

        Nutrition = nutrition is { IsEmpty: false } ? nutrition : null;
        UpdatedAt = DateTime.UtcNow;
    }

    public bool Publish(bool hasUsableIngredient, bool hasUsableStep)
    {
        if (Status == RecipeStatus.Published)
        {
            return false;
        }

        if (Status != RecipeStatus.Draft)
        {
            throw new ValidationException("Chỉ có thể xuất bản công thức đang ở trạng thái Draft.");
        }

        if (string.IsNullOrWhiteSpace(Title) || string.IsNullOrWhiteSpace(Description))
        {
            throw new ValidationException("Công thức cần có tiêu đề và mô tả trước khi xuất bản.");
        }

        if (!hasUsableIngredient)
        {
            throw new ValidationException("Cần ít nhất một nguyên liệu hợp lệ trước khi xuất bản.");
        }

        if (!hasUsableStep)
        {
            throw new ValidationException("Cần ít nhất một bước nấu hợp lệ trước khi xuất bản.");
        }

        Status = RecipeStatus.Published;
        UpdatedAt = DateTime.UtcNow;
        return true;
    }

    public bool Unpublish()
    {
        if (Status == RecipeStatus.Draft)
        {
            return false;
        }

        if (Status != RecipeStatus.Published)
        {
            throw new ValidationException("Chỉ có thể hủy xuất bản công thức đang ở trạng thái Published.");
        }

        Status = RecipeStatus.Draft;
        UpdatedAt = DateTime.UtcNow;
        return true;
    }

    public bool Archive()
    {
        if (Status == RecipeStatus.Archived)
        {
            return false;
        }

        Status = RecipeStatus.Archived;
        UpdatedAt = DateTime.UtcNow;
        return true;
    }

    public bool RestoreToDraft()
    {
        if (Status == RecipeStatus.Draft)
        {
            return false;
        }

        if (Status != RecipeStatus.Archived)
        {
            throw new ValidationException("Chỉ có thể khôi phục công thức đang Archived.");
        }

        Status = RecipeStatus.Draft;
        UpdatedAt = DateTime.UtcNow;
        return true;
    }

    public void SoftDelete()
    {
        if (IsDeleted)
        {
            return;
        }

        IsDeleted = true;
        DeletedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public static string CreateSlug(string title) => title.Trim().ToLowerInvariant().Replace(" ", "-");

    public static string NormalizeDifficulty(string? difficulty) => difficulty?.Trim() switch
    {
        "Dễ" or "Easy" => "Easy",
        "Trung bình" or "Medium" => "Medium",
        "Khó" or "Hard" => "Hard",
        "Expert" => "Expert",
        _ => difficulty?.Trim() ?? "Medium"
    };

    private static string ValidateTitle(string title)
    {
        var normalizedTitle = title?.Trim() ?? string.Empty;
        if (normalizedTitle.Length is < 3 or > 160)
        {
            throw new ValidationException("Tiêu đề công thức phải có từ 3 đến 160 ký tự.");
        }

        return normalizedTitle;
    }

    private static void ValidateCookingDetails(string title, string? description, int prepTimeMinutes, int cookTimeMinutes, int servings, string difficulty)
    {
        _ = title;
        if (description?.Length > 2000)
        {
            throw new ValidationException("Mô tả công thức tối đa 2000 ký tự.");
        }

        if (prepTimeMinutes <= 0 || cookTimeMinutes < 0 || servings <= 0)
        {
            throw new ValidationException("Thời gian sơ chế, thời gian nấu và khẩu phần không hợp lệ.");
        }

        if (!AllowedDifficulties.Contains(difficulty))
        {
            throw new ValidationException("Difficulty chỉ nhận Easy, Medium, Hard hoặc Expert.");
        }
    }

    private static string? NormalizeDescription(string? description) =>
        string.IsNullOrWhiteSpace(description) ? null : description.Trim();

    private static List<string> NormalizeLines(IEnumerable<string>? values) =>
        values?.Where(value => !string.IsNullOrWhiteSpace(value)).Select(value => value.Trim()).ToList() ?? new();

    private static string? NormalizeImageUrl(string? imageUrl) =>
        string.IsNullOrWhiteSpace(imageUrl) ? null : imageUrl.Trim();
}
