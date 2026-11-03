'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { apiRequest } from '../../src/api/session'
import Pagination from '../../src/components/common/Pagination'
import LoadingState from '../../src/components/common/LoadingState'
import ErrorState from '../../src/components/common/ErrorState'
import { Dialog, DialogContent } from '../../src/components/ui/Dialog'
import './admin.css'
import './member-management.css'

const TABS = [
  ['overview', 'Tổng quan'],
  ['recipes', 'Công thức'],
  ['reviews', 'Chờ duyệt'],
  ['categories', 'Danh mục'],
  ['posts', 'Bảng tin'],
  ['articles', 'Chuyện trong bếp'],
  ['users', 'Thành viên'],
  ['reports', 'Báo cáo'],
  ['analytics', 'Thống kê'],
  ['media', 'Kho ảnh'],
  ['system', 'Hệ thống'],
  ['audit', 'Nhật ký'],
]

const recipeStatus = ['Bản nháp', 'Đã xuất bản', 'Lưu trữ']

async function request(path, { method = 'GET', body } = {}) {
  try {
    return await apiRequest(path, {
      method,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (error) {
    if (error?.status === 401) throw new Error('Vui lòng đăng nhập bằng tài khoản quản trị.')
    if (error?.status === 403) throw new Error('Tài khoản này không có quyền quản trị.')
    throw error
  }
}

function ActionButton({ children, onClick, disabled = false, destructive = false }) {
  return <button className={destructive ? 'admin-action danger' : 'admin-action'} type={onClick ? 'button' : 'submit'} disabled={disabled} onClick={onClick}>{children}</button>
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [overview, setOverview] = useState(null)
  const [recipes, setRecipes] = useState({ items: [], totalPages: 1 })
  const [posts, setPosts] = useState({ items: [], totalPages: 1 })
  const [articles, setArticles] = useState({ items: [], totalPages: 1 })
  const [users, setUsers] = useState({ items: [], totalPages: 1 })
  const [reports, setReports] = useState({ items: [], totalPages: 1 })
  const [reviews, setReviews] = useState({ items: [], totalPages: 1 })
  const [categories, setCategories] = useState({ items: [] })
  const [analytics, setAnalytics] = useState(null)
  const [media, setMedia] = useState(null)
  const [systemStatus, setSystemStatus] = useState(null)
  const [auditLogs, setAuditLogs] = useState({ items: [], totalPages: 1 })
  const [recipeQuery, setRecipeQuery] = useState('')
  const [recipeStatusFilter, setRecipeStatusFilter] = useState('all')
  const [recipeSort, setRecipeSort] = useState('newest')
  const [selectedRecipeIds, setSelectedRecipeIds] = useState([])
  const [pendingAction, setPendingAction] = useState(null)
  const [memberDetail, setMemberDetail] = useState(null)
  const [memberLoading, setMemberLoading] = useState(false)
  const [memberProfile, setMemberProfile] = useState(null)
  const [memberPassword, setMemberPassword] = useState({ temporaryPassword: '', confirmTemporaryPassword: '' })
  const [userFilters, setUserFilters] = useState({ q: '', role: '', suspended: '', twoFactorEnabled: '' })
  const [recipePage, setRecipePage] = useState(1)
  const [postPage, setPostPage] = useState(1)
  const [articlePage, setArticlePage] = useState(1)
  const [userPage, setUserPage] = useState(1)
  const [reportPage, setReportPage] = useState(1)
  const [resolved, setResolved] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    setBusy(true)
    setError('')
    try {
      const requests = await Promise.allSettled([
        request('/admin/overview'),
        request(`/admin/recipes?page=${recipePage}&q=${encodeURIComponent(recipeQuery)}`),
        request(`/admin/posts?page=${postPage}`),
        request(`/admin/articles?page=${articlePage}`),
        request(`/admin/users?page=${userPage}&q=${encodeURIComponent(userFilters.q)}&role=${encodeURIComponent(userFilters.role)}${userFilters.suspended === '' ? '' : `&suspended=${userFilters.suspended}`}${userFilters.twoFactorEnabled === '' ? '' : `&twoFactorEnabled=${userFilters.twoFactorEnabled}`}`),
        request(`/admin/reports?page=${reportPage}&resolved=${resolved}`),
        request('/admin/reviews'),
        request('/admin/categories'),
        request('/admin/analytics?days=30'),
        request('/admin/media/summary'),
        request('/admin/system-status'),
        request('/admin/audit-logs'),
      ])
      const [summaryResult, recipeResult, postResult, articleResult, memberResult, reportResult, reviewResult, categoryResult, analyticsResult, mediaResult, statusResult, auditResult] = requests.map((result) => result.status === 'fulfilled' ? result.value : null)
      // The overview is the entry point and must load successfully. Optional
      // panels fall back to an empty state when a supporting endpoint is down.
      if (!summaryResult) {
        const summaryFailure = requests[0]
        throw (summaryFailure.status === 'rejected' ? summaryFailure.reason : new Error('Không thể tải tổng quan quản trị.'))
      }
      const summary = summaryResult
      setOverview(summary)
      setRecipes(recipeResult || { items: [], totalPages: 1 })
      setPosts(postResult || { items: [], totalPages: 1 })
      setArticles(articleResult || { items: [], totalPages: 1 })
      setUsers(memberResult || { items: [], totalPages: 1 })
      setReports(reportResult || { items: [], totalPages: 1 })
      setReviews(reviewResult || { items: [], totalPages: 1 })
      setCategories(categoryResult || { items: [] })
      setAnalytics(analyticsResult)
      setMedia(mediaResult || { groups: [], storageAvailable: false, totalBytes: 0, recipeImageRecords: 0 })
      setSystemStatus(statusResult)
      setAuditLogs(auditResult || { items: [], totalPages: 1 })
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setBusy(false)
    }
  }, [articlePage, postPage, recipePage, recipeQuery, reportPage, resolved, userPage, userFilters])

  useEffect(() => { load() }, [load])

  const executeAction = async (path, options) => {
    setBusy(true)
    setError('')
    try {
      await request(path, options)
      await load()
    } catch (actionError) {
      setError(actionError.message)
      setBusy(false)
    }
  }
  const act = (path, options, confirmation) => {
    if (confirmation) { setPendingAction({ path, options, confirmation }); return }
    return executeAction(path, options)
  }
  const closeMemberDetail = () => {
    setMemberDetail(null)
    setMemberProfile(null)
    setMemberPassword({ temporaryPassword: '', confirmTemporaryPassword: '' })
  }
  const openMemberDetail = async id => {
    setMemberLoading(true)
    setError('')
    try {
      const detail = await request(`/admin/users/${id}`)
      setMemberDetail(detail)
      setMemberProfile({
        fullName: detail.profile.fullName || '', email: detail.profile.email || '', emailConfirmed: Boolean(detail.profile.emailConfirmed),
        bio: detail.profile.bio || '', avatarUrl: detail.profile.avatarUrl || '', birthDate: detail.profile.birthDate ? String(detail.profile.birthDate).slice(0, 10) : '',
      })
      setMemberPassword({ temporaryPassword: '', confirmTemporaryPassword: '' })
    } catch (detailError) { setError(detailError.message) }
    finally { setMemberLoading(false) }
  }
  const saveMemberProfile = async event => {
    event.preventDefault()
    if (!memberDetail || !memberProfile) return
    setBusy(true); setError('')
    try {
      await request(`/admin/users/${memberDetail.profile.id}/profile`, { method: 'PUT', body: { ...memberProfile, birthDate: memberProfile.birthDate || null } })
      await openMemberDetail(memberDetail.profile.id)
      await load()
    } catch (saveError) { setError(saveError.message) }
    finally { setBusy(false) }
  }
  const confirmMemberPasswordReset = () => {
    if (!memberDetail) return
    setPendingAction({
      confirmation: `Đặt mật khẩu tạm cho ${memberDetail.profile.fullName || memberDetail.profile.userName}? Tất cả phiên đăng nhập hiện có sẽ bị thu hồi.`,
      onConfirm: async () => {
        await request(`/admin/users/${memberDetail.profile.id}/password`, { method: 'PUT', body: memberPassword })
        setMemberPassword({ temporaryPassword: '', confirmTemporaryPassword: '' })
        await openMemberDetail(memberDetail.profile.id)
        await load()
      },
    })
  }
  const toggleRecipe = id => setSelectedRecipeIds(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])
  const bulkRecipeAction = action => {
    if (!selectedRecipeIds.length) return
    const labels = { archive: 'lưu trữ', delete: 'xóa mềm' }
    setPendingAction({ confirmation: `Bạn sắp ${labels[action]} ${selectedRecipeIds.length} công thức đã chọn. Thao tác này được ghi vào nhật ký quản trị.`, bulk: async () => {
      setBusy(true)
      try {
        await Promise.all(selectedRecipeIds.map(id => request(`/admin/recipes/${id}/moderate`, { method: 'POST', body: { action, note: `Thao tác hàng loạt: ${labels[action]}.` } })))
        setSelectedRecipeIds([])
        await load()
      } catch (error) { setError(error.message) }
      finally { setBusy(false) }
    } })
  }

  const visibleRecipes = (recipeStatusFilter === 'all' ? recipes.items : recipes.items.filter(recipe => String(recipe.status) === recipeStatusFilter)).slice().sort((left, right) => {
    if (recipeSort === 'title') return String(left.title).localeCompare(String(right.title), 'vi')
    if (recipeSort === 'status') return Number(left.status) - Number(right.status)
    return 0
  })
  const renderRecipes = () => <section className="admin-panel">
    <div className="admin-section-heading"><div><p className="admin-label">NỘI DUNG CỐT LÕI</p><h2>Kiểm duyệt công thức</h2><p>Admin có thể xem mọi tác giả, đổi trạng thái hoặc xóa mềm công thức.</p></div><Link className="admin-primary-link" href="/recipes/new">Tạo công thức</Link></div>
    <div className="admin-toolbar"><label>Tìm công thức<input value={recipeQuery} onChange={event => { setRecipeQuery(event.target.value); setRecipePage(1) }} placeholder="Tên công thức…" /></label><label>Trạng thái<select value={recipeStatusFilter} onChange={event => setRecipeStatusFilter(event.target.value)}><option value="all">Tất cả</option><option value="0">Bản nháp</option><option value="1">Đã xuất bản</option><option value="2">Lưu trữ</option></select></label><label>Sắp xếp<select value={recipeSort} onChange={event => setRecipeSort(event.target.value)}><option value="newest">Mới nhất</option><option value="title">Tên A–Z</option><option value="status">Trạng thái</option></select></label>{selectedRecipeIds.length > 0 && <div className="admin-bulk-actions"><span>Đã chọn {selectedRecipeIds.length}</span><ActionButton disabled={busy} onClick={() => bulkRecipeAction('archive')}>Lưu trữ đã chọn</ActionButton><ActionButton destructive disabled={busy} onClick={() => bulkRecipeAction('delete')}>Xóa đã chọn</ActionButton></div>}</div>
    {visibleRecipes.length === 0 ? <p className="admin-empty">Không có công thức phù hợp với bộ lọc.</p> : <div className="admin-table"><table><thead><tr><th><input aria-label="Chọn tất cả công thức đang hiện" type="checkbox" checked={visibleRecipes.length > 0 && visibleRecipes.every(recipe => selectedRecipeIds.includes(recipe.id))} onChange={event => setSelectedRecipeIds(event.target.checked ? [...new Set([...selectedRecipeIds, ...visibleRecipes.map(recipe => recipe.id)])] : selectedRecipeIds.filter(id => !visibleRecipes.some(recipe => recipe.id === id)))} /></th><th>Công thức</th><th>Danh mục</th><th>Tác giả</th><th>Xuất bản / duyệt</th><th>Thao tác</th></tr></thead><tbody>{visibleRecipes.map(recipe => <tr key={recipe.id}><td><input aria-label={`Chọn ${recipe.title}`} type="checkbox" checked={selectedRecipeIds.includes(recipe.id)} onChange={() => toggleRecipe(recipe.id)} /></td><td><Link href={`/recipes/${recipe.id}`}>{recipe.title}</Link></td><td>{recipe.categoryName || 'Chưa phân loại'}</td><td>{recipe.authorName || recipe.authorId}</td><td><span className={`admin-status status-${recipe.status}`}>{recipeStatus[recipe.status] || recipe.status}</span><br /><small>{recipe.reviewStatus === 'PendingReview' ? 'Chờ duyệt' : recipe.reviewStatus === 'ChangesRequested' ? 'Cần chỉnh sửa' : recipe.reviewStatus === 'Approved' ? 'Đã duyệt' : 'Chưa gửi duyệt'}</small></td><td className="admin-row-actions">{recipe.status === 0 && <ActionButton disabled={busy} onClick={() => act(`/recipes/${recipe.id}/publish`, { method: 'POST' }, `Xuất bản công thức “${recipe.title}”? Công thức sẽ xuất hiện công khai.`)}>Xuất bản</ActionButton>}{recipe.status === 1 && <><ActionButton disabled={busy} onClick={() => act(`/recipes/${recipe.id}/unpublish`, { method: 'POST' }, `Gỡ công thức “${recipe.title}” khỏi trang công khai?`)}>Gỡ đăng</ActionButton><ActionButton disabled={busy} onClick={() => act(`/admin/recipes/${recipe.id}/moderate`, { method: 'POST', body: { action: 'archive', note: 'Lưu trữ bởi quản trị viên.' } }, `Lưu trữ công thức “${recipe.title}”?`)}>Lưu trữ</ActionButton></>}{recipe.status === 2 && <ActionButton disabled={busy} onClick={() => act(`/admin/recipes/${recipe.id}/moderate`, { method: 'POST', body: { action: 'restore' } }, `Khôi phục công thức “${recipe.title}” về bản nháp?`)}>Khôi phục</ActionButton>}<ActionButton destructive disabled={busy} onClick={() => act(`/admin/recipes/${recipe.id}/moderate`, { method: 'POST', body: { action: 'delete', note: 'Xóa mềm bởi quản trị viên.' } }, `Xóa mềm công thức “${recipe.title}”? Công thức sẽ không còn hiển thị.`)}>Xóa</ActionButton></td></tr>)}</tbody></table></div>}
    <Pagination page={recipePage} totalPages={recipes.totalPages} onPageChange={setRecipePage} disabled={busy} />
  </section>

  const renderPosts = () => <section className="admin-panel">
    <div className="admin-section-heading"><div><p className="admin-label">CỘNG ĐỒNG</p><h2>Kiểm duyệt bảng tin</h2><p>Admin có thể ẩn/hiện nội dung vi phạm, đóng/mở bình luận hoặc xóa hẳn; mọi thao tác đều có nhật ký.</p></div><Link className="admin-primary-link" href="/community">Mở bảng tin</Link></div>
    <div className="admin-table"><table><thead><tr><th>Nội dung</th><th>Tác giả</th><th>Tương tác</th><th>Hiển thị</th><th>Thao tác</th></tr></thead><tbody>{posts.items.map(post => <tr key={post.id}><td className="admin-post-copy">{post.content}</td><td><Link href={`/members/${encodeURIComponent(post.authorUsername || '')}`}>{post.authorName || post.authorUsername}</Link></td><td>{post.likeCount} thích · {post.commentCount} bình luận</td><td>{post.isHidden ? <><span className="admin-status status-2">Đã ẩn</span><br /><small>{post.hiddenReason}</small></> : post.isDraft ? 'Bản nháp' : 'Công khai'}<br /><small>{post.commentsEnabled ? 'Bình luận bật' : 'Bình luận tắt'}</small></td><td className="admin-row-actions"><ActionButton disabled={busy} onClick={() => act(`/admin/posts/${post.id}/moderate`, { method: 'POST', body: { action: post.isHidden ? 'show' : 'hide', note: post.isHidden ? null : 'Ẩn bởi quản trị viên.' } }, post.isHidden ? 'Hiện lại bài đăng này?' : 'Ẩn bài đăng này khỏi bảng tin?')}>{post.isHidden ? 'Hiện lại' : 'Ẩn bài'}</ActionButton><ActionButton disabled={busy} onClick={() => act(`/admin/posts/${post.id}/moderate`, { method: 'POST', body: { action: post.commentsEnabled ? 'lock-comments' : 'unlock-comments' } })}>{post.commentsEnabled ? 'Tắt bình luận' : 'Mở bình luận'}</ActionButton><ActionButton destructive disabled={busy} onClick={() => act(`/admin/posts/${post.id}/moderate`, { method: 'POST', body: { action: 'delete', note: 'Xóa bởi quản trị viên.' } }, 'Xóa vĩnh viễn bài đăng cộng đồng này?')}>Xóa bài</ActionButton></td></tr>)}</tbody></table></div>
    <Pagination page={postPage} totalPages={posts.totalPages} onPageChange={setPostPage} disabled={busy} />
  </section>

  const renderArticles = () => <section className="admin-panel">
    <div className="admin-section-heading"><div><p className="admin-label">BIÊN TẬP</p><h2>Chuyện trong bếp</h2><p>Admin có thể kiểm tra và gỡ mọi bài viết biên tập.</p></div><Link className="admin-primary-link" href="/articles">Xem bài viết</Link></div>
    <div className="admin-table"><table><thead><tr><th>Tiêu đề</th><th>Tóm tắt</th><th>Tác giả</th><th>Ngày tạo</th><th>Thao tác</th></tr></thead><tbody>{articles.items.map(article => <tr key={article.id}><td><Link href={`/articles/${article.slug}`}>{article.title}</Link></td><td className="admin-post-copy">{article.summary}</td><td>{article.authorName || article.authorId}</td><td>{new Date(article.createdAt).toLocaleDateString('vi-VN')}</td><td><ActionButton destructive disabled={busy} onClick={() => act(`/articles/${article.id}`, { method: 'DELETE' }, `Xóa bài viết “${article.title}”?`)}>Gỡ bài</ActionButton></td></tr>)}</tbody></table></div>
    <Pagination page={articlePage} totalPages={articles.totalPages} onPageChange={setArticlePage} disabled={busy} />
  </section>

  const renderUsers = () => <section className="admin-panel">
    <div className="admin-section-heading"><div><p className="admin-label">TÀI KHOẢN</p><h2>Quản lý thành viên và quyền</h2><p>Mở hồ sơ để xem hoạt động, nội dung, phiên đăng nhập; chỉnh thông tin và đặt mật khẩu tạm an toàn.</p></div></div>
    <div className="admin-filter-bar"><input value={userFilters.q} placeholder="Tìm tên, username hoặc email" onChange={event => { setUserFilters(current => ({ ...current, q: event.target.value })); setUserPage(1) }} /><select value={userFilters.role} onChange={event => { setUserFilters(current => ({ ...current, role: event.target.value })); setUserPage(1) }}><option value="">Mọi vai trò</option><option value="User">User</option><option value="Author">Author</option><option value="Admin">Admin</option></select><select value={userFilters.suspended} onChange={event => { setUserFilters(current => ({ ...current, suspended: event.target.value })); setUserPage(1) }}><option value="">Mọi trạng thái</option><option value="false">Đang hoạt động</option><option value="true">Đang khóa</option></select><select value={userFilters.twoFactorEnabled} onChange={event => { setUserFilters(current => ({ ...current, twoFactorEnabled: event.target.value })); setUserPage(1) }}><option value="">2FA: tất cả</option><option value="true">Đã bật 2FA</option><option value="false">Chưa bật 2FA</option></select><button type="button" className="admin-action" onClick={() => { setUserFilters({ q: '', role: '', suspended: '', twoFactorEnabled: '' }); setUserPage(1) }}>Xóa bộ lọc</button></div>
    <div className="admin-table"><table><thead><tr><th>Thành viên</th><th>Email</th><th>Ngày tạo</th><th>Vai trò</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>{users.items.map(user => <tr key={user.id}><td><Link href={`/members/${encodeURIComponent(user.userName || '')}`}>{user.fullName || user.userName}</Link></td><td>{user.email}</td><td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '—'}</td><td><span className="admin-role">{user.role}</span></td><td>{user.isSuspended ? <span className="admin-status status-2">Đang khóa</span> : <span className="admin-status status-1">Đang hoạt động</span>}</td><td className="admin-row-actions"><ActionButton disabled={busy} onClick={() => openMemberDetail(user.id)}>Hồ sơ đầy đủ</ActionButton>{['User', 'Author', 'Admin'].filter(role => role !== user.role).map(role => <ActionButton key={role} disabled={busy} onClick={() => act(`/admin/users/${user.id}/role`, { method: 'PUT', body: { role } }, `Đổi quyền của ${user.fullName || user.userName} thành ${role}?`)}>{role}</ActionButton>)}<ActionButton disabled={busy} onClick={() => user.isSuspended ? act(`/admin/users/${user.id}/suspension`, { method: 'PUT', body: { suspended: false } }, `Mở khóa ${user.fullName || user.userName}?`) : (() => { const reason = window.prompt('Lý do khóa tài khoản:'); if (reason) act(`/admin/users/${user.id}/suspension`, { method: 'PUT', body: { suspended: true, reason } }, `Khóa ${user.fullName || user.userName} và thu hồi phiên?`) })()}>{user.isSuspended ? 'Mở khóa' : 'Khóa'}</ActionButton><ActionButton destructive disabled={busy} onClick={() => act(`/admin/users/${user.id}/sessions/revoke`, { method: 'POST' }, `Thu hồi mọi phiên làm mới của ${user.fullName || user.userName}?`)}>Thu hồi phiên</ActionButton></td></tr>)}</tbody></table></div>
    <Pagination page={userPage} totalPages={users.totalPages} onPageChange={setUserPage} disabled={busy} />
  </section>

  const renderReports = () => <section className="admin-panel">
    <div className="admin-section-heading"><div><p className="admin-label">AN TOÀN CỘNG ĐỒNG</p><h2>Báo cáo nội dung</h2><p>Xem từng báo cáo, xử lý nội dung liên quan tại tab tương ứng, rồi đánh dấu hoàn tất.</p></div><label className="admin-toggle"><input type="checkbox" checked={resolved} onChange={event => { setResolved(event.target.checked); setReportPage(1) }} /> Hiện báo cáo đã xử lý</label></div>
    {reports.items.length === 0 ? <p className="admin-empty">Không có báo cáo trong danh sách này.</p> : <div className="admin-table"><table><thead><tr><th>Đối tượng</th><th>Lý do</th><th>Ngày gửi</th><th>Xử lý</th></tr></thead><tbody>{reports.items.map(report => <tr key={report.id}><td>{report.targetType}<br /><small>{report.targetId}</small></td><td>{report.reason}</td><td>{new Date(report.createdAt).toLocaleDateString('vi-VN')}</td><td className="admin-row-actions">{report.resolvedAt ? <span>Đã xử lý<br /><small>{report.resolutionAction} · {report.resolutionNote}</small></span> : <><ActionButton disabled={busy} onClick={() => act(`/admin/reports/${report.id}/resolve`, { method: 'PUT', body: { action: 'reviewed' } })}>Không vi phạm</ActionButton>{report.targetType === 'post' && <><ActionButton disabled={busy} onClick={() => act(`/admin/reports/${report.id}/resolve`, { method: 'PUT', body: { action: 'hide', note: 'Ẩn sau khi kiểm duyệt báo cáo.' } }, 'Ẩn bài đăng này?')}>Ẩn bài</ActionButton><ActionButton disabled={busy} onClick={() => act(`/admin/reports/${report.id}/resolve`, { method: 'PUT', body: { action: 'lock-comments', note: 'Khóa bình luận sau khi kiểm duyệt.' } })}>Khóa bình luận</ActionButton></>}{report.targetType === 'recipe' && <ActionButton disabled={busy} onClick={() => act(`/admin/reports/${report.id}/resolve`, { method: 'PUT', body: { action: 'hide', note: 'Ẩn công thức sau khi kiểm duyệt báo cáo.' } }, 'Ẩn công thức này?')}>Ẩn công thức</ActionButton>}{report.targetType === 'user' && <ActionButton destructive disabled={busy} onClick={() => { const note = window.prompt('Lý do khóa tài khoản:'); if (note) act(`/admin/reports/${report.id}/resolve`, { method: 'PUT', body: { action: 'suspend', note } }, 'Khóa tài khoản này?') }}>Khóa tài khoản</ActionButton>}</>}</td></tr>)}</tbody></table></div>}
    <Pagination page={reportPage} totalPages={reports.totalPages} onPageChange={setReportPage} disabled={busy} />
  </section>

  const renderReviews = () => <section className="admin-panel">
    <div className="admin-section-heading"><div><p className="admin-label">QUY TRÌNH BIÊN TẬP</p><h2>Hàng chờ duyệt công thức</h2><p>Phản hồi rõ cho tác giả trước khi công thức được xuất bản. Trạng thái xuất bản cũ vẫn được giữ riêng.</p></div></div>
    {reviews.items.length === 0 ? <p className="admin-empty">Không có công thức nào đang chờ duyệt.</p> : <div className="admin-table"><table><thead><tr><th>Công thức</th><th>Tác giả</th><th>Danh mục</th><th>Gửi lúc</th><th>Duyệt</th></tr></thead><tbody>{reviews.items.map(recipe => <tr key={recipe.id}><td><Link href={`/recipes/${recipe.id}`}>{recipe.title}</Link><br /><small>{recipe.description}</small></td><td>{recipe.authorName}</td><td>{recipe.categoryName}</td><td>{recipe.reviewRequestedAt ? new Date(recipe.reviewRequestedAt).toLocaleString('vi-VN') : '—'}</td><td className="admin-row-actions"><ActionButton disabled={busy} onClick={() => act(`/admin/recipes/${recipe.id}/review`, { method: 'POST', body: { decision: 'Approved', note: 'Công thức đã đạt yêu cầu và sẵn sàng xuất bản.' } }, `Duyệt “${recipe.title}”?`)}>Duyệt</ActionButton><ActionButton disabled={busy} onClick={() => { const note = window.prompt('Nêu nội dung cần tác giả chỉnh sửa:'); if (note) act(`/admin/recipes/${recipe.id}/review`, { method: 'POST', body: { decision: 'ChangesRequested', note } }) }}>Yêu cầu sửa</ActionButton></td></tr>)}</tbody></table></div>}
  </section>

  const renderCategories = () => <section className="admin-panel">
    <div className="admin-section-heading"><div><p className="admin-label">PHÂN LOẠI LIÊN KẾT</p><h2>Danh mục và công thức</h2><p>Số lượng lấy trực tiếp từ công thức có cùng danh mục. Có thể ẩn danh mục trên web hoặc chuyển toàn bộ món sang danh mục khác.</p></div><Link className="admin-primary-link" href="/categories">Mở trang danh mục</Link></div>
    <div className="admin-table"><table><thead><tr><th>Danh mục</th><th>Tổng món</th><th>Đã xuất bản</th><th>Hiển thị</th><th>Thao tác</th></tr></thead><tbody>{categories.items.map(category => <tr key={category.id}><td><Link href={`/categories?category=${category.id}`}>{category.name}</Link></td><td>{category.recipeCount}</td><td>{category.publishedRecipeCount}</td><td><span className={`admin-status ${category.isVisible ? 'status-1' : 'status-2'}`}>{category.isVisible ? 'Đang hiện' : 'Đang ẩn'}</span></td><td className="admin-row-actions"><ActionButton disabled={busy} onClick={() => act(`/admin/categories/${category.id}/visibility`, { method: 'PUT', body: { isVisible: !category.isVisible, displayOrder: category.displayOrder } })}>{category.isVisible ? 'Ẩn' : 'Hiện'}</ActionButton>{category.recipeCount > 0 && <ActionButton disabled={busy} onClick={() => { const target = window.prompt('Nhập ID danh mục đích để chuyển các công thức. ID này có trong URL khi mở danh mục.'); if (target) act(`/admin/categories/${category.id}/recipes/move`, { method: 'POST', body: { targetCategoryId: target } }, `Chuyển toàn bộ ${category.recipeCount} công thức?`) }}>Chuyển món</ActionButton>}</td></tr>)}</tbody></table></div>
  </section>

  const renderAnalytics = () => <section className="admin-panel">
    <div className="admin-section-heading"><div><p className="admin-label">30 NGÀY GẦN NHẤT</p><h2>Thống kê hoạt động</h2><p>Theo dõi tăng trưởng nội dung, thành viên và chất lượng kiểm duyệt.</p></div></div>
    {analytics && <><div className="admin-stats">{Object.entries({ members: 'Thành viên mới', recipesCreated: 'Công thức mới', posts: 'Bài cộng đồng', reports: 'Báo cáo', resolvedReports: 'Báo cáo đã xử lý' }).map(([key, label]) => <article key={key}><strong>{analytics[key] ?? 0}</strong><span>{label}</span></article>)}</div><div className="admin-split"><div><h3>Danh mục phổ biến</h3>{analytics.categoryLeaderboard?.map(item => <p className="admin-list-row" key={item.id}><span>{item.name}</span><b>{item.recipeCount} món</b></p>)}</div><div><h3>Công thức được xem nhiều</h3>{analytics.recipeLeaderboard?.map(item => <p className="admin-list-row" key={item.id}><Link href={`/recipes/${item.id}`}>{item.title}</Link><b>{item.viewCount} lượt xem</b></p>)}</div></div></>}
  </section>

  const renderMedia = () => <section className="admin-panel">
    <div className="admin-section-heading"><div><p className="admin-label">LƯU TRỮ ẢNH</p><h2>Kho ảnh và dung lượng</h2><p>Kiểm tra tệp theo khu vực; chỉ tệp không còn liên kết với dữ liệu mới bị dọn.</p></div><ActionButton disabled={busy} destructive onClick={() => act('/admin/media/cleanup', { method: 'POST' }, 'Dọn các tệp ảnh không còn được sử dụng?')}>Dọn ảnh rác</ActionButton></div>
    {media && <><div className="admin-stats">{media.groups?.map(group => <article key={group.prefix}><strong>{group.fileCount}</strong><span>{group.prefix} · {(group.bytes / 1024 / 1024).toFixed(2)} MB</span></article>)}</div><p className="admin-note">Tổng dung lượng: {(media.totalBytes / 1024 / 1024).toFixed(2)} MB · {media.recipeImageRecords} ảnh công thức có metadata.</p></>}
  </section>

  const renderSystem = () => <section className="admin-panel">
    <div className="admin-section-heading"><div><p className="admin-label">VẬN HÀNH</p><h2>Tình trạng hệ thống</h2><p>Thông tin chỉ dành cho quản trị viên, giúp kiểm tra nhanh trước khi demo.</p></div><a className="admin-primary-link" href="http://localhost:5152/hangfire" target="_blank" rel="noreferrer">Mở Hangfire</a></div>
    {systemStatus && <div className="admin-stats">{Object.entries({ api: 'API', database: 'Cơ sở dữ liệu', cache: 'Redis cache', storage: 'Lưu trữ ảnh' }).map(([key, label]) => <article key={key}><strong className={systemStatus[key]?.status === 'Healthy' ? 'admin-healthy' : ''}>{systemStatus[key]?.status || '—'}</strong><span>{label}</span></article>)}</div>}<p className="admin-note">Tác vụ nền: sitemap mỗi ngày · dọn kho ảnh mỗi tuần.</p>
  </section>

  const renderAudit = () => <section className="admin-panel">
    <div className="admin-section-heading"><div><p className="admin-label">TRUY VẾT QUẢN TRỊ</p><h2>Nhật ký thao tác</h2><p>Mọi thao tác khóa tài khoản, xử lý báo cáo, duyệt nội dung, đổi danh mục và dọn ảnh đều được lưu tại đây.</p></div></div>
    {auditLogs.items.length === 0 ? <p className="admin-empty">Chưa có thao tác quản trị nào được ghi nhận.</p> : <div className="admin-table"><table><thead><tr><th>Thời gian</th><th>Quản trị viên</th><th>Hành động</th><th>Đối tượng</th><th>Chi tiết</th></tr></thead><tbody>{auditLogs.items.map(log => <tr key={log.id}><td>{new Date(log.createdAt).toLocaleString('vi-VN')}</td><td>{log.actorName || log.actorUsername}</td><td><code>{log.action}</code></td><td>{log.targetType}<br /><small>{log.targetId}</small></td><td>{log.summary}</td></tr>)}</tbody></table></div>}
  </section>

  const panels = { recipes: renderRecipes(), reviews: renderReviews(), categories: renderCategories(), posts: renderPosts(), articles: renderArticles(), users: renderUsers(), reports: renderReports(), analytics: renderAnalytics(), media: renderMedia(), system: renderSystem(), audit: renderAudit() }

  const activeLabel = TABS.find(([key]) => key === activeTab)?.[1] || 'Tổng quan'
  return <div className="community-app admin-shell"><aside className="admin-sidebar"><Link href="/community" className="admin-brand">Bếp Nhà <small>QUẢN TRỊ</small></Link><nav aria-label="Điều hướng quản trị">{TABS.map(([key, label]) => <button key={key} type="button" onClick={() => setActiveTab(key)} className={activeTab === key ? 'active' : ''}>{label}</button>)}</nav><button type="button" className="admin-sidebar-refresh" disabled={busy} onClick={load}>↻ Làm mới dữ liệu</button></aside><main className="admin-main">
    <header className="admin-hero"><p className="admin-breadcrumb"><Link href="/community">Trang chủ</Link><span>/</span><b>Quản trị</b><span>/</span><b>{activeLabel}</b></p><p className="community-kicker">CULINARYBLOG · ADMIN</p><h1>{activeLabel}</h1><p>Kiểm soát công thức, danh mục, thành viên, nội dung cộng đồng và báo cáo từ một nơi.</p></header>
    {error && <div className="admin-error"><ErrorState title="Không thể tải khu vực quản trị" message={error} retry={load} /></div>}
    {busy && <LoadingState label="Đang đồng bộ dữ liệu quản trị…" compact />}
    {!busy && overview && activeTab === 'overview' && <section className="admin-panel"><div className="admin-section-heading"><div><p className="admin-label">TOÀN HỆ THỐNG</p><h2>Tổng quan hoạt động</h2><p>Chọn một khu vực ở thanh bên để kiểm duyệt dữ liệu chi tiết.</p></div></div><div className="admin-stats">{Object.entries({ users: 'Thành viên', recipes: 'Công thức', categories: 'Danh mục', posts: 'Bài cộng đồng', articles: 'Bài biên tập', pendingReports: 'Báo cáo chờ xử lý' }).map(([key, label]) => <article key={key}><strong>{overview[key] ?? 0}</strong><span>{label}</span></article>)}</div></section>}
    {!busy && activeTab !== 'overview' && panels[activeTab]}
  </main><Dialog open={Boolean(pendingAction)} onOpenChange={open => { if (!open) setPendingAction(null) }}><DialogContent className="admin-confirm-dialog"><p className="admin-label">XÁC NHẬN THAO TÁC</p><h2>Bạn có chắc chắn?</h2><p>{pendingAction?.confirmation}</p><div><button type="button" className="admin-action" onClick={() => setPendingAction(null)}>Hủy</button><button type="button" className="admin-action danger" onClick={async () => { const action = pendingAction; setPendingAction(null); try { if (action?.bulk) await action.bulk(); else if (action?.onConfirm) await action.onConfirm(); else if (action) await executeAction(action.path, action.options) } catch (actionError) { setError(actionError.message) } }}>Xác nhận</button></div></DialogContent></Dialog>
  <Dialog open={Boolean(memberDetail) || memberLoading} onOpenChange={open => { if (!open) closeMemberDetail() }}><DialogContent className="admin-member-dialog">{memberLoading && <LoadingState label="Đang tải hồ sơ thành viên…" compact />}{memberDetail && memberProfile && <><header className="admin-member-head"><div>{memberDetail.profile.avatarUrl ? <img src={memberDetail.profile.avatarUrl} alt="" /> : <span>{(memberDetail.profile.fullName || memberDetail.profile.userName || '?').slice(0, 1)}</span>}<div><p className="admin-label">HỒ SƠ THÀNH VIÊN</p><h2>{memberDetail.profile.fullName || memberDetail.profile.userName}</h2><p>@{memberDetail.profile.userName} · {memberDetail.profile.role} · {memberDetail.profile.isSuspended ? 'Đang khóa' : 'Đang hoạt động'}</p></div></div><Link href={`/members/${encodeURIComponent(memberDetail.profile.userName || '')}`}>Xem trang công khai</Link></header><div className="admin-member-scroll"><section className="admin-member-stats">{Object.entries({ recipes: 'Công thức', publishedRecipes: 'Đã xuất bản', posts: 'Bài đăng', comments: 'Bình luận', articles: 'Bài viết', activeSessions: 'Phiên còn hiệu lực' }).map(([key, label]) => <article key={key}><strong>{memberDetail.statistics[key] ?? 0}</strong><span>{label}</span></article>)}</section><section className="admin-member-section"><h3>Thông tin và chỉnh sửa</h3><form className="admin-member-form" onSubmit={saveMemberProfile}><label>Họ và tên<input required minLength="2" maxLength="120" value={memberProfile.fullName} onChange={event => setMemberProfile(current => ({ ...current, fullName: event.target.value }))} /></label><label>Email<input type="email" required value={memberProfile.email} onChange={event => setMemberProfile(current => ({ ...current, email: event.target.value }))} /></label><label>Ngày sinh<input type="date" value={memberProfile.birthDate} onChange={event => setMemberProfile(current => ({ ...current, birthDate: event.target.value }))} /></label><label>Ảnh đại diện (URL)<input type="url" value={memberProfile.avatarUrl} onChange={event => setMemberProfile(current => ({ ...current, avatarUrl: event.target.value }))} /></label><label className="admin-member-form-wide">Giới thiệu<textarea rows="3" maxLength="500" value={memberProfile.bio} onChange={event => setMemberProfile(current => ({ ...current, bio: event.target.value }))} /></label><label className="admin-toggle admin-member-form-wide"><input type="checkbox" checked={memberProfile.emailConfirmed} onChange={event => setMemberProfile(current => ({ ...current, emailConfirmed: event.target.checked }))} /> Email đã xác nhận</label><div className="admin-member-form-wide"><ActionButton disabled={busy}>Lưu hồ sơ</ActionButton></div></form></section><section className="admin-member-section"><h3>Bảo mật và phiên đăng nhập</h3><p className="admin-note">2FA: {memberDetail.profile.twoFactorEnabled ? 'Đang bật' : 'Chưa bật'} · Đăng nhập gần nhất: {memberDetail.profile.lastLoginAt ? new Date(memberDetail.profile.lastLoginAt).toLocaleString('vi-VN') : 'Chưa có dữ liệu'}.</p><div className="admin-member-form"><label>Mật khẩu tạm<input type="password" autoComplete="new-password" placeholder="Tối thiểu 8 ký tự, đủ 4 loại" value={memberPassword.temporaryPassword} onChange={event => setMemberPassword(current => ({ ...current, temporaryPassword: event.target.value }))} /></label><label>Xác nhận mật khẩu tạm<input type="password" autoComplete="new-password" value={memberPassword.confirmTemporaryPassword} onChange={event => setMemberPassword(current => ({ ...current, confirmTemporaryPassword: event.target.value }))} /></label></div><div className="admin-member-actions"><ActionButton destructive disabled={busy || !memberPassword.temporaryPassword || !memberPassword.confirmTemporaryPassword} onClick={confirmMemberPasswordReset}>Đặt lại mật khẩu & thu hồi phiên</ActionButton><ActionButton disabled={busy} onClick={() => act(`/admin/users/${memberDetail.profile.id}/sessions/revoke`, { method: 'POST' }, `Thu hồi tất cả phiên của ${memberDetail.profile.fullName || memberDetail.profile.userName}?`)}>Thu hồi toàn bộ phiên</ActionButton></div></section><section className="admin-member-section"><h3>Nội dung và hoạt động gần đây</h3><div className="admin-member-columns"><div><h4>Công thức gần đây</h4>{memberDetail.recentRecipes?.length ? memberDetail.recentRecipes.map(recipe => <p key={recipe.id}><Link href={`/recipes/${recipe.id}`}>{recipe.title}</Link><small>{recipe.categoryName} · {recipeStatus[recipe.status]}</small></p>) : <span>Chưa có công thức.</span>}</div><div><h4>Hoạt động tài khoản</h4>{memberDetail.recentActivity?.length ? memberDetail.recentActivity.map(activity => <p key={activity.id}><b>{activity.activityType}</b><span>{activity.description}</span><small>{new Date(activity.createdAt).toLocaleString('vi-VN')}</small></p>) : <span>Chưa có hoạt động được ghi lại.</span>}</div></div></section></div></>}</DialogContent></Dialog></div>
}
