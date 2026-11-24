'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiRequest } from './api/session'

const substitutions = [
  { keys: ['nước mắm'], from: 'Nước mắm', to: 'Xì dầu nhạt + chút muối' },
  { keys: ['thịt bò'], from: 'Thịt bò', to: 'Thịt gà hoặc nấm đùi gà' },
  { keys: ['sữa'], from: 'Sữa bò', to: 'Sữa yến mạch không đường' },
]

export default function RecipeProPanel({ recipe }) {
  const [allergens, setAllergens] = useState([])
  const [related, setRelated] = useState([])

  useEffect(() => {
    let active = true
    Promise.all([apiRequest(`/pro/recipes/${recipe.id}/allergens`), apiRequest(`/pro/recipes/${recipe.id}/related`)])
      .then(([safety, matches]) => { if (active) { setAllergens(safety.allergens || []); setRelated(matches.items || []) } })
      .catch(() => {})
    return () => { active = false }
  }, [recipe.id])

  const ingredientText = (recipe.recipeIngredients?.map(item => item.name) || recipe.ingredients || []).join(' ').toLowerCase()
  const usefulSwaps = substitutions.filter(item => item.keys.some(key => ingredientText.includes(key)))


  return <section className="recipe-pro-panel" aria-label="Gợi ý công thức thông minh">
    <div><p>GỢI Ý THÔNG MINH</p><h3>Thay thế, dị ứng & món liên quan</h3></div>
    {allergens.length > 0 && <div className="pro-alert"><b>Cảnh báo dị ứng:</b> {allergens.join(' · ')} <small>Kiểm tra lại nhãn nguyên liệu nếu bạn có dị ứng nghiêm trọng.</small></div>}
    {usefulSwaps.length > 0 && <div className="swap-list"><b>Có thể thay:</b>{usefulSwaps.map(item => <span key={item.from}><strong>{item.from}</strong> → {item.to}</span>)}</div>}
    {related.length > 0 && <div className="related-mini"><b>Có thể bạn cũng thích</b><div>{related.map(item => <Link key={item.id} href={`/recipes/${item.slug || item.id}`}>{item.title}<small>{item.category}</small></Link>)}</div></div>}
  </section>
}
