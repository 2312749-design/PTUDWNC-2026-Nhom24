# Kiểm toán cuối trước khi nộp — cập nhật 12/11/2026

Ngày kiểm tra gần nhất: 12/11/2026.

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
| 8. Testing | Đạt | Backend 78/78, frontend 19/19, Playwright 35/35, lint 0, audit 0; Docker production build tạo đủ 41 route. |
| 9. Báo cáo và demo | Tài liệu vấn đáp hoàn thành; bằng chứng runtime còn thiếu | Có báo cáo, phiếu từng thành viên, 20 câu lý thuyết và khuôn 9 tình huống. |

## Những phần đã đủ

- Toàn bộ yêu cầu chức năng FR-AUTH, FR-RCP, FR-CAT, FR-SRCH, FR-FILE và FR-OBS có mã nguồn và bằng chứng kiểm thử phù hợp; resource authorization, concurrency và CSRF có test riêng.
- CI có build/test backend, frontend contract/browser tests và kiểm tra Docker Compose.
- Không còn secret JWT trong mã nguồn; Docker yêu cầu cấp `JWT_SECRET` từ môi trường.

## Những phần chưa thể tuyên bố đã hoàn tất

1. **Google login và SMTP thật.** Luồng đã có mã nhưng cần Client ID và SMTP credential thật.
2. **Production domain/TLS/secrets.** Cần quyền quản trị hạ tầng của chủ dự án.
3. **Bằng chứng quy trình Git.** Commit/push/PR/review cần thực hiện theo tài khoản và quy định của nhóm.
4. **Ảnh/video nộp bài.** Runtime đã chạy; nhóm nên quay kịch bản và lưu dashboard/trace làm minh chứng chính thức.

## Kết luận nộp bài

Phần **mã nguồn, bảo mật, production build, full stack và kiểm thử tự động đã được xác minh**. Bài chưa nên được khẳng định là “100% production” cho đến khi Google/SMTP/domain/TLS và quy trình Git được xác minh bằng tài khoản thật. Về nội dung vấn đáp, dùng `docs/submission/ORAL-DEFENSE-GUIDE.md`, `MEMBER-DEFENSE-REPORTS.md` và `COMPLETION-AUDIT-2026-11-12.md`.
