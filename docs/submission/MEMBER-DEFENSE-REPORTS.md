# Phiếu chuẩn bị bảo vệ theo thành viên

Ngày cập nhật: 12/11/2026. Mỗi thành viên phải tự xác nhận đúng phần mình đã làm theo lịch sử Git trước khi dùng nội dung này để báo cáo.

## Nguyễn Đức Thành — kiến trúc, auth và bảo mật

1. Nhiệm vụ: solution/Clean Architecture, database, register/login/refresh, CORS, resource authorization, versioning/error handling.
2. File nên trình bày: `Program.cs`, `AuthHandlers.cs`, `RecipeAuthorization.cs`, `CsrfProtectionMiddleware.cs`, `ArchitectureDependencyTests.cs`.
3. Endpoint: `/api/v1/auth/*`, recipe ownership, health/Swagger composition.
4. Entity/DB: `ApplicationUser`, `RefreshToken`, `Recipe` concurrency token.
5. Luồng: login cấp access/refresh cookie + CSRF token; refresh rotation; recipe operation gọi authorization handler.
6. Test: auth contract, authorization handler, CSRF, architecture dependency.
7. Lỗi khó: vừa bảo vệ token khỏi JavaScript vừa chống CSRF; giải pháp HttpOnly cookie + SameSite/Secure + double-submit token + Origin.
8. Chưa xác minh thật: Google OAuth và SMTP cần credential.
9. Hai đoạn luyện giải thích: `RecipeAuthorizationHandler.HandleRequirementAsync`; `CsrfProtectionMiddleware.InvokeAsync`.

## Minh Long — recipe, category và persistence

1. Nhiệm vụ: CRUD/lifecycle recipe, category, ingredient/step, repository/UoW, migration.
2. File nên trình bày: `RecipesHandlers.cs`, `CreateRecipeCommandHandler.cs`, `ApplicationDbContext.cs`, `Recipe.cs`, `CategoriesHandlers.cs`.
3. Endpoint: recipe create/update/publish/archive/image; category CRUD.
4. Entity/DB: Recipe, RecipeIngredient, RecipeStep, RecipeImage, Category, nutrition.
5. Luồng: validate DTO → domain rule tối thiểu 1 nguyên liệu/1 bước; dữ liệu seed Lab 2 riêng có 10/5 → lưu parent/children một commit → invalidate cache.
6. Test: workflow, lifecycle, cache invalidation, category lifecycle, image handler.
7. Lỗi khó: Include hai collection gây Cartesian explosion; dùng `AsSplitQuery`, giải thích 150 so với khoảng 26 rows.
8. Chưa xác minh thật: migration sạch trên PostgreSQL production/MinIO upload cần full stack.
9. Hai đoạn luyện giải thích: `Recipe.EnsureMinimumContent/Publish`; `MapRecipeAsync` với split/loading children.

## Oven — search, media, jobs và operations

1. Nhiệm vụ: search/filter/pagination, upload/biến thể ảnh, background jobs, cache, health và observability.
2. File nên trình bày: `SearchEndpoints.cs`, storage/image services, jobs, health checks, Docker Compose.
3. Endpoint: `/api/v1/search/recipes`, upload/delete image, `/health/*`, Hangfire dashboard.
4. Entity/DB: Recipe search vector/index, RecipeImage metadata, job/storage state.
5. Luồng: validate query → PostgreSQL FTS simple/unaccent → filter/sort/page; upload kiểm magic bytes → lưu → job tạo thumbnail.
6. Test: search contract, upload boundary/content, cleanup, HTTP security.
7. Lỗi khó: search tiếng Việt không dùng english stemmer; chọn simple + unaccent/trigram.
8. Chưa xác minh thật: dashboard Hangfire, trace Jaeger và metrics Grafana cần ảnh/log runtime mới.
9. Hai đoạn luyện giải thích: FTS query; image validation/background job.

## Kina Niê — frontend và trải nghiệm người dùng

1. Nhiệm vụ: Next App Router, layout/component, auth UI, recipe/category UI, form và state management.
2. File nên trình bày: recipe server page/components, `wizard.jsx`, `recipe-schema.js`, `AppProviders.jsx`, `api-client.ts`, auth store.
3. Luồng UI: RSC tải recipe/SEO; Client Component xử lý action; wizard RHF/Zod; TanStack Query giữ server state; Zustand giữ auth/UI.
4. Dữ liệu: RecipeDto, category, user session metadata và URL search/filter/page.
5. Bảo mật: không lưu refresh token ở localStorage; client tự gửi CSRF header từ double-submit cookie.
6. Test: API client/session, recipe form/payload, upload validation, Zod minimum 1/1, seed Lab 2 10/5, JSON-LD.
7. Lỗi khó: tránh tải recipe hai lần và giảm bundle; chuyển nội dung chính sang RSC, chỉ giữ tương tác ở client.
8. Chưa xác minh thật: bản build Docker đã qua compile và type-check; dùng kết quả nghiệm thu mới nhất thay số liệu cũ.
9. Hai đoạn luyện giải thích: `RecipeServerDetails`/`RecipeActions`; `recipeWizardSchema` + `useFieldArray`.

## Mẫu nói trong 60–90 giây

“Em phụ trách … Use case chính là … Request đi từ …, được validate/authorize tại …, lưu qua … và trả DTO … Em có test … Lỗi khó nhất là …; nhóm chọn … vì …, đổi lại … Phần cần tài khoản/hạ tầng thật là … nên nhóm ghi đúng trạng thái, không xem cấu hình là bằng chứng chạy thật.”
