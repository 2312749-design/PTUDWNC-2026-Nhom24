# TÀI LIỆU PHÂN TÍCH VÀ XỬ LÝ XUNG ĐỘT KIẾN TRÚC & NGHIỆP VỤ (CR-02)
**Dự án:** Culinary Blog (`CULINARY-BLOG-V1`)  
**Tham chiếu SRS:** Phiên bản V4 (Tiêu chuẩn IEEE 830 / ISO/IEC/IEEE 29148:2018)[cite: 3]

---

## 1. Mâu thuẫn về cơ chế Xóa dữ liệu (Soft Delete vs Hard Delete)

*   **Vấn đề mâu thuẫn:** Tại phần yêu cầu phi chức năng (NFR-REL-003) và thiết kế Data Model (Chương 7.1), hệ thống quy định dùng cờ `IsDeleted` để thực hiện **Xóa mềm (Soft Delete)** cho mọi entity[cite: 3]. Tuy nhiên, tại luồng chức năng FR-RCP-007 (Xóa Công thức), tài liệu lại ghi chú rõ đây là **Hard Delete** (xóa vĩnh viễn và xóa cascade các bảng con)[cite: 3].
*   **Các giải pháp đề xuất:**
    *   *Giải pháp A (Dùng Hard Delete hoàn toàn):* Xóa sạch dữ liệu trong database và kích hoạt Hangfire job xóa file ảnh trên MinIO[cite: 3].
    *   *Giải pháp B (Dùng Soft Delete hoàn toàn):* Cập nhật `IsDeleted = true` cho cả Recipe và các bảng con liên quan, không xóa vật lý file trên MinIO[cite: 3].
    *   *Giải pháp C (Kết hợp Soft Delete DB + Hard Delete Storage qua Job):* Giữ cờ `IsDeleted` ở Database để bảo toàn lịch sử và tính toàn vẹn quan hệ, nhưng đẩy tác vụ xóa vật lý tệp tin ảnh trên MinIO cho Hangfire[cite: 3].
*   **Phân tích ưu nhược điểm & Ảnh hưởng:**
    *   *Giải pháp A:* Tiết kiệm dung lượng lưu trữ, nhưng rủi ro mất mát dữ liệu cao nếu người dùng lỡ tay bấm xóa, khó khăn khi làm báo cáo kiểm toán (audit log).
    *   *Giải pháp B:* An toàn dữ liệu tuyệt đối[cite: 3], nhưng gây lãng phí dung lượng MinIO và phức tạp hóa các câu lệnh truy vấn (Global Query Filter phải lọc liên tục)[cite: 3].
    *   *Giải pháp C:* Cân bằng tốt giữa việc bảo vệ dữ liệu nghiệp vụ và tối ưu hóa tài nguyên phần cứng bên ngoài (Object Storage).
*   **Kế hoạch cài đặt chi tiết:**
    *   Thống nhất áp dụng **Giải pháp C**.
    *   Tại `FR-RCP-007`, cập nhật lại trạng thái thực thể Recipe thành `IsDeleted = true` thay vì gọi lệnh `Remove()` trực tiếp của EF Core[cite: 3].
    *   Bổ sung Global Query Filter trong `DbContext`: `.HasQueryFilter(e => !e.IsDeleted)`[cite: 3].
    *   Đăng ký Hangfire Background Job để quét và dọn dẹp các tệp mồ côi trên MinIO định kỳ hàng tuần.

---

## 2. Định dạng tham số Sắp xếp danh sách (Sorting Parameters)

*   **Vấn đề mâu thuẫn:** Tại phần đặc tả tính năng tìm kiếm và lọc (`FR-SRCH-003`), quy định cách sắp xếp dùng tiền tố dấu trừ, ví dụ `sort=-createdAt` (giảm dần) hoặc `sort=title` (tăng dần)[cite: 3]. Tuy nhiên, trong Bảng Đặc tả REST API (`Chương 8.3`), các endpoint lại hướng dẫn truyền theo cặp tham số tách biệt `sortBy=...&sortOrder=...`[cite: 3].
*   **Các giải pháp đề xuất:**
    *   *Giải pháp A:* Dùng chung một chuỗi query gộp có tiền tố (chuẩn JSON:API, ví dụ: `sort=-title`).
    *   *Giải pháp B:* Tách thành hai tham số riêng biệt rõ ràng (`sortBy=title&sortOrder=desc`)[cite: 3].
*   **Phân tích ưu nhược điểm & Ảnh hưởng:**
    *   *Giải pháp A:* URL ngắn gọn, tinh tế. Tuy nhiên, phía Backend (.NET 10 Minimal APIs) khó khăn trong việc ánh xạ tự động vào các object Model, bắt buộc phải viết thêm custom string parser.
    *   *Giải pháp B:* Rất thân thiện với C# Model Binding (`[FromQuery]`), dễ kiểm soát kiểu dữ liệu đầu vào (`asc` hoặc `desc`), chuẩn hóa theo mô hình RESTful thông thường[cite: 3].
*   **Kế hoạch cài đặt chi tiết:**
    *   Thống nhất chọn **Giải pháp B**.
    *   Cập nhật lại `FR-SRCH-003`: Xóa bỏ quy chuẩn dùng tiền tố `-`[cite: 3].
    *   Quy định chuẩn request phân trang và sắp xếp cho toàn bộ dự án: `?sortBy=createdAt&sortOrder=desc`. Phía Backend lập trình viên chịu trách nhiệm kiểm tra `sortOrder` chỉ nhận 2 giá trị hợp lệ là `asc` hoặc `desc`.

---

## 3. Cơ chế khởi tạo thông tin Dinh dưỡng (Nutrition) khi tạo Công thức

*   **Vấn đề mâu thuẫn:** Tại đặc tả nghiệp vụ `FR-RCP-003` (Tạo Công thức mới), payload yêu cầu cho phép gửi kèm luôn đối tượng dinh dưỡng `nutrition?: {...}` trong cùng một HTTP Request[cite: 3]. Tuy nhiên, tại phần thiết kế Data Model (`Chương 7.2.1`), `RecipeNutrition` lại được định nghĩa là một *Owned Entity* (các cột lưu chung bảng với bảng `Recipes`)[cite: 3], dẫn đến một số ý kiến trong nhóm đề xuất tách thành một API độc lập riêng biệt.
*   **Các giải pháp đề xuất:**
    *   *Giải pháp A:* Tách thành API riêng biệt (`PUT /recipes/{id}/nutrition`).
    *   *Giải pháp B:* Gộp chung đối tượng Nutrition vào ngay payload của API Tạo/Sửa Recipe (`POST /recipes` và `PUT /recipes/{id}`)[cite: 3].
*   **Phân tích ưu nhược điểm & Ảnh hưởng:**
    *   *Giải pháp A:* Tách rời nghiệp vụ. Tuy nhiên, vì Nutrition là một Owned Entity nằm chung bảng vật lý với Recipes[cite: 3], việc tách API sẽ làm tăng số lượng network call không cần thiết và dễ gây ra tranh chấp dữ liệu (Concurrency Conflict) khi xử lý đồng thời.
    *   *Giải pháp B:* Tiết kiệm số lượng request, toàn bộ dữ liệu của một công thức được khởi tạo hoặc cập nhật trọn vẹn trong một Transaction duy nhất của Entity Framework Core[cite: 3].
*   **Kế hoạch cài đặt chi tiết:**
    *   Thống nhất chọn **Giải pháp B**.
    *   Giữ nguyên cấu trúc `FR-RCP-003` và `FR-RCP-004`: Cho phép client truyền cụm đối tượng `nutrition` trực tiếp trong DTO tạo/sửa công thức[cite: 3].
    *   Phía Backend map trực tiếp DTO vào Owned Entity `RecipeNutrition` thông qua cấu hình EF Core trong một lần gọi `SaveChanges()`[cite: 3].

---

## 4. Cơ chế gán số thứ tự Bước làm công thức (StepNumber)

*   **Vấn đề mâu thuẫn:** Tại đặc tả nghiệp vụ `FR-RCP-010`, phần mô tả request body yêu cầu client phải truyền lên `stepNumber`[cite: 3]. Trong khi đó, ngay phần logic triển khai ở dưới lại ghi rõ: `StepNumber = recipe.Steps.Max(s => s.StepNumber) + 1` (tức là Server tự động tính toán và gán số thứ tự)[cite: 3]. Việc bắt client tự quản lý số thứ tự được đánh giá là khá bất tiện và dễ sinh lỗi xung đột[cite: 3].
*   **Các giải pháp đề xuất:**
    *   *Giải pháp A:* Bắt buộc Client tự quản lý và truyền `stepNumber` lên trong payload.
    *   *Giải pháp B:* Server tự động gán số thứ tự tiếp theo dựa vào số lượng bước hiện có[cite: 3].
    *   *Giải pháp C:* Server tự gán lúc tạo mới, đồng thời cung cấp thêm một API phụ trợ để sắp xếp lại vị trí (Reorder Steps) khi người dùng kéo thả giao diện.
*   **Phân tích ưu nhược điểm & Ảnh hưởng:**
    *   *Giải pháp A:* Đơn giản hóa code backend nhưng tạo áp lực lớn cho frontend, dễ gây trùng lặp khóa (Duplicate Key) nếu người dùng thao tác nhanh.
    *   *Giải pháp B:* Nhanh gọn nhưng thiếu linh hoạt nếu người dùng muốn chèn một bước mới vào giữa các bước đã có.
    *   *Giải pháp C:* Giải quyết trọn vẹn bài toán trải nghiệm người dùng (UI/UX) và tính toàn vẹn dữ liệu hệ thống[cite: 3].
*   **Kế hoạch cài đặt chi tiết:**
    *   Thống nhất chọn **Giải pháp C**.
    *   Cập nhật `FR-RCP-010`: Loại bỏ trường `stepNumber` khỏi request body khi gọi lệnh tạo mới bước (`POST`)[cite: 3]. Server sẽ tự động tính toán giá trị tiếp theo.
    *   Bổ sung Endpoint phụ trợ chuyên trách việc thay đổi thứ tự các bước làm nếu cần thiết cho tính năng kéo thả giao diện ở các phiên bản nâng cao.

---

## 5. Định dạng kiểu dữ liệu cho Số lượng nguyên liệu (Quantity / Unit)

*   **Vấn đề mâu thuẫn:** Tại thiết kế Cơ sở dữ liệu (`Chương 7.4`), trường `Quantity` trong bảng `RecipeIngredient` được định nghĩa là kiểu số học `decimal(10,3)` và `Unit` là chuỗi `varchar(50)`[cite: 3]. Tuy nhiên, thực tế nấu ăn thường xuất hiện các định dạng định lượng mang tính định tính hoặc phân số không chuẩn hóa bằng số thập phân đơn thuần, ví dụ như: *"1/2 muỗng canh"*, *"một nhúm"* hoặc *"vài giọt"*[cite: 3]. Nếu chỉ lưu cố định kiểu số `decimal`, giao diện hiển thị sẽ trở nên máy móc (ví dụ: hiển thị `0.5 muỗng canh` thay vì `1/2 muỗng canh`)[cite: 3].
*   **Các giải pháp đề xuất:**
    *   *Giải pháp A:* Chuyển toàn bộ cột `Quantity` thành kiểu chuỗi (`varchar`) để nhập liệu tự do.
    *   *Giải pháp B:* Giữ nguyên kiểu số `decimal` để phục vụ các bài toán tính toán dinh dưỡng hoặc scale khẩu phần ăn sau này[cite: 3].
    *   *Giải pháp C:* Áp dụng mô hình trường kép (Dual-Field Model) - Lưu song song một cột giá trị số học dùng cho tính toán và một cột chuỗi hiển thị trực tiếp ra giao diện.
*   **Phân tích ưu nhược điểm & Ảnh hưởng:**
    *   *Giải pháp A:* Linh hoạt tối đa cho người dùng nhập liệu, nhưng vô hiệu hóa toàn bộ khả năng tính toán tự động, quy đổi định lượng hoặc nhân chia khẩu phần ăn của hệ thống.
    *   *Giải pháp B:* Đảm bảo tính toán chặt chẽ nhưng kém linh hoạt trong văn phong nấu ăn thực tế.
    *   *Giải pháp C:* Vừa giữ được tính toán logic backend vừa mang lại trải nghiệm hiển thị tự nhiên ngoài giao diện người dùng[cite: 3].
*   **Kế hoạch cài đặt chi tiết:**
    *   Thống nhất chọn **Giải pháp C**.
    *   Cập nhật cấu trúc bảng `RecipeIngredient` (Chương 7.4): Giữ nguyên `Quantity` kiểu `decimal(10,3)` phục vụ logic hệ thống và bổ sung thêm trường `QuantityDisplay` kiểu `varchar(50)`[cite: 3].
    *   Khi người dùng nhập chuỗi phân số hoặc định lượng tùy chỉnh (VD: `"1/2"`), Backend lưu giá trị `0.5` vào `Quantity` và lưu nguyên văn chuỗi `"1/2"` vào `QuantityDisplay` để Frontend ưu tiên render trực tiếp ra màn hình chi tiết món ăn.

---

## Kế hoạch Phân công Triển khai Công việc cho Nhóm

Dựa trên các phương án đã chốt, công việc cụ thể được phân bổ cho 4 thành viên trong nhóm như sau:

*   **Nguyễn Đức Thành (Backend & Database Architecture):** Cập nhật lại cấu trúc DbContext, cấu hình Global Query Filter cho Soft Delete, thiết lập mô hình Dual-Field cho nguyên liệu và chuẩn hóa Pipeline xử lý lỗi[cite: 3].
*   **Minh Long (Search & Query Logic):** Chuẩn hóa lại tham số phân trang và sắp xếp `sortBy`/`sortOrder` cho các endpoint danh sách công thức[cite: 3].
*   **Oven (Form UI & Client Validation):** Xây dựng luồng nhập liệu đa bước (Multi-step Wizard) cho form tạo công thức, đảm bảo cơ chế tự động gán số thứ tự bước làm mà không cần nhập thủ công[cite: 3].
*   **Kina Niê (API Integration & Storage):** Hoàn thiện luồng truyền tải dữ liệu trọn gói bao gồm cả đối tượng Nutrition và quản lý định dạng hiển thị số lượng nguyên liệu ở tầng giao diện[cite: 3].
