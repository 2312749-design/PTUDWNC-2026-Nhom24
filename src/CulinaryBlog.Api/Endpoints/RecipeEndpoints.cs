using CulinaryBlog.Api.Endpoints.Requests;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Api.Endpoints;

public static class RecipeEndpoints
{
public static void MapRecipeEndpoints(this WebApplication app)
{
// =========================================================
// RECIPES
// =========================================================

    // GET: /api/v1/recipes
    app.MapGet("/api/v1/recipes", async (ApplicationDbContext db) =>
    {
        var recipes = await db.Recipes
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return Results.Ok(new
        {
            data = recipes
        });
    });


    // =========================================================
    // SEARCH RECIPES
    // =========================================================

    // GET: /api/v1/recipes/search?q=pho&page=1&pageSize=10
    app.MapGet("/api/v1/recipes/search", async (
        string? q,
        int page,
        int pageSize,
        ApplicationDbContext db) =>
    {
        if (string.IsNullOrWhiteSpace(q) || q.Trim().Length < 2)
        {
            return Results.BadRequest(new
            {
                message = "Từ khóa tìm kiếm phải có ít nhất 2 ký tự."
            });
        }

        if (page < 1)
        {
            page = 1;
        }

        if (pageSize < 1 || pageSize > 100)
        {
            pageSize = 10;
        }

        var keyword = q.Trim();

        var searchTerms = keyword
            .Split(
                ' ',
                StringSplitOptions.RemoveEmptyEntries |
                StringSplitOptions.TrimEntries)
            .Select(x => x.Replace("'", ""))
            .Where(x => x.Length > 0)
            .Select(x => $"{x}:*");

        var tsQuery = string.Join(" & ", searchTerms);

        var searchQuery = db.Recipes
            .FromSqlInterpolated($@"
                SELECT *
                FROM ""Recipes""
                WHERE ""Status"" = 'Published'
                  AND ""SearchVector"" @@ to_tsquery(
                        'simple',
                        unaccent({tsQuery})
                  )
            ")
            .AsNoTracking();

        var total = await searchQuery.CountAsync();

        var recipes = await searchQuery
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Results.Ok(new
        {
            data = recipes,

            pagination = new
            {
                page,
                pageSize,
                total,
                totalPages = (int)Math.Ceiling(
                    total / (double)pageSize)
            }
        });
    });


    // =========================================================
    // GET RECIPE BY ID
    // =========================================================

    // GET: /api/v1/recipes/{id}
    app.MapGet("/api/v1/recipes/{id:guid}", async (
        Guid id,
        ApplicationDbContext db) =>
    {
        var recipe = await db.Recipes
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (recipe is null)
        {
            return Results.NotFound(new
            {
                message = "Không tìm thấy công thức."
            });
        }

        return Results.Ok(recipe);
    });


    // =========================================================
    // GET RECIPE BY SLUG
    // =========================================================

    // GET: /api/v1/recipes/slug/{slug}
    app.MapGet("/api/v1/recipes/slug/{slug}", async (
        string slug,
        ApplicationDbContext db) =>
    {
        var recipe = await db.Recipes
            .AsNoTracking()
            .FirstOrDefaultAsync(x =>
                x.Slug == slug &&
                x.Status == "Published");

        if (recipe is null)
        {
            return Results.NotFound(new
            {
                message = "Không tìm thấy công thức."
            });
        }

        var ingredients = await db.RecipeIngredients
            .AsNoTracking()
            .Where(x => x.RecipeId == recipe.Id)
            .OrderBy(x => x.OrderIndex)
            .ToListAsync();

        var steps = await db.RecipeSteps
            .AsNoTracking()
            .Where(x => x.RecipeId == recipe.Id)
            .OrderBy(x => x.StepNumber)
            .ToListAsync();

        return Results.Ok(new
        {
            data = new
            {
                recipe,
                ingredients,
                steps
            }
        });
    });


    // =========================================================
    // INGREDIENTS - NGUYÊN LIỆU
    // =========================================================

    // GET: /api/v1/recipes/{id}/ingredients
    app.MapGet("/api/v1/recipes/{id:guid}/ingredients", async (
        Guid id,
        ApplicationDbContext db) =>
    {
        var recipeExists = await db.Recipes
            .AnyAsync(x => x.Id == id);

        if (!recipeExists)
        {
            return Results.NotFound(new
            {
                message = "Không tìm thấy công thức."
            });
        }

        var ingredients = await db.RecipeIngredients
            .AsNoTracking()
            .Where(x => x.RecipeId == id)
            .OrderBy(x => x.OrderIndex)
            .ToListAsync();

        return Results.Ok(new
        {
            data = ingredients
        });
    });


    // POST: /api/v1/recipes/{id}/ingredients
    app.MapPost("/api/v1/recipes/{id:guid}/ingredients", async (
        Guid id,
        CreateIngredientRequest request,
        ApplicationDbContext db) =>
    {
        var recipeExists = await db.Recipes
            .AnyAsync(x => x.Id == id);

        if (!recipeExists)
        {
            return Results.NotFound(new
            {
                message = "Không tìm thấy công thức."
            });
        }

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

        db.RecipeIngredients.Add(ingredient);

        await db.SaveChangesAsync();

        return Results.Created(
            $"/api/v1/recipes/{id}/ingredients/{ingredient.Id}",
            ingredient);
    });


    // PUT: /api/v1/recipes/{id}/ingredients/{ingredientId}
    app.MapPut(
        "/api/v1/recipes/{id:guid}/ingredients/{ingredientId:guid}",
        async (
            Guid id,
            Guid ingredientId,
            UpdateIngredientRequest request,
            ApplicationDbContext db) =>
        {
            var ingredient = await db.RecipeIngredients
                .FirstOrDefaultAsync(x =>
                    x.Id == ingredientId &&
                    x.RecipeId == id);

            if (ingredient is null)
            {
                return Results.NotFound(new
                {
                    message = "Không tìm thấy nguyên liệu."
                });
            }

            ingredient.Name = request.Name;
            ingredient.Quantity = request.Quantity;
            ingredient.Unit = request.Unit;
            ingredient.Notes = request.Notes;
            ingredient.OrderIndex = request.OrderIndex;

            await db.SaveChangesAsync();

            return Results.Ok(ingredient);
        });


    // DELETE: /api/v1/recipes/{id}/ingredients/{ingredientId}
    app.MapDelete(
        "/api/v1/recipes/{id:guid}/ingredients/{ingredientId:guid}",
        async (
            Guid id,
            Guid ingredientId,
            ApplicationDbContext db) =>
        {
            var ingredient = await db.RecipeIngredients
                .FirstOrDefaultAsync(x =>
                    x.Id == ingredientId &&
                    x.RecipeId == id);

            if (ingredient is null)
            {
                return Results.NotFound(new
                {
                    message = "Không tìm thấy nguyên liệu."
                });
            }

            db.RecipeIngredients.Remove(ingredient);

            await db.SaveChangesAsync();

            return Results.Ok(new
            {
                message = "Xóa nguyên liệu thành công."
            });
        });


    // =========================================================
    // CREATE RECIPE
    // =========================================================

    // POST: /api/v1/recipes
    app.MapPost("/api/v1/recipes", async (
        CreateRecipeRequest request,
        ApplicationDbContext db) =>
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
            AuthorId = request.AuthorId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        db.Recipes.Add(recipe);

        await db.SaveChangesAsync();

        return Results.Created(
            $"/api/v1/recipes/{recipe.Id}",
            recipe);
    });


    // =========================================================
    // UPDATE RECIPE
    // =========================================================

    // PUT: /api/v1/recipes/{id}
    app.MapPut("/api/v1/recipes/{id:guid}", async (
        Guid id,
        UpdateRecipeRequest request,
        ApplicationDbContext db) =>
    {
        var recipe = await db.Recipes
            .FirstOrDefaultAsync(x => x.Id == id);

        if (recipe is null)
        {
            return Results.NotFound(new
            {
                message = "Không tìm thấy công thức."
            });
        }

        recipe.Title = request.Title;
        recipe.Slug = request.Slug;
        recipe.Description = request.Description;
        recipe.CookTimeMinutes = request.CookTimeMinutes;
        recipe.Servings = request.Servings;
        recipe.Difficulty = request.Difficulty;
        recipe.Status = request.Status;
        recipe.CategoryId = request.CategoryId;
        recipe.AuthorId = request.AuthorId;
        recipe.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();

        return Results.Ok(recipe);
    });


    // =========================================================
    // DELETE RECIPE
    // =========================================================

    // DELETE: /api/v1/recipes/{id}
    app.MapDelete("/api/v1/recipes/{id:guid}", async (
        Guid id,
        ApplicationDbContext db) =>
    {
        var recipe = await db.Recipes
            .FirstOrDefaultAsync(x => x.Id == id);

        if (recipe is null)
        {
            return Results.NotFound(new
            {
                message = "Không tìm thấy công thức."
            });
        }

        db.Recipes.Remove(recipe);

        await db.SaveChangesAsync();

        return Results.Ok(new
        {
            message = "Xóa công thức thành công."
        });
    });


    // =========================================================
    // STEPS - BƯỚC LÀM
    // =========================================================

    // POST: /api/v1/recipes/{recipeId}/steps
    app.MapPost("/api/v1/recipes/{recipeId:guid}/steps", async (
        Guid recipeId,
        CreateStepRequest request,
        ApplicationDbContext db) =>
    {
        var recipeExists = await db.Recipes
            .AnyAsync(x => x.Id == recipeId);

        if (!recipeExists)
        {
            return Results.NotFound(new
            {
                message = "Không tìm thấy công thức."
            });
        }

        var maxStepNumber = await db.RecipeSteps
            .Where(x => x.RecipeId == recipeId)
            .Select(x => (int?)x.StepNumber)
            .MaxAsync() ?? 0;

        var step = new RecipeStep
        {
            Id = Guid.NewGuid(),
            RecipeId = recipeId,
            StepNumber = maxStepNumber + 1,
            Title = request.Title,
            Description = request.Description,
            TimerMinutes = request.TimerMinutes,
            ImageUrl = request.ImageUrl
        };

        db.RecipeSteps.Add(step);

        await db.SaveChangesAsync();

        return Results.Created(
            $"/api/v1/recipes/{recipeId}/steps/{step.Id}",
            step);
    });


    // PUT: /api/v1/recipes/{recipeId}/steps/{stepId}
    app.MapPut(
        "/api/v1/recipes/{recipeId:guid}/steps/{stepId:guid}",
        async (
            Guid recipeId,
            Guid stepId,
            UpdateStepRequest request,
            ApplicationDbContext db) =>
        {
            var step = await db.RecipeSteps
                .FirstOrDefaultAsync(x =>
                    x.Id == stepId &&
                    x.RecipeId == recipeId);

            if (step is null)
            {
                return Results.NotFound(new
                {
                    message = "Không tìm thấy bước làm."
                });
            }

            step.Title = request.Title;
            step.Description = request.Description;
            step.TimerMinutes = request.TimerMinutes;
            step.ImageUrl = request.ImageUrl;

            await db.SaveChangesAsync();

            return Results.Ok(step);
        });


    // DELETE: /api/v1/recipes/{recipeId}/steps/{stepId}
    app.MapDelete(
        "/api/v1/recipes/{recipeId:guid}/steps/{stepId:guid}",
        async (
            Guid recipeId,
            Guid stepId,
            ApplicationDbContext db) =>
        {
            var step = await db.RecipeSteps
                .FirstOrDefaultAsync(x =>
                    x.Id == stepId &&
                    x.RecipeId == recipeId);

            if (step is null)
            {
                return Results.NotFound(new
                {
                    message = "Không tìm thấy bước làm."
                });
            }

            db.RecipeSteps.Remove(step);

            await db.SaveChangesAsync();

            var remainingSteps = await db.RecipeSteps
                .Where(x => x.RecipeId == recipeId)
                .OrderBy(x => x.StepNumber)
                .ToListAsync();

            for (int i = 0; i < remainingSteps.Count; i++)
            {
                remainingSteps[i].StepNumber = i + 1;
            }

            await db.SaveChangesAsync();

            return Results.NoContent();
        });


    // GET: /api/v1/recipes/{recipeId}/steps
    app.MapGet(
        "/api/v1/recipes/{recipeId:guid}/steps",
        async (
            Guid recipeId,
            ApplicationDbContext db) =>
        {
            var recipeExists = await db.Recipes
                .AnyAsync(x => x.Id == recipeId);

            if (!recipeExists)
            {
                return Results.NotFound(new
                {
                    message = "Không tìm thấy công thức."
                });
            }

            var steps = await db.RecipeSteps
                .AsNoTracking()
                .Where(x => x.RecipeId == recipeId)
                .OrderBy(x => x.StepNumber)
                .ToListAsync();

            return Results.Ok(new
            {
                data = steps
            });
        });
}

}