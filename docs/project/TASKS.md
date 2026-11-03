# Đối chiếu nhiệm vụ và minh chứng

Ngày bổ sung hồ sơ: 28/10/2026. Phân công được giữ theo README; tài khoản người phụ trách đã được đối chiếu và Oven được chủ repository xác nhận. Đây là hồ sơ kiểm tra mã nguồn đã có, không thay đổi tác giả/ngày của commit.

Tất cả Issue ban đầu được mở để thành viên xác nhận nghiệm thu. `Có implementation` không có nghĩa đã được review hoặc đã thử đầy đủ trên hạ tầng thật. Không đóng Issue chỉ để tăng số công việc hoàn thành.

## Tổng hợp

| Thành viên | Số task | Có implementation theo audit | Còn yêu cầu hoặc cấu hình |
|---|---:|---:|---:|
| [Nguyễn Đức Thành](https://github.com/2312749-design) | 9 | 3 | 6 |
| [Minh Long](https://github.com/Long10205) | 8 | 3 | 5 |
| [Oven](https://github.com/2314487-Somsavath) | 8 | 3 | 5 |
| [Kina Niê](https://github.com/2312711-kina) | 8 | 1 | 7 |

## Nguyễn Đức Thành

| Task | Công việc | Hiện trạng | Issue |
|---|---|---|---|
| TH-01 | Khởi tạo Solution & Clean Architecture | Còn tiêu chí cần hoàn thiện hoặc kiểm chứng | [#1](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/1) |
| TH-02 | Database & Core Entities | Có implementation, chờ nghiệm thu | [#2](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/2) |
| TH-03 | API Xác thực: Register & Login | Còn tiêu chí cần hoàn thiện hoặc kiểm chứng | [#3](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/3) |
| TH-04 | Refresh Token & CORS | Có implementation, chờ nghiệm thu | [#4](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/4) |
| TH-05 | Google OAuth 2.0 | Cần cấu hình dịch vụ thật | [#5](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/5) |
| TH-06 | Resource-Based Authorization | Còn tiêu chí cần hoàn thiện hoặc kiểm chứng | [#6](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/6) |
| TH-07 | Logout & Profile Management | Có implementation, chờ nghiệm thu | [#7](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/7) |
| TH-08 | API Versioning, Swagger & Global Error Handling | Còn tiêu chí cần hoàn thiện hoặc kiểm chứng | [#8](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/8) |
| TH-09 | Seed Data & Security Tests | Còn tiêu chí cần hoàn thiện hoặc kiểm chứng | [#9](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/9) |

### TH-01 Khởi tạo Solution & Clean Architecture

Người phụ trách: [Nguyễn Đức Thành](https://github.com/2312749-design). Hồ sơ: [Issue #1](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/1).

- [x] Có bốn project Domain, Application, Infrastructure, API và project references theo chiều API → Application/Infrastructure → Application → Domain.
- [ ] Đã cài MediatR và EF Core; phần yêu cầu Mapster trong README chưa có package hoặc cấu hình tương ứng.

Phần còn lại và giới hạn kiểm chứng:

- Dự án hiện dùng ánh xạ DTO thủ công; cần thống nhất lại README hoặc thực hiện Mapster nếu vẫn giữ yêu cầu này.
- Application vẫn tham chiếu EF Core và IApplicationDbContext còn DbSet; cấu trúc bốn tầng đã có nhưng chưa tách persistence tuyệt đối.
- Không chạy lại build hoặc architecture test trong lượt audit này.

### TH-02 Database & Core Entities

Người phụ trách: [Nguyễn Đức Thành](https://github.com/2312749-design). Hồ sơ: [Issue #2](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/2).

- [x] ApplicationUser kế thừa IdentityUser, có Recipe và Category.
- [x] ApplicationDbContext có Fluent API và đăng ký kết nối PostgreSQL; migration khởi tạo và migration mở rộng tồn tại.

Phần còn lại và giới hạn kiểm chứng:

- Hoàn thành ở mức implementation và migration có sẵn; lượt audit này không tạo database mới hoặc chạy lại toàn bộ chuỗi migration từ đầu.

### TH-03 API Xác thực: Register & Login

Người phụ trách: [Nguyễn Đức Thành](https://github.com/2312749-design). Hồ sơ: [Issue #3](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/3).

- [x] Có xử lý đăng ký/đăng nhập bằng PasswordHasher, cấp JWT access token và refresh token, có hai endpoint /api/v1/auth/register và /api/v1/auth/login.
- [ ] Vai trò mặc định khi đăng ký là Author như README.

Phần còn lại và giới hạn kiểm chứng:

- ApplicationUser mặc định Role=User; Register không gán Author. Cần xác nhận chính sách vai trò và đồng bộ README, không tự đổi quyền người dùng chỉ để khớp mô tả.
- Chức năng nằm trong Minimal API AuthHandlers thay vì các lớp RegisterCommand/LoginCommand riêng; đây là khác cách tổ chức mã, không phải thiếu endpoint.
- Các file test được xác định qua mã nguồn; không chạy lại trong lượt audit này.

### TH-04 Refresh Token & CORS

Người phụ trách: [Nguyễn Đức Thành](https://github.com/2312749-design). Hồ sơ: [Issue #4](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/4).

- [x] RefreshToken có trạng thái thu hồi, đã sử dụng, hết hạn và token family; refresh xoay vòng và phát hiện replay.
- [x] CORS dùng allow-list bao gồm frontend localhost:3000 và có chính sách credentials.

Phần còn lại và giới hạn kiểm chứng:

- Đã có test rotation/replay và origin đúng/sai trong source; lượt audit này không chạy lại test.

### TH-05 Google OAuth 2.0

Người phụ trách: [Nguyễn Đức Thành](https://github.com/2312749-design). Hồ sơ: [Issue #5](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/5).

- [x] Frontend nhận Google ID token; backend xác minh chữ ký, audience, thời hạn và email đã xác minh trước khi cấp phiên.
- [x] Tạo tài khoản Google mới hoặc liên kết tài khoản đã tồn tại có kiểm tra an toàn; không tin hồ sơ client tự khai.
- [ ] Đăng nhập Google thật đã được cấu hình và kiểm chứng đầu-cuối.

Phần còn lại và giới hạn kiểm chứng:

- Google Client ID trong cấu hình mẫu đang trống; cần Client ID thật cho backend/frontend và authorized origin/redirect phù hợp.
- Không đọc .env hoặc suy đoán cấu hình riêng; chưa kiểm thử Google thật hoặc tìm thấy test tự động riêng cho flow này.

### TH-06 Resource-Based Authorization

Người phụ trách: [Nguyễn Đức Thành](https://github.com/2312749-design). Hồ sơ: [Issue #6](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/6).

- [x] Tác giả chỉ sửa/xóa recipe của mình; Admin có quyền quản lý recipe.
- [ ] Có RecipeAuthorizationHandler kế thừa AuthorizationHandler như phân công ghi rõ.

Phần còn lại và giới hạn kiểm chứng:

- Hiện kiểm tra owner/Admin trực tiếp trong handler, chưa có resource authorization handler dùng chung. Có thể cập nhật mô tả kiến trúc theo implementation hoặc tách abstraction nếu vẫn giữ yêu cầu lớp riêng.
- Có test từ chối non-owner và người không phải Admin; không chạy lại trong lượt audit này.

### TH-07 Logout & Profile Management

Người phụ trách: [Nguyễn Đức Thành](https://github.com/2312749-design). Hồ sơ: [Issue #7](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/7).

- [x] Logout thu hồi refresh token family của phiên hiện tại, xóa cookie; frontend xóa session.
- [x] Có API xem/cập nhật hồ sơ displayName hoặc FullName, avatarUrl, bio và giao diện hồ sơ.

Phần còn lại và giới hạn kiểm chứng:

- Có test logout và smoke route; chưa thấy test tự động chuyên biệt cập nhật hồ sơ. Lượt này không tạo tài khoản hoặc sửa hồ sơ người dùng.
- Đổi email được tách sang flow xác nhận ở trung tâm bảo mật, không đổi trực tiếp qua form profile.

### TH-08 API Versioning, Swagger & Global Error Handling

Người phụ trách: [Nguyễn Đức Thành](https://github.com/2312749-design). Hồ sơ: [Issue #8](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/8).

- [x] API /api/v1 có Asp.Versioning và Swagger/Scalar hỗ trợ Bearer JWT.
- [x] Có middleware/filter/response chung trả Problem Details; có limiter riêng Login, Register, Upload.
- [ ] Mọi lỗi đều được chuẩn hóa đầy đủ thành AUTH_*, RECIPE_*, CATEGORY_*, VALIDATION_*.

Phần còn lại và giới hạn kiểm chứng:

- Một số lỗi có code (ví dụ Google), nhiều nhánh chỉ có message/detail; middleware exception chưa gắn mã nghiệp vụ đồng nhất.
- Không chạy lại test rate limit/versioning trong lượt audit này.

### TH-09 Seed Data & Security Tests

Người phụ trách: [Nguyễn Đức Thành](https://github.com/2312749-design). Hồ sơ: [Issue #9](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/9).

- [x] Có tài khoản demo Admin/Author và seed ít nhất 20 category, 100 recipe, tối thiểu 10 ingredient/5 step.
- [x] Có test Register, Login, Refresh, Logout, Authorization và Rate Limiting.
- [ ] Có test tự động chuyên biệt xem/sửa Profile như phạm vi đã phân công.

Phần còn lại và giới hạn kiểm chứng:

- Role hiện được lưu trên ApplicationUser.Role và đưa vào JWT, không khẳng định có seed bảng Identity Roles riêng.
- Thiếu test chuyên biệt Profile; danh sách tests ở đây là source có sẵn, không phải kết quả vừa chạy.
- Không query hoặc thay đổi database đang chạy trong lượt audit này.

## Minh Long

| Task | Công việc | Hiện trạng | Issue |
|---|---|---|---|
| ML-01 | Model & Fluent API dữ liệu phụ | Có implementation, chờ nghiệm thu | [#10](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/10) |
| ML-02 | API CRUD Ingredient & Step | Có implementation, chờ nghiệm thu | [#11](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/11) |
| ML-03 | Database cho Full-Text Search | Có implementation, chờ nghiệm thu | [#12](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/12) |
| ML-04 | API Search, Filter, Sort & Pagination | Còn tiêu chí cần hoàn thiện hoặc kiểm chứng | [#13](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/13) |
| ML-05 | Giao diện tìm kiếm | Còn tiêu chí cần hoàn thiện hoặc kiểm chứng | [#14](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/14) |
| ML-06 | Recipe Core CRUD & Lifecycle | Còn tiêu chí cần hoàn thiện hoặc kiểm chứng | [#15](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/15) |
| ML-07 | Redis Cache & Cache Invalidation | Còn tiêu chí cần hoàn thiện hoặc kiểm chứng | [#16](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/16) |
| ML-08 | Recipe/Search Automated Tests | Còn tiêu chí cần hoàn thiện hoặc kiểm chứng | [#17](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/17) |

### ML-01 Model & Fluent API dữ liệu phụ

Người phụ trách: [Minh Long](https://github.com/Long10205). Hồ sơ: [Issue #10](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/10).

- [x] RecipeIngredient có tên, quantity, unit, notes; RecipeStep có thứ tự, title, description, timer.
- [x] Fluent API cấu hình FK RecipeId, giới hạn trường và unique index thứ tự cho ingredient/step.

Phần còn lại và giới hạn kiểm chứng:

- Cấu hình Fluent API nằm trong ApplicationDbContext, không nằm ở các file configuration riêng. Không chạy lại test trong lượt audit này.

### ML-02 API CRUD Ingredient & Step

Người phụ trách: [Minh Long](https://github.com/Long10205). Hồ sơ: [Issue #11](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/11).

- [x] Có GET/POST/PUT/DELETE ingredient và step tại /api/v1/recipes/{recipeId}/ingredients và /steps với kiểm tra quyền sở hữu/Admin.
- [x] Step mới tự gán số; khi xóa đánh lại thứ tự liên tục trong transaction.

Phần còn lại và giới hạn kiểm chứng:

- Hiện dùng Minimal API endpoint handlers, không tách mỗi thao tác thành MediatR Command/Handler riêng; đây là khác cấu trúc so với cách mô tả cũ.
- Test hiện có chứng minh tạo/xóa và renumber step; chưa thấy bộ HTTP test đầy đủ mọi nhánh CRUD ingredient. Không chạy lại test trong lượt này.
- Thiếu invalidation cache ở các endpoint child riêng được ghi tại ML-07.

### ML-03 Database cho Full-Text Search

Người phụ trách: [Minh Long](https://github.com/Long10205). Hồ sơ: [Issue #12](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/12).

- [x] Migration bật unaccent và trigger cập nhật SearchVector từ tiêu đề/mô tả/nguyên liệu đã bỏ dấu.
- [x] Recipe có shadow property SearchVector kiểu tsvector ở persistence và GIN index.

Phần còn lại và giới hạn kiểm chứng:

- SearchContractTests dùng SQLite và nhánh tìm kiếm in-memory; không được coi là kiểm chứng trực tiếp SQL PostgreSQL FTS hoặc hiệu quả GIN. Không chạy lại PostgreSQL integration test trong lượt audit này.

### ML-04 API Search, Filter, Sort & Pagination

Người phụ trách: [Minh Long](https://github.com/Long10205). Hồ sơ: [Issue #13](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/13).

- [x] Search endpoint dùng PostgreSQL FTS, filter category/difficulty/cook time/servings, sort và offset pagination.
- [ ] HTTP contract đúng PagedResult items/totalCount/page/totalPages như README.

Phần còn lại và giới hạn kiểm chứng:

- Handler trả items/total/page/pageSize; lớp chung chuyển HTTP thành data và meta chứa page/pageSize/total/totalPages. Có phân trang, nhưng tên và envelope khác README, cần thống nhất contract/tài liệu hoặc bổ sung adapter.
- Chức năng ở SearchHandlers thay vì lớp SearchRecipesQueryHandler riêng. Không coi khác tên lớp là thiếu search.
- Không chạy lại test trong lượt audit này.

### ML-05 Giao diện tìm kiếm

Người phụ trách: [Minh Long](https://github.com/Long10205). Hồ sơ: [Issue #14](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/14).

- [x] Có thanh tìm kiếm, bộ lọc, recipe card, loading/empty/error và API client chung.
- [ ] Giao diện danh sách kết quả có pagination và tích hợp đầy đủ phân trang của search API.

Phần còn lại và giới hạn kiểm chứng:

- Trang recipes tải catalog rồi filter local và map toàn bộ kết quả; chưa dùng Pagination ở danh sách này.
- Ctrl+K dùng search API nhưng chỉ lấy tối đa 8 gợi ý, không phải trang kết quả phân trang đầy đủ.
- Có component Pagination dùng chung không đồng nghĩa đã tích hợp vào giao diện search. Không chạy lại browser test trong lượt audit này.

### ML-06 Recipe Core CRUD & Lifecycle

Người phụ trách: [Minh Long](https://github.com/Long10205). Hồ sơ: [Issue #15](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/15).

- [x] Có list/detail/create/update/soft delete và publish/unpublish/archive/restore; recipe mới Draft.
- [x] Chỉ Published chưa xóa thuộc category hợp lệ được xem công khai, search và sitemap.
- [ ] Có optimistic concurrency bằng RowVersion/Version và phản hồi conflict khi cập nhật phiên bản cũ.

Phần còn lại và giới hạn kiểm chứng:

- Có UpdatedAt và lịch sử phiên bản nhưng chưa có concurrency token/check phiên bản request; lịch sử sửa không thay thế optimistic concurrency.
- Ba RecipeWorkflowEndpointTests đã được xác nhận đạt ở lượt trước; lượt audit này không chạy lại hoặc mở rộng kết quả đó sang toàn suite.

### ML-07 Redis Cache & Cache Invalidation

Người phụ trách: [Minh Long](https://github.com/Long10205). Hồ sơ: [Issue #16](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/16).

- [x] Có Redis cache cho public recipe list/detail với TTL 5/10 phút và fallback NoOp khi không cấu hình Redis.
- [ ] Mọi thay đổi Recipe/Category/Ingredient/Step/Image đều invalidation đủ cache liên quan.
- [ ] Tự fallback an toàn khi Redis đã cấu hình nhưng không kết nối được hoặc lỗi giữa lúc vận hành.

Phần còn lại và giới hạn kiểm chứng:

- RecipeIngredientsHandlers và RecipeStepsHandlers không inject/call cache invalidator; chi tiết cache có thể cũ sau child CRUD riêng.
- Recipe mutations xóa list/detail cache nhưng chưa xóa categories:all, nên số món category có thể chậm cập nhật theo TTL.
- RedisCacheService không bắt lỗi kết nối; Program gọi Connect trực tiếp. NoOp chỉ áp dụng nếu connection string trống, không bảo đảm fail-open khi Redis lỗi.
- Test cache hiện dùng fake/in-memory cache, chưa kiểm chứng Redis thật bị ngắt kết nối; không chạy lại test trong lượt này.

### ML-08 Recipe/Search Automated Tests

Người phụ trách: [Minh Long](https://github.com/Long10205). Hồ sơ: [Issue #17](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/17).

- [x] Có test recipe workflow/lifecycle gồm create, publish, unpublish, archive, restore, soft delete và phân quyền.
- [ ] Có test đầy đủ Ingredient/Step CRUD và renumber step.
- [x] Có test tiếng Việt có/không dấu, filter kết hợp, sort, phân trang ổn định và tham số sai.
- [ ] Có test invalidation list/detail recipe và category; có test Redis thật/failure fallback.

Phần còn lại và giới hạn kiểm chứng:

- Thiếu bộ test chuyên biệt đầy đủ ingredient CRUD và step update/error branches; test tạo recipe có child content không thay thế tất cả endpoint con.
- Search test dùng SQLite fallback, cache test dùng fake/in-memory; chưa xác nhận PostgreSQL FTS và Redis thật qua integration suite.
- Không chạy lại toàn bộ test suite trong lượt audit này; không dùng số test trong tài liệu làm kết quả hiện tại.

## Oven

| Task | Công việc | Hiện trạng | Issue |
|---|---|---|---|
| OV-01 | Validation Recipe Form | Còn tiêu chí cần hoàn thiện hoặc kiểm chứng | [#18](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/18) |
| OV-02 | Form Tạo Recipe Đa Bước | Còn tiêu chí cần hoàn thiện hoặc kiểm chứng | [#19](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/19) |
| OV-03 | Xử lý lỗi & Toast | Còn tiêu chí cần hoàn thiện hoặc kiểm chứng | [#20](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/20) |
| OV-04 | Cài đặt Hangfire | Có implementation, chờ nghiệm thu | [#21](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/21) |
| OV-05 | Welcome Email Job | Còn tiêu chí cần hoàn thiện hoặc kiểm chứng | [#22](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/22) |
| OV-06 | Category CRUD & Category UI | Có implementation, chờ nghiệm thu | [#23](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/23) |
| OV-07 | Author Recipe Dashboard | Có implementation, chờ nghiệm thu | [#24](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/24) |
| OV-08 | Frontend Common Components & Integration Tests | Còn tiêu chí cần hoàn thiện hoặc kiểm chứng | [#25](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/25) |

### OV-01 Validation Recipe Form

Người phụ trách: [Oven](https://github.com/2314487-Somsavath). Hồ sơ: [Issue #18](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/18).

- [ ] Schema validation Recipe ở frontend
- [ ] Tiêu đề tối thiểu 5 ký tự
- [x] Có Ingredient và Step; backend kiểm tra độc lập

Phần còn lại và giới hạn kiểm chứng:

- Backend DTO hiện MinLength(3), frontend chỉ kiểm tra tiêu đề không rỗng; không đúng mốc 5 trong README.
- Wizard dùng kiểm tra thủ công, chưa có schema và lỗi từng trường; nút Hoàn tất gọi handleSubmit trực tiếp nên bước 3 không chạy nhánh validation trong nextStep. Backend vẫn chặn nội dung dưới 10 nguyên liệu/5 bước.
- Chỉ rà source/test hiện có; không chạy lại test hoặc thay đổi dữ liệu trong đợt audit này.

### OV-02 Form Tạo Recipe Đa Bước

Người phụ trách: [Oven](https://github.com/2314487-Somsavath). Hồ sơ: [Issue #19](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/19).

- [x] Có route /recipes/new và form nhiều bước
- [x] Thêm/xóa Ingredient và Step động
- [ ] Lỗi từng trường và preview dữ liệu trước khi gửi
- [x] Trạng thái đang gửi, khóa nút gửi lặp

Phần còn lại và giới hạn kiểm chứng:

- Chỉ toast lỗi chung, chưa có validation message gắn từng field hoặc màn hình preview tổng hợp.
- Route smoke chỉ chứng minh trang render; chưa thấy browser test hoàn chỉnh nhập wizard, thêm/xóa dòng, upload ảnh và gửi thành công.

### OV-03 Xử lý lỗi & Toast

Người phụ trách: [Oven](https://github.com/2314487-Somsavath). Hồ sơ: [Issue #20](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/20).

- [x] API client chung xử lý response lỗi và Problem Details
- [x] Toast thân thiện, tự đóng sau 5 giây và đóng thủ công
- [x] ToastContainer duy nhất ở provider chung
- [ ] Có kiểm thử riêng đủ 400,401,403,404,409,422,500 trên frontend

Phần còn lại và giới hạn kiểm chứng:

- Cơ chế generic nhận status và nội dung Problem Details đã có; chưa thấy test frontend bao phủ từng mã lỗi được README liệt kê.
- Một số lỗi backend trả tiếng Anh sẽ được hiển thị nguyên văn, chưa có bảng thông điệp thân thiện riêng cho mọi mã.

### OV-04 Cài đặt Hangfire

Người phụ trách: [Oven](https://github.com/2314487-Somsavath). Hồ sơ: [Issue #21](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/21).

- [x] Hangfire sử dụng PostgreSQL Storage
- [x] Hangfire Server được đăng ký và chạy trong backend
- [x] Dashboard /hangfire chỉ cho Admin đã đăng nhập

Phần còn lại và giới hạn kiểm chứng:

- Hoàn thành về cài đặt source; audit này không khởi động runtime hoặc thử đăng nhập dashboard.
- Chưa thấy integration test riêng chứng minh dashboard 401/403/Admin access.

### OV-05 Welcome Email Job

Người phụ trách: [Oven](https://github.com/2314487-Somsavath). Hồ sơ: [Issue #22](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/22).

- [x] WelcomeEmailJob gọi email sender gửi lời chào
- [x] Enqueue job sau đăng ký thành công
- [x] Retry và log kết quả job
- [ ] Cấu hình SMTP thật để thư gửi ra hộp thư

Phần còn lại và giới hạn kiểm chứng:

- Email:Enabled=false, SMTP host/from/credential trong config mẫu đang trống; đăng ký thành công hoặc job thành công khi email disabled không chứng minh thư được gửi.
- Cần người dùng cấu hình SMTP thật qua secret/env và kiểm chứng email nhận được; không đưa mật khẩu thật vào issue/README.
- Auth contract test không phải kiểm thử gửi SMTP thật.

### OV-06 Category CRUD & Category UI

Người phụ trách: [Oven](https://github.com/2314487-Somsavath). Hồ sơ: [Issue #23](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/23).

- [x] API danh sách/chi tiết Category
- [x] Admin Create/Update/Soft Delete Category
- [x] Không xóa Category còn Recipe chưa soft delete
- [x] Trang Category và giao diện quản lý cho Admin

Phần còn lại và giới hạn kiểm chứng:

- Hoàn thành theo source và test đã có; chưa thực hiện lại thao tác CRUD trên runtime trong audit này.

### OV-07 Author Recipe Dashboard

Người phụ trách: [Oven](https://github.com/2314487-Somsavath). Hồ sơ: [Issue #24](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/24).

- [x] Trang quản lý Recipe của tác giả và API /recipes/mine
- [x] Hiển thị Draft/Published/Archived
- [x] Edit/Publish/Unpublish/Archive/Restore/Delete và Toast
- [x] Tác giả chỉ quản lý món mình, Admin quản lý tất cả

Phần còn lại và giới hạn kiểm chứng:

- Đánh giá hoàn thành chức năng source; chưa có browser test xuyên suốt mọi nút chuyển trạng thái và chưa chạy lại runtime trong audit này.

### OV-08 Frontend Common Components & Integration Tests

Người phụ trách: [Oven](https://github.com/2314487-Somsavath). Hồ sơ: [Issue #25](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/25).

- [x] Header/Footer/Layout và Loading/Error/Empty/Pagination chung
- [x] Auth Store và Protected Route
- [ ] Test frontend Register→Login→Create→Publish→Search→Logout
- [ ] Test responsive Login/Form/Detail/Dashboard

Phần còn lại và giới hạn kiểm chứng:

- 23 browser tests hiện tại chủ yếu smoke/navigation/cosmic UI; không thay thế full business-flow E2E theo README.
- Responsive test hiện tập trung header/dropdown, chưa thấy ma trận mobile cho đủ bốn màn hình được giao.
- ProtectedRoute còn dựa session user phía client để quyết định render; backend mới là nơi thực thi bảo mật thực sự.

## Kina Niê

| Task | Công việc | Hiện trạng | Issue |
|---|---|---|---|
| KN-01 | Tích hợp MinIO Object Storage | Còn tiêu chí cần hoàn thiện hoặc kiểm chứng | [#26](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/26) |
| KN-02 | API Upload Ảnh An Toàn | Có implementation, chờ nghiệm thu | [#27](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/27) |
| KN-03 | Xóa Ảnh & Dọn File | Còn tiêu chí cần hoàn thiện hoặc kiểm chứng | [#28](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/28) |
| KN-04 | UI Trang Chi Tiết Recipe | Còn tiêu chí cần hoàn thiện hoặc kiểm chứng | [#29](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/29) |
| KN-05 | SEO & Tối Ưu Hình Ảnh | Còn tiêu chí cần hoàn thiện hoặc kiểm chứng | [#30](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/30) |
| KN-06 | Image Processing & Thumbnail Job | Còn tiêu chí cần hoàn thiện hoặc kiểm chứng | [#31](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/31) |
| KN-07 | Sitemap & SEO Completion | Còn tiêu chí cần hoàn thiện hoặc kiểm chứng | [#32](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/32) |
| KN-08 | Health Check, Logging, Docker & CI/CD | Còn tiêu chí cần hoàn thiện hoặc kiểm chứng | [#33](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/33) |

### KN-01 Tích hợp MinIO Object Storage

Người phụ trách: [Kina Niê](https://github.com/2312711-kina). Hồ sơ: [Issue #26](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/26).

- [x] Có cấu hình MinIO bằng appsettings/env
- [x] IFileStorageService và triển khai MinIO upload/delete
- [x] Cấu hình triển khai lấy key/password qua biến môi trường
- [ ] MinIO đang được bật trong cấu hình local mặc định

Phần còn lại và giới hạn kiểm chứng:

- Local appsettings Minio:Enabled=false; Compose bật true. Không được suy ra local đang dùng MinIO khi chỉ nhìn có client.
- Config có demo minioadmin, không phải credential production; audit này không rà toàn bộ lịch sử Git để bảo đảm chưa từng lộ secret.
- Cần kiểm thử upload/delete trên MinIO runtime thật; không gọi dịch vụ trong đợt audit này.

### KN-02 API Upload Ảnh An Toàn

Người phụ trách: [Kina Niê](https://github.com/2312711-kina). Hồ sơ: [Issue #27](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/27).

- [x] POST /api/v1/recipes/{id}/images nhận multipart/form-data
- [x] Giới hạn 5 MB và xác minh định dạng bằng nội dung thực
- [x] Chỉ chấp nhận JPEG/PNG/WebP/AVIF, xác định MIME thực
- [x] Kiểm tra quyền chủ sở hữu Recipe hoặc Admin

Phần còn lại và giới hạn kiểm chứng:

- Validator cố ý dùng định dạng giải mã thực thay vì tin MIME client; file khai MIME sai nhưng nội dung ảnh hợp lệ được nhận an toàn.
- Có test AVIF thật và nội dung giả ảnh; audit này không chạy lại test hoặc gửi upload runtime.
- Rule thực tế là authenticated owner/Admin; không có yêu cầu role Author riêng tại upload route.

### KN-03 Xóa Ảnh & Dọn File

Người phụ trách: [Kina Niê](https://github.com/2312711-kina). Hồ sơ: [Issue #28](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/28).

- [x] Xóa ảnh riêng lẻ khỏi storage và cập nhật ảnh chính
- [ ] Chỉ xóa file sau khi đảm bảo không còn tham chiếu ở nơi khác
- [x] Hangfire dọn orphan files
- [x] Soft delete Recipe không xóa ảnh để còn restore

Phần còn lại và giới hạn kiểm chứng:

- Endpoint DeleteRecipeImage xóa ba URL của ảnh trực tiếp sau khi xóa record, chưa truy vấn kiểm tra URL/key có được Recipe/Step/nội dung khác tham chiếu hay không.
- StorageMaintenanceJob có tập tham chiếu đầy đủ và giữ ảnh của Recipe soft-delete; điều này không sửa được nhánh xóa trực tiếp nêu trên.
- Chưa xác minh retry/race giữa thumbnail job đang chạy và thao tác xóa ảnh.

### KN-04 UI Trang Chi Tiết Recipe

Người phụ trách: [Kina Niê](https://github.com/2312711-kina). Hồ sơ: [Issue #29](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/29).

- [x] Có route /recipes/[id], đọc ID hoặc slug
- [ ] Hiển thị ảnh món chính trên trang chi tiết
- [x] Hiển thị tác giả, Category, Ingredient, Step, thời gian, khẩu phần, dinh dưỡng
- [x] Người xem công khai chỉ đọc Recipe Published chưa xóa

Phần còn lại và giới hạn kiểm chứng:

- RecipeDetailPage hiện không có phần render ảnh chính/gallery của recipe; RecipeProPanel không render ảnh món chính để bù phần này.
- Tác giả ở meta đang hiện authorId thay vì tên/avatar/link hồ sơ; có dữ liệu nhưng UX chưa đúng kỳ vọng trang chi tiết chuyên nghiệp.
- Author/Admin có thể xem món riêng tư theo phân quyền; Published-only áp dụng khách công khai.

### KN-05 SEO & Tối Ưu Hình Ảnh

Người phụ trách: [Kina Niê](https://github.com/2312711-kina). Hồ sơ: [Issue #30](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/30).

- [ ] Dùng next/image và cấu hình remote image
- [x] Có Open Graph metadata cơ bản
- [x] Recipe Published có Schema.org JSON-LD @type Recipe

Phần còn lại và giới hạn kiểm chứng:

- Ảnh món hiện dùng thẻ img; chưa có next/image/remotePatterns.
- Metadata từng Recipe hiện có title/description/canonical nhưng chưa Open Graph riêng với tên/ảnh món; metadata toàn site chưa đủ yêu cầu SEO chi tiết.

### KN-06 Image Processing & Thumbnail Job

Người phụ trách: [Kina Niê](https://github.com/2312711-kina). Hồ sơ: [Issue #31](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/31).

- [x] Background Job resize sau upload
- [x] Thumbnail và medium WebP
- [x] Lưu original URL và thumbnail URL
- [ ] Lưu metadata size và content type của ảnh
- [ ] Card dùng thumbnail, Detail dùng ảnh gốc

Phần còn lại và giới hạn kiểm chứng:

- RecipeImage chưa có SizeBytes/ContentType; validator có ContentType trong bộ nhớ nhưng không lưu vào metadata entity.
- Card hiện render recipe.imageUrl gốc; Detail chưa render ảnh chính, nên chưa đạt phân luồng thumbnail/original.
- URL thumbnail được trả trước khi job hoàn tất; chưa có trạng thái ready/fallback rõ trong UI.

### KN-07 Sitemap & SEO Completion

Người phụ trách: [Kina Niê](https://github.com/2312711-kina). Hồ sơ: [Issue #32](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/32).

- [x] Sitemap động chỉ Recipe Published chưa soft delete
- [ ] Open Graph riêng cho Home/Category/Recipe Detail
- [x] Schema.org Recipe JSON-LD và serialize an toàn
- [ ] Kiểm tra ảnh MinIO qua next/image

Phần còn lại và giới hạn kiểm chứng:

- Sitemap lọc thêm category visible/nondeleted; nếu API lỗi thì trả sitemap các trang tĩnh, không phải xác nhận dữ liệu công thức runtime.
- Chưa next/image/remotePatterns hoặc kiểm thử MinIO image optimizer.
- Chưa có metadata riêng đầy đủ cho Category/Recipe, hiện thừa hưởng Open Graph chung của site.

### KN-08 Health Check, Logging, Docker & CI/CD

Người phụ trách: [Kina Niê](https://github.com/2312711-kina). Hồ sơ: [Issue #33](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/33).

- [x] Health API/PostgreSQL/Redis/MinIO
- [x] Serilog structured logging và Correlation ID
- [x] OpenTelemetry tracing/metrics
- [x] Dockerfiles/Compose/Nginx
- [x] Có GitHub Actions build backend/test backend/build frontend/validate Compose
- [ ] CI validate Compose cung cấp đủ biến bắt buộc và trigger đúng nhánh đang nộp

Phần còn lại và giới hạn kiểm chứng:

- Step validate Compose hiện chỉ cấp JWT_SECRET, trong khi Compose yêu cầu POSTGRES_PASSWORD, MINIO_ROOT_USER, MINIO_ROOT_PASSWORD; cần giá trị giả an toàn riêng cho validation.
- Trigger workflow hiện main/master/nguyeducthanhlab06; nhánh lab07 không tự trigger theo file hiện tại.
- Local OTLP endpoint trống, Compose đặt collector; source instrumentation không chứng minh trace đã tới collector.
- Audit này không xác nhận toàn stack Docker chạy từ đầu hay Actions thành công; cần URL run và minh chứng runtime.
