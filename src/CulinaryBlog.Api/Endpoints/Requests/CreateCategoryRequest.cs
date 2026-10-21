namespace CulinaryBlog.Api.Endpoints.Requests;

public sealed record CreateCategoryRequest(
    string Name,
    string Slug,
    string Description);
