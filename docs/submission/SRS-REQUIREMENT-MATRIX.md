# Ma trận yêu cầu SRS Culinary Blog

Đối chiếu bản SRS 1.0.0, nội dung chi tiết trang 17–44. “Có” nghĩa là có phần cài đặt; không tự suy ra nghiệm thu đủ mọi nhánh. Kết quả runtime và các giới hạn được ghi trong TEST-RESULTS-2026-11-13.md. Các bài kiểm tra cũ không tự được coi là kết quả của bản mới.

## Yêu cầu chức năng

| Mã | Yêu cầu | API hoặc UI | Bằng chứng và phần còn lại |
| --- | --- | --- | --- |
| FR-AUTH-001 | Đăng ký | POST auth/register; /auth/register | Runtime tạo Author; AuthEndpointContractTests; cần đối chiếu UX và thông báo lỗi đầy đủ |
| FR-AUTH-002 | Local login | POST auth/login; /auth/login | Runtime và Chromium form thật; cookie HttpOnly |
| FR-AUTH-003 | Google OAuth | Google credential trên màn login; auth/google | Có code xác minh ID token; chưa có credential và kết quả Google thật; khác authorization-code/Auth.js trong SRS |
| FR-AUTH-004 | Refresh token | POST auth/refresh | Runtime refresh cookie; AuthControllerTests rotation/replay |
| FR-AUTH-005 | Logout | POST auth/logout | Runtime logout và refresh sau logout bị từ chối; UI cần theo kết quả browser cuối |
| FR-AUTH-006 | Xem hồ sơ | GET auth/me; /profile | Runtime guest 401 và owner đọc được; profile tồn tại sau reload |
| FR-AUTH-007 | Sửa hồ sơ | PATCH auth/me và PUT account/profile | Runtime và browser lưu tên/bio/avatar; handler account còn trực tiếp persistence |
| FR-CAT-001 | Danh sách danh mục | GET categories; /categories | Runtime ≥20; GetCategoriesQueryHandler; ISR |
| FR-CAT-002 | Chi tiết và recipe theo danh mục | GET categories/{id hoặc slug} | Application query mới; test HTTP kiểm recipe Published có CategoryId đúng; browser link slug |
| FR-CAT-003 | Tạo danh mục | POST categories; dashboard/categories | Command/validator; CategoryLifecycle/RecipeWorkflow tests; Admin-only |
| FR-CAT-004 | Sửa danh mục | PUT categories/{id} | Command/validator; kiểm tra trùng tên và cache; cần riêng đầy đủ contract test mỗi lỗi |
| FR-CAT-005 | Xóa danh mục | DELETE categories/{id} | Soft delete, chặn category còn recipe hoạt động; CategoryLifecycleTests |
| FR-RCP-001 | Danh sách công thức | GET recipes; /recipes | Public Published; SSR pagination; search contract |
| FR-RCP-002 | Chi tiết công thức | GET recipes/{id}, recipes/slug/{slug} | Runtime; ISR 300; metadata/JSON-LD; xử lý slug tiếng Việt đã sửa |
| FR-RCP-003 | Tạo công thức | POST recipes; dashboard/recipes/new | Command/validator; runtime 201 Draft; thiếu số không còn 500; form wizard |
| FR-RCP-004 | Cập nhật công thức | PUT/PATCH recipes/{id} | Update command; giữ structured metadata; If-Match; PATCH legacy chưa chuyển hết CQRS |
| FR-RCP-005 | Publish | POST/PATCH recipes/{id}/publish | Transition command; owner/Admin; runtime public đọc và search thấy |
| FR-RCP-006 | Archive | POST/PATCH recipes/{id}/archive | Transition command; runtime trạng thái lưu qua request mới |
| FR-RCP-007 | Soft delete | DELETE recipes/{id} | Runtime non-owner 403, owner xóa, public không thấy; command và domain soft delete qua MediatR |
| FR-RCP-008 | Quản lý ảnh recipe | POST images, PUT primary, DELETE image | Runtime PNG thật, MinIO đọc được, Hangfire tạo biến thể, xóa ảnh chính cập nhật recipe; test quyền/5MB |
| FR-RCP-009 | CRUD nguyên liệu | recipes/{id}/ingredients | Application read/write, ordered rows; runtime add/update/delete/reindex; test danh mục ẩn |
| FR-RCP-010 | CRUD bước | recipes/{id}/steps | Application read/write; runtime reindex và metadata; test Draft/owner/Admin |
| FR-SRCH-001 | Full-text search | GET search/recipes?q= | PostgreSQL thực; runtime tìm recipe Published; service FTS tiếng Việt |
| FR-SRCH-002 | Lọc | categoryId, difficulty, maxMinutes, vegetarian | Search validator/service; frontend có category/difficulty; các filter còn lại có API, cần đối chiếu UI đủ trường |
| FR-SRCH-003 | Sắp xếp | sortBy, sortOrder | Service và URL state; UI hiện mặc định chiều giảm dần, cần lựa chọn chiều trên UI nếu muốn đủ linh hoạt |
| FR-SRCH-004 | Phân trang | page, pageSize | Runtime metadata; API-client unit test; SSR trước/sau |
| FR-FILE-001 | Upload MinIO | media/images và recipe images | MIME, magic bytes, 5MB, tên lưu an toàn; runtime MinIO thật; không chỉ check extension |
| FR-FILE-002 | Xóa tệp | media và recipe image delete | Có service/owner authorization; runtime xóa ảnh recipe; cần kiểm thêm orphan cleanup khi storage lỗi |
| FR-JOB-001 | Email chào mừng | Hangfire email job | MailHog nhận welcome/reset, token dùng được và chống replay; SMTP production vẫn cần credential thật |
| FR-JOB-002 | Biến thể ảnh | ImageProcessingJob | Runtime thumbnail và medium đều truy cập được |
| FR-JOB-003 | Sitemap | SitemapGenerationJob; /sitemap.xml | Có recipe/category/static pages, lịch 02:00 UTC; Search Console ngoài hệ thống chưa xác nhận |
| FR-OBS-001 | Health checks | /health, /health/live, /health/ready | Docker DB/Redis/MinIO Healthy; cần kiểm riêng suy giảm khi dependency down |
| FR-OBS-002 | Structured logs | Serilog, correlation middleware | Có request/status/timing/trace và LoggingBehavior cho CQRS; slow command cảnh báo, không ghi payload chứa secret |
| FR-OBS-003 | Trace và metrics | OpenTelemetry, collector, Jaeger/Prometheus | Compose chạy; chưa suy ra mọi business metric/DB span đúng nếu chưa xem trace cụ thể |

## Yêu cầu phi chức năng

| Mã | Tiêu chí | Trạng thái và cách xác minh |
| --- | --- | --- |
| NFR-PERF-001 | p50≤150ms, p95≤500ms, p99≤1000ms | Cần xem kết quả k6 thực; một bài GET không bao phủ write API; không công bố SLA production từ test local |
| NFR-PERF-002 | ≥100 người dùng, máy 2vCPU/4GB | k6 cấu hình 100 VU; phần cứng máy hiện tại khác chuẩn, phải ghi giới hạn đo |
| NFR-PERF-003 | Cache hit ≥80%, TTL/invalidation | TTL category/detail/search đã đặt 30/5/1 phút và có generation invalidation; lần đo cũ 50% đã phát hiện khóa generation chưa khởi tạo, đã sửa nguyên tử nhưng phải đo lại trước khi tuyên bố ≥80% |
| NFR-PERF-004 | Query/index/N+1/slow SQL | Detail có Include/AsSplitQuery; search có projection; cần EXPLAIN ANALYZE và review các query danh sách/aggregate |
| NFR-PERF-005 | Core Web Vitals, bundle≤200KB | Có Lighthouse; cần kết quả sau sửa; lab Lighthouse không đo thay INP thực địa |
| NFR-SEC-001 | Hash password | Identity PasswordHasher; không lưu plaintext; Auth tests |
| NFR-SEC-002 | JWT/refresh rotation | Cookie HttpOnly và rotation/revoke; tests/runtimes; HTTPS production chưa xác nhận |
| NFR-SEC-003 | Rate limiting | API chung 100 request/phút/IP, auth 10 request/phút/IP; registration/upload có ngân sách riêng; 429 trả Retry-After và Problem Details |
| NFR-SEC-004 | Input validation | FluentValidation pipeline lõi, Domain và form; còn endpoint legacy dùng DataAnnotations; không tuyên bố tất cả đã chuyển |
| NFR-SEC-005 | HTTPS | Có production nginx/compose; cần chứng chỉ/domain thật và kiểm mixed-content/Secure cookie |
| NFR-SEC-006 | CORS | Allow-list config, tests; bảo vệ thêm CSRF/authorization vì CORS không chặn non-browser |
| NFR-SEC-007 | Secret management | .env.example không secret thật; artifacts/private compose không commit; production cần chủ dự án quản lý |
| NFR-USE-001 | Responsive | Có layout responsive; cần thử desktop/mobile và menu dài bằng browser |
| NFR-USE-002 | WCAG AA | axe 4/4 trang đạt sau khi sửa contrast; vẫn cần kiểm thủ công bàn phím, screen reader và nội dung thay đổi động |
| NFR-USE-003 | Lỗi dễ hiểu | Problem Details và UI error/loading; thiếu số trả 422; phải kiểm không rò stack/secret |
| NFR-USE-004 | Phản hồi thao tác | Loading/disabled/toast; regression upload retry/chống submit trùng; kiểm browser |
| NFR-REL-001 | Uptime | Health checks có; uptime dài hạn chưa thể chứng minh trong phiên nghiệm thu |
| NFR-REL-002 | Error handling/retry | Middleware và job retry; cần test mất Redis/MinIO; không coi có catch là đủ reliability |
| NFR-REL-003 | Backup dữ liệu | Có dump/restore DB riêng và so sánh số bản ghi; lịch 03:00/retention30 cần vận hành thực |
| NFR-MAINT-001 | Code standards/static analysis/review | Lint frontend có; .editorconfig chưa thay StyleCop/Sonar và review người thật |
| NFR-MAINT-002 | Coverage/integration/E2E | Application line ≥80 đã đạt; integration happy/error cho mọi endpoint chưa đủ; browser lấy số lần cuối |
| NFR-MAINT-003 | API documentation | Swagger /api/v1; kiểm runtime tài liệu và mô tả lỗi; chưa suy ra đủ schema mọi response |
| NFR-MAINT-004 | Git và review | Có repo, chưa commit/push thay người dùng; cần PR/review và phân công xác thực |
| NFR-SCALE-001 | Stateless/scale ngang | JWT và Redis hỗ trợ; cookies/data-protection keys cần dùng chung; chưa load test nhiều instance |
| NFR-SCALE-002 | Connection pool | Npgsql pool có; cần kiểm sizing và read replica thật nếu triển khai |
| NFR-SCALE-003 | Background work | Hangfire và storage; cần kiểm queue/retry/shutdown dưới tải |
| NFR-SEO-001 | Recipe JSON-LD | Có schema và unit test escape script; chưa xác nhận Google Rich Results thực |
| NFR-SEO-002 | Metadata/canonical | Có server metadata; cần kiểm title/description/OG từng loại trang và ảnh chia sẻ |
| NFR-SEO-003 | Sitemap/robots | Có sitemap; cần đối chiếu robots.txt và Search Console production |
| NFR-SEO-004 | URL thân thiện | Có slug; sửa double-encoding tiếng Việt; slug cũ Unicode được giữ để không phá liên kết |

## Giảng viên có thể nhận xét gì

1. Phạm vi mở rộng lớn hơn phần lõi, nhưng menu SRS đã được thu gọn. Cần demo phần bắt buộc trước, không dùng âm nhạc/AI/community để thay bằng chứng CRUD, quyền, validation và test.
2. Cấu trúc bốn layer đúng hướng nhưng còn logic persistence ở API. Cần di chuyển từng use case kèm test; thêm command chỉ gọi lại API handler không hoàn thành Dependency Rule về hành vi.
3. Dữ liệu seed nhiều hơn mức tối thiểu không làm tăng điểm nếu nội dung lặp. Phải giải thích tính ngẫu nhiên, quan hệ, uniqueness và tính lặp lại của seed; không tự sửa dữ liệu tác giả thật.
4. Mã nguồn có chức năng nhưng thiếu minh chứng thực tế vẫn là phần chưa nghiệm thu. OAuth, email, TLS, performance, review và đóng góp từng thành viên phải được nói chính xác.
5. Các số liệu cũ khác nhau phải có thời điểm và phạm vi đo. Ưu tiên TEST-RESULTS mới nhất và Cobertura, không chụp con số từ đoạn chat làm chứng cứ.
