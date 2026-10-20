# Đối chiếu yêu cầu — 19/10/2026

| Hạng mục | Đã bổ sung |
| --- | --- |
| Next.js App Router | Toàn bộ URL có page riêng; bỏ React Router, ClientApp fallback, App.jsx, main.jsx và Vite config. |
| Minimal API | 12 nhóm nghiệp vụ dùng MapGet/MapPost/MapPut/MapPatch/MapDelete; handler trả IResult, không dùng ControllerBase/MapControllers. Giữ URL `/api` và `/api/v1`, phân quyền, validation và data/meta/problem. |
| Admin dashboard | `/admin`: thống kê, thành viên phân trang, báo cáo và đánh dấu xử lý, trạng thái xuất bản công thức, liên kết quản lý danh mục. API quản trị yêu cầu Admin. |
| JSON-LD | WebSite, Recipe, BlogPosting từ dữ liệu công khai; escape `<` để chống chèn script. Metadata/canonical cho công thức. |
| Telemetry | Collector → Jaeger lưu traces bằng volume; Prometheus lưu metrics 30 ngày; Grafana có datasource/dashboard sẵn. |
| Tests | 48 backend tests (xác thực, vòng đời công thức/danh mục, tìm kiếm, upload ảnh, CORS, 401/403, validation, 429 và luồng HTTP tích hợp); 6 frontend unit tests; 4 Playwright tests. Đã đưa vào CI. |
| MinIO local | Bật trong appsettings.Development.json; upload/tải ảnh gốc PNG và thumbnail WebP đã được xác nhận. |
| Docker | Thêm frontend .dockerignore, init volume Jaeger và các dịch vụ giám sát. |

## Chạy local

Trước khi chạy API, đặt JWT secret ngoài mã nguồn. Có thể dùng user secrets:

`dotnet user-secrets set "JwtSettings:Secret" "một-giá-trị-ngẫu-nhiên-riêng-từ-32-ký-tự-trở-lên" --project src/CulinaryBlog.API`

1. `docker compose up -d db redis minio jaeger otel-collector prometheus grafana`
2. `dotnet run --project src/CulinaryBlog.API --launch-profile http`
3. Trong frontend: `npm ci` rồi `npm run dev -- --port 3000`.

Frontend http://localhost:3000; quản trị http://localhost:3000/admin; Swagger http://localhost:5152/swagger.

Tài khoản mẫu từ seeder: `chefdemo` / `chefdemo` (Admin), chỉ dùng local.

## Docker và giám sát

Sao chép `.env.example` thành `.env`, thay `JWT_SECRET` bằng giá trị riêng, rồi dùng `docker compose up -d --build` để chạy toàn stack. Website qua Nginx: http://localhost; API Docker: http://localhost:8080.

- Grafana http://localhost:3001, mặc định local `admin` / `culinary-local-admin`; đặt `GRAFANA_ADMIN_PASSWORD` khi khởi tạo để thay.
- Dashboard http://localhost:3001/d/culinary-api/culinaryblog-api.
- Jaeger http://localhost:16686, chọn service `culinary-blog-api`.
- Prometheus http://localhost:9090; MinIO console http://localhost:9001.

Đã xác nhận Jaeger có service API và Prometheus có mẫu `http_server_request_duration_seconds_count`. Giám sát bind localhost. Đây là stack local có lưu trữ và dashboard, chưa phải triển khai production công khai với TLS/backup/secret riêng.

## Phần phụ thuộc tài khoản và môi trường

- Google login cần Client ID thật của chủ dự án, không tự giả lập.
- Thêm domain frontend vào `Cors:AllowedOrigins` khi triển khai ngoài localhost.
- Workflow CI/CD đã cập nhật; cần push lên GitHub mới xác nhận được lần chạy GitHub Actions.
- ImageSharp 3.1.11 có sẵn trong dự án vẫn báo NU1902/NU1903. Chưa nâng major vì cần xem xét tương thích và license riêng.
- Công thức hiện có đang là bản nháp nên sitemap công thức công khai trống; có thể xuất bản công thức đủ nguyên liệu/bước làm từ quản trị. Không tự đổi trạng thái dữ liệu hiện có.
- Giữ nguyên thay đổi người dùng đã có trong DataSeeder.cs.

## Xác minh giai đoạn 8

- Đã build bộ test backend ở cấu hình `Verification` và chạy thành công 48/48 test.
- Đã chạy thành công 6/6 frontend unit test; `npm run lint` kết thúc thành công với các cảnh báo mã nguồn có sẵn.
- Docker Compose đã được kiểm tra cú pháp với giá trị JWT giữ chỗ; workflow CI cũng đặt giá trị giữ chỗ chỉ cho bước kiểm tra cấu hình.
- Frontend đã compile và type-check thành công; bước tạo trang tĩnh bị chặn bởi lỗi quyền `EPERM` của Windows khi tạo thư mục output. Cần chạy lại sau khi giải phóng tiến trình/khóa tệp ở workspace.
- Chưa thể kiểm tra thủ công qua trình duyệt: cổng 3000 đang bị một tiến trình Next.js không phản hồi giữ; API cổng 5152 chưa chạy do môi trường chưa có PostgreSQL/Hangfire. Không dừng tiến trình hoặc khởi tạo dịch vụ của người dùng khi chưa cần thiết.

Tham khảo: [Minimal APIs](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis?view=aspnetcore-10.0), [ImageSharp NuGet](https://www.nuget.org/packages/SixLabors.ImageSharp/3.1.11). Next.js dùng tài liệu đi kèm phiên bản đã cài.
