namespace CulinaryBlog.Api.Endpoints.Requests;

public sealed record ChangePasswordRequest(
    string CurrentPassword,
    string NewPassword);
