import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import './App.css'

const API_BASE = 'http://localhost:5152/api'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('accessToken')

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

function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [tokenInput, setTokenInput] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.username.trim() || !form.password.trim()) {
      toast.error('Vui lòng nhập username và password.')
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

      const data = await response.json()

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
    const idToken = window.prompt('Nhập Google ID Token để đăng nhập bằng Google:')

    if (!idToken || !idToken.trim()) {
      toast.warning('Bạn chưa nhập Google ID Token.')
      return
    }

    try {
      const response = await fetch(`${API_BASE}/Auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: idToken.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Google login thất bại.')
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
      toast.error('Vui lòng dán JWT Token.')
      return
    }

    const parts = token.split('.')
    if (parts.length !== 3 || !parts.every(Boolean)) {
      toast.error('Token không hợp lệ.')
      return
    }

    localStorage.setItem('accessToken', token)
    toast.success('Đăng nhập bằng token thành công.')
    navigate('/home')
  }

  return (
    <div className="page-shell">
      <div className="auth-card">
        <h1>Đăng nhập</h1>
        <form onSubmit={handleSubmit}>
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
            <label>Password</label>
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
          <h3>Đăng nhập nhanh bằng Token</h3>
          <input
            type="text"
            placeholder="Dán JWT Token"
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
    username: '',
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

    if (!form.username.trim()) {
      toast.error('Vui lòng nhập username.')
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

    const email = `${form.username.trim().replace(/\s+/g, '').toLowerCase()}@culinaryblog.local`

    try {
      const response = await fetch(`${API_BASE}/Auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username.trim(),
          email,
          password: form.password,
          confirmPassword: form.confirmPassword,
          captchaQuestion: captcha.question,
          captchaAnswer: form.captchaInput,
        }),
      })

      const data = await response.json()

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
            <label>Username</label>
            <input
              type="text"
              placeholder="Nhập username"
              value={form.username}
              onChange={(event) => setForm({ ...form, username: event.target.value })}
            />
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

function HomePage() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    toast.success('Đăng xuất thành công.')
    navigate('/login')
  }

  return (
    <div className="dashboard-shell">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Culinary Blog</p>
          <h1>Dashboard</h1>
        </div>
        <button type="button" className="logout-btn" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>

      <div className="dashboard-grid">
        <Link className="dashboard-card category-card" to="/categories">
          <span className="card-icon">📚</span>
          <h2>Quản lý Danh mục (Categories)</h2>
          <p>Quản lý danh mục món ăn, phân loại và cập nhật nhanh.</p>
        </Link>

        <Link className="dashboard-card recipe-card" to="/recipes">
          <span className="card-icon">🍲</span>
          <h2>Quản lý Công thức (Recipes)</h2>
          <p>Quản lý công thức, nguyên liệu, bước làm và tìm kiếm.</p>
        </Link>
      </div>
    </div>
  )
}

function CategoriesPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', description: 'Món chính' })
  const [editingId, setEditingId] = useState(null)

  const token = localStorage.getItem('accessToken')

  const fetchCategories = async () => {
    if (!token) {
      navigate('/login')
      return
    }

    try {
      const response = await fetch(`${API_BASE}/Categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Không thể tải danh sách danh mục.')
      }

      const data = await response.json()
      setCategories(data)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const resetForm = () => {
    setForm({ name: '', description: 'Món chính' })
    setEditingId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.name.trim()) {
      toast.error('Tên danh mục không được để trống.')
      return
    }

    const payload = {
      name: form.name.trim(),
      description: form.description,
    }

    try {
      const response = await fetch(`${API_BASE}/Categories${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Thao tác danh mục thất bại.')
      }

      toast.success(editingId ? 'Cập nhật danh mục thành công.' : 'Thêm danh mục thành công.')
      resetForm()
      fetchCategories()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleEdit = (category) => {
    setEditingId(category.id)
    setForm({
      name: category.name,
      description: category.description || 'Món chính',
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      return
    }

    try {
      const response = await fetch(`${API_BASE}/Categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Xóa danh mục thất bại.')
      }

      toast.success(data.message || 'Xóa danh mục thành công.')
      setCategories((current) => current.filter((item) => item.id !== id))
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

  return (
    <div className="content-shell categories-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Culinary Blog</p>
          <h1>Quản lý Danh mục</h1>
        </div>
        <button type="button" className="logout-btn" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>

      <div className="category-layout">
        <div className="table-panel">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>ID</th>
                <th>Tên danh mục</th>
                <th>Phân loại</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="empty-state">Đang tải danh mục...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">Chưa có danh mục nào.</td>
                </tr>
              ) : (
                categories.map((category, index) => (
                  <tr key={category.id}>
                    <td>{index + 1}</td>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>{category.description || 'Món chính'}</td>
                    <td>
                      <button type="button" className="small-btn edit" onClick={() => handleEdit(category)}>
                        Sửa
                      </button>
                      <button type="button" className="small-btn delete" onClick={() => handleDelete(category.id)}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="category-form-card">
          <h2>{editingId ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}</h2>
          <form onSubmit={handleSubmit} className="category-form">
            <div className="form-group">
              <label htmlFor="category-name">Tên danh mục</label>
              <input
                id="category-name"
                type="text"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Ví dụ: Món chính"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category-type">Phân loại</label>
              <select
                id="category-type"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              >
                <option value="Món chính">Món chính</option>
                <option value="Khai vị">Khai vị</option>
                <option value="Tráng miệng">Tráng miệng</option>
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
        </div>
      </div>
    </div>
  )
}

function RecipesPage() {
  const navigate = useNavigate()
  const [recipes, setRecipes] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    ingredients: '',
    instructions: '',
    status: 1,
  })

  const token = localStorage.getItem('accessToken')

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      categoryId: categories[0]?.id || '',
      ingredients: '',
      instructions: '',
      status: 1,
    })
    setEditingId(null)
  }

  const fetchCategories = async () => {
    const response = await fetch(`${API_BASE}/Categories`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
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
    const response = await fetch(`${API_BASE}/Recipes`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Không thể tải danh sách công thức.')
    }

    const data = await response.json()
    setRecipes(data)
  }

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

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
    }

    try {
      const response = await fetch(`${API_BASE}/Recipes${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

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
      categoryId: recipe.categoryId,
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.join('\n') : '',
      instructions: Array.isArray(recipe.instructions) ? recipe.instructions.join('\n') : '',
      status: recipe.status ?? 1,
    })
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

      const data = await response.json()

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

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="content-shell recipes-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Culinary Blog</p>
          <h1>Quản lý Công thức</h1>
        </div>
        <button type="button" className="logout-btn" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>

      <div className="recipe-layout">
        <div className="table-panel">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên công thức"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>ID</th>
                <th>Tiêu đề</th>
                <th>Nguyên liệu</th>
                <th>Các bước làm</th>
                <th>Thuộc Danh mục</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="empty-state">Đang tải công thức...</td>
                </tr>
              ) : filteredRecipes.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-state">Không tìm thấy công thức nào.</td>
                </tr>
              ) : (
                filteredRecipes.map((recipe, index) => {
                  const categoryName = categories.find((category) => category.id === recipe.categoryId)?.name || 'Chưa có'

                  return (
                    <tr key={recipe.id}>
                      <td>{index + 1}</td>
                      <td>{recipe.id}</td>
                      <td>{recipe.title}</td>
                      <td>{Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : ''}</td>
                      <td>{Array.isArray(recipe.instructions) ? recipe.instructions.join(' • ') : ''}</td>
                      <td>{categoryName}</td>
                      <td>
                        <button type="button" className="small-btn edit" onClick={() => handleEdit(recipe)}>
                          Sửa
                        </button>
                        <button type="button" className="small-btn delete" onClick={() => handleDelete(recipe.id)}>
                          Xóa
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="recipe-form-card">
          <h2>{editingId ? 'Cập nhật công thức' : 'Thêm công thức mới'}</h2>
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
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <CategoriesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recipes"
        element={
          <ProtectedRoute>
            <RecipesPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
