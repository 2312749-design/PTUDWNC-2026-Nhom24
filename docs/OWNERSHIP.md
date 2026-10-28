# Phân công và trách nhiệm review

Phân công chức năng gốc trong README được giữ nguyên. Bảng này ánh xạ tên gọi sang tài khoản GitHub đã đối chiếu; Oven được chủ repository xác nhận là 2314487-Somsavath ngày 28/10/2026.

| Thành viên theo README | GitHub | Nhóm nhiệm vụ | Phạm vi chính |
|---|---|---|---|
| Nguyễn Đức Thành | [2312749-design](https://github.com/2312749-design) | TH-01 đến TH-09 | Auth, nền tảng API, bảo mật, seed và security tests |
| Minh Long | [Long10205](https://github.com/Long10205) | ML-01 đến ML-08 | Ingredient, Step, Search, Recipe core, cache và backend tests |
| Oven | [2314487-Somsavath](https://github.com/2314487-Somsavath) | OV-01 đến OV-08 | Wizard, validation, toast, Hangfire, Category, Author UI và frontend integration |
| Kina Niê | [2312711-kina](https://github.com/2312711-kina) | KN-01 đến KN-08 | Storage, ảnh, Recipe Detail, SEO, observability và CI/Docker |

File có nhiều chức năng như RecipePages.jsx cần review chung theo phần thay đổi. CODEOWNERS giúp đề nghị người review phù hợp sau khi được tích hợp vào nhánh đích; không chứng minh một cá nhân đã tự viết toàn bộ file đó.

## Các thành phần phối hợp

- Program.cs, DbContext và migration: Thành phối hợp với Long/Kina theo thay đổi.
- Recipe form/dashboard: Oven phối hợp với Long; Recipe Detail và ảnh phối hợp với Kina.
- Search UI: Long phối hợp với Oven để thống nhất request/response và phân trang.
- Hangfire: Oven phụ trách nền tảng/job email; Kina phụ trách job ảnh và vận hành.
- CI/Docker: Kina phối hợp với người phụ trách module khi kiểm tra bị lỗi.

Các Issue bổ sung là hồ sơ giao việc và đối chiếu. Tác giả commit, thời điểm thay đổi và các nhánh thành viên được giữ trong lịch sử Git.
