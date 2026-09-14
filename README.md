Người làm	Khối lượng	Các chức năng và công việc chi tiết phải làm (Mã FR/NFR)
Nguyễn Đức Thành

(Backend Core & Kiến trúc)	10 Chức năng API

+ Thiết lập nền tảng	1. Thiết lập kiến trúc Backend:

• Xây dựng khung dự án .NET 10 Minimal APIs tuân thủ Clean Architecture (Domain, Application, Infrastructure, Presentation). 

• Cài đặt CQRS + MediatR Pipeline (Logging, Validation, Caching). 

2. Module Xác thực & Người dùng (FR-AUTH):

• FR-AUTH-001: API Đăng ký tài khoản mới. 

• FR-AUTH-002: API Đăng nhập bằng Email và Mật khẩu (Local Login). 

• FR-AUTH-003: API Đăng nhập bằng Google OAuth 2.0. 

• FR-AUTH-004: API Làm mới Access Token (Token Refresh). 

• FR-AUTH-005: API Đăng xuất (Thu hồi Refresh Token). 

• FR-AUTH-006: API Xem hồ sơ cá nhân. 

• FR-AUTH-007: API Cập nhật hồ sơ cá nhân. 

3. Module Quan sát Hệ thống (FR-OBS):

• FR-OBS-001: Cấu hình Health Check Endpoints (Liveness/Readiness). 

• FR-OBS-002: Thiết lập Structured Logging với Serilog. 

• FR-OBS-003: Cấu hình Distributed Tracing & Metrics (OpenTelemetry). 
Minh Long 
(Backend Feature & Data)	24 Chức năng API

+ Cấu hình Job	1. Module Quản lý Công thức (FR-RCP):

• FR-RCP-001 & 002: API Xem danh sách phân trang và xem chi tiết công thức. 

• FR-RCP-003 & 004: API Tạo mới và Cập nhật công thức nấu ăn. 

• FR-RCP-005 & 006: API Xuất bản / Hủy xuất bản và Lưu trữ công thức. 

• FR-RCP-007: API Xóa vĩnh viễn công thức. 

• FR-RCP-008: API Quản lý ảnh (Upload, Set Primary, Delete). 

• FR-RCP-009 & 010: API CRUD Quản lý nguyên liệu và Các bước thực hiện. 

2. Module Danh mục (FR-CAT):

• FR-CAT-001 đến 005: API Xem danh sách, Chi tiết, Tạo, Cập nhật và Xóa danh mục. 

3. Module Tìm kiếm (FR-SRCH):

• FR-SRCH-001 đến 004: Xử lý Full-Text Search PostgreSQL, Lọc, Sắp xếp và Phân trang. 

4. Module File & Background Jobs (FR-FILE, FR-JOB):

• FR-FILE-001 & 002: Upload và Xóa file trên MinIO. 

• FR-JOB-001 đến 003: Cấu hình Hangfire cho Welcome Email, Image Resize và Generate Sitemap. 



Oven





(Frontend Public & Client)	7 Màn hình UI

+ Tối ưu SEO	1. Phát triển các màn hình Public (Next.js):

• Route /: Xây dựng Trang chủ hiển thị recipe nổi bật và categories (ISR). 

• Route /recipes & /recipes/[slug]: Trang danh sách tất cả recipe và trang chi tiết công thức. 

• Route /categories & /categories/[slug]: Trang danh sách danh mục và danh sách recipe theo danh mục. 

2. Giao diện Xác thực (Auth UI):

• Route /auth/login: Form đăng nhập (Email/Password và nút Google OAuth). 

• Route /auth/register: Form đăng ký tài khoản mới. 

3. Đảm bảo Yêu cầu Phi chức năng (NFR):

• NFR-SEO-001 & 002: Tích hợp Structured Data JSON-LD Schema.org Recipe, Meta Tags và Open Graph. 

• NFR-PERF-005: Tối ưu Core Web Vitals (LCP, CLS, INP) và Image Optimization. 




Kina Niê



(Frontend Dashboard)	7 Màn hình UI

+ Xử lý Form	1. Phát triển khu vực nội bộ (Author/Admin Workspace):

• Route /dashboard: Trang tổng quan của tác giả và admin. 

• Route /dashboard/recipes: Giao diện bảng quản lý danh sách công thức cá nhân. 

• Route /dashboard/recipes/new: Form đa bước (wizard) để tạo công thức mới, upload ảnh. 

• Route /dashboard/recipes/[id]/edit: Form chỉnh sửa thông tin công thức hiện có. 

• Route /dashboard/categories: Bảng quản lý danh mục dành riêng cho Admin. 

• Route /profile: Giao diện xem và chỉnh sửa thông tin cá nhân. 

2. Giao diện Phụ & Trải nghiệm (UX):

• Route /search: Xây dựng trang hiển thị kết quả full-text search. 

• NFR-USE-003 & 004: Xử lý hiển thị form validation nội tuyến, parse lỗi RFC 7807 từ server, cài đặt Toast notification và trạng thái Loading skeleton. 
