using CulinaryBlog.Application.CQRS.Recipes.Queries;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Application.Models;
using MediatR;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace CulinaryBlog.Application.CQRS.Recipes.Handlers;

public sealed class SearchRecipesQueryHandler(IRecipeSearchService searchService, ICacheService cache)
    : IRequestHandler<SearchRecipesQuery, RecipeSearchResult>
{
    public async Task<RecipeSearchResult> Handle(SearchRecipesQuery request, CancellationToken cancellationToken)
    {
        var criteria = new RecipeSearchCriteria(
            request.Query,
            request.CategoryId,
            request.MaxMinutes,
            request.Difficulty,
            request.Vegetarian,
            request.Ingredient,
            request.MinServings,
            request.SortBy?.Trim() ?? "title",
            request.SortOrder?.Trim() ?? "asc",
            request.Page,
            request.PageSize);
        var version = await cache.GetAsync<string>(CacheKeys.SearchVersion, cancellationToken) ?? "initial";
        var hash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(JsonSerializer.Serialize(criteria))));
        // v5 uses the displayed total preparation + cooking time for filtering.
        var key = $"recipes:search:v5:{version}:{hash}";
        var cached = await cache.GetAsync<RecipeSearchResult>(key, cancellationToken);
        if (cached is not null) return cached;
        var result = await searchService.SearchAsync(criteria, cancellationToken);
        await cache.SetAsync(key, result, TimeSpan.FromMinutes(1), cancellationToken);
        return result;
    }
}
