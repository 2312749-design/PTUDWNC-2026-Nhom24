# Kiểm tra bản nộp cuối kỳ

Các kiểm tra trong thư mục này dùng **source đã commit** và một Docker project mới, có database, Redis và MinIO riêng. Chúng không xóa volume hoặc thay đổi database đang được dùng để học/demo.

- [Checklist review và nghiệm thu](REVIEW-CHECKLIST.md): người phụ trách, tiêu chí, bằng chứng và trình tự tích hợp.
- [Kết quả chốt bản nộp](FINAL-CHECK.md): kết quả thực tế, phiên bản được kiểm tra và các giới hạn.
- [Workflow kiểm tra bản nộp](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/actions/workflows/submission-check.yml).
- [Cấu hình workflow](../../.github/workflows/submission-check.yml).

## Chạy trên GitHub

Workflow **Final submission verification** chạy khi PR về `main` thay đổi các phần có ảnh hưởng tới bản Docker, API, phiên đăng nhập hoặc bộ kiểm tra. PR chỉ sửa tài liệu không kích hoạt đợt build Docker này. Workflow CI/CD thông thường vẫn thực hiện phần kiểm tra riêng của nó.

Sau khi file workflow có trên nhánh mặc định, có thể chạy lại thủ công:

1. Mở **Actions → Final submission verification → Run workflow**.
2. Chọn đúng nhánh/phiên bản cần nghiệm thu rồi chạy.
3. Xem từng bước build, migration/seed, restart, API với dịch vụ thật và Chromium với API thật.
4. Tải artifact `submission-verification-<run_id>` để lấy summary, kết quả API/browser và ảnh giao diện. Ghi link run và commit vào Issue/PR tương ứng.

Mỗi run có timeout 45 phút và không tự merge PR, đóng Issue hoặc ghi review. Một run đạt chỉ chứng minh các kiểm tra được liệt kê đã đạt trên phiên bản đó; phải giữ nguyên các giới hạn ghi trong báo cáo.

Workflow sử dụng tài khoản demo được seed trong stack mới để kiểm tra thao tác Admin. Đây không phải credential của môi trường thật. Google Login và gửi email ngoài hệ thống bị tắt ở stack kiểm thử.

## Chạy trên máy cá nhân

Cần PowerShell 7.2 trở lên, Git, Docker Desktop/Compose và Node.js 22. Commit các thay đổi cần kiểm tra trước khi chạy vì `verify-clean.ps1` xuất `git HEAD`, không lấy thay đổi chưa commit hoặc `.env` của máy.

Trong PowerShell 7, từ thư mục gốc repository:

```powershell
./scripts/submission/verify-clean.ps1
```

Script build tuần tự từ Dockerfile đã commit, khởi tạo database trống, kiểm tra số dữ liệu seed và việc khởi động lại không tạo bản ghi trùng. Các cổng mặc định của stack riêng:

| Dịch vụ | Cổng localhost |
|---|---|
| Website qua Nginx | 28080 |
| API | 25152 |
| PostgreSQL | 25432 |
| Redis | 26379 |
| MinIO API / Console | 29000 / 29001 |

Khi stack đã đạt và vẫn đang chạy, thực hiện kiểm tra API:

```powershell
$password = ConvertTo-SecureString 'chefdemo' -AsPlainText -Force
$admin = [PSCredential]::new('chefdemo', $password)
./scripts/submission/verify-runtime.ps1 -BaseUrl 'http://localhost:25152' -AdminCredential $admin
```

Để kiểm tra trình duyệt với dữ liệu thật, cài thư viện/browser trên máy rồi chạy:

```powershell
Push-Location frontend
npm ci
npx playwright install chromium
Pop-Location
node scripts/submission/verify-browser.mjs --base-url http://localhost:28080
```

Các script in đường dẫn kết quả trong `artifacts/`. Không đăng toàn bộ thư mục run lên GitHub: `.env` và `compose.private.json` chứa credential chỉ dành cho stack thử. Workflow chỉ tải lên các file kết quả đã chọn và ảnh giao diện.

Script không tự xóa tài nguyên. `verify-clean.ps1 -StopAfterVerification` dừng riêng stack vừa tạo sau khi kiểm tra clean-start; không dùng tùy chọn đó nếu còn cần chạy kiểm tra API/browser tiếp theo. Khi chạy lại clean-start, dùng project/output mới và bảo đảm các cổng thử không còn bị stack trước chiếm.

## Phạm vi và giới hạn

- Clean-start kiểm tra Docker build, khởi động các service, HTTP, migration/seed và restart không nhân đôi dữ liệu.
- Runtime kiểm tra các thao tác API được liệt kê trong JSON, dùng PostgreSQL/Redis/MinIO thật. Nó chỉ tạo và thay đổi dữ liệu kiểm thử trong stack riêng.
- Browser kiểm tra các thao tác UI được liệt kê trong JSON, không chặn hoặc giả lập API.
- Các kết quả không thay thế kiểm thử mọi tính năng mở rộng, Google OAuth thật, thư đến hộp thư thật, khả năng chịu lỗi khi dịch vụ bị ngắt hoặc triển khai production.
- Review và xác nhận bàn giao phải do thành viên thực sự thực hiện. CI đạt không phải là một bản Approve của đồng đội.
