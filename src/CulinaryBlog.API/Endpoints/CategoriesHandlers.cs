using CulinaryBlog.Application.CQRS.Categories.Commands;
using CulinaryBlog.Application.CQRS.Categories.Queries;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.API.Endpoints
{
    public class CategoriesHandlers : EndpointHandler
    {
        private readonly IMediator _mediator;
        private readonly ApplicationDbContext _context;
        private readonly ICacheService _cache;

        public CategoriesHandlers(IMediator mediator, ApplicationDbContext context, ICacheService cache)
        {
            _mediator = mediator;
            _context = context;
            _cache = cache;
        }

        // 1. Lấy danh sách tất cả Category (MediatR Query)
        public async Task<ApiResponseResult> GetAllCategories()
        {
            var result = await _mediator.Send(new GetCategoriesQuery());
            return Ok(result);
        }

        // 2. Tạo mới Category thông qua MediatR Command
        public async Task<ApiResponseResult> CreateCategory([FromBody] CreateCategoryDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return BadRequest(new { message = "Tên danh mục không được để trống!" });
            }

            var command = new CreateCategoryCommand
            {
                Name = dto.Name,
                Description = dto.Description,
                ImageUrl = dto.ImageUrl
            };

            var result = await _mediator.Send(command);

            return Created("/api/v1/categories", result);
        }

        // 3. Cập nhật Category
        public async Task<ApiResponseResult> UpdateCategory(Guid id, [FromBody] CreateCategoryDto dto)
        {
            var existing = await _context.Categories.FindAsync(id);
            if (existing == null || existing.IsDeleted)
            {
                return NotFound(new { message = "Không tìm thấy danh mục cần cập nhật." });
            }

            var name = dto.Name?.Trim() ?? string.Empty;
            var slug = Category.CreateSlug(name);
            var duplicateExists = await _context.Categories.AnyAsync(category => category.Id != id &&
                (category.Name.ToUpper() == name.ToUpper() || category.Slug == slug));
            if (duplicateExists)
            {
                return Conflict(new { message = "Tên hoặc slug danh mục đã tồn tại." });
            }

            existing.Update(name, dto.Description, dto.ImageUrl);
            await _context.SaveChangesAsync();

            await InvalidateCachesAsync(id);
            return Ok(new { message = "Cập nhật danh mục thành công!" });
        }

        // 4. Xóa Category
        public async Task<ApiResponseResult> DeleteCategory(Guid id)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);

            if (category == null || category.IsDeleted)
            {
                return NotFound(new { message = "Không tìm thấy danh mục cần xóa." });
            }

            var hasActiveRecipe = await _context.Recipes
                .AnyAsync(recipe => recipe.CategoryId == id && !recipe.IsDeleted);
            if (hasActiveRecipe)
            {
                return Conflict(new { message = "Không thể xóa danh mục khi còn công thức đang hoạt động." });
            }

            category.SoftDelete();
            await _context.SaveChangesAsync();

            await InvalidateCachesAsync(id);
            return Ok(new { message = "Xóa mềm danh mục thành công." });
        }

        private async Task InvalidateCachesAsync(Guid categoryId)
        {
            await _cache.RemoveAsync(CacheKeys.Categories);
            await _cache.RemoveAsync(CacheKeys.Category(categoryId));
            await _cache.RemoveAsync(CacheKeys.Recipes);
        }
    }
}
