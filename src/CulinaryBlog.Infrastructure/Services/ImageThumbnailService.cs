using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;

namespace CulinaryBlog.Infrastructure.Services;

public static class ImageThumbnailService
{
    public const int MaxWidth = 320;
    public const int MaxHeight = 240;

    public static async Task<byte[]> CreateAsync(Stream source, CancellationToken cancellationToken = default)
    {
        using var image = await Image.LoadAsync(source, cancellationToken);
        var destinationSize = GetDestinationSize(image.Width, image.Height);
        image.Mutate(configuration => configuration.Resize(
            destinationSize.Width,
            destinationSize.Height));

        using var output = new MemoryStream();
        await image.SaveAsync(output, new WebpEncoder { FileFormat = WebpFileFormatType.Lossless }, cancellationToken);
        return output.ToArray();
    }

    private static (int Width, int Height) GetDestinationSize(int width, int height)
    {
        var scale = Math.Min(Math.Min((double)MaxWidth / width, (double)MaxHeight / height), 1);
        return (Math.Max(1, (int)Math.Round(width * scale)), Math.Max(1, (int)Math.Round(height * scale)));
    }
}
