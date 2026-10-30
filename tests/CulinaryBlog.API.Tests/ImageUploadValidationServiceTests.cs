using CulinaryBlog.Infrastructure.Services;
using ImageMagick;
using Microsoft.AspNetCore.Http;
using Xunit;

namespace CulinaryBlog.API.Tests;

public sealed class ImageUploadValidationServiceTests
{
    [Fact]
    public async Task ValidateAsync_UsesActualImageContentInsteadOfDeclaredMimeType()
    {
        using var image = new MagickImage(MagickColors.Red, 20, 20) { Format = MagickFormat.Jpeg };
        var file = CreateFile(image.ToByteArray(), "image/png");

        var result = await ImageUploadValidationService.ValidateAsync(file);

        Assert.NotNull(result.Image);
        Assert.Equal("image/jpeg", result.Image!.ContentType);
        Assert.Equal(".jpg", result.Image.Extension);
    }

    [Fact]
    public async Task ValidateAsync_RejectsAFileThatOnlyClaimsToBeAnImage()
    {
        var file = CreateFile("not an image"u8.ToArray(), "image/jpeg");

        var result = await ImageUploadValidationService.ValidateAsync(file);

        Assert.Null(result.Image);
        Assert.NotNull(result.Error);
    }

    [Fact]
    public async Task ValidateAsync_AcceptsAvifAndItsThumbnailCanBeConvertedToWebp()
    {
        using var avif = new MagickImage(MagickColors.CornflowerBlue, 24, 24) { Format = MagickFormat.Avif };
        var content = avif.ToByteArray();

        var validation = await ImageUploadValidationService.ValidateAsync(CreateFile(content, "image/avif"));

        Assert.NotNull(validation.Image);
        Assert.Equal("image/avif", validation.Image!.ContentType);
        await using var source = new MemoryStream(validation.Image.Content);
        var thumbnail = await ImageThumbnailService.CreateThumbnailAsync(source);
        Assert.Equal("RIFF"u8.ToArray(), thumbnail[..4]);
    }

    private static IFormFile CreateFile(byte[] content, string contentType) => new FormFile(
        new MemoryStream(content), 0, content.Length, "file", "upload.bin")
    {
        Headers = new HeaderDictionary(),
        ContentType = contentType
    };
}
