using MediatR;

namespace CulinaryBlog.Application.CQRS.Categories.Commands;

public sealed class DeleteCategoryCommand : IRequest
{
    public Guid Id { get; init; }
}
