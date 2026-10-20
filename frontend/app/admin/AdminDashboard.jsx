'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { apiRequest } from '../../src/api/session'
import Pagination from '../../src/components/common/Pagination'
import './admin.css'

async function request(path, method = 'GET') {
  try { return await apiRequest(path, { method }) }
  catch (error) {
    if (error?.status === 401) throw new Error('Vui lòng đăng nhập bằng tài khoản quản trị.')
    if (error?.status === 403) throw new Error('Tài khoản này không có quyền quản trị.')
    throw error
  }
}

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null)
  const [users, setUsers] = useState({ items: [], totalPages: 1 })
  const [reports, setReports] = useState({ items: [], totalPages: 1 })
  const [recipes, setRecipes] = useState([])
  const [recipePage, setRecipePage] = useState(1)
  const [page, setPage] = useState(1)
  const [reportPage, setReportPage] = useState(1)
  const [resolved, setResolved] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const load = useCallback(async () => {
    setBusy(true); setError('')
    try {
      const summary = await request('/admin/overview')
      const [members, flags, cookbook] = await Promise.all([request(`/admin/users?page=${page}`), request(`/admin/reports?page=${reportPage}&resolved=${resolved}`), request('/recipes/mine')])
      setOverview(summary); setUsers(members); setReports(flags); setRecipes(cookbook)
    } catch (e) { setOverview(null); setError(e.message) } finally { setBusy(false) }
  }, [page, reportPage, resolved])
  useEffect(() => { load() }, [load])
  const act = async (path, method) => {
    setBusy(true); setError('')
    try { await request(path, method); await load() } catch (e) { setError(e.message); setBusy(false) }
  }
  return <div className="community-app"><main className="admin-main">
    <header><p className="community-kicker">CULINARYBLOG</p><h1>Quản trị cộng đồng</h1><p>Theo dõi nội dung, thành viên và xử lý báo cáo.</p></header>
    {error && <p role="alert" className="admin-error">{error} <Link href="/login">Đăng nhập</Link></p>}
    {busy && <p role="status">Đang cập nhật dữ liệu…</p>}
    {overview && <>
      <div className="admin-stats">{Object.entries({ users: 'Thành viên', recipes: 'Công thức', categories: 'Danh mục', posts: 'Bài cộng đồng', pendingReports: 'Báo cáo chờ xử lý' }).map(([key, label]) => <article key={key}><strong>{overview[key]}</strong><span>{label}</span></article>)}</div>
      <nav className="admin-actions"><Link href="/categories">Quản lý danh mục →</Link><Link href="/recipes/new">Tạo công thức →</Link><button disabled={busy} onClick={load}>Làm mới</button></nav>
      <section><h2>Báo cáo nội dung</h2><label><input type="checkbox" checked={resolved} onChange={e => { setResolved(e.target.checked); setReportPage(1) }} /> Đã xử lý</label>
        {reports.items.length === 0 ? <p>Không có báo cáo trong danh sách này.</p> : <div className="admin-table"><table><thead><tr><th>Đối tượng</th><th>Lý do</th><th>Ngày gửi</th><th>Xử lý</th></tr></thead><tbody>{reports.items.map(r => <tr key={r.id}><td>{r.targetType}<br /><small>{r.targetId}</small></td><td>{r.reason}</td><td>{new Date(r.createdAt).toLocaleDateString('vi-VN')}</td><td>{r.resolvedAt ? 'Đã xử lý' : <button disabled={busy} onClick={() => act(`/admin/reports/${r.id}/resolve`, 'PUT')}>Đánh dấu đã xử lý</button>}</td></tr>)}</tbody></table></div>}
        <Pagination page={reportPage} totalPages={reports.totalPages} onPageChange={setReportPage} disabled={busy} />
      </section>
      <section><h2>Công thức</h2><div className="admin-table"><table><thead><tr><th>Tên công thức</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>{recipes.slice((recipePage - 1) * 20, recipePage * 20).map(r => <tr key={r.id}><td><Link href={`/recipes/${r.id}`}>{r.title}</Link></td><td>{['Bản nháp', 'Đã xuất bản', 'Lưu trữ'][r.status] || r.status}</td><td>{r.status === 0 && <button disabled={busy} onClick={() => act(`/recipes/${r.id}/publish`, 'POST')}>Xuất bản</button>}{r.status === 1 && <button disabled={busy} onClick={() => act(`/recipes/${r.id}/unpublish`, 'POST')}>Gỡ xuất bản</button>}{r.status === 2 && <button disabled={busy} onClick={() => act(`/recipes/${r.id}/restore`, 'POST')}>Khôi phục bản nháp</button>}</td></tr>)}</tbody></table></div><Pagination page={recipePage} totalPages={Math.ceil(recipes.length / 20)} onPageChange={setRecipePage} disabled={busy} /></section>
      <section><h2>Thành viên</h2><div className="admin-table"><table><thead><tr><th>Thành viên</th><th>Email</th><th>Vai trò</th></tr></thead><tbody>{users.items.map(u => <tr key={u.id}><td><Link href={`/members/${encodeURIComponent(u.userName)}`}>{u.fullName || u.userName}</Link></td><td>{u.email}</td><td>{u.role}</td></tr>)}</tbody></table></div><Pagination page={page} totalPages={users.totalPages} onPageChange={setPage} disabled={busy} /></section>
    </>}
  </main></div>
}
