# Quy trình đóng góp của Nhóm 24

Mọi thành viên tiếp tục giữ chức năng đã phân công trong README. Issue ghi người chịu trách nhiệm, yêu cầu và minh chứng; Git ghi tác giả thật của từng commit.

## Từ nhiệm vụ đến tích hợp

1. Tạo hoặc nhận Issue có Task ID, Assignee, nhãn module và milestone.
2. Làm trên nhánh riêng, đặt tên như `th/TH-04-refresh-cors`, `ml/ML-07-cache`, `ov/OV-01-validation`, `kn/KN-06-thumbnail`.
3. Commit các thay đổi có phạm vi rõ. Không đổi tác giả hoặc ngày commit để tạo minh chứng hồi tố.
4. Tạo PR về nhánh tích hợp được nhóm thống nhất; ghi Issue, kết quả kiểm tra và phần còn cần cấu hình.
5. Một thành viên khác đọc diff, kiểm tra luồng liên quan và review trên GitHub. Người tạo PR không ghi thay xác nhận của reviewer.
6. Merge sau khi các kiểm tra cần thiết đạt; cập nhật và đóng Issue khi đã đủ tiêu chí.

Với hồ sơ bổ sung ngày 28/10/2026, code đã có được dẫn bằng commit cố định. Nhãn `status:implemented` có nghĩa đã có implementation theo kiểm tra nguồn; Issue vẫn mở để người phụ trách xác nhận nghiệm thu.

## Các loại nhãn

- `owner:*`: người phụ trách theo README, cùng với Assignee thật.
- `area:*`: backend, frontend, media hoặc DevOps.
- `status:implemented`: có implementation, chờ nghiệm thu.
- `status:needs-work`: còn tiêu chí hoặc minh chứng cần bổ sung.
- `status:needs-config`: cần cấu hình ngoài mã nguồn.
- `status:needs-review`: cần người khác kiểm tra.
- `priority:high` và `priority:normal`: mức ưu tiên.

## Kiểm tra trước PR

```powershell
dotnet test tests/CulinaryBlog.API.Tests/CulinaryBlog.API.Tests.csproj --configuration Release
cd frontend
npm ci
npm run build
npm test
npx playwright install chromium
npx playwright test
```

Các browser test dùng API giả lập để kiểm tra giao diện. Cần thêm minh chứng runtime cho PostgreSQL FTS, Redis, MinIO, SMTP, OAuth và các luồng dữ liệu thật tương ứng.

## File dùng chung và dữ liệu

Khi thay đổi Program.cs, DbContext, migration, API contract hoặc layout chung, gắn người phụ trách liên quan vào PR. Không chỉnh migration đã được tích hợp; tạo migration mới khi thay schema. Tránh chạy seed hoặc thao tác xóa dữ liệu thật trong các bài kiểm tra.

Giữ `.env`, tài khoản thật, secret, token, cookie, build/cache và upload cá nhân ngoài commit. Cấu hình có thể chia sẻ được mô tả bằng `.env.example` và DEPLOYMENT.md.
