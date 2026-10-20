using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CulinaryBlog.Infrastructure.Jobs;

public sealed class StorageMaintenanceJob(ApplicationDbContext context, ILogger<StorageMaintenanceJob> logger)
{
    public async Task InspectAsync()
    {
        // Recipes are soft-deleted, so their image records must remain available for restoration.
        var retainedImages = await context.RecipeImages.CountAsync(image => image.Recipe.IsDeleted);
        var recipesWithoutPrimary = await context.RecipeImages
            .GroupBy(image => image.RecipeId)
            .CountAsync(group => !group.Any(image => image.IsPrimary));
        logger.LogInformation(
            "Storage maintenance completed. {RetainedImages} images retained for soft-deleted recipes; {RecipesWithoutPrimary} recipes need a primary-image review.",
            retainedImages,
            recipesWithoutPrimary);
    }
}
