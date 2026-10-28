# Bàn giao Auth và API

Người phụ trách theo README: **Nguyễn Đức Thành** ([2312749-design](https://github.com/2312749-design)). Ngày bổ sung hồ sơ: 28/10/2026.

Tài liệu này phục vụ review phần đã có và lập kế hoạch hoàn thiện. Lịch sử tác giả của mã nguồn được giữ trong Git. Mỗi Issue có checklist để người phụ trách xác nhận trước khi đóng.

## TH-01 Khởi tạo Solution & Clean Architecture

[Issue #1](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/1)

### Đối chiếu yêu cầu

- [x] Có bốn project Domain, Application, Infrastructure, API và project references theo chiều API → Application/Infrastructure → Application → Domain.
- [ ] Đã cài MediatR và EF Core; phần yêu cầu Mapster trong README chưa có package hoặc cấu hình tương ứng.

### Minh chứng và cách kiểm tra

- Mã nguồn: [CulinaryBlog.slnx](../../CulinaryBlog.slnx).
- Mã nguồn: [src/CulinaryBlog.Domain/CulinaryBlog.Domain.csproj](../../src/CulinaryBlog.Domain/CulinaryBlog.Domain.csproj).
- Mã nguồn: [src/CulinaryBlog.Application/CulinaryBlog.Application.csproj](../../src/CulinaryBlog.Application/CulinaryBlog.Application.csproj).
- Mã nguồn: [src/CulinaryBlog.Infrastructure/CulinaryBlog.Infrastructure.csproj](../../src/CulinaryBlog.Infrastructure/CulinaryBlog.Infrastructure.csproj).
- Mã nguồn: [src/CulinaryBlog.API/CulinaryBlog.API.csproj](../../src/CulinaryBlog.API/CulinaryBlog.API.csproj).
- Mã nguồn: [src/CulinaryBlog.API/Program.cs](../../src/CulinaryBlog.API/Program.cs).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- Dự án hiện dùng ánh xạ DTO thủ công; cần thống nhất lại README hoặc thực hiện Mapster nếu vẫn giữ yêu cầu này.
- Application vẫn tham chiếu EF Core và IApplicationDbContext còn DbSet; cấu trúc bốn tầng đã có nhưng chưa tách persistence tuyệt đối.
- Không chạy lại build hoặc architecture test trong lượt audit này.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## TH-02 Database & Core Entities

[Issue #2](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/2)

### Đối chiếu yêu cầu

- [x] ApplicationUser kế thừa IdentityUser, có Recipe và Category.
- [x] ApplicationDbContext có Fluent API và đăng ký kết nối PostgreSQL; migration khởi tạo và migration mở rộng tồn tại.

### Minh chứng và cách kiểm tra

- Mã nguồn: [src/CulinaryBlog.Domain/Entities/ApplicationUser.cs](../../src/CulinaryBlog.Domain/Entities/ApplicationUser.cs).
- Mã nguồn: [src/CulinaryBlog.Domain/Entities/Recipe.cs](../../src/CulinaryBlog.Domain/Entities/Recipe.cs).
- Mã nguồn: [src/CulinaryBlog.Domain/Entities/Category.cs](../../src/CulinaryBlog.Domain/Entities/Category.cs).
- Mã nguồn: [src/CulinaryBlog.Infrastructure/Persistence/ApplicationDbContext.cs](../../src/CulinaryBlog.Infrastructure/Persistence/ApplicationDbContext.cs).
- Mã nguồn: [src/CulinaryBlog.API/Program.cs](../../src/CulinaryBlog.API/Program.cs).
- Mã nguồn: [src/CulinaryBlog.Infrastructure/Migrations/20260921064159_InitialDb.cs](../../src/CulinaryBlog.Infrastructure/Migrations/20260921064159_InitialDb.cs).
- Mã nguồn: [src/CulinaryBlog.Infrastructure/Migrations/20260921074409_AddCategoryAndRecipe.cs](../../src/CulinaryBlog.Infrastructure/Migrations/20260921074409_AddCategoryAndRecipe.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/DataSeederRecipeContentTests.cs](../../tests/CulinaryBlog.API.Tests/DataSeederRecipeContentTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/RecipeWorkflowEndpointTests.cs](../../tests/CulinaryBlog.API.Tests/RecipeWorkflowEndpointTests.cs).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- Hoàn thành ở mức implementation và migration có sẵn; lượt audit này không tạo database mới hoặc chạy lại toàn bộ chuỗi migration từ đầu.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## TH-03 API Xác thực: Register & Login

[Issue #3](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/3)

### Đối chiếu yêu cầu

- [x] Có xử lý đăng ký/đăng nhập bằng PasswordHasher, cấp JWT access token và refresh token, có hai endpoint /api/v1/auth/register và /api/v1/auth/login.
- [ ] Vai trò mặc định khi đăng ký là Author như README.

### Minh chứng và cách kiểm tra

- Mã nguồn: [src/CulinaryBlog.API/Endpoints/AuthHandlers.cs](../../src/CulinaryBlog.API/Endpoints/AuthHandlers.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/AuthEndpoints.cs](../../src/CulinaryBlog.API/Endpoints/AuthEndpoints.cs).
- Mã nguồn: [src/CulinaryBlog.Infrastructure/Services/TokenService.cs](../../src/CulinaryBlog.Infrastructure/Services/TokenService.cs).
- Mã nguồn: [src/CulinaryBlog.Domain/Entities/ApplicationUser.cs](../../src/CulinaryBlog.Domain/Entities/ApplicationUser.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/AuthEndpointContractTests.cs](../../tests/CulinaryBlog.API.Tests/AuthEndpointContractTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/AuthControllerTests.cs](../../tests/CulinaryBlog.API.Tests/AuthControllerTests.cs).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- ApplicationUser mặc định Role=User; Register không gán Author. Cần xác nhận chính sách vai trò và đồng bộ README, không tự đổi quyền người dùng chỉ để khớp mô tả.
- Chức năng nằm trong Minimal API AuthHandlers thay vì các lớp RegisterCommand/LoginCommand riêng; đây là khác cách tổ chức mã, không phải thiếu endpoint.
- Các file test được xác định qua mã nguồn; không chạy lại trong lượt audit này.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## TH-04 Refresh Token & CORS

[Issue #4](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/4)

### Đối chiếu yêu cầu

- [x] RefreshToken có trạng thái thu hồi, đã sử dụng, hết hạn và token family; refresh xoay vòng và phát hiện replay.
- [x] CORS dùng allow-list bao gồm frontend localhost:3000 và có chính sách credentials.

### Minh chứng và cách kiểm tra

- Mã nguồn: [src/CulinaryBlog.Domain/Entities/RefreshToken.cs](../../src/CulinaryBlog.Domain/Entities/RefreshToken.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/AuthHandlers.cs](../../src/CulinaryBlog.API/Endpoints/AuthHandlers.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/ApiSecurity.cs](../../src/CulinaryBlog.API/Endpoints/ApiSecurity.cs).
- Mã nguồn: [src/CulinaryBlog.API/Program.cs](../../src/CulinaryBlog.API/Program.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/AuthEndpointContractTests.cs](../../tests/CulinaryBlog.API.Tests/AuthEndpointContractTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/AuthControllerTests.cs](../../tests/CulinaryBlog.API.Tests/AuthControllerTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/HttpSecurityTests.cs](../../tests/CulinaryBlog.API.Tests/HttpSecurityTests.cs).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- Đã có test rotation/replay và origin đúng/sai trong source; lượt audit này không chạy lại test.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## TH-05 Google OAuth 2.0

[Issue #5](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/5)

### Đối chiếu yêu cầu

- [x] Frontend nhận Google ID token; backend xác minh chữ ký, audience, thời hạn và email đã xác minh trước khi cấp phiên.
- [x] Tạo tài khoản Google mới hoặc liên kết tài khoản đã tồn tại có kiểm tra an toàn; không tin hồ sơ client tự khai.
- [ ] Đăng nhập Google thật đã được cấu hình và kiểm chứng đầu-cuối.

### Minh chứng và cách kiểm tra

- Mã nguồn: [frontend/app/login/LoginClient.jsx](../../frontend/app/login/LoginClient.jsx).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/AuthHandlers.cs](../../src/CulinaryBlog.API/Endpoints/AuthHandlers.cs).
- Mã nguồn: [src/CulinaryBlog.Infrastructure/Services/GoogleIdentityVerifier.cs](../../src/CulinaryBlog.Infrastructure/Services/GoogleIdentityVerifier.cs).
- Mã nguồn: [src/CulinaryBlog.Application/Interfaces/IGoogleIdentityVerifier.cs](../../src/CulinaryBlog.Application/Interfaces/IGoogleIdentityVerifier.cs).
- Mã nguồn: [src/CulinaryBlog.API/appsettings.json](../../src/CulinaryBlog.API/appsettings.json).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- Google Client ID trong cấu hình mẫu đang trống; cần Client ID thật cho backend/frontend và authorized origin/redirect phù hợp.
- Không đọc .env hoặc suy đoán cấu hình riêng; chưa kiểm thử Google thật hoặc tìm thấy test tự động riêng cho flow này.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## TH-06 Resource-Based Authorization

[Issue #6](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/6)

### Đối chiếu yêu cầu

- [x] Tác giả chỉ sửa/xóa recipe của mình; Admin có quyền quản lý recipe.
- [ ] Có RecipeAuthorizationHandler kế thừa AuthorizationHandler như phân công ghi rõ.

### Minh chứng và cách kiểm tra

- Mã nguồn: [src/CulinaryBlog.API/Endpoints/RecipesHandlers.cs](../../src/CulinaryBlog.API/Endpoints/RecipesHandlers.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/RecipeIngredientsHandlers.cs](../../src/CulinaryBlog.API/Endpoints/RecipeIngredientsHandlers.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/RecipeStepsHandlers.cs](../../src/CulinaryBlog.API/Endpoints/RecipeStepsHandlers.cs).
- Mã nguồn: [Readme.md](../../Readme.md).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/RecipeLifecycleTests.cs](../../tests/CulinaryBlog.API.Tests/RecipeLifecycleTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/HttpSecurityTests.cs](../../tests/CulinaryBlog.API.Tests/HttpSecurityTests.cs).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- Hiện kiểm tra owner/Admin trực tiếp trong handler, chưa có resource authorization handler dùng chung. Có thể cập nhật mô tả kiến trúc theo implementation hoặc tách abstraction nếu vẫn giữ yêu cầu lớp riêng.
- Có test từ chối non-owner và người không phải Admin; không chạy lại trong lượt audit này.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## TH-07 Logout & Profile Management

[Issue #7](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/7)

### Đối chiếu yêu cầu

- [x] Logout thu hồi refresh token family của phiên hiện tại, xóa cookie; frontend xóa session.
- [x] Có API xem/cập nhật hồ sơ displayName hoặc FullName, avatarUrl, bio và giao diện hồ sơ.

### Minh chứng và cách kiểm tra

- Mã nguồn: [src/CulinaryBlog.API/Endpoints/AuthHandlers.cs](../../src/CulinaryBlog.API/Endpoints/AuthHandlers.cs).
- Mã nguồn: [frontend/src/components/layout/AppHeader.jsx](../../frontend/src/components/layout/AppHeader.jsx).
- Mã nguồn: [frontend/src/api/session.js](../../frontend/src/api/session.js).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/AuthEndpoints.cs](../../src/CulinaryBlog.API/Endpoints/AuthEndpoints.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/AccountEndpoints.cs](../../src/CulinaryBlog.API/Endpoints/AccountEndpoints.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/AccountHandlers.cs](../../src/CulinaryBlog.API/Endpoints/AccountHandlers.cs).
- Mã nguồn: [frontend/src/CommunityPages.jsx](../../frontend/src/CommunityPages.jsx).
- Mã nguồn: [frontend/app/account/page.jsx](../../frontend/app/account/page.jsx).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/AuthEndpointContractTests.cs](../../tests/CulinaryBlog.API.Tests/AuthEndpointContractTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/AuthControllerTests.cs](../../tests/CulinaryBlog.API.Tests/AuthControllerTests.cs).
- Kiểm thử hiện có: [frontend/tests/browser/route-smoke.spec.js](../../frontend/tests/browser/route-smoke.spec.js).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- Có test logout và smoke route; chưa thấy test tự động chuyên biệt cập nhật hồ sơ. Lượt này không tạo tài khoản hoặc sửa hồ sơ người dùng.
- Đổi email được tách sang flow xác nhận ở trung tâm bảo mật, không đổi trực tiếp qua form profile.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## TH-08 API Versioning, Swagger & Global Error Handling

[Issue #8](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/8)

### Đối chiếu yêu cầu

- [x] API /api/v1 có Asp.Versioning và Swagger/Scalar hỗ trợ Bearer JWT.
- [x] Có middleware/filter/response chung trả Problem Details; có limiter riêng Login, Register, Upload.
- [ ] Mọi lỗi đều được chuẩn hóa đầy đủ thành AUTH_*, RECIPE_*, CATEGORY_*, VALIDATION_*.

### Minh chứng và cách kiểm tra

- Mã nguồn: [src/CulinaryBlog.API/Program.cs](../../src/CulinaryBlog.API/Program.cs).
- Mã nguồn: [src/CulinaryBlog.API/CulinaryBlog.API.csproj](../../src/CulinaryBlog.API/CulinaryBlog.API.csproj).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/ApplicationEndpoints.cs](../../src/CulinaryBlog.API/Endpoints/ApplicationEndpoints.cs).
- Mã nguồn: [src/CulinaryBlog.API/Middleware/ExceptionHandlingMiddleware.cs](../../src/CulinaryBlog.API/Middleware/ExceptionHandlingMiddleware.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/EndpointHandler.cs](../../src/CulinaryBlog.API/Endpoints/EndpointHandler.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/RequestValidationFilter.cs](../../src/CulinaryBlog.API/Endpoints/RequestValidationFilter.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/ApiSecurity.cs](../../src/CulinaryBlog.API/Endpoints/ApiSecurity.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/AuthEndpoints.cs](../../src/CulinaryBlog.API/Endpoints/AuthEndpoints.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/RecipesEndpoints.cs](../../src/CulinaryBlog.API/Endpoints/RecipesEndpoints.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/AuthHandlers.cs](../../src/CulinaryBlog.API/Endpoints/AuthHandlers.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/SearchHandlers.cs](../../src/CulinaryBlog.API/Endpoints/SearchHandlers.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/HttpSecurityTests.cs](../../tests/CulinaryBlog.API.Tests/HttpSecurityTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/AuthEndpointContractTests.cs](../../tests/CulinaryBlog.API.Tests/AuthEndpointContractTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/CorrelationIdMiddlewareTests.cs](../../tests/CulinaryBlog.API.Tests/CorrelationIdMiddlewareTests.cs).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- Một số lỗi có code (ví dụ Google), nhiều nhánh chỉ có message/detail; middleware exception chưa gắn mã nghiệp vụ đồng nhất.
- Không chạy lại test rate limit/versioning trong lượt audit này.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## TH-09 Seed Data & Security Tests

[Issue #9](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/9)

### Đối chiếu yêu cầu

- [x] Có tài khoản demo Admin/Author và seed ít nhất 20 category, 100 recipe, tối thiểu 10 ingredient/5 step.
- [x] Có test Register, Login, Refresh, Logout, Authorization và Rate Limiting.
- [ ] Có test tự động chuyên biệt xem/sửa Profile như phạm vi đã phân công.

### Minh chứng và cách kiểm tra

- Mã nguồn: [src/CulinaryBlog.Infrastructure/Persistence/DataSeeder.cs](../../src/CulinaryBlog.Infrastructure/Persistence/DataSeeder.cs).
- Mã nguồn: [src/CulinaryBlog.Infrastructure/Persistence/RecipeCatalogSeeder.cs](../../src/CulinaryBlog.Infrastructure/Persistence/RecipeCatalogSeeder.cs).
- Mã nguồn: [src/CulinaryBlog.Infrastructure/Persistence/ExpandedDemoDataSeeder.cs](../../src/CulinaryBlog.Infrastructure/Persistence/ExpandedDemoDataSeeder.cs).
- Mã nguồn: [tests/CulinaryBlog.API.Tests/DataSeederRecipeContentTests.cs](../../tests/CulinaryBlog.API.Tests/DataSeederRecipeContentTests.cs).
- Mã nguồn: [tests/CulinaryBlog.API.Tests/AuthEndpointContractTests.cs](../../tests/CulinaryBlog.API.Tests/AuthEndpointContractTests.cs).
- Mã nguồn: [tests/CulinaryBlog.API.Tests/AuthControllerTests.cs](../../tests/CulinaryBlog.API.Tests/AuthControllerTests.cs).
- Mã nguồn: [tests/CulinaryBlog.API.Tests/RecipeLifecycleTests.cs](../../tests/CulinaryBlog.API.Tests/RecipeLifecycleTests.cs).
- Mã nguồn: [tests/CulinaryBlog.API.Tests/HttpSecurityTests.cs](../../tests/CulinaryBlog.API.Tests/HttpSecurityTests.cs).
- Mã nguồn: [tests/CulinaryBlog.API.Tests/AccountSecurityServiceTests.cs](../../tests/CulinaryBlog.API.Tests/AccountSecurityServiceTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/DataSeederRecipeContentTests.cs](../../tests/CulinaryBlog.API.Tests/DataSeederRecipeContentTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/DemoActivitySeederTests.cs](../../tests/CulinaryBlog.API.Tests/DemoActivitySeederTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/AuthEndpointContractTests.cs](../../tests/CulinaryBlog.API.Tests/AuthEndpointContractTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/HttpSecurityTests.cs](../../tests/CulinaryBlog.API.Tests/HttpSecurityTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/RecipeLifecycleTests.cs](../../tests/CulinaryBlog.API.Tests/RecipeLifecycleTests.cs).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- Role hiện được lưu trên ApplicationUser.Role và đưa vào JWT, không khẳng định có seed bảng Identity Roles riêng.
- Thiếu test chuyên biệt Profile; danh sách tests ở đây là source có sẵn, không phải kết quả vừa chạy.
- Không query hoặc thay đổi database đang chạy trong lượt audit này.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.
