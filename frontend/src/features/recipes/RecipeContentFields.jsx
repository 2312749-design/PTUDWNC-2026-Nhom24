'use client'

import { emptyIngredient, emptyStep } from './recipe-form.js'
import './recipe-editor.css'

export default function RecipeContentFields({ form, setForm }) {
  const update = (collection, index, field, value) => setForm(current => ({
    ...current, [collection]: current[collection].map((item, i) => i === index ? { ...item, [field]: value } : item),
  }))
  const remove = (collection, index) => setForm(current => ({
    ...current, [collection]: current[collection].filter((_, i) => i !== index),
  }))
  const move = (collection, index, direction) => setForm(current => {
    const items = [...current[collection]]
    const target = index + direction
    if (target < 0 || target >= items.length) return current
    ;[items[index], items[target]] = [items[target], items[index]]
    return { ...current, [collection]: items }
  })

  return <div className="recipe-content-fields">
    <fieldset className="recipe-content-section">
      <legend>Nguyên liệu ({form.ingredients.length})</legend>
      <p className="recipe-editor-hint">Tối thiểu 10 nguyên liệu. Số lượng, đơn vị và ghi chú được lưu riêng.</p>
      {form.ingredients.map((item, index) => <div className="recipe-editor-row" key={index}>
        <strong>Nguyên liệu {index + 1}</strong>
        <div className="recipe-ingredient-inputs">
          <label>Tên nguyên liệu<input aria-label={`Tên nguyên liệu ${index + 1}`} required maxLength={200} value={item.name} onChange={event => update('ingredients', index, 'name', event.target.value)} /></label>
          <label>Số lượng<input aria-label={`Số lượng nguyên liệu ${index + 1}`} maxLength={100} value={item.quantity} onChange={event => update('ingredients', index, 'quantity', event.target.value)} /></label>
          <label>Đơn vị<input aria-label={`Đơn vị nguyên liệu ${index + 1}`} maxLength={50} value={item.unit} onChange={event => update('ingredients', index, 'unit', event.target.value)} /></label>
          <label>Ghi chú<input aria-label={`Ghi chú nguyên liệu ${index + 1}`} maxLength={500} value={item.notes} onChange={event => update('ingredients', index, 'notes', event.target.value)} /></label>
        </div>
        <div className="recipe-editor-row-actions">
          <button type="button" disabled={index === 0} aria-label={`Đưa nguyên liệu ${index + 1} lên`} onClick={() => move('ingredients', index, -1)}>↑</button>
          <button type="button" disabled={index === form.ingredients.length - 1} aria-label={`Đưa nguyên liệu ${index + 1} xuống`} onClick={() => move('ingredients', index, 1)}>↓</button>
          <button type="button" disabled={form.ingredients.length <= 10} aria-label={`Xóa nguyên liệu ${index + 1}`} onClick={() => remove('ingredients', index)}>Xóa</button>
        </div>
      </div>)}
      <button type="button" className="secondary-btn compact-btn" onClick={() => setForm(current => ({ ...current, ingredients: [...current.ingredients, emptyIngredient()] }))}>+ Thêm nguyên liệu</button>
    </fieldset>
    <fieldset className="recipe-content-section">
      <legend>Các bước làm ({form.steps.length})</legend>
      <p className="recipe-editor-hint">Tối thiểu 5 bước. Mỗi ô mô tả là một bước, giữ nguyên dấu chấm và xuống dòng.</p>
      {form.steps.map((item, index) => <div className="recipe-editor-row" key={index}>
        <strong>Bước {index + 1}</strong>
        <label>Tiêu đề bước<input aria-label={`Tiêu đề bước ${index + 1}`} maxLength={200} value={item.title} onChange={event => update('steps', index, 'title', event.target.value)} /></label>
        <label>Mô tả bước<textarea aria-label={`Mô tả bước ${index + 1}`} required maxLength={2000} rows={3} value={item.description} onChange={event => update('steps', index, 'description', event.target.value)} /></label>
        <div className="recipe-step-options">
          <label>Hẹn giờ (phút)<input aria-label={`Thời gian bước ${index + 1}`} type="number" min={0} max={1440} value={item.timerMinutes} onChange={event => update('steps', index, 'timerMinutes', event.target.value)} /></label>
          <label>Ảnh bước (URL)<input aria-label={`Ảnh bước ${index + 1}`} type="url" maxLength={2048} value={item.imageUrl} onChange={event => update('steps', index, 'imageUrl', event.target.value)} /></label>
        </div>
        <div className="recipe-editor-row-actions">
          <button type="button" disabled={index === 0} aria-label={`Đưa bước ${index + 1} lên`} onClick={() => move('steps', index, -1)}>↑</button>
          <button type="button" disabled={index === form.steps.length - 1} aria-label={`Đưa bước ${index + 1} xuống`} onClick={() => move('steps', index, 1)}>↓</button>
          <button type="button" disabled={form.steps.length <= 5} aria-label={`Xóa bước ${index + 1}`} onClick={() => remove('steps', index)}>Xóa</button>
        </div>
      </div>)}
      <button type="button" className="secondary-btn compact-btn" onClick={() => setForm(current => ({ ...current, steps: [...current.steps, emptyStep()] }))}>+ Thêm bước làm</button>
    </fieldset>
  </div>
}
