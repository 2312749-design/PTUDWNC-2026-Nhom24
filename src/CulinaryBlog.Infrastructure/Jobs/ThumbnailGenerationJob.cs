using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Infrastructure.Services;
using Microsoft.Extensions.Logging;

namespace CulinaryBlog.Infrastructure.Jobs;

/// <summary>
/// Generates derived WebP files outside the upload request. The original file
/// has already been persisted before this job is enqueued, so a retry never
/// loses the image chosen by the user.
/// </summary>
public sealed class ThumbnailGenerationJob(
    IFileStorageService fileStorage,
    ILogger<ThumbnailGenerationJob> logger)
{
    public async Task GenerateAsync(byte[] sourceImage, string thumbnailFileName, string mediumFileName)
    {
        await using var thumbnailSource = new MemoryStream(sourceImage, writable: false);
        var thumbnailBytes = await ImageThumbnailService.CreateThumbnailAsync(thumbnailSource);
        await using var thumbnailStream = new MemoryStream(thumbnailBytes, writable: false);
        await fileStorage.UploadThumbnailAsync(thumbnailStream, thumbnailFileName, "image/webp");

        await using var mediumSource = new MemoryStream(sourceImage, writable: false);
        var mediumBytes = await ImageThumbnailService.CreateMediumAsync(mediumSource);
        await using var mediumStream = new MemoryStream(mediumBytes, writable: false);
        await fileStorage.UploadThumbnailAsync(mediumStream, mediumFileName, "image/webp");

        logger.LogInformation("Generated thumbnail and medium image for {ThumbnailFileName}.", thumbnailFileName);
    }
}
