using CulinaryBlog.Application.DTOs;

namespace CulinaryBlog.Application.Models;

public sealed record RecipeSearchCriteria(
    string? Query,
    Guid? CategoryId,
    int? MaxMinutes,
    string? Difficulty,
    bool? Vegetarian,
    string? Ingredient,
    int? MinServings,
    string SortBy,
    string SortOrder,
    int Page,
    int PageSize);

public sealed record RecipeSearchResult(int Total, int Page, int PageSize, IReadOnlyList<RecipeDto> Items);
