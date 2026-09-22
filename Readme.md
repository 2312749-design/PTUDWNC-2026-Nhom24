# KẾ HOẠCH PHÂN CÔNG CÔNG VIỆC NHÓM (DỰ ÁN CULINARY BLOG)

**Môn học:** Phát triển Ứng dụng Web Nâng cao | **Nhóm:** 4 Thành viên[cite: 28]

---

## 1. Bảng Phân Công Tóm Tắt (Theo Cụm Tính Năng)

| Thành viên | Trọng tâm công việc | Chi tiết công việc chính |
| :--- | :--- | :--- |
| **Nguyễn Đức Thành** | Nền tảng Backend & Đăng nhập[cite: 27, 28] | Khởi tạo Clean Architecture, CRUD Công thức cốt lõi, JWT & Google OAuth[cite: 4, 5, 27, 28]. |
| **Minh Long** | Dữ liệu phụ & Tìm kiếm (Search)[cite: 26, 27, 28] | API Nguyên liệu/Bước làm, PostgreSQL Full-Text Search, UI Trang tìm kiếm[cite: 26, 27, 28]. |
| **Oven** | Nhập liệu & Chạy ngầm (Jobs)[cite: 26, 27, 28] | Thiết kế Form UI tạo công thức đa bước, cấu hình Hangfire Jobs gửi email[cite: 26, 27, 28]. |
| **Kina Niê** | Hiển thị & File Upload (MinIO)[cite: 26, 27, 28] | UI chi tiết công thức, API lưu ảnh lên MinIO, tối ưu SEO JSON-LD[cite: 26, 27, 28]. |

---

## 2. Phân Tích Chuyên Sâu: Cách Làm & Hướng Triển Khai

Mỗi thành viên trong nhóm sẽ đảm nhận một luồng tính năng dọc (Vertical Slicing), chịu trách nhiệm xuyên suốt từ Backend API cho đến Frontend UI[cite: 3].

### 2.1. Nguyễn Đức Thành: Nền tảng Backend & Đăng nhập

* **Mức độ:** Khó (Đòi hỏi tư duy hệ thống và kiến trúc cốt lõi)[cite: 3, 28].
* **Nhiệm vụ chi tiết:** Thiết lập bộ khung .NET Minimal APIs, cấu trúc Clean Architecture và luồng xác thực (FR-AUTH). Đồng thời viết các API cốt lõi quản lý công thức (FR-RCP-003, 004, 007)[cite: 3, 28].
* **Cách thức triển khai:**
  * Dựng cấu trúc thư mục chuẩn 4 tầng: Domain, Application, Infrastructure, Presentation[cite: 3].
  * Cài đặt CQRS kết hợp MediatR Pipeline để xử lý các Commands và Queries[cite: 3].
  * Sử dụng ASP.NET Core Identity kết hợp phát hành JWT Token (Access Token 15 phút, Refresh Token 7 ngày)[cite: 3].

### 2.2. Minh Long: Dữ liệu phụ & Tìm kiếm

* **Mức độ:** Vừa (Trọng tâm xử lý logic truy vấn dữ liệu)[cite: 26, 27].
* **Nhiệm vụ chi tiết:** Xử lý các mảnh ghép dữ liệu con của công thức (API CRUD Nguyên liệu & Bước làm) và cốt lõi tính năng Full-Text Search tiếng Việt (FR-SRCH-001)[cite: 26, 27].
* **Cách thức triển khai:**
  * Viết các API quản lý chi tiết nguyên liệu (`RecipeIngredient`) và các bước thực hiện (`RecipeStep`)[cite: 26, 27].
  * Tận dụng `tsvector`, `tsquery` và extension `unaccent` trong PostgreSQL để xây dựng tính năng tìm kiếm gần đúng (không dấu)[cite: 26, 27].
  * Xây dựng giao diện trang `/search` ở phía Frontend để hiển thị kết quả và phân trang[cite: 26, 27].

### 2.3. Oven: Nhập liệu & Chạy ngầm

* **Mức độ:** Khó (Trọng tâm xử lý tính đồng bộ, Form phức tạp và tác vụ ngầm)[cite: 26, 27].
* **Nhiệm vụ chi tiết:** Xây dựng Form tạo công thức đa bước (Multi-step Wizard tại route `/dashboard/recipes/new`) và cấu hình hệ thống chạy ngầm Hangfire (FR-JOB, FR-OBS)[cite: 26, 27].
* **Cách thức triển khai:**
  * **Frontend:** Sử dụng React Hook Form kết hợp Zod để validate dữ liệu chặt chẽ ngay tại client, bắt các mã lỗi chuẩn RFC 7807 từ server để hiển thị thông báo Toast[cite: 26].
  * **Backend:** Cấu hình Hangfire chạy in-process để thực thi bất đồng bộ các tác vụ như gửi email chào mừng (fire-and-forget) và tự động tạo file Sitemap[cite: 26].

### 2.4. Kina Niê: Hiển thị & File Upload

* **Mức độ:** Vừa (Trọng tâm trải nghiệm người dùng và tối ưu hóa tài nguyên)[cite: 26].
* **Nhiệm vụ chi tiết:** Xây dựng giao diện trang chi tiết công thức (`/recipes/[slug]`), quản lý module upload file ảnh lên hệ thống lưu trữ MinIO (FR-FILE, FR-RCP-008) và tối ưu hóa SEO[cite: 26].
* **Cách thức triển khai:**
  * **Backend:** Tích hợp AWS SDK cho .NET để kết nối MinIO, kiểm tra định dạng Magic Bytes, giới hạn dung lượng file tối đa đến 5MB và trả về public URL[cite: 26].
  * **Frontend:** Lấy dữ liệu từ API của Thành và Long để render trang chi tiết công thức, cấu hình thẻ Open Graph Meta Tags và JSON-LD Schema.org đạt chuẩn Core Web Vitals[cite: 26].
