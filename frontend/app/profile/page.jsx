import PageClient from '../PageClient'
import { AccountPage } from '../../src/CommunityPages'

export const metadata = { title: 'Hồ sơ cá nhân', robots: { index: false } }
export default function Page() { return <PageClient><AccountPage /></PageClient> }
