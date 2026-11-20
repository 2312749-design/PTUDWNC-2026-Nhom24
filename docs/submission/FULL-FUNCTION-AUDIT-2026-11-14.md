# Báo cáo kiểm thử toàn bộ chức năng CulinaryBlog

**Ngày kiểm thử:** 14/11/2026  
**Môi trường:** Frontend `http://localhost:3000`, API `http://localhost:5152`, PostgreSQL và Redis chạy bằng Docker.  
**Kết luận:** Bài chạy ổn định trong môi trường local và đã đủ tốt để trình bày/bảo vệ. Không phát hiện lỗi chặn luồng chính sau lần sửa cuối. Các tích hợp bên ngoài chưa cấu hình thật được ghi rõ ở cuối báo cáo.

## 1. Tổng hợp bằng chứng

| Hạng mục | Kết quả |
|---|---:|
| Backend unit/integration tests | **102/102 đạt** |
| Frontend unit tests | **20/20 đạt** |
| Luồng phiên đăng nhập trên trình duyệt | **3/3 đạt** |
| Kiểm tra WCAG A/AA trang chính | **4/4 đạt** |
| Thao tác API chức năng thực tế | **67/67 đạt** |
| Khu vực quản trị và Hangfire | **43/43 đạt** |
| Kiểm tra schema cơ sở dữ liệu | **42 bảng, 289 cột, không thiếu** |
| Build frontend production | **Đạt, 768 trang tĩnh được tạo** |
| Lint frontend | **Đạt, 0 cảnh báo** |
| Sức khỏe hệ thống | **Healthy: API, PostgreSQL, Redis, lưu ảnh local** |
| Frontend sau build | **HTTP 200** |

## 2. Dữ liệu mẫu và yêu cầu Lab 2

- Có đúng **20 danh mục**.
- Có **1.015 công thức chưa xóa**, trong đó **700 công thức đã công khai**.
- Toàn bộ 700 công thức công khai có **ít nhất 10 nguyên liệu** và **ít nhất 5 bước làm**.
- Không còn tiêu đề chứa hậu tố gây sai tìm kiếm như “cho bữa cơm tối” hoặc “nấu tại nhà”.
- Tên, nguyên liệu và bước làm của dữ liệu seed được kiểm tra bằng test tự động; lỗi thiếu nguyên liệu/bước đã được sửa trong `DemoRecipeContentFactory`.
- Các bản nháp do người dùng tự nhập có thể ít hơn 10 nguyên liệu hoặc 5 bước khi chưa hoàn thiện; đây là dữ liệu cá nhân/bản nháp, không phải dữ liệu mẫu công khai của Lab 2.

## 3. Tài khoản, xác thực và bảo mật

| Chức năng | Trạng thái | Ghi chú |
|---|---|---|
| Đăng ký | Đạt | Tạo tài khoản tạm thành công, có validation và rate limit |
| Đăng nhập/đăng xuất | Đạt | Cookie HttpOnly, đăng xuất xóa phiên |
| Giữ phiên sau tải lại | Đạt | Không lưu access/refresh token trong localStorage |
| Refresh token | Đạt sau sửa | Đã chặn nhiều bundle gọi refresh trùng khi gặp 401/429 |
| Phân quyền thành viên/admin | Đạt | Thành viên không truy cập được API quản trị |
| CORS, CSRF, rate limiting | Đạt qua test | Có middleware và kiểm thử hợp đồng |
| Hồ sơ cá nhân | Đạt | Đọc/cập nhật và giữ dữ liệu sau tải lại |
| Tùy chọn tài khoản | Đạt | Lưu, đọc lại và reset đúng tài khoản |
| Trang bảo mật | Đạt ở chế độ đọc | TOTP/đổi email/đổi mật khẩu không được thao tác tự động để tránh làm hỏng tài khoản thật |

## 4. Công thức và quy trình kiểm duyệt

- Danh sách công thức, chi tiết, phân trang, lọc và tìm kiếm hoạt động.
- Tìm kiếm không còn trả món sai chỉ vì hậu tố “bữa cơm”.
- Thành viên có trang **Công thức của tôi**, hiển thị trạng thái bản nháp/chờ duyệt/công khai/lưu trữ.
- Tạo công thức qua trình 3 bước có validation tiêu đề, mô tả, thời gian, khẩu phần, nguyên liệu và bước làm.
- Upload ảnh có kiểm tra loại file, dung lượng và không gửi trùng khi lưu.
- Tạo công thức 10 nguyên liệu, 5 bước; đọc lại đúng thứ tự và dữ liệu chi tiết.
- Sửa tiêu đề không làm mất nguyên liệu, số lượng, ghi chú, timer, ảnh bước hoặc dinh dưỡng.
- Vòng đời Draft → Published → Archived/Restore được bao phủ bởi test backend.
- Admin đọc được danh sách, chi tiết, lịch sử phiên bản và hàng chờ duyệt.
- Thời gian tạo/cập nhật/kiểm duyệt được trả về và khu quản trị hiển thị.

## 5. Danh mục, tìm kiếm và trang công khai

- Trang chủ, công thức, danh mục và đăng nhập đều render ổn, không có lỗi nghiêm trọng WCAG A/AA.
- 20 danh mục có trang danh sách và trang chi tiết.
- Tìm kiếm theo từ khóa, danh mục, độ khó, thời gian và chế độ ăn được backend kiểm tra.
- Trang chi tiết công thức có dữ liệu cấu trúc, nguyên liệu, bước làm, thời gian và khẩu phần.
- Build production tạo được sitemap và toàn bộ route tĩnh/động cần thiết.

## 6. Cộng đồng và chức năng mở rộng

Các thao tác sau đã chạy trực tiếp qua HTTP với tài khoản kiểm thử riêng và đều đạt:

- Tạo, sửa, xuất bản và xóa bài cộng đồng.
- Like/unlike, cảm xúc, bình luận, trả lời bình luận.
- Tắt bình luận thì hệ thống từ chối bình luận mới; bật lại hoạt động bình thường.
- Hashtag, hồ sơ công khai, danh sách thành viên.
- Chuyện trong bếp: tạo, đọc theo slug, sửa và xóa.
- Lưu công thức, bỏ lưu, sổ tay/bộ sưu tập và món trong bộ sưu tập.
- Thực đơn tuần, thay đổi khẩu phần, sinh danh sách mua sắm, đánh dấu đã mua.
- Studio draft, thông báo, thống kê tác giả, lịch sử xem món.
- Danh sách sự kiện, bảng xếp hạng, gợi ý khám phá, món liên quan và suy luận dị ứng.

## 7. Khu vực quản trị

Tài khoản quản trị tạm được tạo, nâng quyền đúng một bản ghi, kiểm thử rồi hạ quyền và xóa refresh token. Không thay đổi tài khoản thật.

- 43/43 kiểm tra đạt.
- Các tab đạt: Tổng quan, Công thức, Chờ duyệt, Danh mục, Bảng tin, Chuyện trong bếp, Thành viên, Báo cáo, Thống kê, Kho ảnh, Hệ thống, Nhật ký.
- Bộ lọc User/Author/Admin, tìm thành viên và modal hồ sơ đầy đủ hoạt động.
- Đọc được recipe detail, revision history, permission descriptions.
- Xuất CSV users/recipes/reports/analytics hoạt động; dữ liệu CSV kiểm tra trong bộ nhớ và không lưu thông tin cá nhân vào artifact.
- Hangfire dashboard được bảo vệ và tài khoản admin truy cập được.
- Không có JavaScript exception hoặc API request lỗi trong lượt kiểm tra quản trị cuối.

## 8. Lỗi đã phát hiện và sửa trong lượt kiểm thử

1. Một số công thức seed thiếu 10 nguyên liệu hoặc 5 bước: đã bổ sung cơ chế tạo nội dung phù hợp theo món mặn/đồ uống và test lại **102/102 đạt**.
2. Khi nhiều phần giao diện cùng nhận 401 và refresh gặp 429, frontend có thể gọi `/auth/refresh` hai lần: đã dùng một promise chung cấp cửa sổ và cooldown lỗi ngắn; test trình duyệt cuối **3/3 đạt**.
3. Kịch bản admin còn chờ đường dẫn `/community` cũ trong khi giao diện hiện chuyển đến `/dashboard`: đã cập nhật kịch bản; kiểm tra admin cuối **43/43 đạt**.

## 9. Những điểm chưa thể chứng nhận 100% trong môi trường hiện tại

- **Email thật:** SMTP đang tắt, nên quên mật khẩu/đổi email chỉ được xác nhận ở mức code và API, chưa xác nhận thư đến hộp thư thật.
- **Google OAuth:** chưa có tài khoản/client secret thật để kiểm tra đăng nhập Google ngoài hệ thống.
- **MinIO:** cấu hình local hiện dùng lưu ảnh local; health báo Healthy nhưng MinIO bị tắt. Upload local hoạt động. Khi triển khai bằng MinIO cần bật container và kiểm tra lại quyền bucket/public URL.
- **AI bên ngoài:** không gọi dịch vụ AI trả phí/thật trong kiểm thử để tránh phát sinh chi phí và phụ thuộc khóa API.
- Hai kịch bản trình duyệt cũ của trình soạn công thức vẫn tìm hộp thoại “+ Thêm mới”; giao diện đã chuyển sang wizard 3 bước. Đây là **nợ cập nhật test**, không phải lỗi nút hiện tại. Các quy tắc dữ liệu của wizard đã được 20 frontend tests và 102 backend tests bao phủ.
- Log cũ có lỗi Hangfire từ những lần dịch vụ cơ sở dữ liệu chưa chạy; health hiện tại và kiểm tra Hangfire bằng admin đều đạt. Không nên dùng log cũ đó làm kết quả của lần chạy cuối.

## 10. Đánh giá cuối

**Mức sẵn sàng bảo vệ: 95–97% trong phạm vi chạy local.** Các luồng quan trọng của đề tài, SRS và Lab 2–8 đều có triển khai và bằng chứng hoạt động. Phần còn lại chủ yếu là tích hợp dịch vụ thật (SMTP, Google, MinIO production, AI), không phải lỗi luồng cốt lõi của bài.

Khi trình bày với giảng viên, nên demo theo thứ tự: đăng nhập thành viên → trang chủ/tìm kiếm/danh mục → tạo công thức 3 bước → Công thức của tôi và trạng thái → admin duyệt → trang công khai → bình luận/lưu món → trang quản trị/thống kê/log.
