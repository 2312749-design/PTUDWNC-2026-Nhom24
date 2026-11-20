using System.Security.Claims;
using CulinaryBlog.API.Authorization;
using CulinaryBlog.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Xunit;

namespace CulinaryBlog.API.Tests;

public sealed class RecipeAuthorizationHandlerTests
{
    private readonly RecipeAuthorizationHandler _handler = new();

    [Fact]
    public async Task Owner_CanUpdateOwnRecipe()
    {
        var recipe = Recipe.Create("Owner recipe", "Description", [], [], Guid.NewGuid(), "owner");
        var context = Context("owner", "Author", RecipeOperations.Update, recipe);

        await _handler.HandleAsync(context);

        Assert.True(context.HasSucceeded);
    }

    [Fact]
    public async Task AnotherAuthor_CannotUpdateRecipe()
    {
        var recipe = Recipe.Create("Private recipe", "Description", [], [], Guid.NewGuid(), "owner");
        var context = Context("other", "Author", RecipeOperations.Update, recipe);

        await _handler.HandleAsync(context);

        Assert.False(context.HasSucceeded);
    }

    [Fact]
    public async Task Admin_CanDeleteAnyRecipe()
    {
        var recipe = Recipe.Create("Admin recipe", "Description", [], [], Guid.NewGuid(), "owner");
        var context = Context("admin", "Admin", RecipeOperations.Delete, recipe);

        await _handler.HandleAsync(context);

        Assert.True(context.HasSucceeded);
    }

    private static AuthorizationHandlerContext Context(
        string userId,
        string role,
        IAuthorizationRequirement requirement,
        Recipe recipe) => new(
            [requirement],
            new ClaimsPrincipal(new ClaimsIdentity([
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Role, role)
            ], "Test")),
            recipe);
}
