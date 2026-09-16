<div align="center">
  <h2>TRƯỜNG ĐẠI HỌC ĐÀ LẠT</h2>
  <h3>KHOA CÔNG NGHỆ THÔNG TIN</h3>
  <h1>BẢNG PHÂN TÍCH & GIẢI QUYẾT XUNG ĐỘT YÊU CẦU PHẦN MỀM (CR-01)</h1>
  <p><b>Dự án:</b> Culinary Blog | <b>Môn học:</b> Phát triển Ứng dụng Web Nâng cao</p>
  <hr style="border: 1px solid black; width: 80%;">
</div>

<br>

### BẢNG TỔNG HỢP CÁC ĐIỂM MÂU THUẪN VÀ GIẢI PHÁP KỸ THUẬT

<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
  <thead>
    <tr style="background-color: #f2f2f2; text-align: center;">
      <th style="width: 5%;">STT</th>
      <th style="width: 25%;">Vấn đề mâu thuẫn</th>
      <th style="width: 35%;">Các giải pháp đề xuất</th>
      <th style="width: 35%;">Giải pháp chốt & Hướng cài đặt</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center"><b>1</b></td>
      <td><b>Cơ chế Xóa dữ liệu</b><br>(Soft Delete vs Hard Delete)</td>
      <td>
        <ul>
          <li><b>A:</b> Hard Delete toàn bộ.</li>
          <li><b>B:</b> Soft Delete 100% (tốn dung lượng MinIO).</li>
          <li><b>C:</b> Soft Delete DB + Hard Delete file ảnh qua Hangfire.</li>
        </ul>
      </td>
      <td><b>Chốt giải pháp C:</b> Dùng cờ <code>IsDeleted = true</code> cho Database và gọi Hangfire Job xóa file vật lý trên MinIO để tối ưu tài nguyên.</td>
    </tr>
    <tr>
      <td align="center"><b>2</b></td>
      <td><b>Tham số Sắp xếp (Sorting)</b><br>(Dùng tiền tố <code>-title</code> hay <code>sortBy/sortOrder</code>)</td>
      <td>
        <ul>
          <li><b>A:</b> Dùng tiền tố <code>-</code> (<code>sort=-title</code>).</li>
          <li><b>B:</b> Tách tham số (<code>sortBy=title&sortOrder=desc</code>).</li>
        </ul>
      </td>
      <td><b>Chốt giải pháp B:</b> Tách bạch <code>sortBy</code> và <code>sortOrder</code> để dễ dàng bind dữ liệu vào C# Model và chuẩn hóa REST API.</td>
    </tr>
    <tr>
      <td align="center"><b>3</b></td>
      <td><b>Khởi tạo Nutrition (Dinh dưỡng)</b><br>(Gửi chung hay tách API riêng)</td>
      <td>
        <ul>
          <li><b>A:</b> Tách API riêng <code>PUT /nutrition</code>.</li>
          <li><b>B:</b> Gửi chung trong Payload Tạo/Sửa Recipe.</li>
        </ul>
      </td>
      <td><b>Chốt giải pháp B:</b> Gộp chung vào API tạo/sửa Recipe vì Nutrition là Owned Entity (nằm cùng bảng), tránh lỗi Concurrency Conflict.</td>
    </tr>
    <tr>
      <td align="center"><b>4</b></td>
      <td><b>Thứ tự Bước làm (StepNumber)</b><br>(Client tự truyền hay Server tự tính)</td>
      <td>
        <ul>
          <li><b>A:</b> Client truyền số thứ tự lên.</li>
          <li><b>B:</b> Server tự gán tự động.</li>
          <li><b>C:</b> Server tự gán khi tạo + Có API Reorder riêng.</li>
        </ul>
      </td>
      <td><b>Chốt giải pháp C:</b> Server tự tính thứ tự tiếp theo khi tạo mới, hỗ trợ API riêng để kéo thả sắp xếp lại vị trí các bước.</td>
    </tr>
    <tr>
      <td align="center"><b>5</b></td>
      <td><b>Kiểu dữ liệu Số lượng Nguyên liệu</b><br>(Kiểu số <code>decimal</code> hay Chuỗi <code>string</code>)</td>
      <td>
        <ul>
          <li><b>A:</b> Chuyển thành String hết (mất logic tính toán).</li>
          <li><b>B:</b> Giữ Decimal (hiển thị UI không tự nhiên).</li>
          <li><b>C:</b> Mô hình Dual-Field (Lưu cả số lẫn chuỗi).</li>
        </ul>
      </td>
      <td><b>Chốt giải pháp C:</b> Bổ sung cột <code>QuantityDisplay</code> kiểu <code>varchar</code> để hiển thị linh hoạt (VD: "1/2"), giữ cột <code>Quantity</code> kiểu số để tính toán.</td>
    </tr>
  </tbody>
</table>

<br>

### KẾ HOẠCH TRIỂN KHAI CHO 4 THÀNH VIÊN
* **Nguyễn Đức Thành:** Xử lý lại phần Database Context, áp dụng mô hình Dual-Field cho nguyên liệu và cấu hình Soft Delete chung.
* **Minh Long:** Cập nhật lại logic Query nhận tham số <code>sortBy</code> và <code>sortOrder</code>.
* **Oven:** Thiết kế lại giao diện Form nhận dữ liệu bước làm không cần nhập thủ công số thứ tự.
* **Kina Niê:** Đảm bảo luồng gọi API gửi kèm gói dữ liệu Nutrition trọn vẹn trong một lần Request tạo Recipe.
