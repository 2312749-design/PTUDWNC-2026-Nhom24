1. Bảng Phân Công Tóm Tắt (Theo Cụm Tính Năng)
Thành viên	Trọng tâm công việc (Nhìn vào hiểu ngay)	Chi tiết (Gắn gọn)

Nguyễn Đức Thành	Nền tảng Backend & Đăng nhập	Khởi tạo Clean Architecture, CRUD Công thức cốt lõi, JWT/Google OAuth. 
Minh Long	Dữ liệu phụ & Tìm kiếm (Search)	API Nguyên liệu/Bước làm, PostgreSQL Full-Text Search, UI Trang tìm kiếm. 
Oven	Nhập liệu & Chạy ngầm (Jobs)	Làm Form UI tạo công thức đa bước, cấu hình Hangfire Jobs (gửi mail). 
Kina Niê	Hiển thị & File Upload (MinIO)	UI chi tiết công thức, API lưu ảnh lên MinIO, cấu hình SEO JSON-LD
. 
3. Phân Tích Chuyên Sâu: Cách Làm & Điểm Tối Ưu
Việc chia nhiệm vụ theo cụm tính năng (Vertical Slicing) như trên đòi hỏi mỗi người phải nắm cả một luồng dữ liệu. Dưới đây là cách thức triển khai cụ thể cho từng người:
Nguyễn Đức Thành: Nền tảng Backend & Đăng nhập (Khó - Đòi hỏi tư duy hệ thống)

Chi tiết nhiệm vụ: Chịu trách nhiệm thiết lập bộ khung .NET 10 Minimal APIs, cấu trúc Clean Architecture và luồng xác thực (FR-AUTH). Đồng thời viết các API cốt lõi nhất như Tạo/Sửa/Xóa công thức (FR-RCP-003, 004, 007). 


Cách thức triển khai:

o
Bắt đầu bằng việc dựng cấu trúc thư mục (Domain, Application, Infrastructure, Presentation). 
o
o
Cài đặt CQRS + MediatR Pipeline để quản lý luồng dữ liệu. 
o
o
Sử dụng ASP.NET Core Identity và cấu hình JWT Token (Access Token 15 phút, Refresh Token 7 ngày). 
o


Minh Long: Dữ liệu phụ & Tìm kiếm (Vừa - Trọng tâm xử lý Logic truy vấn)

Chi tiết nhiệm vụ: Đảm nhận các mảnh ghép dữ liệu của công thức (API Thêm/Sửa/Xóa Nguyên liệu và Bước làm). Trọng tâm là xử lý logic tìm kiếm Full-Text Search tiếng Việt (FR-SRCH-001). 


Cách thức triển khai:

o
Backend: Viết các API CRUD cho RecipeIngredient và RecipeStep. Tận dụng tsvector và tsquery kết hợp extension unaccent trong PostgreSQL để làm tính năng tìm kiếm bỏ dấu. 
o
o
Frontend: Dựng giao diện /search để hứng kết quả tìm kiếm và phân trang. 
o


Oven: Nhập liệu & Chạy ngầm (Khó - Trọng tâm xử lý Bất đồng bộ & Validation)

Chi tiết nhiệm vụ: Làm giao diện quan trọng nhất của hệ thống: Form tạo công thức (Route /dashboard/recipes/new). Ở backend, phụ trách tích hợp hệ thống chạy ngầm Hangfire và Health Check (FR-JOB, FR-OBS). 


Cách thức triển khai:

o
Frontend: Sử dụng React Hook Form kết hợp Zod để xử lý form đa bước (wizard), đảm bảo validate dữ liệu nội tuyến trước khi gửi xuống API. Bắt các mã lỗi RFC 7807 từ server để hiển thị thông báo Toast. 
o
o
Backend: Cài đặt Hangfire chạy in-process, viết các hàm gửi email chào mừng bất đồng bộ (fire-and-forget) và tự động tạo sitemap. 
o


Kina Niê: Hiển thị & File Upload (Vừa - Trọng tâm Trải nghiệm & Tối ưu hóa)

Chi tiết nhiệm vụ: Chịu trách nhiệm hiển thị trang chi tiết công thức (/recipes/[slug]) ra ngoài cho người xem. Đảm nhận module upload ảnh lên server (FR-FILE, FR-RCP-008) và SEO. 


Cách thức triển khai:

o
Backend: Tích hợp MinIO SDK để nhận file multipart/form-data, validate kích thước (5MB) và định dạng (JPEG/PNG/WebP), sau đó lưu trữ và trả về URL ảnh. 
o
o
Frontend: Lấy dữ liệu API từ Long và Thành để render ra trang chi tiết. Cấu hình thẻ meta Open Graph và JSON-LD Schema.org để tối ưu Core Web Vitals (NFR-SEO). 
o


