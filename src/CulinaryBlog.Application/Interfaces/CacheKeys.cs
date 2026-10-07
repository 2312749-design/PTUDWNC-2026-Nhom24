namespace CulinaryBlog.Application.Interfaces;

public static class CacheKeys
{
    public const string Categories = "categories:all";
    public const string Recipes = "recipes:published";

    public static string Category(Guid id) => $"category:{id}";
    public static string Recipe(Guid id) => $"recipe:{id}";
    public static string RecipeBySlug(string slug) => $"recipe:slug:{slug}";
}
