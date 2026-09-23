using CulinaryBlog.Application.CQRS.Categories.Commands;
using CulinaryBlog.Application.CQRS.Categories.Queries;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Infrastructure.Persistence;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ApplicationDbContext _context;

        public CategoriesController(IMediator mediator, ApplicationDbContext context)
        {
            _mediator = mediator;
            _context = context;
        }

        // 1. Lấy danh sách tất cả Category (MediatR Query)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetAllCategories()
        {
            var result = await _mediator.Send(new GetCategoriesQuery());
            return Ok(result);
        }

        // 2. Tạo mới Category thông qua MediatR Command
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<CategoryDto>> CreateCategory([FromBody] CreateCategoryDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return BadRequest(new { message = "Tên danh mục không được để trống!" });
            }

            var command = new CreateCategoryCommand
            {
                Name = dto.Name,
                Description = dto.Description
            };

            var result = await _mediator.Send(command);

            return CreatedAtAction(nameof(GetAllCategories), new { id = result.Id }, result);
        }

        // 3. Cập nhật Category
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] CreateCategoryDto dto)
        {
            var existing = await _context.Categories.FindAsync(id);
            if (existing == null)
            {
                return NotFound(new { message = "Không tìm thấy danh mục cần cập nhật." });
            }

            existing.Name = dto.Name;
            existing.Description = dto.Description;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật danh mục thành công!" });
        }

        // 4. Xóa Category
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            var category = await _context.Categories
                .Include(c => c.Recipes)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
            {
                return NotFound(new { message = "Không tìm thấy danh mục cần xóa." });
            }

            if (category.Recipes.Any())
            {
                _context.Recipes.RemoveRange(category.Recipes);
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa danh mục và các món ăn liên quan thành công!" });
        }
    }
}