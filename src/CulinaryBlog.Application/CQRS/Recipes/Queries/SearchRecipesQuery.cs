using CulinaryBlog.Application.Models;
using MediatR;

namespace CulinaryBlog.Application.CQRS.Recipes.Queries;

public sealed record SearchRecipesQuery(
    string? Query,
    Guid? CategoryId,
    int? MaxMinutes,
    string? Difficulty,
    bool? Vegetarian,
    string? Ingredient,
    int? MinServings,
    string? SortBy,
    string? SortOrder,
    int Page = 1,
    int PageSize = 12) : IRequest<RecipeSearchResult>;
