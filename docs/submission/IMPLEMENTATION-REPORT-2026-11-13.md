# Báo cáo hoàn thiện giao diện và kiểm tra SRS/Lab 2–8

Ngày kiểm tra: 13/11/2026

## Kết quả triển khai

- Chuyển trang chủ sang Server Component và ISR 1 giờ; dữ liệu danh mục và công thức mới được tải tại máy chủ.
- Chuyển trang danh mục sang Server Component và ISR 1 giờ.
- Trang danh sách/tìm kiếm công thức render động phía máy chủ theo query string.
- Đưa Công thức, Danh mục và Tìm kiếm ra thanh điều hướng chính.
- Điều hướng theo vai trò: Author có Dashboard/Tạo công thức; Admin có Quản trị/Quản lý danh mục.
- Thêm ô tìm kiếm lớn và bốn lối tắt chức năng Lab 7–8 trên trang chủ.
- Đưa tính năng cộng đồng/cosmic/nhạc vào khu trải nghiệm mở rộng; mặc định SRS không hiển thị hiệu ứng phụ.
- Bổ sung thống kê Draft/Published/Archived và danh sách công thức gần đây trên dashboard.
- Làm nổi bật quản lý người dùng, danh mục và nhật ký trong khu Admin.
- Chuẩn hóa các liên kết cốt lõi sang `/auth/login`, `/auth/register`, `/dashboard` và `/dashboard/recipes/new`.
- Sửa màu chữ nhỏ để đạt tương phản WCAG AA.

## Bằng chứng kiểm tra

- Backend: 102/102 test đạt.
- Frontend: 20/20 unit test đạt.
- Lint: đạt, không có warning.
- TypeScript: đạt.
- Next.js production build: đạt, 48 route.
- Accessibility: 4/4 trang `/`, `/recipes`, `/categories`, `/auth/login` không có lỗi serious/critical WCAG A/AA.
- Rendering: `/` và `/categories` dùng ISR; `/recipes` và `/search` dùng server rendering động; chi tiết recipe/category có static generation/revalidation.

## Đối chiếu Lab

- Lab 2: Clean Architecture, EF configuration, DbContext, migrations và seed code đã có. Script `tests/submission/verify-seed.sql` kiểm tra tối thiểu 20 category, 100 recipe, 10 nguyên liệu và 5 bước.
- Lab 3: domain exceptions, repository/unit of work, API endpoints và Problem Details middleware đã có.
- Lab 4: nhóm endpoint auth, category, recipe, search, ingredient, step, image và admin đã có.
- Lab 5: CORS, rate limiting, JWT, authorization, API versioning, OpenAPI và cấu trúc Next.js đã có.
- Lab 6: API utility, error state, Zustand, React Query, UI library, layout và component dùng chung đã có.
- Lab 7: auth, profile, home, recipe detail, search và categories đã có và được đưa lên điều hướng chính.
- Lab 8: upload ảnh, recipe lifecycle, user/category administration và system/audit logging đã có.

## Phần cần môi trường thật để xác nhận

Các mục dưới đây không thể tự tạo bằng mã nguồn hoặc test giả lập; cần bí mật/máy chủ tương ứng:

- Truy vấn seed trên PostgreSQL đang chạy.
- Google OAuth với Client ID thật.
- SMTP/MailHog và email quên mật khẩu.
- MinIO/object storage thật cho upload ảnh.
- Redis cache hit trong phiên chạy thật.
- K6 load test trên stack đang chạy.
- HTTPS/domain production, lịch backup và kiểm tra restore.

Docker Compose chưa thể khởi động trong lần kiểm tra này vì môi trường chưa đặt `POSTGRES_PASSWORD`, `MINIO_ROOT_USER` và `MINIO_ROOT_PASSWORD`. Không ghi giá trị bí mật mặc định vào repository. Sau khi cấu hình `.env`, chạy các script trong `scripts/submission` để tạo bằng chứng runtime.

## Kết luận

Các chức năng bắt buộc hiện nằm ở vị trí dễ nhìn và có luồng trình bày rõ cho Guest, Author và Admin. Mã nguồn build được, test backend/frontend đạt và bốn trang cốt lõi đạt kiểm tra accessibility. Bài đủ mạnh để báo cáo phần chức năng; trước ngày bảo vệ cần khởi động stack thật và lưu bằng chứng seed, email, upload, cache và kiểm thử tải.
