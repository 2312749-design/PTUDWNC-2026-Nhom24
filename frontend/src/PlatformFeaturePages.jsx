import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useLocale } from './LocaleContext.jsx'
import { CommunityNav } from './CommunityPages.jsx'
import './PlatformFeaturePages.css'

const API = 'http://localhost:5152/api'
const getToken = () => localStorage.getItem('accessToken') || ''
const headers = (json = false) => ({ ...(json ? { 'Content-Type': 'application/json' } : {}), ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}) })

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, { ...options, headers: { ...headers(Boolean(options.body)), ...options.headers } })
  const text = await response.text()
  const data = text ? JSON.parse(text) : {}
  if (!response.ok) throw new Error(data.message || 'Không thể hoàn thành yêu cầu.')
  return data
}

function FeatureShell({ eyebrow, title, intro, children }) {
  const { t } = useLocale()
  return <div className="community-app"><CommunityNav /><main className="community-main feature-page"><header className="feature-heading"><p className="community-kicker">{t(eyebrow)}</p><h1>{t(title)}</h1>{intro && <p>{t(intro)}</p>}</header>{children}</main></div>
}

function formatCountdown(totalSeconds) {
  const safeSeconds = Math.max(0, Number(totalSeconds) || 0)
  const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, '0')
  const seconds = String(safeSeconds % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}

export function FridgeMatchPage() {
  const { settings, t, normalizeInput } = useLocale()
  const [inventory, setInventory] = useState(() => settings.language === 'en'
    ? 'egg, onion, tomato, noodles, MSG, garlic, tofu'
    : 'trứng, hành tây, cà chua, mì, bột ngọt, tỏi, đậu phụ')

  const recipeCatalog = [
    { id: 1, title: 'Mì xào rau củ chay', ingredients: ['mì', 'đậu phụ', 'hành tây', 'tỏi', 'cà chua', 'bột ngọt'], missing: ['ớt chuông', 'nước tương'] },
    { id: 2, title: 'Canh chua cá', ingredients: ['cá', 'dứa', 'hành tây', 'cà chua', 'ngò'], missing: ['đậu bắp', 'giấm'] },
    { id: 3, title: 'Bánh tráng trộn', ingredients: ['bánh tráng', 'trứng', 'hành tây', 'tỏi', 'cà chua'], missing: ['đồ chua', 'mè rang'] },
    { id: 4, title: 'Gỏi đậu phụ', ingredients: ['đậu phụ', 'hành tây', 'tỏi', 'cà chua'], missing: ['rau thơm', 'dưa leo'] },
  ]

  const currentInventory = inventory
    .split(',')
    .map(normalizeInput)
    .filter(Boolean)

  const suggestions = recipeCatalog.map((recipe) => {
    const matched = recipe.ingredients.filter(item => currentInventory.includes(item))
    const missing = recipe.ingredients.filter(item => !currentInventory.includes(item))
    return {
      ...recipe,
      matched,
      missing,
      score: matched.length,
    }
  }).filter(item => item.score > 0).sort((a, b) => b.score - a.score)

  return (
    <FeatureShell eyebrow="TỦ LẠNH CÒN GÌ?" title="Gợi ý món theo nguyên liệu" intro="Nhập những gì bạn đang có trong tủ lạnh hoặc tủ đồ, hệ thống sẽ đề xuất món phù hợp và chỉ ra thứ còn thiếu.">
      <div className="feature-columns fridge-columns">
        <section className="feature-section">
          <div className="feature-section-heading">
            <h2>{t('Nguyên liệu đang có')}</h2>
          </div>

          <textarea
            value={inventory}
            onChange={(event) => setInventory(event.target.value)}
            className="fridge-textarea"
            placeholder={t('Ví dụ: trứng, hành tây, cà chua, mì, bột ngọt, tỏi')}
          />

          <div className="fridge-summary">
            <strong>{currentInventory.length}</strong>
            <span>{t('mặt hàng đang có')}</span>
          </div>
        </section>

        <section className="feature-section">
          <div className="feature-section-heading">
            <h2>{t('Đề xuất món ăn')}</h2>
          </div>

          {suggestions.length ? (
            <div className="fridge-list">
              {suggestions.map((recipe) => (
                <article key={recipe.id} className="fridge-card">
                  <div className="fridge-card-top">
                    <h3>{t(recipe.title)}</h3>
                    <span>{recipe.score}/{recipe.ingredients.length} {t('số nguyên liệu')}</span>
                  </div>
                  <p><strong>{t('Đã có:')}</strong> {recipe.matched.length ? recipe.matched.map(t).join(', ') : t('Không có nguyên liệu nào trùng')}</p>
                  <p><strong>{t('Còn thiếu:')}</strong> {recipe.missing.length ? recipe.missing.map(t).join(', ') : t('Bạn đã có đủ nguyên liệu')}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="feature-empty">{t('Chưa có món nào phù hợp. Hãy thêm ít nguyên liệu vào tủ lạnh để nhận đề xuất.')}</p>
          )}
        </section>
      </div>
    </FeatureShell>
  )
}

export function FlexibleRecipePage() {
  const { t } = useLocale()
  const [servings, setServings] = useState(2)
  const [savedPortion, setSavedPortion] = useState(2)
  const recipe = {
    title: 'Bún chả giò rau củ',
    baseServings: 2,
    ingredients: [
      { name: 'Bún', amount: 200, unit: 'g' },
      { name: 'Giò chả', amount: 150, unit: 'g' },
      { name: 'Rau sống', amount: 80, unit: 'g' },
      { name: 'Nước chấm', amount: 50, unit: 'ml' },
      { name: 'Tỏi', amount: 3, unit: 'cây' },
    ],
  }

  useEffect(() => {
    const stored = Number(localStorage.getItem('recipePortionPreference') || '2')
    if (!Number.isNaN(stored) && stored > 0) {
      setSavedPortion(stored)
      setServings(stored)
    }
  }, [])

  const scaleFactor = servings / recipe.baseServings

  const savePreference = () => {
    localStorage.setItem('recipePortionPreference', String(servings))
    setSavedPortion(servings)
    toast.success(`Đã lưu khẩu phần ${servings} người.`)
  }

  return (
    <FeatureShell eyebrow="CÔNG THỨC LINH HOẠT" title="Tự quy đổi khẩu phần" intro="Tăng giảm khẩu phần và chỉnh lượng nguyên liệu theo tỷ lệ thực tế, rồi lưu lựa chọn riêng cho lần nấu tiếp theo.">
      <section className="feature-section flexible-section">
        <div className="flexible-top">
          <div>
            <p className="community-kicker">{t('Món hiện tại')}</p>
            <h2>{t(recipe.title)}</h2>
          </div>
          <div className="serving-control">
            <button type="button" className="feature-button" onClick={() => setServings((value) => Math.max(1, value - 1))}>−</button>
            <input type="number" min="1" max="20" value={servings} onChange={(event) => setServings(Math.max(1, Number(event.target.value) || 1))} />
            <button type="button" className="feature-button" onClick={() => setServings((value) => Math.min(20, value + 1))}>+</button>
          </div>
        </div>

        <div className="flexible-actions">
          <button type="button" className="feature-button primary" onClick={savePreference}>Lưu khẩu phần</button>
          <span>{t('Đã lưu:')} {savedPortion} {t('người')}</span>
        </div>

        <div className="ingredient-scale-table">
          {recipe.ingredients.map((ingredient) => (
            <div key={ingredient.name} className="ingredient-row">
              <span>{t(ingredient.name)}</span>
              <strong>{(ingredient.amount * scaleFactor).toFixed(ingredient.amount % 1 === 0 ? 0 : 1)} {ingredient.unit}</strong>
            </div>
          ))}
        </div>
      </section>
    </FeatureShell>
  )
}

export function RecipeJournalPage() {
  const initialEntries = [
    { id: 1, title: 'Mì xào rau củ chay', note: 'Thêm 1 thìa nước tương để đậm hơn', spice: 'Tăng chút ớt', cookedAt: '2026-09-28', duration: 22, result: 'Mềm, thơm, rất hợp với bàn ăn gia đình' },
    { id: 2, title: 'Canh chua cá', note: 'Giảm dứa đi một ít vì gia đình không thích chua quá', spice: 'Bớt ớt', cookedAt: '2026-09-25', duration: 35, result: 'Nước canh ngon nhưng cần thêm chút muối.' },
  ]

  const [entries, setEntries] = useState(initialEntries)
  const [form, setForm] = useState({ title: '', note: '', spice: '', cookedAt: new Date().toISOString().slice(0, 10), duration: 30, result: '' })

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.title.trim()) return

    setEntries((current) => [{
      id: Date.now(),
      title: form.title,
      note: form.note,
      spice: form.spice,
      cookedAt: form.cookedAt,
      duration: Number(form.duration) || 0,
      result: form.result,
    }, ...current])

    setForm({ title: '', note: '', spice: '', cookedAt: new Date().toISOString().slice(0, 10), duration: 30, result: '' })
    toast.success('Đã lưu nhật ký nấu ăn.')
  }

  return (
    <FeatureShell eyebrow="NHẬT KÝ NẤU RIÊNG" title="Ghi chép món đã thử" intro="Lưu lại nguyên liệu, thay đổi gia vị, thời gian nấu và cảm nhận thực tế để mỗi lần nấu dần tốt hơn.">
      <div className="feature-columns journal-columns">
        <section className="feature-section">
          <div className="feature-section-heading">
            <h2>Thêm ghi chú nấu</h2>
          </div>

          <form className="journal-form" onSubmit={handleSubmit}>
            <label>
              Tên món
              <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Ví dụ: Bò băm xào rau" />
            </label>
            <label>
              Ghi chú
              <textarea value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder="Bạn đã thay đổi gì?" />
            </label>
            <label>
              Thay đổi gia vị
              <input value={form.spice} onChange={(event) => setForm({ ...form, spice: event.target.value })} placeholder="Ví dụ: bớt cay, thêm tỏi" />
            </label>
            <div className="journal-inline-fields">
              <label>
                Ngày nấu
                <input type="date" value={form.cookedAt} onChange={(event) => setForm({ ...form, cookedAt: event.target.value })} />
              </label>
              <label>
                Thời gian (phút)
                <input type="number" min="1" value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} />
              </label>
            </div>
            <label>
              Kết quả
              <textarea value={form.result} onChange={(event) => setForm({ ...form, result: event.target.value })} placeholder="Món có ngon không, ai thích ăn gì?" />
            </label>
            <button type="submit" className="feature-button primary">Lưu nhật ký</button>
          </form>
        </section>

        <section className="feature-section">
          <div className="feature-section-heading">
            <h2>Lịch sử nấu</h2>
          </div>

          <div className="journal-list">
            {entries.map((entry) => (
              <article key={entry.id} className="journal-entry">
                <div className="journal-entry-header">
                  <strong>{entry.title}</strong>
                  <small>{entry.cookedAt}</small>
                </div>
                <p><span>Ghi chú:</span> {entry.note || 'Không có ghi chú'}</p>
                <p><span>Gia vị:</span> {entry.spice || 'Không đổi'}</p>
                <p><span>Thời gian:</span> {entry.duration} phút</p>
                <p><span>Kết quả:</span> {entry.result || 'Chưa ghi kết quả'}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </FeatureShell>
  )
}

export function RecipeQnaPage() {
  const [selectedRecipe, setSelectedRecipe] = useState('Mì xào rau củ chay')
  const [question, setQuestion] = useState('')
  const [questions, setQuestions] = useState([
    { id: 1, recipe: 'Mì xào rau củ chay', author: 'Lan', text: 'Mì có bị dính nếu để lâu không?', answer: 'Để mì quay lại chảo cùng chút dầu, đảo đều để tránh dính và giữ nhiệt vừa phải.', pinned: true, answeredBy: 'Hương' },
    { id: 2, recipe: 'Canh chua cá', author: 'Minh', text: 'Nên cho dứa khi nào để không bị quá chua?', answer: 'Cho dứa sau khi cá vừa chín, giữ lửa vừa để vị chua không mất đi.', pinned: false, answeredBy: 'Bé' },
    { id: 3, recipe: 'Gỏi đậu phụ', author: 'An', text: 'Có thể thay đậu phụ bằng đậu hũ chiên không?', answer: 'Có, nhưng nên chiên nhẹ để giữ độ giòn và không quá bám.', pinned: true, answeredBy: 'Chef Bông' },
  ])

  const recipes = ['Mì xào rau củ chay', 'Canh chua cá', 'Gỏi đậu phụ', 'Bún chả giò rau củ']
  const filtered = questions.filter((item) => item.recipe === selectedRecipe)

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!question.trim()) return

    setQuestions((current) => [{
      id: Date.now(),
      recipe: selectedRecipe,
      author: 'Bạn',
      text: question,
      answer: '',
      pinned: false,
      answeredBy: '',
    }, ...current])
    setQuestion('')
    toast.success('Câu hỏi đã được gửi để cộng đồng trả lời.')
  }

  return (
    <FeatureShell eyebrow="HỎI ĐÁP THEO CÔNG THỨC" title="Cộng đồng trả lời bạn" intro="Hỏi về nguyên liệu, kỹ thuật nấu, hoặc cách thay thế để cải thiện món ăn của bạn.">
      <div className="feature-columns qna-columns">
        <section className="feature-section">
          <div className="feature-section-heading">
            <h2>Đặt câu hỏi</h2>
          </div>

          <form className="qna-form" onSubmit={handleSubmit}>
            <label>
              Chọn công thức
              <select value={selectedRecipe} onChange={(event) => setSelectedRecipe(event.target.value)}>
                {recipes.map((recipe) => <option key={recipe} value={recipe}>{recipe}</option>)}
              </select>
            </label>
            <label>
              Câu hỏi của bạn
              <textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ví dụ: Mì nên xào lúc nào để vừa mềm vừa thơm?" />
            </label>
            <button type="submit" className="feature-button primary">Gửi câu hỏi</button>
          </form>
        </section>

        <section className="feature-section">
          <div className="feature-section-heading">
            <h2>Trả lời hữu ích</h2>
          </div>

          <div className="qna-list">
            {filtered.map((item) => (
              <article key={item.id} className={item.pinned ? 'qna-card pinned' : 'qna-card'}>
                <div className="qna-card-top">
                  <strong>{item.author}</strong>
                  {item.pinned && <span>Ghim</span>}
                </div>
                <p>{item.text}</p>
                {item.answer ? (
                  <div className="qna-answer">
                    <small>{item.answeredBy}</small>
                    <p>{item.answer}</p>
                  </div>
                ) : (
                  <p className="qna-waiting">Đang chờ cộng đồng trả lời...</p>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </FeatureShell>
  )
}

export function CookTogetherPage() {
  const [sessions, setSessions] = useState([
    { id: 1, title: 'Nấu mì xào kiểu nhà', host: 'Hà', time: '2026-09-30T19:00', duration: 45, slots: 6, joined: 4 },
    { id: 2, title: 'Chảo nóng món chay', host: 'Bé', time: '2026-10-01T18:30', duration: 60, slots: 8, joined: 5 },
  ])
  const [form, setForm] = useState({ title: '', time: '', duration: 45, slots: 6 })

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.title.trim() || !form.time) return

    setSessions((current) => [{
      id: Date.now(),
      title: form.title,
      host: 'Bạn',
      time: form.time,
      duration: Number(form.duration) || 45,
      slots: Number(form.slots) || 6,
      joined: 1,
    }, ...current])

    setForm({ title: '', time: '', duration: 45, slots: 6 })
    toast.success('Buổi nấu chung đã được tạo.')
  }

  return (
    <FeatureShell eyebrow="NẤU CÙNG NHAU TRỰC TUYẾN" title="Tạo buổi nấu chung" intro="Mời bạn bè cùng nấu, theo dõi tiến độ và trò chuyện trong một buổi nấu diễn ra theo lịch.">
      <div className="feature-columns cook-together-columns">
        <section className="feature-section">
          <div className="feature-section-heading">
            <h2>Thiết lập buổi mới</h2>
          </div>

          <form className="cook-together-form" onSubmit={handleSubmit}>
            <label>
              Tên buổi nấu
              <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Ví dụ: Nấu bún chả cuối tuần" />
            </label>
            <label>
              Thời gian bắt đầu
              <input type="datetime-local" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} />
            </label>
            <div className="cook-together-row">
              <label>
                Thời lượng (phút)
                <input type="number" min="15" value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} />
              </label>
              <label>
                Sức chứa
                <input type="number" min="2" value={form.slots} onChange={(event) => setForm({ ...form, slots: event.target.value })} />
              </label>
            </div>
            <button type="submit" className="feature-button primary">Tạo buổi nấu</button>
          </form>
        </section>

        <section className="feature-section">
          <div className="feature-section-heading">
            <h2>Buổi đang diễn ra</h2>
          </div>

          <div className="cook-together-list">
            {sessions.map((session) => (
              <article key={session.id} className="cook-together-card">
                <div className="cook-together-header">
                  <strong>{session.title}</strong>
                  <span>{session.joined}/{session.slots} người</span>
                </div>
                <p>Chủ trì: {session.host}</p>
                <p>{new Date(session.time).toLocaleString('vi-VN')}</p>
                <div className="cook-together-footer">
                  <small>{session.duration} phút</small>
                  <button type="button" className="feature-button">Tham gia</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </FeatureShell>
  )
}

export function CookbookShelfPage() {
  const [collections, setCollections] = useState([
    { id: 1, name: 'Gia đình', owner: 'Bạn', recipes: ['Mì xào rau củ chay', 'Canh chua cá', 'Bánh tráng trộn'], shared: true },
    { id: 2, name: 'Món chay nhanh', owner: 'Hương', recipes: ['Gỏi đậu phụ', 'Nộm hoa chuối', 'Bún chả giò rau củ'], shared: true },
    { id: 3, name: 'Công thức lớp học', owner: 'Bé', recipes: ['Bánh bột khoai', 'Canh bí đỏ'], shared: false },
  ])
  const [name, setName] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState('Mì xào rau củ chay')

  const addCollection = (event) => {
    event.preventDefault()
    if (!name.trim()) return

    setCollections((current) => [{
      id: Date.now(),
      name: name.trim(),
      owner: 'Bạn',
      recipes: [selectedRecipe],
      shared: true,
    }, ...current])

    setName('')
    toast.success('Bộ sưu tập đã được tạo.')
  }

  return (
    <FeatureShell eyebrow="SỔ TAY CÔNG THỨC CHUNG" title="Bộ sưu tập riêng & chia sẻ" intro="Tạo và chia sẻ tuyển tập món ăn với gia đình, bạn bè hoặc nhóm nấu cùng nhau.">
      <div className="feature-columns cookbook-columns">
        <section className="feature-section">
          <div className="feature-section-heading">
            <h2>Tạo bộ sưu tập</h2>
          </div>

          <form className="cookbook-form" onSubmit={addCollection}>
            <label>
              Tên bộ sưu tập
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ví dụ: Món ăn cuối tuần" />
            </label>
            <label>
              Thêm món đầu tiên
              <select value={selectedRecipe} onChange={(event) => setSelectedRecipe(event.target.value)}>
                <option value="Mì xào rau củ chay">Mì xào rau củ chay</option>
                <option value="Canh chua cá">Canh chua cá</option>
                <option value="Bún chả giò rau củ">Bún chả giò rau củ</option>
                <option value="Gỏi đậu phụ">Gỏi đậu phụ</option>
              </select>
            </label>
            <button type="submit" className="feature-button primary">Tạo sổ tay</button>
          </form>
        </section>

        <section className="feature-section">
          <div className="feature-section-heading">
            <h2>Danh sách bộ sưu tập</h2>
          </div>

          <div className="cookbook-list">
            {collections.map((collection) => (
              <article key={collection.id} className="cookbook-card">
                <div className="cookbook-card-top">
                  <strong>{collection.name}</strong>
                  <span>{collection.shared ? 'Chia sẻ' : 'Riêng tư'}</span>
                </div>
                <small>Người tạo: {collection.owner}</small>
                <ul>
                  {collection.recipes.map((recipe) => <li key={`${collection.id}-${recipe}`}>{recipe}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </div>
    </FeatureShell>
  )
}

export function TasteSuggestionPage() {
  const [preferences, setPreferences] = useState({ vegetarian: false, spicy: false, quick: false, budget: false, allergy: 'Không' })

  const suggestions = [
    { title: 'Mì xào rau củ chay', tags: ['món chay', 'nhanh', 'tiết kiệm'], score: 100 },
    { title: 'Gỏi đậu phụ', tags: ['món chay', 'mát', 'nhanh'], score: 92 },
    { title: 'Canh chua cá', tags: ['cay nhẹ', 'gia đình'], score: 85 },
    { title: 'Bún chả giò rau củ', tags: ['đồ ăn nhanh', 'dễ làm'], score: 80 },
  ].filter((recipe) => {
    if (preferences.vegetarian && !recipe.tags.includes('món chay')) return false
    if (preferences.spicy && !recipe.tags.some((tag) => tag.includes('cay'))) return false
    if (preferences.quick && !recipe.tags.includes('nhanh')) return false
    if (preferences.budget && !recipe.tags.includes('tiết kiệm')) return false
    if (preferences.allergy !== 'Không' && recipe.title.toLowerCase().includes('cá') && preferences.allergy === 'Cá') return false
    return true
  })

  return (
    <FeatureShell eyebrow="GỢI Ý THEO KHẨU VỊ" title="Bảng tin cá nhân hóa" intro="Chọn chế độ ăn, mức độ cay, độ nhanh, chi phí và yếu tố hạn chế để nhận món phù hợp với bạn.">
      <div className="feature-columns taste-columns">
        <section className="feature-section">
          <div className="feature-section-heading">
            <h2>Ưu tiên của bạn</h2>
          </div>

          <div className="taste-options">
            <label><input type="checkbox" checked={preferences.vegetarian} onChange={(event) => setPreferences({ ...preferences, vegetarian: event.target.checked })} /> Món chay</label>
            <label><input type="checkbox" checked={preferences.spicy} onChange={(event) => setPreferences({ ...preferences, spicy: event.target.checked })} /> Cay</label>
            <label><input type="checkbox" checked={preferences.quick} onChange={(event) => setPreferences({ ...preferences, quick: event.target.checked })} /> Nhanh</label>
            <label><input type="checkbox" checked={preferences.budget} onChange={(event) => setPreferences({ ...preferences, budget: event.target.checked })} /> Tiết kiệm</label>
          </div>

          <label className="taste-select">
            Dị ứng / hạn chế
            <select value={preferences.allergy} onChange={(event) => setPreferences({ ...preferences, allergy: event.target.value })}>
              <option>Không</option>
              <option>Đậu phụ</option>
              <option>Cá</option>
              <option>Đậu nành</option>
            </select>
          </label>
        </section>

        <section className="feature-section">
          <div className="feature-section-heading">
            <h2>Gợi ý phù hợp</h2>
          </div>

          <div className="taste-list">
            {suggestions.length ? suggestions.map((recipe) => (
              <article key={recipe.title} className="taste-card">
                <div className="taste-card-top">
                  <strong>{recipe.title}</strong>
                  <span>{recipe.score}% phù hợp</span>
                </div>
                <p>{recipe.tags.join(' • ')}</p>
              </article>
            )) : <p className="feature-empty">Không có món phù hợp với bộ lọc hiện tại. Hãy thử đổi tiêu chí khác.</p>}
          </div>
        </section>
      </div>
    </FeatureShell>
  )
}

export function SeasonalChallengePage() {
  const challenges = [
    { id: 1, season: 'Mùa thu', title: 'Bữa tối ấm áp', description: 'Chia sẻ món ăn có hương vị ấm áp, dễ nấu và phù hợp cho những ngày se lạnh.', progress: 72, status: 'Đã đăng ký' },
    { id: 2, season: 'Mùa hè', title: 'Món mát yêu thích', description: 'Góp phần xây dựng thực đơn mát lạnh, thanh nhẹ và dễ uống cho ngày nắng.', progress: 48, status: 'Đang thử' },
    { id: 3, season: 'Mùa đông', title: 'Bữa ăn giữ ấm', description: 'Tạo món ăn đậm đà, nhiều dinh dưỡng và giúp cả nhà quây quần bên bếp.', progress: 34, status: 'Chưa bắt đầu' },
  ]

  const [selected, setSelected] = useState('Mùa thu')
  const selectedChallenge = challenges.find((challenge) => challenge.season === selected) || challenges[0]

  return (
    <FeatureShell eyebrow="THỬ THÁCH THEO MÙA" title="Bếp theo mùa, ăn theo thời tiết" intro="Tham gia thử thách theo mùa để thử món mới, lưu lại thành tích và khích lệ cộng đồng sáng tạo.">
      <div className="feature-columns seasonal-columns">
        <section className="feature-section">
          <div className="feature-section-heading">
            <h2>Thử thách hiện có</h2>
          </div>

          <div className="challenge-list">
            {challenges.map((challenge) => (
              <button key={challenge.id} type="button" className={selectedChallenge.id === challenge.id ? 'challenge-selector active' : 'challenge-selector'} onClick={() => setSelected(challenge.season)}>
                <strong>{challenge.title}</strong>
                <span>{challenge.season}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="feature-section">
          <div className="feature-section-heading">
            <h2>{selectedChallenge.title}</h2>
            <span>{selectedChallenge.status}</span>
          </div>

          <div className="challenge-detail">
            <p>{selectedChallenge.description}</p>
            <div className="challenge-progress-row">
              <strong>{selectedChallenge.progress}%</strong>
              <span>đã hoàn thành</span>
            </div>
            <div className="challenge-meter">
              <span style={{ width: `${selectedChallenge.progress}%` }} />
            </div>
            <div className="challenge-badges">
              <span>🏆 Cộng đồng</span>
              <span>🍲 Dinh dưỡng</span>
              <span>🌿 Tươi mới</span>
            </div>
          </div>
        </section>
      </div>
    </FeatureShell>
  )
}

export function StandardRecipePage() {
  const { t } = useLocale()
  const recipe = {
    title: 'Canh chua cá',
    summary: 'Món canh chua thanh ngọt, giàu hương vị và chuẩn bị nhanh cho bữa cơm gia đình.',
    prep: 20,
    cook: 25,
    difficulty: 'Trung bình',
    servings: 4,
    tools: ['Nồi', 'Dao', 'Thớt', 'Muôi'],
    allergens: ['Cá', 'Hạt tiêu'],
    substitutions: ['Thay cá bằng tôm', 'Dùng dứa tươi hoặc dứa đóng hộp'],
    nutrition: ['Protein: 24g', 'Vitamin C: 16%', 'Calorie: 285 kcal / khẩu phần'],
    ingredients: [
      '500g cá basa',
      '200g dứa',
      '1 trái cà chua',
      '1 củ hành tây',
      '2 nhánh ngò',
      '1 lít nước',
      '1 muỗng canh giấm',
    ],
  }

  return (
    <FeatureShell eyebrow="TRANG CÔNG THỨC CHUẨN QUỐC TẾ" title="Recipe standard layout" intro="Giao diện chuẩn cho một công thức chuyên nghiệp với thời gian, khẩu phần, nguyên liệu, độ khó, thay thế và thông tin dinh dưỡng.">
      <div className="feature-columns standard-columns">
        <section className="feature-section">
          <div className="feature-section-heading">
            <h2>{t(recipe.title)}</h2>
            <span>{t(recipe.difficulty)}</span>
          </div>

          <div className="standard-summary">
            <p>{t(recipe.summary)}</p>
            <div className="attribute-grid">
              <div><small>{t('Chuẩn bị')}</small><strong>{recipe.prep} {t('phút')}</strong></div>
              <div><small>{t('Nấu')}</small><strong>{recipe.cook} {t('phút')}</strong></div>
              <div><small>{t('Khẩu phần')}</small><strong>{recipe.servings} {t('người')}</strong></div>
              <div><small>{t('Độ khó')}</small><strong>{t(recipe.difficulty)}</strong></div>
            </div>
          </div>
        </section>

        <section className="feature-section">
          <div className="feature-section-heading">
            <h2>{t('Thông tin nhanh')}</h2>
          </div>

          <ul className="attribute-list">
            <li><span>{t('Dụng cụ')}</span><strong>{recipe.tools.map(t).join(' • ')}</strong></li>
            <li><span>{t('Nguyên liệu')}</span><strong>{recipe.ingredients.map(t).join(' • ')}</strong></li>
            <li><span>{t('Dị ứng')}</span><strong>{recipe.allergens.map(t).join(' • ')}</strong></li>
            <li><span>{t('Thay thế')}</span><strong>{recipe.substitutions.map(t).join(' • ')}</strong></li>
            <li><span>{t('Dinh dưỡng')}</span><strong>{recipe.nutrition.map(t).join(' • ')}</strong></li>
          </ul>
        </section>
      </div>
    </FeatureShell>
  )
}

export function EditorPicksPage() {
  const features = [
    { id: 1, title: 'Bí quyết nấu canh chua đúng vị', author: 'Chef Hương', type: 'Hướng dẫn', description: 'Cách điều chỉnh độ chua, độ ngọt và thời gian nấu để canh chua luôn giữ hương vị tự nhiên.' },
    { id: 2, title: '7 món ăn từ nguyên liệu còn lại trong tủ lạnh', author: 'Biên tập Bếp Nhà', type: 'Tự làm', description: 'Một bản tổng hợp nhanh để biến những nguyên liệu còn sót thành bữa ăn ngon và tiết kiệm.' },
    { id: 3, title: 'Mẹo sắp xếp bữa ăn theo mùa', author: 'Lê Mai', type: 'Chuyên đề', description: 'Phối hợp thực đơn theo mùa, dựa trên giá cả và khẩu vị của cả gia đình.' },
  ]

  return (
    <FeatureShell eyebrow="BIÊN TẬP NỔI BẬT" title="Khám phá món ăn được chọn lọc" intro="Những bài viết, mẹo nấu và chuyên đề được biên tập để khơi gợi cảm hứng mỗi ngày.">
      <div className="editor-grid">
        {features.map((item) => (
          <article key={item.id} className="editor-card">
            <small>{item.type}</small>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <span>By {item.author}</span>
          </article>
        ))}
      </div>
    </FeatureShell>
  )
}

export function AuthorProfilePage() {
  const author = {
    name: 'Hương Nhi',
    role: 'Tác giả ẩm thực',
    bio: 'Yêu thích sáng tạo món ăn đơn giản, lành mạnh và có hương vị đậm chất gia đình.',
    stats: [
      { label: 'Công thức', value: '148' },
      { label: 'Người theo dõi', value: '31.2K' },
      { label: 'Mùa gặt', value: '14' },
    ],
    recipes: ['Mì xào rau củ chay', 'Canh chua cá', 'Gỏi đậu phụ', 'Bánh tráng trộn'],
  }

  return (
    <FeatureShell eyebrow="HỒ SƠ TÁC GIẢ" title="Trang cá nhân chuyên nghiệp" intro="Trình bày hồ sơ tác giả, dòng thời gian công thức, thành tích và các món nổi bật đã chia sẻ.">
      <section className="feature-section author-shell">
        <div className="author-header">
          <div className="author-badge">HN</div>
          <div>
            <p className="community-kicker">TÁC GIẢ CHUYÊN NGHIỆP</p>
            <h2>{author.name}</h2>
            <small>{author.role}</small>
          </div>
        </div>

        <p className="author-bio">{author.bio}</p>

        <div className="author-stats">
          {author.stats.map((stat) => (
            <div key={stat.label} className="author-stat">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="recipe-tag-list">
          {author.recipes.map((recipe) => <span key={recipe}>{recipe}</span>)}
        </div>
      </section>
    </FeatureShell>
  )
}

export function MultilingualPage() {
  const { settings, applySettings, t } = useLocale()
  const [draftSettings, setDraftSettings] = useState(settings)
  useEffect(() => setDraftSettings(settings), [settings])
  const hasUnsavedChanges = draftSettings.language !== settings.language
    || draftSettings.unit !== settings.unit
    || draftSettings.region !== settings.region

  const saveSettings = () => {
    applySettings(draftSettings)
    toast.success(t('Cài đặt ngôn ngữ, đơn vị và khu vực đã được lưu.'))
  }

  const details = {
    vi: { label: 'Tiếng Việt', message: 'Mẹo nấu: bếp của bạn đang ở chế độ tiếng Việt với định dạng Việt Nam.' },
    en: { label: 'English', message: 'Cooking tips: your kitchen is in English with US-friendly measurement presets.' },
    fr: { label: 'Français', message: 'Conseils de cuisine : l’application est en français, avec des unités et formats pratiques.' },
  }

  return (
    <FeatureShell eyebrow="ĐA NGÔN NGỮ" title="Tùy chỉnh ngôn ngữ & định dạng" intro="Chuyển đổi ngôn ngữ, đơn vị đo lường và định dạng khu vực để phù hợp với người dùng và món ăn.">
      <div className="feature-columns multilingual-columns">
        <section className="feature-section">
          <div className="feature-section-heading">
            <h2>{t('Cài đặt hiển thị')}</h2>
          </div>

          <div className="language-form">
            <label>
              {t('Ngôn ngữ')}
              <select value={draftSettings.language} onChange={(event) => setDraftSettings((current) => ({ ...current, language: event.target.value }))}>
                <option value="vi">{t('Tiếng Việt')}</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </label>
            <label>
              {t('Đơn vị nguyên liệu')}
              <select value={draftSettings.unit} onChange={(event) => setDraftSettings((current) => ({ ...current, unit: event.target.value }))}>
                <option value="g">{t('Gram / ml')}</option>
                <option value="oz">{t('Ounce / tbsp')}</option>
                <option value="cup">{t('Cup / cup')}</option>
              </select>
            </label>
            <label>
              {t('Khu vực')}
              <select value={draftSettings.region} onChange={(event) => setDraftSettings((current) => ({ ...current, region: event.target.value }))}>
                <option value="VN">{t('Việt Nam')}</option>
                <option value="US">{t('Hoa Kỳ')}</option>
                <option value="EU">{t('Châu Âu')}</option>
              </select>
            </label>
          </div>

          <div className="language-form-actions">
            <button type="button" className="feature-button primary" onClick={saveSettings} disabled={!hasUnsavedChanges}>
              {t('Lưu cài đặt')}
            </button>
          </div>
        </section>

        <section className="feature-section">
          <div className="feature-section-heading">
            <h2>{t('Xem trước')}</h2>
          </div>

          <div className="language-preview">
            <span>{t(details[settings.language]?.label || 'Tiếng Việt')}</span>
            <strong>{details[settings.language]?.message}</strong>
            <small>{t('Đơn vị:')} {settings.unit} • {t('Khu vực')}: {t(settings.region === 'VN' ? 'Việt Nam' : settings.region === 'US' ? 'Hoa Kỳ' : 'Châu Âu')}</small>
          </div>
        </section>
      </div>
    </FeatureShell>
  )
}

export function PrintExportPage() {
  const recipeSummary = {
    title: 'Sổ tay gia đình',
    items: ['Mì xào rau củ chay', 'Canh chua cá', 'Gỏi đậu phụ', 'Bánh tráng trộn'],
    notes: ['Chia sẻ với gia đình', 'In chuẩn A4', 'Xuất PDF để lưu giữ'],
  }

  const handlePrint = () => window.print()

  return (
    <FeatureShell eyebrow="BẢN IN & XUẤT SỔ TAY" title="In ấn hoặc lưu dạng sổ tay" intro="Xuất nội dung công thức thành bảng in đẹp, dễ đọc và sẵn sàng lưu vào sổ tay gia đình.">
      <section className="feature-section print-shell">
        <div className="print-actions">
          <button type="button" className="feature-button primary" onClick={handlePrint}>In / Xuất PDF</button>
        </div>

        <div className="print-sheet">
          <header>
            <p className="community-kicker">BẾP NHÀ</p>
            <h2>{recipeSummary.title}</h2>
          </header>

          <ul>
            {recipeSummary.items.map((item) => <li key={item}>{item}</li>)}
          </ul>

          <div className="print-notes">
            {recipeSummary.notes.map((note) => <span key={note}>{note}</span>)}
          </div>
        </div>
      </section>
    </FeatureShell>
  )
}

export function AIAssistantPage() {
  const [activeProvider, setActiveProvider] = useState('openai')
  const [openAiApiKey, setOpenAiApiKey] = useState(() => localStorage.getItem('openAiApiKey') || '')
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('geminiApiKey') || '')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: 'Xin chào! Tôi có thể giúp bạn lên thực đơn, giải thích công thức, kiểm tra nguyên liệu, tối ưu món theo khẩu vị, hoặc trả lời bất cứ câu hỏi nấu ăn nào.',
    },
  ])

  const saveApiKey = () => {
    const apiKey = activeProvider === 'openai' ? openAiApiKey : geminiApiKey
    const trimmed = apiKey.trim()
    if (!trimmed) {
      toast.info(`Vui lòng nhập API key ${activeProvider === 'openai' ? 'OpenAI' : 'Gemini'} trước.`)
      return
    }

    const storageKey = activeProvider === 'openai' ? 'openAiApiKey' : 'geminiApiKey'
    localStorage.setItem(storageKey, trimmed)
    toast.success(`API key ${activeProvider === 'openai' ? 'OpenAI' : 'Gemini'} đã được lưu trên thiết bị này.`)
  }

  const clearApiKey = () => {
    const storageKey = activeProvider === 'openai' ? 'openAiApiKey' : 'geminiApiKey'
    localStorage.removeItem(storageKey)
    if (activeProvider === 'openai') {
      setOpenAiApiKey('')
    } else {
      setGeminiApiKey('')
    }
    toast.info(`API key ${activeProvider === 'openai' ? 'OpenAI' : 'Gemini'} đã được xóa khỏi thiết bị này.`)
  }

  const sendMessage = async (event) => {
    event.preventDefault()

    const trimmed = input.trim()
    if (!trimmed) return

    const storageKey = activeProvider === 'openai' ? 'openAiApiKey' : 'geminiApiKey'
    const enteredKey = activeProvider === 'openai' ? openAiApiKey : geminiApiKey
    const key = (localStorage.getItem(storageKey) || enteredKey.trim()).trim()
    const providerName = activeProvider === 'openai' ? 'OpenAI' : 'Gemini'
    if (!key) {
      toast.error(`Vui lòng nhập API key ${providerName} trước khi gửi câu hỏi.`)
      return
    }

    const userMessage = { id: Date.now(), role: 'user', text: trimmed }
    const conversation = [...messages, userMessage].map((message) => ({
      role: message.role,
      content: message.text,
    }))
    setMessages((current) => [...current, userMessage])
    setInput('')
    setLoading(true)

    try {
      let answer = ''
      if (activeProvider === 'openai') {
        const response = await fetch(`${API}/openai/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(50000),
          body: JSON.stringify({ apiKey: key, messages: conversation }),
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data?.message || 'OpenAI trả về lỗi. Kiểm tra API key và billing.')
        }
        answer = data.answer
      } else {
        const modelCandidates = ['gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3.5-flash', 'gemini-3.1-flash-lite']
        const geminiContents = conversation
          .filter((message, index) => index > 0 || message.role !== 'assistant')
          .map((message) => ({
            role: message.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: message.content }],
          }))
        let lastError = ''

        for (const model of modelCandidates) {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(30000),
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: 'You are the Bep Nha assistant. Help with cooking, recipes, ingredients, meal planning, and general questions. Answer clearly in the user\'s language.' }] },
              contents: geminiContents,
            }),
          })

          const data = await response.json()
          if (!response.ok) {
            const message = data?.error?.message || 'Gemini trả về lỗi.'
            const normalizedMessage = message.toLowerCase()
            const canTryNextModel = [429, 500, 502, 503, 504].includes(response.status)
              || ['not available', 'no longer available', 'not found', 'unsupported', 'high demand', 'overload', 'try again later', 'rate limit'].some((phrase) => normalizedMessage.includes(phrase))
            if (canTryNextModel) {
              lastError = message
              continue
            }
            throw new Error(message)
          }

          answer = data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join('').trim() || ''
          if (answer) break
        }

        if (!answer) {
          throw new Error(lastError || 'Gemini không trả về nội dung. Kiểm tra key hoặc thử lại sau.')
        }
      }

      setMessages((current) => [...current, { id: Date.now() + 1, role: 'assistant', text: answer }])
    } catch (error) {
      const errorMessage = error?.name === 'TimeoutError' || error?.name === 'AbortError'
        ? `${providerName} không phản hồi trong thời gian chờ. Kiểm tra mạng rồi thử lại.`
        : error.message
      setMessages((current) => [...current, {
        id: Date.now() + 2,
        role: 'assistant',
        text: `Lỗi ${providerName}: ${errorMessage}`,
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <FeatureShell eyebrow="CHAT VỚI AI" title="Trợ lý nấu ăn thông minh" intro="Hỏi mọi thứ về món ăn, thực đơn, nguyên liệu, khẩu vị, thời gian nấu, hay cách tối ưu hóa bữa ăn của bạn.">
      <div className="feature-columns ai-chat-columns">
        <section className="feature-section ai-key-panel">
          <div className="feature-section-heading">
            <h2>Kết nối AI</h2>
          </div>

          <div className="ai-provider-switch" role="tablist" aria-label="Chọn nhà cung cấp AI">
            <button
              type="button"
              role="tab"
              aria-selected={activeProvider === 'openai'}
              className={`ai-provider-tab${activeProvider === 'openai' ? ' active' : ''}`}
              onClick={() => setActiveProvider('openai')}
            >OpenAI</button>
            <button
              type="button"
              role="tab"
              aria-selected={activeProvider === 'gemini'}
              className={`ai-provider-tab${activeProvider === 'gemini' ? ' active' : ''}`}
              onClick={() => setActiveProvider('gemini')}
            >Gemini</button>
          </div>

          <label className="ai-key-row">
            {activeProvider === 'openai' ? 'OpenAI API key' : 'Gemini API key'}
            <input
              type="password"
              value={activeProvider === 'openai' ? openAiApiKey : geminiApiKey}
              onChange={(event) => activeProvider === 'openai' ? setOpenAiApiKey(event.target.value) : setGeminiApiKey(event.target.value)}
              placeholder={activeProvider === 'openai' ? 'Dán API key từ platform.openai.com' : 'Dán API key Gemini từ Google AI Studio'}
            />
          </label>

          <div className="ai-key-actions">
            <button type="button" className="feature-button primary" onClick={saveApiKey}>Lưu key</button>
            <button type="button" className="feature-button" onClick={clearApiKey}>Xóa key</button>
          </div>

          <p className="ai-key-tip">Key của mỗi nhà cung cấp được lưu riêng trên trình duyệt này. OpenAI gọi qua backend local; Gemini gọi trực tiếp từ trình duyệt. Không dùng cấu hình này cho website công khai.</p>
        </section>

        <section className="feature-section ai-chat-panel">
          <div className="feature-section-heading">
            <h2>Phòng chat AI</h2>
          </div>

          <div className="ai-chat-window">
            {messages.map((message) => (
              <div key={message.id} className={message.role === 'user' ? 'ai-message user' : 'ai-message assistant'}>
                <div className="ai-bubble">
                  {message.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="ai-message assistant">
                <div className="ai-bubble typing">AI đang suy nghĩ...</div>
              </div>
            )}
          </div>

          <form className="ai-chat-form" onSubmit={sendMessage}>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows="4"
              placeholder="Ví dụ: Cho tôi 3 món ăn chay cho bữa tối trong 20 phút, dựa trên nguyên liệu có sẵn trong tủ lạnh..."
            />
            <button type="submit" className="feature-button primary" disabled={loading}>
              {loading ? 'Đang gửi...' : 'Gửi câu hỏi'}
            </button>
          </form>
        </section>
      </div>
    </FeatureShell>
  )
}

export function CookModePage() {
  const { settings, t } = useLocale()
  const [scale, setScale] = useState(1)
  const [currentStep, setCurrentStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [screenLockActive, setScreenLockActive] = useState(false)
  const wakeLockRef = useRef(null)

  const recipe = {
    title: 'Mì xào rau củ chay',
    servings: 2,
    ingredients: [
      { name: 'Mì hạt sen', amount: '200', unit: 'g' },
      { name: 'Đậu phụ', amount: '150', unit: 'g' },
      { name: 'Đậu que', amount: '100', unit: 'g' },
      { name: 'Ớt chuông', amount: '1', unit: 'quả' },
      { name: 'Tỏi', amount: '3', unit: 'cây' },
      { name: 'Nước tương', amount: '20', unit: 'ml' },
    ],
    steps: [
      { title: 'Chuẩn bị nguyên liệu', duration: 180, text: 'Rửa sạch rau, cắt đậu phụ thành miếng vừa ăn và thái nhỏ hành tỏi, ớt chuông.' },
      { title: 'Đun nóng chảo', duration: 120, text: 'Cho 1 muỗng dầu vào chảo, đun ở lửa vừa đến khi dầu bắt đầu sủi nhẹ.' },
      { title: 'Xào rau củ', duration: 180, text: 'Cho tỏi, ớt và rau vào chảo, xào khoảng 2 phút cho mềm và thơm.' },
      { title: 'Thêm mì và đậu phụ', duration: 240, text: 'Cho mì và đậu phụ vào, đảo đều, thêm nước tương và tiếp tục xào cho các nguyên liệu thấm đều.' },
      { title: 'Hoàn thiện', duration: 60, text: 'Nếm lại và điều chỉnh gia vị. Món sẵn sàng cho bữa ăn.' },
    ],
  }

  const currentStepData = recipe.steps[currentStep] || recipe.steps[0]
  const [secondsLeft, setSecondsLeft] = useState(currentStepData.duration)

  useEffect(() => {
    setSecondsLeft(currentStepData.duration)
    setIsRunning(false)
  }, [currentStep, currentStepData.duration])

  useEffect(() => {
    if (!isRunning) return undefined

    const timer = window.setInterval(() => {
      setSecondsLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer)
          setIsRunning(false)
          if ('speechSynthesis' in window) {
            const announcement = new SpeechSynthesisUtterance(`${t('Bước')} ${currentStep + 1}. ${t(recipe.steps[currentStep]?.title || 'Tiếp tục')}.`)
            announcement.lang = settings.language === 'en' ? 'en-US' : settings.language === 'fr' ? 'fr-FR' : 'vi-VN'
            window.speechSynthesis.cancel()
            window.speechSynthesis.speak(announcement)
          }
          return 0
        }
        return previous - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [currentStep, isRunning, recipe.steps, settings.language, t])

  useEffect(() => {
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {})
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const speakCurrentStep = () => {
    if (!('speechSynthesis' in window)) {
      toast.info('Trình duyệt của bạn chưa hỗ trợ đọc to hướng dẫn.')
      return
    }

    const utterance = new SpeechSynthesisUtterance(`${t('Bước')} ${currentStep + 1}. ${t(currentStepData.title)}. ${t(currentStepData.text)}`)
    utterance.lang = settings.language === 'en' ? 'en-US' : settings.language === 'fr' ? 'fr-FR' : 'vi-VN'
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

  const requestWakeLock = async () => {
    if (!('wakeLock' in navigator)) {
      toast.info('Thiết bị này không hỗ trợ giữ màn hình sáng.')
      return
    }

    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen')
      setScreenLockActive(true)
    } catch {
      toast.info('Không giữ được màn hình sáng ở chế độ này.')
    }
  }

  const releaseWakeLock = async () => {
    if (!wakeLockRef.current) return
    try {
      await wakeLockRef.current.release()
      wakeLockRef.current = null
      setScreenLockActive(false)
    } catch {
      setScreenLockActive(false)
    }
  }

  const scaledIngredients = recipe.ingredients.map((ingredient) => ({
    ...ingredient,
    quantity: (Number(ingredient.amount || 0) * scale).toFixed(scale < 1 ? 2 : 1),
  }))

  return (
    <FeatureShell eyebrow="NẤU CÙNG TÔI" title="Chế độ nấu tay" intro="Mỗi bước được phóng to, lời hướng dẫn được đọc thành tiếng, đồng hồ đếm thời gian luôn hiển thị và màn hình được giữ sáng trong lúc bạn nấu.">
      <div className="cook-mode-shell">
        <section className="feature-section cook-mode-top">
          <div className="cook-mode-header">
            <div>
              <p className="community-kicker">{t('Món hiện tại')}</p>
              <h2>{t(recipe.title)}</h2>
            </div>
            <div className="serving-control">
              <button type="button" className="feature-button" onClick={() => setScale((previous) => Number(Math.max(0.5, Number((previous - 0.25).toFixed(2))).toFixed(2)))}>−</button>
              <strong>{scale.toFixed(2)}x</strong>
              <button type="button" className="feature-button" onClick={() => setScale((previous) => Number(Math.min(4, Number((previous + 0.25).toFixed(2))).toFixed(2)))}>+</button>
            </div>
          </div>

          <div className="cook-mode-summary">
            <div className="cook-mode-timer">
              <span>{t('Bước')} {currentStep + 1}/{recipe.steps.length}</span>
              <strong>{formatCountdown(secondsLeft)}</strong>
            </div>

            <div className="cook-mode-tools">
              <button type="button" className="feature-button primary" onClick={() => setIsRunning((value) => !value)}>
                {t(isRunning ? 'Tạm dừng' : 'Bắt đầu')}
              </button>
              <button type="button" className="feature-button" onClick={speakCurrentStep}>{t('Đọc to')}</button>
              {!screenLockActive ? (
                <button type="button" className="feature-button" onClick={requestWakeLock}>{t('Giữ sáng màn hình')}</button>
              ) : (
                <button type="button" className="feature-button selected" onClick={releaseWakeLock}>{t('Tắt giữ sáng')}</button>
              )}
            </div>
          </div>
        </section>

        <div className="feature-columns cook-mode-columns">
          <section className="feature-section cook-step-panel">
            <p className="community-kicker">{t('Bước')} {currentStep + 1}</p>
            <h3>{t(currentStepData.title)}</h3>
            <p>{t(currentStepData.text)}</p>
            <div className="cook-step-meta">
              <span>{t('Thời lượng')}</span>
              <strong>{Math.floor(currentStepData.duration / 60)} {t('phút')} {currentStepData.duration % 60} {t('giây')}</strong>
            </div>

            <div className="cook-step-controls">
              <button type="button" className="feature-button" onClick={() => setCurrentStep((value) => Math.max(0, value - 1))} disabled={currentStep === 0}>{t('Bước trước')}</button>
              <button type="button" className="feature-button primary" onClick={() => setCurrentStep((value) => Math.min(recipe.steps.length - 1, value + 1))} disabled={currentStep === recipe.steps.length - 1}>{t('Bước sau')}</button>
            </div>
          </section>

          <section className="feature-section">
            <div className="feature-section-heading">
              <h2>{t('Nguyên liệu')}</h2>
              <span>{recipe.servings * scale} {t('Khẩu phần').toLowerCase()}</span>
            </div>

            <ul className="cook-ingredient-list">
              {scaledIngredients.map((ingredient) => (
                <li key={ingredient.name}>
                  <span>{t(ingredient.name)}</span>
                  <strong>{ingredient.quantity} {ingredient.unit}</strong>
                </li>
              ))}
            </ul>

            <div className="cook-step-rail">
              {recipe.steps.map((step, index) => (
                <button
                  key={step.title}
                  type="button"
                  className={index === currentStep ? 'active' : ''}
                  onClick={() => setCurrentStep(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </FeatureShell>
  )
}

export function RecipeEngagement({ recipe }) {
  const [saved, setSaved] = useState(false)
  const [collections, setCollections] = useState([])
  const [collectionId, setCollectionId] = useState('')
  const [reviewData, setReviewData] = useState({ averageRating: 0, count: 0, items: [] })
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [isCooked, setIsCooked] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true
    request(`/features/recipes/${recipe.id}/reviews`).then(data => { if (active) setReviewData(data) }).catch(error => toast.error(error.message))
    if (getToken()) {
      Promise.all([request('/features/bookmarks'), request('/features/collections')]).then(([bookmarks, lists]) => {
        if (!active) return
        setSaved(bookmarks.some(item => item.recipe.id === recipe.id))
        setCollections(lists)
      }).catch(() => {})
    }
    return () => { active = false }
  }, [recipe.id, refresh])

  const toggleSave = async () => {
    if (!getToken()) return toast.info('Đăng nhập để lưu công thức.')
    try {
      if (saved) await request(`/features/recipes/${recipe.id}/bookmark`, { method: 'DELETE' })
      else await request(`/features/recipes/${recipe.id}/bookmark`, { method: 'POST' })
      setSaved(!saved)
      toast.success(saved ? 'Đã bỏ lưu công thức.' : 'Đã lưu công thức.')
    } catch (error) { toast.error(error.message) }
  }

  const addToCollection = async () => {
    if (!collectionId) return toast.info('Chọn bộ sưu tập trước.')
    try { await request(`/features/collections/${collectionId}/recipes/${recipe.id}`, { method: 'POST' }); setSaved(true); toast.success('Đã thêm vào bộ sưu tập.') }
    catch (error) { toast.error(error.message) }
  }

  const submitReview = async event => {
    event.preventDefault()
    if (!getToken()) return toast.info('Đăng nhập để đánh giá món đã nấu.')
    setBusy(true)
    try {
      await request(`/features/recipes/${recipe.id}/reviews`, { method: 'POST', body: JSON.stringify({ rating: Number(rating), content: review, isCooked }) })
      setReview('')
      setRefresh(value => value + 1)
      toast.success('Cảm ơn bạn đã chia sẻ trải nghiệm.')
    } catch (error) { toast.error(error.message) }
    finally { setBusy(false) }
  }

  return <section className="feature-section recipe-engagement">
    <div className="engagement-top"><div><p className="community-kicker">CỘNG ĐỒNG ĐÃ NẤU</p><h2>{reviewData.averageRating ? `${Number(reviewData.averageRating).toFixed(1)} / 5` : 'Chưa có đánh giá'} <span>★</span></h2><small>{reviewData.count} đánh giá</small></div><button type="button" className={saved ? 'feature-button selected' : 'feature-button'} onClick={toggleSave}>{saved ? '♥ Đã lưu' : '♡ Lưu công thức'}</button></div>
    {getToken() && collections.length > 0 && <div className="collection-quick-add"><select value={collectionId} onChange={event => setCollectionId(event.target.value)}><option value="">Thêm vào bộ sưu tập...</option>{collections.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select><button type="button" className="feature-button" onClick={addToCollection}>Thêm</button></div>}
    {getToken() && <form className="review-form" onSubmit={submitReview}><h3>Món này thế nào?</h3><div className="review-fields"><label>Đánh giá<select value={rating} onChange={event => setRating(event.target.value)}><option value={5}>5 sao</option><option value={4}>4 sao</option><option value={3}>3 sao</option><option value={2}>2 sao</option><option value={1}>1 sao</option></select></label><label className="cooked-check"><input type="checkbox" checked={isCooked} onChange={event => setIsCooked(event.target.checked)} /> Tôi đã nấu món này</label></div><textarea value={review} onChange={event => setReview(event.target.value)} placeholder="Chia sẻ mẹo hoặc điều bạn đã thay đổi..." maxLength={1200} /><button className="feature-button primary" disabled={busy}>{busy ? 'Đang gửi...' : 'Gửi đánh giá'}</button></form>}
    <div className="review-list">{reviewData.items.map(item => <article className="review-item" key={item.id}><div><strong>{item.fullName || item.username}</strong><span>{'★'.repeat(item.rating)}{'☆'.repeat(5-item.rating)}</span><small>{new Date(item.createdAt).toLocaleDateString('vi-VN')}{item.isCooked ? ' · Đã nấu' : ''}</small></div>{item.content && <p>{item.content}</p>}</article>)}</div>
  </section>
}

export function SavedRecipesPage() {
  const navigate = useNavigate()
  const [bookmarks, setBookmarks] = useState([])
  const [collections, setCollections] = useState([])
  const [name, setName] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState('')
  const [selectedCollection, setSelectedCollection] = useState('')
  const [loading, setLoading] = useState(true)
  const reload = () => Promise.all([request('/features/bookmarks'), request('/features/collections')]).then(([saved, lists]) => { setBookmarks(saved); setCollections(lists) }).catch(error => toast.error(error.message)).finally(() => setLoading(false))
  useEffect(() => { if (!getToken()) { navigate('/login'); return } reload() }, [navigate])

  const createCollection = async event => {
    event.preventDefault()
    try { await request('/features/collections', { method: 'POST', body: JSON.stringify({ name }) }); setName(''); reload() }
    catch (error) { toast.error(error.message) }
  }
  const addRecipe = async event => {
    event.preventDefault()
    if (!selectedRecipe || !selectedCollection) return
    try { await request(`/features/collections/${selectedCollection}/recipes/${selectedRecipe}`, { method: 'POST' }); reload(); toast.success('Đã thêm công thức vào bộ sưu tập.') }
    catch (error) { toast.error(error.message) }
  }
  const unsave = async recipeId => {
    try { await request(`/features/recipes/${recipeId}/bookmark`, { method: 'DELETE' }); reload() }
    catch (error) { toast.error(error.message) }
  }
  const deleteCollection = async id => {
    if (!window.confirm('Xóa bộ sưu tập này?')) return
    try { await request(`/features/collections/${id}`, { method: 'DELETE' }); reload() }
    catch (error) { toast.error(error.message) }
  }

  return <FeatureShell eyebrow="CÔNG THỨC CỦA BẠN" title="Đã lưu & bộ sưu tập" intro="Gom những món muốn nấu vào các tuyển tập của riêng bạn.">
    <div className="feature-columns"><section className="feature-section"><div className="feature-section-heading"><h2>Công thức đã lưu</h2><span>{bookmarks.length}</span></div>{loading ? <p className="feature-empty">Đang tải...</p> : bookmarks.length ? <div className="saved-list">{bookmarks.map(item => <article key={item.recipe.id} className="saved-recipe"><div><Link to={`/recipes/${item.recipe.id}`}><strong>{item.recipe.title}</strong></Link><small>{item.recipe.categoryName}{item.recipe.cookingTimeMinutes ? ` · ${item.recipe.cookingTimeMinutes} phút` : ''}</small></div><button type="button" aria-label="Bỏ lưu" title="Bỏ lưu" onClick={() => unsave(item.recipe.id)}>♥</button></article>)}</div> : <p className="feature-empty">Chưa lưu công thức nào. Mở một món rồi chọn Lưu công thức.</p>}</section>
      <section className="feature-section"><div className="feature-section-heading"><h2>Bộ sưu tập</h2><span>{collections.length}</span></div><form className="inline-create-form" onSubmit={createCollection}><input value={name} onChange={event => setName(event.target.value)} placeholder="Ví dụ: Nấu cuối tuần" maxLength={80} required /><button className="feature-button primary">Tạo bộ sưu tập</button></form><form className="inline-create-form" onSubmit={addRecipe}><select value={selectedCollection} onChange={event => setSelectedCollection(event.target.value)}><option value="">Chọn bộ sưu tập</option>{collections.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select><select value={selectedRecipe} onChange={event => setSelectedRecipe(event.target.value)}><option value="">Chọn công thức đã lưu</option>{bookmarks.map(item => <option key={item.recipe.id} value={item.recipe.id}>{item.recipe.title}</option>)}</select><button className="feature-button">Thêm món</button></form><div className="collection-list">{collections.map(collection => <article className="collection-card" key={collection.id}><div className="feature-section-heading"><h3>{collection.name}</h3><button type="button" onClick={() => deleteCollection(collection.id)}>Xóa</button></div><p>{collection.count} công thức</p>{collection.recipes.map(recipe => <Link key={recipe.id} to={`/recipes/${recipe.id}`}>{recipe.title}</Link>)}</article>)}</div></section></div>
  </FeatureShell>
}

function mondayOf(date) {
  const value = new Date(`${date}T12:00:00`)
  value.setDate(value.getDate() - ((value.getDay() + 6) % 7))
  return value.toISOString().slice(0, 10)
}

function shiftDate(date, amount) {
  const value = new Date(`${date}T12:00:00`)
  value.setDate(value.getDate() + amount)
  return value.toISOString().slice(0, 10)
}

export function MealPlannerPage() {
  const navigate = useNavigate()
  const [weekStart, setWeekStart] = useState(() => mondayOf(new Date().toISOString().slice(0, 10)))
  const [entries, setEntries] = useState([])
  const [shopping, setShopping] = useState([])
  const [recipes, setRecipes] = useState([])
  const [recipeId, setRecipeId] = useState('')
  const [plannedFor, setPlannedFor] = useState(weekStart)
  const [mealType, setMealType] = useState('Bữa tối')
  const [servings, setServings] = useState(2)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!getToken()) { navigate('/login'); return }
    let active = true
    Promise.all([request(`/features/meal-plan?weekStart=${weekStart}`), request(`/features/meal-plan/shopping-list?weekStart=${weekStart}`), fetch(`${API}/Recipes`).then(response => response.json())])
      .then(([plan, list, recipeList]) => { if (active) { setEntries(plan.entries); setShopping(list.items); setRecipes(recipeList) } })
      .catch(error => toast.error(error.message)).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [weekStart, navigate])

  const reloadShopping = () => request(`/features/meal-plan/shopping-list?weekStart=${weekStart}`).then(data => setShopping(data.items)).catch(error => toast.error(error.message))
  const addMeal = async event => {
    event.preventDefault()
    try { await request('/features/meal-plan', { method: 'POST', body: JSON.stringify({ recipeId, plannedFor, mealType, servings: Number(servings) }) }); const plan = await request(`/features/meal-plan?weekStart=${weekStart}`); setEntries(plan.entries); reloadShopping() }
    catch (error) { toast.error(error.message) }
  }
  const removeMeal = async id => {
    try { await request(`/features/meal-plan/${id}`, { method: 'DELETE' }); setEntries(current => current.filter(item => item.id !== id)); reloadShopping() }
    catch (error) { toast.error(error.message) }
  }
  const toggleGrocery = async item => {
    try { await request('/features/meal-plan/shopping-list', { method: 'PUT', body: JSON.stringify({ weekStart, ingredient: item.ingredient, isChecked: !item.isChecked }) }); reloadShopping() }
    catch (error) { toast.error(error.message) }
  }
  const days = Array.from({ length: 7 }, (_, index) => shiftDate(weekStart, index))

  return <FeatureShell eyebrow="LỊCH BẾP" title="Thực đơn tuần" intro="Chọn món trước, rồi mang theo danh sách nguyên liệu khi đi chợ.">
    <div className="week-controls"><button className="feature-button" type="button" onClick={() => setWeekStart(shiftDate(weekStart, -7))}>← Tuần trước</button><strong>{new Date(`${weekStart}T12:00:00`).toLocaleDateString('vi-VN')} – {new Date(`${shiftDate(weekStart, 6)}T12:00:00`).toLocaleDateString('vi-VN')}</strong><button className="feature-button" type="button" onClick={() => setWeekStart(shiftDate(weekStart, 7))}>Tuần sau →</button></div>
    <div className="feature-columns planner-columns"><section className="feature-section"><div className="feature-section-heading"><h2>Thêm vào lịch</h2></div><form className="planner-form" onSubmit={addMeal}><label>Công thức<select value={recipeId} onChange={event => setRecipeId(event.target.value)} required><option value="">Chọn món</option>{recipes.map(recipe => <option key={recipe.id} value={recipe.id}>{recipe.title}</option>)}</select></label><div className="planner-form-row"><label>Ngày<select value={plannedFor} onChange={event => setPlannedFor(event.target.value)}>{days.map(day => <option key={day} value={day}>{new Date(`${day}T12:00:00`).toLocaleDateString('vi-VN',{weekday:'long',day:'numeric',month:'short'})}</option>)}</select></label><label>Bữa<select value={mealType} onChange={event => setMealType(event.target.value)}><option>Bữa sáng</option><option>Bữa trưa</option><option>Bữa tối</option><option>Ăn nhẹ</option></select></label></div><label>Khẩu phần<input type="number" min="1" max="30" value={servings} onChange={event => setServings(event.target.value)} /></label><button className="feature-button primary">Thêm vào lịch</button></form><div className="plan-days">{days.map(day => <section key={day} className="plan-day"><header>{new Date(`${day}T12:00:00`).toLocaleDateString('vi-VN',{weekday:'long',day:'numeric',month:'short'})}</header>{entries.filter(entry => entry.plannedFor === day).map(entry => <article className="planned-meal" key={entry.id}><span>{entry.mealType}</span><Link to={`/recipes/${entry.recipeId}`}>{entry.title}</Link><small>{entry.servings} khẩu phần</small><button type="button" aria-label="Xóa món khỏi lịch" onClick={() => removeMeal(entry.id)}>×</button></article>)}</section>)}</div>{loading && <p className="feature-empty">Đang tải lịch...</p>}</section>
      <section className="feature-section grocery-section"><div className="feature-section-heading"><h2>Danh sách đi chợ</h2><span>{shopping.filter(item => !item.isChecked).length} còn lại</span></div>{shopping.length ? <div className="grocery-list">{shopping.map(item => <label key={item.key} className={item.isChecked ? 'grocery-item checked' : 'grocery-item'}><input type="checkbox" checked={item.isChecked} onChange={() => toggleGrocery(item)} /><span>{item.ingredient}</span><small>{item.recipesCount > 1 ? `× ${item.recipesCount}` : ''}</small></label>)}</div> : <p className="feature-empty">Thêm món vào lịch để tạo danh sách nguyên liệu.</p>}</section></div>
  </FeatureShell>
}

export function ChallengesPage() {
  const navigate = useNavigate()
  const [challenges, setChallenges] = useState([])
  const [recipes, setRecipes] = useState([])
  const [recipeId, setRecipeId] = useState('')
  const [loading, setLoading] = useState(true)
  const [myId, setMyId] = useState('')
  const [refresh, setRefresh] = useState(0)
  useEffect(() => {
    let active = true
    Promise.all([request('/features/challenges'), fetch(`${API}/Recipes`).then(response => response.json()), getToken() ? request('/account/me') : Promise.resolve(null)])
      .then(([items, recipeList, me]) => { if (active) { setChallenges(items); setRecipes(recipeList); setMyId(me?.id || '') } })
      .catch(error => toast.error(error.message)).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [navigate, refresh])
  const submit = async (challengeId, event) => {
    event.preventDefault()
    if (!getToken()) return navigate('/login')
    try { await request(`/features/challenges/${challengeId}/submit`, { method: 'POST', body: JSON.stringify({ recipeId }) }); toast.success('Bạn đã tham gia thử thách!'); setRefresh(value => value + 1) }
    catch (error) { toast.error(error.message) }
  }
  return <FeatureShell eyebrow="SÂN CHƠI CỘNG ĐỒNG" title="Thử thách nấu ăn" intro="Mỗi tuần một chủ đề mới. Chọn công thức do bạn tạo để tham gia và nhận huy hiệu.">
    {loading ? <p className="feature-empty">Đang tải thử thách...</p> : challenges.length ? <div className="challenge-grid">{challenges.map(challenge => <article className="challenge-card" key={challenge.id}><p className="community-kicker">{new Date(challenge.endsAt).toLocaleDateString('vi-VN') === new Date().toLocaleDateString('vi-VN') ? 'KẾT THÚC HÔM NAY' : 'THỬ THÁCH ĐANG MỞ'}</p><h2>{challenge.title}</h2><p>{challenge.theme}</p><div className="challenge-progress"><strong>{challenge.entriesCount}</strong><span>bài dự thi</span><span>{new Date(challenge.endsAt).toLocaleDateString('vi-VN')}</span></div>{challenge.enteredByMe ? <div className="challenge-entered">✓ Bạn đã tham gia</div> : myId ? <form className="challenge-submit" onSubmit={event => submit(challenge.id,event)}><select value={recipeId} onChange={event => setRecipeId(event.target.value)} required><option value="">Chọn công thức của bạn</option>{recipes.filter(recipe => recipe.authorId === myId).map(recipe => <option key={recipe.id} value={recipe.id}>{recipe.title}</option>)}</select><button className="feature-button primary">Gửi dự thi</button></form> : <Link className="feature-button primary" to="/login">Đăng nhập để tham gia</Link>}</article>)}</div> : <p className="feature-empty">Chưa có thử thách nào.</p>}
  </FeatureShell>
}

export function CreatorDashboardPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  useEffect(() => {
    if (!getToken()) { navigate('/login'); return }
    request('/features/creator/stats').then(setStats).catch(error => toast.error(error.message))
  }, [navigate])
  const metrics = stats ? [
    ['Công thức', stats.recipeCount], ['Lượt xem', stats.recipeViews], ['Lượt lưu', stats.savedCount],
    ['Bài viết', stats.postCount], ['Lượt thích', stats.receivedLikes], ['Bình luận', stats.receivedComments]
  ] : []
  return <FeatureShell eyebrow="BẾP CỦA BẠN" title="Tổng quan tác giả" intro="Theo dõi những gì cộng đồng đang đón nhận từ các công thức và bài viết của bạn.">
    {stats ? <><div className="creator-metrics">{metrics.map(([label,value]) => <article className="metric-card" key={label}><span>{label}</span><strong>{value.toLocaleString('vi-VN')}</strong></article>)}</div><div className="creator-actions"><Link to="/recipes/new">+ Tạo công thức</Link><Link to="/account">Cập nhật hồ sơ →</Link></div></> : <p className="feature-empty">Đang tải số liệu...</p>}
  </FeatureShell>
}

export function NotificationsPage() {
  const navigate = useNavigate()
  const [data, setData] = useState({ unreadCount: 0, items: [] })
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(0)
  useEffect(() => {
    if (!getToken()) { navigate('/login'); return }
    request('/features/notifications').then(setData).catch(error => toast.error(error.message)).finally(() => setLoading(false))
  }, [navigate, refresh])
  const markRead = async id => { try { await request(`/features/notifications/${id}/read`, { method: 'PUT' }); setRefresh(value => value + 1) } catch (error) { toast.error(error.message) } }
  const markAllRead = async () => { try { await request('/features/notifications/read-all', { method: 'PUT' }); setRefresh(value => value + 1) } catch (error) { toast.error(error.message) } }
  return <FeatureShell eyebrow="CẬP NHẬT CỦA BẠN" title="Thông báo" intro="Lượt theo dõi, yêu thích và cuộc trò chuyện mới nhất.">
    <div className="feature-section"><div className="feature-section-heading"><h2>{data.unreadCount ? `${data.unreadCount} chưa đọc` : 'Đã cập nhật'}</h2>{data.unreadCount > 0 && <button type="button" className="text-command" onClick={markAllRead}>Đánh dấu đã đọc tất cả</button>}</div>{loading ? <p className="feature-empty">Đang tải thông báo...</p> : data.items.length ? <div className="notification-list">{data.items.map(item => <article className={item.readAt ? 'notification-item' : 'notification-item unread'} key={item.id}><Link to={item.targetUrl || '/community'} onClick={() => !item.readAt && markRead(item.id)}><span className="notification-avatar">{item.actor.fullName?.slice(0,1) || item.actor.username?.slice(0,1) || 'B'}</span><span><strong>{item.actor.fullName || item.actor.username}</strong> {item.message}<small>{new Date(item.createdAt).toLocaleString('vi-VN')}</small></span></Link>{!item.readAt && <button type="button" onClick={() => markRead(item.id)}>Đánh dấu đã đọc</button>}</article>)}</div> : <p className="feature-empty">Chưa có thông báo mới.</p>}</div>
  </FeatureShell>
}

export function SafetyPage() {
  const navigate = useNavigate()
  const [blocked, setBlocked] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(0)
  useEffect(() => {
    if (!getToken()) { navigate('/login'); return }
    Promise.all([request('/community/blocks'), request('/community/reports/mine')])
      .then(([blockedUsers, myReports]) => { setBlocked(blockedUsers); setReports(myReports) })
      .catch(error => toast.error(error.message)).finally(() => setLoading(false))
  }, [navigate, refresh])
  const unblock = async username => {
    try { await request(`/community/users/${encodeURIComponent(username)}/block`, { method: 'DELETE' }); setRefresh(value => value + 1) }
    catch (error) { toast.error(error.message) }
  }
  return <FeatureShell eyebrow="QUYỀN RIÊNG TƯ" title="An toàn cộng đồng" intro="Quản lý thành viên bạn đã chặn và theo dõi các báo cáo đã gửi.">
    {loading ? <p className="feature-empty">Đang tải cài đặt an toàn...</p> : <div className="feature-columns"><section className="feature-section"><div className="feature-section-heading"><h2>Thành viên đã chặn</h2><span>{blocked.length}</span></div>{blocked.length ? blocked.map(user => <article className="connection-row" key={user.username}><Link to={`/members/${encodeURIComponent(user.username)}`}><span className="notification-avatar">{user.fullName?.slice(0,1) || user.username?.slice(0,1)}</span><span><strong>{user.fullName || user.username}</strong><small>@{user.username}</small></span></Link><button type="button" onClick={() => unblock(user.username)}>Bỏ chặn</button></article>) : <p className="feature-empty">Bạn chưa chặn thành viên nào.</p>}</section><section className="feature-section"><div className="feature-section-heading"><h2>Báo cáo đã gửi</h2><span>{reports.length}</span></div>{reports.length ? reports.map(report => <article className="report-item" key={report.id}><strong>{report.targetType === 'post' ? 'Bài viết' : 'Thành viên'}</strong><span>{report.reason}</span><small>{new Date(report.createdAt).toLocaleString('vi-VN')} · {report.resolvedAt ? 'Đã xem xét' : 'Đang chờ xem xét'}</small></article>) : <p className="feature-empty">Chưa gửi báo cáo nào.</p>}</section></div>}
  </FeatureShell>
}

export function DraftsPage() {
  const navigate = useNavigate()
  const [drafts, setDrafts] = useState([])
  const [editingId, setEditingId] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(0)
  useEffect(() => {
    if (!getToken()) { navigate('/login'); return }
    request('/community/drafts').then(setDrafts).catch(error => toast.error(error.message)).finally(() => setLoading(false))
  }, [navigate, refresh])
  const saveDraft = async event => {
    event.preventDefault()
    try { await request(`/community/posts/${editingId}`, { method: 'PUT', body: JSON.stringify({ content, isDraft: true }) }); setEditingId(''); setRefresh(value => value + 1) }
    catch (error) { toast.error(error.message) }
  }
  const publish = async id => {
    try { const draft = drafts.find(item => item.id === id); await request(`/community/posts/${id}`, { method: 'PUT', body: JSON.stringify({ content: draft.content, mediaUrl: draft.mediaUrl, mediaType: draft.mediaType, isDraft: false }) }); toast.success('Bài viết đã được đăng.'); setRefresh(value => value + 1) }
    catch (error) { toast.error(error.message) }
  }
  const remove = async id => {
    if (!window.confirm('Xóa bản nháp này?')) return
    try { await request(`/community/posts/${id}`, { method: 'DELETE' }); setRefresh(value => value + 1) }
    catch (error) { toast.error(error.message) }
  }
  return <FeatureShell eyebrow="BÀI VIẾT CỦA BẠN" title="Bản nháp" intro="Lưu ý tưởng lại và đăng khi bạn đã sẵn sàng.">
    {loading ? <p className="feature-empty">Đang tải bản nháp...</p> : drafts.length ? <div className="draft-list">{drafts.map(draft => <article className="draft-card" key={draft.id}><small>{new Date(draft.createdAt).toLocaleString('vi-VN')}</small>{editingId === draft.id ? <form className="post-edit-form" onSubmit={saveDraft}><textarea value={content} onChange={event => setContent(event.target.value)} maxLength={3000} /><div><button type="button" className="feature-button" onClick={() => setEditingId('')}>Hủy</button><button className="feature-button primary">Lưu bản nháp</button></div></form> : <><p>{draft.content}</p>{draft.mediaUrl && <div className="post-media">{draft.mediaType === 'video' ? <video src={draft.mediaUrl} controls playsInline preload="metadata" /> : <img src={draft.mediaUrl} alt="Ảnh trong bản nháp" loading="lazy" />}</div>}<div className="draft-actions"><button type="button" className="feature-button" onClick={() => { setEditingId(draft.id); setContent(draft.content) }}>Sửa</button><button type="button" className="feature-button primary" onClick={() => publish(draft.id)}>Đăng bài</button><button type="button" className="feature-button danger" onClick={() => remove(draft.id)}>Xóa</button></div></>}</article>)}</div> : <p className="feature-empty">Chưa có bản nháp nào. Bạn có thể lưu bài từ bảng tin.</p>}
  </FeatureShell>
}
