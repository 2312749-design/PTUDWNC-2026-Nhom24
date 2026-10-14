namespace CulinaryBlog.Domain.Entities;

using CulinaryBlog.Domain.Exceptions;

public class RecipeStep
{
    public Guid Id { get; private set; }
    public Guid RecipeId { get; private set; }
    public Recipe Recipe { get; private set; } = null!;

    public string? Title { get; private set; }
    public string Description { get; private set; } = string.Empty;
    public int StepNumber { get; private set; }
    public int? TimerMinutes { get; private set; }
    public string? ImageUrl { get; private set; }

    public static RecipeStep Create(Guid recipeId, string? title, string description, int stepNumber, int? timerMinutes, string? imageUrl)
    {
        if (string.IsNullOrWhiteSpace(description) || stepNumber <= 0 || timerMinutes < 0)
        {
            throw new ValidationException("Bước nấu cần description, stepNumber hợp lệ và timerMinutes không âm.");
        }

        return new RecipeStep
        {
            Id = Guid.NewGuid(),
            RecipeId = recipeId,
            Title = string.IsNullOrWhiteSpace(title) ? null : title.Trim(),
            Description = description.Trim(),
            StepNumber = stepNumber,
            TimerMinutes = timerMinutes,
            ImageUrl = string.IsNullOrWhiteSpace(imageUrl) ? null : imageUrl.Trim()
        };
    }

    public void Update(string? title, string description, int? timerMinutes, string? imageUrl)
    {
        if (string.IsNullOrWhiteSpace(description) || timerMinutes < 0)
        {
            throw new ValidationException("Description bắt buộc và timerMinutes không được âm.");
        }

        Title = string.IsNullOrWhiteSpace(title) ? null : title.Trim();
        Description = description.Trim();
        TimerMinutes = timerMinutes;
        ImageUrl = string.IsNullOrWhiteSpace(imageUrl) ? null : imageUrl.Trim();
    }

    public void SetStepNumber(int stepNumber)
    {
        if (stepNumber <= 0) throw new ValidationException("stepNumber phải lớn hơn 0.");
        StepNumber = stepNumber;
    }
}
