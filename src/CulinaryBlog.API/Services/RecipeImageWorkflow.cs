using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Exceptions;
using CulinaryBlog.Infrastructure.Jobs;
using CulinaryBlog.Infrastructure.Persistence;
using CulinaryBlog.Infrastructure.Services;
using Hangfire;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.API.Services;

public sealed class RecipeImageWorkflow(
    ApplicationDbContext context,
    IFileStorageService storage,
    IBackgroundJobClient backgroundJobs,
    ICacheService cache) : IRecipeImageWorkflow
{
    public async Task<RecipeImageWorkflowResult> UploadAsync(Guid recipeId, byte[] content, string? altText, bool? primary, CancellationToken cancellationToken)
    {
        var validation = ImageUploadValidationService.Validate(content, cancellationToken);
        if (validation.Image is null) throw new ValidationException(validation.Error ?? "Ảnh không hợp lệ.");
        var image = validation.Image;
        var prefix = $"recipes/{recipeId:N}/{Guid.NewGuid():N}";
        await using var original = new MemoryStream(image.Content, writable: false);
        var originalUrl = await storage.UploadAsync(original, $"{prefix}{image.Extension}", image.ContentType, cancellationToken);
        var thumbnailFileName = $"{prefix}-thumb.webp";
        var mediumFileName = $"{prefix}-medium.webp";
        var images = await context.RecipeImages.Where(item => item.RecipeId == recipeId).ToListAsync(cancellationToken);
        var isPrimary = primary ?? !images.Any(item => item.IsPrimary);
        if (isPrimary) foreach (var existing in images) existing.IsPrimary = false;
        var metadata = new RecipeImage
        {
            RecipeId = recipeId,
            Url = originalUrl,
            ThumbnailUrl = storage.GetPublicUrl(thumbnailFileName),
            MediumUrl = storage.GetPublicUrl(mediumFileName),
            AltText = string.IsNullOrWhiteSpace(altText) ? null : altText.Trim(),
            OrderIndex = images.Select(item => item.OrderIndex).DefaultIfEmpty(-1).Max() + 1,
            IsPrimary = isPrimary
        };
        context.RecipeImages.Add(metadata);
        var recipe = await context.Recipes.FindAsync([recipeId], cancellationToken) ?? throw new NotFoundException("Không tìm thấy công thức.");
        if (isPrimary) recipe.SetImageUrl(originalUrl); else recipe.Touch();
        await context.SaveChangesAsync(cancellationToken);
        backgroundJobs.Enqueue<ThumbnailGenerationJob>(job => job.GenerateAsync(image.Content, thumbnailFileName, mediumFileName));
        await InvalidateAsync(recipeId, cancellationToken);
        return ToResult(metadata);
    }

    public async Task<RecipeImageWorkflowResult> UpdateAsync(Guid recipeId, Guid imageId, string? altText, bool? isPrimary, int? orderIndex, CancellationToken cancellationToken)
    {
        var images = await context.RecipeImages.Where(item => item.RecipeId == recipeId).ToListAsync(cancellationToken);
        var selected = images.FirstOrDefault(item => item.Id == imageId) ?? throw new NotFoundException("Không tìm thấy ảnh công thức.");
        if (altText is not null) selected.AltText = string.IsNullOrWhiteSpace(altText) ? null : altText.Trim();
        if (orderIndex.HasValue) selected.OrderIndex = orderIndex.Value;
        var recipe = await context.Recipes.FindAsync([recipeId], cancellationToken) ?? throw new NotFoundException("Không tìm thấy công thức.");
        if (isPrimary == true)
        {
            foreach (var image in images) image.IsPrimary = image.Id == selected.Id;
            recipe.SetImageUrl(selected.Url);
        }
        else if (isPrimary == false && selected.IsPrimary)
        {
            selected.IsPrimary = false;
            recipe.SetImageUrl(null);
        }
        else recipe.Touch();
        await context.SaveChangesAsync(cancellationToken);
        await InvalidateAsync(recipeId, cancellationToken);
        return ToResult(selected);
    }

    public async Task DeleteAsync(Guid recipeId, Guid imageId, CancellationToken cancellationToken)
    {
        var image = await context.RecipeImages.FirstOrDefaultAsync(item => item.RecipeId == recipeId && item.Id == imageId, cancellationToken)
            ?? throw new NotFoundException("Không tìm thấy ảnh công thức.");
        var recipe = await context.Recipes.FindAsync([recipeId], cancellationToken) ?? throw new NotFoundException("Không tìm thấy công thức.");
        var urls = new[] { image.Url, image.ThumbnailUrl, image.MediumUrl };
        var wasPrimary = image.IsPrimary;
        context.RecipeImages.Remove(image);
        if (wasPrimary)
        {
            var next = await context.RecipeImages.Where(item => item.RecipeId == recipeId && item.Id != imageId)
                .OrderBy(item => item.CreatedAt).FirstOrDefaultAsync(cancellationToken);
            if (next is null) recipe.SetImageUrl(null);
            else { next.IsPrimary = true; recipe.SetImageUrl(next.Url); }
        }
        else recipe.Touch();
        await context.SaveChangesAsync(cancellationToken);
        await InvalidateAsync(recipeId, cancellationToken);
        foreach (var url in urls)
            if (TryGetStorageKey(url, out var key)) await storage.DeleteAsync(key, cancellationToken);
    }

    private async Task InvalidateAsync(Guid recipeId, CancellationToken token)
    {
        await cache.RemoveAsync(CulinaryBlog.Application.Interfaces.CacheKeys.Recipes, token);
        await cache.RemoveAsync(CulinaryBlog.Application.Interfaces.CacheKeys.Recipe(recipeId), token);
    }

    private static RecipeImageWorkflowResult ToResult(RecipeImage image) => new(
        image.Id, image.Url, image.ThumbnailUrl, image.MediumUrl, image.AltText, image.OrderIndex, image.IsPrimary);

    private static bool TryGetStorageKey(string? url, out string key)
    {
        key = string.Empty;
        if (string.IsNullOrWhiteSpace(url)) return false;
        var path = Uri.TryCreate(url, UriKind.Absolute, out var uri) ? uri.AbsolutePath : url;
        var segments = path.Trim('/').Split('/', StringSplitOptions.RemoveEmptyEntries);
        if (segments.Length == 0) return false;
        key = segments[0].Equals("uploads", StringComparison.OrdinalIgnoreCase) ? string.Join('/', segments.Skip(1)) : string.Join('/', segments.Skip(1));
        return key.StartsWith("recipes/", StringComparison.Ordinal);
    }
}

