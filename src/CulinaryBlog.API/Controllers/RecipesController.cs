using CulinaryBlog.Application.CQRS.Recipes.Commands;
using CulinaryBlog.Application.CQRS.Recipes.Queries;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Infrastructure.Persistence;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CulinaryBlog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipesController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ApplicationDbContext _context; // Vẫn giữ lại tạm thời cho Update/Delete

        public RecipesController(IMediator mediator, ApplicationDbContext context)
        {
            _mediator = mediator;
            _context = context;
        }

        // 1. Lấy danh sách tất cả Recipe thông qua MediatR CQRS Query
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecipeDto>>> GetAllRecipes()
        {
            var result = await _mediator.Send(new GetRecipesQuery());
            return Ok(result);
        }

        // 2. Tạo mới Recipe thông qua MediatR Command (Đã chuyển đổi chuẩn CQRS)
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<RecipeDto>> CreateRecipe([FromBody] CreateRecipeDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Không tìm thấy thông tin định danh người dùng từ Token!" });
            }

            var command = new CreateRecipeCommand
            {
                Title = dto.Title,
                Description = dto.Description,
                Ingredients = dto.Ingredients,
                Instructions = dto.Instructions,
                CategoryId = dto.CategoryId,
                AuthorId = userId
            };

            try
            {
                var result = await _mediator.Send(command);
                return CreatedAtAction(nameof(GetAllRecipes), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // 3. Cập nhật Recipe (Chỉ tác giả tạo ra mới có quyền sửa)
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateRecipe(Guid id, [FromBody] UpdateRecipeDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var recipe = await _context.Recipes.FindAsync(id);

            if (recipe == null)
            {
                return NotFound(new { message = "Không tìm thấy công thức nấu ăn cần sửa!" });
            }

            if (recipe.AuthorId != userId)
            {
                return Forbid();
            }

            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId);
            if (!categoryExists)
            {
                return BadRequest(new { message = "Danh mục (CategoryId) không tồn tại!" });
            }

            recipe.Update(dto.Title, dto.Description, dto.Ingredients, dto.Instructions, dto.CategoryId, dto.Status);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật công thức nấu ăn thành công!" });
        }

        // 4. Xóa Recipe (Chỉ tác giả mới có quyền xóa)
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteRecipe(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var recipe = await _context.Recipes.FindAsync(id);

            if (recipe == null)
            {
                return NotFound(new { message = "Không tìm thấy công thức nấu ăn cần xóa!" });
            }

            if (recipe.AuthorId != userId)
            {
                return Forbid();
            }

            _context.Recipes.Remove(recipe);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa công thức nấu ăn thành công!" });
        }
    }
}