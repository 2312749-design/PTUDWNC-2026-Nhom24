using System.Linq.Expressions;
using CulinaryBlog.Application.CQRS.Recipes.Handlers;
using CulinaryBlog.Application.CQRS.Recipes.Queries;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using Moq;
using Xunit;

namespace CulinaryBlog.API.Tests;

public sealed class RecipeContentQueryTests
{
    [Theory]
    [InlineData(false, true, null, false, false)]
    [InlineData(false, true, "owner", false, true)]
    [InlineData(false, true, "other", true, true)]
    [InlineData(true, true, null, false, true)]
    [InlineData(true, false, null, false, false)]
    public async Task ReadsRespectPublicationOwnershipAndCategoryVisibility(bool published, bool visible, string? user, bool admin, bool allowed)
    {
        var category = Category.Create("Test category", "", null);
        category.IsVisible = visible;
        var recipe = Recipe.Create("Test recipe", "Detailed description", ["Rice"], ["Cook rice"], category.Id, "owner");
        if (published) recipe.Publish(1, 1);
        var recipes = new Mock<IRepository<Recipe>>();
        recipes.Setup(x => x.GetByIdAsync(recipe.Id, It.IsAny<CancellationToken>())).ReturnsAsync(recipe);
        var categories = new Mock<IRepository<Category>>();
        categories.Setup(x => x.GetByIdAsync(category.Id, It.IsAny<CancellationToken>())).ReturnsAsync(category);
        var ingredients = new Mock<IRepository<RecipeIngredient>>();
        ingredients.Setup(x => x.ListAsync(It.IsAny<Expression<Func<RecipeIngredient, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new[] { RecipeIngredient.Create(recipe.Id, "Rice", "100", "g", "rinsed", 1) });
        var steps = new Mock<IRepository<RecipeStep>>();
        steps.Setup(x => x.ListAsync(It.IsAny<Expression<Func<RecipeStep, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new[] { RecipeStep.Create(recipe.Id, "Cook", "Cook rice", 1, 10, null) });
        var work = new Mock<IUnitOfWork>();
        work.Setup(x => x.Repository<Recipe>()).Returns(recipes.Object);
        work.Setup(x => x.Repository<Category>()).Returns(categories.Object);
        work.Setup(x => x.Repository<RecipeIngredient>()).Returns(ingredients.Object);
        work.Setup(x => x.Repository<RecipeStep>()).Returns(steps.Object);
        var handler = new RecipeContentQueryHandlers(work.Object);
        var ingredientResult = await handler.Handle(new GetRecipeIngredientsQuery(recipe.Id, user, admin), default);
        var stepResult = await handler.Handle(new GetRecipeStepsQuery(recipe.Id, user, admin), default);
        Assert.Equal(allowed, ingredientResult is not null);
        Assert.Equal(allowed, stepResult is not null);
        if (allowed)
        {
            Assert.Equal("rinsed", Assert.Single(ingredientResult!).Notes);
            Assert.Equal(10, Assert.Single(stepResult!).TimerMinutes);
        }
        else
        {
            ingredients.Verify(x => x.ListAsync(It.IsAny<Expression<Func<RecipeIngredient, bool>>>(), It.IsAny<CancellationToken>()), Times.Never);
            steps.Verify(x => x.ListAsync(It.IsAny<Expression<Func<RecipeStep, bool>>>(), It.IsAny<CancellationToken>()), Times.Never);
        }
    }
}
