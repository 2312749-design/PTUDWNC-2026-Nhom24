using System.ComponentModel.DataAnnotations;

namespace CulinaryBlog.Application.Validation;

/// <summary>
/// Accepts a regular HTTP(S) URL or a path returned by this application's
/// upload endpoints. Uploads stored locally deliberately return /uploads/...,
/// which is not an absolute URL and therefore cannot be validated with UrlAttribute.
/// </summary>
[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter)]
public sealed class StoredMediaUrlAttribute : ValidationAttribute
{
    public StoredMediaUrlAttribute()
        : base("Đường dẫn ảnh phải là URL HTTP(S) hoặc tệp đã tải lên trong /uploads/.")
    {
    }

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is null || string.IsNullOrWhiteSpace(value.ToString()))
            return ValidationResult.Success;

        var mediaUrl = value.ToString()!.Trim();
        if (Uri.TryCreate(mediaUrl, UriKind.Absolute, out var absoluteUri) &&
            (absoluteUri.Scheme == Uri.UriSchemeHttp || absoluteUri.Scheme == Uri.UriSchemeHttps))
            return ValidationResult.Success;

        var isLocalUpload = mediaUrl.StartsWith("/uploads/", StringComparison.Ordinal) &&
                            !mediaUrl.Contains("..", StringComparison.Ordinal) &&
                            !mediaUrl.Contains('\\') &&
                            !mediaUrl.Contains('?') &&
                            !mediaUrl.Contains('#');
        return isLocalUpload ? ValidationResult.Success : new ValidationResult(ErrorMessage);
    }
}
