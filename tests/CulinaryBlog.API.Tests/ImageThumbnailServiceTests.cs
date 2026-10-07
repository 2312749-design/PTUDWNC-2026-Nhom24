using CulinaryBlog.Infrastructure.Services;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using Xunit;

namespace CulinaryBlog.API.Tests;

public class ImageThumbnailServiceTests
{
    [Fact]
    public async Task CreateAsync_ResizesImageToWebpThumbnail()
    {
        await using var source = new MemoryStream();
        using (var image = new Image<Rgba32>(1200, 800))
        {
            image[0, 0] = new Rgba32(255, 0, 0, 255);
            await image.SaveAsync(source, new SixLabors.ImageSharp.Formats.Jpeg.JpegEncoder
            {
                Quality = 90
            });
        }
        source.Position = 0;

        var thumbnail = await ImageThumbnailService.CreateAsync(source);

        Assert.NotEmpty(thumbnail);
        Assert.Equal(0x52, thumbnail[0]);
        Assert.Equal(0x49, thumbnail[1]);
        Assert.Equal(0x46, thumbnail[2]);
        Assert.Equal(0x46, thumbnail[3]);
        Assert.Equal(0x57, thumbnail[8]);
        Assert.Equal(0x45, thumbnail[9]);
        Assert.Equal(0x42, thumbnail[10]);
        Assert.Equal(0x50, thumbnail[11]);

        await using var thumbnailStream = new MemoryStream(thumbnail);
        using var result = await Image.LoadAsync(thumbnailStream);
        Assert.Equal(320, result.Width);
        Assert.Equal(213, result.Height);
        Assert.True(result.Width <= ImageThumbnailService.MaxWidth);
        Assert.True(result.Height <= ImageThumbnailService.MaxHeight);
    }
}
