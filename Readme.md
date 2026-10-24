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
