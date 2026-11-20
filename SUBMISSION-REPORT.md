# Báo cáo đối chiếu chức năng — cập nhật 12/11/2026

## 1. Phạm vi đã hoàn thành

| Mã | Trạng thái | Nội dung |
| --- | --- | --- |
| FR-AUTH | Đạt cho local | Đăng ký, đăng nhập, profile, đổi mật khẩu, refresh-token rotation/replay detection, logout/revoke. Refresh token dùng cookie `HttpOnly`; Google login chờ Client ID thật. |
| FR-RCP | Đạt | CRUD công thức, ownership, Draft/Published/Archived, soft delete/restore, nutrition, nguyên liệu/bước theo thứ tự, upload và chọn ảnh chính. |
| FR-CAT | Đạt | Danh mục có slug, chống trùng, quyền Admin, soft delete và không xóa khi còn recipe hoạt động. CRUD category dùng Repository/Unit of Work. |
| FR-SRCH | Đạt | PostgreSQL Full-Text Search có/không dấu, filter, sort, pagination và Problem Details cho input không hợp lệ. |
| FR-FILE | Đạt trong code | Kiểm tra JPEG/PNG/WebP/AVIF tối đa 5 MB, thumbnail 300×300, medium 800×600 và storage cleanup cho năm namespace dữ liệu. |
| FR-OPS | Đạt trong code | Health, Serilog, OpenTelemetry, Hangfire, SMTP sender, MinIO abstraction, Docker Compose, Nginx và observability stack. |
| FE-LAB6 | Đạt | Next.js App Router, API client, error handling, Zustand auth store, UI library Radix/CVA/Lucide, layout và common components. |
| FE-STATE | Đạt | Recipe detail render bằng Server Component; TanStack Query quản lý server state; React Hook Form + Zod quản lý wizard; ảnh chính dùng `next/image`. |
| SEC-HARDEN | Đạt trong code/test | Resource-based authorization, ETag/If-Match optimistic concurrency, CSRF double-submit + Origin check, Swagger/test route giới hạn theo môi trường. |
| ARCH | Đạt | Application không còn phụ thuộc EF Core; Mapster mapping Entity → DTO; architecture test bảo vệ Dependency Rule. |

## 2. API trình bày

| Nghiệp vụ | Endpoint chuẩn |
| --- | --- |
| Auth | `POST /api/v1/auth/register`, `/login`, `/refresh`, `/logout`; `GET/PATCH /api/v1/auth/me` |
| Recipes | `GET/POST /api/v1/recipes`; `PUT/PATCH/DELETE /api/v1/recipes/{id}` |
| Recipe lifecycle | `POST /api/v1/recipes/{id}/publish`, `/unpublish`, `/archive`, `/restore` |
| Recipe image | `POST /api/v1/recipes/{id}/images`; `PUT .../images/{imageId}/primary`; `DELETE .../images/{imageId}` |
| Category | `GET/POST /api/v1/categories`; `PUT/DELETE /api/v1/categories/{id}` |
| Search | `GET /api/v1/search/recipes` |
| Health | `GET /health`, `/health/live`, `/health/ready` |

## 3. Kết quả kiểm thử

| Phạm vi | Kết quả |
| --- | --- |
| Backend | **78/78 đạt**: gồm architecture, resource authorization, ETag concurrency và CSRF. |
| Frontend | **19/19 đạt**: thêm kiểm thử Zod cho title, 10 ingredients và 5 steps. |
| Lint | **0 warning**, lệnh dùng `--deny-warnings`. |
| Dependency audit | `npm audit`: **0 lỗ hổng** sau khi nâng Next.js 16.4.6. |
| Build frontend | **Đạt trong Docker/Linux**: compile, TypeScript và 41/41 route generation hoàn tất. Windows host vẫn có `EPERM` riêng ở `.next`, không còn chặn artifact production. |
| Browser E2E | **35/35 đạt** qua Nginx và image production. |
| Docker runtime | PostgreSQL, Redis, MinIO, API, frontend, Nginx, collector, Jaeger, Prometheus, Grafana đều chạy; live/ready trả 200 Healthy. |

## 4. Kịch bản demo khi Docker hoạt động lại

1. Mở `/health/ready` và Swagger.
2. Đăng ký/đăng nhập, tạo recipe có đủ nguyên liệu và bước, upload ảnh rồi publish.
3. Tìm kiếm, lọc, phân trang và thử input sai để xem Problem Details.
4. Dùng Admin tạo/chỉnh danh mục, rồi kiểm tra recipe xuất hiện đúng danh mục.
5. Mở `/hangfire` bằng Admin đã đăng nhập, và kiểm tra Jaeger/Grafana.

## 5. Điều kiện ngoài mã nguồn

Full Docker stack đã được xác minh bằng database verification riêng: tạo/upload/publish/search/review, owner/Admin, ETag 412, CSRF 403 và observability đều có kết quả runtime. Google OAuth thật, SMTP gửi ra hộp thư, HTTPS/domain, production secrets và PR/review vẫn cần tài khoản/quyền của chủ dự án. Hướng dẫn nằm trong [DEPLOYMENT.md](DEPLOYMENT.md); bộ ôn vấn đáp nằm trong [ORAL-DEFENSE-GUIDE.md](docs/submission/ORAL-DEFENSE-GUIDE.md).
