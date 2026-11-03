using CulinaryBlog.Infrastructure.Services;
using ImageMagick;
using Xunit;

namespace CulinaryBlog.API.Tests;

public class ImageThumbnailServiceTests
{
    [Fact]
    public async Task CreateAsync_ResizesImageToWebpThumbnail()
    {
        using var image = new MagickImage(MagickColors.Red, 1200, 800) { Format = MagickFormat.Jpeg };
        await using var source = new MemoryStream(image.ToByteArray());

        var thumbnail = await ImageThumbnailService.CreateAsync(source);

        Assert.NotEmpty(thumbnail);
        Assert.Equal("RIFF"u8.ToArray(), thumbnail[..4]);
        Assert.Equal("WEBP"u8.ToArray(), thumbnail[8..12]);
        using var result = new MagickImage(thumbnail);
        Assert.Equal(300U, result.Width);
        Assert.Equal(300U, result.Height);
    }

    [Fact]
    public async Task CreateMediumAsync_CreatesWebpWithin800By600()
    {
        using var image = new MagickImage(MagickColors.Blue, 1600, 900) { Format = MagickFormat.Png };
        await using var source = new MemoryStream(image.ToByteArray());

        var medium = await ImageThumbnailService.CreateMediumAsync(source);

        using var result = new MagickImage(medium);
        Assert.Equal(800U, result.Width);
        Assert.Equal(450U, result.Height);
    }
}
