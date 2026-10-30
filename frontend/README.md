# CulinaryBlog — Next.js App Router

Chạy `npm ci`, rồi `npm run dev -- --port 3000`. Backend local: http://localhost:5152.

Tất cả URL được định nghĩa bằng thư mục trong `app/`. Không còn BrowserRouter, ClientApp fallback hoặc Vite. `src/navigation.jsx` dùng Next Link và hook của Next.

- `npm run build`: build production.
- `npm test`: kiểm thử định dạng API và JSON-LD.
- `npx playwright install chromium` rồi `npx playwright test`: kiểm thử giao diện. Build trước; Playwright tự bật frontend nếu cần. Các ca quản trị giả lập API; phân quyền thật được kiểm tra bằng backend TestServer.
- `/admin`: trang quản trị, API yêu cầu JWT role Admin.

Biến môi trường: `NEXT_PUBLIC_API_URL` mặc định http://localhost:5152/api; `NEXT_PUBLIC_SITE_URL` mặc định http://localhost:3000; `API_INTERNAL_URL` gồm `/api/v1` cho SSR/sitemap trong Docker.

Google OAuth cần `NEXT_PUBLIC_GOOGLE_CLIENT_ID` khớp `Google__ClientId` ở backend và origin frontend được khai báo trong Google Cloud Console. Build lại sau khi đổi biến `NEXT_PUBLIC_*`.
