# 📋 CHI TIẾT NHIỆM VỤ DỰ ÁN CULINARY BLOG (SPRINT 1 & 2)

> Quy ước tiến độ: ✅ Hoàn thành · 🟡 Đang thực hiện · ⬜ Chưa bắt đầu.  
> Mỗi task chỉ được đánh dấu hoàn thành khi có code, test và commit/PR minh chứng.

## 👤 1. Nguyễn Đức Thành — Lead Backend & Authentication

**Trọng tâm:** Xây dựng nền tảng Clean Architecture, Identity, JWT và phân quyền.

| Mã Task | Nhiệm vụ chi tiết | Tiến độ |
|---|---|---|
| **TH-01** | **Khởi tạo Solution & Clean Architecture**<br>- Tạo 4 projects: `CulinaryBlog.Domain`, `CulinaryBlog.Application`, `CulinaryBlog.Infrastructure`, `CulinaryBlog.API`.<br>- Thiết lập project references theo luồng đã thống nhất.<br>- Cài đặt và cấu hình các thư viện dùng chung: MediatR, Mapster, Entity Framework Core. | ✅ 100% |
| **TH-02** | **Database & Core Entities**<br>- Tạo `ApplicationUser` kế thừa `IdentityUser`, `Recipe`, `Category`.<br>- Cấu hình `ApplicationDbContext`, kết nối PostgreSQL và Fluent API cơ bản.<br>- Tạo migration khởi tạo và cập nhật database. | ✅ 100% |
| **TH-03** | **API Xác thực: Register & Login**<br>- Xây dựng Register Command/Handler, gán role mặc định `Author`.<br>- Dùng ASP.NET Identity `UserManager`/`PasswordHasher` để xử lý mật khẩu an toàn.<br>- Xây dựng Login Command/Handler, cấp JWT Access Token và Refresh Token.<br>- Tạo endpoint `POST /api/v1/auth/register` và `POST /api/v1/auth/login`. | ✅ 100% |
| **TH-04** | **Refresh Token & CORS**<br>- Tạo entity `RefreshToken` có trạng thái thu hồi và thời gian hết hạn.<br>- Xây dựng Refresh Token Rotation: cấp token mới, thu hồi token cũ.<br>- Cấu hình CORS cho frontend chạy tại `http://localhost:3000`. | ⬜ 0% |
| **TH-05** | **Google OAuth 2.0**<br>- Frontend nhận Google ID Token, backend xác minh token trước khi tạo phiên đăng nhập hệ thống.<br>- Tự tạo hoặc liên kết `ApplicationUser` khi email hợp lệ.<br>- Không tin dữ liệu hồ sơ do client tự gửi. | ⬜ 0% |
| **TH-06** | **Resource-Based Authorization**<br>- Xây dựng `RecipeAuthorizationHandler` kế thừa `AuthorizationHandler`.<br>- Author chỉ được Update/Delete Recipe của chính mình.<br>- Admin được quản lý Recipe theo quyền hệ thống. | ⬜ 0% |

---

## 👤 2. Minh Long — Database Queries & Search Engine

**Trọng tâm:** Quản lý Ingredient, Step, Full-Text Search và giao diện tìm kiếm.

| Mã Task | Nhiệm vụ chi tiết | Tiến độ |
|---|---|---|
| **ML-01** | **Model & Fluent API dữ liệu phụ**<br>- Định nghĩa `RecipeIngredient`: tên, số lượng, đơn vị, ghi chú.<br>- Định nghĩa `RecipeStep`: thứ tự, tiêu đề, mô tả, thời gian.<br>- Cấu hình quan hệ Recipe–Ingredient và Recipe–Step bằng Fluent API. | ✅ 100% |
| **ML-02** | **API CRUD Ingredient & Step**<br>- Viết Command/Handler thêm, sửa, xóa Ingredient và Step.<br>- Mở endpoint cho `/recipes/{id}/ingredients` và `/recipes/{id}/steps`.<br>- Backend tự đánh lại thứ tự Step khi xóa hoặc thay đổi bước. | ✅ 100% |
| **ML-03** | **Database cho Full-Text Search**<br>- Bật extension `unaccent` hỗ trợ tìm kiếm tiếng Việt không dấu.<br>- Tạo `SearchVector`/`tsvector` cho Recipe.<br>- Tạo GIN Index để tối ưu truy vấn tìm kiếm. | ✅ 100% |
| **ML-04** | **API Search, Filter, Sort & Pagination**<br>- Xây dựng `SearchRecipesQueryHandler` dùng PostgreSQL Full-Text Search.<br>- Hỗ trợ filter Category, Difficulty, Cook Time và Servings.<br>- Hỗ trợ sort, offset pagination và trả về `PagedResult` gồm `items`, `totalCount`, `page`, `totalPages`. | ⬜ 0% |
| **ML-05** | **Giao diện tìm kiếm**<br>- Xây dựng thanh tìm kiếm, bộ lọc và danh sách Recipe Card.<br>- Hiển thị trạng thái loading, empty, error và pagination.<br>- Gọi backend thông qua API client dùng chung của dự án. | ⬜ 0% |

---

## 👤 3. Oven — Form Wizard & Background Jobs

**Trọng tâm:** Form Recipe phía frontend, validation, xử lý lỗi và Hangfire.

| Mã Task | Nhiệm vụ chi tiết | Tiến độ |
|---|---|---|
| **OV-01** | **Validation Recipe Form**<br>- Xây dựng schema validation cho dữ liệu Recipe.<br>- Kiểm tra tiêu đề tối thiểu 5 ký tự.<br>- Kiểm tra Recipe có ít nhất một Ingredient và một Step.<br>- Validation frontend chỉ hỗ trợ UX; backend vẫn phải validate độc lập. | ✅ 100% |
| **OV-02** | **Form Tạo Recipe Đa Bước**<br>- Xây dựng trang tạo Recipe tại route của dự án, ví dụ `/recipes/new`.<br>- Hỗ trợ thêm/xóa Ingredient và Step động.<br>- Hiển thị lỗi từng trường, dữ liệu preview và trạng thái đang gửi. | ✅ 100% |
| **OV-03** | **Xử lý lỗi & Toast**<br>- Chuẩn hóa xử lý lỗi API: 400, 401, 403, 404, 409, 422 và 500.<br>- Chuyển Problem Details thành thông báo Toast thân thiện.<br>- ToastContainer chỉ được khởi tạo một lần tại layout/provider chung. | ✅ 100% |
| **OV-04** | **Cài đặt Hangfire**<br>- Cài và cấu hình Hangfire dùng PostgreSQL Storage.<br>- Chạy Hangfire Server trong backend.<br>- Bật dashboard `/hangfire` và giới hạn quyền Admin. | ⬜ 0% |
| **OV-05** | **Welcome Email Job**<br>- Tạo `WelcomeEmailJob` gửi email chào mừng sau đăng ký.<br>- Gọi `BackgroundJob.Enqueue()` sau khi tạo tài khoản thành công.<br>- Có retry và log kết quả thực hiện job. | ⬜ 0% |

---

## 👤 4. Kina Niê — Object Storage, UI Detail & SEO

**Trọng tâm:** MinIO, quản lý ảnh Recipe, Recipe Detail và SEO.

| Mã Task | Nhiệm vụ chi tiết | Tiến độ |
|---|---|---|
| **KN-01** | **Tích hợp MinIO Object Storage**<br>- Cấu hình kết nối MinIO qua biến môi trường/appsettings an toàn.<br>- Xây dựng `IFileStorageService` và service triển khai upload/delete file.<br>- Không commit Access Key, Secret Key hoặc mật khẩu thật lên Git. | ⬜ 0% |
| **KN-02** | **API Upload Ảnh An Toàn**<br>- Tạo endpoint `POST /api/v1/recipes/{id}/images` nhận `multipart/form-data`.<br>- Kiểm tra magic bytes, MIME type và dung lượng tối đa 5 MB.<br>- Chỉ chấp nhận JPEG, PNG, WebP và AVIF.<br>- Chỉ Author sở hữu Recipe hoặc Admin được upload ảnh. | ⬜ 0% |
| **KN-03** | **Xóa Ảnh & Dọn File**<br>- Xóa file vật lý trên MinIO khi người dùng xóa một ảnh riêng lẻ không còn được tham chiếu.<br>- Có thể dùng Hangfire dọn orphan files.<br>- Không xóa ảnh chỉ vì Recipe bị soft delete. | ⬜ 0% |
| **KN-04** | **UI Trang Chi Tiết Recipe**<br>- Xây dựng route Recipe Detail của dự án, ví dụ `/recipes/[id]`.<br>- Hiển thị ảnh, tác giả, Category, Ingredient, Step, thời gian, khẩu phần và dinh dưỡng.<br>- Chỉ hiển thị công khai Recipe ở trạng thái Published. | ⬜ 0% |
| **KN-05** | **SEO & Tối Ưu Hình Ảnh**<br>- Dùng `next/image` cho ảnh Recipe và cấu hình remote image phù hợp.<br>- Bổ sung Open Graph metadata.<br>- Tạo Schema.org JSON-LD với `@type: Recipe` cho Recipe Published. | ⬜ 0% |

---

# 🤝 QUY ƯỚC PHỐI HỢP CHUNG

| Nội dung | Quy ước thực hiện |
|---|---|
| Git workflow | Mỗi thành viên làm trên branch riêng; không commit trực tiếp lên `main`. |
| Pull Request | Mỗi PR cần ít nhất một thành viên khác review trước khi merge. |
| API contract | Thống nhất request/response, mã lỗi và phân trang trước khi frontend tích hợp. |
| Migration | Không sửa migration đã merge; tạo migration mới khi thay đổi database. |
| Kiểm thử | Mỗi endpoint cần có tối thiểu một test thành công và một test lỗi. |
| File dùng chung | Khi sửa `Program.cs`, `ApplicationDbContext`, migration, `docker-compose.yml` hoặc layout chung phải báo nhóm trước. |
| Bảo mật | Không commit `.env`, JWT secret, password, Google Client Secret, MinIO Secret Key hoặc token. |
| Báo cáo | Mỗi thành viên lưu link commit/PR, ảnh giao diện, endpoint và kết quả test của phần mình. |

# ⚠️ HẠNG MỤC CẦN THEO DÕI THÊM

Các chức năng như Recipe Core CRUD, Category CRUD, Logout/Profile, Redis Cache, Health Check, Serilog, OpenTelemetry, Sitemap, Thumbnail, Swagger, Rate Limiting, Docker Compose, CI/CD và Automated Tests cần được ghi rõ trong backlog tiếp theo hoặc đính kèm link commit nếu nhóm đã hoàn thành.

---

# 🚀 SPRINT 3 & 4 — HOÀN THIỆN TOÀN BỘ ĐỒ ÁN

> Mục tiêu: Hoàn thiện các chức năng còn thiếu, tích hợp frontend–backend, kiểm thử và chuẩn bị Docker demo.  
> Các task bên dưới **bổ sung cho phân công cũ**, không thay đổi phần công việc đã giao ở Sprint 1 & 2.

## 👤 1. Nguyễn Đức Thành — Auth, Security & API Platform

| Mã Task | Nhiệm vụ chi tiết | Tiến độ |
|---|---|---|
| **TH-07** | **Logout & Profile Management**<br>- Tạo endpoint logout, thu hồi Refresh Token của phiên hiện tại.<br>- Tạo API xem hồ sơ cá nhân.<br>- Tạo API cập nhật `displayName`, `avatarUrl`, `bio`.<br>- Hoàn thiện UI Profile và xử lý xóa session sau logout. | ⬜ 0% |
| **TH-08** | **API Versioning, Swagger & Global Error Handling**<br>- Chuẩn hóa endpoint dưới `/api/v1`.<br>- Cấu hình Swagger hoặc Scalar với JWT Bearer Authorization.<br>- Tạo Global Exception Middleware trả về RFC 7807 Problem Details.<br>- Chuẩn hóa mã lỗi: `AUTH_*`, `RECIPE_*`, `CATEGORY_*`, `VALIDATION_*`.<br>- Cấu hình Rate Limiting cho Login, Register và Upload. | ⬜ 0% |
| **TH-09** | **Seed Data & Security Tests**<br>- Seed role `Admin`, `Author` và tài khoản demo.<br>- Phối hợp seed tối thiểu 20 Category, 100 Recipe, mỗi Recipe có tối thiểu 10 Ingredient và 5 Step.<br>- Viết test Register, Login, Refresh Token, Logout, Profile, Authorization và Rate Limiting. | ⬜ 0% |

---

## 👤 2. Minh Long — Recipe Core, Cache & Backend Tests

| Mã Task | Nhiệm vụ chi tiết | Tiến độ |
|---|---|---|
| **ML-06** | **Recipe Core CRUD & Lifecycle**<br>- Xây dựng API danh sách Recipe và Recipe Detail.<br>- Xây dựng API Create, Update và Soft Delete Recipe.<br>- Xây dựng Publish, Unpublish, Archive và Restore Recipe.<br>- Recipe mới ở trạng thái `Draft`.<br>- Chỉ Recipe `Published` được hiển thị công khai, xuất hiện trong Search và Sitemap.<br>- Hỗ trợ optimistic concurrency bằng RowVersion hoặc Version. | ⬜ 0% |
| **ML-07** | **Redis Cache & Cache Invalidation**<br>- Cache danh sách Recipe và Recipe Detail bằng Redis.<br>- Thiết lập TTL phù hợp cho dữ liệu công khai.<br>- Xóa cache khi Recipe, Category, Ingredient, Step hoặc Image thay đổi.<br>- Có fallback khi Redis không khả dụng. | ⬜ 0% |
| **ML-08** | **Recipe/Search Automated Tests**<br>- Test Recipe CRUD, Publish, Archive, Restore và Soft Delete.<br>- Test Ingredient/Step CRUD và tự đánh lại thứ tự Step.<br>- Test Search tiếng Việt có dấu/không dấu, Filter, Sort và Pagination.<br>- Test Redis cache và cache invalidation. | ⬜ 0% |

---

## 👤 3. Oven — Category, Author Dashboard & Frontend Integration

| Mã Task | Nhiệm vụ chi tiết | Tiến độ |
|---|---|---|
| **OV-06** | **Category CRUD & Category UI**<br>- Xây dựng API xem danh sách và chi tiết Category.<br>- Xây dựng API Admin Create, Update, Soft Delete Category.<br>- Không cho xóa Category khi còn Recipe chưa bị xóa mềm thuộc Category.<br>- Xây dựng trang Category và giao diện quản lý Category cho Admin. | ⬜ 0% |
| **OV-07** | **Author Recipe Dashboard**<br>- Xây dựng trang quản lý Recipe của Author.<br>- Hiển thị trạng thái Draft, Published và Archived.<br>- Thêm thao tác Edit, Publish, Unpublish, Archive, Restore và Delete.<br>- Tích hợp phân quyền và thông báo Toast cho từng thao tác. | ⬜ 0% |
| **OV-08** | **Frontend Common Components & Integration Tests**<br>- Chuẩn hóa Header, Footer, App Layout, Loading State, Error State, Empty State và Pagination.<br>- Hoàn thiện Auth Store và Protected Route.<br>- Kiểm tra luồng frontend: Register → Login → Create Recipe → Publish → Search → Logout.<br>- Kiểm tra responsive cho trang Login, Recipe Form, Recipe Detail và Dashboard. | ⬜ 0% |

---

## 👤 4. Kina Niê — Image Processing, SEO, Observability & Deployment

| Mã Task | Nhiệm vụ chi tiết | Tiến độ |
|---|---|---|
| **KN-06** | **Image Processing & Thumbnail Job**<br>- Tạo Background Job resize ảnh sau khi upload.<br>- Tạo ảnh thumbnail WebP cho Recipe Image.<br>- Lưu metadata ảnh: original URL, thumbnail URL, size và content type.<br>- Cập nhật UI sử dụng thumbnail ở Recipe Card và ảnh gốc ở Recipe Detail. | ⬜ 0% |
| **KN-07** | **Sitemap & SEO Completion**<br>- Tạo sitemap động chỉ chứa Recipe `Published` chưa bị xóa mềm.<br>- Hoàn thiện Open Graph metadata cho Home, Category và Recipe Detail.<br>- Hoàn thiện Schema.org JSON-LD cho Recipe.<br>- Kiểm tra ảnh MinIO hiển thị đúng qua `next/image`. | ⬜ 0% |
| **KN-08** | **Health Check, Logging, Docker & CI/CD**<br>- Cấu hình Health Check cho API, PostgreSQL, Redis và MinIO.<br>- Cấu hình Serilog structured logging và Correlation ID.<br>- Cấu hình OpenTelemetry tracing và metrics.<br>- Hoàn thiện `Dockerfile`, `docker-compose.yml` và Nginx nếu sử dụng.<br>- Tạo GitHub Actions: build backend, test backend, build frontend và validate Docker Compose. | ⬜ 0% |

---

# 🧩 QUY TẮC DỮ LIỆU VÀ TÍCH HỢP

| Nội dung | Quy tắc áp dụng |
|---|---|
| Recipe Status | Recipe mới là `Draft`; chỉ `Published` được xem công khai, Search và Sitemap. |
| Soft Delete | Recipe và Category dùng `IsDeleted`; dữ liệu bị xóa mềm không xuất hiện ở API công khai. |
| Category Delete | Không xóa Category khi còn Recipe chưa bị xóa mềm đang sử dụng. |
| Recipe Delete | Soft delete Recipe không được xóa Ingredient, Step, Nutrition hoặc ảnh trên MinIO. |
| Image Delete | Chỉ xóa vật lý file MinIO khi xóa riêng ảnh không còn được tham chiếu hoặc khi dọn orphan file. |
| Published Recipe | Muốn Publish phải có ít nhất một Ingredient và một Step. |
| API | Endpoint dùng `/api/v1`; lỗi trả về RFC 7807 Problem Details. |
| Pagination | Kết quả danh sách trả về `items`, `totalCount`, `page`, `pageSize`, `totalPages`. |
| Cache | Cache phải bị invalidation khi Recipe, Category, Ingredient, Step hoặc Image thay đổi. |
| Security | Không commit `.env`, JWT Secret, Google Client Secret, database password hay MinIO Secret Key. |

---

# ✅ CHECKLIST NGHIỆM THU CUỐI KỲ

- [ ] Có Clean Architecture và build backend thành công.
- [ ] Database có migration và dữ liệu mẫu tối thiểu 20 Category, 100 Recipe.
- [ ] Mỗi Recipe mẫu có ít nhất 10 Ingredient và 5 Step.
- [ ] Register, Login, Google Login, Refresh Token, Logout và Profile hoạt động.
- [ ] Author chỉ quản lý Recipe của mình; Admin quản lý toàn hệ thống.
- [ ] Category CRUD hoạt động đúng quyền Admin.
- [ ] Recipe CRUD, Ingredient, Step, Image và lifecycle hoạt động.
- [ ] Search, Filter, Sort và Pagination hoạt động.
- [ ] Redis cache và cache invalidation hoạt động.
- [ ] Hangfire Welcome Email, Thumbnail và Sitemap hoạt động.
- [ ] Health Check, Serilog và OpenTelemetry hoạt động.
- [ ] Frontend có Layout, Loading, Error, Empty State, Pagination và Toast.
- [ ] Swagger/Scalar hiển thị API có JWT Authorization.
- [ ] Có test backend và build frontend thành công.
- [ ] Docker Compose chạy được PostgreSQL, Redis, MinIO, Backend và Frontend.
- [ ] README có hướng dẫn chạy dự án từ repository sạch.
