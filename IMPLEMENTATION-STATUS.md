# Trạng thái triển khai và kiểm thử — 25/10/2026

Tài liệu này chỉ ghi nhận kết quả đã được kiểm tra trên workspace hiện tại.
Những phần cần hạ tầng hoặc tài khoản của chủ dự án được tách riêng ở cuối để
tránh ghi nhận quá mức.

## Đã hoàn thành trong mã nguồn

| Hạng mục | Trạng thái | Bằng chứng/kết quả |
| --- | --- | --- |
| Kiến trúc backend | Đạt cho đồ án | Có Domain, Application, Infrastructure, API; Repository/Unit of Work. CRUD Category đã đi qua Unit of Work. Một số feature cũ vẫn dùng abstraction DbContext, nên chưa phải Clean Architecture thuần 100%. |
| API v1 | Đạt | API nghiệp vụ là Minimal API tại `/api/v1`; Swagger, validation, Problem Details, CORS, rate limit, JWT/role policy đã có. |
| Xác thực | Đạt cho local | Register/login/refresh rotation/replay/logout/revoke hoạt động. Refresh token được giữ trong cookie `HttpOnly`; không còn lưu token refresh mới trong `localStorage`. |
| Hangfire | Đạt trong code | Dashboard chỉ dành cho Admin. JWT từ cookie được đọc cho đường dẫn `/hangfire`, nên Admin đăng nhập có thể mở dashboard trực tiếp. |
| Recipe và category | Đạt | CRUD, ownership, Draft/Published/Archived, nguyên liệu/bước, ảnh, tìm kiếm, phân trang, liên kết danh mục và cache invalidation. |
| Ảnh và dọn storage | Đạt trong code | Upload kiểm tra nội dung ảnh, sinh thumbnail/medium WebP. Job dọn file rác quét recipe, community, avatar, category, article; xóa cả biến thể community khi thay/xóa bài. |
| Frontend Lab 6 | Đạt | App Router, API client, Zustand auth store, Radix/CVA/Lucide, AppShell/Header/Footer, Pagination, Loading/Error/Empty states, layout và toast dùng chung. |
| Observability | Đạt trong code | Health checks, Serilog, OpenTelemetry, collector, Jaeger, Prometheus, Grafana và cấu hình Compose. |
| Cấu hình production | Đạt ở mức cấu hình | `.env.example`, Nginx HTTPS template, CORS/public URL, cookie Secure, SMTP/Google/OTLP variables, migration/seed toggles đã có. |

## Kết quả kiểm thử mới nhất

| Phạm vi | Kết quả |
| --- | --- |
| Backend unit + integration | **57/57 đạt** ở cấu hình `Verification`. |
| Frontend unit/contract | **7/7 đạt**. |
| Frontend lint | Không có lỗi chặn; còn **6 warning** Fast Refresh/useEffect cần cải thiện dần. |
| Frontend production build | Compile và TypeScript đạt. Prerender hiện dừng ở `EPERM` vì tiến trình frontend đang chạy giữ thư mục `.next`, không phải lỗi TypeScript hay route. |
| Docker Compose syntax | Đạt khi cấp các giá trị secret demo qua biến môi trường. |
| Docker full stack runtime | **Chưa xác minh lại được**: Docker Desktop trên máy đang crash `SIGBUS / bus error` khi build MinIO. |

## Cần làm khi Docker Desktop ổn định

1. Khởi động lại Docker Desktop (không cần xóa dữ liệu Docker). Nếu lỗi lặp lại, dùng **Troubleshoot → Restart** và cập nhật Docker Desktop/WSL; thu thập diagnostics trước khi nghĩ đến factory reset.
2. Sao chép `.env.example` thành `.env`, thay toàn bộ secret `change-me-*`.
3. Chạy `docker compose up -d --build`, sau đó kiểm tra `/health/ready`, đăng nhập, upload ảnh và dashboard observability.
4. Với máy đang chạy frontend, dừng tiến trình dev trước khi chạy `npm run build` để tránh khóa `.next`.

## Giá trị chỉ chủ dự án có thể cung cấp

| Cần cung cấp | Vì sao không thể tự tạo trong source |
| --- | --- |
| Google OAuth Web Client ID và consent/origin | Thuộc Google Cloud project của chủ dự án. |
| SMTP host, app password/API credential, From address | Thuộc nhà cung cấp email và domain của chủ dự án. |
| Domain, DNS, chứng chỉ TLS/private key | Cần quyền quản trị domain và xác minh CA. |
| Secret production DB/JWT/MinIO/Grafana, token OTLP cloud | Không được ghi vào Git hoặc tự bịa giá trị production. |
| Docker Engine hoạt động | Cần Docker Desktop/WSL trên máy để chạy và xác nhận full stack. |

Hướng dẫn chi tiết cho Docker, Google OAuth, SMTP, OTLP, HTTPS và migration/seed:
[DEPLOYMENT.md](DEPLOYMENT.md).
