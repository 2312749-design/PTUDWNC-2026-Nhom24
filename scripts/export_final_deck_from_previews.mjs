import fs from "node:fs/promises";
const { Presentation, PresentationFile } = await import(
  "file:///C:/Program%20Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1119-907-0_26.1119.907.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs"
);

const previewDir = "D:/CulinaryBlog/tmp/final-report/deck-preview";
const output = "D:/CulinaryBlog/output/Slide_ThuyetTrinh_CulinaryBlog.pptx";
const notes = [
  "Mở đầu 20–30 giây: giới thiệu đề tài, nhóm và mục tiêu bám SRS/Lab 2–8.",
  "Nhấn mạnh đây là nền tảng quản lý vòng đời nội dung, không chỉ là trang đọc công thức.",
  "Đi nhanh qua từng Lab; phân biệt seed 10/5 với recipe người dùng 1/1.",
  "Giải thích Dependency Rule và một request đi qua middleware, use case và persistence.",
  "Nêu số liệu theo lần verify 13/11/2026; cập nhật nếu nhóm chạy lại với dữ liệu khác.",
  "Demo một lỗi 422 hoặc 403 và mở Swagger/Scalar nếu thời gian cho phép.",
  "Giải thích HttpOnly + CSRF, refresh rotation, 2FA, thu hồi phiên và xóa tài khoản.",
  "Demo Draft → Publish trong Góc tác giả; Published mới xuất hiện công khai.",
  "Nêu cách bộ đếm category lấy dữ liệu thật và cache bị invalidation sau mutation.",
  "Ưu tiên health + một trace nếu không đủ thời gian mở mọi dashboard.",
  "Nêu Server Component, client island, state/form và accessibility.",
  "Không trộn unit/mock browser với runtime API/E2E thật; số liệu có ngày đo.",
  "Mỗi thành viên nói 20–30 giây và đối chiếu phần việc với lịch sử Git.",
  "Chuẩn bị ảnh/video dự phòng; nói đúng các giới hạn cần credential/hạ tầng thật.",
  "Kết luận ngắn và mời câu hỏi; trả lời bằng file/endpoint/test cụ thể.",
];

const presentation = Presentation.create({ slideSize: { width: 1280, height: 720 } });
for (let i = 0; i < 15; i++) {
  const slide = presentation.slides.add();
  const path = `${previewDir}/slide-${String(i + 1).padStart(2, "0")}.png`;
  const bytes = await fs.readFile(path);
  slide.images.add({
    blob: bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
    contentType: "image/png",
    alt: `Slide ${i + 1} – báo cáo Culinary Blog`,
    fit: "cover",
    position: { left: 0, top: 0, width: 1280, height: 720 },
  });
  slide.speakerNotes.text = notes[i];
}
const pptx = await PresentationFile.exportPptx(presentation);
await pptx.save(output);
console.log(JSON.stringify({ output, slideCount: presentation.slides.items.length, mode: "reviewed-slide-images-with-speaker-notes" }, null, 2));
