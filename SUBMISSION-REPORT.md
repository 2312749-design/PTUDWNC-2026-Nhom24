# Báo cáo đối chiếu chức năng — 25/10/2026

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
| Backend | **57/57 đạt**: auth/cookie, revoke/replay, recipe lifecycle/ownership, category, search, upload, storage cleanup, CORS, rate limit, validation và HTTP integration. |
| Frontend | **7/7 đạt**: API response, Problem Details, logout, URL upload, recipe payload và JSON-LD. |
| Lint | Không có lỗi chặn; còn 6 warning React cần dọn tiếp. |
| Build frontend | Compile/type-check đạt. Prerender bị khóa thư mục `.next` bởi tiến trình dev đang chạy (`EPERM`). |
| Docker config | Cú pháp Compose hợp lệ với secret demo. Full runtime đang chờ Docker Desktop chạy ổn định. |

## 4. Kịch bản demo khi Docker hoạt động lại

1. Mở `/health/ready` và Swagger.
2. Đăng ký/đăng nhập, tạo recipe có đủ nguyên liệu và bước, upload ảnh rồi publish.
3. Tìm kiếm, lọc, phân trang và thử input sai để xem Problem Details.
4. Dùng Admin tạo/chỉnh danh mục, rồi kiểm tra recipe xuất hiện đúng danh mục.
5. Mở `/hangfire` bằng Admin đã đăng nhập, và kiểm tra Jaeger/Grafana.

## 5. Điều kiện ngoài mã nguồn

Docker Desktop hiện lỗi `SIGBUS / bus error`, nên không thể trung thực ghi "đã chạy full Docker stack" ở thời điểm này. Google OAuth thật, SMTP gửi ra hộp thư, HTTPS/domain, production secrets và lần chạy GitHub Actions đều cần thông tin/quyền sở hữu của chủ dự án. Hướng dẫn và checklist nằm trong [DEPLOYMENT.md](DEPLOYMENT.md).
