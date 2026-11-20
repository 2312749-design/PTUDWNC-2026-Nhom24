using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace CulinaryBlog.API.Tests;

public sealed class DataSeederRecipeContentTests : IAsyncLifetime
{
    private SqliteConnection _connection = null!;
    private TestApplicationDbContext _context = null!;

    public async Task InitializeAsync()
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        await _connection.OpenAsync();
        _context = new TestApplicationDbContext(
            new DbContextOptionsBuilder<ApplicationDbContext>().UseSqlite(_connection).Options);
        await _context.Database.EnsureCreatedAsync();
    }

    public async Task DisposeAsync()
    {
        await _context.DisposeAsync();
        await _connection.DisposeAsync();
    }

    [Fact]
    public async Task ExistingRecipes_AreNormalizedIntoStructuredRows_Idempotently()
    {
        var author = ApplicationUser.Create("Existing Author", "existing@author.test", "existingauthor");
        author.Id = "existing-author";
        var category = Category.Create("Món thử nghiệm", "Danh mục kiểm thử", null);
        var recipe = Recipe.Create(
            "Cá thu sốt cà",
            "Công thức cũ chỉ lưu danh sách dạng mảng.",
            ["300g cá thu", "2 quả cà chua"],
            ["Làm sạch cá thu.", "Kho cá cùng cà chua."],
            category.Id,
            author.Id);

        _context.AddRange(author, category, recipe);
        await _context.SaveChangesAsync();

        await DataSeeder.SeedDataAsync(_context);
        await DataSeeder.SeedDataAsync(_context);

        var ingredients = await _context.RecipeIngredients
            .Where(item => item.RecipeId == recipe.Id)
            .OrderBy(item => item.OrderIndex)
            .ToListAsync();
        var steps = await _context.RecipeSteps
            .Where(item => item.RecipeId == recipe.Id)
            .OrderBy(item => item.StepNumber)
            .ToListAsync();
        var normalized = await _context.Recipes.SingleAsync(item => item.Id == recipe.Id);

        Assert.True(ingredients.Count >= Recipe.MinimumIngredientCount);
        Assert.True(steps.Count >= Recipe.MinimumStepCount);
        Assert.Contains(ingredients, item => item.Name == "300g cá thu");
        Assert.Contains(steps, item => item.Description == "Kho cá cùng cà chua.");
        Assert.True(normalized.Ingredients.Count >= Recipe.MinimumIngredientCount);
        Assert.True(normalized.Instructions.Count >= Recipe.MinimumStepCount);
        Assert.Equal(Enumerable.Range(1, ingredients.Count), ingredients.Select(item => item.OrderIndex));
        Assert.Equal(Enumerable.Range(1, steps.Count), steps.Select(item => item.StepNumber));
    }

    [Fact]
    public async Task CompleteCatalog_MeetsLabTwoMinimums()
    {
        await DataSeeder.SeedDataAsync(_context);
        var admin = await _context.Users.SingleAsync(user => user.UserName == "chefdemo");
        await RecipeCatalogSeeder.SeedDataAsync(_context, admin);
        await ExpandedDemoDataSeeder.SeedAsync(_context, admin);

        var firstCounts = (await _context.Categories.CountAsync(), await _context.Recipes.CountAsync(),
            await _context.RecipeIngredients.CountAsync(), await _context.RecipeSteps.CountAsync());
        await DataSeeder.SeedDataAsync(_context);
        await RecipeCatalogSeeder.SeedDataAsync(_context, admin);
        await ExpandedDemoDataSeeder.SeedAsync(_context, admin);
        Assert.Equal(firstCounts, (await _context.Categories.CountAsync(), await _context.Recipes.CountAsync(),
            await _context.RecipeIngredients.CountAsync(), await _context.RecipeSteps.CountAsync()));

        Assert.True(await _context.Categories.CountAsync() >= 20);
        var recipes = await _context.Recipes.Where(recipe => !recipe.IsDeleted).ToListAsync();
        Assert.True(recipes.Count >= 100);
        foreach (var recipe in recipes)
        {
            Assert.True(recipe.Ingredients.Count >= 10, recipe.Title);
            Assert.True(recipe.Instructions.Count >= 5, recipe.Title);
            Assert.True(await _context.RecipeIngredients.CountAsync(item => item.RecipeId == recipe.Id && item.Name.Trim() != "") >= 10, recipe.Title);
            Assert.True(await _context.RecipeSteps.CountAsync(item => item.RecipeId == recipe.Id && item.Description.Trim() != "") >= 5, recipe.Title);
        }
    }

    [Fact]
    public async Task CatalogRestart_DoesNotPadUserCreatedSimpleRecipes()
    {
        await DataSeeder.SeedDataAsync(_context);
        var admin = await _context.Users.SingleAsync(user => user.UserName == "chefdemo");
        var author = ApplicationUser.Create("Real author", "author@example.test", "realauthor");
        author.Id = "real-author";
        _context.Users.Add(author);
        var category = await _context.Categories.FirstAsync();
        var recipe = Recipe.Create("Simple user recipe", "User-owned content", ["Water"], ["Boil water"], category.Id, author.Id);
        _context.Recipes.Add(recipe);
        await _context.SaveChangesAsync();
        await RecipeCatalogSeeder.SeedDataAsync(_context, admin);
        Assert.Single(recipe.Ingredients);
        Assert.Single(recipe.Instructions);
    }

    [Fact]
    public async Task FreshBaseCatalog_CreatesStructuredRowsForEverySeededRecipe()
    {
        await DataSeeder.SeedDataAsync(_context);

        var recipes = await _context.Recipes.ToListAsync();
        var ingredientCounts = await _context.RecipeIngredients
            .GroupBy(item => item.RecipeId)
            .Select(group => new { RecipeId = group.Key, Count = group.Count() })
            .ToDictionaryAsync(item => item.RecipeId, item => item.Count);
        var stepCounts = await _context.RecipeSteps
            .GroupBy(item => item.RecipeId)
            .Select(group => new { RecipeId = group.Key, Count = group.Count() })
            .ToDictionaryAsync(item => item.RecipeId, item => item.Count);

        Assert.Equal(100, recipes.Count);
        Assert.All(recipes, recipe =>
        {
            Assert.True(recipe.Ingredients.Count >= Recipe.MinimumIngredientCount);
            Assert.True(recipe.Instructions.Count >= Recipe.MinimumStepCount);
            Assert.True(ingredientCounts.GetValueOrDefault(recipe.Id) >= Recipe.MinimumIngredientCount);
            Assert.True(stepCounts.GetValueOrDefault(recipe.Id) >= Recipe.MinimumStepCount);
        });
    }

    [Fact]
    public async Task RepeatedSeed_PreservesExistingDemoAccountPasswordRoleAndProfile()
    {
        var existing = ApplicationUser.Create("Tên hồ sơ đã cập nhật", "admin@culinaryblog.com", "chefdemo");
        existing.Role = "Author";
        existing.Bio = "Hồ sơ do người dùng tự cập nhật.";
        existing.AvatarUrl = "/uploads/avatars/existing.webp";
        var hasher = new PasswordHasher<ApplicationUser>();
        existing.PasswordHash = hasher.HashPassword(existing, "ChangedByOwner@2026");
        var originalHash = existing.PasswordHash;
        _context.Users.Add(existing);
        await _context.SaveChangesAsync();

        await DataSeeder.SeedDataAsync(_context);
        await DataSeeder.SeedDataAsync(_context);

        var persisted = await _context.Users.SingleAsync(user => user.Id == existing.Id);
        Assert.Equal(originalHash, persisted.PasswordHash);
        Assert.NotEqual(PasswordVerificationResult.Failed,
            hasher.VerifyHashedPassword(persisted, persisted.PasswordHash!, "ChangedByOwner@2026"));
        Assert.Equal("Author", persisted.Role);
        Assert.Equal("Tên hồ sơ đã cập nhật", persisted.FullName);
        Assert.Equal("Hồ sơ do người dùng tự cập nhật.", persisted.Bio);
        Assert.Equal("/uploads/avatars/existing.webp", persisted.AvatarUrl);
    }

    [Fact]
    public async Task FreshSeed_CreatesDemoAdministratorWithInitialCredentials()
    {
        await DataSeeder.SeedDataAsync(_context);

        var admin = await _context.Users.SingleAsync(user => user.UserName == "chefdemo");
        Assert.Equal("Admin", admin.Role);
        Assert.NotEqual(PasswordVerificationResult.Failed,
            new PasswordHasher<ApplicationUser>().VerifyHashedPassword(admin, admin.PasswordHash!, "chefdemo"));
    }

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
