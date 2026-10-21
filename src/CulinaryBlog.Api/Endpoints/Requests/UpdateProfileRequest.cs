namespace CulinaryBlog.Api.Endpoints.Requests;

public sealed record UpdateProfileRequest(
    string DisplayName,
    string Bio,
    string? AvatarUrl);
