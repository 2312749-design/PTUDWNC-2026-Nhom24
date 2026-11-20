import PageClient from '../PageClient'
import SrsDashboard from '../../src/SrsDashboard'

export const metadata = { title: 'Bảng điều khiển', robots: { index: false } }
export default function Page() { return <PageClient><SrsDashboard /></PageClient> }
