using CulinaryBlog.Application.DTOs;
using MediatR;

namespace CulinaryBlog.Application.CQRS.Recipes.Queries;

public class GetRecipesQuery : IRequest<IEnumerable<RecipeDto>>
{
}