using CulinaryBlog.Api.Endpoints.Requests;
using CulinaryBlog.Application.Abstractions;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Exceptions;
using System.Security.Claims;

namespace CulinaryBlog.Api.Endpoints;

public static class RecipeEndpoints
{
    public static void MapRecipeEndpoints(this RouteGroupBuilder apiV1)
    {
        var recipes = apiV1.MapGroup("/recipes").WithTags("Recipes");

        recipes.MapGet("/", async (
            IUnitOfWork unitOfWork,
            CancellationToken cancellationToken) =>
        {
            var recipes = await unitOfWork.Recipes.GetAllAsync(cancellationToken);
            return Results.Ok(new { data = recipes });
        });

        recipes.MapGet("/search", async (
            string? q,
            int page,
            int pageSize,
            IUnitOfWork unitOfWork,
            CancellationToken cancellationToken) =>
        {
            if (string.IsNullOrWhiteSpace(q) || q.Trim().Length < 2)
            {
                throw new ValidationException("Từ khóa tìm kiếm phải có ít nhất 2 ký tự.");
            }

            page = Math.Max(page, 1);
            pageSize = pageSize is < 1 or > 100 ? 10 : pageSize;

            var (recipes, total) = await unitOfWork.Recipes.SearchPublishedAsync(
                q.Trim(),
                page,
                pageSize,
                cancellationToken);

            return Results.Ok(new
            {
                data = recipes,
                pagination = new
                {
                    page,
                    pageSize,
                    total,
                    totalPages = (int)Math.Ceiling(total / (double)pageSize)
                }
            });
        });

        recipes.MapGet("/{id:guid}", async (
            Guid id,
            IUnitOfWork unitOfWork,
            CancellationToken cancellationToken) =>
        {
            var recipe = await unitOfWork.Recipes.GetByIdAsync(
                id,
                cancellationToken: cancellationToken);
            return Results.Ok(recipe ?? throw new NotFoundException("Không tìm thấy công thức."));
        });

        recipes.MapGet("/slug/{slug}", async (
            string slug,
            IUnitOfWork unitOfWork,
            CancellationToken cancellationToken) =>
        {
            var recipe = await unitOfWork.Recipes.GetPublishedBySlugAsync(slug, cancellationToken)
                ?? throw new NotFoundException("Không tìm thấy công thức.");
            var ingredients = await unitOfWork.RecipeIngredients.GetByRecipeAsync(
                recipe.Id,
                cancellationToken);
            var steps = await unitOfWork.RecipeSteps.GetByRecipeAsync(
                recipe.Id,
                cancellationToken: cancellationToken);

            return Results.Ok(new { data = new { recipe, ingredients, steps } });
        });

        recipes.MapGet("/{id:guid}/ingredients", async (
            Guid id,
            IUnitOfWork unitOfWork,
            CancellationToken cancellationToken) =>
        {
            await GetRecipeOrThrowAsync(unitOfWork, id, cancellationToken);
            var ingredients = await unitOfWork.RecipeIngredients.GetByRecipeAsync(id, cancellationToken);
            return Results.Ok(new { data = ingredients });
        });

        recipes.MapPost("/{id:guid}/ingredients", async (
            Guid id,
            CreateIngredientRequest request,
            IUnitOfWork unitOfWork,
            ClaimsPrincipal user,
            CancellationToken cancellationToken) =>
        {
            await GetOwnedRecipeOrThrowAsync(unitOfWork, id, user, cancellationToken);

            var ingredient = new RecipeIngredient
            {
                Id = Guid.NewGuid(),
                RecipeId = id,
                Name = request.Name,
                Quantity = request.Quantity,
                Unit = request.Unit,
                Notes = request.Notes,
                OrderIndex = request.OrderIndex
            };
            unitOfWork.RecipeIngredients.Add(ingredient);
            await unitOfWork.SaveChangesAsync(cancellationToken);

            return Results.Created(
                $"/api/v1/recipes/{id}/ingredients/{ingredient.Id}",
                ingredient);
        }).RequireAuthorization("Author");

        recipes.MapGet("/{id:guid}/ingredients/{ingredientId:guid}", async (
            Guid id,
            Guid ingredientId,
            IUnitOfWork unitOfWork,
            CancellationToken cancellationToken) =>
        {
            var ingredient = await unitOfWork.RecipeIngredients.GetByIdAsync(
                id,
                ingredientId,
                cancellationToken: cancellationToken)
                ?? throw new NotFoundException("Không tìm thấy nguyên liệu.");

            return Results.Ok(ingredient);
        });

        recipes.MapPut("/{id:guid}/ingredients/{ingredientId:guid}", async (
            Guid id,
            Guid ingredientId,
            UpdateIngredientRequest request,
            IUnitOfWork unitOfWork,
            ClaimsPrincipal user,
            CancellationToken cancellationToken) =>
        {
            await GetOwnedRecipeOrThrowAsync(unitOfWork, id, user, cancellationToken);
            var ingredient = await unitOfWork.RecipeIngredients.GetByIdAsync(
                id,
                ingredientId,
                trackChanges: true,
                cancellationToken) ?? throw new NotFoundException("Không tìm thấy nguyên liệu.");

            ingredient.Name = request.Name;
            ingredient.Quantity = request.Quantity;
            ingredient.Unit = request.Unit;
            ingredient.Notes = request.Notes;
            ingredient.OrderIndex = request.OrderIndex;
            await unitOfWork.SaveChangesAsync(cancellationToken);

            return Results.Ok(ingredient);
        }).RequireAuthorization("Author");

        recipes.MapDelete("/{id:guid}/ingredients/{ingredientId:guid}", async (
            Guid id,
            Guid ingredientId,
            IUnitOfWork unitOfWork,
            ClaimsPrincipal user,
            CancellationToken cancellationToken) =>
        {
            await GetOwnedRecipeOrThrowAsync(unitOfWork, id, user, cancellationToken);
            var ingredient = await unitOfWork.RecipeIngredients.GetByIdAsync(
                id,
                ingredientId,
                trackChanges: true,
                cancellationToken) ?? throw new NotFoundException("Không tìm thấy nguyên liệu.");

            unitOfWork.RecipeIngredients.Remove(ingredient);
            await unitOfWork.SaveChangesAsync(cancellationToken);

            return Results.Ok(new { message = "Xóa nguyên liệu thành công." });
        }).RequireAuthorization("Author");

        recipes.MapPost("/", async (
            CreateRecipeRequest request,
            IUnitOfWork unitOfWork,
            ClaimsPrincipal user,
            CancellationToken cancellationToken) =>
        {
            var recipe = new Recipe
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                Slug = request.Slug,
                Description = request.Description,
                CookTimeMinutes = request.CookTimeMinutes,
                Servings = request.Servings,
                Difficulty = request.Difficulty,
                CategoryId = request.CategoryId,
                AuthorId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            unitOfWork.Recipes.Add(recipe);
            await unitOfWork.SaveChangesAsync(cancellationToken);
            return Results.Created($"/api/v1/recipes/{recipe.Id}", recipe);
        }).RequireAuthorization("Author");

        recipes.MapPut("/{id:guid}", async (
            Guid id,
            UpdateRecipeRequest request,
            IUnitOfWork unitOfWork,
            ClaimsPrincipal user,
            CancellationToken cancellationToken) =>
        {
            var recipe = await GetOwnedRecipeOrThrowAsync(
                unitOfWork,
                id,
                user,
                cancellationToken,
                trackChanges: true);

            recipe.Title = request.Title;
            recipe.Slug = request.Slug;
            recipe.Description = request.Description;
            recipe.CookTimeMinutes = request.CookTimeMinutes;
            recipe.Servings = request.Servings;
            recipe.Difficulty = request.Difficulty;
            recipe.Status = request.Status;
            recipe.CategoryId = request.CategoryId;
            recipe.UpdatedAt = DateTime.UtcNow;
            await unitOfWork.SaveChangesAsync(cancellationToken);

            return Results.Ok(recipe);
        }).RequireAuthorization("Author");

        recipes.MapDelete("/{id:guid}", async (
            Guid id,
            IUnitOfWork unitOfWork,
            ClaimsPrincipal user,
            CancellationToken cancellationToken) =>
        {
            var recipe = await GetOwnedRecipeOrThrowAsync(
                unitOfWork,
                id,
                user,
                cancellationToken,
                trackChanges: true);

            unitOfWork.Recipes.Remove(recipe);
            await unitOfWork.SaveChangesAsync(cancellationToken);
            return Results.Ok(new { message = "Xóa công thức thành công." });
        }).RequireAuthorization("Author");

        recipes.MapPost("/{recipeId:guid}/steps", async (
            Guid recipeId,
            CreateStepRequest request,
            IUnitOfWork unitOfWork,
            ClaimsPrincipal user,
            CancellationToken cancellationToken) =>
        {
            await GetOwnedRecipeOrThrowAsync(
                unitOfWork,
                recipeId,
                user,
                cancellationToken);

            var step = new RecipeStep
            {
                Id = Guid.NewGuid(),
                RecipeId = recipeId,
                StepNumber = await unitOfWork.RecipeSteps.GetNextStepNumberAsync(
                    recipeId,
                    cancellationToken),
                Title = request.Title,
                Description = request.Description,
                TimerMinutes = request.TimerMinutes,
                ImageUrl = request.ImageUrl
            };
            unitOfWork.RecipeSteps.Add(step);
            await unitOfWork.SaveChangesAsync(cancellationToken);

            return Results.Created($"/api/v1/recipes/{recipeId}/steps/{step.Id}", step);
        }).RequireAuthorization("Author");

        recipes.MapGet("/{recipeId:guid}/steps/{stepId:guid}", async (
            Guid recipeId,
            Guid stepId,
            IUnitOfWork unitOfWork,
            CancellationToken cancellationToken) =>
        {
            var step = await unitOfWork.RecipeSteps.GetByIdAsync(
                recipeId,
                stepId,
                cancellationToken: cancellationToken)
                ?? throw new NotFoundException("Không tìm thấy bước làm.");

            return Results.Ok(step);
        });

        recipes.MapPut("/{recipeId:guid}/steps/{stepId:guid}", async (
            Guid recipeId,
            Guid stepId,
            UpdateStepRequest request,
            IUnitOfWork unitOfWork,
            ClaimsPrincipal user,
            CancellationToken cancellationToken) =>
        {
            await GetOwnedRecipeOrThrowAsync(
                unitOfWork,
                recipeId,
                user,
                cancellationToken);
            var step = await unitOfWork.RecipeSteps.GetByIdAsync(
                recipeId,
                stepId,
                trackChanges: true,
                cancellationToken) ?? throw new NotFoundException("Không tìm thấy bước làm.");

            step.Title = request.Title;
            step.Description = request.Description;
            step.TimerMinutes = request.TimerMinutes;
            step.ImageUrl = request.ImageUrl;
            await unitOfWork.SaveChangesAsync(cancellationToken);

            return Results.Ok(step);
        }).RequireAuthorization("Author");

        recipes.MapDelete("/{recipeId:guid}/steps/{stepId:guid}", async (
            Guid recipeId,
            Guid stepId,
            IUnitOfWork unitOfWork,
            ClaimsPrincipal user,
            CancellationToken cancellationToken) =>
        {
            await GetOwnedRecipeOrThrowAsync(
                unitOfWork,
                recipeId,
                user,
                cancellationToken);
            var step = await unitOfWork.RecipeSteps.GetByIdAsync(
                recipeId,
                stepId,
                trackChanges: true,
                cancellationToken) ?? throw new NotFoundException("Không tìm thấy bước làm.");
            var remainingSteps = await unitOfWork.RecipeSteps.GetByRecipeAsync(
                recipeId,
                trackChanges: true,
                cancellationToken);

            unitOfWork.RecipeSteps.Remove(step);
            var stepNumber = 1;
            foreach (var remainingStep in remainingSteps.Where(item => item.Id != stepId))
            {
                remainingStep.StepNumber = stepNumber++;
            }

            await unitOfWork.SaveChangesAsync(cancellationToken);
            return Results.NoContent();
        }).RequireAuthorization("Author");

        recipes.MapGet("/{recipeId:guid}/steps", async (
            Guid recipeId,
            IUnitOfWork unitOfWork,
            CancellationToken cancellationToken) =>
        {
            await GetRecipeOrThrowAsync(unitOfWork, recipeId, cancellationToken);
            var steps = await unitOfWork.RecipeSteps.GetByRecipeAsync(
                recipeId,
                cancellationToken: cancellationToken);
            return Results.Ok(new { data = steps });
        });
    }

    private static async Task<Recipe> GetRecipeOrThrowAsync(
        IUnitOfWork unitOfWork,
        Guid recipeId,
        CancellationToken cancellationToken)
    {
        return await unitOfWork.Recipes.GetByIdAsync(
            recipeId,
            cancellationToken: cancellationToken)
            ?? throw new NotFoundException("Không tìm thấy công thức.");
    }

    private static async Task<Recipe> GetOwnedRecipeOrThrowAsync(
        IUnitOfWork unitOfWork,
        Guid recipeId,
        ClaimsPrincipal user,
        CancellationToken cancellationToken,
        bool trackChanges = false)
    {
        var recipe = await unitOfWork.Recipes.GetByIdAsync(
            recipeId,
            trackChanges,
            cancellationToken)
            ?? throw new NotFoundException("Không tìm thấy công thức.");
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userId, out var authorId) || recipe.AuthorId != authorId)
        {
            throw new ForbiddenException(
                "Bạn không có quyền thay đổi công thức này.");
        }

        return recipe;
    }
}
