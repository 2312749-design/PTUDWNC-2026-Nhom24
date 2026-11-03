'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiRequest } from './api/session'
import { toast } from 'react-toastify'

const substitutions = [
  { keys: ['nước mắm'], from: 'Nước mắm', to: 'Xì dầu nhạt + chút muối' },
  { keys: ['thịt bò'], from: 'Thịt bò', to: 'Thịt gà hoặc nấm đùi gà' },
  { keys: ['sữa'], from: 'Sữa bò', to: 'Sữa yến mạch không đường' },
]

export default function RecipeProPanel({ recipe }) {
  const [allergens, setAllergens] = useState([])
  const [related, setRelated] = useState([])
  const [cookReview, setCookReview] = useState({ rating: 5, content: '', photoUrl: '' })
  const [savingCooked, setSavingCooked] = useState(false)

  useEffect(() => {
    let active = true
    Promise.all([apiRequest(`/pro/recipes/${recipe.id}/allergens`), apiRequest(`/pro/recipes/${recipe.id}/related`)])
      .then(([safety, matches]) => { if (active) { setAllergens(safety.allergens || []); setRelated(matches.items || []) } })
      .catch(() => {})
    return () => { active = false }
  }, [recipe.id])

  const ingredientText = (recipe.recipeIngredients?.map(item => item.name) || recipe.ingredients || []).join(' ').toLowerCase()
  const usefulSwaps = substitutions.filter(item => item.keys.some(key => ingredientText.includes(key)))


  const saveCooked = async event => {
    event.preventDefault()
    setSavingCooked(true)
    try {
      await apiRequest(`/features/recipes/${recipe.id}/reviews`, { method: 'POST', body: JSON.stringify({ rating: Number(cookReview.rating), content: cookReview.content, photoUrl: cookReview.photoUrl, isCooked: true }) })
      toast.success('Đã đánh dấu món này là đã nấu!')
      setCookReview({ ...cookReview, content: '' })
    } catch (error) { toast.error(error.message || 'Chưa thể lưu thành phẩm.') }
    finally { setSavingCooked(false) }
  }

  const uploadCookedPhoto = async event => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type) || file.size > 5 * 1024 * 1024) return toast.error('Chọn ảnh JPG, PNG, WebP hoặc AVIF không quá 5 MB.')
    const body = new FormData(); body.append('file', file)
    setSavingCooked(true)
    try { const data = await apiRequest('/community/upload-media', { method: 'POST', body }); setCookReview(current => ({ ...current, photoUrl: data.mediaUrl })); toast.success('Đã tải ảnh thành phẩm.') }
    catch (error) { toast.error(error.message || 'Chưa tải được ảnh.') }
    finally { setSavingCooked(false); event.target.value = '' }
  }
  return <section className="recipe-pro-panel" aria-label="Gợi ý công thức thông minh">
    <div><p>GỢI Ý THÔNG MINH</p><h3>Thay thế, dị ứng & món liên quan</h3></div>
    {allergens.length > 0 && <div className="pro-alert"><b>Cảnh báo dị ứng:</b> {allergens.join(' · ')} <small>Kiểm tra lại nhãn nguyên liệu nếu bạn có dị ứng nghiêm trọng.</small></div>}
    {usefulSwaps.length > 0 && <div className="swap-list"><b>Có thể thay:</b>{usefulSwaps.map(item => <span key={item.from}><strong>{item.from}</strong> → {item.to}</span>)}</div>}
    {related.length > 0 && <div className="related-mini"><b>Có thể bạn cũng thích</b><div>{related.map(item => <Link key={item.id} href={`/recipes/${item.slug || item.id}`}>{item.title}<small>{item.category}</small></Link>)}</div></div>}
    <form className="cooked-form" onSubmit={saveCooked}><b>Đã nấu món này?</b><div><label>Sao<select value={cookReview.rating} onChange={event => setCookReview({ ...cookReview, rating: event.target.value })}>{[5, 4, 3, 2, 1].map(value => <option key={value} value={value}>{value} ★</option>)}</select></label><label>Ảnh thành phẩm<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={uploadCookedPhoto} disabled={savingCooked} />{cookReview.photoUrl && <small>Đã tải ảnh ✓</small>}</label></div><textarea value={cookReview.content} onChange={event => setCookReview({ ...cookReview, content: event.target.value })} placeholder="Chia sẻ cảm nhận sau khi nấu…" maxLength="1200" /><button disabled={savingCooked} type="submit">{savingCooked ? 'Đang lưu…' : 'Đăng thành phẩm'}</button></form>
  </section>
}
