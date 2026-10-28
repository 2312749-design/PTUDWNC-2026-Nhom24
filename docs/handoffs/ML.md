# Bàn giao Recipe Search và Cache

Người phụ trách theo README: **Minh Long** ([Long10205](https://github.com/Long10205)). Ngày bổ sung hồ sơ: 28/10/2026.

Tài liệu này phục vụ review phần đã có và lập kế hoạch hoàn thiện. Lịch sử tác giả của mã nguồn được giữ trong Git. Mỗi Issue có checklist để người phụ trách xác nhận trước khi đóng.

## ML-01 Model & Fluent API dữ liệu phụ

[Issue #10](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/10)

### Đối chiếu yêu cầu

- [x] RecipeIngredient có tên, quantity, unit, notes; RecipeStep có thứ tự, title, description, timer.
- [x] Fluent API cấu hình FK RecipeId, giới hạn trường và unique index thứ tự cho ingredient/step.

### Minh chứng và cách kiểm tra

- Mã nguồn: [src/CulinaryBlog.Domain/Entities/RecipeIngredient.cs](../../src/CulinaryBlog.Domain/Entities/RecipeIngredient.cs).
- Mã nguồn: [src/CulinaryBlog.Domain/Entities/RecipeStep.cs](../../src/CulinaryBlog.Domain/Entities/RecipeStep.cs).
- Mã nguồn: [src/CulinaryBlog.Infrastructure/Persistence/ApplicationDbContext.cs](../../src/CulinaryBlog.Infrastructure/Persistence/ApplicationDbContext.cs).
- Mã nguồn: [src/CulinaryBlog.Infrastructure/Migrations/20261012084428_RecipeLifecycleNutritionAndStructuredSteps.cs](../../src/CulinaryBlog.Infrastructure/Migrations/20261012084428_RecipeLifecycleNutritionAndStructuredSteps.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/DataSeederRecipeContentTests.cs](../../tests/CulinaryBlog.API.Tests/DataSeederRecipeContentTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/RecipeLifecycleTests.cs](../../tests/CulinaryBlog.API.Tests/RecipeLifecycleTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/RecipeWorkflowEndpointTests.cs](../../tests/CulinaryBlog.API.Tests/RecipeWorkflowEndpointTests.cs).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- Cấu hình Fluent API nằm trong ApplicationDbContext, không nằm ở các file configuration riêng. Không chạy lại test trong lượt audit này.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## ML-02 API CRUD Ingredient & Step

[Issue #11](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/11)

### Đối chiếu yêu cầu

- [x] Có GET/POST/PUT/DELETE ingredient và step tại /api/v1/recipes/{recipeId}/ingredients và /steps với kiểm tra quyền sở hữu/Admin.
- [x] Step mới tự gán số; khi xóa đánh lại thứ tự liên tục trong transaction.

### Minh chứng và cách kiểm tra

- Mã nguồn: [src/CulinaryBlog.API/Endpoints/RecipeIngredientsEndpoints.cs](../../src/CulinaryBlog.API/Endpoints/RecipeIngredientsEndpoints.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/RecipeIngredientsHandlers.cs](../../src/CulinaryBlog.API/Endpoints/RecipeIngredientsHandlers.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/RecipeStepsEndpoints.cs](../../src/CulinaryBlog.API/Endpoints/RecipeStepsEndpoints.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/RecipeStepsHandlers.cs](../../src/CulinaryBlog.API/Endpoints/RecipeStepsHandlers.cs).
- Mã nguồn: [tests/CulinaryBlog.API.Tests/RecipeLifecycleTests.cs](../../tests/CulinaryBlog.API.Tests/RecipeLifecycleTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/RecipeLifecycleTests.cs](../../tests/CulinaryBlog.API.Tests/RecipeLifecycleTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/RecipeWorkflowEndpointTests.cs](../../tests/CulinaryBlog.API.Tests/RecipeWorkflowEndpointTests.cs).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- Hiện dùng Minimal API endpoint handlers, không tách mỗi thao tác thành MediatR Command/Handler riêng; đây là khác cấu trúc so với cách mô tả cũ.
- Test hiện có chứng minh tạo/xóa và renumber step; chưa thấy bộ HTTP test đầy đủ mọi nhánh CRUD ingredient. Không chạy lại test trong lượt này.
- Thiếu invalidation cache ở các endpoint child riêng được ghi tại ML-07.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## ML-03 Database cho Full-Text Search

[Issue #12](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/12)

### Đối chiếu yêu cầu

- [x] Migration bật unaccent và trigger cập nhật SearchVector từ tiêu đề/mô tả/nguyên liệu đã bỏ dấu.
- [x] Recipe có shadow property SearchVector kiểu tsvector ở persistence và GIN index.

### Minh chứng và cách kiểm tra

- Mã nguồn: [src/CulinaryBlog.Infrastructure/Migrations/20261019190000_ImproveRecipeSearch.cs](../../src/CulinaryBlog.Infrastructure/Migrations/20261019190000_ImproveRecipeSearch.cs).
- Mã nguồn: [src/CulinaryBlog.Infrastructure/Persistence/ApplicationDbContext.cs](../../src/CulinaryBlog.Infrastructure/Persistence/ApplicationDbContext.cs).
- Mã nguồn: [src/CulinaryBlog.Infrastructure/Migrations/20261007025224_AddRecipeSearchVector.cs](../../src/CulinaryBlog.Infrastructure/Migrations/20261007025224_AddRecipeSearchVector.cs).
- Mã nguồn: [src/CulinaryBlog.Infrastructure/Migrations/20261024133051_MoveRecipeSearchVectorToInfrastructure.cs](../../src/CulinaryBlog.Infrastructure/Migrations/20261024133051_MoveRecipeSearchVectorToInfrastructure.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/SearchContractTests.cs](../../tests/CulinaryBlog.API.Tests/SearchContractTests.cs).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- SearchContractTests dùng SQLite và nhánh tìm kiếm in-memory; không được coi là kiểm chứng trực tiếp SQL PostgreSQL FTS hoặc hiệu quả GIN. Không chạy lại PostgreSQL integration test trong lượt audit này.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## ML-04 API Search, Filter, Sort & Pagination

[Issue #13](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/13)

### Đối chiếu yêu cầu

- [x] Search endpoint dùng PostgreSQL FTS, filter category/difficulty/cook time/servings, sort và offset pagination.
- [ ] HTTP contract đúng PagedResult items/totalCount/page/totalPages như README.

### Minh chứng và cách kiểm tra

- Mã nguồn: [src/CulinaryBlog.API/Endpoints/SearchEndpoints.cs](../../src/CulinaryBlog.API/Endpoints/SearchEndpoints.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/SearchHandlers.cs](../../src/CulinaryBlog.API/Endpoints/SearchHandlers.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/EndpointHandler.cs](../../src/CulinaryBlog.API/Endpoints/EndpointHandler.cs).
- Mã nguồn: [Readme.md](../../Readme.md).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/SearchContractTests.cs](../../tests/CulinaryBlog.API.Tests/SearchContractTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/AuthControllerTests.cs](../../tests/CulinaryBlog.API.Tests/AuthControllerTests.cs).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- Handler trả items/total/page/pageSize; lớp chung chuyển HTTP thành data và meta chứa page/pageSize/total/totalPages. Có phân trang, nhưng tên và envelope khác README, cần thống nhất contract/tài liệu hoặc bổ sung adapter.
- Chức năng ở SearchHandlers thay vì lớp SearchRecipesQueryHandler riêng. Không coi khác tên lớp là thiếu search.
- Không chạy lại test trong lượt audit này.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## ML-05 Giao diện tìm kiếm

[Issue #14](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/14)

### Đối chiếu yêu cầu

- [x] Có thanh tìm kiếm, bộ lọc, recipe card, loading/empty/error và API client chung.
- [ ] Giao diện danh sách kết quả có pagination và tích hợp đầy đủ phân trang của search API.

### Minh chứng và cách kiểm tra

- Mã nguồn: [frontend/src/RecipePages.jsx](../../frontend/src/RecipePages.jsx).
- Mã nguồn: [frontend/src/components/cosmic/CosmicCommandPalette.jsx](../../frontend/src/components/cosmic/CosmicCommandPalette.jsx).
- Mã nguồn: [frontend/src/api/session.js](../../frontend/src/api/session.js).
- Mã nguồn: [frontend/src/lib/api-client.ts](../../frontend/src/lib/api-client.ts).
- Mã nguồn: [frontend/src/components/common/Pagination.jsx](../../frontend/src/components/common/Pagination.jsx).
- Kiểm thử hiện có: [frontend/tests/browser/cosmic-vip.spec.js](../../frontend/tests/browser/cosmic-vip.spec.js).
- Kiểm thử hiện có: [frontend/tests/browser/route-smoke.spec.js](../../frontend/tests/browser/route-smoke.spec.js).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- Trang recipes tải catalog rồi filter local và map toàn bộ kết quả; chưa dùng Pagination ở danh sách này.
- Ctrl+K dùng search API nhưng chỉ lấy tối đa 8 gợi ý, không phải trang kết quả phân trang đầy đủ.
- Có component Pagination dùng chung không đồng nghĩa đã tích hợp vào giao diện search. Không chạy lại browser test trong lượt audit này.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## ML-06 Recipe Core CRUD & Lifecycle

[Issue #15](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/15)

### Đối chiếu yêu cầu

- [x] Có list/detail/create/update/soft delete và publish/unpublish/archive/restore; recipe mới Draft.
- [x] Chỉ Published chưa xóa thuộc category hợp lệ được xem công khai, search và sitemap.
- [ ] Có optimistic concurrency bằng RowVersion/Version và phản hồi conflict khi cập nhật phiên bản cũ.

### Minh chứng và cách kiểm tra

- Mã nguồn: [src/CulinaryBlog.API/Endpoints/RecipesEndpoints.cs](../../src/CulinaryBlog.API/Endpoints/RecipesEndpoints.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/RecipesHandlers.cs](../../src/CulinaryBlog.API/Endpoints/RecipesHandlers.cs).
- Mã nguồn: [src/CulinaryBlog.Application/CQRS/Recipes/Handlers/CreateRecipeCommandHandler.cs](../../src/CulinaryBlog.Application/CQRS/Recipes/Handlers/CreateRecipeCommandHandler.cs).
- Mã nguồn: [src/CulinaryBlog.Domain/Entities/Recipe.cs](../../src/CulinaryBlog.Domain/Entities/Recipe.cs).
- Mã nguồn: [src/CulinaryBlog.Application/CQRS/Recipes/Handlers/GetRecipesQueryHandler.cs](../../src/CulinaryBlog.Application/CQRS/Recipes/Handlers/GetRecipesQueryHandler.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/SearchHandlers.cs](../../src/CulinaryBlog.API/Endpoints/SearchHandlers.cs).
- Mã nguồn: [frontend/app/sitemap.js](../../frontend/app/sitemap.js).
- Mã nguồn: [src/CulinaryBlog.Application/DTOs/UpdateRecipeDto.cs](../../src/CulinaryBlog.Application/DTOs/UpdateRecipeDto.cs).
- Mã nguồn: [src/CulinaryBlog.Infrastructure/Persistence/ApplicationDbContext.cs](../../src/CulinaryBlog.Infrastructure/Persistence/ApplicationDbContext.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/RecipeLifecycleTests.cs](../../tests/CulinaryBlog.API.Tests/RecipeLifecycleTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/RecipeWorkflowEndpointTests.cs](../../tests/CulinaryBlog.API.Tests/RecipeWorkflowEndpointTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/AuthControllerTests.cs](../../tests/CulinaryBlog.API.Tests/AuthControllerTests.cs).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- Có UpdatedAt và lịch sử phiên bản nhưng chưa có concurrency token/check phiên bản request; lịch sử sửa không thay thế optimistic concurrency.
- Ba RecipeWorkflowEndpointTests đã được xác nhận đạt ở lượt trước; lượt audit này không chạy lại hoặc mở rộng kết quả đó sang toàn suite.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## ML-07 Redis Cache & Cache Invalidation

[Issue #16](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/16)

### Đối chiếu yêu cầu

- [x] Có Redis cache cho public recipe list/detail với TTL 5/10 phút và fallback NoOp khi không cấu hình Redis.
- [ ] Mọi thay đổi Recipe/Category/Ingredient/Step/Image đều invalidation đủ cache liên quan.
- [ ] Tự fallback an toàn khi Redis đã cấu hình nhưng không kết nối được hoặc lỗi giữa lúc vận hành.

### Minh chứng và cách kiểm tra

- Mã nguồn: [src/CulinaryBlog.Infrastructure/Services/RedisCacheService.cs](../../src/CulinaryBlog.Infrastructure/Services/RedisCacheService.cs).
- Mã nguồn: [src/CulinaryBlog.Application/CQRS/Recipes/Handlers/GetRecipesQueryHandler.cs](../../src/CulinaryBlog.Application/CQRS/Recipes/Handlers/GetRecipesQueryHandler.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/RecipesHandlers.cs](../../src/CulinaryBlog.API/Endpoints/RecipesHandlers.cs).
- Mã nguồn: [src/CulinaryBlog.API/Program.cs](../../src/CulinaryBlog.API/Program.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/RecipeIngredientsHandlers.cs](../../src/CulinaryBlog.API/Endpoints/RecipeIngredientsHandlers.cs).
- Mã nguồn: [src/CulinaryBlog.API/Endpoints/RecipeStepsHandlers.cs](../../src/CulinaryBlog.API/Endpoints/RecipeStepsHandlers.cs).
- Mã nguồn: [src/CulinaryBlog.Application/CQRS/Categories/Handlers/CategoryCacheInvalidator.cs](../../src/CulinaryBlog.Application/CQRS/Categories/Handlers/CategoryCacheInvalidator.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/RecipeCacheInvalidationTests.cs](../../tests/CulinaryBlog.API.Tests/RecipeCacheInvalidationTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/CategoryLifecycleTests.cs](../../tests/CulinaryBlog.API.Tests/CategoryLifecycleTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/RecipeWorkflowEndpointTests.cs](../../tests/CulinaryBlog.API.Tests/RecipeWorkflowEndpointTests.cs).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- RecipeIngredientsHandlers và RecipeStepsHandlers không inject/call cache invalidator; chi tiết cache có thể cũ sau child CRUD riêng.
- Recipe mutations xóa list/detail cache nhưng chưa xóa categories:all, nên số món category có thể chậm cập nhật theo TTL.
- RedisCacheService không bắt lỗi kết nối; Program gọi Connect trực tiếp. NoOp chỉ áp dụng nếu connection string trống, không bảo đảm fail-open khi Redis lỗi.
- Test cache hiện dùng fake/in-memory cache, chưa kiểm chứng Redis thật bị ngắt kết nối; không chạy lại test trong lượt này.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.

## ML-08 Recipe/Search Automated Tests

[Issue #17](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/17)

### Đối chiếu yêu cầu

- [x] Có test recipe workflow/lifecycle gồm create, publish, unpublish, archive, restore, soft delete và phân quyền.
- [ ] Có test đầy đủ Ingredient/Step CRUD và renumber step.
- [x] Có test tiếng Việt có/không dấu, filter kết hợp, sort, phân trang ổn định và tham số sai.
- [ ] Có test invalidation list/detail recipe và category; có test Redis thật/failure fallback.

### Minh chứng và cách kiểm tra

- Mã nguồn: [tests/CulinaryBlog.API.Tests/RecipeWorkflowEndpointTests.cs](../../tests/CulinaryBlog.API.Tests/RecipeWorkflowEndpointTests.cs).
- Mã nguồn: [tests/CulinaryBlog.API.Tests/RecipeLifecycleTests.cs](../../tests/CulinaryBlog.API.Tests/RecipeLifecycleTests.cs).
- Mã nguồn: [tests/CulinaryBlog.API.Tests/SearchContractTests.cs](../../tests/CulinaryBlog.API.Tests/SearchContractTests.cs).
- Mã nguồn: [tests/CulinaryBlog.API.Tests/RecipeCacheInvalidationTests.cs](../../tests/CulinaryBlog.API.Tests/RecipeCacheInvalidationTests.cs).
- Mã nguồn: [tests/CulinaryBlog.API.Tests/CategoryLifecycleTests.cs](../../tests/CulinaryBlog.API.Tests/CategoryLifecycleTests.cs).
- Mã nguồn: [src/CulinaryBlog.Infrastructure/Services/RedisCacheService.cs](../../src/CulinaryBlog.Infrastructure/Services/RedisCacheService.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/RecipeWorkflowEndpointTests.cs](../../tests/CulinaryBlog.API.Tests/RecipeWorkflowEndpointTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/RecipeLifecycleTests.cs](../../tests/CulinaryBlog.API.Tests/RecipeLifecycleTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/SearchContractTests.cs](../../tests/CulinaryBlog.API.Tests/SearchContractTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/RecipeCacheInvalidationTests.cs](../../tests/CulinaryBlog.API.Tests/RecipeCacheInvalidationTests.cs).
- Kiểm thử hiện có: [tests/CulinaryBlog.API.Tests/CategoryLifecycleTests.cs](../../tests/CulinaryBlog.API.Tests/CategoryLifecycleTests.cs).

Cần chạy các test hoặc thao tác phù hợp với nội dung thay đổi. Kết quả suite chung không thay thế việc xác nhận riêng các yêu cầu dịch vụ ngoài.

### Việc còn lại

- Thiếu bộ test chuyên biệt đầy đủ ingredient CRUD và step update/error branches; test tạo recipe có child content không thay thế tất cả endpoint con.
- Search test dùng SQLite fallback, cache test dùng fake/in-memory; chưa xác nhận PostgreSQL FTS và Redis thật qua integration suite.
- Không chạy lại toàn bộ test suite trong lượt audit này; không dùng số test trong tài liệu làm kết quả hiện tại.

- [ ] Người phụ trách xác nhận.
- [ ] Reviewer kiểm tra minh chứng.
- [ ] Cập nhật trạng thái Issue sau nghiệm thu.
