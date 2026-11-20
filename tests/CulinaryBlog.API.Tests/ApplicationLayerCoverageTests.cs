using System.ComponentModel.DataAnnotations;
using CulinaryBlog.Application.Behaviors;
using CulinaryBlog.Application.CQRS.Auth.Commands;
using CulinaryBlog.Application.CQRS.Auth.Handlers;
using CulinaryBlog.Application.CQRS.Categories.Commands;
using CulinaryBlog.Application.CQRS.Recipes.Commands;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Application.Models;
using CulinaryBlog.Application.Validation;
using FluentValidation;
using MediatR;
using Moq;
using Xunit;

namespace CulinaryBlog.API.Tests;

public sealed class ApplicationLayerCoverageTests
{
    private static readonly Guid RecipeId = Guid.NewGuid();
    private static readonly Guid ChildId = Guid.NewGuid();
    private const string UserId = "coverage-user";

    [Fact]
    public void CoreValidators_AcceptValidCommands_AndRejectInvalidCommands()
    {
        AssertValid(new CreateCategoryCommandValidator(), new CreateCategoryCommand
        {
            Name = "Món Việt",
            Description = "Món ăn gia đình",
            ImageUrl = "https://cdn.example.test/category.webp"
        });
        AssertInvalid(new CreateCategoryCommandValidator(), new CreateCategoryCommand
        {
            Name = "",
            Description = new string('x', 501),
            ImageUrl = "/uploads/not-accepted-by-this-command.webp"
        });

        AssertValid(new UpdateCategoryCommandValidator(), new UpdateCategoryCommand
        {
            Id = ChildId,
            Name = "Món hấp",
            Description = "Ít dầu",
            ImageUrl = "https://cdn.example.test/steamed.webp"
        });
        AssertInvalid(new UpdateCategoryCommandValidator(), new UpdateCategoryCommand
        {
            Id = Guid.Empty,
            Name = new string('n', 101),
            Description = new string('d', 501),
            ImageUrl = new string('u', 2049)
        });

        AssertValid(new DeleteCategoryCommandValidator(), new DeleteCategoryCommand { Id = ChildId });
        AssertInvalid(new DeleteCategoryCommandValidator(), new DeleteCategoryCommand { Id = Guid.Empty });

        AssertValid(new CreateRecipeCommandValidator(), ValidCreateRecipe());
        AssertInvalid(new CreateRecipeCommandValidator(), new CreateRecipeCommand
        {
            Title = "x",
            Description = new string('d', 2001),
            CategoryId = Guid.Empty,
            AuthorId = "",
            PrepTimeMinutes = 0,
            CookTimeMinutes = 1441,
            Servings = 0,
            Difficulty = "Impossible",
            Ingredients = [" "],
            Instructions = [" "]
        });

        AssertValid(new UpdateRecipeCommandValidator(), ValidUpdateRecipe());
        AssertInvalid(new UpdateRecipeCommandValidator(), new UpdateRecipeCommand
        {
            Id = Guid.Empty,
            CurrentUserId = "",
            Title = "bad",
            Description = new string('d', 2001),
            CategoryId = Guid.Empty,
            PrepTimeMinutes = 0,
            CookTimeMinutes = 1441,
            Servings = 101,
            Difficulty = "Unknown",
            Ingredients = [" "],
            Instructions = [" "]
        });

        AssertValid(new ChangeRecipeStatusCommandValidator(),
            new ChangeRecipeStatusCommand(RecipeId, UserId, false, RecipeStatusTransition.Publish));
        AssertInvalid(new ChangeRecipeStatusCommandValidator(),
            new ChangeRecipeStatusCommand(Guid.Empty, "", false, (RecipeStatusTransition)999));
    }

    [Fact]
    public void RecipeContentValidators_CoverValidAndInvalidBoundaries()
    {
        var createIngredient = new CreateRecipeIngredientCommand(
            RecipeId, UserId, false,
            new CreateRecipeIngredientDto { Name = "Cá", Quantity = "300", Unit = "g", Notes = "Tươi" });
        AssertValid(new CreateRecipeIngredientCommandValidator(), createIngredient);
        AssertInvalid(new CreateRecipeIngredientCommandValidator(),
            new CreateRecipeIngredientCommand(Guid.Empty, "", false,
                new CreateRecipeIngredientDto
                {
                    Name = "",
                    Quantity = new string('q', 101),
                    Unit = new string('u', 51),
                    Notes = new string('n', 501)
                }));

        var updateIngredient = new UpdateRecipeIngredientCommand(
            RecipeId, ChildId, UserId, false,
            new UpdateRecipeIngredientDto { Name = "Muối", OrderIndex = 1 });
        AssertValid(new UpdateRecipeIngredientCommandValidator(), updateIngredient);
        AssertInvalid(new UpdateRecipeIngredientCommandValidator(),
            new UpdateRecipeIngredientCommand(Guid.Empty, Guid.Empty, "", false,
                new UpdateRecipeIngredientDto { Name = "", OrderIndex = 0 }));
        AssertValid(new DeleteRecipeIngredientCommandValidator(),
            new DeleteRecipeIngredientCommand(RecipeId, ChildId, UserId, false));
        AssertInvalid(new DeleteRecipeIngredientCommandValidator(),
            new DeleteRecipeIngredientCommand(Guid.Empty, Guid.Empty, UserId, false));

        var createStep = new CreateRecipeStepCommand(
            RecipeId, UserId, false,
            new CreateRecipeStepDto { Title = "Sơ chế", Description = "Rửa sạch", TimerMinutes = 5 });
        AssertValid(new CreateRecipeStepCommandValidator(), createStep);
        AssertInvalid(new CreateRecipeStepCommandValidator(),
            new CreateRecipeStepCommand(Guid.Empty, "", false,
                new CreateRecipeStepDto
                {
                    Title = new string('t', 201),
                    Description = "",
                    TimerMinutes = 1441
                }));

        var updateStep = new UpdateRecipeStepCommand(
            RecipeId, ChildId, UserId, false,
            new UpdateRecipeStepDto { Title = "Nấu", Description = "Nấu chín", TimerMinutes = 30 });
        AssertValid(new UpdateRecipeStepCommandValidator(), updateStep);
        AssertInvalid(new UpdateRecipeStepCommandValidator(),
            new UpdateRecipeStepCommand(Guid.Empty, Guid.Empty, "", false,
                new UpdateRecipeStepDto
                {
                    Title = new string('t', 201),
                    Description = "",
                    TimerMinutes = -1
                }));
        AssertValid(new DeleteRecipeStepCommandValidator(),
            new DeleteRecipeStepCommand(RecipeId, ChildId, UserId, false));
        AssertInvalid(new DeleteRecipeStepCommandValidator(),
            new DeleteRecipeStepCommand(Guid.Empty, Guid.Empty, UserId, false));
    }

    [Fact]
    public void RecipeImageValidators_CoverSizeMetadataAndIdentifiers()
    {
        AssertValid(new UploadRecipeImageCommandValidator(),
            new UploadRecipeImageCommand(RecipeId, UserId, false, [1, 2, 3], "Ảnh món ăn", true));
        AssertInvalid(new UploadRecipeImageCommandValidator(),
            new UploadRecipeImageCommand(Guid.Empty, "", false, new byte[5 * 1024 * 1024 + 1], new string('a', 301), null));

        AssertValid(new UpdateRecipeImageCommandValidator(),
            new UpdateRecipeImageCommand(RecipeId, ChildId, UserId, false, "Ảnh chính", true, 0));
        AssertInvalid(new UpdateRecipeImageCommandValidator(),
            new UpdateRecipeImageCommand(Guid.Empty, Guid.Empty, "", false, new string('a', 301), null, 10001));

        AssertValid(new DeleteRecipeImageCommandValidator(),
            new DeleteRecipeImageCommand(RecipeId, ChildId, UserId, false));
        AssertInvalid(new DeleteRecipeImageCommandValidator(),
            new DeleteRecipeImageCommand(Guid.Empty, Guid.Empty, UserId, false));
    }

    [Fact]
    public void AuthenticationValidators_CoverValidAndInvalidCredentials()
    {
        AssertValid(new RegisterCommandValidator(), new RegisterCommand(
            "Nguyễn An", null, "https://cdn.example.test/avatar.webp", "Tác giả món Việt",
            "nguyenan", "an@example.test", "Strong@123", "Strong@123", null, null));
        AssertInvalid(new RegisterCommandValidator(), new RegisterCommand(
            null, null, new string('a', 2049), new string('b', 501),
            "invalid user", "not-an-email", "weak", "different", null, null));

        AssertValid(new LoginCommandValidator(),
            new LoginCommand("an@example.test", null, "Strong@123", null));
        AssertValid(new LoginCommandValidator(),
            new LoginCommand(null, "nguyenan", "Strong@123", "123456"));
        AssertInvalid(new LoginCommandValidator(),
            new LoginCommand(null, null, "", new string('2', 33)));

        AssertValid(new RefreshSessionCommandValidator(), new RefreshSessionCommand("refresh-token"));
        AssertInvalid(new RefreshSessionCommandValidator(), new RefreshSessionCommand(new string('r', 1025)));
    }

    [Theory]
    [InlineData(null, true)]
    [InlineData("", true)]
    [InlineData("https://cdn.example.test/image.webp", true)]
    [InlineData("http://localhost:9000/bucket/image.png", true)]
    [InlineData("/uploads/recipes/image.avif", true)]
    [InlineData("/uploads/../secret.txt", false)]
    [InlineData("/uploads/image.jpg?token=secret", false)]
    [InlineData("javascript:alert(1)", false)]
    public void StoredMediaUrlAttribute_ValidatesRemoteAndLocalMedia(string? value, bool expected)
    {
        var attribute = new StoredMediaUrlAttribute();
        var result = attribute.GetValidationResult(value, new ValidationContext(new object()));
        Assert.Equal(expected, result == ValidationResult.Success);
    }

    [Fact]
    public async Task ValidationBehavior_ContinuesWithoutFailures_AndThrowsForInvalidRequest()
    {
        var valid = new LoginCommand("an@example.test", null, "Strong@123", null);
        var validBehavior = new ValidationBehavior<LoginCommand, string>([new LoginCommandValidator()]);
        var nextCalls = 0;
        RequestHandlerDelegate<string> next = _ =>
        {
            nextCalls++;
            return Task.FromResult("handled");
        };

        Assert.Equal("handled", await validBehavior.Handle(valid, next, CancellationToken.None));
        Assert.Equal(1, nextCalls);

        var noValidatorBehavior = new ValidationBehavior<LoginCommand, string>([]);
        Assert.Equal("handled", await noValidatorBehavior.Handle(valid, next, CancellationToken.None));
        Assert.Equal(2, nextCalls);

        var invalid = new LoginCommand(null, null, "", null);
        await Assert.ThrowsAsync<FluentValidation.ValidationException>(() =>
            validBehavior.Handle(invalid, next, CancellationToken.None));
        Assert.Equal(2, nextCalls);
    }

    [Fact]
    public async Task AuthenticationHandlers_DelegateEveryCommandToWorkflow()
    {
        var workflow = new Mock<IAuthenticationWorkflow>(MockBehavior.Strict);
        var register = new RegisterCommand("An", null, null, null, "an", "an@example.test", "Strong@123", "Strong@123", null, null);
        var login = new LoginCommand("an@example.test", null, "Strong@123", null);
        var refresh = new RefreshSessionCommand("refresh-token");
        var registerResult = new { operation = "register" };
        var loginResult = new { operation = "login" };
        var refreshResult = new { operation = "refresh" };

        workflow.Setup(item => item.RegisterAsync(register, It.IsAny<CancellationToken>())).ReturnsAsync(registerResult);
        workflow.Setup(item => item.LoginAsync(login, It.IsAny<CancellationToken>())).ReturnsAsync(loginResult);
        workflow.Setup(item => item.RefreshAsync(refresh, It.IsAny<CancellationToken>())).ReturnsAsync(refreshResult);

        var handlers = new AuthenticationCommandHandlers(workflow.Object);
        Assert.Same(registerResult, await handlers.Handle(register, CancellationToken.None));
        Assert.Same(loginResult, await handlers.Handle(login, CancellationToken.None));
        Assert.Same(refreshResult, await handlers.Handle(refresh, CancellationToken.None));
        workflow.VerifyAll();
    }

    [Fact]
    public void ApplicationModelsAndDtos_RoundTripTheirPublicContract()
    {
        var settings = new JwtSettings
        {
            Secret = "a-long-development-secret",
            Issuer = "culinary-blog",
            Audience = "culinary-client",
            ExpiryMinutes = 15,
            RefreshTokenExpiryDays = 7
        };
        Assert.Equal(("a-long-development-secret", "culinary-blog", "culinary-client", 15, 7),
            (settings.Secret, settings.Issuer, settings.Audience, settings.ExpiryMinutes, settings.RefreshTokenExpiryDays));

        var ingredient = new UpdateRecipeIngredientDto
        {
            Name = "Cá",
            Quantity = "300",
            Unit = "g",
            Notes = "Tươi",
            OrderIndex = 1
        };
        var step = new UpdateRecipeStepDto
        {
            Title = "Nấu",
            Description = "Nấu chín",
            TimerMinutes = 20,
            ImageUrl = "https://cdn.example.test/step.webp"
        };
        Assert.Equal("Cá", ingredient.Name);
        Assert.Equal("300", ingredient.Quantity);
        Assert.Equal("g", ingredient.Unit);
        Assert.Equal("Tươi", ingredient.Notes);
        Assert.Equal(1, ingredient.OrderIndex);
        Assert.Equal("Nấu", step.Title);
        Assert.Equal("Nấu chín", step.Description);
        Assert.Equal(20, step.TimerMinutes);
        Assert.Equal("https://cdn.example.test/step.webp", step.ImageUrl);
    }

    private static CreateRecipeCommand ValidCreateRecipe() => new()
    {
        Title = "Cá kho tộ",
        Description = "Món cá kho đậm vị",
        CategoryId = Guid.NewGuid(),
        AuthorId = UserId,
        PrepTimeMinutes = 15,
        CookTimeMinutes = 35,
        Servings = 4,
        Difficulty = "Medium",
        RecipeIngredients = [new CreateRecipeIngredientDto { Name = "Cá" }],
        RecipeSteps = [new CreateRecipeStepDto { Description = "Kho cá đến khi thấm vị" }]
    };

    private static UpdateRecipeCommand ValidUpdateRecipe() => new()
    {
        Id = RecipeId,
        CurrentUserId = UserId,
        Title = "Cá kho tộ",
        Description = "Món cá kho đậm vị",
        CategoryId = Guid.NewGuid(),
        PrepTimeMinutes = 15,
        CookTimeMinutes = 35,
        Servings = 4,
        Difficulty = "Medium",
        RecipeIngredients = [new CreateRecipeIngredientDto { Name = "Cá" }],
        RecipeSteps = [new CreateRecipeStepDto { Description = "Kho cá đến khi thấm vị" }]
    };

    private static void AssertValid<T>(IValidator<T> validator, T instance)
    {
        var result = validator.Validate(instance);
        Assert.True(result.IsValid, string.Join(Environment.NewLine, result.Errors.Select(error => error.ErrorMessage)));
    }

    private static void AssertInvalid<T>(IValidator<T> validator, T instance)
    {
        Assert.False(validator.Validate(instance).IsValid);
    }
}
