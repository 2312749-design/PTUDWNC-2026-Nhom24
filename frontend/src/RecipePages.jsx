'use client'

import { useCallback, useEffect, useState } from 'react'
import { Navigate, Link } from './navigation.jsx'
import { useLocation, useNavigate, useParams } from './navigation-hooks.js'
import { toast } from 'react-toastify'
import { RecipeEngagement } from './PlatformFeaturePages.jsx'
import RecipeProPanel from './RecipeProPanel.jsx'
import { useLocale } from './locale-context.js'
import { apiRequest, clearSession, getAccessToken as getStoredAccessToken, getSessionUser, hasSession } from './api/session.js'
import AppFooter from './components/layout/AppFooter.jsx'

const RECIPE_CATALOG_UPDATED_EVENT = 'culinary:recipe-catalog-updated'

function notifyRecipeCatalogUpdated() {
  if (typeof window === 'undefined') return
  // The value lets a second open tab know it must re-fetch its category counts.
  window.localStorage.setItem(RECIPE_CATALOG_UPDATED_EVENT, String(Date.now()))
  window.dispatchEvent(new Event(RECIPE_CATALOG_UPDATED_EVENT))
}
function getStoredToken() {
  return getStoredAccessToken()
}

export function ProtectedRoute({ children }) {
  const token = getStoredToken() || getSessionUser()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export function RecipeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLocale()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [canManage, setCanManage] = useState(false)

  const fetchRecipe = useCallback(async () => {
    const token = getStoredToken() || getSessionUser()

    try {
      const recipePath = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
        ? `/recipes/${id}`
        : `/recipes/slug/${encodeURIComponent(id)}`
      const data = await apiRequest(recipePath)
      setRecipe(data)
      if (token) {
        try {
          const currentUser = await apiRequest('/auth/me')
          setCanManage(currentUser.role === 'Admin' || currentUser.id === data.authorId)
        } catch {
          setCanManage(false)
        }
      } else {
        setCanManage(false)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchRecipe()
  }, [fetchRecipe])

  useEffect(() => {
    const activeToken = getStoredToken() || getSessionUser()
    if (activeToken) apiRequest(`/recipes/${id}/view`, { method: 'POST' }).catch(() => {})
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa món ăn này?')) {
      return
    }

    try {
      const data = await apiRequest(`/recipes/${id}`, { method: 'DELETE' })

      notifyRecipeCatalogUpdated()
      toast.success(data.message || 'Xóa món ăn thành công.')
      navigate('/recipes')
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (loading) {
    return (
      <div className="page-shell">
        <div className="recipe-detail-card">
          <p>{t('Đang tải chi tiết món ăn...')}</p>
        </div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="page-shell">
        <div className="recipe-detail-card empty-state">
          <h2>{t('Không tìm thấy món ăn.')}</h2>
          <Link to="/recipes" className="primary-btn inline-link">{t('Quay lại danh sách')}</Link>
        </div>
      </div>
    )
  }

  const ingredientLines = recipe.recipeIngredients?.length
    ? recipe.recipeIngredients.map((item) => [item.quantity, item.unit, item.name].filter(Boolean).join(' '))
    : recipe.ingredients || []
  const instructionLines = recipe.recipeSteps?.length
    ? recipe.recipeSteps.map((item) => [item.title, item.description].filter(Boolean).join(': '))
    : recipe.instructions || []

  return (
    <><div className="page-shell">
      <div className="recipe-detail-shell">
        <div className="recipe-detail-card">
          <div className="recipe-detail-header">
            <div>
              <p className="eyebrow">{t('Recipe Detail')}</p>
              <h1>{t(recipe.title)}</h1>
              <div className="meta-chip">{t(recipe.categoryName || 'Chưa phân loại')}</div>
            </div>

            <div className="detail-actions">
              <Link to="/recipes" className="secondary-btn inline-link">{t('Quay lại')}</Link>
              {canManage && <>
                <button type="button" className="small-btn edit" onClick={() => navigate('/recipes')}>{t('Sửa')}</button>
                <button type="button" className="small-btn delete" onClick={handleDelete}>{t('Xóa')}</button>
              </>}
            </div>
          </div>

          <div className="recipe-detail-main">
            <div className="recipe-detail-identity-panel">
              <label className="detail-label">ID</label>
              <div className="detail-id-box">{recipe.id}</div>

            </div>

            <div className="recipe-detail-content">
              <div className="recipe-meta">
                <span className="status-badge">{t(recipe.status === 1 ? 'Published' : recipe.status === 2 ? 'Archived' : 'Draft')}</span>
                <span className="meta-chip">{t('Danh mục:')} {t(recipe.categoryName || 'Chưa phân loại')}</span>
                <span className="meta-chip">{t('Tác giả:')} {recipe.authorId || 'System'}</span>
                {recipe.cookingTimeMinutes && <span className="meta-chip">⏱ {recipe.cookingTimeMinutes} {t('phút')}</span>}
                <span className="meta-chip">Prep {recipe.prepTimeMinutes}m · Cook {recipe.cookTimeMinutes}m · {recipe.servings} servings</span>
                <span className="meta-chip">{t('Độ khó:')} {t(recipe.difficulty || 'Trung bình')}</span>
                {recipe.isVegetarian && <span className="meta-chip">{t('Món chay')}</span>}
              </div>

              <div className="recipe-detail-section">
                <h3>{t('Mô tả')}</h3>
                <p>{t(recipe.description || 'Chưa có mô tả.')}</p>
              </div>

              <div className="recipe-detail-grid">
                <div className="recipe-detail-section">
                    <h3>{t('Nguyên liệu')}</h3>
                  <ul>
                    {ingredientLines.map((item, index) => (
                      <li key={`${recipe.id}-ingredient-${index}`}>{t(item)}</li>
                    ))}
                  </ul>
                </div>

                <div className="recipe-detail-section">
                    <h3>{t('Các bước làm')}</h3>
                  <ol>
                    {instructionLines.map((item, index) => (
                      <li key={`${recipe.id}-instruction-${index}`}>{t(item)}</li>
                    ))}
                  </ol>
                </div>
              </div>
              {recipe.nutrition && <div className="recipe-detail-section">
                <h3>Nutrition (mỗi khẩu phần)</h3>
                <div className="recipe-meta">
                  {recipe.nutrition.calories != null && <span className="meta-chip">{recipe.nutrition.calories} kcal</span>}
                  {recipe.nutrition.protein != null && <span className="meta-chip">Protein {recipe.nutrition.protein} g</span>}
                  {recipe.nutrition.carbohydrates != null && <span className="meta-chip">Carbohydrates {recipe.nutrition.carbohydrates} g</span>}
                  {recipe.nutrition.fat != null && <span className="meta-chip">Fat {recipe.nutrition.fat} g</span>}
                  {recipe.nutrition.fiber != null && <span className="meta-chip">Fiber {recipe.nutrition.fiber} g</span>}
                  {recipe.nutrition.sodium != null && <span className="meta-chip">Sodium {recipe.nutrition.sodium} mg</span>}
                </div>
              </div>}
              <RecipeProPanel recipe={recipe} />
            </div>
          </div>
          <RecipeEngagement recipe={recipe} />
        </div>
      </div>
    </div></>
  )
}
export function CategoriesPage() {
  const navigate = useNavigate()
  const { t } = useLocale()
  const [categories, setCategories] = useState([])
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', description: '', imageUrl: '' })
  const [editingId, setEditingId] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [selectedCategoryDetail, setSelectedCategoryDetail] = useState(null)
  const [categoryDetailLoading, setCategoryDetailLoading] = useState(false)
  const [canManageCategories, setCanManageCategories] = useState(false)

  const token = getStoredToken() || getSessionUser() || ''

  function closeCategoryDialog() {
    setSelectedCategoryId(null)
    setSelectedCategoryDetail(null)
    setCategoryDetailLoading(false)
  }

  const fetchCatalog = useCallback(async () => {
    setLoading(true)
    try {
      // Administrators manage every lifecycle state, so their category view also
      // includes drafts and archived recipes. Everyone else sees the public
      // cookbook, which contains published recipes only.
      let isAdmin = false
      const activeToken = getStoredToken() || getSessionUser() || ''
      if (activeToken) {
        try {
          const currentUser = await apiRequest('/auth/me')
          isAdmin = currentUser.role === 'Admin'
          setCanManageCategories(isAdmin)
        } catch {
          setCanManageCategories(false)
        }
      } else {
        setCanManageCategories(false)
      }

      const [categoryData, recipeData] = await Promise.all([
        apiRequest('/categories'),
        apiRequest(isAdmin ? '/recipes/mine' : '/recipes'),
      ])
      setCategories(categoryData)
      setRecipes(recipeData)
      setSelectedCategoryId(current => current && categoryData.some(category => category.id === current) ? current : null)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCatalog()

    const refreshCatalog = () => fetchCatalog()
    const refreshWhenWindowIsVisible = () => {
      if (document.visibilityState === 'visible') refreshCatalog()
    }
    const refreshFromAnotherTab = (event) => {
      if (event.key === RECIPE_CATALOG_UPDATED_EVENT) refreshCatalog()
    }

    window.addEventListener(RECIPE_CATALOG_UPDATED_EVENT, refreshCatalog)
    window.addEventListener('storage', refreshFromAnotherTab)
    window.addEventListener('focus', refreshCatalog)
    document.addEventListener('visibilitychange', refreshWhenWindowIsVisible)

    return () => {
      window.removeEventListener(RECIPE_CATALOG_UPDATED_EVENT, refreshCatalog)
      window.removeEventListener('storage', refreshFromAnotherTab)
      window.removeEventListener('focus', refreshCatalog)
      document.removeEventListener('visibilitychange', refreshWhenWindowIsVisible)
    }
  }, [fetchCatalog])

  useEffect(() => {
    if (!selectedCategoryId) return undefined
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = event => {
      if (event.key === 'Escape') closeCategoryDialog()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [selectedCategoryId])

  const resetForm = () => {
    setForm({ name: '', description: '', imageUrl: '' })
    setEditingId(null)
    setIsFormOpen(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.name.trim()) {
      toast.error('Tên danh mục không được để trống.')
      return
    }

    const activeToken = hasSession()
    if (!activeToken) {
      toast.error('Phiên đã hết hạn. Vui lòng đăng nhập lại để lưu thay đổi.')
      navigate('/login')
      return
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl || null,
    }

    try {
      await apiRequest(`/categories${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      })

      toast.success(editingId ? 'Cập nhật danh mục thành công.' : 'Thêm danh mục thành công.')
      resetForm()
      await fetchCatalog()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleEdit = (category) => {
    setEditingId(category.id)
    setForm({
      name: category.name,
      description: category.description || '',
      imageUrl: category.imageUrl || '',
    })
    setIsFormOpen(true)
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      toast.error('Chọn ảnh JPG, PNG, WebP hoặc AVIF không quá 5 MB.')
      event.target.value = ''
      return
    }

    const activeToken = hasSession()
    if (!activeToken) {
      toast.error('Phiên đã hết hạn. Vui lòng đăng nhập lại để tải ảnh.')
      navigate('/login')
      return
    }
    const body = new FormData()
    body.append('file', file)
    setUploadingImage(true)
    try {
      const data = await apiRequest('/community/upload-media', {
        method: 'POST',
        body,
      })
      setForm(current => ({ ...current, imageUrl: data.mediaUrl }))
      toast.success('Đã tải ảnh danh mục lên.')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setUploadingImage(false)
      event.target.value = ''
    }
  }

  const handleLogout = async () => {
    try {
      if (getStoredToken() || getSessionUser()) {
        await apiRequest('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({}),
        })
      }
    } catch {
      // The local session is always cleared; the backend may be unavailable.
    }
    clearSession()
    toast.success('Đăng xuất thành công.')
    navigate('/login')
  }

  const selectedCategory = selectedCategoryDetail?.category || categories.find(category => category.id === selectedCategoryId)
  const selectedCategoryRecipes = selectedCategoryDetail?.recipes || []
  const selectCategory = async (categoryId) => {
    setSelectedCategoryId(categoryId)
    setSelectedCategoryDetail(null)
    setCategoryDetailLoading(true)
    try {
      // CategoryId is the source of truth. The server returns the current
      // recipes for this category, instead of relying on a stale page list.
      setSelectedCategoryDetail(await apiRequest(`/categories/${categoryId}`))
    } catch (error) {
      closeCategoryDialog()
      toast.error(error.message || 'Không thể tải công thức của danh mục.')
    } finally {
      setCategoryDetailLoading(false)
    }
  }

  return (
    <><div className="content-shell categories-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Culinary Blog</p>
          <h1>{t(canManageCategories ? 'Quản lý Danh mục' : 'Khám phá Danh mục')}</h1>
        </div>
        {token ? <button type="button" className="logout-btn" onClick={handleLogout}>{t('Đăng xuất')}</button> : <button type="button" className="logout-btn" onClick={() => navigate('/login')}>{t('Đăng nhập')}</button>}
      </div>

      <section className="category-catalog" aria-label="Danh mục món ăn">
        <div className="category-catalog-heading">
          <div><p className="eyebrow">BẾP NHÀ · PHÂN LOẠI</p><h2>Chọn một khẩu vị</h2><p>Chọn danh mục để xem các công thức cùng nhóm.</p></div>
          {canManageCategories && <button type="button" className="secondary-btn compact-btn" onClick={() => { resetForm(); setIsFormOpen(true) }}>+ Thêm danh mục</button>}
        </div>
        {loading ? <div className="empty-state">Đang tải danh mục...</div> : <div className="category-card-grid">
          {categories.map((category, index) => {
            // The API owns the count so the card remains accurate even when
            // this page only fetched a public subset of recipes.
            const recipeCount = category.publishedRecipeCount ?? recipes.filter(recipe => recipe.categoryId === category.id).length
            const selected = selectedCategoryId === category.id
            return <article className={`category-tile${selected ? ' is-selected' : ''}`} key={category.id}>
              <button type="button" className="category-tile-select" onClick={() => selectCategory(category.id)} aria-pressed={selected} aria-controls="category-recipes-panel">
                <div className="category-tile-image">{category.imageUrl ? <img src={category.imageUrl} alt={category.name} loading="lazy" /> : <span>Ảnh danh mục chưa thêm</span>}</div>
                <div className="category-tile-content"><span className="category-tile-index">{String(index + 1).padStart(2, '0')}</span><span className="category-tile-tag"># {t(category.name)}</span><h3>{t(category.name)}</h3><p>{t(category.description || 'Khám phá công thức trong danh mục này.')}</p><small>{recipeCount ? `${recipeCount} công thức` : 'Xem công thức'} <span aria-hidden="true">↓</span></small></div>
              </button>
              {canManageCategories && <button type="button" className="category-edit-icon" onClick={() => handleEdit(category)} aria-label={`Chỉnh sửa ${category.name}`} title="Chỉnh sửa danh mục">✎</button>}
            </article>
          })}
        </div>}
      </section>

      {selectedCategoryId && selectedCategory && <div className="category-recipes-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) closeCategoryDialog() }}>
        <section className="category-recipes-dialog" id="category-recipes-panel" role="dialog" aria-modal="true" aria-labelledby="category-recipes-title" aria-live="polite">
          <header className="category-recipes-dialog-header"><div><p className="eyebrow"># {t(selectedCategory.name)}</p><h2 id="category-recipes-title">Các món trong danh mục {t(selectedCategory.name)}</h2><span>{selectedCategoryRecipes.length} công thức</span></div><button type="button" className="recipe-modal-close" onClick={closeCategoryDialog} aria-label="Đóng danh sách công thức">×</button></header>
          {categoryDetailLoading ? <p className="empty-state">Đang tải các công thức thuộc danh mục…</p> : selectedCategoryRecipes.length ? <div className="category-recipe-list">{selectedCategoryRecipes.map(recipe => <Link key={recipe.id} to={`/recipes/${recipe.id}`} onClick={closeCategoryDialog}><span>{t(recipe.title)}</span><small>{recipe.cookingTimeMinutes ? `${recipe.cookingTimeMinutes} phút` : 'Mở công thức'} <b aria-hidden="true">→</b></small></Link>)}</div> : <p className="empty-state">Chưa có công thức công khai trong danh mục này.</p>}
          <footer><button type="button" className="category-dialog-dismiss" onClick={closeCategoryDialog}>Đã hiểu, đóng danh sách</button></footer>
        </section>
      </div>}

      {canManageCategories && isFormOpen && <div className="recipe-modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) resetForm() }}>
        <section className="category-form-card category-modal" role="dialog" aria-modal="true" aria-labelledby="category-form-title">
          <header className="recipe-modal-heading"><div><p className="eyebrow">CULINARY BLOG</p><h2 id="category-form-title">{editingId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h2></div><button type="button" className="recipe-modal-close" onClick={resetForm} aria-label="Đóng">×</button></header>
          <form onSubmit={handleSubmit} className="category-form">
            <div className="form-group"><label htmlFor="category-name">Tên danh mục</label><input id="category-name" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} required maxLength={100} /></div>
            <div className="form-group"><label htmlFor="category-description">Mô tả / phân loại</label><textarea id="category-description" rows="3" value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} maxLength={500} /></div>
            <div className="form-group"><label htmlFor="category-image">Ảnh danh mục</label><div className="recipe-image-upload"><input id="category-image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleImageUpload} disabled={uploadingImage} /><small>{uploadingImage ? 'Đang tải ảnh...' : 'JPG, PNG, WebP hoặc AVIF · tối đa 5 MB'}</small></div>{form.imageUrl ? <div className="recipe-image-preview"><img src={form.imageUrl} alt="Xem trước ảnh danh mục" /><button type="button" onClick={() => setForm({ ...form, imageUrl: '' })}>Gỡ ảnh</button></div> : <div className="recipe-image-placeholder">Ảnh danh mục sẽ hiển thị tại đây</div>}</div>
            <div className="form-actions"><button type="submit" className="primary-btn compact-btn" disabled={uploadingImage}>{editingId ? 'Lưu thay đổi' : 'Thêm danh mục'}</button><button type="button" className="secondary-btn compact-btn" onClick={resetForm}>Hủy</button></div>
          </form>
        </section>
      </div>}
    </div></>
  )
}

export function RecipesPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLocale()
  const [recipes, setRecipes] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    categoryId: '',
    ingredients: '',
    instructions: '',
    prepTimeMinutes: 1,
    cookTimeMinutes: 0,
    servings: 2,
    difficulty: 'Medium',
    isVegetarian: false,
    nutrition: { calories: '', protein: '', carbohydrates: '', fat: '', fiber: '', sodium: '' },
  })
  const [maxMinutesFilter, setMaxMinutesFilter] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [vegetarianFilter, setVegetarianFilter] = useState('all')
  const [ingredientSearch, setIngredientSearch] = useState('')
  const [currentUser, setCurrentUser] = useState(null)

  const token = getStoredToken()

  useEffect(() => {
    const categoryFromUrl = new URLSearchParams(location.search).get('category')
    setCategoryFilter(categoryFromUrl || 'all')
  }, [location.search])

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      imageUrl: '',
      categoryId: categories[0]?.id || '',
      ingredients: '',
      instructions: '',
      prepTimeMinutes: 1,
      cookTimeMinutes: 0,
      servings: 2,
      difficulty: 'Medium',
      isVegetarian: false,
      nutrition: { calories: '', protein: '', carbohydrates: '', fat: '', fiber: '', sodium: '' },
    })
    setEditingId(null)
    setIsFormOpen(false)
  }

  const fetchCategories = useCallback(async () => {
    const data = await apiRequest('/categories')
    setCategories(data)
    setForm((current) => (current.categoryId || !data[0])
      ? current
      : { ...current, categoryId: data[0].id })
  }, [])

  const fetchRecipes = useCallback(async () => {
    const activeToken = hasSession()
    if (!activeToken) {
      setCurrentUser(null)
      setRecipes(await apiRequest('/recipes'))
      return
    }

    const user = await apiRequest('/auth/me')
    setCurrentUser(user)
    const ownRecipes = await apiRequest('/recipes/mine')
    if (user.role === 'Admin') {
      setRecipes(ownRecipes)
      return
    }

    // Members see the published community cookbook and any private drafts they
    // own. This prevents a newly registered account from seeing an empty page.
    const publicRecipes = await apiRequest('/recipes')
    const combined = new Map(publicRecipes.map((recipe) => [recipe.id, recipe]))
    ownRecipes.forEach((recipe) => combined.set(recipe.id, recipe))
    setRecipes([...combined.values()])
  }, [])

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchCategories(), fetchRecipes()])
      } catch (error) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [fetchCategories, fetchRecipes])

  const handleSubmit = async (event) => {
    event.preventDefault()

    const activeToken = hasSession()
    if (!activeToken) {
      toast.error('Phiên đã hết hạn. Vui lòng đăng nhập lại để lưu công thức.')
      navigate('/login')
      return
    }

    if (!form.title.trim()) {
      toast.error('Tiêu đề công thức không được để trống.')
      return
    }

    if (!form.categoryId) {
      toast.error('Vui lòng chọn danh mục cho công thức.')
      return
    }

    const ingredientValues = form.ingredients.split(/\n|,/).map((item) => item.trim()).filter(Boolean)
    const stepValues = form.instructions.split(/\n|\./).map((item) => item.trim()).filter(Boolean)
    if (ingredientValues.length < 10) {
      toast.error('Mỗi công thức cần ít nhất 10 nguyên liệu.')
      return
    }
    if (stepValues.length < 5) {
      toast.error('Mỗi công thức cần ít nhất 5 bước làm.')
      return
    }
    const nutritionValues = Object.fromEntries(Object.entries(form.nutrition)
      .map(([key, value]) => [key, value === '' ? null : Number(value)]))
    const hasNutrition = Object.values(form.nutrition).some((value) => value !== '')
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl || null,
      ingredients: ingredientValues,
      instructions: stepValues,
      recipeIngredients: ingredientValues.map((name, index) => ({ name, orderIndex: index + 1 })),
      recipeSteps: stepValues.map((description) => ({ title: null, description })),
      categoryId: form.categoryId,
      prepTimeMinutes: Number(form.prepTimeMinutes),
      cookTimeMinutes: Number(form.cookTimeMinutes),
      servings: Number(form.servings),
      difficulty: form.difficulty,
      isVegetarian: form.isVegetarian,
      nutrition: hasNutrition ? nutritionValues : null,
    }

    try {
      await apiRequest(`/recipes${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      })

      notifyRecipeCatalogUpdated()
      toast.success(editingId ? 'Cập nhật công thức thành công.' : 'Thêm công thức thành công.')
      resetForm()
      await fetchRecipes()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleEdit = (recipe) => {
    const ingredientLines = recipe.recipeIngredients?.length
      ? recipe.recipeIngredients
        .map((item) => [item.quantity, item.unit, item.name].filter(Boolean).join(' '))
        .filter(Boolean)
      : Array.isArray(recipe.ingredients) ? recipe.ingredients : []
    const instructionLines = recipe.recipeSteps?.length
      ? recipe.recipeSteps
        .map((item) => [item.title, item.description].filter(Boolean).join(': '))
        .filter(Boolean)
      : Array.isArray(recipe.instructions) ? recipe.instructions : []

    setEditingId(recipe.id)
    setForm({
      title: recipe.title,
      description: recipe.description || '',
      imageUrl: recipe.imageUrl || '',
      categoryId: recipe.categoryId,
      ingredients: ingredientLines.join('\n'),
      instructions: instructionLines.join('\n'),
      prepTimeMinutes: recipe.prepTimeMinutes ?? 1,
      cookTimeMinutes: recipe.cookTimeMinutes ?? 0,
      servings: recipe.servings ?? 1,
      difficulty: recipe.difficulty || 'Medium',
      isVegetarian: recipe.isVegetarian ?? false,
      nutrition: {
        calories: recipe.nutrition?.calories ?? '',
        protein: recipe.nutrition?.protein ?? '',
        carbohydrates: recipe.nutrition?.carbohydrates ?? '',
        fat: recipe.nutrition?.fat ?? '',
        fiber: recipe.nutrition?.fiber ?? '',
        sodium: recipe.nutrition?.sodium ?? '',
      },
    })
    setIsFormOpen(true)
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) {
      toast.error('Chỉ hỗ trợ ảnh JPG, PNG, WebP hoặc AVIF.')
      event.target.value = ''
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ảnh món ăn tối đa 5 MB.')
      event.target.value = ''
      return
    }

    const activeToken = hasSession()
    if (!activeToken) {
      toast.error('Phiên đã hết hạn. Vui lòng đăng nhập lại để tải ảnh.')
      navigate('/login')
      return
    }
    const body = new FormData()
    body.append('file', file)
    setUploadingImage(true)
    try {
      const data = await apiRequest('/community/upload-media', {
        method: 'POST',
        body,
      })
      setForm(current => ({ ...current, imageUrl: data.mediaUrl }))
      toast.success('Đã tải ảnh món ăn lên.')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setUploadingImage(false)
      event.target.value = ''
    }
  }

  const openCreateForm = () => {
    resetForm()
    setIsFormOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa công thức này?')) {
      return
    }

    try {
      const data = await apiRequest(`/recipes/${id}`, { method: 'DELETE' })

      notifyRecipeCatalogUpdated()
      toast.success(data.message || 'Xóa công thức thành công.')
      setRecipes((current) => current.filter((recipe) => recipe.id !== id))
      if (editingId === id) resetForm()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleTransition = async (id, transition) => {
    const activeToken = hasSession()
    if (!activeToken) {
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
      return
    }
    try {
      await apiRequest(`/recipes/${id}/${transition}`, { method: 'POST' })
      notifyRecipeCatalogUpdated()
      toast.success('Đã cập nhật trạng thái công thức.')
      await fetchRecipes()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleLogout = async () => {
    try {
      if (getStoredToken() || getSessionUser()) {
        await apiRequest('/auth/logout', { method: 'POST', body: JSON.stringify({}) })
      }
    } catch {
      // Clearing the local session remains safe when the API is unreachable.
    }
    clearSession()
    toast.success('Đăng xuất thành công.')
    navigate('/login')
  }

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(search.toLowerCase())
      || t(recipe.title).toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || recipe.categoryId === categoryFilter
    const matchesStatus = statusFilter === 'all' || String(recipe.status) === statusFilter
    const matchesTime = !maxMinutesFilter || (recipe.cookingTimeMinutes && recipe.cookingTimeMinutes <= Number(maxMinutesFilter))
    const matchesDifficulty = difficultyFilter === 'all' || recipe.difficulty === difficultyFilter
    const matchesDiet = vegetarianFilter === 'all' || String(recipe.isVegetarian) === vegetarianFilter
    const matchesIngredient = !ingredientSearch || (recipe.ingredients || []).some(item => item.toLowerCase().includes(ingredientSearch.toLowerCase()) || t(item).toLowerCase().includes(ingredientSearch.toLowerCase()))
    return matchesSearch && matchesCategory && matchesStatus && matchesTime && matchesDifficulty && matchesDiet && matchesIngredient
  })
  const canManageRecipe = (recipe) => currentUser?.role === 'Admin' || currentUser?.id === recipe.authorId

  return (
    <><div className="content-shell recipes-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">{t('Culinary Blog')}</p>
          <h1>{t(currentUser?.role === 'Admin' ? 'Quản lý Công thức' : 'Khám phá Công thức')}</h1>
        </div>
        {token ? (
          <button type="button" className="logout-btn" onClick={handleLogout}>{t('Đăng xuất')}</button>
        ) : (
          <button type="button" className="logout-btn" onClick={() => navigate('/login')}>{t('Đăng nhập')}</button>
        )}
      </div>

      <div className="recipe-layout">
        <div className="table-panel">
          <div className="recipes-toolbar">
            <div className="summary-chip">{filteredRecipes.length} {t('món ăn')}</div>
            {token && <button type="button" className="secondary-btn compact-btn" onClick={openCreateForm}>+ {t('Thêm mới')}</button>}
          </div>

          <div className="filter-row">
            <input
              type="text"
              placeholder={t('Tìm kiếm theo tên công thức')}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="all">{t('Tất cả danh mục')}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{t(category.name)}</option>
              ))}
            </select>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">{t('Tất cả trạng thái')}</option>
              <option value="1">{t('Published')}</option>
              <option value="0">{t('Draft')}</option>
              <option value="2">{t('Archived')}</option>
            </select>
            <input type="number" min="1" placeholder={t('Tối đa (phút)')} value={maxMinutesFilter} onChange={event => setMaxMinutesFilter(event.target.value)} />
            <select value={difficultyFilter} onChange={event => setDifficultyFilter(event.target.value)}>
              <option value="all">{t('Mọi độ khó')}</option>
              <option value="Easy">{t('Easy')}</option>
              <option value="Medium">{t('Medium')}</option>
              <option value="Hard">{t('Hard')}</option>
              <option value="Expert">{t('Expert')}</option>
            </select>
            <select value={vegetarianFilter} onChange={event => setVegetarianFilter(event.target.value)}>
              <option value="all">{t('Mọi chế độ ăn')}</option>
              <option value="true">{t('Món chay')}</option>
              <option value="false">{t('Có thịt/cá')}</option>
            </select>
            <input type="search" placeholder={t('Nguyên liệu có chứa...')} value={ingredientSearch} onChange={event => setIngredientSearch(event.target.value)} />
          </div>

          <div className="recipe-card-list">
            {loading ? <div className="empty-state">{t('Đang tải công thức...')}</div> : filteredRecipes.length === 0 ? <div className="empty-state">{t('Không tìm thấy công thức nào.')}</div> : filteredRecipes.map((recipe, index) => {
              const categoryName = t(categories.find(category => category.id === recipe.categoryId)?.name || 'Chưa có')
              const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : []
              const instructions = Array.isArray(recipe.instructions) ? recipe.instructions : []
              return <article className="recipe-summary-card" key={recipe.id}>
                <div className="recipe-card-index" aria-label={`Số thứ tự ${index + 1}`}>{String(index + 1).padStart(2, '0')}</div>
                <Link to={`/recipes/${recipe.id}`} className="recipe-card-photo" aria-label={`Xem ${t(recipe.title)}`}>
                  {recipe.imageUrl ? <img src={recipe.imageUrl} alt={t(recipe.title)} loading="lazy" /> : <span className="recipe-no-photo">Chưa có ảnh</span>}
                  {recipe.cookingTimeMinutes && <span>◷ {recipe.cookingTimeMinutes} phút</span>}
                </Link>
                <div className="recipe-card-content">
                  <div className="recipe-card-heading">
                    <div>
                      <span className="recipe-category-tag"># {categoryName}</span>
                      <h2><Link to={`/recipes/${recipe.id}`}>{t(recipe.title)}</Link></h2>
                      <p>{t(recipe.description || 'Một công thức ngon đang chờ bạn khám phá.')}</p>
                    </div>
                    {canManageRecipe(recipe) && <button type="button" className="recipe-edit-icon" onClick={() => handleEdit(recipe)} aria-label={`Chỉnh sửa ${t(recipe.title)}`} title="Chỉnh sửa công thức">✎</button>}
                  </div>
                  <div className="recipe-card-meta">
                    <span>◷ {recipe.cookingTimeMinutes ? `${recipe.cookingTimeMinutes} phút` : 'Chưa cập nhật thời gian'}</span>
                    <span>{t(recipe.difficulty || 'Trung bình')}</span>
                    {recipe.isVegetarian && <span>Món chay</span>}
                    {canManageRecipe(recipe) && <span className={`recipe-status-${recipe.status === 1 ? 'published' : recipe.status === 2 ? 'archived' : 'draft'}`}>{recipe.status === 1 ? 'Published' : recipe.status === 2 ? 'Archived' : 'Draft'}</span>}
                  </div>
                  <div className="recipe-card-details">
                    <div><h3>Nguyên liệu</h3><p>{ingredients.slice(0, 4).map(t).join(' · ')}{ingredients.length > 4 ? ` · +${ingredients.length - 4} nguyên liệu` : ''}</p></div>
                    <div><h3>Các bước làm</h3><p>{instructions.slice(0, 2).map(t).join(' · ')}{instructions.length > 2 ? ` · +${instructions.length - 2} bước` : ''}</p></div>
                  </div>
                  <div className="recipe-card-actions">
                    <Link to={`/recipes/${recipe.id}`}>Xem công thức <span aria-hidden="true">→</span></Link>
                    {canManageRecipe(recipe) && recipe.status === 0 && <button type="button" onClick={() => handleTransition(recipe.id, 'publish')}>Publish</button>}
                    {canManageRecipe(recipe) && recipe.status === 1 && <button type="button" onClick={() => handleTransition(recipe.id, 'unpublish')}>Unpublish</button>}
                    {canManageRecipe(recipe) && recipe.status !== 2 && <button type="button" onClick={() => handleTransition(recipe.id, 'archive')}>Archive</button>}
                    {canManageRecipe(recipe) && recipe.status === 2 && <button type="button" onClick={() => handleTransition(recipe.id, 'restore')}>Restore</button>}
                    {canManageRecipe(recipe) && <button type="button" onClick={() => handleDelete(recipe.id)} aria-label={`Xóa ${t(recipe.title)}`}>Xóa</button>}
                  </div>
                </div>
              </article>
            })}
          </div>
        </div>

        {token && isFormOpen && <div className="recipe-modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) resetForm() }}>
          <section className="recipe-form-card recipe-modal" role="dialog" aria-modal="true" aria-labelledby="recipe-form-title">
            <header className="recipe-modal-heading">
              <div><p className="eyebrow">CULINARY BLOG</p><h2 id="recipe-form-title">{editingId ? 'Chỉnh sửa công thức' : 'Thêm công thức mới'}</h2></div>
              <button type="button" className="recipe-modal-close" onClick={resetForm} aria-label="Đóng">×</button>
            </header>
            <form onSubmit={handleSubmit} className="recipe-form">
            <div className="form-group">
              <label htmlFor="recipe-title">Tiêu đề</label>
              <input
                id="recipe-title"
                type="text"
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                placeholder="Ví dụ: Bún chả"
              />
            </div>

            <div className="form-group">
              <label htmlFor="recipe-description">Mô tả</label>
              <textarea
                id="recipe-description"
                rows="3"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="Mô tả ngắn về công thức"
              />
            </div>

            <div className="form-group">
              <label htmlFor="recipe-image">Ảnh món ăn</label>
              <div className="recipe-image-upload">
                <input id="recipe-image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleImageUpload} disabled={uploadingImage} />
                <small>{uploadingImage ? 'Đang tải ảnh...' : 'JPG, PNG, WebP hoặc AVIF · tối đa 5 MB'}</small>
              </div>
              {form.imageUrl ? <div className="recipe-image-preview"><img src={form.imageUrl} alt="Xem trước món ăn" /><button type="button" onClick={() => setForm({ ...form, imageUrl: '' })}>Gỡ ảnh</button></div> : <div className="recipe-image-placeholder">Ảnh món ăn sẽ hiển thị tại đây</div>}
            </div>

            <div className="form-group">
              <label htmlFor="recipe-category">Thuộc danh mục</label>
              <select
                id="recipe-category"
                value={form.categoryId}
                onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group recipe-meta-fields">
              <label htmlFor="recipe-prep-time">Prep time (phút)</label>
              <input id="recipe-prep-time" type="number" min="1" max="1440" required value={form.prepTimeMinutes} onChange={event => setForm({ ...form, prepTimeMinutes: event.target.value })} />
              <label htmlFor="recipe-cook-time">Cook time (phút)</label>
              <input id="recipe-cook-time" type="number" min="0" max="1440" required value={form.cookTimeMinutes} onChange={event => setForm({ ...form, cookTimeMinutes: event.target.value })} />
              <label htmlFor="recipe-servings">Servings</label>
              <input id="recipe-servings" type="number" min="1" max="100" required value={form.servings} onChange={event => setForm({ ...form, servings: event.target.value })} />
              <label htmlFor="recipe-difficulty">Độ khó</label>
              <select id="recipe-difficulty" value={form.difficulty} onChange={event => setForm({ ...form, difficulty: event.target.value })}>
                <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option><option value="Expert">Expert</option>
              </select>
              <label className="recipe-vegetarian-toggle"><input type="checkbox" checked={form.isVegetarian} onChange={event => setForm({ ...form, isVegetarian: event.target.checked })} /> Món chay</label>
            </div>

            <fieldset className="form-group recipe-meta-fields">
              <legend>Nutrition (kcal / g / mg mỗi khẩu phần)</legend>
              {Object.entries({ calories: 'Calories (kcal)', protein: 'Protein (g)', carbohydrates: 'Carbohydrates (g)', fat: 'Fat (g)', fiber: 'Fiber (g)', sodium: 'Sodium (mg)' }).map(([key, label]) => (
                <label key={key} htmlFor={`nutrition-${key}`}>{label}<input id={`nutrition-${key}`} type="number" min="0" step="0.01" value={form.nutrition[key]} onChange={event => setForm(current => ({ ...current, nutrition: { ...current.nutrition, [key]: event.target.value } }))} /></label>
              ))}
            </fieldset>

            <div className="form-group">
              <label htmlFor="recipe-ingredients">Nguyên liệu</label>
              <textarea
                id="recipe-ingredients"
                rows="5"
                value={form.ingredients}
                onChange={(event) => setForm({ ...form, ingredients: event.target.value })}
                placeholder="Mỗi nguyên liệu trên 1 dòng hoặc cách nhau bằng dấu phẩy"
              />
            </div>

            <div className="form-group">
              <label htmlFor="recipe-instructions">Các bước làm</label>
              <textarea
                id="recipe-instructions"
                rows="5"
                value={form.instructions}
                onChange={(event) => setForm({ ...form, instructions: event.target.value })}
                placeholder="Mỗi bước trên 1 dòng"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-btn compact-btn">
                {editingId ? 'Lưu thay đổi' : 'Thêm mới'}
              </button>
              {editingId && (
                <button type="button" className="secondary-btn compact-btn" onClick={resetForm}>
                  Hủy
                </button>
              )}
            </div>
            </form>
          </section>
        </div>}
      </div>
    </div></>
  )
}

export function SiteFooter() {
  return <AppFooter />
}
