# Bếp Nhà Culinary Blog Nhóm 24

Ứng dụng cộng đồng chia sẻ công thức nấu ăn dùng ASP.NET Core, PostgreSQL và Next.js. Repository giữ nguyên phân công chức năng của bốn thành viên; hồ sơ Issue/PR được bổ sung ngày 28/10/2026 để đối chiếu code và nghiệm thu.

## Code và hồ sơ công việc

- [Bản code Lab 07](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/tree/nguyeducthanhlab07).
- [33 Issue theo phân công](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues?q=is%3Aissue+label%3Atype%3Atask).
- [Bảng đối chiếu từng Task](docs/project/TASKS.md) và [kết quả kiểm tra](docs/project/VALIDATION.md).
- [Milestones](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/milestones), [Pull Requests](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/pulls), [Actions](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/actions).
- [Bảng Projects của nhóm](https://github.com/users/2312749-design/projects/1): lọc theo Assignee, Task ID, milestone, nhãn và mức nghiệm thu.
- [Quy trình đóng góp](CONTRIBUTING.md), [trách nhiệm review](docs/OWNERSHIP.md), [ADR](docs/adr/), [contract API](docs/api/README.md).

Nhánh main chỉ được coi là bản tích hợp sau khi PR được kiểm tra và merge. Các Issue ghi người phụ trách theo phân công; tác giả thực tế của các commit không thay đổi.

## Chạy dự án

Cần .NET SDK 10, Node.js 22 (CI và bộ kiểm tra dùng 22), Docker Desktop/Compose và Git.

### Docker

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
# Thay các giá trị change-me trong .env bằng cấu hình local riêng.
docker compose config --quiet
docker compose up -d --build
```

Website qua Nginx: http://localhost. Không ghi đè .env đang sử dụng hoặc xóa Docker volume khi cập nhật code. Xem [DEPLOYMENT.md](DEPLOYMENT.md) để cấu hình SMTP, Google, lưu trữ và vận hành.

### Chạy frontend và backend riêng

Giữ PostgreSQL/Redis đang chạy và cấu hình kết nối backend bằng biến môi trường hoặc user-secrets. Cần JWT secret riêng từ 32 ký tự. Sau đó mở hai terminal:

```powershell
dotnet run --project src/CulinaryBlog.API/CulinaryBlog.API.csproj --launch-profile http
```

```powershell
cd frontend
npm ci
npm run dev -- --port 3000
```

Frontend: http://localhost:3000. Backend: http://localhost:5152. Hướng dẫn giao diện tại [frontend/COSMIC-UI.md](frontend/COSMIC-UI.md). Đọc cấu hình migration/seed trước khi chạy lần đầu trên database hiện có.

### Kiểm tra bản nộp từ source sạch

Repository ghim .NET SDK 10 trong `global.json`, không tự chọn SDK preview đang cài trên máy. Để kiểm tra bản đã commit bằng PowerShell 7.2 và Docker:

```powershell
pwsh -File scripts/submission/verify-clean.ps1
pwsh -File scripts/submission/verify-runtime.ps1 -BaseUrl http://localhost:25152
```

Lệnh đầu xuất `git HEAD` và dựng một stack riêng với database/volume mới: web http://localhost:28080, API http://localhost:25152. Nó không dùng `.env`, container hoặc dữ liệu cũ. Lệnh thứ hai tạo dữ liệu thử riêng trong stack đó để kiểm tra các thao tác API với PostgreSQL, Redis và MinIO thật. Xem [hướng dẫn kiểm tra](scripts/submission/README.md) và [checklist review/nghiệm thu](docs/submission/REVIEW-CHECKLIST.md). Không công khai `.env` hoặc file Compose riêng được sinh trong `artifacts/`.

---

# 📋 CHI TIẾT NHIỆM VỤ DỰ ÁN CULINARY BLOG (SPRINT 1 & 2)

> Quy ước tiến độ: ✅ Đã nghiệm thu · 🟡 Có code nhưng còn tiêu chí hoặc chờ nghiệm thu · ⬜ Chưa bắt đầu.
> Đối chiếu 28/10/2026: giữ nguyên 33 nhiệm vụ và người phụ trách; trạng thái dẫn tới Issue có checklist và minh chứng. Không coi có code là đã được nghiệm thu.
> Mỗi task chỉ được đánh dấu hoàn thành khi có code, test và commit/PR minh chứng.

## 👤 1. Nguyễn Đức Thành — Lead Backend & Authentication

**Trọng tâm:** Xây dựng nền tảng Clean Architecture, Identity, JWT và phân quyền.

| Mã Task | Nhiệm vụ chi tiết | Tiến độ |
|---|---|---|
| **TH-01** | **Khởi tạo Solution & Clean Architecture**<br>- Tạo 4 projects: `CulinaryBlog.Domain`, `CulinaryBlog.Application`, `CulinaryBlog.Infrastructure`, `CulinaryBlog.API`.<br>- Thiết lập project references theo luồng đã thống nhất.<br>- Cài đặt và cấu hình các thư viện dùng chung: MediatR, Mapster, Entity Framework Core. | 🟡 Còn tiêu chí cần hoàn thiện · [#1](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/1) |
| **TH-02** | **Database & Core Entities**<br>- Tạo `ApplicationUser` kế thừa `IdentityUser`, `Recipe`, `Category`.<br>- Cấu hình `ApplicationDbContext`, kết nối PostgreSQL và Fluent API cơ bản.<br>- Tạo migration khởi tạo và cập nhật database. | 🟡 Có code, chờ nghiệm thu · [#2](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/2) |
| **TH-03** | **API Xác thực: Register & Login**<br>- Xây dựng Register Command/Handler, gán role mặc định `Author`.<br>- Dùng ASP.NET Identity `UserManager`/`PasswordHasher` để xử lý mật khẩu an toàn.<br>- Xây dựng Login Command/Handler, cấp JWT Access Token và Refresh Token.<br>- Tạo endpoint `POST /api/v1/auth/register` và `POST /api/v1/auth/login`. | 🟡 Còn tiêu chí cần hoàn thiện · [#3](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/3) |
| **TH-04** | **Refresh Token & CORS**<br>- Tạo entity `RefreshToken` có trạng thái thu hồi và thời gian hết hạn.<br>- Xây dựng Refresh Token Rotation: cấp token mới, thu hồi token cũ.<br>- Cấu hình CORS cho frontend chạy tại `http://localhost:3000`. | 🟡 Có code, chờ nghiệm thu · [#4](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/4) |
| **TH-05** | **Google OAuth 2.0**<br>- Frontend nhận Google ID Token, backend xác minh token trước khi tạo phiên đăng nhập hệ thống.<br>- Tự tạo hoặc liên kết `ApplicationUser` khi email hợp lệ.<br>- Không tin dữ liệu hồ sơ do client tự gửi. | 🟡 Cần cấu hình thật · [#5](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/5) |
| **TH-06** | **Resource-Based Authorization**<br>- Xây dựng `RecipeAuthorizationHandler` kế thừa `AuthorizationHandler`.<br>- Author chỉ được Update/Delete Recipe của chính mình.<br>- Admin được quản lý Recipe theo quyền hệ thống. | 🟡 Còn tiêu chí cần hoàn thiện · [#6](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/6) |
---

## 👤 2. Minh Long — Database Queries & Search Engine

**Trọng tâm:** Quản lý Ingredient, Step, Full-Text Search và giao diện tìm kiếm.

| Mã Task | Nhiệm vụ chi tiết | Tiến độ |
|---|---|---|
| **ML-01** | **Model & Fluent API dữ liệu phụ**<br>- Định nghĩa `RecipeIngredient`: tên, số lượng, đơn vị, ghi chú.<br>- Định nghĩa `RecipeStep`: thứ tự, tiêu đề, mô tả, thời gian.<br>- Cấu hình quan hệ Recipe–Ingredient và Recipe–Step bằng Fluent API. | 🟡 Có code, chờ nghiệm thu · [#10](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/10) |
| **ML-02** | **API CRUD Ingredient & Step**<br>- Viết Command/Handler thêm, sửa, xóa Ingredient và Step.<br>- Mở endpoint cho `/recipes/{id}/ingredients` và `/recipes/{id}/steps`.<br>- Backend tự đánh lại thứ tự Step khi xóa hoặc thay đổi bước. | 🟡 Có code, chờ nghiệm thu · [#11](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/11) |
| **ML-03** | **Database cho Full-Text Search**<br>- Bật extension `unaccent` hỗ trợ tìm kiếm tiếng Việt không dấu.<br>- Tạo `SearchVector`/`tsvector` cho Recipe.<br>- Tạo GIN Index để tối ưu truy vấn tìm kiếm. | 🟡 Có code, chờ nghiệm thu · [#12](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/12) |
| **ML-04** | **API Search, Filter, Sort & Pagination**<br>- Xây dựng `SearchRecipesQueryHandler` dùng PostgreSQL Full-Text Search.<br>- Hỗ trợ filter Category, Difficulty, Cook Time và Servings.<br>- Hỗ trợ sort, offset pagination và trả về `PagedResult` gồm `items`, `totalCount`, `page`, `totalPages`. | 🟡 Còn tiêu chí cần hoàn thiện · [#13](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/13) |
| **ML-05** | **Giao diện tìm kiếm**<br>- Xây dựng thanh tìm kiếm, bộ lọc và danh sách Recipe Card.<br>- Hiển thị trạng thái loading, empty, error và pagination.<br>- Gọi backend thông qua API client dùng chung của dự án. | 🟡 Còn tiêu chí cần hoàn thiện · [#14](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/14) |
---

## 👤 3. Oven — Form Wizard & Background Jobs

**Trọng tâm:** Form Recipe phía frontend, validation, xử lý lỗi và Hangfire.

| Mã Task | Nhiệm vụ chi tiết | Tiến độ |
|---|---|---|
| **OV-01** | **Validation Recipe Form**<br>- Xây dựng schema validation cho dữ liệu Recipe.<br>- Kiểm tra tiêu đề tối thiểu 5 ký tự.<br>- Kiểm tra Recipe có ít nhất một Ingredient và một Step.<br>- Validation frontend chỉ hỗ trợ UX; backend vẫn phải validate độc lập. | 🟡 Còn tiêu chí cần hoàn thiện · [#18](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/18) |
| **OV-02** | **Form Tạo Recipe Đa Bước**<br>- Xây dựng trang tạo Recipe tại route của dự án, ví dụ `/recipes/new`.<br>- Hỗ trợ thêm/xóa Ingredient và Step động.<br>- Hiển thị lỗi từng trường, dữ liệu preview và trạng thái đang gửi. | 🟡 Còn tiêu chí cần hoàn thiện · [#19](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/19) |
| **OV-03** | **Xử lý lỗi & Toast**<br>- Chuẩn hóa xử lý lỗi API: 400, 401, 403, 404, 409, 422 và 500.<br>- Chuyển Problem Details thành thông báo Toast thân thiện.<br>- ToastContainer chỉ được khởi tạo một lần tại layout/provider chung. | 🟡 Còn tiêu chí cần hoàn thiện · [#20](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/20) |
| **OV-04** | **Cài đặt Hangfire**<br>- Cài và cấu hình Hangfire dùng PostgreSQL Storage.<br>- Chạy Hangfire Server trong backend.<br>- Bật dashboard `/hangfire` và giới hạn quyền Admin. | 🟡 Có code, chờ nghiệm thu · [#21](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/21) |
| **OV-05** | **Welcome Email Job**<br>- Tạo `WelcomeEmailJob` gửi email chào mừng sau đăng ký.<br>- Gọi `BackgroundJob.Enqueue()` sau khi tạo tài khoản thành công.<br>- Có retry và log kết quả thực hiện job. | 🟡 Còn tiêu chí cần hoàn thiện · [#22](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/22) |
---

## 👤 4. Kina Niê — Object Storage, UI Detail & SEO

**Trọng tâm:** MinIO, quản lý ảnh Recipe, Recipe Detail và SEO.

| Mã Task | Nhiệm vụ chi tiết | Tiến độ |
|---|---|---|
| **KN-01** | **Tích hợp MinIO Object Storage**<br>- Cấu hình kết nối MinIO qua biến môi trường/appsettings an toàn.<br>- Xây dựng `IFileStorageService` và service triển khai upload/delete file.<br>- Không commit Access Key, Secret Key hoặc mật khẩu thật lên Git. | 🟡 Còn tiêu chí cần hoàn thiện · [#26](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/26) |
| **KN-02** | **API Upload Ảnh An Toàn**<br>- Tạo endpoint `POST /api/v1/recipes/{id}/images` nhận `multipart/form-data`.<br>- Kiểm tra magic bytes, MIME type và dung lượng tối đa 5 MB.<br>- Chỉ chấp nhận JPEG, PNG, WebP và AVIF.<br>- Chỉ Author sở hữu Recipe hoặc Admin được upload ảnh. | 🟡 Có code, chờ nghiệm thu · [#27](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/27) |
| **KN-03** | **Xóa Ảnh & Dọn File**<br>- Xóa file vật lý trên MinIO khi người dùng xóa một ảnh riêng lẻ không còn được tham chiếu.<br>- Có thể dùng Hangfire dọn orphan files.<br>- Không xóa ảnh chỉ vì Recipe bị soft delete. | 🟡 Còn tiêu chí cần hoàn thiện · [#28](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/28) |
| **KN-04** | **UI Trang Chi Tiết Recipe**<br>- Xây dựng route Recipe Detail của dự án, ví dụ `/recipes/[id]`.<br>- Hiển thị ảnh, tác giả, Category, Ingredient, Step, thời gian, khẩu phần và dinh dưỡng.<br>- Chỉ hiển thị công khai Recipe ở trạng thái Published. | 🟡 Còn tiêu chí cần hoàn thiện · [#29](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/29) |
| **KN-05** | **SEO & Tối Ưu Hình Ảnh**<br>- Dùng `next/image` cho ảnh Recipe và cấu hình remote image phù hợp.<br>- Bổ sung Open Graph metadata.<br>- Tạo Schema.org JSON-LD với `@type: Recipe` cho Recipe Published. | 🟡 Còn tiêu chí cần hoàn thiện · [#30](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/30) |
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

# ✅ PHẠM VI ĐỒ ÁN ĐÃ ĐƯỢC BAO PHỦ

Các hạng mục còn lại của Culinary Blog đã được bổ sung và phân công tại **Sprint 3 & 4** bên dưới, gồm:

- CRUD công thức, danh mục, nguyên liệu và bước thực hiện.
- Phân quyền, hồ sơ cá nhân, đăng xuất và thu hồi refresh token.
- Tìm kiếm Full-Text Search, phân trang và Redis cache.
- Upload ảnh MinIO, thumbnail WebP, sitemap và SEO.
- Hangfire, gửi email chào mừng, logging, health check.
- Docker Compose, CI/CD và automated tests.

Trong quá trình thực hiện, mỗi thành viên cập nhật tiến độ, commit/PR và link minh chứng tương ứng với Task ID được giao.

---

# 🚀 SPRINT 3 & 4 — HOÀN THIỆN TOÀN BỘ ĐỒ ÁN

> Mục tiêu: Hoàn thiện các chức năng còn thiếu, tích hợp frontend–backend, kiểm thử và chuẩn bị Docker demo.  
> Các task bên dưới **bổ sung cho phân công cũ**, không thay đổi phần công việc đã giao ở Sprint 1 & 2.

## 👤 1. Nguyễn Đức Thành — Auth, Security & API Platform

| Mã Task | Nhiệm vụ chi tiết | Tiến độ |
|---|---|---|
| **TH-07** | **Logout & Profile Management**<br>- Tạo endpoint logout, thu hồi Refresh Token của phiên hiện tại.<br>- Tạo API xem hồ sơ cá nhân.<br>- Tạo API cập nhật `displayName`, `avatarUrl`, `bio`.<br>- Hoàn thiện UI Profile và xử lý xóa session sau logout. | 🟡 Có code, chờ nghiệm thu · [#7](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/7) |
| **TH-08** | **API Versioning, Swagger & Global Error Handling**<br>- Chuẩn hóa endpoint dưới `/api/v1`.<br>- Cấu hình Swagger hoặc Scalar với JWT Bearer Authorization.<br>- Tạo Global Exception Middleware trả về RFC 7807 Problem Details.<br>- Chuẩn hóa mã lỗi: `AUTH_*`, `RECIPE_*`, `CATEGORY_*`, `VALIDATION_*`.<br>- Cấu hình Rate Limiting cho Login, Register và Upload. | 🟡 Còn tiêu chí cần hoàn thiện · [#8](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/8) |
| **TH-09** | **Seed Data & Security Tests**<br>- Seed role `Admin`, `Author` và tài khoản demo.<br>- Phối hợp seed tối thiểu 20 Category, 100 Recipe, mỗi Recipe có tối thiểu 10 Ingredient và 5 Step.<br>- Viết test Register, Login, Refresh Token, Logout, Profile, Authorization và Rate Limiting. | 🟡 Còn tiêu chí cần hoàn thiện · [#9](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/9) |
---

## 👤 2. Minh Long — Recipe Core, Cache & Backend Tests

| Mã Task | Nhiệm vụ chi tiết | Tiến độ |
|---|---|---|
| **ML-06** | **Recipe Core CRUD & Lifecycle**<br>- Xây dựng API danh sách Recipe và Recipe Detail.<br>- Xây dựng API Create, Update và Soft Delete Recipe.<br>- Xây dựng Publish, Unpublish, Archive và Restore Recipe.<br>- Recipe mới ở trạng thái `Draft`.<br>- Chỉ Recipe `Published` được hiển thị công khai, xuất hiện trong Search và Sitemap.<br>- Hỗ trợ optimistic concurrency bằng RowVersion hoặc Version. | 🟡 Còn tiêu chí cần hoàn thiện · [#15](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/15) |
| **ML-07** | **Redis Cache & Cache Invalidation**<br>- Cache danh sách Recipe và Recipe Detail bằng Redis.<br>- Thiết lập TTL phù hợp cho dữ liệu công khai.<br>- Xóa cache khi Recipe, Category, Ingredient, Step hoặc Image thay đổi.<br>- Có fallback khi Redis không khả dụng. | 🟡 Còn tiêu chí cần hoàn thiện · [#16](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/16) |
| **ML-08** | **Recipe/Search Automated Tests**<br>- Test Recipe CRUD, Publish, Archive, Restore và Soft Delete.<br>- Test Ingredient/Step CRUD và tự đánh lại thứ tự Step.<br>- Test Search tiếng Việt có dấu/không dấu, Filter, Sort và Pagination.<br>- Test Redis cache và cache invalidation. | 🟡 Còn tiêu chí cần hoàn thiện · [#17](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/17) |
---

## 👤 3. Oven — Category, Author Dashboard & Frontend Integration

| Mã Task | Nhiệm vụ chi tiết | Tiến độ |
|---|---|---|
| **OV-06** | **Category CRUD & Category UI**<br>- Xây dựng API xem danh sách và chi tiết Category.<br>- Xây dựng API Admin Create, Update, Soft Delete Category.<br>- Không cho xóa Category khi còn Recipe chưa bị xóa mềm thuộc Category.<br>- Xây dựng trang Category và giao diện quản lý Category cho Admin. | 🟡 Có code, chờ nghiệm thu · [#23](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/23) |
| **OV-07** | **Author Recipe Dashboard**<br>- Xây dựng trang quản lý Recipe của Author.<br>- Hiển thị trạng thái Draft, Published và Archived.<br>- Thêm thao tác Edit, Publish, Unpublish, Archive, Restore và Delete.<br>- Tích hợp phân quyền và thông báo Toast cho từng thao tác. | 🟡 Có code, chờ nghiệm thu · [#24](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/24) |
| **OV-08** | **Frontend Common Components & Integration Tests**<br>- Chuẩn hóa Header, Footer, App Layout, Loading State, Error State, Empty State và Pagination.<br>- Hoàn thiện Auth Store và Protected Route.<br>- Kiểm tra luồng frontend: Register → Login → Create Recipe → Publish → Search → Logout.<br>- Kiểm tra responsive cho trang Login, Recipe Form, Recipe Detail và Dashboard. | 🟡 Còn tiêu chí cần hoàn thiện · [#25](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/25) |
---

## 👤 4. Kina Niê — Image Processing, SEO, Observability & Deployment

| Mã Task | Nhiệm vụ chi tiết | Tiến độ |
|---|---|---|
| **KN-06** | **Image Processing & Thumbnail Job**<br>- Tạo Background Job resize ảnh sau khi upload.<br>- Tạo ảnh thumbnail WebP cho Recipe Image.<br>- Lưu metadata ảnh: original URL, thumbnail URL, size và content type.<br>- Cập nhật UI sử dụng thumbnail ở Recipe Card và ảnh gốc ở Recipe Detail. | 🟡 Còn tiêu chí cần hoàn thiện · [#31](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/31) |
| **KN-07** | **Sitemap & SEO Completion**<br>- Tạo sitemap động chỉ chứa Recipe `Published` chưa bị xóa mềm.<br>- Hoàn thiện Open Graph metadata cho Home, Category và Recipe Detail.<br>- Hoàn thiện Schema.org JSON-LD cho Recipe.<br>- Kiểm tra ảnh MinIO hiển thị đúng qua `next/image`. | 🟡 Còn tiêu chí cần hoàn thiện · [#32](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/32) |
| **KN-08** | **Health Check, Logging, Docker & CI/CD**<br>- Cấu hình Health Check cho API, PostgreSQL, Redis và MinIO.<br>- Cấu hình Serilog structured logging và Correlation ID.<br>- Cấu hình OpenTelemetry tracing và metrics.<br>- Hoàn thiện `Dockerfile`, `docker-compose.yml` và Nginx nếu sử dụng.<br>- Tạo GitHub Actions: build backend, test backend, build frontend và validate Docker Compose. | 🟡 Còn tiêu chí cần hoàn thiện · [#33](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/33) |
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

Ghi nhận hiện trạng 28/10/2026: dòng Published Recipe phía trên giữ mô tả phân công ban đầu. Validation công thức trong mã hiện tại áp dụng tối thiểu **10 nguyên liệu và 5 bước**, theo yêu cầu dữ liệu/lab. Người phụ trách cần kiểm tra và thống nhất quy tắc nghiệp vụ trong các Issue liên quan trước khi nghiệm thu.

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


# Thành viên nhóm

| Thành viên | Vai trò chính | GitHub |
|---|---|---|
| Nguyễn Đức Thành | Backend Lead, Authentication & Security | [@2312749-design](https://github.com/2312749-design) |
| Minh Long | Recipe, Search & Cache | [@Long10205](https://github.com/Long10205) |
| Oven | Category, Validation & Frontend Integration | [@2314487-Somsavath](https://github.com/2314487-Somsavath) |
| Kina | Media, SEO, DevOps & Observability | [@2312711-kina](https://github.com/2312711-kina) |

# Công nghệ sử dụng

- Backend: ASP.NET Core, Entity Framework Core, PostgreSQL.
- Frontend: Next.js, React, TypeScript, Zustand, Radix UI.
- Authentication: ASP.NET Identity, JWT, Refresh Token, Google OAuth.
- Hạ tầng: Docker Compose, Nginx, Redis, MinIO, Hangfire.
- Chất lượng: Swagger/OpenAPI, Serilog, OpenTelemetry, CI/CD, automated tests.

# Cách chạy dự án

```bash
docker compose up -d --build
```
