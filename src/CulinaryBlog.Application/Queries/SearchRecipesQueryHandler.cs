using CulinaryBlog.Application.Abstractions.Repositories;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Exceptions;

namespace CulinaryBlog.Application.Queries;

public sealed class SearchRecipesQueryHandler(IRecipeRepository recipeRepository)
{
    public async Task<PaginatedResult<Recipe>> HandleAsync(
        SearchRecipesQuery query,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(query.Keyword) ||
            query.Keyword.Trim().Length < 2)
        {
            throw new ValidationException(
                "Từ khóa tìm kiếm phải có ít nhất 2 ký tự.");
        }

        if (query.Page < 1)
        {
            throw new ValidationException(
                "Trang phải lớn hơn hoặc bằng 1.");
        }

        if (query.PageSize is < 1 or > 100)
        {
            throw new ValidationException(
                "Kích thước trang phải từ 1 đến 100.");
        }

        var (recipes, totalCount) = await recipeRepository.SearchPublishedAsync(
            query.Keyword.Trim(),
            query.Page,
            query.PageSize,
            cancellationToken);
        var totalPages = (int)Math.Ceiling(totalCount / (double)query.PageSize);

        return new PaginatedResult<Recipe>(
            recipes,
            totalCount,
            query.Page,
            totalPages);
    }
}
