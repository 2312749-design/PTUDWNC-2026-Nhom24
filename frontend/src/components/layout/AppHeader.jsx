'use client'

import NextLink from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocale } from '../../locale-context'
import { apiRequest, clearSession, getAccessToken, getSessionUser } from '../../api/session.js'
import { getApiBaseUrl } from '../../api/config.js'
import { useAuthStore } from '../../store/auth-store'
import Avatar from '../common/Avatar'

const CORE_LINKS = [['/recipes', 'Công thức'], ['/categories', 'Danh mục'], ['/search', 'Tìm kiếm']]

const EXTENSION_NAVIGATION = [
  {
    title: 'Nấu ăn',
    links: [
      ['/recipes', 'Công thức'], ['/categories', 'Danh mục'], ['/cook-mode', 'Nấu cùng tôi'],
      ['/fridge', 'Tủ lạnh'], ['/flexible-recipe', 'Khẩu phần'], ['/journal', 'Nhật ký'],
      ['/cookbook', 'Sổ tay'], ['/planner', 'Thực đơn tuần'],
    ],
  },
  {
    title: 'Cộng đồng',
    links: [
      ['/members', 'Thành viên'], ['/qna', 'Hỏi đáp'], ['/cook-together', 'Nấu chung'],
      ['/seasonal-challenge', 'Thử thách'], ['/challenges', 'Thử thách nấu ăn'],
    ],
  },
  {
    title: 'Tiện ích',
    links: [
      ['/studio', 'Studio cộng đồng'],
      ['/taste-suggestion', 'Khẩu vị'], ['/ai-chat', 'AI Chat'], ['/standard-recipe', 'Chuẩn quốc tế'],
      ['/editor-picks', 'Biên tập'], ['/author-profile', 'Tác giả'], ['/print-export', 'In ấn'],
      ['/multilingual', 'Ngôn ngữ'], ['/saved', 'Công thức đã lưu'],
      ['/pro', 'Trung tâm Pro'],
    ],
  },
  {
    title: 'Tài khoản',
    links: [
      ['/account', 'Cài đặt tài khoản'], ['/security', 'Bảo mật tài khoản'], ['/notifications', 'Thông báo'], ['/creator', 'Thống kê tác giả'],
      ['/drafts', 'Bản nháp'], ['/safety', 'An toàn cộng đồng'],
    ],
  },
]

/** Thanh điều hướng duy nhất được dùng bởi AppShell trên mọi route. */
export default function AppHeader() {
  const { t } = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [me, setMe] = useState(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [openGroup, setOpenGroup] = useState(null)
  const extensionsEnabled = process.env.NEXT_PUBLIC_ENABLE_EXTENSIONS === 'true'
  const navigationRef = useRef(null)
  const sessionUser = useAuthStore((state) => state.user)
  const setSessionUser = useAuthStore((state) => state.setUser)

  useEffect(() => {
    let active = true
    let accountRequest = 0

    const loadAccount = async () => {
      const request = ++accountRequest
      if (!getAccessToken() && !getSessionUser()) {
        if (active) {
          setMe(null)
          setUnreadCount(0)
        }
        return
      }

      try {
        const [user, notifications] = await Promise.all([
          apiRequest('/account/me'),
          // Notification availability must not hide an authenticated profile.
          apiRequest('/features/notifications').catch(() => null),
        ])
        if (!active || request !== accountRequest) return
        setMe(user)
        setSessionUser(user)
        setUnreadCount(Number(notifications?.unreadCount) || 0)
      } catch (error) {
        if (active && request === accountRequest && error.status === 401) {
          setMe(null)
          setUnreadCount(0)
        }
      }
    }

    loadAccount()
    window.addEventListener('auth-session-refreshed', loadAccount)
    window.addEventListener('auth-session-cleared', loadAccount)
    return () => {
      active = false
      window.removeEventListener('auth-session-refreshed', loadAccount)
      window.removeEventListener('auth-session-cleared', loadAccount)
    }
  }, [setSessionUser])

  useEffect(() => {
    const closeMenu = (event) => {
      if (!navigationRef.current?.contains(event.target)) setOpenGroup(null)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpenGroup(null)
    }
    document.addEventListener('pointerdown', closeMenu)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeMenu)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])
  useEffect(() => { setOpenGroup(null) }, [pathname])

  const currentUser = me || sessionUser
  const profileHref = '/profile'
  const isActive = (path) => pathname === path || (path !== '/community' && pathname.startsWith(`${path}/`))
  const hangfireUrl = getApiBaseUrl().replace(/\/api\/?$/, '') + '/hangfire'
  const canManageContent = Boolean(currentUser)
  const navigationGroups = useMemo(() => extensionsEnabled ? EXTENSION_NAVIGATION : [], [extensionsEnabled])


  const logout = async () => {
    try {
      if (getAccessToken() || getSessionUser()) {
        await apiRequest('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({}),
        })
      }
    } catch {
      // Always remove the browser session, even when the API is unavailable.
    }
    clearSession()
    setMe(null)
    setUnreadCount(0)
    router.replace('/')
  }

  return (
    <header className="community-nav">
      <NextLink href="/" className="community-wordmark">
        <span className="wordmark-mark">B</span>
        <span>Bếp Nhà<small>{t('BLOG CÔNG THỨC ẨM THỰC')}</small></span>
      </NextLink>
      <nav ref={navigationRef} aria-label={t('Điều hướng chính')}>
        <NextLink href="/" className={`community-nav-home${pathname === '/' ? ' active' : ''}`} aria-current={pathname === '/' ? 'page' : undefined}>{t('Trang chủ')}</NextLink>
        {CORE_LINKS.map(([path, label]) => <NextLink key={path} href={path} className={isActive(path) ? 'active' : ''} aria-current={isActive(path) ? 'page' : undefined}>{t(label)}</NextLink>)}
        {navigationGroups.map((group) => {
          const links = group.title === 'Tài khoản' && currentUser
            ? [...group.links, ['/getting-started', 'Bắt đầu nhanh']]
            : group.links
          return <details className="community-nav-group" key={group.title} open={openGroup === group.title} onToggle={(event) => setOpenGroup(event.currentTarget.open ? group.title : null)}>
            <summary>{t(group.title)}<span aria-hidden="true">⌄</span></summary>
            <div className="community-nav-group-links">
              {links.map(([path, label]) => (
                <NextLink key={path} href={path} onClick={() => setOpenGroup(null)} className={isActive(path) ? 'active' : ''} aria-current={isActive(path) ? 'page' : undefined}>{t(label)}</NextLink>
              ))}
            </div>
          </details>
        })}
      </nav>
      <div className="community-nav-account">
        {currentUser ? <>
          {currentUser.role === 'Admin' && <><NextLink href="/admin">Quản trị</NextLink><NextLink href="/dashboard/categories">QL danh mục</NextLink>{extensionsEnabled && <a href={hangfireUrl}>Hangfire</a>}</>}
          {canManageContent && <NextLink href="/dashboard">Góc tác giả</NextLink>}
          <NextLink href={profileHref} className="nav-profile"><Avatar user={currentUser} size="small" /><span>{currentUser.fullName || currentUser.displayName || currentUser.username || currentUser.email}</span>{unreadCount > 0 && <small aria-label={`${unreadCount} thông báo chưa đọc`}>({unreadCount})</small>}</NextLink>
          <button type="button" onClick={logout}>{t('Đăng xuất')}</button>
        </> : <>
          <NextLink href="/auth/login" className="nav-login">{t('Đăng nhập')}</NextLink>
          <NextLink href="/auth/register" className="nav-join">{t('Tạo tài khoản')}</NextLink>
        </>}
      </div>
    </header>
  )
}
