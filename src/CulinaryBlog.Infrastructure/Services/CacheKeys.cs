namespace CulinaryBlog.Infrastructure.Services;

public static class CacheKeys
{
    public static string Categories => CulinaryBlog.Application.Interfaces.CacheKeys.Categories;
    public static string Category(Guid id) => CulinaryBlog.Application.Interfaces.CacheKeys.Category(id);
    public static string Recipes => CulinaryBlog.Application.Interfaces.CacheKeys.Recipes;
    public static string Recipe(Guid id) => CulinaryBlog.Application.Interfaces.CacheKeys.Recipe(id);
    public static string RecipeBySlug(string slug) => CulinaryBlog.Application.Interfaces.CacheKeys.RecipeBySlug(slug);
    public static string Search(string query, int page, int pageSize) => $"search:{query.Trim().ToLowerInvariant()}:{page}:{pageSize}";
}
