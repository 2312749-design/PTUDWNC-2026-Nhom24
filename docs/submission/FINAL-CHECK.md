# Chốt kiểm tra trước khi nộp — bước 1

Ngày thực hiện: **30/10/2026**. Phạm vi là khả năng khởi tạo bản nộp, kiểm tra các luồng chính, sửa lỗi phát hiện và chuẩn bị nghiệm thu GitHub. Tài liệu này không đánh dấu toàn bộ 33 nhiệm vụ đã hoàn thành.

## Bản code và bằng chứng

- [PR tích hợp #34](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/pull/34) là nơi review và đưa source vào `main`.
- [Các kiểm tra trên phiên bản PR hiện tại](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/pull/34/checks).
- [Workflow kiểm tra Docker và dịch vụ thật](https://github.com/2312749-design/PTUDWNC-2026-Nhom24/actions/workflows/submission-check.yml): tải artifact để xem kết quả API, trình duyệt và ảnh minh chứng của đúng commit.
- Bản kiểm tra sạch local: `e0b0493089365573c171926eee7d3753fdfc1f54`; xem [bằng chứng sạch](evidence/2026-10-30/clean.json).
- [Bằng chứng API trước đó](evidence/2026-10-30/runtime.json) ghi rõ phiên bản, phạm vi và giới hạn riêng; không dùng nó thay cho kết quả của các lần sửa sau.

## Kết quả đã xác minh tại local

| Kiểm tra | Kết quả |
|---|---|
| Backend Release và regression seed | 63/63 test đạt trên .NET SDK 10.0.401. |
| Frontend contract, structured data và auth store | 10/10 test đạt. |
| Test hồi quy phiên đăng nhập có API giả lập | Ba trường hợp mới đạt: cookie hợp lệ không refresh trước, các request 401 dùng chung một refresh, lỗi 429 giữ metadata để phục hồi. |
| Docker build từ source đã commit | Backend và frontend build thành công, frontend tạo 41 trang; Docker có thể dùng cache layer, source không lấy `.env` hay file build cũ. |
| Database trống | 27 migration chạy xong; 20 danh mục, 1.013 công thức, 50 tài khoản, 50 bài cộng đồng và 50 bài viết. |
| Nội dung công thức | Mỗi công thức chưa xóa có ít nhất 10 nguyên liệu và 5 bước trong cả mảng legacy lẫn bảng con; không có món dưới mức tối thiểu. |
| Liên kết danh mục | 700 công thức Published, mỗi danh mục có 35 món Published ở lần kiểm tra seed. |
| Khởi động API lần hai | Số danh mục, công thức, tài khoản, bài đăng, bài viết và migration không tăng trùng. |
| Toàn bộ Compose | Mười dịch vụ thường trực chạy; `jaeger-init` kết thúc exit code 0; các health check được cấu hình đều đạt. |
| API với PostgreSQL/Redis/MinIO thật trước đợt sửa frontend | 87/87 điều kiện đạt, bao gồm hồ sơ, avatar, công thức, ảnh, tìm kiếm, danh mục, vòng đời, phiên và đọc màn quản trị. Workflow chạy lại bộ này trên bản hiện tại. |
| Cú pháp GitHub workflow | Actionlint đạt. |

Test trình duyệt chuẩn trong CI có API giả lập. Bộ `verify-browser.mjs` bổ sung Chromium với API/database/storage thật: đăng nhập, cài đặt hồ sơ, avatar, reload, danh mục, chi tiết món và đăng xuất. Chỉ ghi nhận nó đạt khi bước tương ứng và artifact trong workflow thật báo thành công.

## Lỗi đã sửa trong bước này

1. Seed không còn tự đặt lại mật khẩu hoặc quyền của tài khoản demo đã tồn tại; có test hồi quy bảo toàn hồ sơ/quyền/mật khẩu.
2. Tìm tài khoản seed theo email hoặc username demo để không lỗi sau khi email của tài khoản demo đổi.
3. Dockerfile MinIO tạo và giao quyền `/data` trước khi chạy bằng tài khoản không phải root; đã kiểm tra bằng volume trắng.
4. Ảnh Jaeger cũ trên máy kiểm tra thoát 139 ngay cả khi gọi `--help`. Compose ghim Jaeger 1.76.0, đã kiểm tra chạy được và nhận trace, giữ nguyên giao thức/cấu hình v1 hiện có.
5. Frontend không làm mất token trong bộ nhớ khi đồng bộ metadata hồ sơ; dùng cookie hiện có trước, chỉ refresh khi API trả 401. Lỗi mạng/429/5xx không tự xóa metadata phiên.
6. Lỗi tải thông báo không làm header hiện khách; phản hồi cũ không ghi đè trạng thái phiên mới. Các thao tác công thức/danh mục dùng API client để xử lý phiên, không tự refresh để kiểm tra một điều kiện giao diện.
7. Ghim .NET SDK 10 ổn định trong `global.json`, tránh tự chọn SDK preview đang cài trên máy.
8. Bộ Chromium thật phát hiện API đánh giá lỗi 500 trên database mới. Bổ sung migration tiến tới `20261030100000_EnsureRecipeReviewPhotoUrl` để tạo cột ảnh đánh giá còn thiếu, dùng `IF NOT EXISTS` và không xóa dữ liệu khi rollback. Chuỗi migration mới có thêm một bước so với bằng chứng local 27 migration ở trên.
9. Bổ sung công cụ chỉ đọc để đối chiếu mọi tên bảng/cột của EF với PostgreSQL. Model hiện có 42 bảng/287 cột; chế độ model-only đã dựng thành công nhưng không thay thế kết quả đối chiếu database thật trong workflow. Bộ API còn kiểm tra đọc, tạo và cập nhật đánh giá kèm ảnh.
10. Đăng xuất dùng một lần điều hướng về Bảng tin, bỏ việc vừa push route vừa reload gây xung đột điều hướng.

## Giới hạn và việc còn cần người thực hiện

- Docker Desktop của máy local đã dừng sau lần kiểm tra sạch; lần khởi động sau báo lỗi socket `sailor-ingest.sock`. Đây là sự cố môi trường máy. Không reset Docker hoặc xóa volume để xử lý bước này; GitHub Actions chạy trên máy riêng.
- PostgreSQL/Redis/MinIO được thử với dữ liệu riêng. Chưa kiểm tra mọi tính năng mở rộng hoặc khả năng phục hồi khi từng dịch vụ bị ngắt.
- Google OAuth thật, email đến hộp thư và HTTPS công khai vẫn cần cấu hình/kiểm tra riêng. Chúng bị tắt trong stack thử.
- Lint còn 20 warning đã ghi nhận; bước này không tuyên bố đã dọn hết warning hoặc hoàn thành mọi yêu cầu kiến trúc.
- `main` chỉ có source sau khi PR được review và merge. Một thành viên khác phải gửi review thật theo [CONTRIBUTING.md](../../CONTRIBUTING.md); không tạo xác nhận thay đồng đội.
- Issues chỉ đóng khi đủ tiêu chí và xác nhận bàn giao; xem [checklist nghiệm thu](REVIEW-CHECKLIST.md). Các tiêu chí ngoài bước 1 tiếp tục được giữ mở.

## Chạy lại

Xem [hướng dẫn](README.md). Các script nằm trong `scripts/submission/`; workflow chỉ công khai summary, kết quả và screenshots đã chọn, không tải `.env` hay Compose có credential. Không dùng lệnh xóa volume để chốt bài.
