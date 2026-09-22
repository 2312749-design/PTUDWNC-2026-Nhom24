using CulinaryBlog.Application.DTOs;
using MediatR;

namespace CulinaryBlog.Application.CQRS.Recipes.Commands;

public class CreateRecipeCommand : IRequest<RecipeDto>
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<string> Ingredients { get; set; } = new();
    public List<string> Instructions { get; set; } = new();
    public Guid CategoryId { get; set; }
    public string AuthorId { get; set; } = string.Empty; // Nhận AuthorId từ Controller (lấy từ Token)
}