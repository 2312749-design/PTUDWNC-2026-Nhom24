'use client'

import { useEffect, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useNavigate } from '../navigation-hooks.js'
import { apiRequest, hasSession } from '../api/session.js'
import { uploadRecipeImage, validateRecipeImageFile } from '../api/recipe-images.js'
import { recipeWizardSchema, wizardValuesToPayload } from '../features/recipes/recipe-schema.js'

const ingredient = () => ({ name: '', quantity: '', unit: '', notes: '' })
const cookingStep = () => ({ title: '', description: '', timerMinutes: null })
const wizardSteps = [
  { number: 1, label: 'Thông tin món', hint: 'Tên, danh mục và thời gian' },
  { number: 2, label: 'Nguyên liệu', hint: 'Tối thiểu 1 mục' },
  { number: 3, label: 'Cách nấu', hint: 'Tối thiểu 1 bước' },
]

export default function CreateRecipeWizard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [pageStep, setPageStep] = useState(1)
  const [imageFile, setImageFile] = useState(null)
  const [validationNotice, setValidationNotice] = useState('')
  const createdRecipeId = useRef(null)
  const uploadedImage = useRef(null)
  const { register, control, handleSubmit, trigger, setValue, setFocus, watch, formState: { errors } } = useForm({
    resolver: zodResolver(recipeWizardSchema),
    defaultValues: {
      title: '', description: '', categoryId: '', prepTimeMinutes: 1, cookTimeMinutes: 0,
      servings: 2, difficulty: 'Medium', isVegetarian: false,
      ingredients: [ingredient()], steps: [cookingStep()],
    },
  })
  const ingredients = useFieldArray({ control, name: 'ingredients' })
  const steps = useFieldArray({ control, name: 'steps' })
  const categoryId = watch('categoryId')
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: () => apiRequest('/categories') })
  const categories = categoriesQuery.data || []
  useEffect(() => {
    if (categories[0] && !categoryId) setValue('categoryId', categories[0].id)
  }, [categories, categoryId, setValue])

  const saveMutation = useMutation({
    mutationFn: async values => {
      if (!hasSession()) throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
      if (imageFile) validateRecipeImageFile(imageFile)
      const payload = wizardValuesToPayload(values)
      if (createdRecipeId.current) {
        await apiRequest(`/recipes/${createdRecipeId.current}`, { method: 'PUT', body: JSON.stringify(payload) })
      } else {
        const created = await apiRequest('/recipes', { method: 'POST', body: JSON.stringify(payload) })
        if (!created?.id) throw new Error('Máy chủ chưa trả về mã công thức.')
        createdRecipeId.current = created.id
      }
      if (imageFile) {
        if (!uploadedImage.current) uploadedImage.current = await uploadRecipeImage(createdRecipeId.current, imageFile)
        if (!uploadedImage.current?.id) throw new Error('Ảnh chưa được lưu đầy đủ.')
        if (!uploadedImage.current.isPrimary)
          await apiRequest(`/recipes/${createdRecipeId.current}/images/${uploadedImage.current.id}/primary`, { method: 'PUT' })
      }
      return createdRecipeId.current
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['recipes'] })
      toast.success('Tạo công thức thành công!')
      navigate('/dashboard/recipes')
    },
    onError: error => toast.error(createdRecipeId.current
      ? `Bản nháp đã được lưu. ${error.message} Bấm Hoàn tất để thử tiếp trên cùng bản nháp.`
      : error.message),
  })

  const nextStep = async () => {
    const fields = pageStep === 1
      ? ['title', 'description', 'categoryId', 'prepTimeMinutes', 'cookTimeMinutes', 'servings', 'difficulty']
      : pageStep === 2 ? ['ingredients'] : ['steps']
    const valid = await trigger(fields, { shouldFocus: true })
    if (valid) {
      setValidationNotice('')
      setPageStep(current => Math.min(3, current + 1))
      return
    }
    const firstField = pageStep === 1 ? fields.find(field => errors[field]) : null
    if (firstField) setFocus(firstField)
    const message = pageStep === 1
      ? 'Chưa thể tiếp tục. Vui lòng sửa các ô được đánh dấu màu đỏ bên dưới.'
      : pageStep === 2
        ? 'Chưa thể tiếp tục. Bạn cần nhập tên cho tất cả nguyên liệu.'
        : 'Chưa thể hoàn tất. Mỗi bước nấu cần có phần mô tả.'
    setValidationNotice(message)
    toast.error(message)
  }
  const fieldError = value => value?.message ? <small className="field-error" role="alert">{value.message}</small> : null

  return <div className="content-shell">
    <div className="page-header wizard-page-header"><div><p className="eyebrow">CHIA SẺ TỪ CĂN BẾP CỦA BẠN</p><h1>Tạo công thức mới</h1><p>Hoàn thành ba bước bên dưới. Hệ thống sẽ kiểm tra dữ liệu trước khi lưu và bạn có thể tải ảnh món ăn lên MinIO.</p></div></div>
    <form className="wizard-shell" onSubmit={handleSubmit(
      values => { setValidationNotice(''); saveMutation.mutate(values) },
      invalidErrors => {
        const targetStep = invalidErrors.title || invalidErrors.description || invalidErrors.categoryId || invalidErrors.prepTimeMinutes || invalidErrors.cookTimeMinutes || invalidErrors.servings || invalidErrors.difficulty
          ? 1 : invalidErrors.ingredients ? 2 : 3
        setPageStep(targetStep)
        const message = 'Công thức còn thiếu hoặc có thông tin chưa hợp lệ. Vui lòng sửa các ô màu đỏ trước khi hoàn tất.'
        setValidationNotice(message)
        toast.error(message)
      },
    )} noValidate>
      {createdRecipeId.current && <p role="status">Bản nháp đã được lưu; thao tác lại sẽ cập nhật đúng bản nháp này.</p>}
      <fieldset disabled={saveMutation.isPending} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
        <div className="wizard-progress" aria-label="Tiến trình tạo công thức">{wizardSteps.map(step => <div key={step.number} className={`step-pill ${pageStep === step.number ? 'active' : ''} ${pageStep > step.number ? 'complete' : ''}`}><span>{pageStep > step.number ? '✓' : step.number}</span><div><strong>{step.label}</strong><small>{step.hint}</small></div></div>)}</div>
        {pageStep === 1 && <div className="wizard-card">
          <div className="form-group"><label htmlFor="wizard-title">Tiêu đề</label><input id="wizard-title" {...register('title')} placeholder="Ví dụ: Bún chả Hà Nội" />{fieldError(errors.title)}</div>
          <div className="form-group"><label htmlFor="wizard-description">Mô tả</label><textarea id="wizard-description" rows="4" {...register('description')} />{fieldError(errors.description)}</div>
          <div className="form-group"><label htmlFor="wizard-category">Danh mục</label><select id="wizard-category" {...register('categoryId')} disabled={categoriesQuery.isPending}><option value="">-- Chọn danh mục --</option>{categories.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select>{fieldError(errors.categoryId)}{categoriesQuery.error && fieldError({ message: categoriesQuery.error.message })}</div>
          <div className="form-group"><label htmlFor="wizard-image">Ảnh món ăn</label><input id="wizard-image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={event => { const file = event.target.files?.[0] || null; try { if (file) validateRecipeImageFile(file); setImageFile(file); uploadedImage.current = null } catch (error) { toast.error(error.message); setImageFile(null); event.target.value = '' } }} /><small>{imageFile?.name || 'JPEG, PNG, WebP hoặc AVIF · tối đa 5 MB'}</small></div>
          <div className="form-group"><label>Prep time (phút)<input type="number" {...register('prepTimeMinutes', { valueAsNumber: true })} /></label>{fieldError(errors.prepTimeMinutes)}<label>Cook time (phút)<input type="number" {...register('cookTimeMinutes', { valueAsNumber: true })} /></label>{fieldError(errors.cookTimeMinutes)}<label>Servings<input type="number" {...register('servings', { valueAsNumber: true })} /></label>{fieldError(errors.servings)}</div>
          <div className="form-group"><label>Độ khó<select {...register('difficulty')}><option>Easy</option><option>Medium</option><option>Hard</option><option>Expert</option></select></label></div>
          <label className="recipe-vegetarian-toggle"><input type="checkbox" {...register('isVegetarian')} /> Món chay</label>
        </div>}
        {pageStep === 2 && <div className="wizard-card"><p className="recipe-editor-hint">Tối thiểu 1 nguyên liệu; lỗi được hiển thị tại từng dòng.</p><div className="stack-list">{ingredients.fields.map((item, index) => <div key={item.id} className="ingredient-row"><label>Tên<input {...register(`ingredients.${index}.name`)} /></label>{fieldError(errors.ingredients?.[index]?.name)}<label>Số lượng<input {...register(`ingredients.${index}.quantity`)} /></label><label>Đơn vị<input {...register(`ingredients.${index}.unit`)} /></label><label>Ghi chú<input {...register(`ingredients.${index}.notes`)} /></label><button type="button" className="small-btn delete" disabled={ingredients.fields.length <= 1} onClick={() => ingredients.remove(index)}>Xóa</button></div>)}</div>{fieldError(errors.ingredients)}<button type="button" className="secondary-btn" onClick={() => ingredients.append(ingredient())}>+ Thêm nguyên liệu</button></div>}
        {pageStep === 3 && <div className="wizard-card"><p className="recipe-editor-hint">Tối thiểu 1 bước; mỗi bước phải có mô tả.</p><div className="stack-list">{steps.fields.map((item, index) => <div key={item.id} className="step-row"><label>Tiêu đề<input {...register(`steps.${index}.title`)} /></label><label>Mô tả<textarea rows="3" {...register(`steps.${index}.description`)} /></label>{fieldError(errors.steps?.[index]?.description)}<label>Hẹn giờ<input type="number" {...register(`steps.${index}.timerMinutes`, { setValueAs: value => value === '' ? null : Number(value) })} /></label><button type="button" className="small-btn delete" disabled={steps.fields.length <= 1} onClick={() => steps.remove(index)}>Xóa</button></div>)}</div>{fieldError(errors.steps)}<button type="button" className="secondary-btn" onClick={() => steps.append(cookingStep())}>+ Thêm bước làm</button></div>}
        {validationNotice && <div className="wizard-validation-summary" role="alert" aria-live="assertive"><strong>Vui lòng kiểm tra lại</strong><span>{validationNotice}</span></div>}
        <div className="wizard-actions"><button type="button" className="secondary-btn" onClick={() => { setValidationNotice(''); setPageStep(current => Math.max(1, current - 1)) }} disabled={pageStep === 1}>Quay lại</button>{pageStep < 3 ? <button type="button" className="primary-btn" onClick={nextStep}>Tiếp tục</button> : <button type="submit" className="primary-btn" disabled={saveMutation.isPending}>{saveMutation.isPending ? 'Đang lưu...' : 'Hoàn tất'}</button>}</div>
      </fieldset>
    </form>
  </div>
}
