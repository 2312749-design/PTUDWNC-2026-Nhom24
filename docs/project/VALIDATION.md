# Kết quả kiểm tra khi bổ sung hồ sơ GitHub

Ngày ghi nhận: 28/10/2026. Code đang chạy được giữ nguyên; thay đổi trong đợt tổ chức repository là CI, tài liệu, biểu mẫu và hồ sơ công việc.

| Kiểm tra | Kết quả | Phạm vi và giới hạn |
|---|---|---|
| Backend Release | 61/61 test đạt | Chạy suite bằng `dotnet test tests/CulinaryBlog.API.Tests/CulinaryBlog.API.Tests.csproj --configuration Release --artifacts-path .artifacts/github-setup`; kết quả không chứng minh mọi tích hợp ngoài đã được thử thật. |
| Frontend contracts và structured data | 7/7 test đạt | `npm test` trong frontend. |
| Docker Compose | Cú pháp hợp lệ | `docker compose config --quiet` với giá trị giả lập chỉ dùng để nội suy biến bắt buộc; không khởi tạo lại container hoặc volume. |
| Build frontend và browser UI gần nhất | 41 trang build; 23/23 browser test đạt ở phiên 27/10/2026 | Đây là kết quả trước đợt chỉnh tài liệu. Browser test có API giả lập; CI sẽ chạy lại từ checkout sạch. |

## Cần xác nhận trên GitHub và khi nghiệm thu

- Liên kết lượt Actions của PR và xác nhận checkout sạch build/test đạt.
- Chạy demo PostgreSQL FTS, Redis failure/invalidation và MinIO thật theo các Issue.
- Google OAuth cần Client ID thật; email cần SMTP và bằng chứng thư đến hộp thư.
- Chưa có xác nhận review của thành viên khác; không tự tạo review thay thành viên.
- Chưa xác nhận toàn bộ chuỗi migration/seed từ database trống trong lần tổ chức hồ sơ này.

CI được bổ sung trigger cho nhánh Lab và codex, giá trị mẫu cho POSTGRES_PASSWORD/MINIO_ROOT_USER/MINIO_ROOT_PASSWORD/JWT_SECRET và lưu test diagnostics. Các giá trị đó không phải cấu hình triển khai.
