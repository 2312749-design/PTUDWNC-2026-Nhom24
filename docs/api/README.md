# Contract API đang sử dụng

Ngày ghi nhận: 28/10/2026. Base URL local là http://localhost:5152/api/v1. Swagger/Scalar và danh sách endpoint được cấu hình trong API; đối chiếu tài liệu sinh từ bản đang chạy khi tích hợp.

## Thành công

EndpointHandler chuẩn hóa kết quả thành `data`. HTTP 204 không có body. Với payload danh sách có items/page/pageSize/total, HTTP trả về dạng:

```json
{
  "data": [],
  "meta": { "page": 1, "pageSize": 12, "total": 0, "totalPages": 0 }
}
```

Contract hiện dùng `meta.total`, trong khi phân công cũ nói totalCount/PagedResult. ML-04 ghi khác biệt này để nhóm thống nhất. Không sửa frontend chỉ bằng cách đoán tên trường; API client hiện có trách nhiệm unwrap response.

## Lỗi

Lỗi được trả theo Problem Details, có status/title/detail; errors và code được thêm khi handler cung cấp. Hệ thống mã nghiệp vụ chưa đồng nhất toàn bộ theo AUTH_*/RECIPE_*/CATEGORY_* như phân công; xem TH-08.

Client cần xử lý 400/422 dữ liệu, 401 phiên đăng nhập, 403 quyền truy cập, 404 dữ liệu không có, 409 xung đột và 429 rate limit. Cookie HttpOnly được server quản lý; không đưa token/cookie thật vào log, Issue hoặc ảnh demo.

## Phối hợp thay đổi

PR đổi request/response hoặc điều kiện phân quyền cần ghi ví dụ trước/sau, cập nhật test hợp đồng và gắn người phụ trách frontend/backend liên quan. Những mục chưa đạt được giữ trong Issue thay vì tự đánh dấu đã hoàn thành.
