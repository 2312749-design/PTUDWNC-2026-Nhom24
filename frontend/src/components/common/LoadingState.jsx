import { LoaderCircle } from 'lucide-react'

export default function LoadingState({ label = 'Đang tải dữ liệu…', compact = false }) {
  return <div className={`cb-loading${compact ? ' cb-loading--compact' : ''}`} role="status" aria-live="polite">
    <LoaderCircle className="cb-loading__icon" size={compact ? 18 : 28} aria-hidden="true" />
    <span>{label}</span>
  </div>
}
