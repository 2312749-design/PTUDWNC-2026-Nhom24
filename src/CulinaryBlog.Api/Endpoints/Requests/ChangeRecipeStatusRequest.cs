namespace CulinaryBlog.Api.Endpoints.Requests;

public sealed class ChangeRecipeStatusRequest
{
    public string Status { get; set; } = string.Empty;
}
