using CulinaryBlog.Application.CQRS.Categories.Commands;
using CulinaryBlog.Application.CQRS.Categories.Queries;
using CulinaryBlog.Application.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CulinaryBlog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public CategoriesController(IMediator mediator)
        {
            _mediator = mediator;
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
    }
}