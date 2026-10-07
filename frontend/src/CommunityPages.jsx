import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useLocale } from './LocaleContext.jsx'
import './CommunityPages.css'

const API = 'http://localhost:5152/api'
const EDITORIAL_STARTERS = [
  {
    id: 'starter-vietnamese-table',
    slug: 'mam-com-viet-giu-vi-quen-them-chut-moi',
    title: 'Mâm cơm Việt: giữ vị quen, thêm một chút mới',
    summary: 'Một mâm cơm ngon không cần cầu kỳ. Chỉ cần món chính vừa miệng, rau theo mùa và một chén nước chấm hợp vị.',
    coverImageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=85',
    createdAt: '2026-09-27T08:00:00Z',
    author: { fullName: 'Ban biên tập Bếp Nhà', userName: 'bepnha' },
    content: `Có những bữa ăn khiến mình nhớ nhà chỉ bằng mùi hành phi và nồi canh còn nóng. Mâm cơm Việt thường bắt đầu từ những điều rất giản dị: một món mặn, một món rau, một món canh và chén nước chấm đặt giữa bàn.\n\nĐể bữa cơm quen không trở nên đơn điệu, hãy chọn nguyên liệu theo mùa rồi thay đổi cách nêm hoặc cách trình bày. Cá kho có thể ăn cùng rau luộc giòn; món xào nhiều màu sắc sẽ cân bằng một món kho đậm vị. Không cần thêm thật nhiều món, chỉ cần mỗi món có một vai trò rõ ràng.\n\nMột mẹo nhỏ là chuẩn bị phần sơ chế trước: rửa rau, ướp nguyên liệu và pha sẵn nước chấm. Khi đến giờ ăn, bạn chỉ cần nấu lần lượt những món cần dùng nóng. Cách làm này giúp bữa cơm tươm tất mà căn bếp vẫn nhẹ nhàng.\n\nCuối cùng, hãy nấu theo khẩu vị của người ngồi cùng bàn. Công thức là điểm khởi đầu; những điều chỉnh nhỏ của gia đình mới làm nên hương vị riêng của căn bếp nhà mình.`,
  },
  {
    id: 'starter-food-photography',
    slug: 'anh-mon-an-dep-bat-dau-tu-anh-sang-cua-so',
    title: 'Ảnh món ăn đẹp bắt đầu từ ánh sáng bên cửa sổ',
    summary: 'Không cần studio hay thiết bị đắt tiền. Một góc bàn sáng, phông nền gọn và món ăn vừa nấu xong đã đủ để kể câu chuyện hấp dẫn.',
    coverImageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1400&q=85',
    createdAt: '2026-09-25T08:00:00Z',
    author: { fullName: 'Ban biên tập Bếp Nhà', userName: 'bepnha' },
    content: `Ánh sáng tự nhiên là người bạn dễ dùng nhất khi chụp món ăn tại nhà. Hãy đặt đĩa thức ăn gần cửa sổ, để ánh sáng chiếu từ bên cạnh hoặc hơi chếch phía sau. Ánh sáng xiên giúp bề mặt món ăn có chiều sâu và làm nổi bật kết cấu.\n\nTrước khi chụp, dọn bớt những vật không liên quan khỏi khung hình. Một chiếc khăn vải, đôi đũa hoặc nguyên liệu chính có thể làm đạo cụ; hãy để chúng hỗ trợ món ăn thay vì cạnh tranh sự chú ý.\n\nChụp thử từ trên xuống cho món có nhiều thành phần, hoặc hạ máy thấp ngang mặt bàn để nhấn vào lớp sốt và độ cao của món. Chạm lấy nét vào phần hấp dẫn nhất, sau đó giảm nhẹ độ sáng nếu vùng trắng bị mất chi tiết.\n\nĐiều quan trọng nhất vẫn là sự chân thật. Một bức ảnh không cần hoàn hảo; nó chỉ cần khiến người xem hình dung được hương vị và muốn thử nấu món đó.`,
  },
  {
    id: 'starter-weeknight-cooking',
    slug: 'bua-toi-30-phut-chuan-bi-thong-minh-hon',
    title: 'Bữa tối 30 phút: chuẩn bị thông minh hơn, không nấu vội',
    summary: 'Lên thứ tự thao tác, tận dụng thời gian chờ và chọn nguyên liệu phù hợp để bữa tối ngày thường vẫn ngon lành.',
    coverImageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=85',
    createdAt: '2026-09-22T08:00:00Z',
    author: { fullName: 'Ban biên tập Bếp Nhà', userName: 'bepnha' },
    content: `Bữa tối nhanh không có nghĩa là phải làm mọi thứ cùng lúc. Trước tiên, chọn một món chính có thời gian nấu chủ động, chẳng hạn cá áp chảo, đậu phụ sốt hoặc mì xào. Ghép món đó với rau trộn hay canh đơn giản để không phải dùng quá nhiều nồi chảo.\n\nTrong lúc cơm hoặc nước sôi, bạn có thể rửa rau, cắt nguyên liệu và chuẩn bị gia vị. Sắp các nguyên liệu theo thứ tự cho vào chảo sẽ giúp thao tác liền mạch hơn. Nếu dùng thịt hoặc cá, hãy cắt thành phần vừa ăn để chín đều và nhanh.\n\nMột vài nguyên liệu dự trữ tốt như trứng, đậu phụ, rau củ đông lạnh và mì khô giúp bạn linh hoạt khi chưa kịp đi chợ. Hãy xem công thức như khung gợi ý, rồi thay bằng nguyên liệu đang có trong tủ lạnh.\n\nSau vài lần, bạn sẽ biết món nào hợp với nhịp sinh hoạt của gia đình. Ghi lại những kết hợp mình thích để lần sau việc chọn món cũng nhanh như lúc nấu.`,
  },
]

const token = () => {
  const value = localStorage.getItem('accessToken') || ''
  if (!value) return ''
  try {
    const payload = JSON.parse(atob(value.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    if (!payload.exp || payload.exp * 1000 <= Date.now()) throw new Error('Token expired')
    return value
  } catch {
    localStorage.removeItem('accessToken')
    return ''
  }
}
const authHeaders = (json = false) => ({
  ...(json ? { 'Content-Type': 'application/json' } : {}),
  ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
})

let refreshRequest

async function refreshAccessToken() {
  if (!refreshRequest) {
    refreshRequest = fetch(`${API}/Auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: localStorage.getItem('refreshToken') || '' }),
    }).then(async response => {
      const data = await response.json()
      if (!response.ok || !data.accessToken || !data.refreshToken) throw new Error('Phiên đăng nhập đã hết hạn.')
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      return data.accessToken
    }).catch(error => {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      throw error
    }).finally(() => { refreshRequest = null })
  }
  return refreshRequest
}

async function apiRequest(path, options = {}) {
  const sendRequest = () => fetch(`${API}${path}`, { ...options, headers: { ...authHeaders(Boolean(options.body)), ...options.headers } })
  let response = await sendRequest()
  if (response.status === 401 && localStorage.getItem('refreshToken')) {
    try {
      await refreshAccessToken()
      response = await sendRequest()
    } catch {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
    }
  }
  const text = await response.text()
  const data = text ? JSON.parse(text) : {}
  if (!response.ok) throw new Error(data.message || 'Không thể hoàn thành yêu cầu.')
  return data
}

function Avatar({ user, size = 'normal' }) {
  const initials = (user?.fullName || user?.username || '?').slice(0, 1).toUpperCase()
  return user?.avatarUrl
    ? <img className={`community-avatar ${size}`} src={user.avatarUrl} alt={user.fullName || user.username} />
    : <span className={`community-avatar avatar-fallback ${size}`}>{initials}</span>
}

export function CommunityNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLocale()
  const [me, setMe] = useState(null)
  const [unreadCount, setUnreadCount] = useState(0)
  useEffect(() => {
    const loadAccount = () => {
      if (!token() && !localStorage.getItem('refreshToken')) return
      Promise.all([apiRequest('/account/me'), apiRequest('/features/notifications')]).then(([user, notifications]) => {
      setMe(user)
      setUnreadCount(notifications.unreadCount)
      }).catch(() => setMe(null))
    }
    loadAccount()
    window.addEventListener('auth-session-refreshed', loadAccount)
    return () => window.removeEventListener('auth-session-refreshed', loadAccount)
  }, [])
  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    try {
      if (refreshToken) {
        await fetch(`${API}/Auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
          body: JSON.stringify({ refreshToken }),
        })
      }
    } catch {
      // The local session is always cleared; the backend may be unavailable.
    }
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    navigate('/community')
    window.location.reload()
  }

  const navigationGroups = [
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
        ['/taste-suggestion', 'Khẩu vị'], ['/ai-chat', 'AI Chat'], ['/standard-recipe', 'Chuẩn quốc tế'],
        ['/editor-picks', 'Biên tập'], ['/author-profile', 'Tác giả'], ['/print-export', 'In ấn'],
        ['/multilingual', 'Ngôn ngữ'], ['/saved', 'Công thức đã lưu'],
      ],
    },
    {
      title: 'Tài khoản',
      links: [
        ['/account', 'Cài đặt tài khoản'], ['/notifications', 'Thông báo'], ['/creator', 'Thống kê tác giả'],
        ['/drafts', 'Bản nháp'], ['/safety', 'An toàn cộng đồng'],
      ],
    },
  ]
  const isActive = (path) => location.pathname === path || (path !== '/community' && location.pathname.startsWith(`${path}/`))

  return (
    <header className="community-nav">
      <Link to="/community" className="community-wordmark"><span className="wordmark-mark">B</span><span>Bếp Nhà<small>{t('CỘNG ĐỒNG ẨM THỰC')}</small></span></Link>
      <nav aria-label={t('Điều hướng chính')}>
        <Link to="/community" className={`community-nav-home${isActive('/community') ? ' active' : ''}`} aria-current={isActive('/community') ? 'page' : undefined}>{t('Bảng tin')}</Link>
        {navigationGroups.map((group) => (
          <details className="community-nav-group" key={group.title}>
            <summary>{t(group.title)}<span aria-hidden="true">⌄</span></summary>
            <div className="community-nav-group-links">
              {group.links.map(([path, label]) => (
                <Link key={path} to={path} className={isActive(path) ? 'active' : ''} aria-current={isActive(path) ? 'page' : undefined}>
                  {t(label)}
                </Link>
              ))}
            </div>
          </details>
        ))}
      </nav>
      <div className="community-nav-account">
        {me ? <>
          <Link to={`/members/${encodeURIComponent(me.username)}`} className="nav-profile"><Avatar user={me} size="small" /><span>{me.fullName || me.username}</span></Link>
          <button type="button" onClick={logout}>{t('Đăng xuất')}</button>
        </> : <>
          <Link to="/login" className="nav-login">{t('Đăng nhập')}</Link>
          <Link to="/register" className="nav-join">{t('Tạo tài khoản')}</Link>
        </>}
      </div>
    </header>
  )
}

function CommunityLayout({ children }) {
  return <div className="community-app"><CommunityNav />{children}</div>
}

function PostMedia({ mediaUrl, mediaType }) {
  if (!mediaUrl) return null
  return <div className="post-media">{mediaType === 'video'
    ? <video src={mediaUrl} controls playsInline preload="metadata" />
    : <img src={mediaUrl} alt="Ảnh đính kèm bài viết" loading="lazy" />}</div>
}

function FeedPost({ post, me, onChanged }) {
  const [comment, setComment] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [showComments, setShowComments] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(post.content)
  const [displayContent, setDisplayContent] = useState(post.content)
  const canInteract = Boolean(token())
  const isOwner = me?.username === post.author.username

  const like = async () => {
    if (!canInteract) return toast.info('Đăng nhập để thả tim bài viết.')
    try { await apiRequest(`/community/posts/${post.id}/like`, { method: 'POST' }); onChanged() }
    catch (error) { toast.error(error.message) }
  }

  const submitComment = async (event) => {
    event.preventDefault()
    if (!comment.trim()) return
    try {
      await apiRequest(`/community/posts/${post.id}/comments`, { method: 'POST', body: JSON.stringify({ content: comment, parentCommentId: replyTo }) })
      setComment('')
      setReplyTo(null)
      setShowComments(true)
      onChanged()
    } catch (error) { toast.error(error.message) }
  }

  const deletePost = async () => {
    if (!window.confirm('Xóa bài viết này?')) return
    try { await apiRequest(`/community/posts/${post.id}`, { method: 'DELETE' }); onChanged() }
    catch (error) { toast.error(error.message) }
  }

  const savePost = async (event) => {
    event.preventDefault()
    try {
      const updated = await apiRequest(`/community/posts/${post.id}`, { method: 'PUT', body: JSON.stringify({ content: draft }) })
      setDisplayContent(updated.content)
      setEditing(false)
      onChanged()
    } catch (error) { toast.error(error.message) }
  }

  const toggleComments = async () => {
    try {
      await apiRequest(`/community/posts/${post.id}/comments-enabled`, { method: 'PUT', body: JSON.stringify({ enabled: !post.commentsEnabled }) })
      onChanged()
    } catch (error) { toast.error(error.message) }
  }

  const reportPost = async () => {
    if (!canInteract) return toast.info('Đăng nhập để báo cáo bài viết.')
    const reason = window.prompt('Vì sao bạn muốn báo cáo bài viết này?')
    if (!reason?.trim()) return
    try { const result = await apiRequest(`/community/posts/${post.id}/report`, { method: 'POST', body: JSON.stringify({ reason }) }); toast.success(result.message) }
    catch (error) { toast.error(error.message) }
  }

  const blockAuthor = async () => {
    if (!canInteract) return toast.info('Đăng nhập để chặn thành viên.')
    if (!window.confirm(`Chặn @${post.author.username}? Bài viết của người này sẽ bị ẩn khỏi bảng tin.`)) return
    try { await apiRequest(`/community/users/${encodeURIComponent(post.author.username)}/block`, { method: 'POST' }); toast.success('Đã chặn thành viên.'); onChanged() }
    catch (error) { toast.error(error.message) }
  }

  return (
    <article className="feed-post">
      <div className="post-author-row">
        <Link to={`/members/${encodeURIComponent(post.author.username)}`} className="post-author-link"><Avatar user={post.author} /><span><strong>{post.author.fullName || post.author.username}</strong><small>@{post.author.username} · {new Date(post.createdAt).toLocaleString('vi-VN')}</small></span></Link>
        {isOwner ? <div className="post-owner-actions"><button type="button" onClick={() => { setDraft(displayContent); setEditing(value => !value) }}>{editing ? 'Đóng sửa' : 'Sửa'}</button><button type="button" onClick={deletePost}>Xóa</button><button type="button" onClick={toggleComments}>{post.commentsEnabled ? 'Tắt bình luận' : 'Bật bình luận'}</button></div> : <div className="post-owner-actions"><button type="button" onClick={reportPost}>Báo cáo</button><button type="button" onClick={blockAuthor}>Chặn</button></div>}
      </div>
      {editing ? <form className="post-edit-form" onSubmit={savePost}><textarea value={draft} onChange={event => setDraft(event.target.value)} maxLength={3000} required /><div><span>{draft.length}/3000</span><button type="submit" disabled={!draft.trim()}>Lưu sửa đổi</button></div></form> : <p className="post-copy">{displayContent}</p>}
      <PostMedia mediaUrl={post.mediaUrl} mediaType={post.mediaType} />
      <div className="post-actions">
        <button type="button" className={post.likedByMe ? 'is-liked' : ''} onClick={like}><span aria-hidden="true">♥</span> {post.likesCount || 0}</button>
        <button type="button" disabled={!post.commentsEnabled} onClick={() => setShowComments((value) => !value)}>Bình luận <span>{post.comments?.length || 0}</span></button>
      </div>
      {!post.commentsEnabled && <p className="comments-closed">Tác giả đã tắt bình luận.</p>}
      {showComments && <div className="post-comments">
        {(post.comments || []).map(item => <div key={item.id} className={`comment-line ${item.parentCommentId ? 'comment-reply' : ''}`}><Avatar user={item.author} size="tiny" /><p><strong>{item.author.fullName || item.author.username}</strong> {item.content}{canInteract && <button type="button" className="reply-comment-button" onClick={() => setReplyTo(item.id)}>Trả lời</button>}</p></div>)}
        {canInteract ? <form onSubmit={submitComment} className="comment-form"><input value={comment} onChange={event => setComment(event.target.value)} placeholder={replyTo ? 'Trả lời bình luận...' : 'Viết bình luận...'} maxLength={1000} /><button type="submit">Gửi</button></form> : <p className="comment-signin"><Link to="/login">Đăng nhập</Link> để tham gia trò chuyện.</p>}
      </div>}
    </article>
  )
}

export function FeedPage() {
  const { t } = useLocale()
  const [posts, setPosts] = useState([])
  const [me, setMe] = useState(null)
  const [articles, setArticles] = useState(EDITORIAL_STARTERS)
  const [articleFormOpen, setArticleFormOpen] = useState(false)
  const [savingArticle, setSavingArticle] = useState(false)
  const [articleDraft, setArticleDraft] = useState({ title: '', summary: '', content: '', coverImageUrl: '' })
  const [content, setContent] = useState('')
  const [media, setMedia] = useState(null)
  const [uploadingMedia, setUploadingMedia] = useState(false)
  const [isDraft, setIsDraft] = useState(false)
  const [scope, setScope] = useState('discover')
  const [sort, setSort] = useState('recent')
  const [reloadKey, setReloadKey] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const refresh = () => setReloadKey(value => value + 1)

  useEffect(() => {
    let active = true
    apiRequest(`/community/feed?scope=${scope}&sort=${sort}`).then(data => { if (active) setPosts(data) }).catch(error => toast.error(error.message)).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [scope, sort, reloadKey])

  useEffect(() => {
    if (token()) apiRequest('/account/me').then(setMe).catch(() => {})
  }, [])

  useEffect(() => {
    let active = true
    apiRequest('/articles?take=10')
      .then(data => { if (active) setArticles([...data, ...EDITORIAL_STARTERS].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))) })
      .catch(() => { if (active) setArticles(EDITORIAL_STARTERS) })
    return () => { active = false }
  }, [])

  const changeScope = value => {
    if (value === 'following' && !token()) return toast.info('Đăng nhập để xem bảng tin đang theo dõi.')
    setLoading(true)
    setScope(value)
  }

  const publish = async (event) => {
    event.preventDefault()
    if ((!content.trim() && !media) || saving || uploadingMedia) return
    setSaving(true)
    try {
      await apiRequest('/community/posts', { method: 'POST', body: JSON.stringify({ content, isDraft, mediaUrl: media?.mediaUrl || null, mediaType: media?.mediaType || null }) })
      setContent('')
      setMedia(null)
      setIsDraft(false)
      if (!isDraft) refresh()
      toast.success(isDraft ? 'Đã lưu vào bản nháp.' : 'Bài viết đã lên bảng tin.')
    } catch (error) { toast.error(error.message) }
    finally { setSaving(false) }
  }

  const uploadMedia = async event => {
    const file = event.target.files?.[0]
    if (!file) return
    const isVideo = file.type.startsWith('video/')
    const maxSize = isVideo ? 50 * 1024 * 1024 : 8 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error(isVideo ? 'Video tối đa 50 MB.' : 'Ảnh tối đa 8 MB.')
      event.target.value = ''
      return
    }
    const formData = new FormData()
    formData.append('file', file)
    setUploadingMedia(true)
    try {
      const response = await fetch(`${API}/community/upload-media`, { method: 'POST', headers: authHeaders(), body: formData })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Tải tệp lên thất bại.')
      setMedia(data)
      toast.success(isVideo ? 'Video đã sẵn sàng.' : 'Ảnh đã sẵn sàng.')
    } catch (error) { toast.error(error.message) }
    finally { setUploadingMedia(false); event.target.value = '' }
  }

  const publishArticle = async event => {
    event.preventDefault()
    if (savingArticle) return
    setSavingArticle(true)
    try {
      const article = await apiRequest('/articles', { method: 'POST', body: JSON.stringify(articleDraft) })
      setArticles(current => [article, ...current])
      setArticleDraft({ title: '', summary: '', content: '', coverImageUrl: '' })
      setArticleFormOpen(false)
      toast.success('Bài báo đã được đăng.')
    } catch (error) { toast.error(error.message) }
    finally { setSavingArticle(false) }
  }

  return <CommunityLayout>
    <main className="community-main feed-layout">
      <section className="feed-hero" aria-label="Bài viết tiêu điểm">
        <img src={EDITORIAL_STARTERS[0].coverImageUrl} alt="Mâm món ăn nhiều màu sắc trên bàn" />
        <div className="feed-hero-copy">
          <p className="community-kicker">BẾP NHÀ · CHUYỆN MÓN NGON</p>
          <h2>{EDITORIAL_STARTERS[0].title}</h2>
          <p>{EDITORIAL_STARTERS[0].summary}</p>
          <Link to={`/articles/${EDITORIAL_STARTERS[0].slug}`}>Đọc bài viết <span aria-hidden="true">→</span></Link>
        </div>
        <span className="feed-hero-index">01 / GÓC BẾP</span>
      </section>
      <section className="feed-column">
        <div className="feed-heading"><div><p className="community-kicker">{t('BẾP NHÀ · CỘNG ĐỒNG')}</p><h1>{t('Bảng tin')}</h1></div><span className="feed-live"><i /> {t('MỌI NGƯỜI ĐANG CHIA SẺ')}</span></div>
        <div className="feed-control-row"><div className="feed-tabs" role="tablist" aria-label={t('Nguồn bài viết')}><button type="button" className={scope === 'discover' ? 'active' : ''} onClick={() => changeScope('discover')}>{t('Dành cho bạn')}</button><button type="button" className={scope === 'following' ? 'active' : ''} onClick={() => changeScope('following')}>{t('Đang theo dõi')}</button></div><select aria-label={t('Sắp xếp bài viết')} value={sort} onChange={event => { setLoading(true); setSort(event.target.value) }}><option value="recent">{t('Mới nhất')}</option><option value="popular">{t('Nổi bật')}</option></select></div>
        {me ? <form className="composer" onSubmit={publish}><div className="composer-top"><Avatar user={me} /><textarea value={content} onChange={event => setContent(event.target.value)} placeholder={t('Hôm nay bạn vừa nấu món gì? Chia sẻ với mọi người...')} maxLength={3000} /></div>{media && <div className="composer-media"><PostMedia mediaUrl={media.mediaUrl} mediaType={media.mediaType} /><button type="button" onClick={() => setMedia(null)}>{t('Gỡ tệp')}</button></div>}<div className="composer-bottom"><label className="composer-attach">{uploadingMedia ? t('Đang tải...') : t('Ảnh/video')}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm" onChange={uploadMedia} disabled={uploadingMedia || saving} /></label><label className="draft-toggle"><input type="checkbox" checked={isDraft} onChange={event => setIsDraft(event.target.checked)} /> {t('Lưu bản nháp')}</label><span>{content.length}/3000</span><button type="submit" disabled={(!content.trim() && !media) || saving || uploadingMedia}>{saving ? t('Đang lưu...') : isDraft ? t('Lưu nháp') : t('Đăng bài')} <b>↗</b></button></div></form> : <div className="guest-invite"><div><strong>{t('Bếp vui hơn khi có bạn.')}</strong><p>{t('Tạo tài khoản để chia sẻ câu chuyện, lưu kết nối và trò chuyện cùng cộng đồng.')}</p></div><Link to="/register">{t('Tham gia Bếp Nhà')} <span>→</span></Link></div>}
        <div className="feed-list">{loading ? <div className="feed-empty">{t('Đang tải bảng tin...')}</div> : posts.length ? posts.map(post => <FeedPost key={post.id} post={post} me={me} onChanged={refresh} />) : <div className="feed-empty"><span>✳</span><h2>{t('Bảng tin đang chờ câu chuyện đầu tiên')}</h2><p>{t('Hãy chia sẻ món ăn, mẹo bếp hoặc một khoảnh khắc đáng nhớ.')}</p></div>}</div>
      </section>
      <aside className="editorial-column" aria-label="Bài báo và chuyên đề">
        <div className="editorial-heading">
          <div><p className="community-kicker">ĐỌC THÊM</p><h2>Chuyện trong bếp</h2></div>
          <button type="button" onClick={() => setArticleFormOpen(open => !open)} aria-expanded={articleFormOpen} aria-controls="article-composer">{articleFormOpen ? 'Đóng' : 'Viết bài'} <span aria-hidden="true">{articleFormOpen ? '×' : '+'}</span></button>
        </div>
        {articleFormOpen && (me ? <form id="article-composer" className="article-composer" onSubmit={publishArticle}>
          <label>Tiêu đề<input value={articleDraft.title} onChange={event => setArticleDraft({ ...articleDraft, title: event.target.value })} minLength={5} maxLength={160} required /></label>
          <label>Mô tả ngắn<textarea value={articleDraft.summary} onChange={event => setArticleDraft({ ...articleDraft, summary: event.target.value })} minLength={20} maxLength={500} rows={3} required /></label>
          <label>Nội dung bài báo<textarea value={articleDraft.content} onChange={event => setArticleDraft({ ...articleDraft, content: event.target.value })} minLength={80} maxLength={20000} rows={8} placeholder="Viết các đoạn cách nhau bằng một dòng trống..." required /></label>
          <label>Ảnh bìa (URL)<input type="url" value={articleDraft.coverImageUrl} onChange={event => setArticleDraft({ ...articleDraft, coverImageUrl: event.target.value })} placeholder="https://..." /></label>
          <button type="submit" disabled={savingArticle}>{savingArticle ? 'Đang đăng...' : 'Đăng bài báo'}</button>
        </form> : <div id="article-composer" className="article-signin"><p>Đăng nhập để chia sẻ bài viết dài của bạn với cộng đồng.</p><Link to="/login">Đăng nhập để viết <span aria-hidden="true">→</span></Link></div>)}
        <div className="editorial-list">
          {articles.map((article, index) => <Link className="editorial-card" key={article.id || article.slug} to={`/articles/${article.slug}`}>
            {article.coverImageUrl && <img src={article.coverImageUrl} alt="" loading="lazy" />}
            <span className="editorial-card-copy"><small>{index === 0 ? 'TIÊU ĐIỂM' : 'CHUYỆN BẾP NHÀ'} · {new Date(article.createdAt).toLocaleDateString('vi-VN')}</small><strong>{article.title}</strong><span>{article.summary}</span></span>
            <span className="editorial-card-arrow" aria-hidden="true">↗</span>
          </Link>)}
        </div>
      </aside>
    </main>
  </CommunityLayout>
}

export function ArticlePage() {
  const { slug } = useParams()
  const starterArticle = EDITORIAL_STARTERS.find(item => item.slug === slug)
  const [article, setArticle] = useState(starterArticle || null)
  const [loadedSlug, setLoadedSlug] = useState(null)

  useEffect(() => {
    let active = true
    if (EDITORIAL_STARTERS.some(item => item.slug === slug)) return () => { active = false }
    apiRequest(`/articles/${encodeURIComponent(slug)}`)
      .then(data => { if (active) setArticle(data) })
      .catch(() => { if (active) setArticle(null) })
      .finally(() => { if (active) setLoadedSlug(slug) })
    return () => { active = false }
  }, [slug])

  const loading = !starterArticle && loadedSlug !== slug
  const visibleArticle = starterArticle || article
  if (loading) return <CommunityLayout><main className="community-main article-page"><p>Đang tải bài viết...</p></main></CommunityLayout>
  if (!visibleArticle) return <CommunityLayout><main className="community-main article-page"><p>Không tìm thấy bài viết.</p><Link to="/community">Quay lại bảng tin</Link></main></CommunityLayout>

  return <CommunityLayout>
    <main className="community-main article-page">
      <Link className="article-back-link" to="/community">← Bảng tin</Link>
      <article className="article-reading">
        {visibleArticle.coverImageUrl && <img className="article-cover" src={visibleArticle.coverImageUrl} alt={visibleArticle.title} />}
        <header className="article-reading-header">
          <p className="community-kicker">BẾP NHÀ · CHUYỆN MÓN NGON</p>
          <h1>{visibleArticle.title}</h1>
          <p className="article-summary">{visibleArticle.summary}</p>
          <div className="article-byline"><span>{visibleArticle.author?.fullName || visibleArticle.author?.userName || 'Cộng đồng Bếp Nhà'}</span><time dateTime={visibleArticle.createdAt}>{new Date(visibleArticle.createdAt).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}</time></div>
        </header>
        <div className="article-body">{visibleArticle.content.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
        <footer className="article-reading-footer"><span>Hết bài · Cảm ơn bạn đã đọc</span><Link to="/community">Khám phá thêm bài viết →</Link></footer>
      </article>
    </main>
  </CommunityLayout>
}

export function MembersPage() {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let active = true
    const parameters = new URLSearchParams({ page: String(page), pageSize: '24' })
    if (query.trim()) parameters.set('q', query.trim())
    const timer = setTimeout(() => apiRequest(`/community/users?${parameters}`).then(data => {
      if (!active) return
      setUsers(current => page === 1 ? data.items : [...current, ...data.items])
      setTotal(data.total)
    }).catch(error => toast.error(error.message)).finally(() => { if (active) setLoading(false) }), 200)
    return () => { active = false; clearTimeout(timer) }
  }, [query, page])

  const toggleFollow = async (user) => {
    if (user.isSelf) return
    if (!token()) return toast.info('Đăng nhập để theo dõi thành viên.')
    try {
      const endpoint = `/community/users/${encodeURIComponent(user.username)}/follow`
      const result = user.isFollowing
        ? (await apiRequest(endpoint, { method: 'DELETE' }), false)
        : (await apiRequest(endpoint, { method: 'POST' })).following
      setUsers(current => current.map(item => item.username === user.username ? { ...item, isFollowing: result } : item))
    }
    catch (error) { toast.error(error.message) }
  }

  return <CommunityLayout><main className="community-main directory-page"><section className="directory-head"><p className="community-kicker">NHỮNG NGƯỜI CÙNG YÊU BẾP</p><h1>Tìm người truyền cảm hứng.</h1><p>Khám phá mọi thành viên Bếp Nhà, tìm theo tên hoặc username và xem những gì họ chia sẻ.</p><label className="member-search"><span>⌕</span><input value={query} onChange={event => { setQuery(event.target.value); setPage(1); setUsers([]); setTotal(0); setLoading(true) }} placeholder="Tìm theo tên hoặc username" autoComplete="off" /></label></section><section className="member-results"><div className="results-heading"><h2>{query.trim() ? `Kết quả cho “${query}”` : 'Tất cả thành viên'}</h2><span>{users.length} / {total}</span></div>{loading && users.length === 0 ? <div className="feed-empty">Đang tải thành viên...</div> : users.length ? <><div className="member-grid">{users.map(user => <article className="member-card" key={user.username}><Link to={`/members/${encodeURIComponent(user.username)}`} className="member-card-person"><Avatar user={user} size="large" /><span><strong>{user.fullName || user.username}</strong><small>@{user.username}</small></span></Link><p>{user.bio || 'Chưa thêm giới thiệu.'}</p><div className="member-card-actions"><Link to={`/members/${encodeURIComponent(user.username)}`}>{user.isSelf ? 'Trang cá nhân' : 'Xem hồ sơ'} <span>↗</span></Link>{!user.isSelf && <button type="button" className={user.isFollowing ? 'followed' : ''} onClick={() => toggleFollow(user)}>{user.isFollowing ? 'Đang theo dõi' : 'Theo dõi +'}</button>}</div></article>)}</div>{users.length < total && <div className="load-more-wrap"><button type="button" className="load-more-button" disabled={loading} onClick={() => { setLoading(true); setPage(current => current + 1) }}>{loading ? 'Đang tải...' : 'Xem thêm thành viên'}</button></div>}</> : <div className="feed-empty">Không tìm thấy thành viên phù hợp.</div>}</section></main></CommunityLayout>
}

function ProfilePost({ post, isOwner, onChanged }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(post.content)
  const [displayContent, setDisplayContent] = useState(post.content)

  const save = async event => {
    event.preventDefault()
    try {
      const updated = await apiRequest(`/community/posts/${post.id}`, { method: 'PUT', body: JSON.stringify({ content: draft }) })
      setDisplayContent(updated.content)
      setEditing(false)
      onChanged()
    } catch (error) { toast.error(error.message) }
  }

  const remove = async () => {
    if (!window.confirm('Xóa bài viết này?')) return
    try { await apiRequest(`/community/posts/${post.id}`, { method: 'DELETE' }); onChanged() }
    catch (error) { toast.error(error.message) }
  }

  return <article className="feed-post profile-post">
    <div className="profile-post-top"><time>{new Date(post.createdAt).toLocaleString('vi-VN')}</time>{isOwner && <div className="post-owner-actions"><button type="button" onClick={() => { setDraft(displayContent); setEditing(value => !value) }}>{editing ? 'Đóng sửa' : 'Sửa'}</button><button type="button" onClick={remove}>Xóa</button></div>}</div>
    {editing ? <form className="post-edit-form" onSubmit={save}><textarea value={draft} onChange={event => setDraft(event.target.value)} maxLength={3000} required /><div><span>{draft.length}/3000</span><button type="submit" disabled={!draft.trim()}>Lưu sửa đổi</button></div></form> : <p className="post-copy">{displayContent}</p>}
    <PostMedia mediaUrl={post.mediaUrl} mediaType={post.mediaType} />
    <span className="profile-like-count">♥ {post.likesCount}</span>
  </article>
}

export function MemberProfilePage() {
  const { username } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [connectionMode, setConnectionMode] = useState('')
  const [connections, setConnections] = useState([])
  const [connectionsLoading, setConnectionsLoading] = useState(false)

  useEffect(() => {
    let active = true
    apiRequest(`/community/profiles/${encodeURIComponent(username)}`).then(result => { if (active) setData(result) }).catch(error => toast.error(error.message)).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [username, refreshKey])

  const showConnections = async mode => {
    setConnectionMode(mode)
    setConnectionsLoading(true)
    try { setConnections(await apiRequest(`/community/profiles/${encodeURIComponent(username)}/${mode}`)) }
    catch (error) { toast.error(error.message) }
    finally { setConnectionsLoading(false) }
  }

  const toggleFollow = async () => {
    if (!token()) return toast.info('Đăng nhập để theo dõi thành viên.')
    try {
      const path = `/community/users/${encodeURIComponent(username)}/follow`
      const following = data.isFollowing
        ? (await apiRequest(path, { method: 'DELETE' }), false)
        : (await apiRequest(path, { method: 'POST' })).following
      setData(current => current && ({ ...current, isFollowing: following, followersCount: current.followersCount + (following ? 1 : -1) }))
    } catch (error) { toast.error(error.message) }
  }

  const reportUser = async () => {
    if (!token()) return toast.info('Đăng nhập để báo cáo thành viên.')
    const reason = window.prompt('Vì sao bạn muốn báo cáo thành viên này?')
    if (!reason?.trim()) return
    try { const result = await apiRequest(`/community/users/${encodeURIComponent(username)}/report`, { method: 'POST', body: JSON.stringify({ reason }) }); toast.success(result.message) }
    catch (error) { toast.error(error.message) }
  }

  const blockUser = async () => {
    if (!token()) return toast.info('Đăng nhập để chặn thành viên.')
    if (!window.confirm(`Chặn @${username}? Bài viết của người này sẽ bị ẩn khỏi bảng tin.`)) return
    try { await apiRequest(`/community/users/${encodeURIComponent(username)}/block`, { method: 'POST' }); toast.success('Đã chặn thành viên.'); navigate('/members') }
    catch (error) { toast.error(error.message) }
  }

  const manageConnection = async user => {
    if (!data?.isOwnProfile) return
    try {
      if (connectionMode === 'following') {
        await apiRequest(`/community/users/${encodeURIComponent(user.username)}/follow`, { method: 'DELETE' })
        setData(current => current && ({ ...current, followingCount: current.followingCount - 1 }))
      } else {
        await apiRequest(`/community/users/${encodeURIComponent(user.username)}/followers`, { method: 'DELETE' })
        setData(current => current && ({ ...current, followersCount: current.followersCount - 1 }))
      }
      setConnections(current => current.filter(item => item.username !== user.username))
    } catch (error) { toast.error(error.message) }
  }

  const followFromConnections = async user => {
    if (!token()) return toast.info('Đăng nhập để theo dõi thành viên.')
    try {
      const path = `/community/users/${encodeURIComponent(user.username)}/follow`
      const following = user.isFollowing
        ? (await apiRequest(path, { method: 'DELETE' }), false)
        : (await apiRequest(path, { method: 'POST' })).following
      setConnections(current => current.map(item => item.username === user.username ? { ...item, isFollowing: following } : item))
    } catch (error) { toast.error(error.message) }
  }

  return <CommunityLayout><main className="community-main profile-page">{loading ? <div className="feed-empty">Đang tải hồ sơ...</div> : data && <>
    <section className="profile-banner">
      <div className="profile-identity"><Avatar user={data.profile} size="profile" /><div><p className="community-kicker">THÀNH VIÊN BẾP NHÀ</p><h1>{data.profile.fullName || data.profile.username}</h1><span>@{data.profile.username}</span></div></div>
      <div className="profile-stats">
        <div><strong>{data.posts.length}</strong><span>BÀI VIẾT</span></div>
        <button type="button" onClick={() => showConnections('followers')}><strong>{data.followersCount}</strong><span>NGƯỜI THEO DÕI</span></button>
        <button type="button" onClick={() => showConnections('following')}><strong>{data.followingCount}</strong><span>ĐANG THEO DÕI</span></button>
      </div>
      {data.isOwnProfile ? <Link className="profile-follow" to="/account">Cài đặt hồ sơ</Link> : token() && <div className="profile-community-actions"><button className={`profile-follow ${data.isFollowing ? 'followed' : ''}`} type="button" onClick={toggleFollow}>{data.isFollowing ? 'Đang theo dõi · Bỏ theo dõi' : 'Theo dõi thành viên +'}</button><button type="button" onClick={reportUser}>Báo cáo</button><button type="button" onClick={blockUser}>Chặn</button></div>}
    </section>
    <p className="profile-bio">{data.profile.bio || 'Thành viên này chưa thêm phần giới thiệu.'}</p>
    {connectionMode && <section className="connections-panel"><header><h2>{connectionMode === 'followers' ? 'Người theo dõi' : 'Đang theo dõi'}</h2><button type="button" onClick={() => setConnectionMode('')}>Đóng</button></header>{connectionsLoading ? <p className="connection-empty">Đang tải danh sách...</p> : connections.length ? <div className="connections-list">{connections.map(user => <article className="connection-row" key={user.username}><Link to={`/members/${encodeURIComponent(user.username)}`}><Avatar user={user} size="small" /><span><strong>{user.fullName || user.username}</strong><small>@{user.username}</small></span></Link>{data.isOwnProfile ? <button type="button" onClick={() => manageConnection(user)}>{connectionMode === 'following' ? 'Hủy theo dõi' : 'Xóa người theo dõi'}</button> : !user.isFollowing && <button type="button" onClick={() => followFromConnections(user)}>Theo dõi +</button>}</article>)}</div> : <p className="connection-empty">Danh sách này hiện chưa có ai.</p>}</section>}
    <div className="profile-posts-heading"><h2>Bài viết</h2><span>{data.posts.length} chia sẻ</span></div>
    {data.posts.length ? data.posts.map(post => <ProfilePost key={post.id} post={post} isOwner={data.isOwnProfile} onChanged={() => setRefreshKey(value => value + 1)} />) : <div className="feed-empty">Chưa có bài viết nào.</div>}
  </>}</main></CommunityLayout>
}

function AccountAvatarEditor({ form, setForm }) {
  const [uploading, setUploading] = useState(false)
  const uploadAvatar = async event => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) return toast.error('Ảnh đại diện phải nhỏ hơn 5 MB.')
    const body = new FormData()
    body.append('file', file)
    setUploading(true)
    try {
      const response = await fetch(`${API}/account/avatar`, { method: 'POST', headers: authHeaders(), body })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Không thể cập nhật ảnh đại diện.')
      setForm(current => ({ ...current, avatarUrl: data.avatarUrl }))
      toast.success(data.message)
    } catch (error) { toast.error(error.message) }
    finally { setUploading(false); event.target.value = '' }
  }
  return <div className="avatar-upload-row"><Avatar user={form} size="large" /><div><label className="avatar-upload-button">{uploading ? 'Đang tải ảnh...' : 'Tải avatar lên'}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={uploadAvatar} disabled={uploading} /></label><small>JPG, PNG, WebP hoặc GIF · tối đa 5 MB</small></div></div>
}

export function AccountPage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({})
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '' })
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    if (!token()) { navigate('/login'); return }
    apiRequest('/account/me').then(user => { setProfile(user); setForm({ ...user, birthDate: user.birthDate ? user.birthDate.slice(0, 10) : '' }) }).catch(error => toast.error(error.message))
  }, [navigate])
  const updateField = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }))
  const saveProfile = async event => {
    event.preventDefault(); setSaving(true)
    try { const updated = await apiRequest('/account/profile', { method: 'PUT', body: JSON.stringify({ ...form, birthDate: form.birthDate || null }) }); setProfile(updated); setForm({ ...updated, birthDate: updated.birthDate ? updated.birthDate.slice(0, 10) : '' }); toast.success('Hồ sơ đã được cập nhật.') }
    catch (error) { toast.error(error.message) } finally { setSaving(false) }
  }
  const changePassword = async event => {
    event.preventDefault()
    try { const result = await apiRequest('/account/password', { method: 'PUT', body: JSON.stringify(password) }); toast.success(result.message); setPassword({ currentPassword: '', newPassword: '' }) }
    catch (error) { toast.error(error.message) }
  }
  return <CommunityLayout><main className="community-main account-page"><header className="account-heading"><p className="community-kicker">TÀI KHOẢN CỦA BẠN</p><h1>Cài đặt hồ sơ</h1><p>Quản lý cách mọi người nhìn thấy bạn trong cộng đồng.</p></header>{profile && <div className="account-grid"><section className="account-section"><div className="account-section-head"><div><span className="section-index">01</span><h2>Thông tin cá nhân</h2></div></div><AccountAvatarEditor form={form} setForm={setForm} /><form onSubmit={saveProfile} className="account-form"><label>Họ và tên<input name="fullName" value={form.fullName || ''} onChange={updateField} required maxLength={120} /></label><label>Username<input name="username" value={form.username || ''} onChange={updateField} required maxLength={40} /></label><label>Email<input name="email" type="email" value={form.email || ''} onChange={updateField} required /></label><label>Số điện thoại<input name="phoneNumber" type="tel" value={form.phoneNumber || ''} onChange={updateField} /></label><label>Ngày sinh<input name="birthDate" type="date" value={form.birthDate || ''} onChange={updateField} /></label><label className="full-field">Hoặc dán đường dẫn avatar<input name="avatarUrl" type="url" value={form.avatarUrl || ''} onChange={updateField} placeholder="https://..." /></label><label className="full-field">Giới thiệu<textarea name="bio" value={form.bio || ''} onChange={updateField} rows="3" maxLength={500} placeholder="Một chút về bạn và căn bếp của bạn..." /></label><div className="account-form-actions"><button type="submit" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu hồ sơ'} <span>↗</span></button></div></form></section><section className="account-section password-section"><div className="account-section-head"><div><span className="section-index">02</span><h2>Bảo mật</h2></div><span className="security-mark">✳</span></div><p className="security-copy">Dùng mật khẩu dài và riêng biệt để giữ tài khoản an toàn.</p><form onSubmit={changePassword} className="account-form"><label>Mật khẩu hiện tại<input type="password" value={password.currentPassword} onChange={event => setPassword(current => ({ ...current, currentPassword: event.target.value }))} required /></label><label>Mật khẩu mới<input type="password" minLength="8" value={password.newPassword} onChange={event => setPassword(current => ({ ...current, newPassword: event.target.value }))} required /><small>Ít nhất 8 ký tự.</small></label><div className="account-form-actions"><button type="submit">Đổi mật khẩu <span>↗</span></button></div></form></section></div>}</main></CommunityLayout>
}