using System.Security.Claims;
using System.Text.Json;
using CulinaryBlog.API.Endpoints;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Exceptions;
using CulinaryBlog.Infrastructure.Persistence;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace CulinaryBlog.API.Tests;

public sealed class RecipeLifecycleTests : IAsyncLifetime
{
    private SqliteConnection _connection = null!;
    private TestApplicationDbContext _context = null!;
    private TestCacheService _cache = null!;
    private ApplicationUser _owner = null!;
    private Category _category = null!;

    public async Task InitializeAsync()
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        await _connection.OpenAsync();
        var options = new DbContextOptionsBuilder<ApplicationDbContext>().UseSqlite(_connection).Options;
        _context = new TestApplicationDbContext(options);
        await _context.Database.EnsureCreatedAsync();
        _cache = new TestCacheService();
        _owner = ApplicationUser.Create("Recipe Owner", "owner@example.com", "owner");
        _owner.Id = "owner-id";
        _category = new Category { Name = "Dinner", Description = "Dinner recipes" };
        _context.Users.Add(_owner);
        _context.Categories.Add(_category);
        await _context.SaveChangesAsync();
    }

    public async Task DisposeAsync()
    {
        await _context.DisposeAsync();
        await _connection.DisposeAsync();
    }

    [Fact]
    public void DomainTransitions_AreValidAndIdempotent()
    {
        var recipe = CreateRecipe();
        Assert.Equal(RecipeStatus.Draft, recipe.Status);
        Assert.Throws<ValidationException>(() => recipe.Publish(false, true));
        Assert.Throws<ValidationException>(() => recipe.Publish(true, false));

        Assert.True(recipe.Publish(true, true));
        Assert.False(recipe.Publish(true, true));
        Assert.Equal(RecipeStatus.Published, recipe.Status);
        Assert.True(recipe.Unpublish());
        Assert.False(recipe.Unpublish());
        Assert.True(recipe.Archive());
        Assert.False(recipe.Archive());
        Assert.Throws<ValidationException>(() => recipe.Unpublish());
        Assert.True(recipe.RestoreToDraft());
        Assert.False(recipe.RestoreToDraft());
    }

    [Fact]
    public async Task PublishRecipe_RequiresPersistedUsableIngredientAndStep()
    {
        var recipe = CreateRecipe();
        _context.Recipes.Add(recipe);
        await _context.SaveChangesAsync();
        var controller = CreateRecipesHandlers(_owner.Id);

        await Assert.ThrowsAsync<ValidationException>(() => controller.PublishRecipe(recipe.Id));

        _context.RecipeIngredients.Add(RecipeIngredient.Create(recipe.Id, "Tomato", "2", "pcs", null, 1));
        await _context.SaveChangesAsync();
        await Assert.ThrowsAsync<ValidationException>(() => controller.PublishRecipe(recipe.Id));

        _context.RecipeSteps.Add(RecipeStep.Create(recipe.Id, null, "Roast until tender", 1, 20, null));
        await _context.SaveChangesAsync();
        ResponseAssert.Status(200, await controller.PublishRecipe(recipe.Id));
        Assert.Equal(RecipeStatus.Published, recipe.Status);
    }

    [Fact]
    public async Task TransitionEndpoints_CoverUnpublishArchiveAndRestore()
    {
        var recipe = CreateRecipe();
        recipe.Publish(true, true);
        _context.Recipes.Add(recipe);
        await _context.SaveChangesAsync();
        var controller = CreateRecipesHandlers(_owner.Id);

        ResponseAssert.Status(200, await controller.UnpublishRecipe(recipe.Id));
        Assert.Equal(RecipeStatus.Draft, recipe.Status);
        ResponseAssert.Status(200, await controller.ArchiveRecipe(recipe.Id));
        Assert.Equal(RecipeStatus.Archived, recipe.Status);
        ResponseAssert.Status(200, await controller.RestoreRecipe(recipe.Id));
        Assert.Equal(RecipeStatus.Draft, recipe.Status);
    }

    [Fact]
    public async Task DeleteRecipe_IsSoftAndHiddenFromPublicIdAndSlugRoutes()
    {
        var recipe = CreateRecipe();
        recipe.Publish(true, true);
        _context.Recipes.Add(recipe);
        await _context.SaveChangesAsync();
        var controller = CreateRecipesHandlers(_owner.Id);

        ResponseAssert.Status(200, await controller.DeleteRecipe(recipe.Id));
        Assert.True(recipe.IsDeleted);
        Assert.NotNull(recipe.DeletedAt);
        ResponseAssert.Status(404, (await controller.GetRecipeById(recipe.Id)));
        ResponseAssert.Status(404, (await controller.GetRecipeBySlug(recipe.Slug)));
        Assert.True(await _context.Recipes.AnyAsync(item => item.Id == recipe.Id));
    }

    [Fact]
    public async Task DeleteRecipe_RejectsNonOwner()
    {
        var recipe = CreateRecipe();
        _context.Recipes.Add(recipe);
        await _context.SaveChangesAsync();
        var controller = CreateRecipesHandlers("other-user");

        ResponseAssert.Status(403, await controller.DeleteRecipe(recipe.Id));
        Assert.False(recipe.IsDeleted);
    }

    [Fact]
    public async Task PublishRecipe_RejectsNonOwner()
    {
        var recipe = CreateRecipe();
        _context.Recipes.Add(recipe);
        _context.RecipeIngredients.Add(RecipeIngredient.Create(recipe.Id, "Tomato", "2", "pcs", null, 1));
        _context.RecipeSteps.Add(RecipeStep.Create(recipe.Id, null, "Roast until tender", 1, null, null));
        await _context.SaveChangesAsync();

        ResponseAssert.Status(403, await CreateRecipesHandlers("other-user").PublishRecipe(recipe.Id));
        Assert.Equal(RecipeStatus.Draft, recipe.Status);
    }

    [Fact]
    public async Task PatchNutrition_OmittedKeepsNullClearsAndObjectReplaces()
    {
        var recipe = CreateRecipe();
        recipe.SetNutrition(new RecipeNutrition(300, 12, 45, 8, 6, 250));
        _context.Recipes.Add(recipe);
        await _context.SaveChangesAsync();
        var controller = CreateRecipesHandlers(_owner.Id);

        var omitted = await controller.PatchRecipe(recipe.Id, new PatchRecipeDto());
        ResponseAssert.Status(200, omitted);
        Assert.Equal(300, recipe.Nutrition?.Calories);

        using (var nullJson = JsonDocument.Parse("null"))
        {
            await controller.PatchRecipe(recipe.Id, new PatchRecipeDto { Nutrition = nullJson.RootElement.Clone() });
        }
        Assert.Null(recipe.Nutrition);

        using (var objectJson = JsonDocument.Parse("{\"calories\":420,\"protein\":18,\"carbohydrates\":55,\"fat\":12,\"fiber\":11,\"sodium\":340}"))
        {
            await controller.PatchRecipe(recipe.Id, new PatchRecipeDto { Nutrition = objectJson.RootElement.Clone() });
        }
        Assert.Equal(420, recipe.Nutrition?.Calories);
    }

    [Fact]
    public async Task DeleteStep_RenumbersRemainingStepsWithoutGaps()
    {
        var recipe = CreateRecipe();
        _context.Recipes.Add(recipe);
        var first = RecipeStep.Create(recipe.Id, null, "First", 1, null, null);
        var removed = RecipeStep.Create(recipe.Id, null, "Remove", 2, null, null);
        var third = RecipeStep.Create(recipe.Id, null, "Third", 3, null, null);
        _context.RecipeSteps.AddRange(first, removed, third);
        await _context.SaveChangesAsync();
        var controller = new RecipeStepsHandlers(_context)
        {
            HttpContext = CreateHttpContext(_owner.Id)
        };

        ResponseAssert.Status(200, await controller.DeleteStep(recipe.Id, removed.Id));
        var remaining = await _context.RecipeSteps.Where(step => step.RecipeId == recipe.Id)
            .OrderBy(step => step.StepNumber).ToListAsync();
        Assert.Equal([1, 2], remaining.Select(step => step.StepNumber).ToArray());
        Assert.Equal(["First", "Third"], remaining.Select(step => step.Description).ToArray());
    }

    [Fact]
    public async Task CreateStep_AllowsAnUntitledStepAndAssignsItsNumber()
    {
        var recipe = CreateRecipe();
        _context.Recipes.Add(recipe);
        await _context.SaveChangesAsync();
        var controller = new RecipeStepsHandlers(_context)
        {
            HttpContext = CreateHttpContext(_owner.Id)
        };

        ResponseAssert.Status(201, await controller.CreateStep(recipe.Id, new CreateRecipeStepDto
        {
            Description = "Nướng rau trong 20 phút."
        }));
        var step = await _context.RecipeSteps.SingleAsync();
        Assert.Null(step.Title);
        Assert.Equal(1, step.StepNumber);
    }

    [Fact]
    public async Task GetSteps_HidesAnotherAuthorsDraft()
    {
        var recipe = CreateRecipe();
        _context.Recipes.Add(recipe);
        _context.RecipeSteps.Add(RecipeStep.Create(recipe.Id, null, "Bước riêng tư", 1, null, null));
        await _context.SaveChangesAsync();
        var controller = new RecipeStepsHandlers(_context)
        {
            HttpContext = CreateHttpContext("other-user")
        };

        ResponseAssert.Status(404, await controller.GetSteps(recipe.Id));
    }

    private Recipe CreateRecipe() => Recipe.Create(
        "Roasted vegetables",
        "A simple roasted vegetable recipe.",
        [],
        [],
        _category.Id,
        _owner.Id,
        prepTimeMinutes: 10,
        cookTimeMinutes: 20,
        servings: 2,
        difficulty: "Easy");

    private RecipesHandlers CreateRecipesHandlers(string userId)
    {
        var controller = new RecipesHandlers(new Mock<IMediator>().Object, _context, _cache)
        {
            HttpContext = CreateHttpContext(userId)
        };
        return controller;
    }

    private static DefaultHttpContext CreateHttpContext(string userId) => new()
    {
            User = new ClaimsPrincipal(new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, userId)], "Test"))
    };

    private sealed class TestApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : ApplicationDbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Recipe>().Ignore(recipe => recipe.SearchVector);
        }
    }

    private sealed class TestCacheService : ICacheService
    {
        public Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default) => Task.FromResult(default(T));
        public Task SetAsync<T>(string key, T value, TimeSpan? expiry = null, CancellationToken cancellationToken = default) => Task.CompletedTask;
        public Task RemoveAsync(string key, CancellationToken cancellationToken = default) => Task.CompletedTask;
    }
}
