using CulinaryBlog.Application.CQRS.Recipes.Commands;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Application.Mapping;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Exceptions;
using MediatR;

namespace CulinaryBlog.Application.CQRS.Recipes.Handlers;

public sealed class UpdateRecipeCommandHandler(IUnitOfWork unitOfWork, ICacheService cache)
    : IRequestHandler<UpdateRecipeCommand, RecipeDto>
{
    public async Task<RecipeDto> Handle(UpdateRecipeCommand request, CancellationToken cancellationToken)
    {
        var recipes = unitOfWork.Repository<Recipe>();
        var recipe = await recipes.GetByIdAsync(request.Id, cancellationToken);
        if (recipe is null || recipe.IsDeleted) throw new NotFoundException("Không tìm thấy công thức.");
        EnsureOwner(recipe, request.CurrentUserId, request.IsAdmin);
        if (request.ExpectedUpdatedAt.HasValue && recipe.UpdatedAt.Ticks / 10 != request.ExpectedUpdatedAt.Value.Ticks / 10)
            throw new ConcurrencyConflictException("Dữ liệu đã thay đổi. Hãy tải lại trước khi lưu.");
        if (!await unitOfWork.Repository<Category>().ExistsAsync(category => category.Id == request.CategoryId && !category.IsDeleted, cancellationToken))
            throw new NotFoundException("Danh mục không tồn tại.");

        var ingredientInputs = request.RecipeIngredients is { Count: > 0 }
            ? request.RecipeIngredients.Where(item => !string.IsNullOrWhiteSpace(item.Name)).ToList()
            : request.Ingredients.Where(item => !string.IsNullOrWhiteSpace(item)).Select((name, index) => new CreateRecipeIngredientDto { Name = name, OrderIndex = index + 1 }).ToList();
        var stepInputs = request.RecipeSteps is { Count: > 0 }
            ? request.RecipeSteps.Where(item => !string.IsNullOrWhiteSpace(item.Description)).ToList()
            : request.Instructions.Where(item => !string.IsNullOrWhiteSpace(item)).Select(description => new CreateRecipeStepDto { Description = description }).ToList();
        Recipe.EnsureMinimumContent(ingredientInputs.Count, stepInputs.Count);

        var oldSlug = recipe.Slug;
        recipe.Update(
            request.Title,
            request.Description,
            ingredientInputs.Select(item => item.Name.Trim()).ToList(),
            stepInputs.Select(item => item.Description.Trim()).ToList(),
            request.CategoryId,
            request.ImageUrl,
            difficulty: request.Difficulty,
            isVegetarian: request.IsVegetarian,
            prepTimeMinutes: request.PrepTimeMinutes,
            cookTimeMinutes: request.CookTimeMinutes,
            servings: request.Servings);

        var slugBase = Recipe.CreateSlug(request.Title);
        var slug = slugBase;
        var suffix = 2;
        while (await recipes.ExistsAsync(existing => existing.Id != request.Id && existing.Slug == slug, cancellationToken))
            slug = $"{slugBase}-{suffix++}";
        recipe.SetSlug(slug);

        if (request.NutritionSpecified)
            recipe.SetNutrition(request.Nutrition is null ? null : new RecipeNutrition(
                request.Nutrition.Calories, request.Nutrition.Protein, request.Nutrition.Carbohydrates,
                request.Nutrition.Fat, request.Nutrition.Fiber, request.Nutrition.Sodium));

        var ingredients = unitOfWork.Repository<RecipeIngredient>();
        foreach (var existing in await ingredients.ListAsync(item => item.RecipeId == request.Id, cancellationToken))
            await ingredients.DeleteAsync(existing, cancellationToken);
        var newIngredients = ingredientInputs.Select((item, index) => RecipeIngredient.Create(
            request.Id, item.Name, item.Quantity, item.Unit, item.Notes, index + 1)).ToList();
        foreach (var item in newIngredients) await ingredients.AddAsync(item, cancellationToken);

        var steps = unitOfWork.Repository<RecipeStep>();
        foreach (var existing in await steps.ListAsync(item => item.RecipeId == request.Id, cancellationToken))
            await steps.DeleteAsync(existing, cancellationToken);
        var newSteps = stepInputs.Select((item, index) => RecipeStep.Create(
            request.Id, item.Title, item.Description, index + 1, item.TimerMinutes, item.ImageUrl)).ToList();
        foreach (var item in newSteps) await steps.AddAsync(item, cancellationToken);

        await unitOfWork.SaveChangesAsync(cancellationToken);
        await InvalidateAsync(recipe, oldSlug, cancellationToken);

        var result = recipe.ToDto();
        result.RecipeIngredients = newIngredients.Select(item => new RecipeIngredientDto
        {
            Id = item.Id, RecipeId = item.RecipeId, Name = item.Name, Quantity = item.Quantity,
            Unit = item.Unit, Notes = item.Notes, OrderIndex = item.OrderIndex
        }).ToList();
        result.RecipeSteps = newSteps.Select(item => new RecipeStepDto
        {
            Id = item.Id, RecipeId = item.RecipeId, Title = item.Title, Description = item.Description,
            StepNumber = item.StepNumber, TimerMinutes = item.TimerMinutes, ImageUrl = item.ImageUrl
        }).ToList();
        return result;
    }

    private static void EnsureOwner(Recipe recipe, string userId, bool isAdmin)
    {
        if (!isAdmin && recipe.AuthorId != userId)
            throw new ForbiddenException("Bạn không có quyền sửa công thức này.");
    }

    private async Task InvalidateAsync(Recipe recipe, string oldSlug, CancellationToken cancellationToken)
    {
        foreach (var key in new[] { CacheKeys.Recipes, CacheKeys.Recipe(recipe.Id), CacheKeys.RecipeBySlug(oldSlug), CacheKeys.RecipeBySlug(recipe.Slug) }.Distinct())
            await cache.RemoveAsync(key, cancellationToken);
    }
}

public sealed class ChangeRecipeStatusCommandHandler(IUnitOfWork unitOfWork, ICacheService cache)
    : IRequestHandler<ChangeRecipeStatusCommand, RecipeTransitionResult>
{
    public async Task<RecipeTransitionResult> Handle(ChangeRecipeStatusCommand request, CancellationToken cancellationToken)
    {
        var recipe = await unitOfWork.Repository<Recipe>().GetByIdAsync(request.Id, cancellationToken);
        if (recipe is null || recipe.IsDeleted) throw new NotFoundException("Không tìm thấy công thức.");
        if (!request.IsAdmin && recipe.AuthorId != request.CurrentUserId)
            throw new ForbiddenException("Bạn không có quyền thay đổi trạng thái công thức này.");

        bool changed;
        if (request.Transition == RecipeStatusTransition.Publish)
        {
            if (!await unitOfWork.Repository<Category>().ExistsAsync(category => category.Id == recipe.CategoryId && !category.IsDeleted, cancellationToken))
                throw new ValidationException("Không thể xuất bản công thức thuộc danh mục đã xóa.");
            var ingredientCount = (await unitOfWork.Repository<RecipeIngredient>().ListAsync(item => item.RecipeId == request.Id, cancellationToken)).Count;
            var stepCount = (await unitOfWork.Repository<RecipeStep>().ListAsync(item => item.RecipeId == request.Id, cancellationToken)).Count;
            changed = recipe.Publish(Math.Max(ingredientCount, recipe.Ingredients.Count), Math.Max(stepCount, recipe.Instructions.Count));
        }
        else if (request.Transition == RecipeStatusTransition.Unpublish)
            changed = recipe.Unpublish();
        else if (request.Transition == RecipeStatusTransition.Restore)
            changed = recipe.RestoreToDraft();
        else if (request.Transition == RecipeStatusTransition.Delete)
        {
            recipe.SoftDelete();
            changed = true;
        }
        else
            changed = recipe.Archive();

        if (changed) await unitOfWork.SaveChangesAsync(cancellationToken);
        // A status transition changes both public recipe visibility and the
        // published count displayed on every category card.
        foreach (var key in new[] { CacheKeys.Recipes, CacheKeys.Categories, CacheKeys.Recipe(recipe.Id), CacheKeys.RecipeBySlug(recipe.Slug) })
            await cache.RemoveAsync(key, cancellationToken);
        return new RecipeTransitionResult(recipe.Id, (int)recipe.Status, changed, recipe.UpdatedAt);
    }
}
