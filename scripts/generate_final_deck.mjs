import fs from "node:fs/promises";
const { Presentation, PresentationFile } = await import(
  "file:///C:/Program%20Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1119-907-0_26.1119.907.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs"
);

const input = "D:/Downloads/MauThietKe_CuoiKy.pptx";
const output = "D:/CulinaryBlog/output/Slide_ThuyetTrinh_CulinaryBlog_TiengViet.pptx";
const previewDir = "D:/CulinaryBlog/tmp/final-report/deck-preview";
const logoPath = "D:/CulinaryBlog/tmp/final-report/assets/ppt/ppt/media/image1.png";

const C = {
  navy: "#0D2A4A",
  blue: "#2B6CB0",
  orange: "#F2A900",
  text: "#243447",
  muted: "#687889",
  light: "#F3F5F7",
  paleBlue: "#EAF2F8",
  paleGreen: "#EAF3EF",
  paleOrange: "#FBF3E2",
  white: "#FFFFFF",
  border: "#D6DEE8",
  green: "#27735A",
};

const W = 1280;
const H = 720;

function addText(slide, text, x, y, w, h, opts = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position: { left: x, top: y, width: w, height: h },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = text;
  shape.text.style = {
    fontFamily: opts.fontFamily || "Arial",
    fontSize: opts.fontSize || "18pt",
    bold: opts.bold || false,
    italic: opts.italic || false,
    color: opts.color || C.text,
    ...(opts.align ? { alignment: opts.align } : {}),
    ...(opts.valign ? { verticalAlignment: opts.valign } : {}),
  };
  return shape;
}

function addRect(slide, x, y, w, h, fill, radius = "rounded-xl", line = C.border) {
  return slide.shapes.add({
    geometry: radius === "none" ? "rect" : "roundRect",
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: { style: "solid", fill: line, width: line === "none" ? 0 : 1 },
    ...(radius !== "none" ? { borderRadius: radius } : {}),
  });
}

function addHeader(slide, title, section, number) {
  addRect(slide, 0, 0, W, 10, C.navy, "none", "none");
  addText(slide, section.toUpperCase(), 70, 34, 330, 24, { fontSize: "10pt", bold: true, color: C.orange });
  addText(slide, title, 70, 63, 1110, 55, { fontSize: "26pt", bold: true, color: C.navy });
  addRect(slide, 70, 123, 68, 5, C.orange, "none", "none");
  addText(slide, `CULINARY BLOG  •  ĐỒ ÁN WEB  •  2026`, 70, 684, 700, 18, { fontSize: "8pt", color: C.muted });
  addText(slide, String(number).padStart(2, "0"), 1160, 679, 50, 22, { fontSize: "9pt", bold: true, color: C.muted, align: "right" });
}

function addBulletList(slide, items, x, y, w, size = 16, gap = 44, color = C.text) {
  items.forEach((item, i) => {
    addRect(slide, x, y + i * gap + 8, 7, 7, C.orange, "rounded-full", "none");
    addText(slide, item, x + 20, y + i * gap, w - 20, gap - 4, { fontSize: `${size}pt`, color });
  });
}

function addCard(slide, x, y, w, h, title, body, fill = C.light, accent = C.navy) {
  addRect(slide, x, y, w, h, fill, "rounded-2xl", "#FFFFFF");
  addText(slide, title.toUpperCase(), x + 24, y + 22, w - 48, 30, { fontSize: "11pt", bold: true, color: accent });
  addText(slide, body, x + 24, y + 62, w - 48, h - 82, { fontSize: "14pt", color: C.text });
}

function addMetric(slide, x, y, w, value, label, fill = C.paleBlue) {
  addRect(slide, x, y, w, 112, fill, "rounded-2xl", "#FFFFFF");
  addText(slide, value, x + 10, y + 18, w - 20, 45, { fontSize: "24pt", bold: true, color: C.navy, align: "center" });
  addText(slide, label, x + 10, y + 69, w - 20, 26, { fontSize: "10pt", color: C.muted, align: "center" });
}

function addPlaceholder(slide, x, y, w, h, title, note) {
  addRect(slide, x, y, w, h, "#EEF2F5", "rounded-xl", "#9AA8B5");
  if (h < 140) {
    addText(slide, "[ẢNH DEMO]", x + 18, y + 10, w - 36, 18, { fontSize: "9pt", bold: true, color: C.blue, align: "center" });
    addText(slide, title, x + 22, y + 32, w - 44, 28, { fontSize: "14pt", bold: true, color: C.navy, align: "center" });
    addText(slide, note, x + 24, y + 65, w - 48, h - 72, { fontSize: "8pt", italic: true, color: C.muted, align: "center" });
    return;
  }
  addText(slide, "[ẢNH DEMO]", x + 20, y + 25, w - 40, 30, { fontSize: "12pt", bold: true, color: C.blue, align: "center" });
  addText(slide, title, x + 28, y + 65, w - 56, 42, { fontSize: "17pt", bold: true, color: C.navy, align: "center" });
  addText(slide, note, x + 28, y + 119, w - 56, h - 140, { fontSize: "10pt", italic: true, color: C.muted, align: "center" });
}

function addFlow(slide, items, y, fills = [C.paleOrange, C.paleBlue, C.paleGreen, "#E8EEF7"]) {
  const x0 = 70;
  const gap = 18;
  const totalW = 1140;
  const boxW = (totalW - gap * (items.length - 1)) / items.length;
  items.forEach((item, i) => {
    const x = x0 + i * (boxW + gap);
    addRect(slide, x, y, boxW, 112, fills[i % fills.length], "rounded-xl", "#FFFFFF");
    addText(slide, item.title, x + 14, y + 20, boxW - 28, 28, { fontSize: "13pt", bold: true, color: C.navy, align: "center" });
    addText(slide, item.body, x + 16, y + 55, boxW - 32, 43, { fontSize: "9.5pt", color: C.text, align: "center" });
    if (i < items.length - 1) addText(slide, "→", x + boxW + 1, y + 38, gap - 2, 32, { fontSize: "18pt", bold: true, color: C.orange, align: "center" });
  });
}

function setNotes(slide, text) {
  slide.speakerNotes.text = text;
}

async function main() {
  await fs.mkdir(previewDir, { recursive: true });
  await fs.mkdir("D:/CulinaryBlog/output", { recursive: true });

  const presentation = Presentation.create({ slideSize: { width: W, height: H } });

  // 1 — Cover
  {
    const s = presentation.slides.add();
    s.background.fill = C.white;
    addRect(s, 0, 0, W, 14, C.navy, "none", "none");
    const logoBytes = await fs.readFile(logoPath);
    s.images.add({
      blob: logoBytes.buffer.slice(logoBytes.byteOffset, logoBytes.byteOffset + logoBytes.byteLength),
      contentType: "image/png", alt: "Logo Trường Đại học Đà Lạt", fit: "contain",
      position: { left: 70, top: 50, width: 86, height: 86 },
    });
    addText(s, "TRƯỜNG ĐẠI HỌC ĐÀ LẠT", 176, 58, 560, 36, { fontSize: "20pt", bold: true, color: C.navy });
    addText(s, "KHOA CÔNG NGHỆ THÔNG TIN", 176, 97, 500, 28, { fontSize: "12pt", color: C.muted });
    addText(s, "BÁO CÁO ĐỒ ÁN  •  [TÊN MÔN HỌC]", 70, 170, 700, 32, { fontSize: "13pt", bold: true, color: C.blue });
    addRect(s, 70, 222, 690, 310, C.navy, "rounded-2xl", C.navy);
    addText(s, "ĐỀ TÀI", 104, 260, 300, 26, { fontSize: "10pt", bold: true, color: C.orange });
    addText(s, "XÂY DỰNG ỨNG DỤNG WEB\nBLOG ẨM THỰC VÀ NẤU ĂN", 104, 305, 600, 115, { fontSize: "28pt", bold: true, color: C.white });
    addRect(s, 104, 442, 80, 6, C.orange, "none", "none");
    addText(s, "DỰ ÁN: CULINARY BLOG – BẾP NHÀ", 104, 470, 580, 35, { fontSize: "17pt", bold: true, color: C.orange });
    addRect(s, 790, 222, 420, 310, C.light, "rounded-2xl", "#FFFFFF");
    addText(s, "Giảng viên hướng dẫn", 824, 254, 330, 24, { fontSize: "10pt", color: C.muted });
    addText(s, "[TÊN GIẢNG VIÊN]", 824, 280, 330, 32, { fontSize: "16pt", bold: true, color: C.navy });
    addText(s, "Nhóm sinh viên thực hiện", 824, 340, 330, 24, { fontSize: "10pt", color: C.muted });
    addText(s, "Nguyễn Đức Thành  •  [MSSV]\nMinh Long  •  [MSSV]\nOven  •  [MSSV]\nKina Niê  •  [MSSV]", 824, 373, 330, 120, { fontSize: "12pt", color: C.text });
    addText(s, "Đà Lạt, 2026", 70, 642, 1140, 24, { fontSize: "11pt", color: C.muted, align: "center" });
    setNotes(s, "Mở đầu 20–30 giây: giới thiệu tên đề tài, nhóm, mục tiêu xây dựng nền tảng chia sẻ công thức bám SRS và các Lab 2–8.");
  }

  // 2
  {
    const s = presentation.slides.add(); addHeader(s, "Bài toán, mục tiêu và phạm vi", "Tổng quan", 2);
    addCard(s, 70, 160, 350, 215, "Bài toán", "Công thức phân tán, thiếu cấu trúc; khó tìm kiếm, quản lý vòng đời và kiểm soát quyền nội dung.", C.paleOrange, C.navy);
    addCard(s, 447, 160, 350, 215, "Mục tiêu", "Xây dựng ứng dụng Web đầy đủ theo kiến trúc API, dễ dùng, có dữ liệu thật, bảo mật, kiểm thử và triển khai bằng Docker.", C.paleBlue, C.navy);
    addCard(s, 824, 160, 386, 215, "Phạm vi lõi", "Xác thực • Danh mục • Công thức • Tìm kiếm • Ảnh • Tác vụ nền • Quan sát hệ thống • Giao diện.", C.paleGreen, C.navy);
    addText(s, "Đối tượng sử dụng", 70, 420, 300, 30, { fontSize: "15pt", bold: true, color: C.navy });
    addFlow(s, [
      { title: "Khách", body: "Xem và tìm kiếm" },
      { title: "Người dùng", body: "Hồ sơ và bảo mật" },
      { title: "Tác giả", body: "Tạo và xuất bản" },
      { title: "Quản trị viên", body: "Quản trị hệ thống" },
    ], 470);
    setNotes(s, "Nhấn mạnh sản phẩm không chỉ là trang đọc công thức: có vòng đời nội dung, quyền theo vai trò và hạ tầng vận hành. Phần ngoài phạm vi SRS như thanh toán/mobile không được tuyên bố.");
  }

  // 3
  {
    const s = presentation.slides.add(); addHeader(s, "Lộ trình hoàn thành Lab 2–8", "Yêu cầu học phần", 3);
    const labs = [
      ["LAB 2", "Kiến trúc sạch\nThực thể • DbContext • Migration • Dữ liệu mẫu 20/100/10/5"],
      ["LAB 3–4", "Ngoại lệ nghiệp vụ\nRepository/UoW • Chi tiết lỗi • Đầy đủ API"],
      ["LAB 5", "CORS • Giới hạn tần suất\nJWT/RBAC • Tài liệu và phiên bản API • Khởi tạo giao diện"],
      ["LAB 6", "Tiện ích gọi API • Kho trạng thái\nThư viện giao diện • Thành phần dùng chung • Bố cục"],
      ["LAB 7", "Xác thực và hồ sơ\nTrang chủ • Chi tiết • Tìm kiếm • Danh mục"],
      ["LAB 8", "Tải ảnh • Vòng đời công thức\nQuản lý người dùng • Ghi log • Hoàn thiện SRS"],
    ];
    labs.forEach((lab, i) => {
      const row = Math.floor(i / 3); const col = i % 3;
      addCard(s, 70 + col * 380, 160 + row * 220, 350, 188, lab[0], lab[1], [C.paleOrange, C.paleBlue, C.paleGreen][col], C.navy);
    });
    addText(s, "Quy tắc tách biệt: dữ liệu mẫu Lab 2 phải có ≥10 nguyên liệu/≥5 bước; công thức người dùng theo SRS tối thiểu 1/1.", 70, 615, 1140, 35, { fontSize: "12pt", italic: true, color: C.muted, align: "center" });
    setNotes(s, "Đi nhanh qua từng Lab. Giải thích nhóm không đánh đồng yêu cầu dữ liệu mẫu 10/5 với quy tắc công thức do người dùng tạo 1/1.");
  }

  // 4
  {
    const s = presentation.slides.add(); addHeader(s, "Kiến trúc sạch và luồng xử lý", "Kiến trúc", 4);
    addFlow(s, [
      { title: "Miền nghiệp vụ", body: "Thực thể • Kiểu liệt kê\nQuy tắc nghiệp vụ" },
      { title: "Tầng ứng dụng", body: "CQRS • Kiểm tra dữ liệu\nDTO • Giao diện trừu tượng" },
      { title: "Tầng hạ tầng", body: "EF Core • PostgreSQL\nRedis • MinIO" },
      { title: "API và giao diện", body: "Minimal API\nNext.js App Router" },
    ], 165);
    addText(s, "Luồng xử lý yêu cầu", 70, 325, 300, 30, { fontSize: "15pt", bold: true, color: C.navy });
    addFlow(s, [
      { title: "Trình duyệt", body: "Next.js và trình duyệt Web" },
      { title: "Lớp trung gian", body: "Bảo mật • Lỗi • Theo vết" },
      { title: "Ca sử dụng", body: "Kiểm tra • Phân quyền • Nghiệp vụ" },
      { title: "Dữ liệu", body: "PostgreSQL • Bộ nhớ đệm • Lưu trữ" },
    ], 375, ["#F5F7FA", C.paleBlue, C.paleGreen, C.paleOrange]);
    addCard(s, 70, 535, 1140, 90, "Quy tắc phụ thuộc", "Miền nghiệp vụ không phụ thuộc tầng ngoài. Tầng ứng dụng chỉ dùng giao diện trừu tượng. Hạ tầng và API được ghép nối tại điểm khởi tạo hệ thống.", "#E8EEF7", C.blue);
    setNotes(s, "Trình bày quy tắc phụ thuộc và một yêu cầu mẫu. Có thể mở cấu trúc solution nếu giảng viên hỏi bốn project.");
  }

  // 5
  {
    const s = presentation.slides.add(); addHeader(s, "Mô hình dữ liệu, migration và dữ liệu mẫu", "Dữ liệu", 5);
    addMetric(s, 70, 155, 250, "20", "CATEGORY ĐÃ ĐO", C.paleGreen);
    addMetric(s, 340, 155, 250, "1013", "CÔNG THỨC Ở LẦN KIỂM TRA SẠCH", C.paleOrange);
    addMetric(s, 610, 155, 250, "10+", "NGUYÊN LIỆU / CÔNG THỨC MẪU", C.paleBlue);
    addMetric(s, 880, 155, 250, "5+", "BƯỚC / CÔNG THỨC MẪU", "#E8EEF7");
    addCard(s, 70, 300, 500, 270, "Các thực thể cốt lõi", "Người dùng (ApplicationUser)\nDanh mục (Category)\nCông thức và dinh dưỡng\nNguyên liệu\nBước thực hiện\nẢnh công thức\nPhiên làm mới", C.light, C.navy);
    addPlaceholder(s, 600, 300, 610, 270, "Sơ đồ quan hệ dữ liệu", "Chụp quan hệ Người dùng, Danh mục, Công thức, Nguyên liệu, Bước, Ảnh và Phiên làm mới.");
    addText(s, "Seeder idempotent: restart không tạo trùng; không tự đặt lại mật khẩu/quyền của tài khoản đã tồn tại.", 70, 600, 1140, 34, { fontSize: "12pt", italic: true, color: C.muted, align: "center" });
    setNotes(s, "Nêu số liệu đúng theo lần kiểm tra ngày 13/11/2026. Nếu dữ liệu hiện tại thay đổi, cập nhật slide trước khi nộp.");
  }

  // 6
  {
    const s = presentation.slides.add(); addHeader(s, "REST API v1 và xử lý lỗi toàn cục", "Phía máy chủ", 6);
    addCard(s, 70, 155, 355, 360, "Nhóm địa chỉ API", "Xác thực và hồ sơ\nDanh mục\nCông thức và vòng đời\nNguyên liệu và bước\nẢnh\nTìm kiếm\nTình trạng hệ thống", C.paleBlue, C.navy);
    addCard(s, 450, 155, 355, 360, "Chuỗi xử lý", "Minimal API\nKiểm tra dữ liệu\nPhân quyền\nBộ xử lý CQRS\nQuy tắc nghiệp vụ\nRepository / UoW\nLàm mới bộ nhớ đệm", C.paleGreen, C.navy);
    addPlaceholder(s, 830, 155, 380, 360, "Swagger / Scalar", "Chụp API v1 có nhóm Xác thực, Danh mục, Công thức, Tìm kiếm và nút xác thực (Authorize).");
    addText(s, "Chi tiết lỗi theo RFC 7807: 400 • 401 • 403 • 404 • 409/412 • 422 • 429 • 500", 70, 555, 1140, 45, { fontSize: "16pt", bold: true, color: C.navy, align: "center" });
    addText(s, "Giao diện dùng bộ gọi API chung để chuyển lỗi thành thông báo dễ hiểu và giữ mã liên kết phục vụ truy vết.", 70, 615, 1140, 30, { fontSize: "11pt", color: C.muted, align: "center" });
    setNotes(s, "Demo một lỗi dữ liệu 422 hoặc lỗi quyền 403. Nhấn mạnh lớp trung gian trả chi tiết lỗi thống nhất, không đưa lỗi 500 thô ra giao diện.");
  }

  // 7
  {
    const s = presentation.slides.add(); addHeader(s, "Xác thực, phân quyền và bảo mật tài khoản", "Bảo mật", 7);
    addCard(s, 70, 155, 350, 410, "Phiên đăng nhập", "JWT access token ngắn hạn\nRefresh token rotation\nReplay detection\nCookie HttpOnly\nSameSite / Secure\nThu hồi một hoặc toàn bộ phiên", C.paleBlue, C.navy);
    addCard(s, 447, 155, 350, 410, "Bảo vệ API", "Phân quyền Người dùng/Tác giả/Quản trị viên\nQuyền theo tài nguyên\nDanh sách CORS được phép\nGiới hạn tần suất\nCSRF hai lớp và kiểm tra nguồn\nKhóa bí mật từ biến môi trường", C.paleGreen, C.navy);
    addPlaceholder(s, 824, 155, 386, 410, "Cài đặt 2FA", "Chụp mã QR thiết lập, ô mã 6 số, mã khôi phục; hoặc danh sách phiên và nút Xóa tài khoản. Che khóa bí mật.");
    addText(s, "“Thu hồi phiên” = vô hiệu hóa refresh token; thiết bị phải đăng nhập lại. “Xóa tài khoản” thu hồi phiên và xóa dữ liệu định danh, giữ nội dung công khai dưới tác giả ẩn danh.", 70, 595, 1140, 55, { fontSize: "11pt", italic: true, color: C.muted, align: "center" });
    setNotes(s, "Đây là phần giảng viên dễ hỏi. Giải thích HttpOnly giảm nguy cơ lấy token bằng JavaScript nhưng vẫn cần CSRF. Giải thích 2FA TOTP và recovery code.");
  }

  // 8
  {
    const s = presentation.slides.add(); addHeader(s, "Vòng đời công thức và Góc tác giả", "Recipe", 8);
    addFlow(s, [
      { title: "Bản nháp", body: "Nhập biểu mẫu nhiều bước\nLưu nội dung" },
      { title: "Đã xuất bản", body: "Công khai • Tìm kiếm\nDanh mục • Sitemap" },
      { title: "Đã lưu trữ", body: "Ẩn khỏi trang công khai\nGiữ dữ liệu" },
      { title: "Khôi phục / Xóa", body: "Khôi phục hoặc xóa\nđúng quyền" },
    ], 155);
    addPlaceholder(s, 70, 305, 550, 280, "Góc tác giả /dashboard", "Chụp danh sách công thức có Nháp, Đã xuất bản, Đã lưu trữ và các nút Sửa, Xuất bản, Lưu trữ, Xóa.");
    addPlaceholder(s, 650, 305, 560, 280, "Biểu mẫu tạo công thức", "Chụp phần nguyên liệu, bước thực hiện, tải ảnh và thông báo kiểm tra dữ liệu.");
    addText(s, "Tên menu “Góc tác giả” hợp lý hơn “Công thức của tôi” vì trang quản lý bao gồm vòng đời, tạo/sửa và theo dõi nội dung.", 70, 615, 1140, 34, { fontSize: "11.5pt", italic: true, color: C.muted, align: "center" });
    setNotes(s, "Demo luồng Nháp sang Đã xuất bản. Nói rõ công thức đã xuất bản mới xuất hiện công khai. Nút tạo công thức dư ở đầu trang đã được bỏ để điều hướng gọn hơn.");
  }

  // 9
  {
    const s = presentation.slides.add(); addHeader(s, "Danh mục, tìm kiếm tiếng Việt và bộ nhớ đệm Redis", "Khám phá nội dung", 9);
    addCard(s, 70, 155, 350, 365, "Danh mục", "Đường dẫn ngắn, mô tả và ảnh\nBộ đếm lấy từ dữ liệu thật\nQuản trị viên thêm, sửa, xóa\nChặn xóa khi còn công thức hoạt động", C.paleGreen, C.navy);
    addCard(s, 447, 155, 350, 365, "Tìm kiếm toàn văn", "PostgreSQL FTS\nunaccent / pg_trgm / GIN\nCó dấu và không dấu\nLọc • Sắp xếp • Phân trang", C.paleBlue, C.navy);
    addCard(s, 824, 155, 386, 365, "Redis", "Lưu tạm danh sách và chi tiết\nKhóa theo nhóm dữ liệu\nLàm mới khi công thức, danh mục, nguyên liệu, bước hoặc ảnh thay đổi\nDùng cơ sở dữ liệu khi Redis lỗi", C.paleOrange, C.navy);
    addPlaceholder(s, 70, 545, 1140, 100, "Ảnh demo cần thay", "Chụp /categories có ảnh + số lượng và /search với từ khóa không dấu, bộ lọc, pagination. Có thể ghép 2 ảnh ngang.");
    setNotes(s, "Giải thích lỗi bộ đếm 15 cố định đã được thay bằng số liệu thật. Xóa công thức phải cập nhật bộ đếm, danh sách và trang chi tiết thông qua cơ sở dữ liệu và bộ nhớ đệm.");
  }

  // 10
  {
    const s = presentation.slides.add(); addHeader(s, "Ảnh, tác vụ nền, SEO và quan sát hệ thống", "Hạ tầng", 10);
    const cards = [
      ["MinIO", "Lưu trữ tệp\nURL từ biến môi trường"],
      ["Ảnh an toàn", "Kiểm tra chữ ký tệp và MIME\nTối đa 5 MB • đúng chủ sở hữu"],
      ["Hangfire", "Thư chào mừng • ảnh thu nhỏ\nSitemap • dọn tệp"],
      ["SEO", "Open Graph\nJSON-LD Recipe • sitemap"],
      ["Quan sát hệ thống", "Serilog • OTel\nJaeger • Prometheus • Grafana"],
    ];
    cards.forEach((c, i) => addCard(s, 70 + i * 228, 155, 210, 230, c[0], c[1], i % 2 ? C.paleOrange : C.paleGreen, C.navy));
    addPlaceholder(s, 70, 420, 550, 195, "Ảnh công thức / MinIO", "Chụp tải ảnh thành công, thẻ công thức dùng ảnh thu nhỏ và trang chi tiết dùng ảnh lớn.");
    addPlaceholder(s, 650, 420, 560, 195, "Jaeger / Grafana / Tình trạng", "Chụp /health/ready và một luồng theo vết hoặc bảng chỉ số.");
    setNotes(s, "Nêu lợi ích tách tác vụ chậm khỏi HTTP. Nếu không đủ thời gian demo cả Jaeger/Grafana, ưu tiên health + một trace.");
  }

  // 11
  {
    const s = presentation.slides.add(); addHeader(s, "Giao diện Next.js và trải nghiệm người dùng", "Giao diện", 11);
    addCard(s, 70, 155, 350, 285, "Kiến trúc", "App Router\nISR cho Trang chủ và Danh mục\nSSR cho Công thức và Tìm kiếm\nServer Component cho trang chi tiết\nVùng tương tác phía trình duyệt", C.paleBlue, C.navy);
    addCard(s, 447, 155, 350, 285, "Trạng thái và biểu mẫu", "TanStack Query\nZustand\nReact Hook Form\nZod + useFieldArray\nBộ gọi API dùng chung", C.paleGreen, C.navy);
    addCard(s, 824, 155, 386, 285, "Giao diện dùng chung", "Đầu trang / Cuối trang / Khung ứng dụng\nĐang tải • Lỗi • Không có dữ liệu\nPhân trang • Hộp thoại • Thông báo\nThích ứng màn hình • Khả năng tiếp cận", C.paleOrange, C.navy);
    addPlaceholder(s, 70, 475, 1140, 160, "Ảnh giao diện", "Ghép 3 ảnh: trang chủ trên máy tính, chi tiết công thức và màn hình di động 390 px. Ưu tiên ảnh thật, chú thích ngắn.");
    setNotes(s, "Nêu cách giảm tải bundle: nội dung recipe chính render server, chỉ action dùng client. Nhắc axe/accessibility và responsive.");
  }

  // 12
  {
    const s = presentation.slides.add(); addHeader(s, "Kết quả kiểm thử và chất lượng", "Kiểm chứng", 12);
    addMetric(s, 70, 155, 205, "102/102", "PHÍA MÁY CHỦ", C.paleBlue);
    addMetric(s, 295, 155, 205, "20/20", "KIỂM THỬ GIAO DIỆN", C.paleGreen);
    addMetric(s, 520, 155, 205, "86/86", "API KHI CHẠY THẬT", C.paleOrange);
    addMetric(s, 745, 155, 205, "12/12", "LUỒNG TRÊN TRÌNH DUYỆT", "#E8EEF7");
    addMetric(s, 970, 155, 240, "90,12%", "ĐỘ PHỦ TẦNG ỨNG DỤNG", C.paleBlue);
    addCard(s, 70, 305, 545, 250, "Chất lượng bổ sung", "• Kiểm thử hồi quy trình soạn thảo: 7/7\n• Khả năng tiếp cận: 4/4 trang lõi\n• Bản dựng Docker/Next thực tế: đạt\n• Sao lưu và phục hồi: dữ liệu khớp", C.light, C.navy);
    addPlaceholder(s, 645, 305, 565, 250, "Kết quả kiểm thử / CI", "Chụp cửa sổ lệnh hoặc CI có phía máy chủ 102/102 và giao diện 20/20; không để lộ khóa bí mật.");
    addText(s, "Độ phủ và kiểm thử đạt không đồng nghĩa hệ thống không còn lỗi; nhóm tách rõ kiểm thử đơn vị, mô phỏng trình duyệt, API khi chạy thật và E2E.", 70, 595, 1140, 40, { fontSize: "11pt", italic: true, color: C.muted, align: "center" });
    setNotes(s, "Nói rõ số liệu có ngày đo 13/11/2026. Không trộn kết quả browser mock với E2E backend thật.");
  }

  // 13
  {
    const s = presentation.slides.add(); addHeader(s, "Phân công công việc theo giai đoạn", "Nhóm", 13);
    addCard(s, 70, 155, 260, 405, "Nguyễn Đức Thành", "Trưởng nhóm phía máy chủ\nKiến trúc sạch\nCơ sở dữ liệu / Xác thực / JWT\nPhân quyền\nNền tảng API / Bảo mật", C.paleBlue, C.navy);
    addCard(s, 350, 155, 260, 405, "Minh Long", "Công thức / Dữ liệu\nNguyên liệu và bước\nVòng đời công thức\nTìm kiếm PostgreSQL\nRedis / Kiểm thử phía máy chủ", C.paleGreen, C.navy);
    addCard(s, 630, 155, 260, 405, "Oven", "Giao diện / Tích hợp\nBiểu mẫu tạo công thức\nKiểm tra dữ liệu / Thông báo\nDanh mục / Bảng điều khiển\nThành phần dùng chung", C.paleOrange, C.navy);
    addCard(s, 910, 155, 300, 405, "Kina Niê", "Ảnh / Vận hành\nMinIO / Xử lý ảnh\nChi tiết công thức / SEO\nTình trạng / Ghi log\nDocker / CI", "#E8EEF7", C.navy);
    addText(s, "Mỗi nhiệm vụ chỉ hoàn thành khi có mã nguồn, kiểm thử và commit/PR. Trước khi nộp, đối chiếu bảng phân công với lịch sử Git thật.", 70, 600, 1140, 42, { fontSize: "12pt", bold: true, color: C.navy, align: "center" });
    setNotes(s, "Mỗi thành viên nói 20–30 giây về use case chính, request flow, test và lỗi khó. Không nhận phần việc không có bằng chứng Git.");
  }

  // 14
  {
    const s = presentation.slides.add(); addHeader(s, "Kịch bản trình diễn và giới hạn cần nói rõ", "Trình diễn", 14);
    addCard(s, 70, 155, 545, 380, "Trình diễn 8–10 phút", "1. Tình trạng hệ thống và Trang chủ\n2. Đăng nhập Tác giả, mở Góc tác giả\n3. Tạo công thức và tải ảnh\n4. Xuất bản, tìm kiếm và xem danh mục\n5. 2FA, phiên đăng nhập và xóa tài khoản\n6. Quản trị người dùng và danh mục\n7. Swagger, Jaeger và Grafana\n8. Kết quả kiểm thử", C.paleGreen, C.navy);
    addCard(s, 645, 155, 565, 380, "Giới hạn cần nói rõ", "• Google OAuth và SMTP thật cần thông tin xác thực\n• Tên miền, TLS và khóa bí mật thực tế cần hạ tầng thật\n• Tỷ lệ trúng Redis cần đo lại\n• k6 mặc định trả 429 khi 100 người dùng ảo chung IP\n• PR và xét duyệt cần bằng chứng tài khoản thật", C.paleOrange, C.navy);
    addText(s, "Chuẩn bị trên một máy: báo cáo • slide • mã nguồn • Docker • tài khoản demo • ảnh hoặc video dự phòng", 70, 575, 1140, 48, { fontSize: "15pt", bold: true, color: C.navy, align: "center" });
    setNotes(s, "Trước khi trình bày mở sẵn tab, tắt thông báo, che token/secret. Nếu dịch vụ ngoài lỗi, dùng ảnh/video dự phòng và nói đúng giới hạn.");
  }

  // 15
  {
    const s = presentation.slides.add();
    s.background.fill = C.navy;
    const logoBytes = await fs.readFile(logoPath);
    s.images.add({
      blob: logoBytes.buffer.slice(logoBytes.byteOffset, logoBytes.byteOffset + logoBytes.byteLength),
      contentType: "image/png", alt: "Logo Trường Đại học Đà Lạt", fit: "contain",
      position: { left: 585, top: 86, width: 110, height: 110 },
    });
    addText(s, "KẾT QUẢ ĐẠT ĐƯỢC", 70, 235, 1140, 30, { fontSize: "12pt", bold: true, color: C.orange, align: "center" });
    addText(s, "ỨNG DỤNG HOÀN CHỈNH • BẢO MẬT • DỮ LIỆU • KIỂM THỬ • TRIỂN KHAI", 110, 285, 1060, 45, { fontSize: "19pt", bold: true, color: C.white, align: "center" });
    addText(s, "Culinary Blog hoàn thành phần lõi SRS và các yêu cầu Lab 2–8, đồng thời bổ sung 2FA, quản lý phiên, xóa tài khoản, SEO và observability.", 200, 355, 880, 70, { fontSize: "15pt", color: "#D9E3EE", align: "center" });
    addRect(s, 565, 455, 150, 6, C.orange, "none", "none");
    addText(s, "XIN CHÂN THÀNH CẢM ƠN!", 70, 500, 1140, 52, { fontSize: "28pt", bold: true, color: C.white, align: "center" });
    addText(s, "Kính mời giảng viên đặt câu hỏi và góp ý.", 70, 575, 1140, 36, { fontSize: "14pt", color: "#D9E3EE", align: "center" });
    addText(s, "Culinary Blog  •  Trường Đại học Đà Lạt  •  2026", 70, 670, 1140, 20, { fontSize: "9pt", color: "#AFC1D4", align: "center" });
    setNotes(s, "Kết luận 20 giây, sau đó mời câu hỏi. Khi trả lời, ưu tiên dẫn tới file/endpoint/test cụ thể thay vì nói chung chung.");
  }

  for (let i = 0; i < presentation.slides.items.length; i++) {
    const slide = presentation.slides.getItem(i);
    const png = await presentation.export({ slide, format: "png", scale: 1 });
    await fs.writeFile(`${previewDir}/slide-${String(i + 1).padStart(2, "0")}.png`, new Uint8Array(await png.arrayBuffer()));
    const layout = await slide.export({ format: "layout" });
    await fs.writeFile(`${previewDir}/slide-${String(i + 1).padStart(2, "0")}.layout.json`, await layout.text());
  }
  const montage = await presentation.export({ format: "webp", montage: true });
  await fs.writeFile(`${previewDir}/montage.webp`, new Uint8Array(await montage.arrayBuffer()));

  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(output);
  console.log(JSON.stringify({ output, slideCount: presentation.slides.items.length, previewDir }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
