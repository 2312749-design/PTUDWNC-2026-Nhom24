# KẾ HOẠCH PHÂN CÔNG CÔNG VIỆC NHÓM (DỰ ÁN CULINARY BLOG)

**Môn học:** Phát triển Ứng dụng Web Nâng cao | **Nhóm:** 4 Thành viên[cite: 28]

---

# 📋 CHI TIẾT NHIỆM VỤ DỰ ÁN CULINARY BLOG (SPRINT 1 & 2)

## 👤 1. Nguyễn Đức Thành (Lead Backend & Auth)
**Trọng tâm:** Xây dựng móng nhà (Clean Architecture) và hệ thống cửa bảo vệ (Identity + JWT).

- [ ] **TH-01: Khởi tạo Solution & Clean Architecture**
  - [ ] Tạo 4 projects: `CulinaryBlog.Domain`, `Application`, `Infrastructure`, `API`[cite: 22, 34].
  - [ ] Thiết lập Project References đúng luồng (API -> Infra -> App -> Domain)[cite: 22, 34].
  - [ ] Cài đặt thư viện: `MediatR`, `Mapster` (Application) và `Microsoft.EntityFrameworkCore` (Infrastructure)[cite: 22, 34].
- [ ] **TH-02: Database & Core Entities**
  - [ ] Tạo file `ApplicationUser.cs` (kế thừa `IdentityUser`), `Recipe.cs`, `Category.cs`[cite: 21, 32].
  - [ ] Setup `ApplicationDbContext` và đăng ký chuỗi kết nối PostgreSQL trong `appsettings.json`[cite: 22, 34].
  - [ ] Chạy lệnh `dotnet ef migrations add InitialCreate` và `database update`[cite: 19, 30].
- [ ] **TH-03: API Xác thực (Login/Register)**
  - [ ] Viết `RegisterCommandHandler`: Mã hóa pass bằng PBKDF2, gán role mặc định "Author"[cite: 21, 32].
  - [ ] Viết `LoginCommandHandler`: Kiểm tra pass, cấp phát JWT Access Token (hạn 15 phút)[cite: 21, 32].
  - [ ] Tạo Controller/Endpoint Minimal API: `POST /api/v1/auth/register` và `POST /api/v1/auth/login`[cite: 21, 32].
- [ ] **TH-04: Refresh Token & Security**
  - [ ] Tạo Entity `RefreshToken` (có cờ `IsRevoked`, `IsUsed`)[cite: 21, 32].
  - [ ] Viết `RefreshTokenCommandHandler` xử lý Token Rotation (tạo RT mới, đánh dấu RT cũ đã dùng)[cite: 21, 32].
  - [ ] Cấu hình CORS policy cho cổng `localhost:3000` của Next.js[cite: 21, 32].
- [ ] **TH-05: OAuth 2.0 Google**
  - [ ] Cấu hình `AddAuthentication().AddGoogle()` trong `DependencyInjection.cs`[cite: 21, 32].
  - [ ] Viết API `/auth/google` nhận thông tin từ Google và tự động tạo `ApplicationUser` nếu là tài khoản mới[cite: 21, 32].
- [ ] **TH-06: Resource-Based Authorization**
  - [ ] Viết `RecipeAuthorizationHandler` kế thừa `AuthorizationHandler`[cite: 21, 32].
  - [ ] Thêm logic: Tác giả (`Author`) chỉ được phép Update/Delete bài viết có `AuthorId` trùng với ID của mình[cite: 21, 32].

---

## 👤 2. Minh Long (Database Queries & Search Engine)
**Trọng tâm:** Xử lý các bảng dữ liệu phụ và tính năng tìm kiếm cốt lõi của ứng dụng.

- [ ] **ML-01: Model & Fluent API Dữ liệu phụ**
  - [ ] Định nghĩa Entity `RecipeIngredient` (Tên, Số lượng, Đơn vị) và `RecipeStep` (Thứ tự, Mô tả)[cite: 19, 30].
  - [ ] Cấu hình Fluent API `HasMany().WithOne()` cho Recipe và thêm `OnDelete(DeleteBehavior.Cascade)`[cite: 19, 30].
- [ ] **ML-02: API CRUD cho Ingredient & Step**
  - [ ] Viết `CreateIngredientCommand` và `DeleteIngredientCommand` kèm Handlers tương ứng[cite: 18, 33].
  - [ ] Viết `CreateStepCommand` và `DeleteStepCommand` (Lưu ý logic tự động đánh số thứ tự bước `StepNumber`)[cite: 18, 33].
  - [ ] Mở Endpoints `POST/PUT/DELETE` cho route `/recipes/{id}/ingredients` và `/recipes/{id}/steps`[cite: 18, 33].
- [ ] **ML-03: Cấu hình DB cho Full-Text Search**
  - [ ] Bật extension `unaccent` trong PostgreSQL để loại bỏ dấu tiếng Việt[cite: 19, 30].
  - [ ] Tạo Computed Column `SearchVector` trong `RecipeConfiguration` sử dụng hàm `to_tsvector`[cite: 19, 30].
  - [ ] Đánh Index dạng `GIN` cho cột `SearchVector` để tối ưu tốc độ tìm kiếm[cite: 19, 30].
- [ ] **ML-04: API Phân trang & Tìm kiếm**
  - [ ] Viết `SearchRecipesQueryHandler` dùng `EF.Functions.PlainToTsQuery` để lọc dữ liệu[cite: 19, 30].
  - [ ] Tích hợp logic phân trang (Pagination): `Skip((page - 1) * pageSize).Take(pageSize)`[cite: 19, 30].
  - [ ] Trả về object `PaginatedResult` (gồm items, totalCount, page, totalPages)[cite: 22, 34].
- [ ] **ML-05: Giao diện (UI) Trang Tìm kiếm**
  - [ ] Code giao diện trang `/search` trên Next.js có thanh gõ từ khóa.
  - [ ] Dùng `useQuery` (TanStack Query) gọi API từ Backend và render danh sách kết quả dạng Card[cite: 20, 31].

---

## 👤 3. Oven (Form Wizard & Background Jobs)
**Trọng tâm:** Xử lý nhập liệu phức tạp phía Frontend và các luồng chạy ngầm phía Backend.

- [ ] **OV-01: Validation với Zod Schema (Frontend)**
  - [ ] Tạo file `types/recipe.ts` cấu hình `createRecipeSchema` bằng thư viện Zod[cite: 20, 31].
  - [ ] Set rule: Tiêu đề (min 5 ký tự), mảng nguyên liệu (min 1), mảng bước làm (min 1)[cite: 20, 31].
- [ ] **OV-02: Form Tạo Công Thức Đa Bước (Frontend)**
  - [ ] Xây dựng Client Component tại `/dashboard/recipes/new`[cite: 20, 31].
  - [ ] Tích hợp `react-hook-form` với `zodResolver`[cite: 20, 31].
  - [ ] Dùng `useFieldArray` để làm tính năng "Thêm/Xóa Nguyên Liệu" và "Thêm/Xóa Bước Làm" động (dynamic list)[cite: 20, 31].
- [ ] **OV-03: Xử lý Lỗi & UI Toast**
  - [ ] Cấu hình Axios Interceptor bắt các mã lỗi `400 Bad Request`, `422 Unprocessable Entity`[cite: 20, 31].
  - [ ] Map lỗi từ RFC 7807 của Backend thành thông báo dạng Toast (góc màn hình) cho user[cite: 20, 31].
- [ ] **OV-04: Cài đặt Hangfire (Backend)**
  - [ ] Cài package `Hangfire.Core` và `Hangfire.PostgreSql`[cite: 18, 33].
  - [ ] Cấu hình trong `Program.cs` chạy in-process và bật bảng điều khiển tại `/hangfire`[cite: 18, 33].
- [ ] **OV-05: Tác vụ ngầm Gửi Email**
  - [ ] Viết file `WelcomeEmailJob.cs` chứa logic gửi thư (dùng MailKit hoặc fake log console)[cite: 18, 33].
  - [ ] Tích hợp vào `RegisterCommandHandler` (của Thành): Dùng `BackgroundJob.Enqueue()` để gọi job chạy ngầm ngay sau khi tạo user[cite: 18, 33].

---

## 👤 4. Kina Niê (Object Storage, UI Detail & SEO)
**Trọng tâm:** Tối ưu hóa trải nghiệm đọc, xử lý hình ảnh và đảm bảo chuẩn SEO.

- [ ] **KN-01: Tích hợp AWS SDK & MinIO (Backend)**
  - [ ] Cài đặt package `AWSSDK.S3` và setup connection tới MinIO trong `appsettings.json`[cite: 18, 33].
  - [ ] Viết class `MinioFileStorageService` implement interface `IFileStorageService`[cite: 18, 33].
- [ ] **KN-02: API Upload Ảnh An Toàn (Backend)**
  - [ ] Viết endpoint `POST /api/v1/recipes/{id}/images` nhận `multipart/form-data`[cite: 18, 33].
  - [ ] Viết logic chặn file: Đọc Magic Bytes (chỉ nhận JPEG/PNG/WebP), check dung lượng `< 5MB`[cite: 18, 33].
- [ ] **KN-03: Logic Xóa Ảnh Ngầm**
  - [ ] Tích hợp Hangfire: Khi API Delete Recipe được gọi, enqueue một job tự động gọi API MinIO để xóa vật lý ảnh đó trên Storage[cite: 18, 33].
- [ ] **KN-04: UI Trang Chi Tiết Món Ăn (Frontend)**
  - [ ] Xây dựng Server Component tại `/recipes/[slug]/page.tsx`[cite: 20, 31].
  - [ ] Fetch dữ liệu trực tiếp bằng fetch API của Next.js (không dùng useEffect) để lấy data Render HTML ngay từ Server (SSR)[cite: 20, 31].
- [ ] **KN-05: Tối Ưu Hóa SEO & Hình ảnh**
  - [ ] Chuyển toàn bộ thẻ `<img>` thành `<Image>` của Next.js, cấu hình `remotePatterns` trong `next.config.ts` để đọc ảnh từ MinIO[cite: 20, 31].
  - [ ] Sinh thẻ `<meta>` Open Graph động (og:title, og:image) dựa trên bài viết[cite: 20, 31].
  - [ ] Nhúng đoạn script `JSON-LD Schema.org` loại `@type: "Recipe"` vào trang để lấy hiển thị Rich Snippets trên Google Search[cite: 20, 31].
| **KN-04** | Xây dựng UI Chi tiết Công thức | Viết Server Component tại route `/recipes/[slug]` (Next.js SSR). Hiển thị đầy đủ Banner ảnh, thẻ tác giả, danh sách bước làm và nguyên liệu. | [ ] 0% |
| **KN-05** | Tối ưu hóa SEO & Web Vitals | Dùng `<Image>` component của Next.js để sinh ảnh WebP tự động. Chèn JSON-LD Schema.org dạng `@type: "Recipe"` vào thẻ Head của trang. | [ ] 0% |
