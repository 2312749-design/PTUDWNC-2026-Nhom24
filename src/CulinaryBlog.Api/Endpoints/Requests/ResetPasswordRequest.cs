namespace CulinaryBlog.Api.Endpoints.Requests;

public sealed record ResetPasswordRequest(
    string Email,
    string Token,
    string NewPassword);
