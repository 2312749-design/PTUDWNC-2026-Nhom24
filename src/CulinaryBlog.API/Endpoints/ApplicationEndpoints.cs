namespace CulinaryBlog.API.Endpoints;

public static class ApplicationEndpoints
{
    public static IServiceCollection AddApplicationHandlers(this IServiceCollection services)
    {
        services.AddScoped<AccountHandlers>();
        services.AddScoped<ArticlesHandlers>();
        services.AddScoped<AuthHandlers>();
        services.AddScoped<CategoriesHandlers>();
        services.AddScoped<CommunityHandlers>();
        services.AddScoped<OpenAIHandlers>();
        services.AddScoped<RecipeFeaturesHandlers>();
        services.AddScoped<RecipeIngredientsHandlers>();
        services.AddScoped<RecipesHandlers>();
        services.AddScoped<RecipeStepsHandlers>();
        services.AddScoped<SearchHandlers>();
        services.AddScoped<TestHandlers>();
        return services;
    }
    public static void MapApplicationEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapAdmin();
        app.MapAccount();
        app.MapArticles();
        app.MapAuth();
        app.MapCategories();
        app.MapCommunity();
        app.MapOpenAI();
        app.MapRecipeFeatures();
        app.MapRecipeIngredients();
        app.MapRecipes();
        app.MapRecipeSteps();
        app.MapSearch();
        app.MapTest();
    }
}
