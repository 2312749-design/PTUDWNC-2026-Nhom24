namespace CulinaryBlog.Api.Endpoints.Requests;

public class CreateIngredientRequest
{
    public string Name { get; set; } = string.Empty;

    public decimal? Quantity { get; set; }

    public string? Unit { get; set; }

    public string? Notes { get; set; }

    public int OrderIndex { get; set; }
}