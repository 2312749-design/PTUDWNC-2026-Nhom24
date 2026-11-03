using CulinaryBlog.API.Endpoints;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace CulinaryBlog.API.Tests;

public sealed class SearchContractTests : IAsyncLifetime
{
    private SqliteConnection _connection = null!;
    private TestApplicationDbContext _context = null!;
    private Category _vietnamese = null!;
    private Category _international = null!;

    public async Task InitializeAsync()
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        await _connection.OpenAsync();
        var options = new DbContextOptionsBuilder<ApplicationDbContext>().UseSqlite(_connection).Options;
        _context = new TestApplicationDbContext(options);
        await _context.Database.EnsureCreatedAsync();

        var author = ApplicationUser.Create("Search chef", "search@example.com", "searchchef");
        author.Id = "search-chef";
        _vietnamese = Category.Create("Món Việt", "Vietnamese recipes", null);
        _international = Category.Create("Món Âu", "International recipes", null);
        _context.AddRange(author, _vietnamese, _international);
        _context.Recipes.AddRange(
            CreatePublished("Bún chả Hà Nội", _vietnamese, "Easy", true, 25, 2, ["bún", "thịt nướng"]),
            CreatePublished("Bún bò Huế", _vietnamese, "Hard", false, 70, 4, ["bún", "bò"]),
            CreatePublished("Canh rau", _vietnamese, "Easy", true, 15, 3, ["rau", "đậu hũ"]),
            CreatePublished("Canh bí đỏ", _international, "Medium", true, 35, 2, ["bí đỏ"]),
            CreatePublished("Pasta rau củ", _international, "Easy", true, 20, 2, ["pasta", "rau"]));
        await _context.SaveChangesAsync();
    }

    public async Task DisposeAsync()
    {
        await _context.DisposeAsync();
        await _connection.DisposeAsync();
    }

    [Theory]
    [InlineData("bún")]
    [InlineData("bun")]
    public async Task Search_AcceptsVietnameseWithOrWithoutAccents(string keyword)
    {
        var response = await CreateHandler().SearchRecipes(q: keyword);

        ResponseAssert.Status(200, response);
        Assert.Equal(["Bún bò Huế", "Bún chả Hà Nội"], Items(response).Select(recipe => recipe.Title).ToArray());
    }

    [Fact]
    public async Task Search_CombinesAllFiltersWithAnd()
    {
        var response = await CreateHandler().SearchRecipes(
            q: "bun",
            categoryId: _vietnamese.Id,
            maxMinutes: 30,
            difficulty: "Easy",
            vegetarian: true,
            minServings: 2);

        ResponseAssert.Status(200, response);
        var recipe = Assert.Single(Items(response));
        Assert.Equal("Bún chả Hà Nội", recipe.Title);
    }

    [Fact]
    public async Task Search_SortsByCookTimeAndUsesStablePaging()
    {
        var descending = await CreateHandler().SearchRecipes(sortBy: "cookTimeMinutes", sortOrder: "desc", pageSize: 2);
        ResponseAssert.Status(200, descending);
        Assert.Equal([70, 35], Items(descending).Select(recipe => recipe.CookTimeMinutes).ToArray());

        var defaultPage = await CreateHandler().SearchRecipes();
        var firstPage = await CreateHandler().SearchRecipes(page: 1, pageSize: 2);
        var secondPage = await CreateHandler().SearchRecipes(page: 2, pageSize: 2);
        var thirdPage = await CreateHandler().SearchRecipes(page: 3, pageSize: 2);
        var pagedIds = Items(firstPage).Concat(Items(secondPage)).Concat(Items(thirdPage)).Select(recipe => recipe.Id).ToArray();
        var expectedIds = await _context.Recipes.OrderBy(recipe => recipe.Title).ThenBy(recipe => recipe.Id)
            .Select(recipe => recipe.Id).ToArrayAsync();

        Assert.Equal(expectedIds, pagedIds);
        Assert.Equal(12, IntValue(defaultPage, "pageSize"));
    }

    [Theory]
    [InlineData("q")]
    [InlineData("sortBy")]
    [InlineData("sortOrder")]
    [InlineData("page")]
    [InlineData("pageSize")]
    public async Task Search_RejectsInvalidParametersWith422(string invalidField)
    {
        var handler = CreateHandler();
        var response = invalidField switch
        {
            "q" => await handler.SearchRecipes(q: "b"),
            "sortBy" => await handler.SearchRecipes(sortBy: "rating"),
            "sortOrder" => await handler.SearchRecipes(sortOrder: "sideways"),
            "page" => await handler.SearchRecipes(page: 0),
            _ => await handler.SearchRecipes(pageSize: 51)
        };

        ResponseAssert.Status(422, response);
        var errors = response.Value?.GetType().GetProperty("errors")?.GetValue(response.Value) as Dictionary<string, string[]>;
        Assert.NotNull(errors);
        Assert.True(errors!.ContainsKey(invalidField));
    }

    private SearchHandlers CreateHandler() => new(_context);

    private static Recipe CreatePublished(string title, Category category, string difficulty, bool vegetarian, int cookMinutes, int servings, List<string> ingredients)
    {
        var recipe = Recipe.Create(title, $"Mô tả cho {title}", ingredients, ["Nấu chín và thưởng thức"], category.Id, "search-chef",
            prepTimeMinutes: 5, cookTimeMinutes: cookMinutes, servings: servings, difficulty: difficulty, isVegetarian: vegetarian);
        recipe.Publish(true, true);
        return recipe;
    }

    private static IReadOnlyList<RecipeDto> Items(ApiResponseResult response) =>
        ((IEnumerable<RecipeDto>)response.Value!.GetType().GetProperty("items")!.GetValue(response.Value)!).ToArray();

    private static int IntValue(ApiResponseResult response, string property) =>
        (int)response.Value!.GetType().GetProperty(property)!.GetValue(response.Value)!;

    private sealed class TestApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : ApplicationDbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Recipe>().Ignore("SearchVector");
        }
    }
}
