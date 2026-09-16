# KẾ HOẠCH PHÂN CÔNG CÔNG VIỆC NHÓM (DỰ ÁN CULINARY BLOG)
**Môn học:** Phát triển Ứng dụng Web Nâng cao | **Nhóm:** 4 Thành viên

---

## 1. Bảng Phân Công Tóm Tắt (Theo Cụm Tính Năng)

| Thành viên | Trọng tâm công việc | Chi tiết công việc chính |
| :--- | :--- | :--- |
| **Nguyễn Đức Thành** | **Nền tảng Backend & Đăng nhập** | Khởi tạo Clean Architecture, CRUD Công thức cốt lõi, JWT & Google OAuth. |
| **Minh Long** | **Dữ liệu phụ & Tìm kiếm (Search)** | API Nguyên liệu/Bước làm, PostgreSQL Full-Text Search, UI Trang tìm kiếm. |
| **Oven** | **Nhập liệu & Chạy ngầm (Jobs)** | Thiết kế Form UI tạo công thức đa bước, cấu hình Hangfire Jobs gửi email. |
| **Kina Niê** | **Hiển thị & File Upload (MinIO)** | UI chi tiết công thức, API lưu ảnh lên MinIO, tối ưu SEO JSON-LD. |

---

## 2. Phân Tích Chuyên Sâu: Cách Làm & Hướng Triển Khai

Mỗi thành viên trong nhóm sẽ đảm nhận một luồng tính năng dọc (Vertical Slicing), chịu trách nhiệm xuyên suốt từ Backend API cho đến Frontend UI.

### 2.1. Nguyễn Đức Thành: Nền tảng Backend & Đăng nhập
* **Mức độ:** Khó (Đòi hỏi tư duy hệ thống và kiến trúc cốt lõi).
* **Nhiệm vụ chi tiết:** Thiết lập bộ khung .NET 10 Minimal APIs, cấu trúc Clean Architecture và luồng xác thực (FR-AUTH). Đồng thời viết các API cốt lõi quản lý công thức (FR-RCP-003, 004, 007).
* **Cách thức triển khai:**
  - Dựng cấu trúc thư mục chuẩn 4 tầng: Domain, Application, Infrastructure, Presentation.
  - Cài đặt CQRS kết hợp MediatR Pipeline để xử lý các Commands và Queries.
  - Sử dụng ASP.NET Core Identity kết hợp phát hành JWT Token (Access Token 15 phút, Refresh Token 7 ngày).

### 2.2. Minh Long: Dữ liệu phụ & Tìm kiếm
* **Mức độ:** Vừa (Trọng tâm xử lý logic truy vấn dữ liệu).
* **Nhiệm vụ chi tiết:** Xử lý các mảnh ghép dữ liệu con của công thức (API CRUD Nguyên liệu & Bước làm) và cốt lõi tính năng Full-Text Search tiếng Việt (FR-SRCH-001).
* **Cách thức triển khai:**
  - Viết các API quản lý chi tiết nguyên liệu (`RecipeIngredient`) và các bước thực hiện (`RecipeStep`).
  - Tận dụng `tsvector`, `tsquery` và extension `unaccent` trong PostgreSQL để xây dựng tính năng tìm kiếm gần đúng (không dấu).
  - Xây dựng giao diện trang `/search` ở phía Frontend để hiển thị kết quả và phân trang.

### 2.3. Oven: Nhập liệu & Chạy ngầm
* **Mức độ:** Khó (Trọng tâm xử lý tính đồng bộ, Form phức tạp và tác vụ ngầm).
* **Nhiệm vụ chi tiết:** Xây dựng Form tạo công thức đa bước (Multi-step Wizard tại route `/dashboard/recipes/new`) và cấu hình hệ thống chạy ngầm Hangfire (FR-JOB, FR-OBS).
* **Cách thức triển khai:**
  - Frontend: Sử dụng React Hook Form kết hợp Zod để validate dữ liệu chặt chẽ ngay tại client, bắt các mã lỗi chuẩn RFC 7807 từ server để hiển thị thông báo Toast.
  - Backend: Cấu hình Hangfire chạy in-process để thực thi bất đồng bộ các tác vụ như gửi email chào mừng (fire-and-forget) và tự động tạo file Sitemap.

### 2.4. Kina Niê: Hiển thị & File Upload
* **Mức độ:** Vừa (Trọng tâm trải nghiệm người dùng và tối ưu hóa tài nguyên).
* **Nhiệm vụ chi tiết:** Xây dựng giao diện trang chi tiết công thức (`/recipes/[slug]`), quản lý module upload file ảnh lên hệ thống lưu trữ MinIO (FR-FILE, FR-RCP-008) và tối ưu hóa SEO.
* **Cách thức triển khai:**
  - Backend: Tích hợp AWS SDK cho .NET để kết nối MinIO, kiểm tra định dạng Magic Bytes, giới hạn dung lượng file tối đa 5MB và trả về public URL.
  - Frontend: Lấy dữ liệu từ API của Thành và Long để render trang chi tiết công thức, cấu hình thẻ Open Graph Meta Tags và JSON-LD Schema.org đạt chuẩn Core Web Vitals.
