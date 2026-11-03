# Kết quả sửa lỗi và kiểm thử Lab 8 — 03/11/2026

## Phần đã sửa

1. Recipe và Category dùng trạng thái đăng nhập phản ứng từ auth store. ProtectedRoute chờ hydrate trước khi điều hướng; cookie HttpOnly vẫn dùng được sau tải lại trang và không gây sai nội dung SSR.
2. Form tạo/sửa công thức lưu riêng tên, số lượng, đơn vị, ghi chú nguyên liệu; tiêu đề, mô tả, hẹn giờ và ảnh từng bước. Không tách mô tả theo dấu chấm, dấu phẩy hoặc số thập phân.
3. Form khóa trong khi lưu/upload. Ảnh có xem trước và chỉ tải khi lưu; tạo mới, wizard và chỉnh sửa cùng dùng API ảnh công thức. Ảnh mới được chọn làm ảnh chính.
4. Lưu giữ checkpoint ID bản nháp và ID ảnh. Khi upload/chọn ảnh chính thất bại, lần thử lại sử dụng bản nháp/ảnh đã có thay vì tạo thêm bản ghi. Nội dung đã lưu được thông báo rõ.
5. Danh sách được tải lại trước khi đóng form, tránh mở sửa liên tiếp rồi nhận dữ liệu cũ. Thông báo cập nhật danh mục vẫn hoạt động.
6. Sửa API bảng xếp hạng Studio: lọc theo danh sách ID SQL dịch được thay vì Dictionary.ContainsKey trong truy vấn EF.
7. Avatar có fallback về chữ cái đầu khi URL ảnh cũ không còn truy cập được. Không xóa hồ sơ hoặc URL cũ.
8. Nhật ký riêng dùng workspace draft trong database khi đăng nhập; khách lưu trên trình duyệt. Chờ đọc dữ liệu xong mới cho ghi; lỗi lưu giữ nguyên biểu mẫu và bản ghi cũ.
9. Hỏi đáp và câu trả lời lưu qua community posts/comments, đọc lại sau reload. Nội dung nháp/ẩn không công khai; bình luận khóa/ẩn không nhận trả lời mới. Ví dụ cũ được giữ và ghi rõ là minh họa.
10. Sổ tay dùng collections thật, chọn công thức thật và liên kết đến chi tiết. Tạo, đọc lại, xóa sổ tay riêng được kiểm thử. Nấu chung lưu CookingEvents/registrations, có đăng ký/rời, giới hạn chỗ, hủy theo quyền chủ trì/Admin. Không thêm migration vì sử dụng bảng sẵn có.

## Kết quả đã chạy

Các nhóm có phạm vi giao nhau; không cộng các số dưới đây thành số chức năng độc lập.

| Nhóm | Kết quả | Bằng chứng trong thư mục artifacts |
| --- | --- | --- |
| Backend unit/integration | 70/70 đạt, 0 bỏ qua | `lab8-fixes-20261103/backend-tests/lab8-backend-complete.trx` |
| Frontend unit/contract | 17/17 đạt | Kết quả `npm test`, thêm test roundtrip structured recipe và validation ảnh |
| Chromium hồi quy | 35/35 đạt, 0 flaky/bỏ qua | `lab8-fixes-20261103/browser-complete.json` |
| HTTP API với PostgreSQL, Redis, MinIO thật | 93/93 đạt | `lab8-admin-20261103/runtime/submission20261103105842dc539b.json` |
| Cộng đồng và công cụ qua API thật | 67/67 đạt | `lab8-feature-actions-20261103/result.json` |
| Admin qua API và giao diện thật | 43/43 đạt, gồm 12 tab | `lab8-admin-20261103/admin-result.json` |
| Trình duyệt thao tác thật | 16/16 nhóm đạt; 0 pageerror/API 5xx | `lab8-fixes-20261103/lab81793704850343437d4e/result.json` |
| Duyệt route khách | 42/42 đạt sau sửa Studio | `lab8-fixes-20261103/readonly-routes/result.json` |
| Backend build Debug | Đạt, 0 warning/error | Chạy trước khi khởi động lại API 5152 |
| Frontend production build | Đạt compile, TypeScript và prerender | `lab8-fixes-20261103/frontend-build.log` |
| TypeScript riêng | Đạt | `lab8-fixes-20261103/frontend-types-complete.log` |
| Frontend lint | 0 lỗi; còn 20 warning | `lab8-fixes-20261103/frontend-lint-complete.log` |

Các thao tác thật bao gồm cookie/reload, công thức 10 nguyên liệu/5 bước, sửa tên giữ metadata và dinh dưỡng, ảnh bước, ảnh bìa MinIO, thêm/sắp xếp/xóa dòng, Publish/Unpublish/Archive/Restore/Delete, profile, Nhật ký, Hỏi đáp/trả lời, Sổ tay, Nấu chung và logout. Các tình huống mạng lỗi/delay/retry ảnh được kiểm tra riêng bằng API giả lập có kiểm soát.

Kiểm thử Admin chỉ dùng tài khoản tạo riêng; sau chạy đã hạ về User và xóa refresh token của đúng tài khoản đó, xem `fixture-result.json`. Không thử khóa/đổi mật khẩu hoặc xóa nội dung của thành viên thật. Các record thử được xóa/hủy theo ID tạo riêng; công thức thử xóa mềm. Một số tài khoản thử và nhật ký riêng còn lại để tra cứu vì không có API xóa tài khoản. Hai bản nháp của lượt thử bị ngắt đã xóa mềm theo cả ID + username + title chính xác, ghi tại `interrupted-test-cleanup.log`.

## Phạm vi chưa được chứng nhận

- Không có khẳng định mọi tổ hợp thao tác hay mọi lỗi tương lai đều được kiểm thử. Route HTTP 200 không thay thế kiểm tra nghiệp vụ; test giả lập không thay thế dịch vụ thật.
- Google OAuth thật cần Client ID/origin của chủ dự án. Email chào mừng, quên mật khẩu và đổi email cần SMTP/From hợp lệ để xác nhận thư ra hộp thư ngoài.
- AI với nhà cung cấp thật cần API credential; không dùng tiền hoặc credential ngoài để chạy thử tự động.
- Chưa nghiệm thu toàn bộ 2FA bằng điện thoại thật, mọi thao tác quản trị thay đổi dữ liệu thành viên thật, tải đồng thời/concurrency, phục hồi khi dịch vụ ngắt và HTTPS production.
- Một số tiện ích vẫn trình bày món minh họa (khẩu phần, nấu từng bước, gợi ý khẩu vị). Không ghi các màn này thành hệ thống đề xuất cá nhân hóa/phiên video thời gian thực. Nấu chung hiện là lịch buổi nấu và đăng ký, không có truyền video/chat trực tiếp.
- Báo cáo này hoàn tất phạm vi sửa 5 lỗi công thức và các lỗi phát hiện trong lượt kiểm thử. Chưa phải chứng nhận đáp ứng 100% mọi FR/NFR của SRS; RowVersion/ETag, chi tiết role mặc định và các yêu cầu production vẫn cần đối chiếu riêng.

## Chạy lại

Đọc phạm vi trước khi chạy vì các script tạo tài khoản/nội dung kiểm thử mới. Không đưa file credentials, token hay `.env` lên GitHub.

```powershell
dotnet test tests/CulinaryBlog.API.Tests/CulinaryBlog.API.Tests.csproj --configuration Release
cd frontend
npm test
npx tsc --noEmit
npm run lint
$env:E2E_EXTERNAL_SERVER = '1'
npx playwright test --timeout=90000
npm run build
cd ..
node scripts/submission/verify-lab8.mjs
node scripts/submission/verify-feature-actions.mjs --api-url http://localhost:5152
```

`verify-admin.ps1 -RunRuntime` chỉ dành local Docker với database `culinaryblog-db`; nó tạo tài khoản thử riêng và tạm cấp quyền Admin cho đúng fixture. `finally` hạ quyền và xóa refresh token; không thay đổi thành viên cũ. Script dừng nếu ID/username fixture không khớp mẫu an toàn.

Website tiếp tục chạy tại http://localhost:3000; API tại http://localhost:5152.
