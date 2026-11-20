using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Domain.Entities;
using Mapster;

namespace CulinaryBlog.Application.Mapping;

public static class RecipeMapping
{
    private static readonly TypeAdapterConfig Config = CreateConfig();

    public static RecipeDto ToDto(this Recipe recipe, string? categoryName = null)
    {
        var dto = recipe.Adapt<RecipeDto>(Config);
        dto.CategoryName = categoryName ?? recipe.Category?.Name ?? string.Empty;
        return dto;
    }

    private static TypeAdapterConfig CreateConfig()
    {
        var config = new TypeAdapterConfig();
        config.NewConfig<Recipe, RecipeDto>()
            .Ignore(destination => destination.CategoryName)
            .Ignore(destination => destination.RecipeIngredients)
            .Ignore(destination => destination.RecipeSteps);
        config.NewConfig<RecipeNutrition, RecipeNutritionDto>();
        config.NewConfig<RecipeIngredient, RecipeIngredientDto>();
        config.NewConfig<RecipeStep, RecipeStepDto>();
        return config;
    }
}
