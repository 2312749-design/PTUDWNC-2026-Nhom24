namespace CulinaryBlog.Api.Endpoints.Requests;

public sealed record RegisterRequest(
    string Email,
    string DisplayName,
    string Password);
