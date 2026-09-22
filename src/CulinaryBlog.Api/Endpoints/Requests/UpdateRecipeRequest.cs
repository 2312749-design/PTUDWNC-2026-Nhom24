namespace CulinaryBlog.Api.Endpoints.Requests;

public class UpdateRecipeRequest
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int CookTimeMinutes { get; set; }
    public int Servings { get; set; }
    public string Difficulty { get; set; } = string.Empty;
    public string Status { get; set; } = "Draft";
    public Guid CategoryId { get; set; }
    public Guid AuthorId { get; set; }
}