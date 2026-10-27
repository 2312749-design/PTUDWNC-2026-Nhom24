'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Title, Description } from '@radix-ui/react-dialog'
import { Dialog, DialogContent } from '../ui/Dialog'
import { apiRequest } from '../../api/session'

function normalize(value) {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase()
}

export default function CosmicCommandPalette({ open, onOpenChange, query, onQueryChange, navigation }) {
  const router = useRouter()
  const [search, setSearch] = useState({ query: '', items: [], error: '' })
  const [activeIndex, setActiveIndex] = useState(0)
  const listRef = useRef(null)
  const keyword = query.trim()

  useEffect(() => {
    if (!open || keyword.length < 2) return
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      try {
        const response = await apiRequest(`/search/recipes?q=${encodeURIComponent(keyword)}&pageSize=8`, { signal: controller.signal })
        if (controller.signal.aborted) return
        setSearch({ query: keyword, items: Array.isArray(response) ? response : response?.items || [], error: '' })
      } catch (error) {
        if (controller.signal.aborted) return
        setSearch({ query: keyword, items: [], error: error.message || 'Chưa tải được gợi ý công thức.' })
      }
    }, 220)
    return () => { controller.abort(); window.clearTimeout(timer) }
  }, [open, keyword])

  const rows = useMemo(() => {
    const matchedPages = [...new Map(navigation.map(([href, label]) => [href, { href, label, detail: 'Đi đến trang', kind: 'page' }])).values()]
      .filter(item => !keyword || normalize(item.label).includes(normalize(keyword))).slice(0, 6)
    const matchedRecipes = keyword.length >= 2 && search.query === keyword ? search.items.map(recipe => ({
      href: `/recipes/${recipe.id}`, label: recipe.title, detail: [recipe.categoryName, recipe.cookingTimeMinutes ? `${recipe.cookingTimeMinutes} phút` : '', recipe.difficulty].filter(Boolean).join(' · '), kind: 'recipe',
    })) : []
    return [...matchedRecipes, ...matchedPages]
  }, [navigation, keyword, search])
  const selectedIndex = Math.min(activeIndex, Math.max(0, rows.length - 1))
  const isLoading = keyword.length >= 2 && search.query !== keyword
  const choose = (row) => {
    if (!row) return
    onOpenChange(false)
    onQueryChange('')
    router.push(row.href)
  }
  const handleKeys = (event) => {
    if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key) || !rows.length) return
    event.preventDefault()
    if (event.key === 'Enter') { choose(rows[selectedIndex]); return }
    const nextIndex = (selectedIndex + (event.key === 'ArrowDown' ? 1 : -1) + rows.length) % rows.length
    setActiveIndex(nextIndex)
    listRef.current?.children[nextIndex]?.scrollIntoView({ block: 'nearest' })
  }

  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="cosmic-command-dialog">
    <Title className="cosmic-command-title">Cosmic Command Palette</Title>
    <Description className="cosmic-command-description">Tìm nhanh món ăn, nguyên liệu và tất cả trang trong Bếp Nhà.</Description>
    <label className="cosmic-command-search"><span aria-hidden="true">⌕</span><input type="search" data-cosmic-search="true" autoFocus value={query} onChange={event => { onQueryChange(event.target.value); setActiveIndex(0) }} onKeyDown={handleKeys} placeholder="Tìm món, nguyên liệu hoặc trang…" role="combobox" aria-label="Tìm kiếm nhanh" aria-expanded="true" aria-controls="cosmic-command-results" aria-activedescendant={rows.length ? `cosmic-command-option-${selectedIndex}` : undefined} autoComplete="off" /><kbd>ESC</kbd></label>
    <div className="cosmic-command-status" role="status">{isLoading ? 'Đang quét công thức…' : keyword.length === 1 ? 'Gõ ít nhất 2 ký tự để tìm món hoặc nguyên liệu.' : keyword && search.query === keyword && search.error ? search.error : keyword ? `${rows.filter(row => row.kind === 'recipe').length} món phù hợp · ↑ ↓ để chọn, Enter để mở` : 'Điều hướng nhanh · Gõ tên món hoặc nguyên liệu để tìm công thức'}</div>
    <div ref={listRef} className="cosmic-command-list" id="cosmic-command-results" role="listbox" aria-label="Kết quả tìm kiếm nhanh">{rows.map((row, index) => <button type="button" role="option" id={`cosmic-command-option-${index}`} aria-selected={selectedIndex === index} tabIndex={-1} className="cosmic-command-result" key={`${row.kind}:${row.href}`} onPointerMove={() => setActiveIndex(index)} onClick={() => choose(row)}><span className="cosmic-command-icon" aria-hidden="true">{row.kind === 'recipe' ? '◈' : '↗'}</span><span><b>{row.label}</b><small>{row.detail}</small></span><span aria-hidden="true">↵</span></button>)}</div>
    {!isLoading && !rows.length && <p className="cosmic-command-empty">Chưa có kết quả phù hợp. Thử tên món hoặc một nguyên liệu khác.</p>}
  </DialogContent></Dialog>
}
