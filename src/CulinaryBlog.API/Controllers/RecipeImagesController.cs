using CulinaryBlog.Infrastructure.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace CulinaryBlog.API.Controllers
{
    // Cấu hình đường dẫn gốc cho toàn bộ Controller này
    [Route("api/v1/recipes")]
    [ApiController]
    public class RecipeImagesController : ControllerBase
    {
        private readonly IFileStorageService _fileStorageService;

        public RecipeImagesController(IFileStorageService fileStorageService)
        {
            _fileStorageService = fileStorageService;
        }

        // [KN-02] API Upload Ảnh An Toàn
        // Tạo endpoint nhận phương thức POST đúng yêu cầu: /api/v1/recipes/{id}/images
        [HttpPost("{id}/images")]
        public async Task<IActionResult> UploadImage(int id, IFormFile file)
        {
            // Kiểm tra xem người dùng có gửi file lên không (multipart/form-data)
            if (file == null || file.Length == 0)
            {
                return BadRequest("Vui lòng chọn một tệp ảnh hợp lệ.");
            }

            try
            {
                // Gọi "bộ máy" MinioFileStorageService lúc nãy để kiểm tra 5MB và Magic Bytes
                string bucketName = "culinary-blog-images"; 
                string prefix = $"recipes/{id}"; // Lưu ảnh vào thư mục riêng của từng món ăn
                
                var fileUrl = await _fileStorageService.UploadFileAsync(file, bucketName, prefix);
                
                // Nếu an toàn đi qua hết các bước kiểm tra, trả về link ảnh thành công
                return Ok(new { 
                    Url = fileUrl, 
                    Message = "Tải ảnh lên hệ thống thành công!" 
                });
            }
            catch (Exception ex)
            {
                // Bắt lỗi nếu file > 5MB hoặc sai định dạng Magic Byte
                return BadRequest(new { Error = ex.Message }); 
            }
        }
    }
}