namespace CulinaryBlog.Application.Interfaces;

public interface IFileStorageService
{
    Task<string> UploadAsync(Stream content, string fileName, string contentType, CancellationToken cancellationToken = default);
    Task<string> UploadThumbnailAsync(Stream content, string fileName, string contentType, CancellationToken cancellationToken = default);
    Task DeleteAsync(string objectKey, CancellationToken cancellationToken = default);
    string GetPublicUrl(string objectKey);
}
