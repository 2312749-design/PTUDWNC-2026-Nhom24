'use client'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { Link } from '../../navigation.jsx'
import { apiRequest, hasSession } from '../../api/session.js'
import { useAuthStore } from '../../store/auth-store'

const examples = [
  { id: 'example-1', recipe: 'Mì xào rau củ chay', author: 'Lan', text: 'Mì có bị dính nếu để lâu không?', answer: 'Để mì quay lại chảo cùng chút dầu, đảo đều để tránh dính và giữ nhiệt vừa phải.', pinned: true, answeredBy: 'Hương', isExample: true },
  { id: 'example-2', recipe: 'Canh chua cá', author: 'Minh', text: 'Nên cho dứa khi nào để không bị quá chua?', answer: 'Cho dứa sau khi cá vừa chín, giữ lửa vừa để vị chua không mất đi.', pinned: false, answeredBy: 'Bé', isExample: true },
  { id: 'example-3', recipe: 'Gỏi đậu phụ', author: 'An', text: 'Có thể thay đậu phụ bằng đậu hũ chiên không?', answer: 'Có, nhưng nên chiên nhẹ để giữ độ giòn và không quá bám.', pinned: true, answeredBy: 'Chef Bông', isExample: true },
]
const defaultRecipes = ['Mì xào rau củ chay', 'Canh chua cá', 'Gỏi đậu phụ', 'Bún chả giò rau củ']

function realQuestions(data) {
  const items = Array.isArray(data) ? data : data?.items
  if (!Array.isArray(items)) throw new Error('Danh sách hỏi đáp trả về không hợp lệ.')
  return items.filter(item => item && typeof item.id === 'string' && typeof item.recipe === 'string' && typeof item.text === 'string')
}

export default function RecipeQuestions({ Shell }) {
  const hydrated = useAuthStore(state => state.hydrated)
  const user = useAuthStore(state => state.user)
  const [selectedRecipe, setSelectedRecipe] = useState(defaultRecipes[0])
  const [question, setQuestion] = useState('')
  const [questions, setQuestions] = useState(examples)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [reload, setReload] = useState(0)
  const [replies, setReplies] = useState({})
  const [replyingTo, setReplyingTo] = useState(null)
  const pendingQuestion = useRef(false)
  const pendingReply = useRef(false)
  const requestScope = useRef(null)
  const ownerKey = user?.id || 'guest'

  useEffect(() => {
    if (!hydrated) return
    const scope = { active: true }
    requestScope.current = scope
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const items = realQuestions(await apiRequest('/features/questions'))
        if (scope.active) setQuestions([...items, ...examples])
      } catch (failure) {
        if (scope.active) setError(failure.message || 'Chưa tải được câu hỏi từ cộng đồng.')
      } finally {
        if (scope.active) setLoading(false)
      }
    }
    load()
    return () => { scope.active = false }
  }, [hydrated, ownerKey, reload])

  const handleSubmit = async event => {
    event.preventDefault()
    if (pendingQuestion.current || loading || !hydrated) return
    if (!hasSession()) {
      toast.error('Vui lòng đăng nhập để đặt câu hỏi.')
      return
    }
    const text = question.trim()
    if (text.length < 3 || text.length > 2000) {
      toast.error('Câu hỏi cần từ 3 đến 2000 ký tự.')
      return
    }
    const scope = requestScope.current
    pendingQuestion.current = true
    setSaving(true)
    try {
      const saved = await apiRequest('/features/questions', { method: 'POST', body: JSON.stringify({ recipe: selectedRecipe, question: text }) })
      if (!scope?.active) return
      if (saved?.id && saved.text) {
        setQuestions(current => [{ ...saved, recipe: saved.recipe || selectedRecipe }, ...current.filter(item => item.id !== saved.id)])
      } else {
        setReload(value => value + 1)
      }
      setQuestion('')
      toast.success('Câu hỏi đã được gửi để cộng đồng trả lời.')
    } catch (failure) {
      if (scope?.active) toast.error(failure.message || 'Chưa gửi được câu hỏi. Vui lòng thử lại.')
    } finally {
      pendingQuestion.current = false
      setSaving(false)
    }
  }

  const submitReply = async (event, item) => {
    event.preventDefault()
    if (pendingReply.current || item.isExample) return
    if (!hasSession()) {
      toast.error('Vui lòng đăng nhập để trả lời câu hỏi.')
      return
    }
    const content = (replies[item.id] || '').trim()
    if (!content || content.length > 1000) {
      toast.error('Câu trả lời cần từ 1 đến 1000 ký tự.')
      return
    }
    const scope = requestScope.current
    pendingReply.current = true
    setReplyingTo(item.id)
    try {
      const saved = await apiRequest(`/community/posts/${item.id}/comments`, { method: 'POST', body: JSON.stringify({ content }) })
      if (!scope?.active) return
      setQuestions(current => current.map(row => row.id === item.id
        ? { ...row, answers: [...(row.answers || []), { id: saved.id, author: user?.fullName || user?.username || 'Bạn', text: content }] }
        : row))
      setReplies(current => ({ ...current, [item.id]: '' }))
      toast.success('Đã gửi câu trả lời.')
      setReload(value => value + 1)
    } catch (failure) {
      if (scope?.active) toast.error(failure.message || 'Chưa gửi được câu trả lời. Vui lòng thử lại.')
    } finally {
      pendingReply.current = false
      setReplyingTo(null)
    }
  }

  const recipes = [...new Set([...defaultRecipes, ...questions.map(item => item.recipe)])]
  const filtered = questions.filter(item => item.recipe === selectedRecipe)

  return <Shell eyebrow="HỎI ĐÁP THEO CÔNG THỨC" title="Cộng đồng trả lời bạn" intro="Hỏi về nguyên liệu, kỹ thuật nấu, hoặc cách thay thế để cải thiện món ăn của bạn.">
    {!hydrated || loading ? <p role="status">Đang tải câu hỏi...</p> : error && <p role="alert">{error} <button type="button" className="feature-button" onClick={() => setReload(value => value + 1)}>Thử lại</button></p>}
    <div className="feature-columns qna-columns">
      <section className="feature-section">
        <div className="feature-section-heading"><h2>Đặt câu hỏi</h2></div>
        <form className="qna-form" onSubmit={handleSubmit}>
          <label>Chọn công thức<select aria-label="Chọn công thức" value={selectedRecipe} onChange={event => setSelectedRecipe(event.target.value)} disabled={saving}>{recipes.map(recipe => <option key={recipe} value={recipe}>{recipe}</option>)}</select></label>
          <label>Câu hỏi của bạn<textarea required minLength={3} maxLength={2000} value={question} onChange={event => setQuestion(event.target.value)} disabled={saving} placeholder="Ví dụ: Mì nên xào lúc nào để vừa mềm vừa thơm?" /></label>
          <button type="submit" className="feature-button primary" disabled={!hydrated || loading || saving || Boolean(error)}>{saving ? 'Đang gửi...' : 'Gửi câu hỏi'}</button>
          {hydrated && !user && <Link to="/login">Đăng nhập để đặt câu hỏi hoặc trả lời.</Link>}
        </form>
      </section>
      <section className="feature-section">
        <div className="feature-section-heading"><h2>Trả lời hữu ích</h2></div>
        <div className="qna-list">
          {filtered.map(item => <article key={item.id} className={item.pinned ? 'qna-card pinned' : 'qna-card'}>
            <div className="qna-card-top"><strong>{item.author}</strong>{item.pinned && <span>Ghim</span>}</div>
            {item.isExample && <small>Nội dung minh họa</small>}
            <p>{item.text}</p>
            {item.answers?.length ? item.answers.map(answer => <div className="qna-answer" key={answer.id}><small>{answer.author}</small><p>{answer.text}</p></div>) : item.answer ? <div className="qna-answer"><small>{item.answeredBy}</small><p>{item.answer}</p></div> : <p className="qna-waiting">Đang chờ cộng đồng trả lời...</p>}
            {!item.isExample && item.commentsEnabled === false && <p className="qna-waiting">Tác giả đã tắt trả lời cho câu hỏi này.</p>}
            {!item.isExample && item.commentsEnabled !== false && hydrated && user && <form className="qna-form" onSubmit={event => submitReply(event, item)}>
              <label>Trả lời câu hỏi của {item.author}<textarea aria-label={`Trả lời câu hỏi của ${item.author}`} required maxLength={1000} value={replies[item.id] || ''} onChange={event => setReplies(current => ({ ...current, [item.id]: event.target.value }))} disabled={replyingTo !== null || loading} /></label>
              <button type="submit" className="feature-button" disabled={replyingTo !== null || loading}>{replyingTo === item.id ? 'Đang gửi...' : 'Gửi trả lời'}</button>
            </form>}
          </article>)}
          {!loading && filtered.length === 0 && <p className="feature-empty">Chưa có câu hỏi cho công thức này.</p>}
        </div>
      </section>
    </div>
  </Shell>
}
