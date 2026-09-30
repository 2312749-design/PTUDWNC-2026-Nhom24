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

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<RecipeDto>> GetRecipeById(Guid id)
        {
            var recipe = await _context.Recipes
                .Include(r => r.Category)
                .Include(r => r.Author)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (recipe == null)
            {
                return NotFound(new { message = "Không tìm thấy công thức nấu ăn." });
            }

            var ingredients = await _context.RecipeIngredients
                .Where(item => item.RecipeId == id)
                .OrderBy(item => item.Order)
                .Select(item => new RecipeIngredientDto
                {
                    Id = item.Id,
                    RecipeId = item.RecipeId,
                    Name = item.Name,
                    Quantity = item.Quantity,
                    Unit = item.Unit,
                    Order = item.Order
                })
                .ToListAsync();
            var steps = await _context.RecipeSteps
                .Where(item => item.RecipeId == id)
                .OrderBy(item => item.Order)
                .Select(item => new RecipeStepDto
                {
                    Id = item.Id,
                    RecipeId = item.RecipeId,
                    Title = item.Title,
                    Description = item.Description,
                    Order = item.Order
                })
                .ToListAsync();

            return Ok(new RecipeDto
            {
                Id = recipe.Id,
                Title = recipe.Title,
                Slug = recipe.Slug,
                Description = recipe.Description,
                ImageUrl = recipe.ImageUrl,
                Ingredients = recipe.Ingredients,
                Instructions = recipe.Instructions,
                RecipeIngredients = ingredients,
                RecipeSteps = steps,
                CategoryId = recipe.CategoryId,
                CategoryName = recipe.Category != null ? recipe.Category.Name : string.Empty,
                AuthorId = recipe.AuthorId,
                Status = recipe.Status,
                CookingTimeMinutes = recipe.CookingTimeMinutes,
                Difficulty = recipe.Difficulty,
                IsVegetarian = recipe.IsVegetarian
            });
        }

        [HttpPost("{id:guid}/view")]
        [Authorize]
        public async Task<IActionResult> RecordView(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            if (!await _context.Recipes.AnyAsync(recipe => recipe.Id == id)) return NotFound();
            var view = await _context.RecipeViews.FindAsync(id, userId);
            if (view == null) _context.RecipeViews.Add(new CulinaryBlog.Domain.Entities.RecipeView { RecipeId = id, UserId = userId });
            else view.ViewedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok(new { recorded = true });
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
                ImageUrl = dto.ImageUrl,
                Ingredients = dto.Ingredients,
                Instructions = dto.Instructions,
                RecipeIngredients = dto.RecipeIngredients,
                RecipeSteps = dto.RecipeSteps,
                CategoryId = dto.CategoryId,
                AuthorId = userId,
                CookingTimeMinutes = dto.CookingTimeMinutes,
                Difficulty = dto.Difficulty,
                IsVegetarian = dto.IsVegetarian
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
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(new { message = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." });
            }

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

            recipe.Update(
                dto.Title,
                dto.Description,
                dto.Ingredients,
                dto.Instructions,
                dto.CategoryId,
                dto.Status,
                dto.ImageUrl,
                dto.CookingTimeMinutes,
                dto.Difficulty,
                dto.IsVegetarian
            );

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