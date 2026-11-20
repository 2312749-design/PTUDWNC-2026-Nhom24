# Báo cáo đối chiếu SRS — 13/11/2026

## Kết luận

Phần lõi của bài đã được thu gọn và bám sát SRS hơn: route chính, quy tắc dữ liệu, rendering, FluentValidation, các luồng CQRS quan trọng, sitemap và bộ công cụ NFR đều đã có. Application line coverage đã vượt ngưỡng 80%. Không tuyên bố hoàn thành 100% các tiêu chí phụ thuộc môi trường thật: Google OAuth/SMTP production, tải 100 người dùng, cache hit 80%, chứng chỉ/domain thật và backup đã chạy hằng ngày.

## Đối chiếu từng mục đã yêu cầu

| Mục | Kết quả sau sửa | Bằng chứng chính |
|---|---|---|
| 3.1 FluentValidation | Đã cài ở Application, đăng ký validator bằng assembly scan, thêm `ValidationBehavior`, lỗi validation trả 422; endpoint category/search/recipe write không tự kiểm tra lại quy tắc đã chuyển | `Application/Behaviors/ValidationBehavior.cs`, `Application/Validation/*`, `Program.cs` |
| 3.2 CQRS/MediatR | Đã chuyển Update Recipe, Publish/Unpublish/Archive, Search, Ingredient CRUD, Step CRUD, Recipe Image upload/metadata/delete và Register/Login/Refresh. Cookie, 2FA và atomic token rotation được che sau `IAuthenticationWorkflow`, còn Command/ValidationBehavior là điểm vào của use case | `Application/CQRS/Recipes/*`, `Application/CQRS/Auth/*`, `RecipeImageCommandHandlers.cs` |
| 3.3 Quy tắc tối thiểu | Đã đổi từ 10/5 thành 1 nguyên liệu/1 bước ở Domain, form, wizard, seed verification và tests | `Recipe.cs`, `recipe-schema.js` |
| 3.4 Route UI | Đã có đủ `/`, `/recipes`, `/recipes/[id]`, `/categories`, `/categories/[slug]`, `/auth/login`, `/auth/register`, `/dashboard`, `/dashboard/recipes`, `/dashboard/recipes/new`, `/dashboard/recipes/[id]/edit`, `/dashboard/categories`, `/profile`, `/search` | `frontend/app/*` |
| 3.5 Rendering | Home ISR 3600; Categories ISR 3600; Recipe detail ISR 300; Recipes/Search dynamic SSR; Dashboard/form là Client Components | Kết quả `next build` và các `page.jsx` |
| 3.6 Data model | Giữ `UpdatedAt` + `If-Match` làm optimistic concurrency token và đã lập ADR thay cho `RowVersion`; xung đột trả 422 | `docs/adr/0003-srs-conformance-decisions.md` |
| 3.7 OAuth/SMTP | Code Google token verification và SMTP giữ nguyên; thêm MailHog profile để thử email cục bộ. Chưa thể xác nhận production khi chưa có Google Client ID/SMTP credential thật | `docker-compose.yml`, `.env.example` |
| 3.8 Sitemap | Có recipe, category, trang tĩnh, `lastmod`, `changefreq`, `priority`; Hangfire chạy 02:00 UTC; có ping URL tùy chọn | `SitemapGenerationJob.cs`, `Program.cs` |
| 3.9 NFR | Đã thêm coverage collector, k6, axe, Lighthouse CI, HTTPS override, backup script, production compose, `.editorconfig`, PR review checklist/CODEOWNERS và CHANGELOG | Các file ở `tests/performance`, `frontend/lighthouserc.json`, `nginx`, `scripts` |
| Tính năng vượt đề | Mặc định menu chỉ giữ luồng SRS. Phần mở rộng chỉ hiện khi `NEXT_PUBLIC_ENABLE_EXTENSIONS=true`; đăng nhập/đăng ký về dashboard | `AppHeader.jsx`, Login/Register client |

## Kết quả kiểm tra thực tế

- Backend: 93/93 tests đạt.
- Frontend unit tests: 19/19 đạt.
- Lint: đạt, không warning.
- TypeScript: đạt.
- Production build: đạt, tạo 47 route.
- axe WCAG A/AA: 4/4 trang lõi không có lỗi mức serious/critical.
- Lighthouse desktop:
  - `/`: Performance 0,76; Accessibility 1,00; Best Practices 0,96; SEO 1,00.
  - `/recipes`, `/categories`, `/auth/login`: Performance 1,00; Accessibility 1,00; Best Practices 0,96; SEO 1,00.
- Coverage lọc đúng assembly `CulinaryBlog.Application`: line **91,47%** (719/786 dòng), branch **75,00%**. Yêu cầu SRS tối thiểu 80% line coverage đã đạt. Báo cáo không loại các async state machine do compiler sinh.
- Docker Compose development và production override: cấu hình hợp lệ khi truyền đủ các secret bắt buộc.

## Việc cần môi trường hoặc tài khoản thật

1. Điền Google Client ID và tạo OAuth consent/redirect origin đúng domain.
2. Thử MailHog cục bộ hoặc điền SMTP production rồi chụp thư đã nhận.
3. Chạy `k6 run tests/performance/srs-smoke.js` trên stack đã bật để lấy p50/p95/p99 và kết quả 100 VU. Máy kiểm tra hiện không cài k6 nên chưa tạo số giả.
4. Duy trì Application line coverage tối thiểu 80% bằng `scripts/submission/verify-application-coverage.ps1`; không hạ threshold hoặc loại các handler nghiệp vụ khỏi phép đo.
5. Đo Redis hit rate trên Prometheus/Grafana dưới tải thật.
6. Cấp domain/chứng chỉ thật, đặt `AUTH_COOKIES_SECURE=true`, và chạy production override.
7. Lập lịch `scripts/backup-postgres.ps1` hằng ngày trên máy chủ và thực hiện ít nhất một lần restore thử.
8. Tạo PR thật và có ít nhất một thành viên khác review; CODEOWNERS/checklist không thể thay cho review thực tế.

## Lệnh nghiệm thu

```powershell
pwsh -File scripts/submission/verify-application-coverage.ps1
Set-Location frontend
npm test
npm run lint
npx tsc --noEmit
npm run build
npm run test:a11y
npm run lighthouse
```

