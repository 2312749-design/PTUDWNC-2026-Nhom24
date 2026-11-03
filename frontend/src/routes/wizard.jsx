'use client'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from '../navigation-hooks.js'
import { apiRequest, hasSession } from '../api/session.js'
import { uploadRecipeImage, validateRecipeImageFile } from '../api/recipe-images.js'

function CreateRecipeWizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    prepTimeMinutes: 1,
    cookTimeMinutes: 0,
    servings: 2,
    difficulty: 'Medium',
    isVegetarian: false,
    ingredients: [{ name: '', quantity: '', unit: '', notes: '' }],
    steps: [{ title: '', description: '', timerMinutes: '' }],
  })
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [savedDraftId, setSavedDraftId] = useState(null)
  const createdRecipeId = useRef(null)
  const uploadedImage = useRef(null)
  const savingRequest = useRef(false)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await apiRequest('/categories')
        setCategories(data)
        if (data[0]) setForm((current) => current.categoryId ? current : { ...current, categoryId: data[0].id })
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

    if (step === 2) {
      if (form.ingredients.some((item) => !item.name.trim())) {
        toast.error('Tên nguyên liệu không được để trống.')
        return
      }
      if (form.ingredients.length < 10) {
        toast.error('Mỗi công thức cần ít nhất 10 nguyên liệu.')
        return
      }
    }

    if (step === 3) {
      if (form.steps.some((item) => !item.description.trim())) {
        toast.error('Mỗi bước làm cần có mô tả.')
        return
      }
      if (form.steps.length < 5) {
        toast.error('Mỗi công thức cần ít nhất 5 bước làm.')
        return
      }
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
      ingredients: [...current.ingredients, { name: '', quantity: '', unit: '', notes: '' }],
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
      steps: [...current.steps, { title: '', description: '', timerMinutes: '' }],
    }))
  }

  const removeStep = (index) => {
    setForm((current) => ({
      ...current,
      steps: current.steps.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async () => {
    if (savingRequest.current) return
    if (!hasSession()) {
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
      return
    }

    if (form.title.trim().length < 3 || form.title.trim().length > 160 || !form.categoryId) {
      toast.error('Tiêu đề cần từ 3 đến 160 ký tự và phải chọn danh mục.')
      setStep(1)
      return
    }
    if (form.description.trim().length > 2000) {
      toast.error('Mô tả công thức tối đa 2000 ký tự.')
      setStep(1)
      return
    }
    const numericFields = [
      [form.prepTimeMinutes, 1, 1440],
      [form.cookTimeMinutes, 0, 1440],
      [form.servings, 1, 100],
    ]
    if (numericFields.some(([value, min, max]) => String(value).trim() === '' || !Number.isInteger(Number(value)) || Number(value) < min || Number(value) > max)) {
      toast.error('Thời gian chuẩn bị từ 1–1440 phút, thời gian nấu từ 0–1440 phút và khẩu phần từ 1–100 người.')
      setStep(1)
      return
    }
    if (form.ingredients.length < 10 || form.ingredients.some(item => !item.name.trim() || item.name.trim().length > 200 || item.quantity.length > 100 || item.unit.length > 50 || item.notes.length > 500)) {
      toast.error('Cần ít nhất 10 nguyên liệu hợp lệ: tên tối đa 200 ký tự, số lượng 100, đơn vị 50 và ghi chú 500 ký tự.')
      setStep(2)
      return
    }
    if (form.steps.length < 5 || form.steps.some(item => !item.description.trim() || item.description.trim().length > 2000 || item.title.trim().length > 200 || (item.timerMinutes !== '' && (!Number.isInteger(Number(item.timerMinutes)) || Number(item.timerMinutes) < 0 || Number(item.timerMinutes) > 1440)))) {
      toast.error('Cần ít nhất 5 bước hợp lệ: mô tả tối đa 2000 ký tự, tên bước 200 ký tự và hẹn giờ từ 0–1440 phút.')
      setStep(3)
      return
    }
    if (imageFile) {
      try {
        validateRecipeImageFile(imageFile)
      } catch (error) {
        toast.error(error.message)
        setStep(1)
        return
      }
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      categoryId: form.categoryId,
      prepTimeMinutes: Number(form.prepTimeMinutes),
      cookTimeMinutes: Number(form.cookTimeMinutes),
      servings: Number(form.servings),
      difficulty: form.difficulty,
      isVegetarian: form.isVegetarian,
      ingredients: form.ingredients
        .map((item) => {
          const name = item.name.trim()
          const quantity = item.quantity?.trim() || ''
          const unit = item.unit?.trim() || ''
          if (!name) return ''
          const notes = item.notes?.trim() || ''
          return [quantity, unit, name, notes].filter(Boolean).join(' ')
        })
        .filter(Boolean),
      instructions: form.steps
        .map((item) => {
          const title = item.title.trim()
          const description = item.description.trim()
          if (!description) return ''
          return title ? `${title}: ${description}` : description
        })
        .filter(Boolean),
      recipeIngredients: form.ingredients
        .map((item, index) => ({
          name: item.name.trim(),
          quantity: item.quantity?.trim() || null,
          unit: item.unit?.trim() || null,
          notes: item.notes?.trim() || null,
          orderIndex: index + 1,
        }))
        .filter((item) => item.name),
      recipeSteps: form.steps
        .map((item) => ({
          title: item.title.trim(),
          description: item.description.trim(),
          timerMinutes: item.timerMinutes === '' ? null : Number(item.timerMinutes),
        }))
        .filter((item) => item.description),
    }

    savingRequest.current = true
    setSaving(true)
    try {
      if (createdRecipeId.current) {
        await apiRequest(`/recipes/${createdRecipeId.current}`, { method: 'PUT', body: JSON.stringify(payload) })
      } else {
        const created = await apiRequest('/recipes', { method: 'POST', body: JSON.stringify(payload) })
        if (!created?.id) throw new Error('Máy chủ chưa trả về mã công thức. Vui lòng kiểm tra danh sách trước khi thử lại.')
        createdRecipeId.current = created.id
        setSavedDraftId(created.id)
      }
      if (imageFile) {
        if (!uploadedImage.current) uploadedImage.current = await uploadRecipeImage(createdRecipeId.current, imageFile)
        const uploaded = uploadedImage.current
        if (!uploaded?.id || !uploaded?.url) throw new Error('Máy chủ chưa trả về thông tin ảnh hợp lệ.')
        if (uploaded?.id && !uploaded.isPrimary) {
          await apiRequest(`/recipes/${createdRecipeId.current}/images/${uploaded.id}/primary`, { method: 'PUT' })
        }
      }

      try { window.localStorage.setItem('culinary:recipe-catalog-updated', String(Date.now())) } catch { /* Cross-tab notifications are optional when browser storage is unavailable. */ }
      window.dispatchEvent(new Event('culinary:recipe-catalog-updated'))
      toast.success('Tạo công thức thành công!')
      navigate('/recipes')
    } catch (error) {
      toast.error(createdRecipeId.current
        ? `Công thức đã lưu ở bản nháp. ${error.message} Bấm Hoàn tất để thử lại trên bản nháp này.`
        : error.message)
    } finally {
      savingRequest.current = false
      setSaving(false)
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
        {savedDraftId && !saving && <p role="status">Bản nháp đã được lưu. Nếu tải ảnh chưa thành công, bấm Hoàn tất để thử lại; hệ thống sẽ cập nhật bản nháp này.</p>}
        <fieldset disabled={saving} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
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
              <label htmlFor="wizard-recipe-image">Ảnh món ăn (không bắt buộc)</label>
              <input id="wizard-recipe-image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={event => {
                const file = event.target.files?.[0] || null
                try {
                  if (file) validateRecipeImageFile(file)
                setImageFile(file)
                uploadedImage.current = null
                } catch (error) {
                  toast.error(error.message)
                  setImageFile(null)
                  event.target.value = ''
                }
              }} />
              <small>{imageFile ? imageFile.name : 'JPEG, PNG, WebP hoặc AVIF · tối đa 5 MB'}</small>
            </div>

            <div className="form-group">
              <label>Prep time (phút)</label>
              <input type="number" min="1" value={form.prepTimeMinutes} onChange={event => setForm({ ...form, prepTimeMinutes: event.target.value })} />
              <label>Cook time (phút)</label>
              <input type="number" min="0" value={form.cookTimeMinutes} onChange={event => setForm({ ...form, cookTimeMinutes: event.target.value })} />
              <label>Servings</label>
              <input type="number" min="1" value={form.servings} onChange={event => setForm({ ...form, servings: event.target.value })} />
            </div>
            <div className="form-group">
              <label>Độ khó</label>
              <select value={form.difficulty} onChange={event => setForm({ ...form, difficulty: event.target.value })}>
                <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option><option value="Expert">Expert</option>
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
                  <input type="text" placeholder="Ghi chú (không bắt buộc)" value={ingredient.notes} onChange={(event) => updateIngredient(index, 'notes', event.target.value)} />
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
                  <input type="text" placeholder={`Tên bước ${index + 1} (không bắt buộc)`} value={stepItem.title} onChange={(event) => updateStep(index, 'title', event.target.value)} />
                  <textarea
                    rows="3"
                    placeholder="Mô tả từng bước..."
                    value={stepItem.description}
                    onChange={(event) => updateStep(index, 'description', event.target.value)}
                  />
                  <input type="number" min="0" max="1440" placeholder="Thời gian hẹn giờ (phút)" value={stepItem.timerMinutes} onChange={(event) => updateStep(index, 'timerMinutes', event.target.value)} />
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
            <button type="button" className="primary-btn" onClick={handleSubmit} disabled={saving}>{saving ? 'Đang lưu...' : 'Hoàn tất'}</button>
          )}
        </div>
        </fieldset>
      </div>
    </div>
  )
}

export default CreateRecipeWizard
