using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace CulinaryBlog.API.Tests;

public sealed class DemoActivitySeederTests : IAsyncLifetime
{
    private SqliteConnection _connection = null!;
    private TestApplicationDbContext _context = null!;
    private ApplicationUser _admin = null!;

    public async Task InitializeAsync()
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        await _connection.OpenAsync();
        var options = new DbContextOptionsBuilder<ApplicationDbContext>().UseSqlite(_connection).Options;
        _context = new TestApplicationDbContext(options);
        await _context.Database.EnsureCreatedAsync();

        _admin = ApplicationUser.Create("Demo Admin", "admin@culinaryblog.com", "chefdemo");
        _admin.Id = "demo-admin";
        _context.Users.Add(_admin);
        _context.Categories.AddRange(DemoCategoryNames.Select(name => Category.Create(name, $"Danh mục {name}", null)));
        await _context.SaveChangesAsync();
    }

    public async Task DisposeAsync()
    {
        await _context.DisposeAsync();
        await _connection.DisposeAsync();
    }

    [Fact]
    public async Task SeededRecipes_MeetLabTwoMinimumContentBeforeAnyArePublished()
    {
        await DemoActivitySeeder.SeedAsync(_context, _admin);

        var recipes = await _context.Recipes.ToListAsync();

        Assert.Equal(24, recipes.Count);
        Assert.All(recipes, recipe =>
        {
            Assert.True(recipe.Ingredients.Count >= Recipe.MinimumIngredientCount);
            Assert.True(recipe.Instructions.Count >= Recipe.MinimumStepCount);
        });
        var recipeIds = recipes.Select(recipe => recipe.Id).ToHashSet();
        var ingredientCounts = await _context.RecipeIngredients
            .Where(ingredient => recipeIds.Contains(ingredient.RecipeId))
            .GroupBy(ingredient => ingredient.RecipeId)
            .Select(group => new { RecipeId = group.Key, Count = group.Count() })
            .ToDictionaryAsync(group => group.RecipeId, group => group.Count);
        var stepCounts = await _context.RecipeSteps
            .Where(step => recipeIds.Contains(step.RecipeId))
            .GroupBy(step => step.RecipeId)
            .Select(group => new { RecipeId = group.Key, Count = group.Count() })
            .ToDictionaryAsync(group => group.RecipeId, group => group.Count);

        Assert.All(recipes, recipe =>
        {
            Assert.True(ingredientCounts.GetValueOrDefault(recipe.Id) >= Recipe.MinimumIngredientCount);
            Assert.True(stepCounts.GetValueOrDefault(recipe.Id) >= Recipe.MinimumStepCount);
        });
        Assert.Contains(recipes, recipe => recipe.Status == RecipeStatus.Published);
        Assert.Contains(recipes, recipe => recipe.Status == RecipeStatus.Archived);
    }

    private static readonly string[] DemoCategoryNames =
    [
        "Món Việt", "Món chay", "Món xào", "Món nướng", "Món kho", "Món canh", "Món súp", "Món lẩu",
        "Bánh ngọt", "Đồ uống", "Món ăn nhanh", "Món thập cẩm", "Món gỏi", "Món cay", "Món chiên", "Món hấp",
        "Món tráng miệng", "Bánh mì", "Món biển", "Món từ thịt"
    ];

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
