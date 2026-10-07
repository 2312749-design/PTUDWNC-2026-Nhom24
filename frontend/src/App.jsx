import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import CreateRecipeWizard from './routes/wizard.jsx'
import { AccountPage, ArticlePage, CommunityNav, FeedPage, MemberProfilePage, MembersPage } from './CommunityPages.jsx'
import { AIAssistantPage, AuthorProfilePage, ChallengesPage, CookbookShelfPage, CookModePage, CookTogetherPage, CreatorDashboardPage, DraftsPage, EditorPicksPage, FlexibleRecipePage, FridgeMatchPage, MealPlannerPage, MultilingualPage, NotificationsPage, PrintExportPage, RecipeEngagement, RecipeJournalPage, RecipeQnaPage, SafetyPage, SavedRecipesPage, SeasonalChallengePage, StandardRecipePage, TasteSuggestionPage } from './PlatformFeaturePages.jsx'
import { useLocale } from './LocaleContext.jsx'
import './App.css'

const API_BASE = 'http://localhost:5152/api'

function getStoredToken() {
  const token = localStorage.getItem('accessToken') || ''
  if (!token) return ''

  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    if (!payload.exp || payload.exp * 1000 <= Date.now()) return ''
    return token
  } catch {
    localStorage.removeItem('accessToken')
    return ''
  }
}

async function getFreshAccessToken() {
  const validToken = getStoredToken()
  if (validToken) return validToken

  const refreshToken = localStorage.getItem('refreshToken') || ''
  if (!refreshToken) return ''

  try {
    const response = await fetch(`${API_BASE}/Auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    const data = await safeReadJson(response)
    if (!response.ok || !data.accessToken || !data.refreshToken) throw new Error('Refresh token is no longer valid.')

    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    window.dispatchEvent(new Event('auth-session-refreshed'))
    return data.accessToken
  } catch {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    return ''
  }
}

function ProtectedRoute({ children }) {
  const token = getStoredToken() || localStorage.getItem('refreshToken')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

function generateCaptcha() {
  const a = Math.floor(Math.random() * 9) + 1
  const b = Math.floor(Math.random() * 9) + 1
  return {
    question: `${a} + ${b} = ?`,
    answer: String(a + b),
  }
}

async function readApiResponse(response) {
  const text = await response.text()

  if (!text) {
    return {}
  }

  try {
    return JSON.parse(text)
  } catch {
    const message = text.replace(/\s+/g, ' ').trim().slice(0, 200)
    throw new Error(message || 'Máy chủ trả về dữ liệu không hợp lệ.')
  }
}

async function safeReadJson(response) {
  const text = await response.text()
  if (!text) {
    return {}
  }

  try {
    return JSON.parse(text)
  } catch {
    return { message: text.replace(/\s+/g, ' ').trim().slice(0, 200) || 'Máy chủ trả về dữ liệu không hợp lệ.' }
  }
}

function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [tokenInput, setTokenInput] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.username.trim() || !form.password.trim()) {
      toast.error('Vui lòng nhập tên đăng nhập và mật khẩu.')
      return
    }

    try {
      const response = await fetch(`${API_BASE}/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.username.includes('@') ? form.username : '',
          password: form.password,
        }),
      })

      const data = await readApiResponse(response)

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại.')
      }

      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken || '')
      toast.success(data.message || 'Đăng nhập thành công!')
      navigate('/home')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleGoogleLogin = async () => {
    const idToken = window.prompt('Nhập mã xác thực Google để đăng nhập:')

    if (!idToken || !idToken.trim()) {
      toast.warning('Bạn chưa nhập mã xác thực Google.')
      return
    }

    try {
      const response = await fetch(`${API_BASE}/Auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: idToken.trim() }),
      })

      const data = await readApiResponse(response)

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập bằng Google thất bại.')
      }

      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken || '')
      toast.success(data.message || 'Đăng nhập Google thành công!')
      navigate('/home')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleTokenLogin = () => {
    const token = tokenInput.trim()

    if (!token) {
      toast.error('Vui lòng dán mã JWT.')
      return
    }

    const parts = token.split('.')
    if (parts.length !== 3 || !parts.every(Boolean)) {
      toast.error('Token không hợp lệ.')
      return
    }

    localStorage.setItem('accessToken', token)
    toast.success('Đăng nhập bằng mã truy cập thành công.')
    navigate('/home')
  }

  return (
    <div className="page-shell">
      <div className="auth-card">
        <h1>Đăng nhập</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={form.username}
              onChange={(event) => setForm({ ...form, username: event.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
          </div>
          <button type="submit" className="primary-btn">Đăng nhập</button>
        </form>

        <button className="secondary-btn" type="button" onClick={handleGoogleLogin}>
          Đăng nhập bằng Google
        </button>

        <div className="token-box">
          <h3>Đăng nhập bằng mã truy cập</h3>
          <input
            type="text"
            placeholder="Dán mã JWT"
            value={tokenInput}
            onChange={(event) => setTokenInput(event.target.value)}
          />
          <button className="primary-btn" type="button" onClick={handleTokenLogin}>
            Xác nhận
          </button>
        </div>

        <p className="switch-text">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  )
}

function RegisterPage() {
  const navigate = useNavigate()
  const [captcha, setCaptcha] = useState(generateCaptcha())
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    captchaInput: '',
  })

  const captchaReady = form.captchaInput.trim() === captcha.answer

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha())
    setForm((current) => ({ ...current, captchaInput: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.fullName.trim() || !form.username.trim() || !form.email.trim()) {
      toast.error('Vui lòng nhập họ tên, username và email.')
      return
    }

    if (!form.password || !form.confirmPassword) {
      toast.error('Vui lòng nhập mật khẩu và xác nhận mật khẩu.')
      return
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp.')
      return
    }

    if (!captchaReady) {
      toast.error('Captcha chưa đúng, vui lòng kiểm tra lại.')
      return
    }

    try {
      const response = await fetch(`${API_BASE}/Auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username.trim(),
          email: form.email.trim(),
          fullName: form.fullName.trim(),
          password: form.password,
          confirmPassword: form.confirmPassword,
          captchaQuestion: captcha.question,
          captchaAnswer: form.captchaInput,
        }),
      })

      const data = await readApiResponse(response)

      if (!response.ok) {
        throw new Error(data.message || 'Đăng ký thất bại.')
      }

      toast.success(data.message || 'Đăng ký thành công!')
      setTimeout(() => navigate('/login'), 1000)
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="page-shell">
      <div className="auth-card">
        <h1>Đăng ký</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ và tên</label>
            <input type="text" placeholder="Tên hiển thị của bạn" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Nhập username"
              value={form.username}
              onChange={(event) => setForm({ ...form, username: event.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="ban@email.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Xác nhận Password</label>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={form.confirmPassword}
              onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Captcha</label>
            <div className="captcha-box">
              <strong>{captcha.question}</strong>
            </div>
            <input
              type="text"
              placeholder="Nhập đáp án"
              value={form.captchaInput}
              onChange={(event) => setForm({ ...form, captchaInput: event.target.value })}
            />
            <button type="button" className="tiny-btn" onClick={refreshCaptcha}>
              Làm mới captcha
            </button>
          </div>

          <button type="submit" className="primary-btn" disabled={!captchaReady}>
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  )
}

function RecipeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLocale()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchRecipe = async () => {
    const token = getStoredToken()

    try {
      const response = await fetch(`${API_BASE}/Recipes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await safeReadJson(response)
        throw new Error(errorData.message || 'Không thể tải thông tin món ăn.')
      }

      const data = await safeReadJson(response)
      setRecipe(data)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecipe()
  }, [id])

  useEffect(() => {
    const activeToken = getStoredToken()
    if (activeToken) fetch(`${API_BASE}/Recipes/${id}/view`, { method: 'POST', headers: { Authorization: `Bearer ${activeToken}` } }).catch(() => {})
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa món ăn này?')) {
      return
    }

    const token = getStoredToken()

    try {
      const response = await fetch(`${API_BASE}/Recipes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await safeReadJson(response)
      if (!response.ok) {
        throw new Error(data.message || 'Xóa món ăn thất bại.')
      }

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
    <><CommunityNav /><div className="page-shell">
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
              {getStoredToken() && <>
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
                <span className="status-badge">{t(recipe.status === 1 ? 'Published' : 'Draft')}</span>
                <span className="meta-chip">{t('Danh mục:')} {t(recipe.categoryName || 'Chưa phân loại')}</span>
                <span className="meta-chip">{t('Tác giả:')} {recipe.authorId || 'System'}</span>
                {recipe.cookingTimeMinutes && <span className="meta-chip">⏱ {recipe.cookingTimeMinutes} {t('phút')}</span>}
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
            </div>
          </div>
          <RecipeEngagement recipe={recipe} />
        </div>
      </div>
    </div></>
  )
}

function CategoriesPage() {
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

  const token = getStoredToken() || localStorage.getItem('refreshToken') || ''

  const fetchCatalog = async () => {
    setLoading(true)
    try {
      const [categoryResponse, recipeResponse] = await Promise.all([
        fetch(`${API_BASE}/Categories`),
        fetch(`${API_BASE}/Recipes`),
      ])
      if (!categoryResponse.ok || !recipeResponse.ok) throw new Error('Không thể tải danh mục và công thức.')
      const [categoryData, recipeData] = await Promise.all([categoryResponse.json(), recipeResponse.json()])
      setCategories(categoryData)
      setRecipes(recipeData)
      setSelectedCategoryId(current => current && categoryData.some(category => category.id === current) ? current : null)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCatalog()
  }, [])

  useEffect(() => {
    if (!selectedCategoryId) return undefined
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = event => {
      if (event.key === 'Escape') setSelectedCategoryId(null)
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

    const activeToken = await getFreshAccessToken()
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
      const response = await fetch(`${API_BASE}/Categories${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Thao tác danh mục thất bại.')
      }

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
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      toast.error('Chọn ảnh JPG, PNG hoặc WebP không quá 5 MB.')
      event.target.value = ''
      return
    }

    const activeToken = await getFreshAccessToken()
    if (!activeToken) {
      toast.error('Phiên đã hết hạn. Vui lòng đăng nhập lại để tải ảnh.')
      navigate('/login')
      return
    }
    const body = new FormData()
    body.append('file', file)
    setUploadingImage(true)
    try {
      const response = await fetch(`${API_BASE}/Community/upload-media`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${activeToken}` },
        body,
      })
      const data = await safeReadJson(response)
      if (!response.ok) throw new Error(data.message || 'Tải ảnh danh mục thất bại.')
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
    const refreshToken = localStorage.getItem('refreshToken')
    try {
      if (refreshToken) {
        await fetch(`${API_BASE}/Auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ refreshToken }),
        })
      }
    } catch {
      // The local session is always cleared; the backend may be unavailable.
    }
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    toast.success('Đăng xuất thành công.')
    navigate('/login')
  }

  const selectedCategory = categories.find(category => category.id === selectedCategoryId)
  const selectedCategoryRecipes = selectedCategory
    ? recipes.filter(recipe => recipe.categoryId === selectedCategoryId).sort((first, second) => first.title.localeCompare(second.title, 'vi'))
    : []
  const selectCategory = (categoryId) => {
    setSelectedCategoryId(categoryId)
  }

  return (
    <><CommunityNav /><div className="content-shell categories-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Culinary Blog</p>
          <h1>{t(token ? 'Quản lý Danh mục' : 'Khám phá Danh mục')}</h1>
        </div>
        {token ? <button type="button" className="logout-btn" onClick={handleLogout}>{t('Đăng xuất')}</button> : <button type="button" className="logout-btn" onClick={() => navigate('/login')}>{t('Đăng nhập')}</button>}
      </div>

      <section className="category-catalog" aria-label="Danh mục món ăn">
        <div className="category-catalog-heading">
          <div><p className="eyebrow">BẾP NHÀ · PHÂN LOẠI</p><h2>Chọn một khẩu vị</h2><p>Chọn danh mục để xem các công thức cùng nhóm.</p></div>
          {token && <button type="button" className="secondary-btn compact-btn" onClick={() => { resetForm(); setIsFormOpen(true) }}>+ Thêm danh mục</button>}
        </div>
        {loading ? <div className="empty-state">Đang tải danh mục...</div> : <div className="category-card-grid">
          {categories.map((category, index) => {
            const recipeCount = recipes.filter(recipe => recipe.categoryId === category.id).length
            const selected = selectedCategoryId === category.id
            return <article className={`category-tile${selected ? ' is-selected' : ''}`} key={category.id}>
              <button type="button" className="category-tile-select" onClick={() => selectCategory(category.id)} aria-pressed={selected} aria-controls="category-recipes-panel">
                <div className="category-tile-image">{category.imageUrl ? <img src={category.imageUrl} alt={category.name} loading="lazy" /> : <span>Ảnh danh mục chưa thêm</span>}</div>
                <div className="category-tile-content"><span className="category-tile-index">{String(index + 1).padStart(2, '0')}</span><span className="category-tile-tag"># {t(category.name)}</span><h3>{t(category.name)}</h3><p>{t(category.description || 'Khám phá công thức trong danh mục này.')}</p><small>{recipeCount} công thức <span aria-hidden="true">↓</span></small></div>
              </button>
              {token && <button type="button" className="category-edit-icon" onClick={() => handleEdit(category)} aria-label={`Chỉnh sửa ${category.name}`} title="Chỉnh sửa danh mục">✎</button>}
            </article>
          })}
        </div>}
      </section>

      {selectedCategory && <div className="category-recipes-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setSelectedCategoryId(null) }}>
        <section className="category-recipes-dialog" id="category-recipes-panel" role="dialog" aria-modal="true" aria-labelledby="category-recipes-title" aria-live="polite">
          <header className="category-recipes-dialog-header"><div><p className="eyebrow"># {t(selectedCategory.name)}</p><h2 id="category-recipes-title">Các món trong danh mục {t(selectedCategory.name)}</h2><span>{selectedCategoryRecipes.length} công thức</span></div><button type="button" className="recipe-modal-close" onClick={() => setSelectedCategoryId(null)} aria-label="Đóng danh sách công thức">×</button></header>
          {selectedCategoryRecipes.length ? <div className="category-recipe-list">{selectedCategoryRecipes.map(recipe => <Link key={recipe.id} to={`/recipes/${recipe.id}`}><span>{t(recipe.title)}</span><small>{recipe.cookingTimeMinutes ? `${recipe.cookingTimeMinutes} phút` : 'Mở công thức'} <b aria-hidden="true">→</b></small></Link>)}</div> : <p className="empty-state">Chưa có công thức trong danh mục này.</p>}
          <footer><button type="button" className="category-dialog-dismiss" onClick={() => setSelectedCategoryId(null)}>Đã hiểu, đóng danh sách</button></footer>
        </section>
      </div>}

      {token && isFormOpen && <div className="recipe-modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) resetForm() }}>
        <section className="category-form-card category-modal" role="dialog" aria-modal="true" aria-labelledby="category-form-title">
          <header className="recipe-modal-heading"><div><p className="eyebrow">CULINARY BLOG</p><h2 id="category-form-title">{editingId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h2></div><button type="button" className="recipe-modal-close" onClick={resetForm} aria-label="Đóng">×</button></header>
          <form onSubmit={handleSubmit} className="category-form">
            <div className="form-group"><label htmlFor="category-name">Tên danh mục</label><input id="category-name" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} required maxLength={100} /></div>
            <div className="form-group"><label htmlFor="category-description">Mô tả / phân loại</label><textarea id="category-description" rows="3" value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} maxLength={500} /></div>
            <div className="form-group"><label htmlFor="category-image">Ảnh danh mục</label><div className="recipe-image-upload"><input id="category-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} disabled={uploadingImage} /><small>{uploadingImage ? 'Đang tải ảnh...' : 'JPG, PNG hoặc WebP · tối đa 5 MB'}</small></div>{form.imageUrl ? <div className="recipe-image-preview"><img src={form.imageUrl} alt="Xem trước ảnh danh mục" /><button type="button" onClick={() => setForm({ ...form, imageUrl: '' })}>Gỡ ảnh</button></div> : <div className="recipe-image-placeholder">Ảnh danh mục sẽ hiển thị tại đây</div>}</div>
            <div className="form-actions"><button type="submit" className="primary-btn compact-btn" disabled={uploadingImage}>{editingId ? 'Lưu thay đổi' : 'Thêm danh mục'}</button><button type="button" className="secondary-btn compact-btn" onClick={resetForm}>Hủy</button></div>
          </form>
        </section>
      </div>}
    </div></>
  )
}

function RecipesPage() {
  const navigate = useNavigate()
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
    status: 1,
    cookingTimeMinutes: '',
    difficulty: 'Trung bình',
    isVegetarian: false,
  })
  const [maxMinutesFilter, setMaxMinutesFilter] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [vegetarianFilter, setVegetarianFilter] = useState('all')
  const [ingredientSearch, setIngredientSearch] = useState('')

  const token = getStoredToken() || localStorage.getItem('refreshToken') || ''

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      imageUrl: '',
      categoryId: categories[0]?.id || '',
      ingredients: '',
      instructions: '',
      status: 1,
      cookingTimeMinutes: '',
      difficulty: 'Trung bình',
      isVegetarian: false,
    })
    setEditingId(null)
    setIsFormOpen(false)
  }

  const fetchCategories = async () => {
    const response = await fetch(`${API_BASE}/Categories`, {
    })

    if (!response.ok) {
      throw new Error('Không thể tải danh mục để gắn cho công thức.')
    }

    const data = await response.json()
    setCategories(data)
    if (!form.categoryId && data[0]) {
      setForm((current) => ({ ...current, categoryId: data[0].id }))
    }
  }

  const fetchRecipes = async () => {
    const response = await fetch(`${API_BASE}/Recipes`)

    if (!response.ok) {
      throw new Error('Không thể tải danh sách công thức.')
    }

    const data = await response.json()
    setRecipes(data)
  }

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
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    const activeToken = await getFreshAccessToken()
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

    if (!form.ingredients.trim()) {
      toast.error('Vui lòng nhập ít nhất một nguyên liệu.')
      return
    }

    if (!form.instructions.trim()) {
      toast.error('Vui lòng nhập các bước làm.')
      return
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl || null,
      ingredients: form.ingredients
        .split(/\n|,/) // newline or comma separated
        .map((item) => item.trim())
        .filter(Boolean),
      instructions: form.instructions
        .split(/\n|\./) // step by step
        .map((item) => item.trim())
        .filter(Boolean),
      categoryId: form.categoryId,
      status: Number(form.status),
      cookingTimeMinutes: form.cookingTimeMinutes ? Number(form.cookingTimeMinutes) : null,
      difficulty: form.difficulty,
      isVegetarian: form.isVegetarian,
    }

    try {
      const response = await fetch(`${API_BASE}/Recipes${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await safeReadJson(response)

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
      }

      if (!response.ok) {
        throw new Error(data.message || 'Lưu công thức thất bại.')
      }

      toast.success(editingId ? 'Cập nhật công thức thành công.' : 'Thêm công thức thành công.')
      resetForm()
      await fetchRecipes()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleEdit = (recipe) => {
    setEditingId(recipe.id)
    setForm({
      title: recipe.title,
      description: recipe.description || '',
      imageUrl: recipe.imageUrl || '',
      categoryId: recipe.categoryId,
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.join('\n') : '',
      instructions: Array.isArray(recipe.instructions) ? recipe.instructions.join('\n') : '',
      status: recipe.status ?? 1,
      cookingTimeMinutes: recipe.cookingTimeMinutes ?? '',
      difficulty: recipe.difficulty || 'Trung bình',
      isVegetarian: recipe.isVegetarian ?? false,
    })
    setIsFormOpen(true)
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP.')
      event.target.value = ''
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ảnh món ăn tối đa 5 MB.')
      event.target.value = ''
      return
    }

    const activeToken = await getFreshAccessToken()
    if (!activeToken) {
      toast.error('Phiên đã hết hạn. Vui lòng đăng nhập lại để tải ảnh.')
      navigate('/login')
      return
    }
    const body = new FormData()
    body.append('file', file)
    setUploadingImage(true)
    try {
      const response = await fetch(`${API_BASE}/Community/upload-media`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${activeToken}` },
        body,
      })
      const data = await safeReadJson(response)
      if (!response.ok) throw new Error(data.message || 'Tải ảnh lên thất bại.')
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
      const response = await fetch(`${API_BASE}/Recipes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await safeReadJson(response)

      if (!response.ok) {
        throw new Error(data.message || 'Xóa công thức thất bại.')
      }

      toast.success(data.message || 'Xóa công thức thành công.')
      setRecipes((current) => current.filter((recipe) => recipe.id !== id))
      if (editingId === id) resetForm()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
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

  return (
    <><CommunityNav /><div className="content-shell recipes-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">{t('Culinary Blog')}</p>
          <h1>{t(token ? 'Quản lý Công thức' : 'Khám phá Công thức')}</h1>
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
            </select>
            <input type="number" min="1" placeholder={t('Tối đa (phút)')} value={maxMinutesFilter} onChange={event => setMaxMinutesFilter(event.target.value)} />
            <select value={difficultyFilter} onChange={event => setDifficultyFilter(event.target.value)}>
              <option value="all">{t('Mọi độ khó')}</option>
              <option value="Dễ">{t('Dễ')}</option>
              <option value="Trung bình">{t('Trung bình')}</option>
              <option value="Khó">{t('Khó')}</option>
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
                    {token && <button type="button" className="recipe-edit-icon" onClick={() => handleEdit(recipe)} aria-label={`Chỉnh sửa ${t(recipe.title)}`} title="Chỉnh sửa công thức">✎</button>}
                  </div>
                  <div className="recipe-card-meta">
                    <span>◷ {recipe.cookingTimeMinutes ? `${recipe.cookingTimeMinutes} phút` : 'Chưa cập nhật thời gian'}</span>
                    <span>{t(recipe.difficulty || 'Trung bình')}</span>
                    {recipe.isVegetarian && <span>Món chay</span>}
                    {token && <span className={recipe.status === 1 ? 'recipe-status-published' : 'recipe-status-draft'}>{recipe.status === 1 ? 'Đã đăng' : 'Bản nháp'}</span>}
                  </div>
                  <div className="recipe-card-details">
                    <div><h3>Nguyên liệu</h3><p>{ingredients.slice(0, 4).map(t).join(' · ')}{ingredients.length > 4 ? ` · +${ingredients.length - 4} nguyên liệu` : ''}</p></div>
                    <div><h3>Các bước làm</h3><p>{instructions.slice(0, 2).map(t).join(' · ')}{instructions.length > 2 ? ` · +${instructions.length - 2} bước` : ''}</p></div>
                  </div>
                  <div className="recipe-card-actions">
                    <Link to={`/recipes/${recipe.id}`}>Xem công thức <span aria-hidden="true">→</span></Link>
                    {token && <button type="button" onClick={() => handleDelete(recipe.id)} aria-label={`Xóa ${t(recipe.title)}`}>Xóa</button>}
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
                <input id="recipe-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} disabled={uploadingImage} />
                <small>{uploadingImage ? 'Đang tải ảnh...' : 'JPG, PNG hoặc WebP · tối đa 5 MB'}</small>
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
              <label htmlFor="recipe-time">Thời gian nấu (phút)</label>
              <input id="recipe-time" type="number" min="1" max="1440" value={form.cookingTimeMinutes} onChange={event => setForm({ ...form, cookingTimeMinutes: event.target.value })} placeholder="Ví dụ: 35" />
              <label htmlFor="recipe-difficulty">Độ khó</label>
              <select id="recipe-difficulty" value={form.difficulty} onChange={event => setForm({ ...form, difficulty: event.target.value })}>
                <option value="Dễ">Dễ</option><option value="Trung bình">Trung bình</option><option value="Khó">Khó</option>
              </select>
              <label className="recipe-vegetarian-toggle"><input type="checkbox" checked={form.isVegetarian} onChange={event => setForm({ ...form, isVegetarian: event.target.checked })} /> Món chay</label>
            </div>

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

            <div className="form-group">
              <label htmlFor="recipe-status">Trạng thái</label>
              <select
                id="recipe-status"
                value={form.status}
                onChange={(event) => setForm({ ...form, status: Number(event.target.value) })}
              >
                <option value={0}>Draft</option>
                <option value={1}>Published</option>
              </select>
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

function App() {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/community" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<Navigate to="/community" replace />} />
        <Route path="/community" element={<FeedPage />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/members/:username" element={<MemberProfilePage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/saved" element={<SavedRecipesPage />} />
        <Route path="/cook-mode" element={<CookModePage />} />
        <Route path="/fridge" element={<FridgeMatchPage />} />
        <Route path="/flexible-recipe" element={<FlexibleRecipePage />} />
        <Route path="/journal" element={<RecipeJournalPage />} />
        <Route path="/qna" element={<RecipeQnaPage />} />
        <Route path="/cook-together" element={<CookTogetherPage />} />
        <Route path="/cookbook" element={<CookbookShelfPage />} />
        <Route path="/taste-suggestion" element={<TasteSuggestionPage />} />
        <Route path="/ai-chat" element={<AIAssistantPage />} />
        <Route path="/seasonal-challenge" element={<SeasonalChallengePage />} />
        <Route path="/standard-recipe" element={<StandardRecipePage />} />
        <Route path="/editor-picks" element={<EditorPicksPage />} />
        <Route path="/author-profile" element={<AuthorProfilePage />} />
        <Route path="/multilingual" element={<MultilingualPage />} />
        <Route path="/print-export" element={<PrintExportPage />} />
        <Route path="/planner" element={<MealPlannerPage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        <Route path="/creator" element={<CreatorDashboardPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/safety" element={<SafetyPage />} />
        <Route path="/drafts" element={<DraftsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route
          path="/recipes/new"
          element={
            <ProtectedRoute>
              <CreateRecipeWizard />
            </ProtectedRoute>
          }
        />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
      </Routes>
      {!isAuthPage && <SiteFooter />}
    </>
  )
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__main">
        <section className="site-footer__brand" aria-label="Giới thiệu Culinary Blog">
          <Link className="site-footer__logo" to="/community" aria-label="Culinary Blog - Trang cộng đồng">
            <span className="site-footer__logo-mark">C</span>
            <span>Culinary<span>Blog</span></span>
          </Link>
          <p>Nơi lưu giữ công thức, chia sẻ câu chuyện và tìm cảm hứng cho những bữa ăn mỗi ngày.</p>
          <Link className="site-footer__write-link" to="/recipes/new">Chia sẻ công thức <span aria-hidden="true">→</span></Link>
        </section>

        <nav className="site-footer__links" aria-label="Khám phá">
          <h2>Khám phá</h2>
          <Link to="/community">Cộng đồng</Link>
          <Link to="/recipes">Công thức món ăn</Link>
          <Link to="/categories">Danh mục món ăn</Link>
          <Link to="/challenges">Thử thách nấu ăn</Link>
        </nav>

        <section className="site-footer__social">
          <h2>Kết nối với chúng tôi</h2>
          <p>Theo dõi Culinary Blog để cập nhật món ngon và hoạt động mới.</p>
          <div className="site-footer__social-list">
            <a href="https://www.facebook.com/dducthanh.1" target="_blank" rel="noreferrer" aria-label="Facebook Culinary Blog">
              <span aria-hidden="true">f</span> Facebook
            </a>
            <a href="https://www.instagram.com/joxpiz_/" target="_blank" rel="noreferrer" aria-label="Instagram Culinary Blog">
              <span aria-hidden="true">◎</span> Instagram
            </a>
            <a href="https://www.tiktok.com/@linhcutevcl1909" target="_blank" rel="noreferrer" aria-label="TikTok Culinary Blog">
              <span aria-hidden="true">♪</span> TikTok
            </a>
          </div>
        </section>
      </div>
      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} Culinary Blog. Được làm bằng niềm yêu thích nấu ăn.</span>
        <Link to="/safety">An toàn cộng đồng</Link>
      </div>
    </footer>
  )
}

export default App
