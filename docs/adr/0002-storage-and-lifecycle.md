# ADR 0002 Ghi nhận lưu trữ ảnh và vòng đời công thức

Ngày ghi nhận: 28/10/2026. Trạng thái: ghi nhận hiện trạng và tiêu chí cần kiểm chứng.

Recipe/Category dùng trạng thái và xóa mềm. Công thức công khai phải Published, chưa bị xóa và thuộc danh mục được phép hiển thị. Việc xóa mềm recipe không đồng nghĩa xóa ngay toàn bộ ảnh vật lý.

IFileStorageService có triển khai local và MinIO. Backend chạy trực tiếp hiện có thể dùng local storage; Compose bật MinIO. Cần demo MinIO thật trước khi nghiệm thu KN-01. Không đưa access key, secret hoặc ảnh người dùng vào repo.

Ảnh upload được kiểm tra định dạng, magic bytes và giới hạn dung lượng. Job thumbnail có sẵn; phần metadata kích thước/content type, việc chọn thumbnail trên card và bảo vệ ảnh có nhiều tham chiếu được ghi là các tiêu chí còn cần kiểm tra/hoàn thiện trong KN-03/KN-06.

Job dọn orphan cần giữ khoảng an toàn, kiểm tra tham chiếu và ghi log trước khi xóa. Không chạy dọn hoặc reset storage chỉ để tạo hồ sơ nghiệm thu GitHub.

Các kiểm tra SQLite và giao diện giả lập API chưa thay thế việc thử MinIO/PostgreSQL/Redis trên stack thật. Kết quả runtime được gắn vào Issue/PR tương ứng khi nhóm thực hiện.
