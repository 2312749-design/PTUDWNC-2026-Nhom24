import './globals.css'

export const metadata = {
  title: {
    default: 'CulinaryBlog — Cộng đồng ẩm thực',
    template: '%s | CulinaryBlog',
  },
  description: 'Khám phá công thức món ăn, chia sẻ kinh nghiệm nấu ăn và kết nối cộng đồng ẩm thực.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'CulinaryBlog — Cộng đồng ẩm thực',
    description: 'Công thức, câu chuyện và cảm hứng từ cộng đồng nấu ăn.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
