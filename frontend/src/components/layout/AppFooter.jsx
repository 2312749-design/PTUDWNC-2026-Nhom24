'use client'

import NextLink from 'next/link'

/** Footer dùng chung cho toàn bộ website. */
export default function AppFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__main">
        <section className="site-footer__brand" aria-label="Giới thiệu Culinary Blog">
          <NextLink className="site-footer__logo" href="/" aria-label="Culinary Blog - Trang chủ">
            <span className="site-footer__logo-mark">C</span>
            <span>Culinary<span>Blog</span></span>
          </NextLink>
          <p>Nơi lưu giữ công thức, chia sẻ câu chuyện và tìm cảm hứng cho những bữa ăn mỗi ngày.</p>
          <NextLink className="site-footer__write-link" href="/recipes/new">Chia sẻ công thức <span aria-hidden="true">→</span></NextLink>
        </section>

        <nav className="site-footer__links" aria-label="Khám phá">
          <h2>Khám phá</h2>
          <NextLink href="/community">Cộng đồng</NextLink>
          <NextLink href="/recipes">Công thức món ăn</NextLink>
          <NextLink href="/categories">Danh mục món ăn</NextLink>
          <NextLink href="/challenges">Thử thách nấu ăn</NextLink>
        </nav>

        <section className="site-footer__social">
          <h2>Kết nối với chúng tôi</h2>
          <p>Theo dõi Culinary Blog để cập nhật món ngon và hoạt động mới.</p>
          <div className="site-footer__social-list">
            <a href="https://www.facebook.com/dducthanh.1" target="_blank" rel="noreferrer" aria-label="Facebook Culinary Blog"><span aria-hidden="true">f</span> Facebook</a>
            <a href="https://www.instagram.com/joxpiz_/" target="_blank" rel="noreferrer" aria-label="Instagram Culinary Blog"><span aria-hidden="true">◎</span> Instagram</a>
            <a href="https://www.tiktok.com/@linhcutevcl1909" target="_blank" rel="noreferrer" aria-label="TikTok Culinary Blog"><span aria-hidden="true">♪</span> TikTok</a>
          </div>
        </section>
      </div>
      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} Culinary Blog. Được làm bằng niềm yêu thích nấu ăn.</span>
        <NextLink href="/safety">An toàn cộng đồng</NextLink>
      </div>
    </footer>
  )
}
