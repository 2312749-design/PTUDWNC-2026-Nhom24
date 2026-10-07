# 📋 CHI TIẾT NHIỆM VỤ DỰ ÁN CULINARY BLOG (SPRINT 1 & 2)

## 👤 1. Nguyễn Đức Thành (Lead Backend & Auth)
**Trọng tâm:** Xây dựng móng nhà (Clean Architecture) và hệ thống cửa bảo vệ (Identity + JWT).

| Mã Task | Nhiệm vụ chi tiết (Actionable Steps) | Tiến độ |
| :--- | :--- | :---: |
| **TH-01** | **Khởi tạo Solution & Clean Architecture**<br> - Tạo 4 projects: `CulinaryBlog.Domain`, `Application`, `Infrastructure`, `API`[cite: 22, 34].<br> - Thiết lập Project References đúng luồng (API -> Infra -> App -> Domain)[cite: 22, 34].<br> - Cài đặt thư viện: `MediatR`, `Mapster` và `Microsoft.EntityFrameworkCore`[cite: 22, 34]. | [ ] 100% |
| **TH-02** | **Database & Core Entities**<br> - Tạo file `ApplicationUser.cs` (kế thừa `IdentityUser`), `Recipe.cs`, `Category.cs`[cite: 21, 32].<br> - Setup `ApplicationDbContext` và đăng ký chuỗi kết nối PostgreSQL[cite: 22, 34].<br> - Chạy lệnh `dotnet ef migrations add InitialCreate` và `database update`[cite: 19, 30]. | [ ] 100% |
| **TH-03** | **API Xác thực (Login/Register)**<br> - Viết `RegisterCommandHandler`: Mã hóa pass bằng PBKDF2, gán role mặc định "Author"[cite: 21, 32].<br> - Viết `LoginCommandHandler`: Kiểm tra pass, cấp phát JWT Access Token[cite: 21, 32].<br> - Tạo Endpoint Minimal API: `POST /api/v1/auth/register` và `login`[cite: 21, 32]. | [ ] 100% |
| **TH-04** | **Refresh Token & Security**<br> - Tạo Entity `RefreshToken` (có cờ `IsRevoked`, `IsUsed`)[cite: 21, 32].<br> - Viết `RefreshTokenCommandHandler` xử lý Token Rotation (tạo RT mới, đánh dấu RT cũ)[cite: 21, 32].<br> - Cấu hình CORS policy cho cổng `localhost:3000` của Next.js[cite: 21, 32]. | [ ] 0% |
| **TH-05** | **OAuth 2.0 Google**<br> - Cấu hình `AddAuthentication().AddGoogle()` trong `DependencyInjection.cs`[cite: 21, 32].<br> - Viết API `/auth/google` nhận thông tin, tự động tạo `ApplicationUser` nếu email chưa tồn tại[cite: 21, 32]. | [ ] 0% |
| **TH-06** | **Resource-Based Authorization**<br> - Viết `RecipeAuthorizationHandler` kế thừa `AuthorizationHandler`[cite: 21, 32].<br> - Thêm logic: Tác giả chỉ được phép Update/Delete bài viết của chính mình[cite: 21, 32]. | [ ] 0% |

<br>

## 👤 2. Minh Long (Database Queries & Search Engine)
**Trọng tâm:** Xử lý các bảng dữ liệu phụ và tính năng tìm kiếm cốt lõi của ứng dụng.

| Mã Task | Nhiệm vụ chi tiết (Actionable Steps) | Tiến độ |
| :--- | :--- | :---: |
| **ML-01** | **Model & Fluent API Dữ liệu phụ**<br> - Định nghĩa Entity `RecipeIngredient` (Tên, Số lượng, Đơn vị) và `RecipeStep` (Thứ tự, Mô tả)[cite: 19, 30].<br> - Cấu hình Fluent API `HasMany().WithOne()` và `OnDelete(Cascade)`[cite: 19, 30]. | [ ] 100% |
| **ML-02** | **API CRUD cho Ingredient & Step**<br> - Viết Commands và Handlers cho việc Thêm/Xóa Ingredient và Step[cite: 18, 33].<br> - Mở Endpoints `POST/PUT/DELETE` cho route `/recipes/{id}/ingredients` và `/steps`[cite: 18, 33]. | [ ] 100% |
| **ML-03** | **Cấu hình DB cho Full-Text Search**<br> - Bật extension `unaccent` trong PostgreSQL để loại bỏ dấu tiếng Việt[cite: 19, 30].<br> - Tạo Computed Column `SearchVector` dùng hàm `to_tsvector`[cite: 19, 30].<br> - Đánh Index dạng `GIN` cho cột `SearchVector` để tối ưu tốc độ[cite: 19, 30]. | [ ] 100% |
| **ML-04** | **API Phân trang & Tìm kiếm**<br> - Viết `SearchRecipesQueryHandler` dùng `EF.Functions.PlainToTsQuery` để lọc dữ liệu[cite: 19, 30].<br> - Tích hợp phân trang: `Skip((page - 1) * pageSize).Take(pageSize)`[cite: 19, 30].<br> - Trả về object `PaginatedResult` (gồm items, totalCount, page, totalPages)[cite: 22, 34]. | [ ] 0% |
| **ML-05** | **Giao diện (UI) Trang Tìm kiếm**<br> - Code giao diện trang `/search` trên Next.js có thanh gõ từ khóa[cite: 20, 31].<br> - Dùng `useQuery` (TanStack Query) gọi API Backend và render danh sách Card[cite: 20, 31]. | [ ] 0% |

<br>

## 👤 3. Oven (Form Wizard & Background Jobs)
**Trọng tâm:** Xử lý nhập liệu phức tạp phía Frontend và các luồng chạy ngầm phía Backend.

| Mã Task | Nhiệm vụ chi tiết (Actionable Steps) | Tiến độ |
| :--- | :--- | :---: |
| **OV-01** | **Validation với Zod Schema (Frontend)**<br> - Tạo file `types/recipe.ts` cấu hình `createRecipeSchema` bằng thư viện Zod[cite: 20, 31].<br> - Set rule: Tiêu đề (min 5 ký tự), mảng nguyên liệu/bước làm (min 1)[cite: 20, 31]. | [ ] 100% |
| **OV-02** | **Form Tạo Công Thức Đa Bước**<br> - Xây dựng Client Component tại `/dashboard/recipes/new`[cite: 20, 31].<br> - Tích hợp `react-hook-form` với `zodResolver`[cite: 20, 31].<br> - Dùng `useFieldArray` làm tính năng "Thêm/Xóa Nguyên Liệu" và "Bước Làm" động[cite: 20, 31]. | [ ] 100% |
| **OV-03** | **Xử lý Lỗi & UI Toast**<br> - Cấu hình Axios Interceptor bắt các mã lỗi `400 Bad Request`, `422 Unprocessable Entity`[cite: 20, 31].<br> - Map lỗi từ RFC 7807 thành thông báo dạng Toast (góc màn hình) cho user[cite: 20, 31]. | [ ] 100% |
| **OV-04** | **Cài đặt Hangfire (Backend)**<br> - Cài package `Hangfire.Core` và `Hangfire.PostgreSql`[cite: 18, 33].<br> - Cấu hình chạy in-process và bật bảng điều khiển tại `/hangfire` (chỉ Admin)[cite: 18, 33]. | [ ] 0% |
| **OV-05** | **Tác vụ ngầm Gửi Email**<br> - Viết file `WelcomeEmailJob.cs` chứa logic gửi thư (tác vụ Fire-and-forget)[cite: 18, 33].<br> - Dùng `BackgroundJob.Enqueue()` gọi job chạy ngầm ngay sau khi tạo user[cite: 18, 33]. | [ ] 0% |

<br>

## 👤 4. Kina Niê (Object Storage, UI Detail & SEO)
**Trọng tâm:** Quản lý luồng File Upload với MinIO, xây dựng giao diện hiển thị bài viết chuẩn UX/UI và tối ưu hóa SEO.

| Mã Task | Nhiệm vụ chi tiết (Actionable Steps) | Tiến độ |
| :--- | :--- | :---: |
| **KN-01** | **Tích hợp AWS SDK & MinIO**<br> - Cài đặt package `AWSSDK.S3` và setup connection tới MinIO trong appsettings[cite: 18, 33].<br> - Viết class `MinioFileStorageService` implement `IFileStorageService`[cite: 18, 33]. | [ ] 0% |
| **KN-02** | **API Upload Ảnh An Toàn**<br> - Viết endpoint `POST /api/v1/recipes/{id}/images` nhận multipart/form-data[cite: 18, 33].<br> - Check logic: Đọc Magic Bytes (JPEG/PNG/WebP), giới hạn dung lượng < 5MB[cite: 18, 33]. | [ ] 0% |
| **KN-03** | **Logic Xóa Ảnh Ngầm**<br> - Tích hợp Hangfire: Khi Recipe bị xóa, gọi Job tự động xóa vật lý ảnh đó trên MinIO[cite: 18, 33]. | [ ] 0% |
| **KN-04** | **UI Trang Chi Tiết Món Ăn**<br> - Viết Server Component tại route `/recipes/[slug]/page.tsx` (Next.js SSR)[cite: 20, 31].<br> - Render HTML trực tiếp từ Server: Banner ảnh, thẻ tác giả, danh sách bước làm[cite: 20, 31]. | [ ] 0% |
| **KN-05** | **Tối Ưu Hóa SEO & Hình ảnh**<br> - Chuyển toàn bộ thẻ `<img>` thành `<Image>` của Next.js, cấu hình `remotePatterns`[cite: 20, 31].<br> - Chèn Script `JSON-LD Schema.org` loại `@type: "Recipe"` và Open Graph Meta Tags[cite: 20, 31]. | [ ] 0% |
