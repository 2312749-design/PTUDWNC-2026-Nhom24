using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CulinaryBlog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        [HttpGet("secure-data")]
        [Authorize]
        public IActionResult GetSecureData()
        {
            return Ok(new { message = "🎉 Chúc mừng Thành! Bạn đã gọi thành công API được bảo vệ bằng JWT Token." });
        }
    }
}