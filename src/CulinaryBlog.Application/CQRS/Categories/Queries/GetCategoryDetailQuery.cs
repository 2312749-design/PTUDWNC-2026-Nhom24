using CulinaryBlog.Application.DTOs;
using MediatR;

namespace CulinaryBlog.Application.CQRS.Categories.Queries;

public sealed record GetCategoryDetailQuery(Guid? Id, string? Slug, bool IsAdmin) : IRequest<CategoryDetailDto?>;
public sealed record CategoryDetailDto(CategoryDto Category, int RecipeCount, IReadOnlyList<RecipeDto> Recipes);
