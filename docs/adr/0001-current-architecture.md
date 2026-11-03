# ADR 0001 Ghi nhận kiến trúc hiện tại

Ngày ghi nhận: 28/10/2026. Trạng thái: ghi nhận mã đang có, chờ nhóm xác nhận các khác biệt với phân công ban đầu.

Ứng dụng có bốn project Domain, Application, Infrastructure và API. API v1 được ánh xạ bằng Minimal API; phần điều phối gồm endpoint handler và các use case MediatR. Dữ liệu được lưu bằng EF Core/PostgreSQL; Repository và Unit of Work đã có, nhưng một số truy vấn còn sử dụng context và Application còn phụ thuộc EF Core.

DTO hiện được ánh xạ thủ công. README ban đầu nhắc Mapster và RecipeAuthorizationHandler riêng, trong khi mã hiện có dùng mapping thủ công và kiểm tra quyền sở hữu/Admin trong handler. Những khác biệt này được ghi ở TH-01/TH-06 để nhóm quyết định, không tự sửa phạm vi phân công hoặc coi tên lớp khác là đã thiếu toàn bộ chức năng.

Phần đăng ký mặc định Role=User đang khác yêu cầu Author trong README. Việc đổi quyền mặc định cần quyết định nghiệp vụ và test tương ứng; hồ sơ GitHub không tự nâng quyền tài khoản để làm khớp mô tả.

Frontend dùng Next.js App Router, React, Zustand và Radix UI. Các thành phần JSX lớn vẫn còn; mã API client/store/types đã có TypeScript. Hiệu ứng Cosmic được bổ sung vào layout chung, không thay các yêu cầu nghiệp vụ.

## Việc cần xác nhận

- Chọn mapping thủ công hoặc triển khai Mapster theo phân công.
- Thống nhất chính sách User/Author và cách đóng gói resource authorization.
- Tiếp tục tách persistence nếu yêu cầu Clean Architecture cần mức độc lập cao hơn.
- Bổ sung architecture test và cập nhật ADR khi nhóm đưa ra quyết định chính thức.
