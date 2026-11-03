# Kiểm tra API với dịch vụ thật

## Dựng bản nộp từ source sạch

```powershell
pwsh -File scripts/submission/verify-clean.ps1
```

Script lấy đúng **commit HEAD**, build các Dockerfile và khởi động Compose trong project/volume mới. Nó không đọc `.env` hiện có hoặc sửa dữ liệu demo đang dùng. Cần commit thay đổi muốn kiểm tra trước khi chạy. Docker vẫn có thể dùng lại cache layer; source và database của lượt kiểm tra là mới.

Website riêng: http://localhost:28080. API: http://localhost:25152. MinIO: http://localhost:29000. Kết quả và log đã che credential nằm trong thư mục `artifacts/submission-<run>/`. `.env` và `compose.private.json` trong đó là cấu hình riêng của lượt chạy, không đưa lên GitHub.

Sau khi kiểm tra, dùng đúng project được ghi trong `summary.json` để dừng stack thử bằng Docker Compose hoặc Docker Desktop. `-StopAfterVerification` dừng riêng stack thử ngay sau bước kiểm tra sạch; không dùng tùy chọn này nếu muốn chạy tiếp kiểm tra API bên dưới. Script không xóa volume.

## Kiểm tra các thao tác API

`verify-runtime.ps1` dùng PowerShell 7.2 trở lên. Chạy trên **stack kiểm tra riêng**, không trỏ vào database đang dùng để demo hoặc dữ liệu của người dùng.

```powershell
pwsh -File scripts/submission/verify-runtime.ps1 -BaseUrl http://127.0.0.1:15152
```

Nếu vừa chạy `verify-clean.ps1` với cổng mặc định, dùng `-BaseUrl http://localhost:25152`.

API phải bật PostgreSQL, Redis và MinIO thật; `/health` phải xác nhận các dịch vụ này đang hoạt động. Public URL của MinIO phải trỏ đúng cổng của stack kiểm tra. Email ngoài nên tắt. Nếu chạy nhiều lần trong một phút, chờ cửa sổ rate limit hoặc tăng giới hạn **chỉ trong stack kiểm tra**, không sửa policy của bản nộp để né kiểm tra bảo mật.

Script tạo hai tài khoản với tên duy nhất, một công thức và các ảnh riêng. Nó kiểm tra cookie HttpOnly, đăng nhập, hồ sơ/cài đặt tài khoản, avatar, quyền truy cập, công thức có 10 nguyên liệu và 5 bước, CRUD nguyên liệu/bước, upload/thumbnail, đọc lại ảnh, cập nhật, tìm kiếm PostgreSQL, danh mục, trạng thái, xóa mềm, refresh, đổi mật khẩu và đăng xuất. Chỉ dữ liệu do lượt chạy đó tạo mới bị thay đổi; tài khoản kiểm tra được giữ trong database riêng để tra cứu.

Nếu cần đọc các màn quản trị bằng API, truyền `-AdminCredential (Get-Credential)` với tài khoản Admin của stack kiểm tra. Không đặt mật khẩu trong Issue, log hoặc câu lệnh được commit.

Kết quả JSON nằm trong `artifacts/submission/runtime/`, gồm từng điều kiện đạt/chưa đạt và ID dữ liệu tạo ra; không lưu mật khẩu, token hoặc cookie. Một lỗi phụ thuộc sẽ dừng các bước sau, nên cần sửa lỗi và chạy lại trước khi ghi nghiệm thu toàn luồng.

Đây là kiểm tra HTTP với dịch vụ thật, không phải kiểm tra giao diện trình duyệt. Script không chứng minh Google OAuth, SMTP ngoài, khả năng phục hồi khi dịch vụ bị ngắt hoặc mọi chức năng mở rộng đã được nghiệm thu.
