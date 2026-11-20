using CulinaryBlog.Application.Models;

namespace CulinaryBlog.Application.Interfaces;

public interface IRecipeSearchService
{
    Task<RecipeSearchResult> SearchAsync(RecipeSearchCriteria criteria, CancellationToken cancellationToken = default);
}
