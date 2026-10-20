import PageClient from '../PageClient'
import AdminDashboard from './AdminDashboard'

export const metadata = { title: 'Quản trị', robots: { index: false, follow: false } }
export default function Page() { return <PageClient><AdminDashboard /></PageClient> }
