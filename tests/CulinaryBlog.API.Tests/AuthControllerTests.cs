using CulinaryBlog.API.Controllers;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Hangfire;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Xunit;

namespace CulinaryBlog.API.Tests;

public class AuthControllerTests : IAsyncLifetime
{
    private SqliteConnection _connection = null!;
    private TestApplicationDbContext _context = null!;
    private AuthController _controller = null!;

    public async Task InitializeAsync()
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        await _connection.OpenAsync();
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseSqlite(_connection)
            .Options;
        _context = new TestApplicationDbContext(options);
        await _context.Database.EnsureCreatedAsync();

        var tokenService = new Mock<ITokenService>();
        var backgroundJobs = new Mock<IBackgroundJobClient>();
        _controller = new AuthController(_context, tokenService.Object, backgroundJobs.Object)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(
                        [new Claim(ClaimTypes.NameIdentifier, "user-1")], "Test"))
                }
            }
        };
    }

    public async Task DisposeAsync()
    {
        await _context.DisposeAsync();
        await _connection.DisposeAsync();
    }

    [Fact]
    public void LoginDto_AllowsUsernameWithoutEmail()
    {
        var model = new AuthController.LoginDto
        {
            Username = "chefdemo",
            Email = "",
            Password = "chefdemo"
        };

        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(model, new ValidationContext(model), results, validateAllProperties: true);

        Assert.True(isValid, string.Join("; ", results.Select(r => r.ErrorMessage)));
    }

    [Fact]
    public async Task Refresh_UsedToken_ReplaysAndRevokesEntireFamily()
    {
        var user = ApplicationUser.Create("User", "user@example.com", "user");
        user.Id = "user-1";
        var familyId = Guid.NewGuid().ToString("N");
        var current = RefreshToken.Create(user.Id, "current-token", 30, familyId);
        _context.Users.Add(user);
        _context.RefreshTokens.Add(current);
        await _context.SaveChangesAsync();

        var tokenService = new Mock<ITokenService>();
        tokenService.Setup(service => service.GenerateAccessToken(user)).Returns("access-token");
        tokenService.Setup(service => service.GenerateRefreshToken(user.Id, It.IsAny<string>(), familyId))
            .Returns(RefreshToken.Create(user.Id, "rotated-token", 30, familyId));
        _controller = new AuthController(_context, tokenService.Object, new Mock<IBackgroundJobClient>().Object)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            }
        };

        var firstResponse = await _controller.Refresh(new AuthController.RefreshTokenDto { RefreshToken = "current-token" });
        var replayResponse = await _controller.Refresh(new AuthController.RefreshTokenDto { RefreshToken = "current-token" });

        Assert.IsType<OkObjectResult>(firstResponse);
        var replayResult = Assert.IsType<UnauthorizedObjectResult>(replayResponse);
        Assert.Equal("AUTH_REFRESH_TOKEN_REPLAYED", replayResult.Value?.GetType().GetProperty("code")?.GetValue(replayResult.Value));
        Assert.True(await _context.RefreshTokens.Where(token => token.TokenHash == RefreshToken.Hash("current-token")).Select(token => token.IsUsed).SingleAsync());
        Assert.True(await _context.RefreshTokens.Where(token => token.TokenFamilyId == familyId).AllAsync(token => token.IsRevoked));
    }

    [Fact]
    public async Task SearchRecipes_ExcludesDeletedAndDraftRecipes()
    {
        var user = ApplicationUser.Create("Chef", "chef@example.com", "chef");
        user.Id = "user-search";
        var category = new Category { Name = "Món Việt", Description = "Món Việt" };
        _context.Users.Add(user);
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        var publishedRecipe = Recipe.Create("Bún chả", "Món ngon", ["bún", "thịt"], ["nấu"], category.Id, user.Id, cookingTimeMinutes: 30, difficulty: "Dễ");
        publishedRecipe.Update("Bún chả", "Món ngon", ["bún", "thịt"], ["nấu"], category.Id, "", 30, "Easy", false);
        publishedRecipe.Publish(true, true);

        var draftRecipe = Recipe.Create("Bún chả nháp", "Draf", ["bún"], ["nấu"], category.Id, user.Id, cookingTimeMinutes: 20, difficulty: "Dễ");
        draftRecipe.Update("Bún chả nháp", "Draft", ["bún"], ["nấu"], category.Id, "", 20, "Easy", false);

        var deletedRecipe = Recipe.Create("Bún chả đã xoá", "Đã xoá", ["bún"], ["nấu"], category.Id, user.Id, cookingTimeMinutes: 25, difficulty: "Dễ");
        deletedRecipe.Update("Bún chả đã xoá", "Đã xoá", ["bún"], ["nấu"], category.Id, "", 25, "Easy", false);
        deletedRecipe.Publish(true, true);
        deletedRecipe.SoftDelete();

        _context.Recipes.AddRange(publishedRecipe, draftRecipe, deletedRecipe);
        await _context.SaveChangesAsync();

        var controller = new SearchController(_context);
        var result = await controller.SearchRecipes(q: "bún", page: 1, pageSize: 10);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var total = (int?)ok.Value?.GetType().GetProperty("total")?.GetValue(ok.Value) ?? 0;
        var items = (IEnumerable<RecipeDto>)ok.Value?.GetType().GetProperty("items")?.GetValue(ok.Value)!;

        Assert.Equal(1, total);
        Assert.Single(items);
        Assert.Equal("Bún chả", items.First().Title);
    }

    [Fact]
    public async Task Logout_WithCurrentUserToken_RevokesEntireFamily()
    {
        var user = ApplicationUser.Create("User", "user@example.com", "user");
        user.Id = "user-1";
        var otherUser = ApplicationUser.Create("Other User", "other@example.com", "other");
        otherUser.Id = "user-2";
        var familyId = Guid.NewGuid().ToString("N");
        var current = RefreshToken.Create(user.Id, "current-token", 30, familyId);
        var rotated = RefreshToken.Create(user.Id, "rotated-token", 30, familyId);
        var otherToken = RefreshToken.Create(otherUser.Id, "other-user-token", 30, familyId);
        _context.Users.AddRange(user, otherUser);
        _context.RefreshTokens.AddRange(current, rotated, otherToken);
        await _context.SaveChangesAsync();

        var result = await _controller.Logout(new AuthController.RefreshTokenDto
        {
            RefreshToken = "current-token"
        });

        Assert.IsType<NoContentResult>(result);
        Assert.True(await _context.RefreshTokens.Where(token => token.Id == current.Id).Select(token => token.IsRevoked).SingleAsync());
        Assert.True(await _context.RefreshTokens.Where(token => token.Id == rotated.Id).Select(token => token.IsRevoked).SingleAsync());
        Assert.False(await _context.RefreshTokens.Where(token => token.Id == otherToken.Id).Select(token => token.IsRevoked).SingleAsync());
    }

    [Fact]
    public async Task Logout_WithTokenFromAnotherUser_DoesNotRevokeToken()
    {
        var user = ApplicationUser.Create("Other User", "other@example.com", "other");
        user.Id = "user-2";
        var otherUser = RefreshToken.Create(user.Id, "other-user-token", 30);
        _context.Users.Add(user);
        _context.RefreshTokens.Add(otherUser);
        await _context.SaveChangesAsync();

        var result = await _controller.Logout(new AuthController.RefreshTokenDto
        {
            RefreshToken = "other-user-token"
        });

        Assert.IsType<NoContentResult>(result);
        Assert.False(otherUser.IsRevoked);
    }

    private sealed class TestApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : ApplicationDbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Recipe>().Ignore(recipe => recipe.SearchVector);
        }
    }
}
