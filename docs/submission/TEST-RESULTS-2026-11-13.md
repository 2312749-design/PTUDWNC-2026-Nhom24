# Kết quả kiểm thử ngày 13 tháng 11 năm 2026

## Phạm vi đo

Các kết quả dưới đây được chạy trên máy phát triển và stack Docker riêng tại http://localhost:28080, API http://localhost:25152. Không thay đổi hay xóa volume ứng dụng cũ. Các lần rebuild sau kiểm tra database trắng dùng lại volume kiểm thử; không gọi đó là lần tạo database trắng mới.

| Kiểm tra | Kết quả đã quan sát | Bằng chứng |
| --- | --- | --- |
| Backend Release | 102/102 pass tại lần đo coverage gần nhất | .artifacts/coverage-application-20261113-114712/02abb5ca-e296-43ee-af6e-704a020e1ba9/coverage.cobertura.xml |
| Application line coverage | 90,12% — 767/851 dòng; đạt ngưỡng 80% | Cobertura nêu trên; không exclude handler/validator nghiệp vụ |
| Application branch coverage | 73,04%; báo riêng, không thay line coverage | Cùng phép đo |
| Frontend unit | 20/20 pass | npm test; gồm hồi quy slug tiếng Việt và dữ liệu editor |
| Lint và TypeScript | Đạt sau sửa giao diện cuối | npm run lint; npx tsc --noEmit |
| Build production | Docker Node 22, Next 16.4.6 build thành công; ISR home/categories, SSR recipes/search | artifacts/submission-20261113-022656-7001bb và refresh-summary.json |
| Database trắng | 42 bảng, 289 cột ánh xạ, không thiếu | schema-check.log trong lần Docker sạch |
| Lab 2 seed | 20 categories, 1013 recipes, 0 recipe thiếu 10/5; restart không trùng | summary.json của lần Docker sạch; đo trước khi tạo test accounts/recipes |
| Runtime API thực | 86/86 kiểm tra đạt | artifacts/submission-runtime-final/submission202611130234320ccbe8.json |
| Chromium thực | 12/12 bước đạt | artifacts/submission-browser-final/result.json; có ảnh chụp |
| Editor regression | 7/7 đạt ở lần chạy gần nhất | Playwright recipe-editor.spec.js; có API mock, không đánh đồng E2E backend thật |
| Accessibility | 4/4 trang đạt sau sửa contrast | Playwright accessibility.spec.js, chạy Chromium thật |
| Backup và restore | Đạt; database mới có cùng số recipe/category/user/ingredient/step | artifacts/backup-verification/summary.json |
| k6 mặc định 100 VU | Không đạt workload: 5800/6000 request bị lỗi, chủ yếu 429 do chung IP; không dùng latency này để kết luận nhanh | artifacts/k6-default-100vu.json |
| k6 năng lực 100 VU | Đạt bài GET 30 giây: 5892 request, 0% lỗi, p50 7,31ms, p95 58,79ms, p99 120,59ms | artifacts/k6-capacity-100vu.json; permit 20000 chỉ trong cấu hình kiểm thử, sau đó đã khôi phục |
| Redis hit rate | Lần đầu 50% raw keyspace: cache nội dung hit nhưng khóa generation chưa khởi tạo gây miss; đã sửa khởi tạo nguyên tử, chờ đo lại | artifacts/capacity-evidence.json; không tự ghi đạt 80% |
| SMTP local | Đạt: nhận welcome và reset, dùng token thành công, replay bị từ chối, đăng nhập bằng mật khẩu mới | artifacts/email-verification.json; đây chưa thay cho SMTP production |
| Google OAuth production | Chưa xác minh | Cần client/origin thật của nhóm |
| Lighthouse mới | Chưa chạy lại sau các sửa giao diện cuối | Không tái sử dụng điểm 76/100 của bản cũ |

## Giới hạn cần trình bày

Bài tải năng lực tách khỏi giới hạn truy cập để tránh 100 người dùng ảo chung một IP bị chặn trước khi đo. Đây là phép đo có điều kiện, không phải bằng chứng cấu hình mặc định chịu được 100 khách sau cùng một NAT, cũng không phải phép đo trên phần cứng 2 vCPU/4 GB hoặc toàn bộ endpoint ghi.

Coverage đạt không bảo đảm đủ mỗi endpoint happy/error, tất cả NFR hoặc không còn bug. Browser editor có mock và browser runtime có backend thật được báo riêng. Backend test đã tăng do thêm kiểm thử hồi quy, không do sửa con số hoặc giảm ngưỡng.

## Lệnh tái lập các phép đo bổ sung

```powershell
pwsh -File scripts/submission/verify-backup.ps1 -Container cbsubmission202611130226567001bb-db
pwsh -File scripts/submission/verify-capacity.ps1 -RunDirectory D:\CulinaryBlog\artifacts\submission-20261113-022656-7001bb
pwsh -File scripts/submission/verify-email.ps1 -RunDirectory D:\CulinaryBlog\artifacts\submission-20261113-022656-7001bb
```

Tên project/container thay đổi theo lần verify-clean. Đọc summary.json của lần mình chạy; không sao chép tên container cũ rồi thao tác vào môi trường khác. Các file compose.private.json, .env và database dump không được công khai.
