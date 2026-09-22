using CulinaryBlog.Application.CQRS.Recipes.Queries;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.CQRS.Recipes.Handlers;

public class GetRecipesQueryHandler : IRequestHandler<GetRecipesQuery, IEnumerable<RecipeDto>>
{
    private readonly IApplicationDbContext _context;

    public GetRecipesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<RecipeDto>> Handle(GetRecipesQuery request, CancellationToken cancellationToken)
    {
        return await _context.Recipes
            .Include(r => r.Category)
            .Include(r => r.Author)
            .Select(r => new RecipeDto
            {
                Id = r.Id,
                Title = r.Title,
                Slug = r.Slug,
                Description = r.Description,
                Ingredients = r.Ingredients,
                Instructions = r.Instructions,
                CategoryId = r.CategoryId,
                CategoryName = r.Category != null ? r.Category.Name : string.Empty,
                AuthorId = r.AuthorId,
                Status = r.Status
            })
            .ToListAsync(cancellationToken);
    }
}