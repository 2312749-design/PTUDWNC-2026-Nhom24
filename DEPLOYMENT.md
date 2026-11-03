# Cấu hình vận hành và triển khai

Tài liệu này tách các giá trị bí mật và hạ tầng thật ra khỏi mã nguồn. Không
commit `.env`, chứng chỉ TLS, mật khẩu SMTP hoặc token quan sát.

## 1. Chạy Docker ở máy cá nhân

1. Sao chép `.env.example` thành `.env`.
2. Thay tất cả giá trị bắt đầu bằng `change-me-` bằng giá trị riêng. Tối thiểu
   phải có `POSTGRES_PASSWORD`, `MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD`,
   `GRAFANA_ADMIN_PASSWORD` và `JWT_SECRET` dài từ 32 ký tự.
3. Kiểm tra trước khi khởi động:

   ```powershell
   docker compose config
   ```

4. Khởi động stack:

   ```powershell
   docker compose up -d --build
   ```

Website Docker dùng `http://localhost`; API công khai qua Nginx là
`http://localhost/api/v1`. Các cổng PostgreSQL, Redis, MinIO, Jaeger,
Prometheus, Grafana và API trực tiếp chỉ bind vào `127.0.0.1` trong cấu hình
local. Docker build không nhận file `.env` vì file đó đã được loại khỏi build
context.

MinIO không còn cung cấp image Docker Hub công khai. Compose build image từ mã
nguồn release chính thức đã ghim bằng `MINIO_RELEASE`; chỉ đổi release sau khi
thử ở môi trường local. Không dùng `latest` hoặc image bên thứ ba cho bản
demo/nộp bài cần tái lập.

Refresh token của trình duyệt được giữ bằng cookie `HttpOnly`; nó không còn
được ghi vào `localStorage`. Giữ `AUTH_COOKIES_SECURE=false` khi chạy HTTP ở
localhost. Sau khi đã chạy qua HTTPS thật, đặt `AUTH_COOKIES_SECURE=true` và
giữ `AUTH_COOKIE_SAME_SITE=Lax` trừ khi kiến trúc triển khai của bạn đòi hỏi
một chính sách cookie khác.

## 2. Google OAuth

Code xác minh Google ID token đã sẵn sàng. Để bật đăng nhập Google thật, chủ
dự án phải tự tạo một **OAuth 2.0 Client ID loại Web application** trong Google
Cloud Console, sau đó cung cấp cùng một giá trị cho:

```text
GOOGLE_CLIENT_ID=<client-id>.apps.googleusercontent.com
Google__ClientId=<cùng giá trị ở backend>
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<cùng giá trị ở frontend build>
```

Trong Google Cloud Console, thêm các Authorized JavaScript origins tương ứng:

```text
http://localhost:3000        # chạy frontend trực tiếp
http://localhost             # chạy qua Docker Nginx
https://ten-mien-that-cua-ban # khi triển khai HTTPS
```

Sau khi đổi một biến `NEXT_PUBLIC_*`, bắt buộc build lại frontend image. Client
ID không phải mật khẩu, nhưng vẫn chỉ nên cấp cho đúng origin đã đăng ký.

## 3. Email SMTP

Welcome email đã được gửi qua Hangfire và SMTP sender. Để gửi email thật, điền
vào `.env`:

```text
SMTP_ENABLED=true
SMTP_HOST=smtp.nha-cung-cap-cua-ban.example
SMTP_PORT=587
SMTP_ENABLE_SSL=true
SMTP_USERNAME=<tai-khoan-smtp>
SMTP_PASSWORD=<app-password-hoac-api-smtp-password>
SMTP_FROM_ADDRESS=no-reply@ten-mien-cua-ban.example
SMTP_FROM_NAME=Bep Nha
```

Không dùng mật khẩu đăng nhập email cá nhân thông thường. Nếu nhà cung cấp yêu
cầu xác thực hai lớp, tạo app password hoặc SMTP credential riêng. Khi thiếu
host hoặc FromAddress, API sẽ báo lỗi cấu hình thay vì âm thầm nói rằng email
đã gửi.

## 4. OpenTelemetry

Docker local gửi trace và metric đến `otel-collector` mặc định, rồi hiển thị ở
Jaeger/Grafana. Không cần token cho stack local.

Để dùng collector bên ngoài, thay trong `.env`:

```text
OTLP_ENDPOINT=https://collector.example/v1/otlp
OTLP_HEADERS=Authorization=Bearer%20<token-cua-nha-cung-cap>
```

`OTLP_HEADERS` là chuỗi headers theo định dạng OpenTelemetry, phân cách bằng
dấu phẩy. Chỉ đặt token trong `.env` hoặc secret manager của môi trường triển
khai; không đưa token vào `appsettings.json` hay GitHub repository.

## 5. HTTPS và domain thật

HTTPS không thể hoàn tất chỉ bằng mã nguồn vì cần hai giá trị thuộc quyền chủ
dự án: **domain đã trỏ DNS** và **certificate/key hợp lệ**. Khi đã có chúng:

1. Đặt `PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL` và `CORS_ALLOWED_ORIGIN` là
   `https://ten-mien-that-cua-ban`.
   Đồng thời đặt `AUTH_COOKIES_SECURE=true` để refresh token chỉ đi qua HTTPS.
2. Đặt `MINIO_PUBLIC_BASE_URL` thành URL công khai HTTPS của object storage,
   nếu browser cần tải trực tiếp từ MinIO.
3. Lấy certificate từ CA (ví dụ Let's Encrypt) cho domain đó.
4. Sao chép `nginx/nginx.https.conf.example` ra vị trí cấu hình triển khai,
   thay `REPLACE_WITH_DOMAIN`, rồi mount certificate vào
   `/etc/letsencrypt` ở chế độ chỉ đọc.
5. Chỉ công khai Nginx ở cổng 80/443. Giữ API, PostgreSQL, Redis, MinIO,
   Grafana và công cụ observability trong private network.

Template HTTPS có redirect HTTP → HTTPS, HSTS, TLS 1.2/1.3, header bảo vệ cơ
bản và vẫn chuyển tiếp `/api`, `/uploads`, `/health`, `/swagger`, `/hangfire`
đến backend. `ReverseProxy__TrustForwardedHeaders=true` đã được Compose bật
cho Nginx bridge network, vì vậy backend nhận đúng HTTPS scheme.

## 6. Migration và dữ liệu demo

Máy local dùng:

```text
APPLY_MIGRATIONS_ON_STARTUP=true
SEED_DEMO_DATA_ON_STARTUP=true
```

Điều này giúp một checkout mới có dữ liệu demo ngay. Với môi trường có nhiều
API instance, chạy migration/seed một lần trong deployment pipeline, sau đó đặt
cả hai biến bằng `false` trước khi scale application.

## 7. Danh sách giá trị chỉ chủ dự án có thể cung cấp

| Giá trị cần có | Lý do không thể tự tạo trong code |
| --- | --- |
| Google OAuth Web Client ID và cấu hình consent screen | Gắn với Google Cloud project do chủ dự án sở hữu. |
| SMTP host, app password/API credential, địa chỉ From đã được xác minh | Thuộc email provider/domain của chủ dự án. |
| Domain, DNS record, TLS certificate/private key | Cần quyền quản lý DNS và xác minh domain. |
| Secret production cho database, JWT, MinIO, Grafana | Không được lưu vào source code hay Git. |
| Endpoint/token OTLP cloud (nếu không dùng collector nội bộ) | Thuộc nhà cung cấp observability. |
| Docker Engine đang chạy | Cần Docker Desktop/daemon trên máy để kiểm tra full stack runtime. |

Sau khi những giá trị này được cung cấp, dùng `docker compose config` rồi
`docker compose up -d --build`; kiểm tra `http://localhost/health/ready`, đăng
nhập, upload ảnh, xem Jaeger và Grafana để xác nhận stack thực tế.
