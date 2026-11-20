# Trạng thái triển khai và kiểm thử — cập nhật 12/11/2026

Tài liệu này chỉ ghi nhận kết quả đã được kiểm tra trên workspace hiện tại.
Những phần cần hạ tầng hoặc tài khoản của chủ dự án được tách riêng ở cuối để
tránh ghi nhận quá mức.

## Đã hoàn thành trong mã nguồn

| Hạng mục | Trạng thái | Bằng chứng/kết quả |
| --- | --- | --- |
| Kiến trúc backend | Đạt | Có Domain, Application, Infrastructure, API; Application đã bỏ package EF Core và abstraction DbContext; Mapster mapping và architecture test bảo vệ Dependency Rule. |
| API v1 | Đạt | API nghiệp vụ là Minimal API tại `/api/v1`; Swagger, validation, Problem Details, CORS, rate limit, JWT/role policy đã có. |
| Xác thực | Đạt cho local | Register/login/refresh rotation/replay/logout/revoke hoạt động. Refresh token được giữ trong cookie `HttpOnly`; không còn lưu token refresh mới trong `localStorage`. |
| Hangfire | Đạt trong code | Dashboard chỉ dành cho Admin. JWT từ cookie được đọc cho đường dẫn `/hangfire`, nên Admin đăng nhập có thể mở dashboard trực tiếp. |
| Recipe và category | Đạt | CRUD, ownership, Draft/Published/Archived, nguyên liệu/bước, ảnh, tìm kiếm, phân trang, liên kết danh mục và cache invalidation. |
| Ảnh và dọn storage | Đạt trong code | Upload kiểm tra nội dung ảnh, sinh thumbnail/medium WebP. Job dọn file rác quét recipe, community, avatar, category, article; xóa cả biến thể community khi thay/xóa bài. |
| Frontend Lab 6 | Đạt | App Router, API client, Zustand auth store, Radix/CVA/Lucide, AppShell/Header/Footer, Pagination, Loading/Error/Empty states, layout và toast dùng chung. |
| Observability | Đạt trong code | Health checks, Serilog, OpenTelemetry, collector, Jaeger, Prometheus, Grafana và cấu hình Compose. |
| Cấu hình production | Đạt ở mức cấu hình | `.env.example`, Nginx HTTPS template, CORS/public URL, cookie Secure, SMTP/Google/OTLP variables, migration/seed toggles đã có. |
| Hardening | Đạt trong code/test | Resource authorization riêng, CSRF double-submit/Origin, ETag/If-Match, Swagger và test endpoint giới hạn theo môi trường. |
| Frontend state/render | Đạt | RSC render recipe, client island cho tương tác, TanStack Query, RHF/Zod/useFieldArray và `next/image` cho ảnh chính. |

## Kết quả kiểm thử mới nhất

| Phạm vi | Kết quả |
| --- | --- |
| Backend unit + integration | **78/78 đạt** ở cấu hình Release. |
| Frontend unit/contract | **19/19 đạt**. |
| Frontend lint | **0 warning** và từ chối warning mới bằng `--deny-warnings`. |
| Frontend dependency audit | **0 vulnerability** sau bản vá Next.js 16.4.6. |
| Frontend production build | **Đạt trong Docker/Linux**: compile, type-check và 41 route generation hoàn tất. Lỗi `EPERM` chỉ còn là đặc thù Windows host. |
| Browser E2E | **35/35 đạt** qua Nginx/Docker production image. |
| Docker Compose syntax | Đạt khi cấp các giá trị secret demo qua biến môi trường. |
| Docker full stack runtime | **Đạt trên database verification**: DB/Redis/MinIO/API/frontend/Nginx/observability chạy; live/ready 200 Healthy. |

## Việc còn lại trước production

1. Sao chép `.env.example` thành `.env`, thay toàn bộ secret verification/demo bằng secret production.
2. Cấu hình Google OAuth, SMTP, domain/TLS và chạy lại kịch bản bằng tài khoản thật.
3. Lưu ảnh/video dashboard, trace, metrics và hoàn tất PR/review theo quy trình môn học.

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
