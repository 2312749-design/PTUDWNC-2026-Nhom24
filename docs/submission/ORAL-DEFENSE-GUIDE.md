# Cẩm nang vấn đáp Culinary Blog

Đối chiếu trực tiếp với `Cau_Hoi_On_Tap.pdf`, cập nhật ngày 12/11/2026.

## Cách trả lời

Mỗi câu nên nói theo thứ tự: **định nghĩa → lựa chọn của dự án → chỉ vào mã thật → trade-off**. Không nói dự án đã chạy dịch vụ thật nếu mới có cấu hình hoặc test mock.

## PHẦN I – 20 câu lý thuyết

### 1. Monolithic Architecture

Culinary Blog là **layered/modular monolith**: một API deploy chung, các module dùng chung database. Ưu điểm là phát triển, debug, transaction và deploy đơn giản; nhược điểm là coupling, phải build/deploy toàn hệ thống và khó scale riêng từng module. Với nhóm nhỏ, đồ án có nghiệp vụ còn thay đổi và tải chưa cần tách độc lập, monolith là lựa chọn hợp lý. Khi ranh giới nghiệp vụ và nhu cầu scale rõ hơn mới cân nhắc tách dịch vụ.

### 2. Dependency Rule

Phụ thuộc chỉ hướng vào trong: Domain không phụ thuộc tầng khác; Application chỉ phụ thuộc Domain; Infrastructure triển khai abstraction; API là composition root. Application không import Infrastructure vì use case sẽ bị gắn với EF/PostgreSQL, khó test và khó thay công nghệ. Dự án đã bỏ EF Core và `IApplicationDbContext` khỏi Application; architecture test kiểm tra references.

### 3. PUT và PATCH

PUT thay thế biểu diễn đầy đủ và nên idempotent; PATCH chỉ cập nhật các trường được gửi. Ví dụ `PUT /api/v1/recipes/{id}` gửi toàn bộ title, category, time, ingredients và steps; `PATCH` dùng khi chỉ đổi nutrition hoặc title. Cả hai dùng `If-Match` để chống ghi đè phiên bản mới hơn.

### 4. Cursor và Offset pagination

Cursor ổn định hơn khi dữ liệu liên tục thêm/xóa, hiệu quả với bảng lớn và tránh bỏ/trùng item; đổi lại không thuận tiện nhảy tới trang bất kỳ. Offset dễ hiểu, cho phép page number và phù hợp dữ liệu đồ án. Culinary Blog dùng offset/page vì UI cần nhảy trang và quy mô hiện tại vừa phải; với feed lớn có thể chuyển cursor theo `(CreatedAt, Id)`.

### 5. DTO

DTO giữ API contract độc lập với entity/database, chỉ công khai trường cần thiết và là nơi validation/mapping. Trả entity trực tiếp dễ lộ navigation, refresh token hoặc trường nội bộ, tạo vòng lặp JSON, over-posting và làm thay đổi schema DB phá API. Dự án map `Recipe` sang `RecipeDto` bằng Mapster với cấu hình bỏ qua navigation cần nạp riêng.

### 6. Authentication và Authorization

Authentication trả lời “ai đang gọi”; Authorization trả lời “người đó được làm gì trên tài nguyên này”. Xem/cập nhật hồ sơ cần đăng nhập; sửa/xóa/publish recipe cần đăng nhập **và** là owner hoặc Admin. `RecipeAuthorizationHandler` tập trung các rule Read/Update/Delete/Publish/Archive/ManageImage.

### 7. JWT stateless

Access JWT tự chứa claims và được xác minh bằng chữ ký mà không cần đọc session DB. Ưu điểm: scale ngang dễ, giảm lookup; nhược điểm: khó thu hồi ngay, token có thể cũ và phải bảo vệ khóa/thời hạn. Dự án là mô hình hybrid: access JWT stateless, refresh token stateful trong DB để rotation, revoke và phát hiện replay.

### 8. CORS không phải bảo mật API

CORS là chính sách của browser, chỉ hạn chế JavaScript đọc response xuyên origin. curl, Postman, server của kẻ tấn công hoặc request form vẫn gọi API được; XSS cùng origin cũng không bị CORS chặn. Vì vậy dự án vẫn cần authentication, authorization, validation, rate limit và CSRF token/Origin check cho cookie authentication.

### 9. Resource-based authorization

Quyền phụ thuộc cả user và chính resource, không chỉ role. Trong Culinary Blog, Author chỉ sửa recipe có `AuthorId` của mình, Admin quản lý mọi recipe, public chỉ đọc Published. Ví dụ ngoài dự án: nhân viên chỉ sửa phiếu nghỉ do mình tạo, quản lý phòng được duyệt phiếu của nhân viên thuộc phòng.

### 10. Repository trên EF Core

Repository mô tả thao tác theo nghiệp vụ, che truy vấn EF/PostgreSQL khỏi use case, cho phép mock/fake và đảo chiều phụ thuộc. Nếu Application dùng DbContext trực tiếp, test phải hiểu EF và đổi persistence ảnh hưởng use case. Không cần bọc EF bằng CRUD chung vô nghĩa; repository nên có phương thức có ý nghĩa như search/published/owner.

### 11. Unit of Work

Repository quản lý tập entity; Unit of Work gom thay đổi từ nhiều repository vào một transaction/commit. Ví dụ dữ liệu Lab 2 lưu Recipe, 10 Ingredient và 5 Step; công thức người dùng chỉ cần tối thiểu 1/1: nếu một phần lỗi thì toàn bộ rollback; chỉ `SaveChanges` một lần. Repository một mình không đảm bảo nhiều thay đổi commit nguyên tử.

### 12. Cartesian Explosion

Join một recipe với 10 steps và 15 ingredients tạo `10 × 15 = 150` rows, dữ liệu recipe bị lặp. `AsSplitQuery()` dùng ba result set, xấp xỉ `1 + 10 + 15 = 26` rows. Đổi lại có thêm round trips và cần chú ý tính nhất quán giữa các query. Dự án dùng hai collection navigation và `AsSplitQuery` ở truy vấn chi tiết.

### 13. RSC và Client Component

RSC chạy trên server, fetch trực tiếp, không đưa code component vào bundle client và tốt cho nội dung/SEO; không dùng state, effect hay browser API. Client Component cần `use client` cho sự kiện và state. Trang recipe hiện fetch và render title, ảnh, ingredients, steps, nutrition trên server; share, review, comment, sửa/xóa nằm trong `RecipeActions` client.

### 14. Auth.js cookie HttpOnly và localStorage

JavaScript không đọc được cookie HttpOnly nên XSS không lấy token trực tiếp như localStorage. Tuy vậy XSS vẫn có thể dùng browser gửi request bằng cookie, vì thế cần CSP, output encoding và CSRF protection. Nếu access token backend được đưa vào session rồi trả ra client, nó trở lại phạm vi JavaScript và giảm lợi ích HttpOnly. Dự án không dùng Auth.js; dùng cookie HttpOnly tự xây theo cùng nguyên tắc.

### 15. Bốn loại state

- Server state: dữ liệu API, có stale/cache/refetch → TanStack Query.
- Client state: auth metadata hoặc UI dùng chung → Zustand.
- URL state: search/filter/page cần bookmark/chia sẻ/back-forward → URL params.
- Form state: values, touched, errors, field arrays → React Hook Form + Zod.

Wizard recipe là ví dụ RHF/Zod/useFieldArray; category và create mutation dùng TanStack Query; auth dùng Zustand.

### 16. Next Image và `sizes`

Next tạo `srcset` nhiều kích thước; browser kết hợp viewport, DPR và `sizes` để chọn file đủ nét nhưng nhỏ nhất. Điều này giảm bytes/LCP và tránh layout shift khi biết width/height. Next 16 dùng `preload` cho ảnh LCP, `loading` cho chiến lược tải và `fetchPriority` cho mức ưu tiên rõ ràng thay vì prop `priority` mơ hồ. Ảnh đầu recipe dùng preload; card dùng `sizes` responsive.

### 17. Logging, Metrics, Tracing

Logging là sự kiện chi tiết có context; Metrics là số liệu tổng hợp theo thời gian; Trace nối các span của một request qua thành phần. Khi API chậm: metrics xác định endpoint/percentile và thời điểm; trace tìm span DB/Redis/MinIO chậm; log theo correlation/trace ID để xem lỗi và dữ liệu chẩn đoán. Dự án có Serilog và OpenTelemetry.

### 18. Health, liveness, readiness

Liveness trả lời tiến trình còn sống để orchestrator có nên restart; readiness trả lời instance có sẵn sàng nhận traffic (DB/cache phụ thuộc). Nếu gộp một `/health` và DB chậm làm check fail, orchestrator có thể restart hàng loạt instance đang sống, gây restart loop và outage. Dự án có `/health`, `/health/live`, `/health/ready` với predicate tag riêng.

### 19. IMemoryCache và IDistributedCache

IMemoryCache nằm trong từng process, nhanh nhưng ba instance có ba bản khác nhau và invalidation không đồng bộ; restart làm mất cache. IDistributedCache (Redis) dùng chung, nhất quán hơn và tồn tại ngoài instance, nhưng thêm network latency/failure và cần serialization/TTL. Dự án dùng abstraction distributed cache và Redis trong Compose.

### 20. Full-Text Search tiếng Việt

FTS biến tài liệu/query thành lexeme, tạo index và ranking tốt hơn `LIKE`. Cấu hình `simple` tách token nhưng không stemming theo tiếng Anh, phù hợp tiếng Việt; thường kết hợp unaccent/trigram. `english` có thể áp dụng stop-word/stemmer sai ngôn ngữ; “phở bò” không nhận được xử lý ngữ nghĩa tiếng Việt và có thể cho kết quả không ổn định sau chuẩn hóa dấu.

## PHẦN II – Báo cáo và giải thích mã

### Câu chốt số module

Ứng dụng có **7 nhóm chức năng lõi với 34 yêu cầu bắt buộc**. Bản mở rộng ánh xạ thành **16 khu vực API production**; ingredient và step là tiểu module của recipe.

7 nhóm lõi: Authentication/Account; Recipe; Category; Search; File/Media; Background Jobs; Observability/Operations. Phần mở rộng: community, article, review, collection, meal plan, notification, challenge, security/2FA, admin, AI và cooking session.

### Mâu thuẫn SRS và quyết định

| Mâu thuẫn | Quyết định | Lý do | Trạng thái |
|---|---|---|---|
| Mapster hay mapping thủ công | Mapster cho Entity → DTO, mapping con có kiểm soát | Đúng rubric và tránh map navigation ngoài ý muốn | Đã giải quyết |
| AuthorizationHandler hay `if` inline | Dùng handler theo operation/resource | Tập trung policy và test độc lập | Đã giải quyết |
| Auth.js hay JWT backend | JWT cookie tự xây | Phù hợp ASP.NET API; tài liệu nêu khác biệt | Đã giải quyết |
| TanStack/RHF hay fetch/useState | Query cho server state, RHF/Zod cho wizard | Mỗi state có đúng công cụ | Đã giải quyết ở luồng mẫu |
| Role User hay Author | Register mặc định Author cho người tạo nội dung | Khớp quyền tạo recipe | Đã thống nhất |
| Offset hay cursor | Offset | UI cần nhảy trang, dữ liệu vừa | Đã thống nhất |

### Tính năng mới ngoài lõi SRS

Refresh rotation/replay detection, 2FA, community/challenge, article, collection, planner, cooking session, AI, nutrition, ảnh nhiều biến thể, soft delete/restore, OpenTelemetry, Hangfire, Redis, MinIO, ETag concurrency, CSRF double-submit và JSON-LD.

### Chưa thể tuyên bố hoàn tất

Google OAuth thật cần Client ID/consent của chủ dự án; SMTP thật cần credential/hộp thư; Docker/MinIO/Jaeger/Grafana cần full-stack runtime ổn định; ảnh/video demo và PR/review cần thực hiện bằng tài khoản/hạ tầng của nhóm. Code/config/test mock không được nói thành “đã chạy thật”.

## PHẦN III – Khuôn trả lời

Luôn đi qua 10 ý: actor/use case; entity/database; API; authorization; validation/security; job/cache; UI; test; deploy/monitor; ưu/nhược.

### 1. Đăng ký email

`EmailSubscription(Id, Email, Status, ConfirmTokenHash, UnsubscribeTokenHash, CreatedAt)` có unique email. API subscribe trả thông báo chung, gửi double opt-in qua Hangfire; confirm/unsubscribe bằng token một lần. Khi publish tạo outbox event, worker gửi batch có retry/idempotency, rate limit và suppression list. Test token, trùng email, retry và unsubscribe; đo sent/fail/queue age.

### 2. Banner quảng cáo trả phí

Tách Campaign, Creative/Banner, Placement, Schedule, Budget/Invoice và Impression/Click. Admin/advertiser CRUD, public endpoint chọn banner theo placement/time/target; CDN/cache creative, event ghi bất đồng bộ, chống click fraud bằng dedupe/rate/risk rules. Không nhúng HTML tùy ý; kiểm file/URL và CSP. Ưu điểm tách reporting khỏi request; nhược điểm eventual consistency và bài toán gian lận.

### 3. RSS

`GET /rss.xml` trả RSS 2.0 UTF-8 chỉ cho Published, canonical URL, title/description/pubDate/guid. Escape XML, cache output, ETag + Last-Modified và invalidation khi publish/update. Test schema XML, không lộ draft/deleted và conditional GET 304.

### 4. Chia sẻ mạng xã hội

Mỗi bài có canonical URL, metadata Open Graph/Twitter và ảnh public. Client dùng Web Share API, fallback copy link hoặc share URL đã encode; server không nhận token mạng xã hội nếu chỉ chia link. Dự án đã có canonical/JSON-LD và nút Web Share/copy. Test metadata render server, encoding và browser không hỗ trợ share.

### 5. Rating 1–5 sao

`RecipeRating(UserId, RecipeId, Value, UpdatedAt)` unique `(UserId, RecipeId)`, check 1–5. `PUT /recipes/{id}/rating` upsert cho user đăng nhập; GET aggregate count/average. Authorization chặn guest, rate limit và audit; aggregate có thể tính DB hoặc cache/materialized value với transaction. Test biên, upsert không tạo hai dòng và concurrent update.

### 6. Bình luận recipe

`RecipeComment(Id, RecipeId, AuthorId, ParentId?, Content, Status, CreatedAt, DeletedAt)` hỗ trợ reply/moderation/soft delete/report. GET phân trang; POST auth; PATCH/DELETE owner hoặc moderator. Validate độ dài, encode output, không render HTML thô, rate limit/spam filter. Notification chạy nền. Test ownership, deleted recipe, XSS payload và moderation.

### 7. Liên hệ

Trang có thông tin công ty từ config/CMS và form name/email/subject/message. `ContactTicket` lưu trạng thái; POST public validate server, honeypot/CAPTCHA, CSRF, rate limit, không tiết lộ email tồn tại; job gửi email và retry. Admin xem/assign/close. Log không chứa message nhạy cảm, retention rõ ràng.

### 8. FAQ

`FaqCategory` và `FaqItem(Question, Answer, Order, IsPublished)`. Public GET group/search/cache; Admin CRUD/reorder/publish. Render server cho SEO và JSON-LD `FAQPage`, nhưng chỉ khi nội dung thật sự hiển thị. Validate/sanitize rich text, test quyền admin, order, unpublished và structured data.

### 9. Bảo mật form

Rủi ro: stored/reflected XSS, SQL/command injection, CSRF, spam/bot, upload độc hại, mass assignment, IDOR, DoS, log/PII leak. Giải pháp: DTO allow-list, validation server, parameterized query/EF, output encoding/sanitization, CSRF token + Origin, auth/resource authorization, rate limit/CAPTCHA, kiểm magic bytes/kích thước và lưu ngoài web root, audit/monitoring, secret management và test payload xấu.

## Checklist trước buổi bảo vệ

- Chạy và lưu kết quả 78 backend tests, 19 frontend tests, 35 browser tests, lint 0 warning, audit 0.
- Demo owner/non-owner/Admin, ETag lỗi 412 và CSRF lỗi 403.
- Thuộc con số Cartesian `150` so với khoảng `26`.
- Mỗi thành viên chọn hai file mình thật sự hiểu và luyện giải thích input → rule → DB → output → test.
- Không nói Google/SMTP/MinIO/observability “đã chạy thật” nếu chưa có ảnh hoặc log của lần chạy mới.
