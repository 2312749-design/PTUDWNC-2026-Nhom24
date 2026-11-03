# Kiểm toán cuối trước khi nộp

Ngày kiểm tra: 19/10/2026.

## Kết quả theo giai đoạn

| Giai đoạn | Trạng thái | Bằng chứng |
| --- | --- | --- |
| 1. API contract và Auth | Hoàn thành | Minimal API versioned routes, Problem Details, JWT/refresh rotation/logout và test HTTP auth. |
| 2. Recipe lifecycle | Hoàn thành | RecipeStatus, soft delete, ownership, publish validation, nutrition và step ordering được test. |
| 3. Category | Hoàn thành | Slug/unique, Admin-only và soft delete có bảo vệ recipe liên quan. |
| 4. Search | Hoàn thành | PostgreSQL FTS, unaccent/pg_trgm, filter/sort/paging và test contract. |
| 5. Media, jobs, health | Hoàn thành trong mã và test | Validate ảnh, WebP thumbnail/medium, MinIO abstraction, Hangfire, health, logging và telemetry. |
| 6. Frontend | Hoàn thành trong mã và test contract | Next App Router, auth session/refresh, recipe wizard, upload, phân quyền giao diện và error handling. |
| 7. Security | Hoàn thành | CORS allow-list, secret từ environment/user-secrets, HTTPS/HSTS, policy rate-limit và test 429/CORS/role. |
| 8. Testing | Hoàn thành tự động; chưa hoàn thành manual runtime | Backend 48/48 và frontend 6/6 đạt. Browser/live-stack chưa chạy được tại máy này. |
| 9. Báo cáo và demo | Báo cáo hoàn thành; bằng chứng ảnh/video còn thiếu | `SUBMISSION-REPORT.md` có mapping FR, endpoint, test và kịch bản demo. |

## Những phần đã đủ

- Toàn bộ yêu cầu chức năng FR-AUTH, FR-RCP, FR-CAT, FR-SRCH, FR-FILE và FR-OBS đã có mã nguồn và bằng chứng kiểm thử phù hợp.
- CI có build/test backend, frontend contract/browser tests và kiểm tra Docker Compose.
- Không còn secret JWT trong mã nguồn; Docker yêu cầu cấp `JWT_SECRET` từ môi trường.

## Những phần chưa thể tuyên bố đã hoàn tất

1. **Chạy stack thật và demo thủ công.** Docker Desktop hiện không chạy, do đó PostgreSQL, Redis, MinIO, Hangfire và API port 5152 không sẵn sàng.
2. **Kiểm tra UI trực tiếp.** Có tiến trình Next.js không phản hồi đang giữ port 3000. Build frontend compile/type-check thành công nhưng Windows trả `EPERM` trong bước static generation khi ghi artifact.
3. **Google login thật.** Luồng đã có mã, nhưng cần Google Client ID hợp lệ để xác minh với Google.
4. **Ảnh/video chứng minh demo.** Chưa thể chụp khi stack local chưa hoạt động.

## Kết luận nộp bài

Phần **mã nguồn và kiểm thử tự động đã hoàn thành theo 10 giai đoạn**. Bài chưa nên được khẳng định là “đã demo chạy thật hoàn toàn” cho đến khi Docker Desktop được bật, port 3000 được giải phóng hoặc khởi động lại, rồi chạy kịch bản trong `SUBMISSION-REPORT.md` và chụp bằng chứng. Đây là giới hạn môi trường chạy hiện tại, không phải hạng mục nghiệp vụ còn thiếu trong mã.
