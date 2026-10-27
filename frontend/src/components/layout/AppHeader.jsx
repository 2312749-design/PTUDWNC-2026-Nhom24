'use client'

import NextLink from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocale } from '../../locale-context'
import { apiRequest, clearSession, getAccessToken, getSessionUser } from '../../api/session.js'
import { getApiBaseUrl } from '../../api/config.js'
import { useAuthStore } from '../../store/auth-store'
import Avatar from '../common/Avatar'
import SiteMusicPlayer from './SiteMusicPlayer'
import CosmicControls from '../cosmic/CosmicControls'
import CosmicCommandPalette from '../cosmic/CosmicCommandPalette'

const NAVIGATION_GROUPS = [
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
  const [commandOpen, setCommandOpen] = useState(false)
  const [commandQuery, setCommandQuery] = useState('')
  const navigationRef = useRef(null)
  const sessionUser = useAuthStore((state) => state.user)
  const setSessionUser = useAuthStore((state) => state.setUser)

  useEffect(() => {
    let active = true

    const loadAccount = async () => {
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
          apiRequest('/features/notifications'),
        ])
        if (!active) return
        setMe(user)
        setSessionUser(user)
        setUnreadCount(Number(notifications?.unreadCount) || 0)
      } catch {
        if (active) {
          setMe(null)
          setUnreadCount(0)
        }
      }
    }

    loadAccount()
    window.addEventListener('auth-session-refreshed', loadAccount)
    return () => {
      active = false
      window.removeEventListener('auth-session-refreshed', loadAccount)
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
  useEffect(() => {
    const openCommand = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandOpen(true)
        window.dispatchEvent(new CustomEvent('culinary:sfx', { detail: { kind: 'power' } }))
      }
      if (event.key === 'Escape') setCommandOpen(false)
    }
    document.addEventListener('keydown', openCommand)
    return () => document.removeEventListener('keydown', openCommand)
  }, [])

  useEffect(() => {
    const header = navigationRef.current?.closest('header')
    if (!header || typeof ResizeObserver === 'undefined') return
    const measure = () => document.documentElement.style.setProperty('--cosmic-header-height', `${Math.round(header.getBoundingClientRect().height)}px`)
    const observer = new ResizeObserver(measure)
    observer.observe(header)
    measure()
    return () => observer.disconnect()
  }, [])


  useEffect(() => { setOpenGroup(null) }, [pathname])

  const currentUser = me || sessionUser
  const username = currentUser?.username || currentUser?.userName
  const profileHref = useMemo(
    () => username ? `/members/${encodeURIComponent(username)}` : '/account',
    [username],
  )
  const isActive = (path) => pathname === path || (path !== '/community' && pathname.startsWith(`${path}/`))
  const hangfireUrl = getApiBaseUrl().replace(/\/api\/?$/, '') + '/hangfire'
  const canManageContent = ['Author', 'Admin'].includes(currentUser?.role)
  const commandOptions = useMemo(() => NAVIGATION_GROUPS.flatMap(group => group.links).concat([['/pro', 'Trung tâm Pro'], ['/home', 'Trang chủ'], ['/community', 'Bảng tin']]), [])


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
    router.push('/community')
    window.location.reload()
  }

  return (
    <header className="community-nav">
      <NextLink href="/" className="community-wordmark" aria-label="Bếp Nhà - Trang chủ">
        <span className="wordmark-mark">B</span>
        <span>Bếp Nhà<small>{t('CỘNG ĐỒNG ẨM THỰC')}</small></span>
      </NextLink>
      <nav ref={navigationRef} aria-label={t('Điều hướng chính')}>
        <NextLink href="/community" className={`community-nav-home${isActive('/community') ? ' active' : ''}`} aria-current={isActive('/community') ? 'page' : undefined}>{t('Bảng tin')}</NextLink>
        <NextLink href="/home" className={`community-nav-home${isActive('/home') ? ' active' : ''}`} aria-current={isActive('/home') ? 'page' : undefined}>{t('Trang chủ')}</NextLink>
        <button type="button" className="cosmic-command-trigger" onClick={() => setCommandOpen(true)} data-cosmic-sfx="power" aria-haspopup="dialog"><span aria-hidden="true">⌕</span><span>Tìm món, nguyên liệu…</span><kbd>Ctrl K</kbd></button>
        {NAVIGATION_GROUPS.map((group) => {
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
      <CosmicControls />
      <div className="community-nav-account">
        <SiteMusicPlayer />
        {currentUser ? <>
          {currentUser.role === 'Admin' && <><NextLink href="/admin">Quản trị</NextLink><a href={hangfireUrl}>Hangfire</a></>}
          {canManageContent && <NextLink href="/recipes">Quản lý nội dung</NextLink>}
          <NextLink href={profileHref} className="nav-profile"><Avatar user={currentUser} size="small" /><span>{currentUser.fullName || currentUser.displayName || username}</span>{unreadCount > 0 && <small aria-label={`${unreadCount} thông báo chưa đọc`}>({unreadCount})</small>}</NextLink>
          <button type="button" onClick={logout}>{t('Đăng xuất')}</button>
        </> : <>
          <NextLink href="/login" className="nav-login">{t('Đăng nhập')}</NextLink>
          <NextLink href="/register" className="nav-join">{t('Tạo tài khoản')}</NextLink>
        </>}
      </div>
      <CosmicCommandPalette open={commandOpen} onOpenChange={setCommandOpen} query={commandQuery} onQueryChange={setCommandQuery} navigation={commandOptions} />

    </header>
  )
}
