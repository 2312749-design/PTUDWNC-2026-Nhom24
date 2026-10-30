using ImageMagick;

namespace CulinaryBlog.Infrastructure.Services;

public static class ImageThumbnailService
{
    public const int ThumbnailWidth = 300;
    public const int ThumbnailHeight = 300;
    public const int MediumWidth = 800;
    public const int MediumHeight = 600;
    public const int MaxWidth = ThumbnailWidth;
    public const int MaxHeight = ThumbnailHeight;

    public static Task<byte[]> CreateAsync(Stream source, CancellationToken cancellationToken = default) =>
        CreateThumbnailAsync(source, cancellationToken);

    public static Task<byte[]> CreateThumbnailAsync(Stream source, CancellationToken cancellationToken = default) =>
        CreateWebpAsync(source, ThumbnailWidth, ThumbnailHeight, crop: true, cancellationToken);

    public static Task<byte[]> CreateMediumAsync(Stream source, CancellationToken cancellationToken = default) =>
        CreateWebpAsync(source, MediumWidth, MediumHeight, crop: false, cancellationToken);

    private static Task<byte[]> CreateWebpAsync(
        Stream source,
        int width,
        int height,
        bool crop,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        using var image = new MagickImage(source);
        var geometry = new MagickGeometry((uint)width, (uint)height);
        if (crop)
        {
            geometry.FillArea = true;
            image.Resize(geometry);
            image.Crop((uint)width, (uint)height, Gravity.Center);
            image.ResetPage();
        }
        else
        {
            image.Resize(geometry);
        }

        image.Format = MagickFormat.WebP;
        return Task.FromResult(image.ToByteArray());
    }
}
