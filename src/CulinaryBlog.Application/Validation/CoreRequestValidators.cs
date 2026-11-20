using CulinaryBlog.Application.CQRS.Categories.Commands;
using CulinaryBlog.Application.CQRS.Recipes.Commands;
using FluentValidation;

namespace CulinaryBlog.Application.Validation;

public sealed class CreateCategoryCommandValidator : AbstractValidator<CreateCategoryCommand>
{
    public CreateCategoryCommandValidator()
    {
        RuleFor(command => command.Name).NotEmpty().MaximumLength(100);
        RuleFor(command => command.Description).MaximumLength(500);
        RuleFor(command => command.ImageUrl)
            .MaximumLength(2048)
            .Must(BeStoredMediaUrl)
            .When(command => !string.IsNullOrWhiteSpace(command.ImageUrl))
            .WithMessage("ImageUrl phải là URL HTTP/HTTPS hợp lệ.");
    }

    private static bool BeStoredMediaUrl(string? value) =>
        Uri.TryCreate(value, UriKind.Absolute, out var uri)
        && uri.Scheme is "http" or "https";
}

public sealed class UpdateCategoryCommandValidator : AbstractValidator<UpdateCategoryCommand>
{
    public UpdateCategoryCommandValidator()
    {
        Include(new CreateCategoryCommandValidatorAdapter());
        RuleFor(command => command.Id).NotEmpty();
    }

    private sealed class CreateCategoryCommandValidatorAdapter : AbstractValidator<UpdateCategoryCommand>
    {
        public CreateCategoryCommandValidatorAdapter()
        {
            RuleFor(command => command.Name).NotEmpty().MaximumLength(100);
            RuleFor(command => command.Description).MaximumLength(500);
            RuleFor(command => command.ImageUrl).MaximumLength(2048);
        }
    }
}

public sealed class DeleteCategoryCommandValidator : AbstractValidator<DeleteCategoryCommand>
{
    public DeleteCategoryCommandValidator() => RuleFor(command => command.Id).NotEmpty();
}

public sealed class CreateRecipeCommandValidator : AbstractValidator<CreateRecipeCommand>
{
    private static readonly string[] Difficulties = ["Easy", "Medium", "Hard", "Expert"];

    public CreateRecipeCommandValidator()
    {
        RuleFor(command => command.Title).NotEmpty().Length(5, 160);
        RuleFor(command => command.Description).MaximumLength(2000);
        RuleFor(command => command.CategoryId).NotEmpty();
        RuleFor(command => command.AuthorId).NotEmpty();
        RuleFor(command => command.PrepTimeMinutes).InclusiveBetween(1, 1440);
        RuleFor(command => command.CookTimeMinutes).InclusiveBetween(0, 1440);
        RuleFor(command => command.Servings).InclusiveBetween(1, 100);
        RuleFor(command => command.Difficulty).Must(value => Difficulties.Contains(value))
            .WithMessage("Difficulty chỉ nhận Easy, Medium, Hard hoặc Expert.");
        RuleFor(command => command).Must(HasIngredient)
            .WithName("RecipeIngredients").WithMessage("Công thức cần ít nhất 1 nguyên liệu.");
        RuleFor(command => command).Must(HasStep)
            .WithName("RecipeSteps").WithMessage("Công thức cần ít nhất 1 bước nấu.");
    }

    private static bool HasIngredient(CreateRecipeCommand command) =>
        command.RecipeIngredients?.Any(item => !string.IsNullOrWhiteSpace(item.Name)) == true
        || command.Ingredients?.Any(item => !string.IsNullOrWhiteSpace(item)) == true;

    private static bool HasStep(CreateRecipeCommand command) =>
        command.RecipeSteps?.Any(item => !string.IsNullOrWhiteSpace(item.Description)) == true
        || command.Instructions?.Any(item => !string.IsNullOrWhiteSpace(item)) == true;
}

public sealed class UpdateRecipeCommandValidator : AbstractValidator<UpdateRecipeCommand>
{
    private static readonly string[] Difficulties = ["Easy", "Medium", "Hard", "Expert"];

    public UpdateRecipeCommandValidator()
    {
        RuleFor(command => command.Id).NotEmpty();
        RuleFor(command => command.CurrentUserId).NotEmpty();
        RuleFor(command => command.Title).NotEmpty().Length(5, 160);
        RuleFor(command => command.Description).MaximumLength(2000);
        RuleFor(command => command.CategoryId).NotEmpty();
        RuleFor(command => command.PrepTimeMinutes).InclusiveBetween(1, 1440).When(command => command.PrepTimeMinutes.HasValue);
        RuleFor(command => command.CookTimeMinutes).InclusiveBetween(0, 1440).When(command => command.CookTimeMinutes.HasValue);
        RuleFor(command => command.Servings).InclusiveBetween(1, 100).When(command => command.Servings.HasValue);
        RuleFor(command => command.Difficulty).Must(value => value is null || Difficulties.Contains(value))
            .WithMessage("Difficulty chỉ nhận Easy, Medium, Hard hoặc Expert.");
        RuleFor(command => command).Must(command =>
                command.RecipeIngredients?.Any(item => !string.IsNullOrWhiteSpace(item.Name)) == true
                || command.Ingredients.Any(item => !string.IsNullOrWhiteSpace(item)))
            .WithName("RecipeIngredients").WithMessage("Công thức cần ít nhất 1 nguyên liệu.");
        RuleFor(command => command).Must(command =>
                command.RecipeSteps?.Any(item => !string.IsNullOrWhiteSpace(item.Description)) == true
                || command.Instructions.Any(item => !string.IsNullOrWhiteSpace(item)))
            .WithName("RecipeSteps").WithMessage("Công thức cần ít nhất 1 bước nấu.");
    }
}

public sealed class ChangeRecipeStatusCommandValidator : AbstractValidator<ChangeRecipeStatusCommand>
{
    public ChangeRecipeStatusCommandValidator()
    {
        RuleFor(command => command.Id).NotEmpty();
        RuleFor(command => command.CurrentUserId).NotEmpty();
        RuleFor(command => command.Transition).IsInEnum();
    }
}

public sealed class CreateRecipeIngredientCommandValidator : AbstractValidator<CreateRecipeIngredientCommand>
{
    public CreateRecipeIngredientCommandValidator()
    {
        RuleFor(command => command.RecipeId).NotEmpty();
        RuleFor(command => command.CurrentUserId).NotEmpty();
        RuleFor(command => command.Input.Name).NotEmpty().MaximumLength(200).OverridePropertyName("name");
        RuleFor(command => command.Input.Quantity).MaximumLength(100).OverridePropertyName("quantity");
        RuleFor(command => command.Input.Unit).MaximumLength(50).OverridePropertyName("unit");
        RuleFor(command => command.Input.Notes).MaximumLength(500).OverridePropertyName("notes");
    }
}

public sealed class UpdateRecipeIngredientCommandValidator : AbstractValidator<UpdateRecipeIngredientCommand>
{
    public UpdateRecipeIngredientCommandValidator()
    {
        Include(new CreateRecipeIngredientCommandValidatorAdapter());
    }

    private sealed class CreateRecipeIngredientCommandValidatorAdapter : AbstractValidator<UpdateRecipeIngredientCommand>
    {
        public CreateRecipeIngredientCommandValidatorAdapter()
        {
            RuleFor(command => command.RecipeId).NotEmpty();
            RuleFor(command => command.Id).NotEmpty();
            RuleFor(command => command.CurrentUserId).NotEmpty();
            RuleFor(command => command.Input.Name).NotEmpty().MaximumLength(200).OverridePropertyName("name");
            RuleFor(command => command.Input.OrderIndex).InclusiveBetween(1, 1000).When(command => command.Input.OrderIndex.HasValue).OverridePropertyName("orderIndex");
        }
    }
}

public sealed class DeleteRecipeIngredientCommandValidator : AbstractValidator<DeleteRecipeIngredientCommand>
{
    public DeleteRecipeIngredientCommandValidator() { RuleFor(command => command.RecipeId).NotEmpty(); RuleFor(command => command.Id).NotEmpty(); }
}

public sealed class CreateRecipeStepCommandValidator : AbstractValidator<CreateRecipeStepCommand>
{
    public CreateRecipeStepCommandValidator()
    {
        RuleFor(command => command.RecipeId).NotEmpty();
        RuleFor(command => command.CurrentUserId).NotEmpty();
        RuleFor(command => command.Input.Title).MaximumLength(200).OverridePropertyName("title");
        RuleFor(command => command.Input.Description).NotEmpty().MaximumLength(2000).OverridePropertyName("description");
        RuleFor(command => command.Input.TimerMinutes).InclusiveBetween(0, 1440).When(command => command.Input.TimerMinutes.HasValue).OverridePropertyName("timerMinutes");
    }
}

public sealed class UpdateRecipeStepCommandValidator : AbstractValidator<UpdateRecipeStepCommand>
{
    public UpdateRecipeStepCommandValidator()
    {
        RuleFor(command => command.RecipeId).NotEmpty();
        RuleFor(command => command.Id).NotEmpty();
        RuleFor(command => command.CurrentUserId).NotEmpty();
        RuleFor(command => command.Input.Title).MaximumLength(200).OverridePropertyName("title");
        RuleFor(command => command.Input.Description).NotEmpty().MaximumLength(2000).OverridePropertyName("description");
        RuleFor(command => command.Input.TimerMinutes).InclusiveBetween(0, 1440).When(command => command.Input.TimerMinutes.HasValue).OverridePropertyName("timerMinutes");
    }
}

public sealed class DeleteRecipeStepCommandValidator : AbstractValidator<DeleteRecipeStepCommand>
{
    public DeleteRecipeStepCommandValidator() { RuleFor(command => command.RecipeId).NotEmpty(); RuleFor(command => command.Id).NotEmpty(); }
}

public sealed class UploadRecipeImageCommandValidator : AbstractValidator<UploadRecipeImageCommand>
{
    public UploadRecipeImageCommandValidator()
    {
        RuleFor(command => command.RecipeId).NotEmpty();
        RuleFor(command => command.CurrentUserId).NotEmpty();
        RuleFor(command => command.Content).NotEmpty().Must(content => content.Length <= 5 * 1024 * 1024)
            .WithMessage("Ảnh tải lên tối đa 5 MB.").OverridePropertyName("file");
        RuleFor(command => command.AltText).MaximumLength(300).OverridePropertyName("altText");
    }
}

public sealed class UpdateRecipeImageCommandValidator : AbstractValidator<UpdateRecipeImageCommand>
{
    public UpdateRecipeImageCommandValidator()
    {
        RuleFor(command => command.RecipeId).NotEmpty();
        RuleFor(command => command.ImageId).NotEmpty();
        RuleFor(command => command.CurrentUserId).NotEmpty();
        RuleFor(command => command.AltText).MaximumLength(300).OverridePropertyName("altText");
        RuleFor(command => command.OrderIndex).InclusiveBetween(0, 10000).When(command => command.OrderIndex.HasValue).OverridePropertyName("orderIndex");
    }
}

public sealed class DeleteRecipeImageCommandValidator : AbstractValidator<DeleteRecipeImageCommand>
{
    public DeleteRecipeImageCommandValidator() { RuleFor(command => command.RecipeId).NotEmpty(); RuleFor(command => command.ImageId).NotEmpty(); }
}
