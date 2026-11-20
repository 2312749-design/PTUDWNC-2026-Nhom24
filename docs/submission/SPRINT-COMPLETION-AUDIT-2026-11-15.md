# Báo cáo hoàn thiện nhiệm vụ Sprint 1–4

Ngày kiểm tra: 15/11/2026  
Phạm vi: toàn bộ working tree hiện tại, bao gồm các thay đổi chưa commit.

## Kết quả đã xác nhận

| Hạng mục | Kết quả | Bằng chứng |
|---|---:|---|
| Backend Release build | Đạt | Backend và project test biên dịch thành công với .NET 10. |
| Backend automated tests | Đạt | 102/102 test đạt, 0 thất bại, thời gian 1 phút 6 giây. |
| Frontend unit/contract tests | Đạt | 20/20 test đạt, 0 thất bại. |
| Frontend lint | Đạt | `oxlint` kết thúc không cảnh báo. |
| Frontend production build | Đạt | Next.js biên dịch, kiểm tra TypeScript và tạo tĩnh đủ 48/48 trang. |
| Docker engine | Đạt | Docker Server 29.8.0 phản hồi. |
| Snapshot kiểm tra cách ly | Đạt | Snapshot chứa toàn bộ working tree hiện tại được tạo thành công. |
| Docker Compose cách ly | Đạt | Tên container/volume riêng, chỉ bind source read-only và chỉ mở cổng localhost. |
| Full Docker runtime | Chưa xác nhận | Docker Desktop lỗi ghi image nội bộ (`input/output error`) trong lúc tải .NET image. |

## Đánh giá theo thành viên

### Nguyễn Đức Thành

- TH-01, TH-02, TH-03, TH-04, TH-06, TH-07, TH-08: đã có triển khai và bằng chứng tự động phù hợp.
- TH-05: đã có Google ID-token verification và liên kết/tạo user; còn cần Google Web Client ID thật để nghiệm thu bên ngoài.
- TH-09: seed và các nhóm security test đã có; bộ test backend hiện tại đạt 102/102.

### Nguyễn Minh Long

- ML-01 đến ML-07: đã có triển khai trong model, API, PostgreSQL search, giao diện tìm kiếm, lifecycle và Redis cache.
- ML-08: các nhóm test Recipe/Search/Cache đã có và nằm trong bộ 102/102 test đạt.

### Oven

- OV-01 đến OV-04, OV-06, OV-07: đã có triển khai và kiểm tra tự động liên quan.
- OV-05: WelcomeEmailJob, enqueue, retry và logging đã có; cần chạy MailHog sau khi Docker Desktop hoạt động lại, hoặc SMTP thật do chủ dự án cung cấp.
- OV-08: component chung, auth store và protected route đã có; frontend tests/build đạt. Luồng browser end-to-end cần chạy lại trên full Docker runtime.

### Kina Niê

- KN-02 đến KN-06: upload an toàn, phân quyền, dọn file, recipe detail, SEO và thumbnail WebP đã có; các test ảnh liên quan nằm trong bộ backend test đạt.
- KN-01, KN-07: code MinIO/SEO đã có; cần full Docker runtime để xác nhận MinIO thật và ảnh qua `next/image`.
- KN-08: health check, Serilog, Correlation ID, OpenTelemetry, Docker/Nginx và GitHub Actions đã có. Docker runtime chưa hoàn tất vì lỗi storage của Docker Desktop, không phải lỗi biên dịch source.

## Việc chưa thể tự hoàn tất trong source code

1. Khởi động lại hoặc sửa Docker Desktop để hết lỗi storage `input/output error`, sau đó chạy lại:

   ```powershell
   pwsh -File scripts/submission/verify-clean.ps1 -UseWorkingTree
   pwsh -File scripts/submission/verify-runtime.ps1 -BaseUrl http://localhost:25152
   ```

2. Google OAuth cần một Google Web Client ID thật. Không commit Client ID/secret cá nhân vào source.
3. Gửi email ra hộp thư thật cần SMTP credential/app password. Có thể nghiệm thu chức năng trước bằng MailHog sau khi Docker hoạt động lại.
4. Không được tự nhận công việc thay thành viên. Các thay đổi chưa commit cần được nhóm xác nhận người phụ trách trước khi chia commit/PR.

## Kết luận

Toàn bộ 33 mã nhiệm vụ đều có dấu vết triển khai. Các bộ kiểm tra source hiện có đều đạt. Những phần chưa chốt không còn là thiếu code cốt lõi mà là kiểm tra tích hợp dịch vụ thật và hồ sơ Git/PR theo đúng danh tính thành viên.
