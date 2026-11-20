'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { apiRequest, getSessionUser, hasSession } from '../../../src/api/session.js'
import { RecipeEngagement } from '../../../src/PlatformFeaturePages.jsx'
import RecipeProPanel from '../../../src/RecipeProPanel.jsx'

export default function RecipeActions({ recipe }) {
  const router = useRouter()
  const [canManage, setCanManage] = useState(false)

  useEffect(() => {
    if (!hasSession()) return
    apiRequest('/auth/me').then(user => setCanManage(user.role === 'Admin' || user.id === recipe.authorId)).catch(() => {})
    apiRequest(`/recipes/${recipe.id}/view`, { method: 'POST' }).catch(() => {})
  }, [recipe.authorId, recipe.id])

  const share = async () => {
    const data = { title: recipe.title, text: recipe.description || recipe.title, url: window.location.href }
    try {
      if (navigator.share) await navigator.share(data)
      else { await navigator.clipboard.writeText(data.url); toast.success('Đã sao chép liên kết chia sẻ.') }
    } catch (error) {
      if (error?.name !== 'AbortError') toast.error('Chưa thể chia sẻ công thức.')
    }
  }

  const remove = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa món ăn này?')) return
    try {
      await apiRequest(`/recipes/${recipe.id}`, { method: 'DELETE' })
      toast.success('Đã xóa công thức.')
      router.push('/recipes')
      router.refresh()
    } catch (error) { toast.error(error.message) }
  }

  return <>
    <div className="detail-actions">
      <button type="button" className="secondary-btn compact-btn" onClick={share}>Chia sẻ</button>
      {canManage && <>
        <button type="button" className="small-btn edit" onClick={() => router.push(`/dashboard/recipes/${recipe.id}/edit`)}>Sửa</button>
        <button type="button" className="small-btn delete" onClick={remove}>Xóa</button>
      </>}
    </div>
    <RecipeProPanel recipe={recipe} />
    <RecipeEngagement recipe={recipe} currentUser={getSessionUser()} />
  </>
}
