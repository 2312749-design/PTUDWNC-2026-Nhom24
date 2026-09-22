using CulinaryBlog.Application.DTOs;
using MediatR;

namespace CulinaryBlog.Application.CQRS.Categories.Queries;

public class GetCategoriesQuery : IRequest<IEnumerable<CategoryDto>>
{
}