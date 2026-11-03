# Bàn giao Form Category và Frontend

Người phụ trách theo README: **Oven** ([2314487-Somsavath](https://github.com/2314487-Somsavath)). Ngày bổ sung hồ sơ: 28/10/2026.

Tài liệu này phục vụ review phần đã có và lập kế hoạch hoàn thiện. Lịch sử tác giả của mã nguồn được giữ trong Git. Mỗi Issue có checklist để người phụ trách xác nhận trước khi đóng.

## OV-01 Validation Recipe Form

[Issue #18](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/18)

### Đối chiếu yêu cầu

- [ ] Schema validation Recipe ở frontend
- [ ] Tiêu đề tối thiểu 5 ký tự
- [x] Có Ingredient và Step; backend kiểm tra độc lập

### Minh chứng và cách kiểm tra

- Mã nguồn: [frontend/src/routes/wizard.jsx](../../frontend/src/routes/wizard.jsx).
- Mã nguồn: [frontend/src/RecipePages.jsx](../../frontend/src/RecipePages.jsx).
- Mã nguồn: [src/CulinaryBlog.Application/DTOs/CreateRecipeDto.cs](../../src/CulinaryBlog.Application/DTOs/CreateRecipeDto.cs).
- Mã nguồn: [src/CulinaryBlog.Application/CQRS/Recipes/Handlers/CreateRecipeCommandHandler.cs](../../src/CulinaryBlog.Application/CQRS/Recipes/Handlers/CreateRecipeCommandHandler.cs).
- Mã nguồn: [src/CulinaryBlog.Domain/Entities/Recipe.cs](../../src/CulinaryBlog.Domain/Entities/Recipe.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/RequestValidationFilter.cs](../../src/CulinaryBlog.API/Endpoints/RequestValidationFilter.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/RecipeWorkflowEndpointTests.cs](../../tests/CulinaryBlog.API.Tests/RecipeWorkflowEndpointTests.cs).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- Backend DTO hiện MinLength(3), frontend chỉ kiểm tra tiêu đề không rỗng; không đúng mốc 5 trong README.
- Wizard dùng kiểm tra thủ công, chưa có schema và lỗi từng trường; nút Hoàn tất gọi handleSubmit trực tiếp nên bước 3 không chạy nhánh validation trong nextStep. Backend vẫn chặn nội dung dưới 10 nguyên liệu/5 bước.
- Chỉ rà source/test hiện có; không chạy lại test hoặc thay đổi dữ liệu trong đợt audit này.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## OV-02 Form Tạo Recipe Đa Bước

[Issue #19](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/19)

### Đối chiếu yêu cầu

- [x] Có route /recipes/new và form nhiều bước
- [x] Thêm/xóa Ingredient và Step động
- [ ] Lỗi từng trường và preview dữ liệu trước khi gửi
- [x] Trạng thái đang gửi, khóa nút gửi lặp

### Minh chứng và cách kiểm tra

- Mã nguồn: [frontend/app/recipes/new/page.jsx](../../frontend/app/recipes/new/page.jsx).
- Mã nguồn: [frontend/src/routes/wizard.jsx](../../frontend/src/routes/wizard.jsx).
- Kiểm thử hiện có: [frontend/tests/browser/route-smoke.spec.js](../../frontend/tests/browser/route-smoke.spec.js).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- Chỉ toast lỗi chung, chưa có validation message gắn từng field hoặc màn hình preview tổng hợp.
- Route smoke chỉ chứng minh trang render; chưa thấy browser test hoàn chỉnh nhập wizard, thêm/xóa dòng, upload ảnh và gửi thành công.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## OV-03 Xử lý lỗi & Toast

[Issue #20](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/20)

### Đối chiếu yêu cầu

- [x] API client chung xử lý response lỗi và Problem Details
- [x] Toast thân thiện, tự đóng sau 5 giây và đóng thủ công
- [x] ToastContainer duy nhất ở provider chung
- [ ] Có kiểm thử riêng đủ 400,401,403,404,409,422,500 trên frontend

### Minh chứng và cách kiểm tra

- Mã nguồn: [frontend/src/lib/api-client.ts](../../frontend/src/lib/api-client.ts).
- Mã nguồn: [frontend/src/api/config.js](../../frontend/src/api/config.js).
- Mã nguồn: [frontend/src/api/session.js](../../frontend/src/api/session.js).
- Mã nguồn: [frontend/src/components/layout/AppProviders.jsx](../../frontend/src/components/layout/AppProviders.jsx).
- Mã nguồn: [frontend/src/components/common/ToastDeadlineManager.jsx](../../frontend/src/components/common/ToastDeadlineManager.jsx).
- Mã nguồn: [frontend/src/components/common/ErrorState.jsx](../../frontend/src/components/common/ErrorState.jsx).
- Mã nguồn: [frontend/tests/contracts.test.mjs](../../frontend/tests/contracts.test.mjs).
- Mã nguồn: [frontend/tests/browser/navigation.spec.js](../../frontend/tests/browser/navigation.spec.js).
- Mã nguồn: [frontend/tests/browser/cosmic-presentation.spec.js](../../frontend/tests/browser/cosmic-presentation.spec.js).
- Kiểm thử hiện có: [frontend/tests/contracts.test.mjs](../../frontend/tests/contracts.test.mjs).
- Kiểm thử hiện có: [frontend/tests/browser/navigation.spec.js](../../frontend/tests/browser/navigation.spec.js).
- Kiểm thử hiện có: [frontend/tests/browser/cosmic-motion-toast.spec.js](../../frontend/tests/browser/cosmic-motion-toast.spec.js).
- Kiểm thử hiện có: [frontend/tests/browser/cosmic-presentation.spec.js](../../frontend/tests/browser/cosmic-presentation.spec.js).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- Cơ chế generic nhận status và nội dung Problem Details đã có; chưa thấy test frontend bao phủ từng mã lỗi được README liệt kê.
- Một số lỗi backend trả tiếng Anh sẽ được hiển thị nguyên văn, chưa có bảng thông điệp thân thiện riêng cho mọi mã.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## OV-04 Cài đặt Hangfire

[Issue #21](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/21)

### Đối chiếu yêu cầu

- [x] Hangfire sử dụng PostgreSQL Storage
- [x] Hangfire Server được đăng ký và chạy trong backend
- [x] Dashboard /hangfire chỉ cho Admin đã đăng nhập

### Minh chứng và cách kiểm tra

- Mã nguồn: [src/CulinaryBlog.API/Program.cs](../../src/CulinaryBlog.API/Program.cs).
- Mã nguồn: [src/CulinaryBlog.API/CulinaryBlog.API.csproj](../../src/CulinaryBlog.API/CulinaryBlog.API.csproj).
- Mã nguồn: [src/CulinaryBlog.API/Middleware/HangfireDashboardAuthorizationFilter.cs](../../src/CulinaryBlog.API/Middleware/HangfireDashboardAuthorizationFilter.cs).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- Hoàn thành về cài đặt source; audit này không khởi động runtime hoặc thử đăng nhập dashboard.
- Chưa thấy integration test riêng chứng minh dashboard 401/403/Admin access.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## OV-05 Welcome Email Job

[Issue #22](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/22)

### Đối chiếu yêu cầu

- [x] WelcomeEmailJob gọi email sender gửi lời chào
- [x] Enqueue job sau đăng ký thành công
- [x] Retry và log kết quả job
- [ ] Cấu hình SMTP thật để thư gửi ra hộp thư

### Minh chứng và cách kiểm tra

- Mã nguồn: [src/CulinaryBlog.Infrastructure/Jobs/WelcomeEmailJob.cs](../../src/CulinaryBlog.Infrastructure/Jobs/WelcomeEmailJob.cs).
- Mã nguồn: [src/CulinaryBlog.Infrastructure/Services/SmtpEmailSender.cs](../../src/CulinaryBlog.Infrastructure/Services/SmtpEmailSender.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/AuthHandlers.cs](../../src/CulinaryBlog.API/Endpoints/AuthHandlers.cs).
- Mã nguồn: [src/CulinaryBlog.API/Program.cs](../../src/CulinaryBlog.API/Program.cs).
- Mã nguồn: [src/CulinaryBlog.API/appsettings.json](../../src/CulinaryBlog.API/appsettings.json).
- Mã nguồn: [docker-compose.yml](../../docker-compose.yml).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/AuthEndpointContractTests.cs](../../tests/CulinaryBlog.API.Tests/AuthEndpointContractTests.cs).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- Email:Enabled=false, SMTP host/from/credential trong config mẫu đang trống; đăng ký thành công hoặc job thành công khi email disabled không chứng minh thư được gửi.
- Cần người dùng cấu hình SMTP thật qua secret/env và kiểm chứng email nhận được; không đưa mật khẩu thật vào issue/README.
- Auth contract test không phải kiểm thử gửi SMTP thật.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## OV-06 Category CRUD & Category UI

[Issue #23](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/23)

### Đối chiếu yêu cầu

- [x] API danh sách/chi tiết Category
- [x] Admin Create/Update/Soft Delete Category
- [x] Không xóa Category còn Recipe chưa soft delete
- [x] Trang Category và giao diện quản lý cho Admin

### Minh chứng và cách kiểm tra

- Mã nguồn: [src/CulinaryBlog.API/Endpoints/CategoriesEndpoints.cs](../../src/CulinaryBlog.API/Endpoints/CategoriesEndpoints.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/CategoriesHandlers.cs](../../src/CulinaryBlog.API/Endpoints/CategoriesHandlers.cs).
- Mã nguồn: [src/CulinaryBlog.Application/CQRS/Categories/Handlers/GetCategoriesQueryHandler.cs](../../src/CulinaryBlog.Application/CQRS/Categories/Handlers/GetCategoriesQueryHandler.cs).
- Mã nguồn: [src/CulinaryBlog.Application/CQRS/Categories/Handlers/CreateCategoryCommandHandler.cs](../../src/CulinaryBlog.Application/CQRS/Categories/Handlers/CreateCategoryCommandHandler.cs).
- Mã nguồn: [src/CulinaryBlog.Application/CQRS/Categories/Handlers/UpdateCategoryCommandHandler.cs](../../src/CulinaryBlog.Application/CQRS/Categories/Handlers/UpdateCategoryCommandHandler.cs).
- Mã nguồn: [src/CulinaryBlog.Application/CQRS/Categories/Handlers/DeleteCategoryCommandHandler.cs](../../src/CulinaryBlog.Application/CQRS/Categories/Handlers/DeleteCategoryCommandHandler.cs).
- Mã nguồn: [frontend/app/categories/page.jsx](../../frontend/app/categories/page.jsx).
- Mã nguồn: [frontend/src/RecipePages.jsx](../../frontend/src/RecipePages.jsx).
- Mã nguồn: [frontend/app/admin/AdminDashboard.jsx](../../frontend/app/admin/AdminDashboard.jsx).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/CategoryLifecycleTests.cs](../../tests/CulinaryBlog.API.Tests/CategoryLifecycleTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/RecipeWorkflowEndpointTests.cs](../../tests/CulinaryBlog.API.Tests/RecipeWorkflowEndpointTests.cs).
- Kiểm thử hiện có: [frontend/tests/browser/navigation.spec.js](../../frontend/tests/browser/navigation.spec.js).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- Hoàn thành theo source và test đã có; chưa thực hiện lại thao tác CRUD trên runtime trong audit này.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## OV-07 Author Recipe Dashboard

[Issue #24](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/24)

### Đối chiếu yêu cầu

- [x] Trang quản lý Recipe của tác giả và API /recipes/mine
- [x] Hiển thị Draft/Published/Archived
- [x] Edit/Publish/Unpublish/Archive/Restore/Delete và Toast
- [x] Tác giả chỉ quản lý món mình, Admin quản lý tất cả

### Minh chứng và cách kiểm tra

- Mã nguồn: [frontend/src/RecipePages.jsx](../../frontend/src/RecipePages.jsx).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/RecipesEndpoints.cs](../../src/CulinaryBlog.API/Endpoints/RecipesEndpoints.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/RecipesHandlers.cs](../../src/CulinaryBlog.API/Endpoints/RecipesHandlers.cs).
- Mã nguồn: [src/CulinaryBlog.Domain/Entities/Recipe.cs](../../src/CulinaryBlog.Domain/Entities/Recipe.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/RecipeWorkflowEndpointTests.cs](../../tests/CulinaryBlog.API.Tests/RecipeWorkflowEndpointTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/RecipeLifecycleTests.cs](../../tests/CulinaryBlog.API.Tests/RecipeLifecycleTests.cs).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- Đánh giá hoàn thành chức năng source; chưa có browser test xuyên suốt mọi nút chuyển trạng thái và chưa chạy lại runtime trong audit này.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## OV-08 Frontend Common Components & Integration Tests

[Issue #25](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/25)

### Đối chiếu yêu cầu

- [x] Header/Footer/Layout và Loading/Error/Empty/Pagination chung
- [x] Auth Store và Protected Route
- [ ] Test frontend Register→Login→Create→Publish→Search→Logout
- [ ] Test responsive Login/Form/Detail/Dashboard

### Minh chứng và cách kiểm tra

- Mã nguồn: [frontend/src/components/layout/AppHeader.jsx](../../frontend/src/components/layout/AppHeader.jsx).
- Mã nguồn: [frontend/src/components/layout/AppFooter.jsx](../../frontend/src/components/layout/AppFooter.jsx).
- Mã nguồn: [frontend/src/components/layout/AppShell.jsx](../../frontend/src/components/layout/AppShell.jsx).
- Mã nguồn: [frontend/src/components/common/LoadingState.jsx](../../frontend/src/components/common/LoadingState.jsx).
- Mã nguồn: [frontend/src/components/common/ErrorState.jsx](../../frontend/src/components/common/ErrorState.jsx).
- Mã nguồn: [frontend/src/components/common/EmptyState.jsx](../../frontend/src/components/common/EmptyState.jsx).
- Mã nguồn: [frontend/src/components/common/Pagination.jsx](../../frontend/src/components/common/Pagination.jsx).
- Mã nguồn: [frontend/src/store/auth-store.ts](../../frontend/src/store/auth-store.ts).
- Mã nguồn: [frontend/src/RecipePages.jsx](../../frontend/src/RecipePages.jsx).
- Mã nguồn: [frontend/src/api/session.js](../../frontend/src/api/session.js).
- Mã nguồn: [frontend/tests/browser/navigation.spec.js](../../frontend/tests/browser/navigation.spec.js).
- Mã nguồn: [frontend/tests/browser/route-smoke.spec.js](../../frontend/tests/browser/route-smoke.spec.js).
- Mã nguồn: [frontend/tests/browser/cosmic-vip.spec.js](../../frontend/tests/browser/cosmic-vip.spec.js).
- Mã nguồn: [frontend/tests/browser/cosmic-presentation.spec.js](../../frontend/tests/browser/cosmic-presentation.spec.js).
- Mã nguồn: [frontend/playwright.config.js](../../frontend/playwright.config.js).
- Kiểm thử hiện có: [frontend/tests/contracts.test.mjs](../../frontend/tests/contracts.test.mjs).
- Kiểm thử hiện có: [frontend/tests/browser/navigation.spec.js](../../frontend/tests/browser/navigation.spec.js).
- Kiểm thử hiện có: [frontend/tests/browser/route-smoke.spec.js](../../frontend/tests/browser/route-smoke.spec.js).
- Kiểm thử hiện có: [frontend/tests/browser/cosmic-presentation.spec.js](../../frontend/tests/browser/cosmic-presentation.spec.js).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/AuthEndpointContractTests.cs](../../tests/CulinaryBlog.API.Tests/AuthEndpointContractTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/RecipeWorkflowEndpointTests.cs](../../tests/CulinaryBlog.API.Tests/RecipeWorkflowEndpointTests.cs).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- 23 browser tests hiện tại chủ yếu smoke/navigation/cosmic UI; không thay thế full business-flow E2E theo README.
- Responsive test hiện tập trung header/dropdown, chưa thấy ma trận mobile cho đủ bốn màn hình được giao.
- ProtectedRoute còn dựa session user phía client để quyết định render; backend mới là nơi thực thi bảo mật thực sự.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.
