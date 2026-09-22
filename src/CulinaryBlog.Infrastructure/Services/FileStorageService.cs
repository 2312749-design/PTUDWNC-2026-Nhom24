using System;
using System.IO;
using System.Threading.Tasks;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Configuration;

namespace CulinaryBlog.Infrastructure.Services
{
    public class FileStorageService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;

        public FileStorageService(IConfiguration configuration)
        {
            var minioConfig = configuration.GetSection("MinIO");
            var endpoint = minioConfig["Endpoint"];
            var accessKey = minioConfig["AccessKey"];
            var secretKey = minioConfig["SecretKey"];
            _bucketName = minioConfig["BucketName"];

            var s3Config = new AmazonS3Config
            {
                ServiceURL = $"http://{endpoint}",
                ForcePathStyle = true
            };
            _s3Client = new AmazonS3Client(accessKey, secretKey, s3Config);
        }

        // Hàm xử lý upload chính
        public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType)
        {
            // 1. Kiểm tra giới hạn dung lượng (Tối đa 5MB)
            long maxFileSize = 5 * 1024 * 1024; // 5MB tính bằng bytes
            if (fileStream.Length > maxFileSize)
            {
                throw new Exception("Kích thước file vượt quá giới hạn 5MB cho phép.");
            }

            // 2. Kiểm tra Magic Bytes (Đảm bảo file thực sự là ảnh JPG hoặc PNG)
            var buffer = new byte[8];
            await fileStream.ReadAsync(buffer, 0, 8);
            
            bool isJpeg = buffer[0] == 0xFF && buffer[1] == 0xD8 && buffer[2] == 0xFF;
            bool isPng = buffer[0] == 0x89 && buffer[1] == 0x50 && buffer[2] == 0x4E && buffer[3] == 0x47;

            if (!isJpeg && !isPng)
            {
                throw new Exception("Định dạng không hợp lệ. Hệ thống chỉ chấp nhận ảnh thật (JPG/PNG).");
            }

            // Đưa con trỏ luồng dữ liệu về lại vị trí đầu tiên sau khi đã đọc kiểm tra
            fileStream.Position = 0;

            // 3. Đẩy file lên MinIO
            var uniqueFileName = $"{Guid.NewGuid()}_{fileName}";
            var putRequest = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = uniqueFileName,
                InputStream = fileStream,
                ContentType = contentType
            };

            await _s3Client.PutObjectAsync(putRequest);

            // 4. Trả về URL công khai
            return $"{_s3Client.Config.ServiceURL}/{_bucketName}/{uniqueFileName}";
        }
    }
}