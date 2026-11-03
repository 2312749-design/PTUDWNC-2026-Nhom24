'use client'

import AppHeader from './AppHeader'
import AppFooter from './AppFooter'

export default function AppShell({ children }) {
  return <div className="app-shell"><AppHeader /><main className="app-shell__content">{children}</main><AppFooter /></div>
}
