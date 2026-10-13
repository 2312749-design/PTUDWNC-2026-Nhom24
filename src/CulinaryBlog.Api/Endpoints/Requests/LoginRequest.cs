namespace CulinaryBlog.Api.Endpoints.Requests;

public sealed record LoginRequest(
    string Email,
    string Password);
