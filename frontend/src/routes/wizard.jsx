import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const API_BASE = 'http://localhost:5152/api'

function CreateRecipeWizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    status: 1,
    cookingTimeMinutes: '',
    difficulty: 'Trung bình',
    isVegetarian: false,
    ingredients: [{ name: '', quantity: '', unit: '', order: 1 }],
    steps: [{ title: '', description: '', order: 1 }],
  })
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      const token = localStorage.getItem('accessToken')
      try {
        const response = await fetch(`${API_BASE}/Categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Không thể tải danh mục.')
        }

        const data = await response.json()
        setCategories(data)
        if (data[0] && !form.categoryId) {
          setForm((current) => ({ ...current, categoryId: data[0].id }))
        }
      } catch (error) {
        toast.error(error.message)
      } finally {
        setLoadingCategories(false)
      }
    }

    loadCategories()
  }, [])

  const nextStep = () => {
    if (step === 1 && (!form.title.trim() || !form.categoryId)) {
      toast.error('Vui lòng nhập tiêu đề và chọn danh mục.')
      return
    }

    if (step === 2 && form.ingredients.some((item) => !item.name.trim())) {
      toast.error('Tên nguyên liệu không được để trống.')
      return
    }

    if (step === 3 && form.steps.some((item) => !item.title.trim() || !item.description.trim())) {
      toast.error('Mỗi bước làm cần có tiêu đề và mô tả.')
      return
    }

    setStep((current) => Math.min(current + 1, 3))
  }

  const prevStep = () => setStep((current) => Math.max(current - 1, 1))

  const updateIngredient = (index, field, value) => {
    setForm((current) => ({
      ...current,
      ingredients: current.ingredients.map((item, i) => i === index ? { ...item, [field]: value } : item),
    }))
  }

  const addIngredient = () => {
    setForm((current) => ({
      ...current,
      ingredients: [...current.ingredients, { name: '', quantity: '', unit: '', order: current.ingredients.length + 1 }],
    }))
  }

  const removeIngredient = (index) => {
    setForm((current) => ({
      ...current,
      ingredients: current.ingredients.filter((_, i) => i !== index),
    }))
  }

  const updateStep = (index, field, value) => {
    setForm((current) => ({
      ...current,
      steps: current.steps.map((item, i) => i === index ? { ...item, [field]: value } : item),
    }))
  }

  const addStep = () => {
    setForm((current) => ({
      ...current,
      steps: [...current.steps, { title: '', description: '', order: current.steps.length + 1 }],
    }))
  }

  const removeStep = (index) => {
    setForm((current) => ({
      ...current,
      steps: current.steps.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
      return
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      categoryId: form.categoryId,
      status: Number(form.status),
      cookingTimeMinutes: form.cookingTimeMinutes ? Number(form.cookingTimeMinutes) : null,
      difficulty: form.difficulty,
      isVegetarian: form.isVegetarian,
      ingredients: form.ingredients
        .map((item) => {
          const name = item.name.trim()
          const quantity = item.quantity?.trim() || ''
          const unit = item.unit?.trim() || ''
          if (!name) return ''
          return [quantity, unit, name].filter(Boolean).join(' ')
        })
        .filter(Boolean),
      instructions: form.steps
        .map((item, index) => {
          const title = item.title.trim()
          const description = item.description.trim()
          if (!title || !description) return ''
          return `${index + 1}. ${title}: ${description}`
        })
        .filter(Boolean),
      recipeIngredients: form.ingredients
        .map((item, index) => ({
          name: item.name.trim(),
          quantity: item.quantity?.trim() || null,
          unit: item.unit?.trim() || null,
          order: index + 1,
        }))
        .filter((item) => item.name),
      recipeSteps: form.steps
        .map((item, index) => ({
          title: item.title.trim(),
          description: item.description.trim(),
          order: index + 1,
        }))
        .filter((item) => item.title && item.description),
    }

    try {
      const response = await fetch(`${API_BASE}/Recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const text = await response.text()
      const data = text ? JSON.parse(text) : {}
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
      }

      if (!response.ok) {
        throw new Error(data.message || 'Tạo công thức thất bại.')
      }

      toast.success('Tạo công thức thành công!')
      navigate('/recipes')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="content-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Bếp Nhà</p>
          <h1>Tạo công thức mới</h1>
        </div>
      </div>

      <div className="wizard-shell">
        <div className="wizard-progress">
          {[1, 2, 3].map((value) => (
            <div key={value} className={`step-pill ${step === value ? 'active' : ''}`}>
              Bước {value}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="wizard-card">
            <div className="form-group">
              <label>Tiêu đề</label>
              <input
                type="text"
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                placeholder="Ví dụ: Bún chả Hà Nội"
              />
            </div>

            <div className="form-group">
              <label>Mô tả</label>
              <textarea
                rows="4"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="Mô tả ngắn gọn về món ăn..."
              />
            </div>

            <div className="form-group">
              <label>Danh mục</label>
              <select
                value={form.categoryId}
                disabled={loadingCategories}
                onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Trạng thái</label>
              <select value={form.status} onChange={(event) => setForm({ ...form, status: Number(event.target.value) })}>
                <option value={0}>Bản nháp</option>
                <option value={1}>Đã đăng</option>
              </select>
            </div>

            <div className="form-group">
              <label>Thời gian nấu (phút)</label>
              <input type="number" min="1" value={form.cookingTimeMinutes} onChange={event => setForm({ ...form, cookingTimeMinutes: event.target.value })} placeholder="Ví dụ: 35" />
            </div>
            <div className="form-group">
              <label>Độ khó</label>
              <select value={form.difficulty} onChange={event => setForm({ ...form, difficulty: event.target.value })}>
                <option value="Dễ">Dễ</option><option value="Trung bình">Trung bình</option><option value="Khó">Khó</option>
              </select>
            </div>
            <label className="recipe-vegetarian-toggle"><input type="checkbox" checked={form.isVegetarian} onChange={event => setForm({ ...form, isVegetarian: event.target.checked })} /> Món chay</label>
          </div>
        )}

        {step === 2 && (
          <div className="wizard-card">
            <div className="stack-list">
              {form.ingredients.map((ingredient, index) => (
                <div key={index} className="ingredient-row">
                  <input
                    type="text"
                    placeholder="Tên nguyên liệu"
                    value={ingredient.name}
                    onChange={(event) => updateIngredient(index, 'name', event.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Số lượng"
                    value={ingredient.quantity}
                    onChange={(event) => updateIngredient(index, 'quantity', event.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Đơn vị"
                    value={ingredient.unit}
                    onChange={(event) => updateIngredient(index, 'unit', event.target.value)}
                  />
                  {form.ingredients.length > 1 && (
                    <button type="button" className="small-btn delete" onClick={() => removeIngredient(index)}>Xóa</button>
                  )}
                </div>
              ))}
            </div>

            <button type="button" className="secondary-btn" onClick={addIngredient}>+ Thêm nguyên liệu</button>
          </div>
        )}

        {step === 3 && (
          <div className="wizard-card">
            <div className="stack-list">
              {form.steps.map((stepItem, index) => (
                <div key={index} className="step-row">
                  <input
                    type="text"
                    placeholder={`Tên bước ${index + 1}`}
                    value={stepItem.title}
                    onChange={(event) => updateStep(index, 'title', event.target.value)}
                  />
                  <textarea
                    rows="3"
                    placeholder="Mô tả từng bước..."
                    value={stepItem.description}
                    onChange={(event) => updateStep(index, 'description', event.target.value)}
                  />
                  {form.steps.length > 1 && (
                    <button type="button" className="small-btn delete" onClick={() => removeStep(index)}>Xóa</button>
                  )}
                </div>
              ))}
            </div>

            <button type="button" className="secondary-btn" onClick={addStep}>+ Thêm bước làm</button>
          </div>
        )}

        <div className="wizard-actions">
          <button type="button" className="secondary-btn" onClick={prevStep} disabled={step === 1}>Quay lại</button>
          {step < 3 ? (
            <button type="button" className="primary-btn" onClick={nextStep}>Tiếp tục</button>
          ) : (
            <button type="button" className="primary-btn" onClick={handleSubmit}>Hoàn tất</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateRecipeWizard
