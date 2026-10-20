import { Inbox } from 'lucide-react'

/** Reusable empty-result message for lists, filters and saved collections. */
export default function EmptyState({ title = 'Chưa có nội dung', message = 'Nội dung sẽ xuất hiện ở đây khi có dữ liệu.', action }) {
  return <section className="cb-empty" aria-live="polite">
    <Inbox size={32} aria-hidden="true" />
    <div><h2>{title}</h2><p>{message}</p></div>
    {action}
  </section>
}
