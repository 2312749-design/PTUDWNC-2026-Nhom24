# Bếp Nhà — Cosmic VIP PRO

Giao diện đã được tích hợp vào dự án Next.js hiện tại. Mã frontend đầy đủ nằm trong các thư mục `app`, `src`, `public`; không phải một trang mockup độc lập.

## Chạy với backend hiện tại

```powershell
cd D:\CulinaryBlog\frontend
npm ci
npm run dev -- --port 3000
```

Backend mặc định: `http://localhost:5152/api`. Các cấu hình môi trường và luồng đăng nhập/cookie hiện có được giữ nguyên.

Trang bảng tin: `http://localhost:3000/community`. Trang chủ: `http://localhost:3000/`. Đường dẫn `/home` tiếp tục dùng hành vi chuyển về `/` của dự án hiện tại.

## Các phần giao diện mới

- `src/cosmic-theme.css`: màu dark cosmic, aurora/grid, glass, neon, card/menu, form, trang công thức/danh mục/hồ sơ/admin và trình phát nhạc.
- `src/cosmic-fonts.css`, `public/fonts`: Be Vietnam Pro và Space Grotesk lấy từ Google Fonts, có subset tiếng Việt và được phục vụ trực tiếp từ website. Giấy phép: `public/fonts/OFL.txt`.
- `src/components/cosmic/CosmicExperienceProvider.jsx`: tùy chọn âm thanh/3D/nhện/màu, lưu lựa chọn và điều khiển hiệu ứng toàn ứng dụng.
- `src/components/cosmic/CosmicCanvas.jsx`: hạt nền, liên kết theo chuột và vòng xung kích khi click. Canvas không chặn tương tác, dùng requestAnimationFrame và ngừng vẽ khi tab bị ẩn.
- `src/components/cosmic/CosmicControls.jsx`: công tắc trên header, dùng bàn phím được.
- `src/lib/sci-fi-audio.js`: năm nhóm âm thanh tổng hợp đa tầng: hover, click, power-up, gõ tìm kiếm và jackpot. Có thêm tiếng quét vòng quay. Master gain 0.75, slider 0–100% và Boost, compressor và limiter. Không dùng MP3 cho âm thanh tương tác.
- `src/components/cosmic/CyberSpider.jsx`: nhện tám chân dùng hình học 3D, giải khớp và phép chiếu lên Canvas 2D; HUD đọc thông tin từ thẻ thật. Không yêu cầu Three.js hoặc WebGL.
- `src/components/cosmic/CosmicCommandPalette.jsx`: Ctrl+K tìm món/nguyên liệu qua API và tìm các trang, hỗ trợ ↑/↓, Enter, Escape và nút đóng.
- `src/components/cosmic/FoodRoulette.jsx`: chọn ngẫu nhiên công thức đã xuất bản trong danh sách đang tải; kết quả có liên kết thật; đóng hộp thoại sẽ hủy vòng quay.
- `src/components/cosmic/MusicVisualizer.jsx`: 32 cột lấy tần số thật từ AnalyserNode, bìa đĩa quay và hào quang theo bass. Dừng vẽ khi nhạc dừng, ngoài vùng nhìn, tab ẩn hoặc tắt hiệu ứng.
- `src/cosmic-pro.css`: ba màu Cyan Nebula, Purple Synthwave, Emerald Matrix; card tilt, glare và viền động khi hover; điều khiển mở rộng trên header.
- `src/components/common/ErrorState.jsx`: thông báo HUD có nút đóng, nút thử lại và tự ẩn sau 5 giây. `ToastDeadlineManager.jsx` bảo đảm toast cũng đóng sau 5 giây, kể cả khi tắt hiệu ứng hoặc cửa sổ mất focus.

Các phần được nối thêm ở `app/layout.jsx`, `src/components/layout/AppProviders.jsx` và `src/components/layout/AppHeader.jsx`. Không cần thêm gói thư viện.

## Hành vi

- Âm thanh giao diện bắt đầu sau thao tác đầu tiên do quy định phát âm thanh của trình duyệt. Công tắc âm thanh điều khiển tiếng hover/click; trình phát bài hát giữ điều khiển riêng như trước.
- Khi tắt 3D, canvas được gỡ và hiệu ứng nghiêng/chuyển động trang trí dừng. Chế độ giảm chuyển động của thiết bị mặc định tắt các hiệu ứng này; bạn vẫn có thể chủ động bật lại bằng công tắc và lựa chọn này được lưu.
- Lựa chọn được lưu ở `localStorage['culinary:cosmic-preferences']`; không lưu hoặc thay đổi dữ liệu đăng nhập tại đây.
- Trình phát nhạc hiện có vẫn ở layout chung; thay đổi giao diện không tạo thêm phần tử audio nhạc hoặc làm nó phát lại khi đổi trang nội bộ.
- Nội dung, routes, dữ liệu, form và các hàm API nghiệp vụ giữ nguyên.

## Xác minh phần trình bày

```powershell
npm run build
npx playwright test
```

Đã build thành công 41 trang và đạt 23/23 kiểm tra trình duyệt: giao diện Cosmic, hồi quy motion/toast, synth/Boost, nhện, Ctrl+K, roulette và FFT nhạc thật. Các luồng giao diện giả lập API, không thay thế kiểm tra toàn bộ nghiệp vụ hoặc email thực tế. Kiểm tra live cũng xác nhận Ctrl+K lấy kết quả PostgreSQL thật.

Chạy `node scripts/cosmic-preview.mjs` để chụp desktop/mobile và đo tốc độ trên máy đang dùng. Tốc độ phụ thuộc GPU, thiết bị và trình duyệt; không cam kết cố định 60 FPS trên mọi máy.

Backend trong workspace được sửa riêng hai vấn đề: gọi PostgreSQL FTS bên trong biểu thức LINQ để tránh HTTP 500; bổ sung ngày tạo vào RecipeDto và sắp công thức mới nhất trước, có kiểm tra cache cũ. Không có migration hoặc thao tác xóa dữ liệu cho các sửa đổi này.

Mã đầy đủ trong gói ZIP có thể đặt đè vào thư mục frontend của chính dự án này. Hãy giữ cấu hình `.env.local` riêng của máy; gói ZIP không chứa file môi trường riêng, `node_modules` hoặc các thư mục build/cache.
