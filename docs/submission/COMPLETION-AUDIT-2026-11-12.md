# Kết quả hoàn thiện theo danh sách yêu cầu

Ngày kiểm tra: 12/11/2026. Nguồn đối chiếu: `Cau_Hoi_On_Tap.pdf` (3 trang) và danh sách sửa do người dùng cung cấp.

## 1. Code và kiến trúc

| Mục | Kết quả cụ thể | Trạng thái |
|---|---|---|
| 1.1 Resource authorization | Có `RecipeOperationRequirement`, 6 operation, `RecipeAuthorizationHandler`, DI và gọi `IAuthorizationService`. Test owner/other/Admin; runtime non-owner PATCH trả 403. | Hoàn thành |
| 1.2 `next/image` | Ảnh recipe card/detail, category, home và article cover dùng `Image`, có width/height/sizes/preload. `remotePatterns` hỗ trợ API/MinIO/Unsplash và origin cấu hình. Local MinIO bỏ optimizer để container không hiểu nhầm `localhost`; production vẫn tối ưu. `<img>` còn lại là preview blob, QR, media cộng đồng động và avatar URL tùy ý. | Hoàn thành cho ảnh quan trọng |
| 1.3 Server Component | `/recipes/[id]` fetch và render title, ảnh, tác giả, status, nguyên liệu, bước, thời gian, dinh dưỡng ở server. `RecipeActions` client chỉ giữ share/edit/delete/review/bookmark. Không fetch recipe lần hai ở client. | Hoàn thành |
| 1.4 RHF + Zod | Wizard dùng `useForm`, `zodResolver`, `useFieldArray`; title 5–160, category, số hợp lệ, 10 ingredients, 5 steps và dòng không rỗng. Backend có rule tương ứng. Có 2 test schema và test browser retry upload. | Hoàn thành |
| 1.5 TanStack Query | Có `QueryClientProvider`, stale/retry policy; wizard category/create mutation + invalidation; review, bookmark/collection và notification query/mutation + invalidation. Zustand vẫn giữ auth/UI, URL giữ filter, RHF giữ form. | Hoàn thành ở các luồng đại diện |
| 1.6 Cartesian explosion | Recipe có navigation ingredients/steps; truy vấn chi tiết dùng hai `Include` + `AsSplitQuery`. Kết quả vẫn qua 78 backend tests. | Hoàn thành |
| 1.7 Dependency Rule | Application không còn package EF Core hoặc `IApplicationDbContext`; dùng `IRepository<T>`/`IUnitOfWork`, Infrastructure triển khai. Architecture test kiểm tra reference giữa các assembly. | Hoàn thành ở mức Clean Architecture thực dụng |
| 1.8 Mapster | Đã cài Mapster và có `RecipeMapping` Entity → DTO, bỏ qua navigation được map có chủ đích. | Hoàn thành |
| 1.9 Optimistic concurrency | `UpdatedAt` là concurrency token; GET trả ETag; PUT/PATCH nhận If-Match; stale ETag runtime trả 412; middleware map DB concurrency thành 409. | Hoàn thành |
| 1.10 CSRF | Cookie HttpOnly/SameSite/Secure theo môi trường; CSRF cookie + header double-submit, fixed-time compare, Origin allow-list. Test middleware và runtime origin lạ trả 403. | Hoàn thành |
| 1.11 Dọn code | Bỏ DI trùng, bỏ `#if false`, route test chỉ Development, Swagger chỉ Development/config, lint `--deny-warnings` đạt 0, demo seed tắt được ở production. | Hoàn thành phần bắt buộc |

## 2. Nội dung lý thuyết phải trả lời

- Auth.js: dự án không dùng Auth.js; cẩm nang giải thích HttpOnly cookie, localStorage, XSS và việc đưa access token vào session.
- Monolith: chốt tên **layered/modular monolith**, một API deploy, chung DB; nêu đúng ưu/nhược và lý do phù hợp đồ án.
- Repository/UoW: chỉ được `IRepository<T>`/`IUnitOfWork`, tạo Recipe + Ingredient + Step và commit một lần.
- JWT: access JWT stateless; refresh rotation/revoke trong DB stateful; toàn bộ là mô hình hybrid.

Chi tiết 20/20 câu nằm trong `ORAL-DEFENSE-GUIDE.md`.

## 3. Báo cáo Phần II

- Chốt thống nhất: **7 nhóm lõi, 34 yêu cầu bắt buộc, ánh xạ thành 16 khu vực API production**.
- Có bảng sáu mâu thuẫn SRS, quyết định, lý do và trạng thái.
- Đã cập nhật `SUBMISSION-REPORT.md`, `IMPLEMENTATION-STATUS.md`, `FINAL-DELIVERY-AUDIT.md`, `docs/project/TASKS.md`.
- Có `MEMBER-DEFENSE-REPORTS.md` cho bốn thành viên: nhiệm vụ, file, endpoint, entity, flow, test, lỗi khó, phần chưa xác minh và hai đoạn code.
- Phần chưa thể ghi hoàn tất: Google OAuth thật, SMTP nhận thư thật, production domain/TLS và PR/review bằng tài khoản nhóm.

## 4. Phần III – 9 tình huống

`ORAL-DEFENSE-GUIDE.md` có khuôn 10 bước và phương án riêng cho email subscription, quảng cáo, RSS, social share, rating, comment, contact, FAQ và bảo mật form. Mỗi phương án có entity, API, authorization, validation/security, job/cache, UI, test, monitoring và trade-off.

## 5. Bằng chứng kiểm tra mới nhất

| Kiểm tra | Kết quả |
|---|---|
| Backend Release | 78/78 pass |
| Frontend unit/contract | 19/19 pass |
| Browser Playwright | 35/35 pass qua Nginx/Docker |
| Lint | 0 warning (`--deny-warnings`) |
| TypeScript | `tsc --noEmit` pass |
| npm audit | 0 vulnerability; Next.js 16.4.6 |
| Production build | Docker/Linux build pass, 41/41 route prerender/dynamic build |
| Compose | PostgreSQL, Redis, MinIO, API, frontend, Nginx, collector, Jaeger, Prometheus, Grafana chạy |
| Health | `/health/live` 200 Healthy; `/health/ready` 200, DB/Redis/MinIO Healthy |
| Auth | Register 200, role Author; access cookie HttpOnly; CSRF cookie có |
| Recipe | Create 201 với 10 ingredients/5 steps; upload MinIO 201; publish 200 |
| Authorization | Non-owner PATCH 403; Admin login 200 và tạo category 201 |
| Concurrency | PATCH đầu 200; dùng lại ETag cũ trả 412 |
| Review/search | Review 200, aggregate 5/5; search 200 với metadata phân trang |
| CSRF runtime | Request cookie từ origin lạ, thiếu token hợp lệ trả 403 |
| Observability/jobs | Jaeger thấy service `culinary-blog-api`; Prometheus Ready; Grafana DB `ok`; Hangfire có recurring/job records |

## Đánh giá sẵn sàng vấn đáp

- **Code và demo nội bộ:** khoảng 96–98%.
- **Nội dung PDF:** đủ tài liệu trả lời 20/20 câu Phần I, toàn bộ câu hỏi Phần II và 9/9 tình huống Phần III.
- **Không thể gọi là 100% tuyệt đối** cho đến khi từng thành viên thật sự học và nói lại được phần của mình, Google OAuth/SMTP được thử bằng credential thật, và nhóm có bằng chứng Git PR/review nếu môn học yêu cầu.

Kết luận: bài đã chuyển từ mức 75–80% lên mức **95–97% sẵn sàng bảo vệ**. Phần thiếu còn lại chủ yếu là bằng chứng dịch vụ/tài khoản ngoài và luyện nói cá nhân, không còn là lỗ hổng lớn trong ba phần câu hỏi PDF.
