# Chạy bản Culinary Blog chia sẻ

## Cách nhanh nhất

1. Giải nén toàn bộ thư mục.
2. Cài và mở Docker Desktop.
3. Mở PowerShell tại thư mục vừa giải nén.
4. Chạy:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\start-portable.ps1
```

Script sẽ tự tạo `.env`, build container, phục hồi dữ liệu PostgreSQL và khởi
động toàn bộ hệ thống. Lần chạy đầu cần kết nối Internet để tải/build Docker
image và có thể mất vài phút.

## Địa chỉ sử dụng

- Website: http://localhost:3000
- Website qua Nginx: http://localhost
- Swagger: http://localhost:8080/swagger/index.html
- Health: http://localhost:8080/health/ready
- MinIO: http://localhost:9001
- Jaeger: http://localhost:16686
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001

## Tài khoản quản trị

- Email: `admin@culinaryblog.com`
- Tên đăng nhập: `chefdemo`
- Mật khẩu: `chefdemo`

Nên đổi mật khẩu nếu dùng ngoài phạm vi demo local.

## Dữ liệu đi kèm

Bản chia sẻ chứa snapshot PostgreSQL của bài tại thời điểm đóng gói, gồm tài
khoản, danh mục, công thức, nguyên liệu, bước nấu và các nội dung cộng đồng.
Phiên đăng nhập, mã 2FA, token đổi email, IP và log bảo mật cũ đã được loại bỏ
để bản sao có thể chạy an toàn trên máy khác.

Snapshot chỉ tự phục hồi khi Docker tạo database volume lần đầu. Nếu máy đã
từng chạy bản này và muốn phục hồi lại từ đầu, dùng:

```powershell
docker compose down -v
.\start-portable.ps1
```

Lệnh `down -v` xóa database local của bản đang chạy trên máy đó.

## Dừng chương trình

Giữ dữ liệu:

```powershell
docker compose down
```

Khởi động lại không build:

```powershell
.\start-portable.ps1 -NoBuild
```
