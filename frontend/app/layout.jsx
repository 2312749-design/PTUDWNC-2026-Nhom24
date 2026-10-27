import './globals.css'
import '../src/App.css'
import '../src/CommunityPages.css'
import 'react-toastify/dist/ReactToastify.css'
import JsonLd from './JsonLd'
import '../src/components/common/common.css'
import '../src/ProExperience.css'
import AppProviders from '../src/components/layout/AppProviders'
import AppShell from '../src/components/layout/AppShell'
import '../src/cosmic-fonts.css'
import '../src/cosmic-theme.css'
import '../src/cosmic-pro.css'

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
    <html lang="vi" data-cosmic-theme="true" suppressHydrationWarning>
      <body><JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebSite', name: 'CulinaryBlog', url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000' }} /><AppProviders><AppShell>{children}</AppShell></AppProviders></body>
    </html>
  )
}
