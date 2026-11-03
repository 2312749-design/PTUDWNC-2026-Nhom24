import Link from 'next/link'
import { Button } from '../src/components/ui/Button'

export default function NotFound() {
  return <section className="cb-error"><div><h1>Không tìm thấy trang</h1><p>Đường dẫn này không còn tồn tại hoặc đã được chuyển đi.</p></div><Button asChild><Link href="/community">Về bảng tin</Link></Button></section>
}
