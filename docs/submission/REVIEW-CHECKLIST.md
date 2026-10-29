# Checklist nghiệm thu bản nộp cuối kỳ

Ngày đối chiếu GitHub: **30/10/2026**. Tài liệu này chuẩn bị việc kiểm tra và bàn giao; các ô chưa đánh dấu không phải kết quả đã đạt.

## 1. Hiện trạng đã xác minh

- Có 33 Issue theo phân công, tất cả đang mở; mỗi Issue có Assignee, nhãn và milestone.
- Có 5 PR đang mở. [PR #34](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/pull/34) tích hợp source vào `main`; [#35](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/pull/35), [#36](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/pull/36), [#37](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/pull/37), [#38](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/pull/38) là tài liệu bàn giao của bốn người, cùng trỏ về nhánh tích hợp.
- `main` hiện chỉ có `Readme.md`; source đầy đủ ở `codex/github-workflow-setup` và nhánh Lab 07.
- Các kiểm tra CI của năm PR đã thành công ở commit được kiểm tra. Chưa có review được gửi trong cả năm PR; PR #34 đang chờ review, không phải bị chặn do CI thất bại.
- Tài khoản tạo cả năm PR là `2312749-design`. Assignee thể hiện trách nhiệm theo phân công, không thay thế tác giả commit hoặc xác nhận của reviewer.
- [CI của PR #34](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/actions/runs/40723957978) ghi nhận backend 61/61, frontend contract 7/7, browser 23/23; lint 20 warning, 0 error. Browser test có API giả lập. Các số liệu này không tự chứng minh toàn bộ tích hợp PostgreSQL/Redis/MinIO/SMTP/Google đã được thử thật.

Kết quả kiểm tra trước đây được ghi tại [VALIDATION.md](../project/VALIDATION.md); đợt chốt bản nộp được ghi riêng tại [FINAL-CHECK.md](FINAL-CHECK.md). Mỗi lần sửa code sau đó phải ghi commit và kiểm tra lại phần chịu ảnh hưởng; review cũ có thể bị GitHub yêu cầu làm lại.

## 2. Trình tự chốt bản nộp

1. Chạy kiểm tra từ source sạch và database riêng, không ghi đè `.env`, không xóa volume hoặc seed lại database đang dùng. Ghi kết quả migration/seed, số liệu tối thiểu và kiểm tra khởi động lại.
2. Chạy luồng API với PostgreSQL/Redis/MinIO thật trong môi trường riêng. Ghi rõ lỗi, phần sửa và phần chưa kiểm chứng. Email thật và Google thật được tách thành mục cần cấu hình.
3. Các thành viên đọc và chỉnh tài liệu bàn giao của mình trong PR #35–38. Một thành viên khác kiểm tra và gửi review thật; sau đó mới merge các tài liệu vào nhánh tích hợp.
4. Khi toàn bộ thay đổi cuối đã có trên nhánh tích hợp, chờ CI trên commit mới nhất đạt. Thành viên khác review PR #34; xử lý nhận xét trước khi merge vào `main`.
5. Kiểm tra lại source, README, hướng dẫn chạy và Actions trên `main`. Chỉ ghi link bản nộp là `main` khi source thực sự đã được merge.
6. Nghiệm thu từng Issue theo bảng dưới và checklist trong chính Issue. Chỉ đóng mục có đủ bằng chứng; mục còn tiêu chí/cấu hình phải giữ mở và ghi lý do. Không đóng để làm giảm số lượng hiển thị.

## 3. Mười Issue đã có implementation theo lần rà source

Đây là các ứng viên để nghiệm thu trước, **không phải mười Issue đã được phê duyệt**. Phải đối chiếu toàn bộ checklist trong Issue nếu nội dung đã thay đổi.

| Task / Issue | Người phụ trách | Kiểm tra để nghiệm thu | Bằng chứng cần gắn vào Issue |
|---|---|---|---|
| TH-02 / [#2](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/2) — Entities, DbContext, migration | Thành | Migration từ database trống thành công; bảng Identity/Category/Recipe và quan hệ được tạo; khởi động lại không lỗi hoặc nhân đôi dữ liệu. | Commit, log đã ẩn thông tin kết nối, kết quả schema/migration và kiểm tra lại. |
| TH-04 / [#4](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/4) — Refresh Token, CORS | Thành | Đăng nhập; refresh tạo phiên hợp lệ; xử lý token cũ theo rotation/replay; Origin được phép nhận đúng CORS, Origin lạ không được cấp quyền CORS. | Kết quả test và HTTP status/header đã loại token, cookie, mật khẩu. |
| TH-07 / [#7](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/7) — Logout, Profile | Thành | Đọc/sửa hồ sơ rồi tải lại vẫn giữ dữ liệu; logout xóa phiên; refresh sau logout bị từ chối; người khác không được sửa hồ sơ này. | Log API đã ẩn dữ liệu nhạy cảm và ảnh giao diện nếu kiểm tra UI. |
| ML-01 / [#10](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/10) — Ingredient, Step | Long | Lưu và đọc lại đủ quantity/unit/notes và order/title/description/timer; FK và quy tắc thứ tự đúng. | Kết quả persistence với PostgreSQL thật và test liên quan. |
| ML-02 / [#11](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/11) — CRUD Ingredient, Step | Long | Thêm/sửa/xóa nguyên liệu và bước; xóa hoặc sắp xếp bước không tạo thứ tự trùng; người ngoài bị từ chối. | Kết quả thao tác thành công và lỗi phân quyền; dữ liệu đọc lại. |
| ML-03 / [#12](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/12) — PostgreSQL FTS | Long | Database trống có extension/index/trigger cần thiết; công thức Published vừa tạo tìm được bằng tiếng Việt có dấu/không dấu; sửa dữ liệu thì search cập nhật. | Schema/index và kết quả truy vấn API trên PostgreSQL thật. |
| OV-04 / [#21](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/21) — Hangfire | Oven | Server kết nối PostgreSQL, nhận và thực hiện job thử; khách/User không mở được dashboard; Admin truy cập hợp lệ. | Trạng thái job, log và HTTP/dashboard đã ẩn thông tin phiên. |
| OV-06 / [#23](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/23) — Category CRUD, UI | Oven | Admin tạo/sửa danh mục, công thức liên kết đúng; số món công khai chính xác; chặn xóa danh mục đang được dùng theo quy tắc dự án; người thường không có quyền ghi. | Kết quả API và kiểm tra danh sách/chi tiết trên UI, kể cả lỗi 403/409 tương ứng. |
| OV-07 / [#24](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/24) — Author Dashboard | Oven | Author chỉ thấy/quản lý phần của mình; tạo, sửa, gửi duyệt/xuất bản, archive, restore, soft delete theo lifecycle hiện hành; thông báo và dữ liệu tải lại đúng. | Ảnh hoặc video luồng UI và kết quả đọc lại từ API; kiểm tra tài khoản thứ hai. |
| KN-02 / [#27](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/issues/27) — Upload ảnh | Kina | Ảnh hợp lệ được lưu và URL trả về tải được sau khi đọc lại công thức; file sai loại/chữ ký/quá 5 MB bị từ chối; người khác không upload được. | HTTP status, ảnh hiển thị, kiểm tra MinIO/database thật và các trường hợp lỗi; không công bố secret storage. |

Mỗi Issue được nghiệm thu cần có:

- [ ] Toàn bộ tiêu chí bắt buộc đã được kiểm tra; phần không áp dụng được giải thích và được nhóm thống nhất.
- [ ] Link commit/PR và kết quả kiểm tra trên đúng phiên bản.
- [ ] Người phụ trách xác nhận phạm vi bàn giao.
- [ ] Nhận xét còn mở đã được xử lý; không dùng trạng thái CI xanh để thay cho review.
- [ ] Cập nhật nhãn và Projects theo kết quả, rồi đóng bằng **Completed** khi thực sự đạt.

Các Issue khác tiếp tục giữ tiêu chí còn thiếu. Đặc biệt, lỗi trigger/biến Compose của CI đã được sửa trong PR #34 và có comment cập nhật ở Issue #33; không coi mô tả snapshot cũ là lỗi còn tồn tại, nhưng CI validate Compose cũng chưa thay thế lần chạy Docker thật.

## 4. Cách thành viên gửi review thật

PR hiện do `2312749-design` tạo nên tài khoản này không thể tự Approve PR của chính mình. Một thành viên khác có quyền repository và phù hợp CODEOWNERS — `Long10205`, `2314487-Somsavath` hoặc `2312711-kina` — cần đăng nhập bằng tài khoản của họ.

1. Mở PR, xem **Files changed**, đọc phạm vi và bằng chứng kiểm tra.
2. Kiểm tra phần mình được giao review. Nếu còn lỗi, gửi nhận xét hoặc **Request changes** để tác giả sửa.
3. Khi đã kiểm tra và đồng ý, chọn **Review changes → Approve → Submit review**, kèm mô tả ngắn phần đã xem/thử.
4. Người có quyền merge chỉ merge khi CI và quy định review của nhánh đều đạt. Không bỏ bảo vệ nhánh chỉ để vượt bước này.

Quy định một thành viên khác review trước khi merge nằm trong [CONTRIBUTING.md](../../CONTRIBUTING.md) và phần quy ước README. Việc tự tạo comment dưới tên thành viên, đổi tác giả commit hoặc ghi hộ rằng người khác đã thử không được dùng làm bằng chứng.

## 5. Các đầu vào không thể thay bằng code

| Nội dung | Việc cần thành viên cung cấp/thực hiện | Cách ghi trạng thái |
|---|---|---|
| Google Login thật — TH-05 / Issue #5 | Google Client ID đúng ứng dụng và origin/callback; thử đăng nhập bằng tài khoản kiểm tra. | Cần cấu hình thật cho tới khi có kết quả đầu-cuối. |
| Welcome/forgot-password/email change gửi ra hộp thư | SMTP/dịch vụ gửi thư, địa chỉ gửi và thông tin xác thực; xác nhận thư đến hộp thư thử. | Ghi rõ test local/job đạt nếu có; chưa ghi gửi email thật đạt. |
| HTTPS/demo Internet, nếu thuộc yêu cầu nộp | Domain/Tunnel hoặc nơi triển khai, quyền cấu hình và URL thử. | Cấu hình hỗ trợ không đồng nghĩa đã có deployment công khai. |
| Review và bàn giao | Thành viên đăng nhập, kiểm tra và xác nhận bằng tài khoản riêng. | Giữ chờ review; không ghi nghiệm thu thay người khác. |

Không đưa mật khẩu, cookie, access/refresh token, OAuth secret hoặc SMTP credential vào Issue, PR, ảnh minh chứng hay log đính kèm.
