import Image from 'next/image'
import Link from 'next/link'
import { resolveMediaUrl } from '../../../src/api/config.js'
import RecipeActions from './RecipeActions.jsx'

const statusLabel = status => status === 1 ? 'Đã xuất bản' : status === 2 ? 'Đã lưu trữ' : 'Bản nháp'
const difficultyLabel = value => ({ Easy: 'Dễ', Medium: 'Trung bình', Hard: 'Khó', Expert: 'Chuyên gia' })[value] || value || 'Chưa cập nhật'
const nutritionLabels = {
  calories: ['Năng lượng', 'kcal'], protein: ['Chất đạm', 'g'], carbohydrates: ['Tinh bột', 'g'],
  fat: ['Chất béo', 'g'], fiber: ['Chất xơ', 'g'], sodium: ['Natri', 'mg'],
}
const bypassLocalOptimizer = url => /^https?:\/\/(localhost|127\.0\.0\.1):\d+\//i.test(url) || /^https:\/\/(commons|upload)\.wikimedia\.org\//i.test(url || '')

export default function RecipeServerDetails({ recipe }) {
  const ingredients = recipe.recipeIngredients?.length
    ? recipe.recipeIngredients.map(item => [item.quantity, item.unit, item.name, item.notes].filter(Boolean).join(' · '))
    : recipe.ingredients || []
  const steps = recipe.recipeSteps?.length
    ? recipe.recipeSteps.map(item => ({ title: item.title || `Bước ${item.stepNumber}`, description: item.description, timer: item.timerMinutes }))
    : (recipe.instructions || []).map((description, index) => ({ title: `Bước ${index + 1}`, description }))
  const imageUrl = resolveMediaUrl(recipe.imageUrl)
  const wikimediaSourceUrl = imageUrl?.startsWith('https://commons.wikimedia.org/wiki/Special:Redirect/file/')
    ? `https://commons.wikimedia.org/wiki/File:${imageUrl.split('/file/')[1].split('?')[0]}`
    : imageUrl?.startsWith('https://upload.wikimedia.org/wikipedia/commons/thumb/')
      ? `https://commons.wikimedia.org/wiki/File:${imageUrl.split('/').at(-2)}`
      : null
  const totalMinutes = Number(recipe.prepTimeMinutes || 0) + Number(recipe.cookTimeMinutes || 0)
  const nutrition = Object.entries(recipe.nutrition || {}).filter(([, value]) => value != null)

  return <div className="page-shell"><article className="recipe-detail-shell"><div className="recipe-detail-card">
    <header className="recipe-detail-header">
      <div className="recipe-detail-title"><p className="eyebrow">CÔNG THỨC CHI TIẾT</p><h1>{recipe.title}</h1><div className="recipe-title-badges"><span className="meta-chip">{recipe.categoryName || 'Chưa phân loại'}</span><span className={`status-badge status-${recipe.status}`}>{statusLabel(recipe.status)}</span>{recipe.isVegetarian && <span className="meta-chip vegetarian-chip">Món chay</span>}</div></div>
      <Link href="/recipes" className="secondary-btn inline-link">← Danh sách công thức</Link>
    </header>
    {imageUrl
      ? <div className="recipe-detail-media"><Image className="recipe-detail-image" src={imageUrl} alt={`Ảnh món ${recipe.title}`} width={1200} height={720} sizes="(max-width: 768px) 100vw, 1100px" preload unoptimized={bypassLocalOptimizer(imageUrl)} />{wikimediaSourceUrl && <a className="recipe-image-credit" href={wikimediaSourceUrl} target="_blank" rel="noreferrer">Ảnh tham khảo: Wikimedia Commons ↗</a>}</div>
      : <div className="recipe-detail-media recipe-image-fallback" role="img" aria-label={`Chưa có ảnh cho ${recipe.title}`}><span>🍲</span><p>Ảnh món ăn đang được cập nhật</p></div>}
    <div className="recipe-fact-grid" aria-label="Thông tin nhanh">
      <div><small>Chuẩn bị</small><strong>{recipe.prepTimeMinutes || 0} phút</strong></div><div><small>Nấu</small><strong>{recipe.cookTimeMinutes || 0} phút</strong></div><div><small>Tổng thời gian</small><strong>{totalMinutes} phút</strong></div><div><small>Khẩu phần</small><strong>{recipe.servings || 1} người</strong></div><div><small>Độ khó</small><strong>{difficultyLabel(recipe.difficulty)}</strong></div>
    </div>
    <div className="recipe-detail-main">
      <aside className="recipe-detail-identity-panel">
        <div><span className="detail-label">Thông tin công thức</span><p>Được lưu và kiểm soát phiên bản trên hệ thống.</p></div>
        <dl className="recipe-identity-list"><div><dt>Mã công thức</dt><dd>{recipe.id}</dd></div><div><dt>ID tác giả</dt><dd>{recipe.authorId}</dd></div><div><dt>Trạng thái</dt><dd>{statusLabel(recipe.status)}</dd></div></dl>
        <p className="recipe-operation-note"><strong>Cách dùng:</strong> đọc nguyên liệu, thực hiện tuần tự từng bước, sau đó đăng nhập để lưu hoặc đánh giá món.</p>
      </aside>
      <div className="recipe-detail-content">
        <section className="recipe-detail-section recipe-description"><p className="detail-label">GIỚI THIỆU</p><h2>Về món ăn này</h2><p>{recipe.description || 'Tác giả chưa bổ sung mô tả cho món ăn.'}</p></section>
        <div className="recipe-detail-grid">
          <section className="recipe-detail-section ingredient-panel"><div className="recipe-section-heading"><div><p className="detail-label">CHUẨN BỊ</p><h2>Nguyên liệu</h2></div><span>{ingredients.length} mục</span></div><ul className="recipe-ingredient-list">{ingredients.map((item, index) => <li key={`${recipe.id}-ingredient-${index}`}><span aria-hidden="true">✓</span><span>{item}</span></li>)}</ul></section>
          <section className="recipe-detail-section step-panel"><div className="recipe-section-heading"><div><p className="detail-label">THỰC HIỆN</p><h2>Các bước làm</h2></div><span>{steps.length} bước</span></div><ol className="recipe-step-list">{steps.map((item, index) => <li key={`${recipe.id}-step-${index}`}><span className="step-number">{index + 1}</span><div><strong>{item.title}</strong><p>{item.description}</p>{item.timer != null && <small>⏱ {item.timer} phút</small>}</div></li>)}</ol></section>
        </div>
        {nutrition.length > 0 && <section className="recipe-detail-section nutrition-panel"><div className="recipe-section-heading"><div><p className="detail-label">THAM KHẢO</p><h2>Dinh dưỡng mỗi khẩu phần</h2></div></div><div className="nutrition-grid">{nutrition.map(([key, value]) => { const [label, unit] = nutritionLabels[key] || [key, '']; return <div key={key}><small>{label}</small><strong>{value}<em>{unit}</em></strong></div> })}</div></section>}
        <RecipeActions recipe={recipe} />
      </div>
    </div>
  </div></article></div>
}
