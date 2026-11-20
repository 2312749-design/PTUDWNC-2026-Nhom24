# Hồ sơ nghiệm thu Culinary Blog

Ngày đối chiếu: 13/11/2026. Nguồn yêu cầu: SRS Culinary Blog v1.0.0, Lab 2–8, bốn chương bài giảng và Cau_Hoi_On_Tap.pdf. Đây là kết quả kiểm tra mã nguồn và minh chứng của bản làm việc; không đồng nghĩa tất cả thay đổi đã có trên GitHub.

## A Kết luận và cách đọc kết quả

Ứng dụng đã có các luồng chính của blog công thức: tài khoản, danh mục, công thức, nguyên liệu, bước chế biến, ảnh, tìm kiếm, quản lý tác giả và quản trị. Tuy nhiên, có chức năng trong code không đồng nghĩa đã nghiệm thu mọi tình huống hoặc đạt toàn bộ NFR. Không sử dụng tỷ lệ 100% hoặc các tỷ lệ sẵn sàng chủ quan để thay thế bằng chứng.

Phân biệt bốn trạng thái: “Đã xác minh” có kiểm thử hoặc kết quả chạy; “Có mã nguồn” còn thiếu kiểm chứng thực tế; “Cần sửa tiếp” là thiếu sót trong dự án; “Nhóm xác nhận” là nội dung không thể tự tạo thay người thực hiện. Kết quả chạy mới nhất được bổ sung ở phần E và trong các JSON của thư mục artifacts.

Phần cần lưu ý khi bảo vệ: CQRS chưa phủ hết nghiệp vụ ở các handler cũ; OAuth Google và email production chưa có xác nhận; tải production 100 người dùng và SLA không thể suy ra từ unit test; bảng đóng góp phải được nhóm xác nhận. Coverage chỉ chứng minh những dòng Application đã chạy qua test, không chứng minh website hoàn hảo.

## B Những sửa đổi và lỗi đã phát hiện

| Nhóm file | Vấn đề | Sửa đổi và cách xác minh |
| --- | --- | --- |
| RecipeCatalogSeeder.cs | Recipe mới chưa lưu trước khi chuẩn hóa nên thiếu nguyên liệu và bước | Lưu trước chuẩn hóa; kiểm tra toàn catalog và seed lần hai; SQL PostgreSQL đếm từng recipe |
| RecipeContentFields.jsx và recipe-schema.js | Nhầm 10/5 của seed thành giới hạn người nhập | Cho phép công thức tối thiểu 1 nguyên liệu và 1 bước; seed vẫn 10/5; unit test form |
| RecipesHandlers.cs | Nullable số phút/khẩu phần gây 500 trước validation | Chuyển giá trị thiếu sang giá trị không hợp lệ để FluentValidation trả 422; test HTTP gửi thiếu dữ liệu |
| ExceptionHandlingMiddleware.cs | Stale If-Match có lúc 422, có lúc 412 | Stale trả 412; header sai định dạng 400; tranh chấp DB 409; ADR giải thích |
| RecipeContentQueryHandlers.cs và endpoint nguyên liệu/bước | Đọc trực tiếp DbContext, thiếu kiểm tra danh mục ẩn | Đưa query qua MediatR/Application; kiểm tra Published, owner/Admin và danh mục; 5 ca quyền đọc |
| GetCategoryDetailQueryHandler.cs và CategoriesHandlers.cs | Category detail còn truy vấn tại API | Chuyển tìm theo id/slug và lọc recipe sang Application, giữ response DTO |
| app/page.jsx và app/categories/page.jsx | Gắn revalidate nhưng dữ liệu chính còn tải ở client | Render dữ liệu API trong Server Component, ISR 3600 giây |
| RecipeCatalog.jsx, recipes/page.jsx, search/page.jsx | Danh sách/tìm kiếm chưa có SSR thực | Form GET lưu bộ lọc trên URL, server fetch và render kết quả, phân trang |
| dashboard/recipes/[id]/edit và RecipeActions.jsx | Nút sửa trỏ trang danh sách công khai | Trỏ dashboard và mở đúng recipe; editor giữ metadata ảnh, nguyên liệu, bước |
| start-production.mjs và api/internal/revalidate | Build khi API chưa chạy có thể lưu trang rỗng | Khi API sẵn sàng, startup làm mới cache bằng secret ngẫu nhiên chỉ trong process |
| AppProviders.jsx, layout.jsx, music-player-context.jsx | Phần mở rộng gây nhiễu bản SRS | Cosmic chỉ khởi tạo khi bật flag; không preload audio ở chế độ lõi; giữ chức năng mở rộng |
| Dockerfile và docker-compose.yml | Node cũ không đáp ứng engine một số công cụ; origin ảnh thiếu cấu hình | Chuyển Node 22 và truyền origin media; build kiểm tra |
| verify-clean.ps1 | Xuất HEAD cũ, bỏ thay đổi chưa commit; nhận nhầm init container đã kết thúc là lỗi | Thêm UseWorkingTree, snapshot không lấy secrets/build artifacts; chấp nhận init exit 0 |
| verify-runtime.ps1 và verify-browser.mjs | Script nghiệm thu cũ chưa gửi CSRF và theo giao diện cũ | Gửi CSRF token, đi route mới, đọc dữ liệu thật, chụp ảnh minh chứng |
| backup-postgres.ps1 và verify-backup.ps1 | Chưa có kiểm chứng restore | Dump nhị phân trên PowerShell 7.4+, giữ 30 ngày; restore DB riêng và đối chiếu số bản ghi |

Danh sách đường dẫn đầy đủ dùng khi bàn giao nằm trong FILE-CHANGE-INVENTORY.md. Một file có thể chứa cả thay đổi của người dùng từ trước; không quy toàn bộ diff cho lần sửa này.

## C Đối chiếu Lab 2 đến Lab 8

| Lab | Yêu cầu chính | Kết quả và minh chứng | Phần cần nhóm xác nhận |
| --- | --- | --- | --- |
| 2 | Clean Architecture, package, entity/config/DbContext, migration, seed 20/100/10/5 | Bốn project; PostgreSQL mới có 20 danh mục, 1013 recipe; không recipe thiếu 10/5; restart không trùng | Trình bày quan hệ dữ liệu, giải thích migration |
| 3 | Domain exception, repository/UoW, 2 endpoint mỗi người, Problem Details | Có code và test; lỗi nullable đã có hồi quy; query category/content đưa về Application | Hai endpoint thực tế mỗi người: còn thiếu chứng cứ cho Kina Niê và Oven theo bảng Git hiện có |
| 4 | Tất cả API endpoint | Có endpoint bảy module SRS; không đồng nghĩa mỗi endpoint đều có đủ happy/error integration test | Đối chiếu ma trận từng FR khi demo |
| 5 | CORS, rate limit, auth/authorization, API docs/version, frontend/types | /api/v1, JWT cookie, CSRF, role/owner, Swagger, Next và TS types; cần phân biệt local/production | Domain/TLS và Google client của nhóm |
| 6 | API utilities, UI library, store, layout/common components | API wrapper/Problem Details, Radix/Lucide, Zustand, header/footer/loading/error; frontend test/lint/type-check | Thuyết minh bốn loại state và component dùng chung |
| 7 | Auth, profile, home/sidebar, detail, search, categories | Có màn hình và API; server content cho trang công khai; recovery có code | Email nhận thật cần SMTP hoặc nghiệm thu MailHog |
| 8 | Upload, editor/lifecycle, user list, logging, hoàn thiện SRS | Có upload 5MB/magic bytes, Draft–Published–Archived và soft delete; Admin users, Serilog/OpenTelemetry | Đối chiếu NFR chưa đủ minh chứng trước khi nói hoàn thành |

## D Đối chiếu đặc tả và kiến trúc

SRS có 7 nhóm và 34 FR chi tiết; số tổng hợp ở phần giới thiệu có khác biệt. Áp dụng danh sách yêu cầu chi tiết, không bỏ chức năng theo con số tổng hợp. Ma trận từng FR/NFR được lưu riêng trong SRS-REQUIREMENT-MATRIX.md.

Luồng chuẩn đã áp dụng: HTTP → MediatR → ValidationBehavior → Application handler → repository/UoW hoặc service interface → Infrastructure → PostgreSQL/Redis/MinIO. Domain giữ trạng thái và quy tắc nghiệp vụ. API là nơi lắp ghép dịch vụ và xử lý HTTP. Một số handler cũ vẫn có truy vấn trực tiếp; không trình bày rằng toàn bộ hệ thống đã chuyển hoàn toàn sang CQRS.

Các quyết định khác SRS phải giải thích: dùng UpdatedAt/If-Match thay RowVersion; dùng cookie HttpOnly tự triển khai thay Auth.js; Google kiểm tra ID token chưa phải minh chứng đầy đủ authorization-code flow; tối thiểu 1/1 cho công thức người dùng và 10/5 cho dữ liệu Lab 2. Chi tiết trong ADR 0003.

## E Kết quả kiểm thử

Kết quả mới nhất sẽ được tổng hợp từ lần chạy cuối trong TEST-RESULTS-2026-11-13.md. Các số 78, 93, 94, 100 test hoặc các số coverage ở tài liệu cũ là kết quả tại những mốc khác nhau, không cộng dồn và không tự dùng cho bản hiện tại.

Phép đo coverage dùng tests/ApplicationCoverage.runsettings, include assembly CulinaryBlog.Application. Không loại handler/validator/query nghiệp vụ để tăng điểm; không loại toàn bộ CompilerGenerated vì sẽ mất mã async. Branch coverage được báo riêng và không thay cho line coverage. Lệnh verify-application-coverage.ps1 trả lỗi khi line dưới 80%.

Docker nghiệm thu tạo project/volume mới, dùng port riêng và không xóa dữ liệu ứng dụng cũ. Runtime test tạo account/recipe kiểm thử trong DB riêng. Backup restore tạo một DB mới để đối chiếu, không ghi đè DB nguồn. Performance phải ghi cả mức tải, thời lượng, trạng thái rate limit, phần cứng và phạm vi endpoint; một lần chạy GET cục bộ không chứng minh toàn bộ API đạt SLA production.

## F Việc chủ dự án và nhóm phải tự làm

1. Điền trường, lớp, giảng viên, tên và MSSV; người dùng đã chọn không cung cấp các thông tin này trong phiên làm việc.
2. Xác nhận phân công và hai endpoint của từng người bằng commit/PR thật. Không sử dụng phân công gợi ý như sự kiện đã xảy ra.
3. Đọc diff, chọn file cần commit, tạo commit/push; mời thành viên khác review PR. Chưa tự commit hoặc push trong công việc này.
4. Cấu hình Google Client ID và origin/redirect theo tài khoản của nhóm; quay hoặc chụp luồng đăng nhập thành công.
5. Cấu hình SMTP production, kiểm tra thư tới hộp thư thật, tránh đưa mật khẩu vào repo/báo cáo.
6. Cấu hình domain và chứng chỉ TLS; bật cookie Secure; xác minh URL frontend/API/media đúng môi trường.
7. Lập lịch backup 03:00 hằng ngày trên máy triển khai, đặt múi giờ, theo dõi retention và định kỳ restore thử.
8. Kiểm tra mẫu báo cáo riêng của trường, cập nhật mục lục sau khi sửa nội dung, nộp trước hạn thầy quy định và luyện phần giải thích mã của chính mình.

## G Danh sách ảnh demo

| Tên ảnh | Trang hoặc thao tác | Chú thích báo cáo |
| --- | --- | --- |
| home.png | Trang chủ sau khi server có dữ liệu | Header, footer, sidebar danh mục và công thức mới |
| categories.png | Danh sách danh mục | Catalog lấy dữ liệu server và liên kết theo slug |
| recipe-from-category.png | Mở recipe từ category | Nguyên liệu có thứ tự, các bước, thời gian, khẩu phần |
| search.png | Tìm kiếm từ khóa và URL query | Search/filter/pagination có thể chia sẻ đường dẫn |
| account-after-reload.png | Lưu hồ sơ rồi tải lại | Dữ liệu tồn tại qua request mới và phiên cookie |
| before-logout.png | Tài khoản trước đăng xuất | Tác giả đang đăng nhập; sau logout trang riêng bị bảo vệ |
| editor và upload | Tạo draft, upload ảnh, publish | Cần thể hiện phản hồi thành công và recipe sau tải lại |
| admin và health | Admin users, health/ready, Swagger | Vai trò quản trị và trạng thái DB/Redis/MinIO |
| Google và email | Khi nhóm có tài khoản dịch vụ | Chụp kết quả thật, không dùng màn hình cấu hình làm bằng chứng gửi/nhận thành công |

Chỉ ảnh có file thực tế mới được nhúng vào Word. Các ảnh chưa tạo sẽ được ghi thiếu, không thay bằng hình minh họa giả giao diện.

## H Kịch bản demo từ 10 đến 15 phút

1. Mở trang chủ: “Dữ liệu chính được render trên server. Sidebar dẫn tới công thức theo CategoryId.”
2. Tìm món, đổi bộ lọc và phân trang: “Bộ lọc nằm trên URL; phía server chỉ trả Published thuộc danh mục công khai.”
3. Mở chi tiết: “Nguyên liệu và bước là các bản ghi con có thứ tự. Metadata và JSON-LD phục vụ SEO.”
4. Đăng nhập Author, cập nhật hồ sơ rồi tải lại: “Cookie xác thực có HttpOnly; metadata giao diện không phải credential.”
5. Tạo draft, nhập nội dung, upload ảnh: “Validation có ở form và server; server kiểm tra loại ảnh, chữ ký file và 5 MB.”
6. Publish và tìm lại: “Chỉ tác giả hoặc Admin được thay đổi trạng thái; tìm kiếm đọc dữ liệu mới, trang ISR có thời gian cache.”
7. Dùng account khác thử sửa: “Quyền được kiểm tra tại API/Application, không chỉ ẩn nút.”
8. Mở Admin, Swagger và health: “/api/v1 là hợp đồng; health/live khác health/ready.”
9. Mở kết quả test/coverage: “Application line coverage phải từ 80%; đây là báo cáo của lần chạy cuối.”
10. Kết thúc bằng phân công thật, phần chưa hoàn thành và bài học; không nói các hệ thống bên ngoài đã kiểm tra nếu chưa có bằng chứng.

Phương án dự phòng: Docker hỏng thì trình bày code/test cùng ảnh đã chụp và nói rõ không phải demo trực tiếp; mất mạng thì dùng ảnh local/công thức seed; Google chưa cấu hình thì demo local login; MinIO lỗi thì giữ draft và hiển thị lỗi upload, không giả báo thành công; màn hình máy chiếu nhỏ thì dùng zoom và kiểm tra menu trước buổi báo cáo.

## I Chuẩn bị vấn đáp

ORAL-DEFENSE-GUIDE.md trả lời 20 câu lý thuyết, phần giải thích mã và 9 tình huống mở rộng. Mỗi câu theo thứ tự: định nghĩa, cách dự án làm, chỉ file/hàm thật, ưu nhược điểm. MEMBER-DEFENSE-REPORTS.md chỉ là gợi ý ôn tập cho từng người; không phải chứng cứ phân công.

Các điểm giảng viên dễ hỏi: vì sao có cả mảng legacy và bảng nguyên liệu/bước; cách đồng bộ hai biểu diễn; vì sao chọn monolith; transaction khi lưu parent/children; cách tránh N+1 và Cartesian explosion; refresh rotation/replay; CSRF với cookie; ý nghĩa 412; cache invalidation và khoảng trễ ISR; SQL tìm kiếm tiếng Việt; các deviation so với SRS; coverage cao nhưng chưa có test endpoint cụ thể thì còn rủi ro gì.

## J Lệnh nghiệm thu và cài đặt

Chạy tại D:\CulinaryBlog bằng PowerShell 7.4 trở lên, với .NET 10, Node 22 và Docker Desktop. Không chép secrets từ máy khác vào repo.

```powershell
dotnet restore
dotnet build -c Release
pwsh -File scripts/submission/verify-application-coverage.ps1
pwsh -File scripts/submission/verify-clean.ps1 -UseWorkingTree
pwsh -File scripts/submission/verify-runtime.ps1 -BaseUrl http://localhost:25152
node scripts/submission/verify-browser.mjs --base-url http://localhost:28080
Set-Location frontend
npm ci
npm test
npm run lint
npx tsc --noEmit
npm run build
```

Migration và seed của stack kiểm thử chạy khi API khởi động với DatabaseInitialization được bật. Có thể kiểm SQL bằng tests/submission/verify-seed.sql sau startup và trước khi tạo thêm dữ liệu test. Không chạy lại seed tùy tiện trên production. Với triển khai thường: sao chép .env.example thành .env, tự sinh secrets, cấu hình dịch vụ, rồi docker compose up -d --build.

Browser regression và accessibility dùng E2E_EXTERNAL_SERVER=1 và E2E_BASE_URL trỏ stack đang chạy. k6 dùng VUS=100, DURATION và BASE_URL được ghi kèm kết quả. verify-backup.ps1 nhận tên container kiểm thử và restore sang DB mới. Không dùng down -v để sửa lỗi kết nối vì sẽ xóa dữ liệu.

## K Bàn giao Git

Repository: https://github.com/2312749-design/PTUDWNC-2026-Nhom24. Nhánh và HEAD hiện tại phải kiểm tra lại trước khi commit. verify-clean mặc định xuất HEAD; thêm UseWorkingTree để nghiệm thu cả các sửa đổi chưa commit.

Nên chia commit: sửa nghiệp vụ/validation; hoàn thiện rendering/frontend; thêm regression/coverage; scripts Docker/backup; cập nhật hồ sơ. Không commit .env, artifacts có thông tin môi trường, dump database, bin/obj/node_modules, ảnh chứa token hoặc dữ liệu cá nhân. .gitignore đã bổ sung backups, tmp và báo cáo Lighthouse tạm. Bộ ảnh dùng cho báo cáo cần duyệt trước khi đưa vào repo.

Không reset, checkout hay xóa thay đổi có sẵn. Git status nhiều file là dấu hiệu cần rà soát diff, không phải lý do để bỏ toàn bộ thay đổi.
