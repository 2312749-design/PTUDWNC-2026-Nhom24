using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;

namespace CulinaryBlog.Infrastructure.Services
{
    public interface IFileStorageService
    {
        Task<string> UploadFileAsync(IFormFile file, string bucketName, string prefix);
        Task DeleteFileAsync(string fileUrl, string bucketName);
    }

    // [KN-01] Tích hợp AWS SDK & MinIO 
    public class MinioFileStorageService : IFileStorageService
    {
        private readonly IAmazonS3 _s3Client;

        public MinioFileStorageService(IAmazonS3 s3Client)
        {
            _s3Client = s3Client;
        }

        // [KN-02] API Upload Ảnh An Toàn (Check Magic Byte, Limit < 5MB)
        public async Task<string> UploadFileAsync(IFormFile file, string bucketName, string prefix)
        {
            // 1. Kiểm tra dung lượng: Không được vượt quá 5MB
            if (file.Length > 5 * 1024 * 1024)
            {
                throw new Exception("Kích thước tệp vượt quá giới hạn 5MB.");
            }

            // 2. Kiểm tra Magic Bytes để chống giả mạo đuôi file
            using var stream = file.OpenReadStream();
            byte[] buffer = new byte[12];
            await stream.ReadAsync(buffer, 0, 12);

            if (!IsImage(buffer))
            {
                throw new Exception("Định dạng tệp không hợp lệ hoặc bị giả mạo. Chỉ chấp nhận ảnh JPEG, PNG, WebP.");
            }

            // Đặt lại luồng đọc về vị trí ban đầu để MinIO có thể đọc và lưu
            stream.Position = 0;

            // 3. Tiến hành đẩy file lên MinIO (S3)
            var fileName = $"{prefix}/{Guid.NewGuid()}_{file.FileName}";
            var putRequest = new PutObjectRequest
            {
                BucketName = bucketName,
                Key = fileName,
                InputStream = stream,
                ContentType = file.ContentType
            };

            await _s3Client.PutObjectAsync(putRequest);

            return fileName;
        }

     // [KN-03] Logic Xóa Ảnh Ngầm
        public async Task DeleteFileAsync(string fileUrl, string bucketName)
        {
            try
            {
                var deleteRequest = new DeleteObjectRequest
                {
                    BucketName = bucketName,
                    // Key trong AWS S3/MinIO chính là tên file hoặc đường dẫn tương đối của file
                    Key = fileUrl 
                };

                await _s3Client.DeleteObjectAsync(deleteRequest);
            }
            catch (Exception ex)
            {
                // Ném lỗi ra để Hangfire biết tác vụ thất bại và tự động đưa vào hàng đợi chạy lại (Retry)
                throw new Exception($"Lỗi hệ thống khi dọn dẹp ảnh trên MinIO: {ex.Message}");
            }
        }

        // Hàm phụ trợ giúp soi Magic Bytes của file
        private bool IsImage(byte[] buffer)
        {
            // Kiểm tra chuẩn JPEG: Bắt đầu bằng FF D8 FF
            if (buffer[0] == 0xFF && buffer[1] == 0xD8 && buffer[2] == 0xFF) return true;
            
            // Kiểm tra chuẩn PNG: Bắt đầu bằng 89 50 4E 47
            if (buffer[0] == 0x89 && buffer[1] == 0x50 && buffer[2] == 0x4E && buffer[3] == 0x47) return true;
            
            // Kiểm tra chuẩn WebP: Bắt đầu bằng RIFF và có chữ WEBP ở byte thứ 8
            if (buffer[0] == 0x52 && buffer[1] == 0x49 && buffer[2] == 0x46 && buffer[3] == 0x46 &&
                buffer[8] == 0x57 && buffer[9] == 0x45 && buffer[10] == 0x42 && buffer[11] == 0x50) return true;

            return false;
        }
    }
}