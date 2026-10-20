using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CulinaryBlog.API.Endpoints
{
    public class TestHandlers : EndpointHandler
    {
        public ApiResponseResult GetSecureData()
        {
            return Ok(new { message = "🎉 Chúc mừng Thành! Bạn đã gọi thành công API được bảo vệ bằng JWT Token." });
        }
    }
}