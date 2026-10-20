# Báo cáo đối chiếu yêu cầu

Ngày đối chiếu: 19/10/2026. Báo cáo này chỉ ghi nhận các chức năng đã có trong mã nguồn hoặc đã được kiểm thử; các hạng mục còn phụ thuộc dịch vụ bên ngoài được nêu rõ ở cuối tài liệu.

## 1. Bảng mapping chức năng

| Mã | Trạng thái | Chức năng đã thực hiện | Bằng chứng chính |
| --- | --- | --- | --- |
| FR-AUTH | Đã làm; Google cần cấu hình thật để chạy ngoài môi trường kiểm thử | Đăng ký, đăng nhập bằng email hoặc username, thông tin tài khoản, cập nhật hồ sơ, refresh-token rotation, phát hiện replay và logout/revoke token family. API chuẩn là `/api/v1/auth/*`. | `Endpoints/AuthEndpoints.cs`, `Endpoints/AuthHandlers.cs`, `Endpoints/AccountEndpoints.cs`, `AuthEndpointContractTests.cs`, `AuthControllerTests.cs` |
| FR-RCP | Đã làm | Recipe có Draft/Published/Archived, publish chỉ khi có nguyên liệu và bước hợp lệ, unpublish/archive/restore, soft delete, ownership, nutrition PATCH và tự đánh lại số bước. | `Endpoints/RecipesEndpoints.cs`, `Endpoints/RecipesHandlers.cs`, `Domain/Entities/Recipe.cs`, `RecipeLifecycleTests.cs`, `RecipeWorkflowEndpointTests.cs` |
| FR-CAT | Đã làm | Danh mục có slug, chống trùng, quyền Admin, xóa mềm; không thể xóa khi còn recipe đang hoạt động và không thể cập nhật danh mục đã xóa. | `Endpoints/CategoriesEndpoints.cs`, `Endpoints/CategoriesHandlers.cs`, `Domain/Entities/Category.cs`, `CategoryLifecycleTests.cs` |
| FR-SRCH | Đã làm | Tìm kiếm Full-Text PostgreSQL, hỗ trợ có/không dấu, lọc kết hợp, sort hợp lệ, phân trang ổn định và 422 cho tham số không hợp lệ. | `Endpoints/SearchEndpoints.cs`, `Endpoints/SearchHandlers.cs`, migration `20261019190000_ImproveRecipeSearch.cs`, `SearchContractTests.cs` |
| FR-FILE | Đã làm; MinIO thật cần Docker chạy | Upload JPEG/PNG/WebP/AVIF tối đa 5 MB, kiểm tra nội dung ảnh, thumbnail WebP 300×300, medium WebP 800×600, ảnh chính và xóa từng ảnh. | `Services/ImageUploadValidationService.cs`, `Services/ImageThumbnailService.cs`, `Endpoints/RecipesEndpoints.cs`, `ImageUploadValidationServiceTests.cs`, `ImageThumbnailServiceTests.cs` |
| FR-OBS | Đã làm; collector/dashboard thật cần Docker chạy | Health `/health`, `/health/live`, `/health/ready`; Redis/PostgreSQL/MinIO checks; Serilog, OpenTelemetry, Hangfire và Docker observability stack. | `Program.cs`, `Health/`, `otel-collector-config.yaml`, `observability/` |

Không có mô-đun FR nào đang viết dở trong mã. Những phần **chưa xác minh trực tiếp** là đăng nhập Google bằng Client ID thật, UI/MinIO/PostgreSQL/Hangfire/telemetry trên stack Docker thực tế và ảnh/video demo.

## 2. API tiêu biểu để trình bày

| Nghiệp vụ | Endpoint chuẩn |
| --- | --- |
| Đăng ký, đăng nhập, refresh, logout | `POST /api/v1/auth/register`, `/login`, `/refresh`, `/logout` |
| Người dùng hiện tại | `GET` hoặc `PATCH /api/v1/auth/me` |
| Công thức | `GET`, `POST /api/v1/recipes`; `PUT`, `PATCH`, `DELETE /api/v1/recipes/{id}` |
| Lifecycle công thức | `POST /api/v1/recipes/{id}/publish`, `/unpublish`, `/archive`, `/restore` |
| Ảnh công thức | `POST /api/v1/recipes/{id}/images`; `PUT .../images/{imageId}/primary`; `DELETE .../images/{imageId}` |
| Danh mục | `GET`, `POST /api/v1/categories`; `PUT`, `DELETE /api/v1/categories/{id}` |
| Tìm kiếm | `GET /api/v1/search/recipes` |
| Kiểm tra dịch vụ | `GET /health`, `/health/live`, `/health/ready` |

Các API trả dữ liệu theo dạng `data`; danh sách phân trang có thêm `meta`; lỗi dùng Problem Details. Route `/api/*` cũ vẫn được giữ để tương thích, còn frontend dùng `/api/v1/*`.

## 3. Kết quả kiểm thử

| Phạm vi | Kết quả |
| --- | --- |
| Backend unit và integration tests | **48/48 đạt**: auth, token replay/logout, lifecycle recipe, ownership, category soft delete, search, ảnh, CORS, authorization và rate limit. |
| Frontend contract/unit tests | **6/6 đạt**: response pagination, Problem Details, logout, response guard, recipe payload và JSON-LD. |
| Frontend production build | Compile và TypeScript đạt. Bước tạo trang tĩnh chưa hoàn tất tại máy này vì Windows trả lỗi quyền `EPERM` khi Next.js tạo thư mục artifact. |
| Docker Compose | Kiểm tra cấu hình đạt với `JWT_SECRET` giữ chỗ; CI cũng dùng giá trị giữ chỗ chỉ cho bước validate. |
| Browser tests | Đã có 4 Playwright tests trong `frontend/tests/browser`. Chưa chạy được tại máy này vì một tiến trình Next.js không phản hồi đang chiếm port 3000. |

## 4. Kịch bản demo đề xuất

1. Khởi động Docker Desktop; sao chép `.env.example` thành `.env` và thay `JWT_SECRET` bằng chuỗi riêng tối thiểu 32 ký tự.
2. Khởi động PostgreSQL, Redis và MinIO qua Docker, sau đó chạy API tại `http://localhost:5152` và frontend tại `http://localhost:3000`.
3. Mở `/health/ready`, sau đó mở Swagger tại `http://localhost:5152/swagger` để cho thấy API sẵn sàng.
4. Đăng ký một tài khoản mới, đăng nhập và mở `/recipes/new` để tạo bản nháp có nguyên liệu và bước nấu.
5. Tải một ảnh JPEG/PNG/WebP/AVIF không quá 5 MB, chọn ảnh chính, sau đó publish công thức.
6. Tìm công thức theo từ khóa và thử filter/sort/pagination. Dùng một tham số sort sai để trình bày Problem Details 422.
7. Đăng nhập Admin, tạo hoặc xóa mềm danh mục không còn recipe hoạt động; sau đó xác nhận danh mục không còn xuất hiện.
8. Logout, thử dùng refresh token cũ và cho thấy token family bị chặn.

## 5. Điều kiện trước khi quay demo/nộp

- Docker Desktop phải chạy để PostgreSQL, Redis, MinIO, Hangfire và observability stack có thể khởi động.
- Port 3000 phải được giải phóng hoặc tiến trình Next.js hiện tại phải được khởi động lại vì nó không phản hồi.
- Điền Google Client ID thật nếu trình bày Google login.
- Sau khi stack chạy, chụp ít nhất: trang login, wizard tạo/publish recipe, kết quả search, quản trị danh mục và Swagger/health. Các ảnh này là bằng chứng demo còn thiếu, không phải thiếu chức năng mã nguồn.
