'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/Button'

export default function Pagination({ page, totalPages, onPageChange, disabled = false }) {
  const safeTotal = Math.max(1, totalPages || 1)
  if (safeTotal === 1) return null
  return <nav className="cb-pagination" aria-label="Phân trang">
    <Button type="button" variant="secondary" size="sm" disabled={disabled || page <= 1} onClick={() => onPageChange(page - 1)}><ChevronLeft size={16} /> Trước</Button>
    <span aria-live="polite">Trang {page} / {safeTotal}</span>
    <Button type="button" variant="secondary" size="sm" disabled={disabled || page >= safeTotal} onClick={() => onPageChange(page + 1)}>Sau <ChevronRight size={16} /></Button>
  </nav>
}
