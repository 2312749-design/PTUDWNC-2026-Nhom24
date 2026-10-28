using System.Buffers;
using Microsoft.AspNetCore.Mvc;

namespace CulinaryBlog.Api.Endpoints;

public static class MediaEndpoints
{
    private const long MaxImageSizeBytes = 5 * 1024 * 1024;
    private const int SignatureLength = 12;

    public static void MapMediaEndpoints(this RouteGroupBuilder apiV1)
    {
        apiV1.MapPost("/media/images", async (
            IFormFile file,
            IWebHostEnvironment environment,
            CancellationToken cancellationToken) =>
        {
            if (file.Length is <= 0 or > MaxImageSizeBytes)
            {
                return Results.BadRequest(new
                {
                    message = "Ảnh phải có dung lượng từ 1 byte đến 5 MB."
                });
            }

            var signature = ArrayPool<byte>.Shared.Rent(SignatureLength);
            try
            {
                await using var input = file.OpenReadStream();
                var bytesRead = 0;
                while (bytesRead < SignatureLength)
                {
                    var read = await input.ReadAsync(
                        signature.AsMemory(bytesRead, SignatureLength - bytesRead),
                        cancellationToken);
                    if (read == 0)
                    {
                        break;
                    }

                    bytesRead += read;
                }

                var extension = GetImageExtension(signature.AsSpan(0, bytesRead));
                if (extension is null)
                {
                    return Results.BadRequest(new
                    {
                        message = "Chỉ chấp nhận ảnh JPEG, PNG hoặc WebP hợp lệ."
                    });
                }

                input.Position = 0;
                var uploadDirectory = Path.Combine(
                    environment.WebRootPath ?? Path.Combine(environment.ContentRootPath, "wwwroot"),
                    "uploads");
                Directory.CreateDirectory(uploadDirectory);
                var fileName = $"{Guid.NewGuid():N}{extension}";
                var filePath = Path.Combine(uploadDirectory, fileName);
                await using (var output = new FileStream(
                    filePath,
                    FileMode.CreateNew,
                    FileAccess.Write,
                    FileShare.None,
                    81920,
                    FileOptions.Asynchronous))
                {
                    await input.CopyToAsync(output, cancellationToken);
                }

                return Results.Created(
                    $"/uploads/{fileName}",
                    new { url = $"/uploads/{fileName}" });
            }
            finally
            {
                ArrayPool<byte>.Shared.Return(signature);
            }
        })
        .RequireAuthorization("Author")
        .DisableAntiforgery()
        .WithMetadata(new RequestSizeLimitAttribute(MaxImageSizeBytes + 128 * 1024))
        .WithMetadata(new RequestFormLimitsAttribute
        {
            MultipartBodyLengthLimit = MaxImageSizeBytes + 128 * 1024
        });
    }

    private static string? GetImageExtension(ReadOnlySpan<byte> signature)
    {
        if (signature.Length >= 3 &&
            signature[0] == 0xFF &&
            signature[1] == 0xD8 &&
            signature[2] == 0xFF)
        {
            return ".jpg";
        }

        ReadOnlySpan<byte> pngSignature =
            [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
        if (signature.Length >= pngSignature.Length &&
            signature[..pngSignature.Length].SequenceEqual(pngSignature))
        {
            return ".png";
        }

        if (signature.Length >= 12 &&
            signature[..4].SequenceEqual("RIFF"u8) &&
            signature[8..12].SequenceEqual("WEBP"u8))
        {
            return ".webp";
        }

        return null;
    }
}
