# Đối chiếu phân công bốn nhóm và bài hiện tại

Ngày rà soát: 25/10/2026. Tài liệu đối chiếu mã nguồn hiện tại, kết quả test
57/57 backend và 7/7 frontend; không coi nội dung README là bằng chứng duy
nhất.

## 1. Ba nhóm còn lại có khác nhau không?

Cả ba đều làm cùng lõi **34 yêu cầu chức năng (FR)** của Culinary Blog:

- **FR-AUTH-001 đến 007:** đăng ký, đăng nhập, Google, refresh token, logout,
  xem và cập nhật profile.
- **FR-RCP-001 đến 010:** danh sách/chi tiết/tạo/sửa/publish/archive/xóa recipe,
  ảnh, nguyên liệu và bước nấu.
- **FR-CAT-001 đến 005:** danh sách, chi tiết, tạo, sửa, xóa mềm danh mục.
- **FR-SRCH-001 đến 004:** full-text search, filter, sort, offset pagination.
- **FR-FILE-001 đến 002:** upload và xóa file MinIO.
- **FR-JOB-001 đến 003:** welcome email, resize/thumbnail, sitemap.
- **FR-OBS-001 đến 003:** health check, structured logging, tracing/metrics.

Khác nhau là cách chia người và mức độ mô tả:

| Nhóm | Đặc điểm phân công |
| --- | --- |
| Nhóm 23 | Đầy đủ nhất về quy tắc nghiệp vụ: trạng thái recipe, soft delete, phân quyền, FTS tiếng Việt, pagination, cache và công nghệ. |
| Nhóm 17 | Cùng phạm vi FR, phân theo route/module; nêu rõ API v1, Next.js, SEO, MinIO và observability. |
| Nhóm 19 | Cùng phạm vi FR, mô tả ngắn và chia theo từng thành viên. |
| Nhóm bạn | Có toàn bộ lõi FR, đồng thời bổ sung Sprint 3–4: cache, tests, CI/CD, Docker, common frontend components và author/admin dashboard. |

Kết luận phạm vi: README phân công hiện tại của nhóm bạn **đủ và còn rộng hơn**
ba nhóm kia. Không cần thêm community, AI, meal plan, challenge… vào phần yêu
cầu bắt buộc; đó là điểm cộng của đồ án, không phải chức năng để thay thế FR lõi.

## 2. Đối chiếu 34 FR bắt buộc với bài hiện tại

| Nhóm yêu cầu | Mã FR | Trạng thái | Kết luận kiểm tra |
| --- | --- | --- | --- |
| Tài khoản | AUTH-001 Register | ✅ | API register, Identity/password hashing, role Author và test contract. |
|  | AUTH-002 Login | ✅ | Login JWT, session frontend và test. |
|  | AUTH-003 Google OAuth | 🟡 | Luồng xác minh Google ID token đã có; chưa đăng nhập Google thật vì thiếu Client ID/Google Cloud origin của chủ dự án. |
|  | AUTH-004 Refresh token | ✅ | Rotation, phát hiện replay, revoke và cookie HttpOnly; có test. |
|  | AUTH-005 Logout | ✅ | Logout thu hồi refresh token/session. |
|  | AUTH-006 View profile | ✅ | API xem hồ sơ, avatar và giao diện account. |
|  | AUTH-007 Update profile | ✅ | Cập nhật profile, avatar và đổi password. |
| Công thức | RCP-001 List recipe | ✅ | Danh sách public Published và danh sách riêng `mine`. |
|  | RCP-002 Detail recipe | ✅ | Xem theo ID/slug, hiển thị category, tác giả, ingredient, step và nutrition. |
|  | RCP-003 Create recipe | ✅ | Recipe mới là Draft; form và backend bắt tối thiểu 10 ingredient, 5 step. |
|  | RCP-004 Update recipe | 🟡 | Sửa recipe và phân quyền đã có; **chưa có optimistic concurrency RowVersion/ETag** như bảng phân công yêu cầu. |
|  | RCP-005 Publish/Unpublish | ✅ | Có transition đúng trạng thái và kiểm tra nội dung tối thiểu. |
|  | RCP-006 Archive | ✅ | Có archive/restore; archived không công khai. |
|  | RCP-007 Delete | ✅ | Soft delete, không làm mất dữ liệu con; có kiểm tra. |
|  | RCP-008 Image | 🟡 | Upload/chọn ảnh chính/xóa ảnh, MIME/magic bytes/5 MB/thumbnail có code và test. MinIO chạy thật còn chờ Docker Engine ổn định. |
|  | RCP-009 Ingredient CRUD | ✅ | GET/POST/PUT/DELETE, ownership và giữ tối thiểu 10 nguyên liệu. |
|  | RCP-010 Step CRUD | ✅ | GET/POST/PUT/DELETE, tự đánh lại thứ tự, giữ tối thiểu 5 bước. |
| Danh mục | CAT-001 List category | ✅ | `GET /api/v1/categories`, giao diện category. |
|  | CAT-002 Category detail + recipes | ✅ | Có `GET /api/v1/categories/{id}`; server lấy recipe trực tiếp theo `CategoryId`, chỉ trả Published cho người xem và toàn bộ trạng thái còn hiệu lực cho Admin. |
|  | CAT-003 Create Admin | ✅ | Có API và giới hạn Admin. |
|  | CAT-004 Update Admin | ✅ | Có API và giới hạn Admin. |
|  | CAT-005 Delete Admin | ✅ | Soft delete, chặn xóa nếu còn recipe hoạt động. |
| Tìm kiếm | SRCH-001 PostgreSQL FTS | ✅ | `WebSearchToTsQuery`, unaccent/SearchVector, GIN migration; fallback SQLite dành cho test. |
|  | SRCH-002 Filter | ✅ | Category, difficulty, thời gian, vegetarian, ingredient, servings. |
|  | SRCH-003 Sort | ✅ | title, createdAt, cookTimeMinutes; kiểm tra input. |
|  | SRCH-004 Offset pagination | ✅ | page/pageSize; response middleware chuẩn hóa `items` và `meta.totalPages`. |
| File | FILE-001 Upload MinIO | 🟡 | IFileStorageService, MinIO client và local fallback có đủ; full integration MinIO chưa chạy lại vì Docker Desktop crash. |
|  | FILE-002 Delete MinIO | 🟡 | Xóa ảnh riêng và job dọn orphan của recipe/community/avatar/category/article có code/test; cần Docker chạy để xác nhận MinIO thật. |
| Background job | JOB-001 Welcome email | 🟡 | Hangfire enqueue + SMTP sender đã có. Chưa gửi email thật vì thiếu SMTP credentials/From address. |
|  | JOB-002 Thumbnail/resize | ✅ | Thumbnail WebP 300×300, medium 800×600, background job và test. |
|  | JOB-003 Sitemap | ✅ | Sitemap chỉ recipe Published, dynamic sitemap frontend và recurring Hangfire job. |
| Observability | OBS-001 Health check | ✅ | `/health`, `/health/live`, `/health/ready`; PostgreSQL, Redis, MinIO. |
|  | OBS-002 Structured logging | ✅ | Serilog và Correlation ID middleware. |
|  | OBS-003 Tracing/metrics | 🟡 | OpenTelemetry, collector, Jaeger, Prometheus, Grafana đã cấu hình; chưa chạy runtime lại do Docker Engine dừng. |

## 3. Yêu cầu nền tảng, Lab và quy ước chung

| Yêu cầu | Trạng thái | Nhận xét |
| --- | --- | --- |
| 4 layer Clean Architecture | 🟡 | Có Domain/Application/Infrastructure/API, MediatR, Repository/UoW. Hai handler Recipe Application còn dùng `IApplicationDbContext`/EF Core trực tiếp, nên không nên ghi “thuần 100%”. |
| Entity, Fluent API, DbContext, migration | ✅ | Có các entity nghiệp vụ, DbContext và migrations. |
| Seed 20 category, 100 recipe, 10 ingredient, 5 step | ✅ | Seeder có đúng 20 category, 100 recipe; test kiểm tra từng recipe có ít nhất 10 ingredient và 5 step. |
| Domain exception, repository, UoW | ✅ | Có exception middleware, repository/UoW; Category đã dùng UoW. |
| Minimal API + global Problem Details | ✅ | API v1 là Minimal API, có exception middleware và validation/Problem Details. |
| CORS, rate limit, JWT/authorization | ✅ | Có allow-list CORS, policy login/register/upload, JWT roles/ownership, test CORS/rate limit. |
| API versioning + Swagger | ✅ | Asp.Versioning URL segment, `/api/v1`, Swagger Bearer. |
| Frontend API/error utilities | ✅ | API client tập trung, refresh/retry, Problem Details, toast và global error/loading route. |
| Store và common components Lab 6 | ✅ | Zustand auth store, AppShell/Header/Footer, Pagination, Loading, Error, Empty, Dialog/Button. |
| UI library | ✅ | Radix UI + CVA + Lucide, đáp ứng “thư viện UI khác”. |
| Search UI | ✅ | Có thanh tìm kiếm, filter, danh sách, loading/empty/error và pagination. |
| Frontend TypeScript đồng nhất | 🟡 | API/types/store là TypeScript; phần lớn page/component cũ vẫn `.js/.jsx`. Không sai yêu cầu tối thiểu Lab 5–6, nhưng chưa phải codebase TS thuần. |
| Recipe form Zod/react-hook-form | 🟡 | Validation/form nhiều bước hoạt động. Nhưng **không cài Zod và react-hook-form**. Chỉ cần bổ sung nếu giảng viên chấm theo bảng phân công cũ ghi đích danh hai thư viện này. |
| API client Axios/TanStack Query | 🟡 | Dùng fetch client tập trung thay vì Axios/TanStack Query. Chức năng đáp ứng; chỉ đổi nếu đây là yêu cầu bắt buộc của giảng viên. |
| `next/image` | ❌ | Nhiều màn hình vẫn dùng thẻ `<img>`. Cần chuyển ảnh recipe/category/article sang `next/image` và cấu hình `remotePatterns`. |
| Recipe detail SSR thật | 🟡 | Có route App Router `/recipes/[id]` và JSON-LD/metadata; dữ liệu chính vẫn được client component fetch, chưa phải render nội dung recipe hoàn toàn từ server. |
| JSON-LD/Open Graph | ✅ | Có Recipe, BlogPosting, WebSite JSON-LD và metadata. |
| Redis/cache invalidation | ✅ | Cache recipe/list/detail, invalidation khi recipe/category/ingredient/step/image thay đổi, có fallback. |
| Docker/CI | 🟡 | Dockerfile, Compose, Nginx và workflow có đủ. `docker compose config` đạt; full runtime hiện chưa xác nhận vì Docker Desktop lỗi SIGBUS. |
| Kiểm thử | 🟡 | 57/57 backend, 7/7 frontend đạt. Chưa có bằng chứng một test thành công và một test lỗi cho **mọi** endpoint ngoài phạm vi lõi. |
| Git workflow/PR/review | ❌ Chưa có bằng chứng | Quy ước yêu cầu branch, PR review, commit/PR link. Thư mục làm việc hiện còn thay đổi chưa commit; cần commit và push/PR để được ghi hoàn thành. |

## 4. Các việc cần sửa để báo cáo “đủ chuẩn”

### Phải sửa trong code

1. Thêm optimistic concurrency cho update recipe: `RowVersion` hoặc ETag/`If-Match`, trả `409 Conflict` khi hai người cùng sửa.
2. Chuyển ảnh frontend từ `<img>` sang `next/image`; cấu hình domain/remote pattern cho local upload và MinIO.
3. Nếu cần đúng theo bảng phân công ban đầu: thêm Zod, `react-hook-form` và `zodResolver` cho wizard; không bắt buộc nếu giáo viên chỉ yêu cầu validation hoạt động.
4. Tách phần fetch recipe public trong route `/recipes/[id]` thành server-side fetch để đạt SSR thật; giữ các nút tương tác ở client component.
5. Dọn 6 warning lint React và chuyển dần các component `.jsx` sang `.tsx` nếu muốn ghi frontend TypeScript chuẩn hơn.

### Không thể hoàn thành chỉ bằng code

1. Google login thật: cần Google Client ID, consent screen và authorized origins.
2. Welcome email thật: cần SMTP host, username, app password/API key và From address đã xác minh.
3. Full Docker runtime: cần Docker Desktop/WSL chạy lại ổn định. Lỗi hiện tại là Docker Engine SIGBUS, không phải hết dung lượng.
4. HTTPS production: cần domain, DNS, certificate/private key.
5. GitHub Actions/PR review: cần commit, push và mở PR trên repository; không thể giả lập bằng source local.

## 5. Cách ghi tiến độ cho đúng

- Ghi **✅**: các mục đã có code và test, như Register/Login/Refresh/Logout, Recipe core, Ingredient/Step, Search, Category CRUD, validation, caching, health/logging, common frontend components.
- Ghi **🟡**: Google OAuth, SMTP email, MinIO runtime, OpenTelemetry runtime, Docker runtime, SSR/next-image, Clean Architecture thuần, TypeScript thuần, test mọi endpoint.
- Ghi **❌/cần bổ sung**: category detail API, concurrency update recipe, `next/image`; Git PR/review nếu chưa push.

Không nên ghi Docker, Google OAuth, SMTP và observability runtime là hoàn thành 100% trước khi có bằng chứng chạy thật.

