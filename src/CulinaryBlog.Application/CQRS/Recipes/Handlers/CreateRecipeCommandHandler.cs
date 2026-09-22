using CulinaryBlog.Application.CQRS.Recipes.Commands;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.Interfaces; // Dùng IApplicationDbContext chuẩn Clean Architecture
using CulinaryBlog.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.CQRS.Recipes.Handlers;

public class CreateRecipeCommandHandler : IRequestHandler<CreateRecipeCommand, RecipeDto>
{
    private readonly IApplicationDbContext _context;

    public CreateRecipeCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<RecipeDto> Handle(CreateRecipeCommand request, CancellationToken cancellationToken)
    {
        // 1. Kiểm tra Category có tồn tại không
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId, cancellationToken);
        if (!categoryExists)
        {
            throw new Exception("Danh mục (CategoryId) không tồn tại trong hệ thống!");
        }

        // 2. Sử dụng Domain Factory Method (Recipe.Create) theo thiết kế DDD hiện tại
        var recipe = Recipe.Create(
            request.Title,
            request.Description,
            request.Ingredients,
            request.Instructions,
            request.CategoryId,
            request.AuthorId
        );

        // 3. Lưu vào Database thông qua IApplicationDbContext
        _context.Recipes.Add(recipe);
        await _context.SaveChangesAsync(cancellationToken);

        // 4. Trả về Response DTO
        return new RecipeDto
        {
            Id = recipe.Id,
            Title = recipe.Title,
            Slug = recipe.Slug,
            Description = recipe.Description,
            Ingredients = recipe.Ingredients,
            Instructions = recipe.Instructions,
            CategoryId = recipe.CategoryId,
            AuthorId = recipe.AuthorId,
            Status = recipe.Status
        };
    }
}