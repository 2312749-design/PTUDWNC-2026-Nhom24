using CulinaryBlog.Application.CQRS.Recipes.Queries;
using FluentValidation;

namespace CulinaryBlog.Application.Validation;

public sealed class SearchRecipesQueryValidator : AbstractValidator<SearchRecipesQuery>
{
    private static readonly string[] SortFields = ["title", "createdAt", "cookTimeMinutes"];
    private static readonly string[] Difficulties = ["Easy", "Medium", "Hard", "Expert", "Dễ", "Trung bình", "Khó"];

    public SearchRecipesQueryValidator()
    {
        RuleFor(query => query.Query).MinimumLength(2).OverridePropertyName("q")
            .When(query => !string.IsNullOrWhiteSpace(query.Query));
        RuleFor(query => query.MaxMinutes).GreaterThan(0).OverridePropertyName("maxMinutes")
            .When(query => query.MaxMinutes.HasValue);
        RuleFor(query => query.MinServings).GreaterThan(0).OverridePropertyName("minServings")
            .When(query => query.MinServings.HasValue);
        RuleFor(query => query.Page).GreaterThanOrEqualTo(1).OverridePropertyName("page");
        RuleFor(query => query.PageSize).InclusiveBetween(1, 50).OverridePropertyName("pageSize");
        RuleFor(query => query.SortBy)
            .Must(value => string.IsNullOrWhiteSpace(value) || SortFields.Contains(value, StringComparer.OrdinalIgnoreCase))
            .WithMessage("sortBy chỉ nhận title, createdAt hoặc cookTimeMinutes.")
            .OverridePropertyName("sortBy");
        RuleFor(query => query.SortOrder)
            .Must(value => string.IsNullOrWhiteSpace(value) || value.Equals("asc", StringComparison.OrdinalIgnoreCase) || value.Equals("desc", StringComparison.OrdinalIgnoreCase))
            .WithMessage("sortOrder chỉ nhận asc hoặc desc.")
            .OverridePropertyName("sortOrder");
        RuleFor(query => query.Difficulty)
            .Must(value => string.IsNullOrWhiteSpace(value) || Difficulties.Contains(value, StringComparer.Ordinal))
            .WithMessage("difficulty chỉ nhận Easy, Medium, Hard hoặc Expert.")
            .OverridePropertyName("difficulty");
    }
}
