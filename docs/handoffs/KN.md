# Bàn giao Media SEO và DevOps

Người phụ trách theo README: **Kina Niê** ([2312711-kina](https://github.com/2312711-kina)). Ngày bổ sung hồ sơ: 28/10/2026.

Tài liệu này phục vụ review phần đã có và lập kế hoạch hoàn thiện. Lịch sử tác giả của mã nguồn được giữ trong Git. Mỗi Issue có checklist để người phụ trách xác nhận trước khi đóng.

## KN-01 Tích hợp MinIO Object Storage

[Issue #26](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/26)

### Đối chiếu yêu cầu

- [x] Có cấu hình MinIO bằng appsettings/env
- [x] IFileStorageService và triển khai MinIO upload/delete
- [x] Cấu hình triển khai lấy key/password qua biến môi trường
- [ ] MinIO đang được bật trong cấu hình local mặc định

### Minh chứng và cách kiểm tra

- Mã nguồn: [src/CulinaryBlog.API/Program.cs](../../src/CulinaryBlog.API/Program.cs).
- Mã nguồn: [src/CulinaryBlog.Infrastructure/Services/MinioClientFactory.cs](../../src/CulinaryBlog.Infrastructure/Services/MinioClientFactory.cs).
- Mã nguồn: [src/CulinaryBlog.API/appsettings.json](../../src/CulinaryBlog.API/appsettings.json).
- Mã nguồn: [docker-compose.yml](../../docker-compose.yml).
- Mã nguồn: [src/CulinaryBlog.Application/Interfaces/IFileStorageService.cs](../../src/CulinaryBlog.Application/Interfaces/IFileStorageService.cs).
- Mã nguồn: [src/CulinaryBlog.Infrastructure/Services/MinioFileStorageService.cs](../../src/CulinaryBlog.Infrastructure/Services/MinioFileStorageService.cs).
- Mã nguồn: [src/CulinaryBlog.Infrastructure/Services/LocalFileStorageService.cs](../../src/CulinaryBlog.Infrastructure/Services/LocalFileStorageService.cs).
- Mã nguồn: [.gitignore](../../.gitignore).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- Local appsettings Minio:Enabled=false; Compose bật true. Không được suy ra local đang dùng MinIO khi chỉ nhìn có client.
- Config có demo minioadmin, không phải credential production; audit này không rà toàn bộ lịch sử Git để bảo đảm chưa từng lộ secret.
- Cần kiểm thử upload/delete trên MinIO runtime thật; không gọi dịch vụ trong đợt audit này.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## KN-02 API Upload Ảnh An Toàn

[Issue #27](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/27)

### Đối chiếu yêu cầu

- [x] POST /api/v1/recipes/{id}/images nhận multipart/form-data
- [x] Giới hạn 5 MB và xác minh định dạng bằng nội dung thực
- [x] Chỉ chấp nhận JPEG/PNG/WebP/AVIF, xác định MIME thực
- [x] Kiểm tra quyền chủ sở hữu Recipe hoặc Admin

### Minh chứng và cách kiểm tra

- Mã nguồn: [src/CulinaryBlog.API/Endpoints/RecipesEndpoints.cs](../../src/CulinaryBlog.API/Endpoints/RecipesEndpoints.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/RecipesHandlers.cs](../../src/CulinaryBlog.API/Endpoints/RecipesHandlers.cs).
- Mã nguồn: [src/CulinaryBlog.Infrastructure/Services/ImageUploadValidationService.cs](../../src/CulinaryBlog.Infrastructure/Services/ImageUploadValidationService.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/ImageUploadValidationServiceTests.cs](../../tests/CulinaryBlog.API.Tests/ImageUploadValidationServiceTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/RecipeImageHandlersTests.cs](../../tests/CulinaryBlog.API.Tests/RecipeImageHandlersTests.cs).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- Validator cố ý dùng định dạng giải mã thực thay vì tin MIME client; file khai MIME sai nhưng nội dung ảnh hợp lệ được nhận an toàn.
- Có test AVIF thật và nội dung giả ảnh; audit này không chạy lại test hoặc gửi upload runtime.
- Rule thực tế là authenticated owner/Admin; không có yêu cầu role Author riêng tại upload route.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## KN-03 Xóa Ảnh & Dọn File

[Issue #28](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/28)

### Đối chiếu yêu cầu

- [x] Xóa ảnh riêng lẻ khỏi storage và cập nhật ảnh chính
- [ ] Chỉ xóa file sau khi đảm bảo không còn tham chiếu ở nơi khác
- [x] Hangfire dọn orphan files
- [x] Soft delete Recipe không xóa ảnh để còn restore

### Minh chứng và cách kiểm tra

- Mã nguồn: [src/CulinaryBlog.API/Endpoints/RecipesHandlers.cs](../../src/CulinaryBlog.API/Endpoints/RecipesHandlers.cs).
- Mã nguồn: [src/CulinaryBlog.Infrastructure/Services/MinioFileStorageService.cs](../../src/CulinaryBlog.Infrastructure/Services/MinioFileStorageService.cs).
- Mã nguồn: [src/CulinaryBlog.Infrastructure/Jobs/StorageMaintenanceJob.cs](../../src/CulinaryBlog.Infrastructure/Jobs/StorageMaintenanceJob.cs).
- Mã nguồn: [src/CulinaryBlog.API/Program.cs](../../src/CulinaryBlog.API/Program.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/RecipeImageHandlersTests.cs](../../tests/CulinaryBlog.API.Tests/RecipeImageHandlersTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/StorageMaintenanceJobTests.cs](../../tests/CulinaryBlog.API.Tests/StorageMaintenanceJobTests.cs).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- Endpoint DeleteRecipeImage xóa ba URL của ảnh trực tiếp sau khi xóa record, chưa truy vấn kiểm tra URL/key có được Recipe/Step/nội dung khác tham chiếu hay không.
- StorageMaintenanceJob có tập tham chiếu đầy đủ và giữ ảnh của Recipe soft-delete; điều này không sửa được nhánh xóa trực tiếp nêu trên.
- Chưa xác minh retry/race giữa thumbnail job đang chạy và thao tác xóa ảnh.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## KN-04 UI Trang Chi Tiết Recipe

[Issue #29](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/29)

### Đối chiếu yêu cầu

- [x] Có route /recipes/[id], đọc ID hoặc slug
- [ ] Hiển thị ảnh món chính trên trang chi tiết
- [x] Hiển thị tác giả, Category, Ingredient, Step, thời gian, khẩu phần, dinh dưỡng
- [x] Người xem công khai chỉ đọc Recipe Published chưa xóa

### Minh chứng và cách kiểm tra

- Mã nguồn: [frontend/app/recipes/[id]/page.jsx](../../frontend/app/recipes/[id]/page.jsx).
- Mã nguồn: [frontend/src/RecipePages.jsx](../../frontend/src/RecipePages.jsx).
- Mã nguồn: [frontend/src/RecipeProPanel.jsx](../../frontend/src/RecipeProPanel.jsx).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/RecipesHandlers.cs](../../src/CulinaryBlog.API/Endpoints/RecipesHandlers.cs).
- Mã nguồn: [frontend/app/content-data.js](../../frontend/app/content-data.js).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/RecipeWorkflowEndpointTests.cs](../../tests/CulinaryBlog.API.Tests/RecipeWorkflowEndpointTests.cs).
- Kiểm thử hiện có: [frontend/tests/browser/cosmic-vip.spec.js](../../frontend/tests/browser/cosmic-vip.spec.js).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- RecipeDetailPage hiện không có phần render ảnh chính/gallery của recipe; RecipeProPanel không render ảnh món chính để bù phần này.
- Tác giả ở meta đang hiện authorId thay vì tên/avatar/link hồ sơ; có dữ liệu nhưng UX chưa đúng kỳ vọng trang chi tiết chuyên nghiệp.
- Author/Admin có thể xem món riêng tư theo phân quyền; Published-only áp dụng khách công khai.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## KN-05 SEO & Tối Ưu Hình Ảnh

[Issue #30](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/30)

### Đối chiếu yêu cầu

- [ ] Dùng next/image và cấu hình remote image
- [x] Có Open Graph metadata cơ bản
- [x] Recipe Published có Schema.org JSON-LD @type Recipe

### Minh chứng và cách kiểm tra

- Mã nguồn: [frontend/src/RecipePages.jsx](../../frontend/src/RecipePages.jsx).
- Mã nguồn: [frontend/src/HomePage.jsx](../../frontend/src/HomePage.jsx).
- Mã nguồn: [frontend/next.config.mjs](../../frontend/next.config.mjs).
- Mã nguồn: [frontend/app/layout.jsx](../../frontend/app/layout.jsx).
- Mã nguồn: [frontend/app/recipes/[id]/page.jsx](../../frontend/app/recipes/[id]/page.jsx).
- Mã nguồn: [frontend/src/structured-data.js](../../frontend/src/structured-data.js).
- Mã nguồn: [frontend/app/content-data.js](../../frontend/app/content-data.js).
- Kiểm thử hiện có: [frontend/tests/contracts.test.mjs](../../frontend/tests/contracts.test.mjs).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- Ảnh món hiện dùng thẻ img; chưa có next/image/remotePatterns.
- Metadata từng Recipe hiện có title/description/canonical nhưng chưa Open Graph riêng với tên/ảnh món; metadata toàn site chưa đủ yêu cầu SEO chi tiết.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## KN-06 Image Processing & Thumbnail Job

[Issue #31](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/31)

### Đối chiếu yêu cầu

- [x] Background Job resize sau upload
- [x] Thumbnail và medium WebP
- [x] Lưu original URL và thumbnail URL
- [ ] Lưu metadata size và content type của ảnh
- [ ] Card dùng thumbnail, Detail dùng ảnh gốc

### Minh chứng và cách kiểm tra

- Mã nguồn: [src/CulinaryBlog.API/Endpoints/RecipesHandlers.cs](../../src/CulinaryBlog.API/Endpoints/RecipesHandlers.cs).
- Mã nguồn: [src/CulinaryBlog.Infrastructure/Jobs/ThumbnailGenerationJob.cs](../../src/CulinaryBlog.Infrastructure/Jobs/ThumbnailGenerationJob.cs).
- Mã nguồn: [src/CulinaryBlog.Infrastructure/Services/ImageThumbnailService.cs](../../src/CulinaryBlog.Infrastructure/Services/ImageThumbnailService.cs).
- Mã nguồn: [src/CulinaryBlog.Domain/Entities/RecipeImage.cs](../../src/CulinaryBlog.Domain/Entities/RecipeImage.cs).
- Mã nguồn: [frontend/src/RecipePages.jsx](../../frontend/src/RecipePages.jsx).
- Mã nguồn: [frontend/src/HomePage.jsx](../../frontend/src/HomePage.jsx).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/ImageThumbnailServiceTests.cs](../../tests/CulinaryBlog.API.Tests/ImageThumbnailServiceTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/ImageUploadValidationServiceTests.cs](../../tests/CulinaryBlog.API.Tests/ImageUploadValidationServiceTests.cs).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- RecipeImage chưa có SizeBytes/ContentType; validator có ContentType trong bộ nhớ nhưng không lưu vào metadata entity.
- Card hiện render recipe.imageUrl gốc; Detail chưa render ảnh chính, nên chưa đạt phân luồng thumbnail/original.
- URL thumbnail được trả trước khi job hoàn tất; chưa có trạng thái ready/fallback rõ trong UI.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## KN-07 Sitemap & SEO Completion

[Issue #32](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/32)

### Đối chiếu yêu cầu

- [x] Sitemap động chỉ Recipe Published chưa soft delete
- [ ] Open Graph riêng cho Home/Category/Recipe Detail
- [x] Schema.org Recipe JSON-LD và serialize an toàn
- [ ] Kiểm tra ảnh MinIO qua next/image

### Minh chứng và cách kiểm tra

- Mã nguồn: [frontend/app/sitemap.js](../../frontend/app/sitemap.js).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/RecipesHandlers.cs](../../src/CulinaryBlog.API/Endpoints/RecipesHandlers.cs).
- Mã nguồn: [src/CulinaryBlog.Infrastructure/Jobs/SitemapGenerationJob.cs](../../src/CulinaryBlog.Infrastructure/Jobs/SitemapGenerationJob.cs).
- Mã nguồn: [frontend/app/layout.jsx](../../frontend/app/layout.jsx).
- Mã nguồn: [frontend/app/categories/page.jsx](../../frontend/app/categories/page.jsx).
- Mã nguồn: [frontend/app/recipes/[id]/page.jsx](../../frontend/app/recipes/[id]/page.jsx).
- Mã nguồn: [frontend/src/structured-data.js](../../frontend/src/structured-data.js).
- Mã nguồn: [frontend/app/JsonLd.jsx](../../frontend/app/JsonLd.jsx).
- Mã nguồn: [frontend/next.config.mjs](../../frontend/next.config.mjs).
- Mã nguồn: [frontend/src/RecipePages.jsx](../../frontend/src/RecipePages.jsx).
- Kiểm thử hiện có: [frontend/tests/contracts.test.mjs](../../frontend/tests/contracts.test.mjs).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- Sitemap lọc thêm category visible/nondeleted; nếu API lỗi thì trả sitemap các trang tĩnh, không phải xác nhận dữ liệu công thức runtime.
- Chưa next/image/remotePatterns hoặc kiểm thử MinIO image optimizer.
- Chưa có metadata riêng đầy đủ cho Category/Recipe, hiện thừa hưởng Open Graph chung của site.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## KN-08 Health Check, Logging, Docker & CI/CD

[Issue #33](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/33)

### Đối chiếu yêu cầu

- [x] Health API/PostgreSQL/Redis/MinIO
- [x] Serilog structured logging và Correlation ID
- [x] OpenTelemetry tracing/metrics
- [x] Dockerfiles/Compose/Nginx
- [x] Có GitHub Actions build backend/test backend/build frontend/validate Compose
- [ ] CI validate Compose cung cấp đủ biến bắt buộc và trigger đúng nhánh đang nộp

### Minh chứng và cách kiểm tra

- Mã nguồn: [src/CulinaryBlog.API/Program.cs](../../src/CulinaryBlog.API/Program.cs).
- Mã nguồn: [src/CulinaryBlog.API/Health/MinioReadinessHealthCheck.cs](../../src/CulinaryBlog.API/Health/MinioReadinessHealthCheck.cs).
- Mã nguồn: [src/CulinaryBlog.API/Middleware/CorrelationIdMiddleware.cs](../../src/CulinaryBlog.API/Middleware/CorrelationIdMiddleware.cs).
- Mã nguồn: [src/CulinaryBlog.API/appsettings.json](../../src/CulinaryBlog.API/appsettings.json).
- Mã nguồn: [docker-compose.yml](../../docker-compose.yml).
- Mã nguồn: [otel-collector-config.yaml](../../otel-collector-config.yaml).
- Mã nguồn: [src/CulinaryBlog.API/Dockerfile](../../src/CulinaryBlog.API/Dockerfile).
- Mã nguồn: [frontend/Dockerfile](../../frontend/Dockerfile).
- Mã nguồn: [nginx/nginx.conf](../../nginx/nginx.conf).
- Mã nguồn: [.github/workflows/ci-cd.yml](../../.github/workflows/ci-cd.yml).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/CorrelationIdMiddlewareTests.cs](../../tests/CulinaryBlog.API.Tests/CorrelationIdMiddlewareTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/HttpSecurityTests.cs](../../tests/CulinaryBlog.API.Tests/HttpSecurityTests.cs).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- Step validate Compose hiện chỉ cấp JWT_SECRET, trong khi Compose yêu cầu POSTGRES_PASSWORD, MINIO_ROOT_USER, MINIO_ROOT_PASSWORD; cần giá trị giả an toàn riêng cho validation.
- Trigger workflow hiện main/master/nguyeducthanhlab06; nhánh lab07 không tự trigger theo file hiện tại.
- Local OTLP endpoint trống, Compose đặt collector; source instrumentation không chứng minh trace đã tới collector.
- Audit này không xác nhận toàn stack Docker chạy từ đầu hay Actions thành công; cần URL run và minh chứng runtime.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.
