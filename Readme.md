# KẾ HOẠCH PHÂN CÔNG CÔNG VIỆC NHÓM (DỰ ÁN CULINARY BLOG)

**Môn học:** Phát triển Ứng dụng Web Nâng cao | **Nhóm:** 4 Thành viên[cite: 28]

---

## 1. Nguyễn Đức Thành: Nền tảng Backend & Luồng Xác thực

**Mục tiêu:** Xây dựng bộ khung Backend theo Clean Architecture và hoàn thiện toàn bộ phân quyền bảo mật (FR-AUTH).

| Mã Task | Nhiệm vụ chi tiết (Actionable Steps) | Tiêu chí hoàn thành / Nghiệm thu (Deliverables) | Tiến độ |
| :--- | :--- | :--- | :--- |
| **TH-01** | Khởi tạo cấu trúc dự án Clean Architecture | Tạo thành công 4 thư mục/project: Domain, Application, Infrastructure, Presentation (API) và cài đặt MediatR, Mapster. | [ ] 0% |
| **TH-02** | Thiết lập Entity cốt lõi & Database | Viết code định nghĩa `ApplicationUser`, `Recipe`, `Category`. Cấu hình EF Core kết nối thành công với PostgreSQL. | [ ] 0% |
| **TH-03** | Xây dựng API Đăng ký & Đăng nhập Email | API `/auth/register` mã hóa mật khẩu bằng PBKDF2 của ASP.NET Core Identity. API `/auth/login` cấp phát thành công JWT Access Token (15 phút). | [ ] 0% |
| **TH-04** | Tích hợp Refresh Token Rotation | Viết logic lưu Refresh Token (7 ngày) vào DB. Khóa/xóa (revoke) session nếu phát hiện Token bị dùng lại (Reuse Detection). | [ ] 0% |
| **TH-05** | Tích hợp Đăng nhập Google OAuth 2.0 | API `/auth/google/callback` nhận Google ID Token, tự động tạo ApplicationUser nếu email chưa tồn tại. | [ ] 0% |
| **TH-06** | Cấu hình Phân quyền (Authorization) | Cài đặt `RecipeAuthorizationHandler` đảm bảo tác giả chỉ được sửa/xóa công thức của chính mình (Resource-Based Authorization). | [ ] 0% |


## 2. Minh Long: Dữ liệu chi tiết & Máy tìm kiếm (Search Engine)

**Mục tiêu:** Xử lý dữ liệu con (Nguyên liệu, Bước làm) và xây dựng thuật toán Full-Text Search thông minh bằng PostgreSQL.

| Mã Task | Nhiệm vụ chi tiết (Actionable Steps) | Tiêu chí hoàn thành / Nghiệm thu (Deliverables) | Tiến độ |
| :--- | :--- | :--- | :--- |
| **ML-01** | Thiết kế Model Dữ liệu phụ | Hoàn thiện Fluent API thiết lập quan hệ 1-N giữa Recipe với `RecipeIngredient` (Nguyên liệu) và `RecipeStep` (Bước làm) có tính năng Cascade Delete. | [ ] 0% |
| **ML-02** | Xây dựng API CRUD Dữ liệu phụ | Hoàn thành các API Endpoint: POST/PUT/DELETE tại route `/recipes/{id}/ingredients` và `/recipes/{id}/steps`. | [ ] 0% |
| **ML-03** | Cấu hình PostgreSQL tsvector | Tạo Computed Column `SearchVector` dùng `to_tsvector` trong DB, kết hợp extension `unaccent` để loại bỏ dấu tiếng Việt. | [ ] 0% |
| **ML-04** | Xây dựng API Full-Text Search | Viết Endpoint `/recipes/search` nhận query string, map thành `tsquery`, lọc theo Status (Published) và trả về danh sách phân trang (Pagination). | [ ] 0% |
| **ML-05** | Xây dựng UI Trang Tìm kiếm | Code giao diện `/search` bằng Next.js, dùng `useQuery` (TanStack) gọi API và hiển thị kết quả xếp hạng độ liên quan theo hàm `ts_rank`. | [ ] 0% |


## 3. Oven: Nhập liệu phức tạp & Tác vụ ngầm (Background Jobs)

**Mục tiêu:** Tối ưu hóa trải nghiệm điền Form tạo công thức ở Frontend và xử lý hàng đợi công việc ở Backend.

| Mã Task | Nhiệm vụ chi tiết (Actionable Steps) | Tiêu chí hoàn thành / Nghiệm thu (Deliverables) | Tiến độ |
| :--- | :--- | :--- | :--- |
| **OV-01** | Validate dữ liệu với Zod Schema | Viết `createRecipeSchema` chặt chẽ ép kiểu TypeScript: tiêu đề (5-200 ký tự), bắt buộc có ít nhất 1 nguyên liệu và 1 bước thực hiện. | [ ] 0% |
| **OV-02** | Thiết kế UI Form Đa bước (Wizard) | Dùng React Hook Form và `useFieldArray` tạo giao diện `/recipes/new` chia 3 bước (Info -> Ingredients -> Steps) không bị re-render giật lag. | [ ] 0% |
| **OV-03** | Bắt lỗi và hiển thị Toast | Xử lý mã lỗi chuẩn RFC 7807 trả về từ Backend (VD: 422 Unprocessable Entity, 409 Conflict) và render thành thông báo Toast đỏ trên UI. | [ ] 0% |
| **OV-04** | Cài đặt và Dashboard Hangfire | Cấu hình thư viện Hangfire.Core, Hangfire.PostgreSql chạy in-process. Bật giao diện Dashboard theo dõi tại `/hangfire` (chỉ Admin). | [ ] 0% |
| **OV-05** | Viết Job Gửi Email Chào mừng | Tạo `WelcomeEmailJob` (Fire-and-forget). Job này phải tự động nhận tham số và chạy ngầm (không block UI) ngay sau khi TH-03 đăng ký thành công. | [ ] 0% |


## 4. Kina Niê: Lưu trữ đám mây, Hiển thị & Tối ưu SEO

**Mục tiêu:** Quản lý luồng File Upload với MinIO, xây dựng giao diện hiển thị bài viết chuẩn UX/UI và tối ưu hóa SEO.

| Mã Task | Nhiệm vụ chi tiết (Actionable Steps) | Tiêu chí hoàn thành / Nghiệm thu (Deliverables) | Tiến độ |
| :--- | :--- | :--- | :--- |
| **KN-01** | Tích hợp Server MinIO (AWS SDK) | Backend kết nối thành công với bucket MinIO. Xử lý logic đọc Magic Bytes để chặn file giả mạo định dạng, giới hạn kích thước tối đa 5MB. | [ ] 0% |
| **KN-02** | Viết API Quản lý File Ảnh | API POST `/recipes/{id}/images` nhận multipart/form-data, upload thành công lên MinIO và trả về URL ảnh dạng Public-read. | [ ] 0% |
| **KN-03** | Xóa file bất đồng bộ | Khi một Recipe bị xóa, gọi Hangfire Job để xóa vật lý ảnh trên MinIO (có policy retry 3 lần nếu MinIO bị mất kết nối). | [ ] 0% |
| **KN-04** | Xây dựng UI Chi tiết Công thức | Viết Server Component tại route `/recipes/[slug]` (Next.js SSR). Hiển thị đầy đủ Banner ảnh, thẻ tác giả, danh sách bước làm và nguyên liệu. | [ ] 0% |
| **KN-05** | Tối ưu hóa SEO & Web Vitals | Dùng `<Image>` component của Next.js để sinh ảnh WebP tự động. Chèn JSON-LD Schema.org dạng `@type: "Recipe"` vào thẻ Head của trang. | [ ] 0% |
