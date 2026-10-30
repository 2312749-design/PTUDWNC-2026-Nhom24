using CulinaryBlog.Application.DTOs;
using MediatR;

namespace CulinaryBlog.Application.CQRS.Categories.Commands;

public sealed class UpdateCategoryCommand : IRequest<CategoryDto>
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? ImageUrl { get; init; }
}
