using Microsoft.AspNetCore.Http;
using ImageMagick;

namespace CulinaryBlog.Infrastructure.Services;

public sealed record ValidatedImage(byte[] Content, string ContentType, string Extension);

public static class ImageUploadValidationService
{
    public const long MaxFileSize = 5L * 1024 * 1024;
    private const long MaxPixels = 40_000_000;

    public static async Task<(ValidatedImage? Image, string? Error)> ValidateAsync(
        IFormFile? file,
        CancellationToken cancellationToken = default)
    {
        if (file is null || file.Length == 0)
            return (null, "Vui lòng chọn ảnh để tải lên.");
        if (file.Length > MaxFileSize)
            return (null, "Ảnh tải lên tối đa 5 MB.");

        await using var source = file.OpenReadStream();
        await using var buffer = new MemoryStream();
        await source.CopyToAsync(buffer, cancellationToken);
        var bytes = buffer.ToArray();

        try
        {
            cancellationToken.ThrowIfCancellationRequested();
            using var image = new MagickImage(bytes);
            if ((long)image.Width * image.Height > MaxPixels)
                return (null, "Tệp ảnh không hợp lệ hoặc có kích thước quá lớn.");

            var media = image.Format switch
            {
                MagickFormat.Jpeg => ("image/jpeg", ".jpg"),
                MagickFormat.Png => ("image/png", ".png"),
                MagickFormat.WebP => ("image/webp", ".webp"),
                MagickFormat.Avif => ("image/avif", ".avif"),
                _ => default
            };

            return media == default
                ? (null, "Chỉ hỗ trợ ảnh JPEG, PNG, WebP hoặc AVIF hợp lệ.")
                : (new ValidatedImage(bytes, media.Item1, media.Item2), null);
        }
        catch (MagickException)
        {
            return (null, "Nội dung ảnh bị hỏng hoặc không hợp lệ.");
        }
    }
}
