namespace CulinaryBlog.Application.DTOs;

public sealed class ImageUploadResult
{
    public string MediaUrl { get; init; } = string.Empty;
    public string ThumbnailUrl { get; init; } = string.Empty;
    public string MediaType { get; init; } = "image";
}
