namespace CulinaryBlog.Api.Endpoints.Requests;

public class CreateStepRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int? TimerMinutes { get; set; }
    public string? ImageUrl { get; set; }
}