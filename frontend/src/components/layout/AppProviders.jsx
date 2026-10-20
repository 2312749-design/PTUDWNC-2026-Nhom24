'use client'

import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import { LocaleProvider } from '../../LocaleContext'
import { useAuthStore } from '../../store/auth-store'

function AuthStoreHydrator() {
  const hydrate = useAuthStore((state) => state.hydrate)

  useEffect(() => {
    const sync = () => {
      try {
        hydrate({
          accessToken: window.localStorage.getItem('accessToken') || undefined,
          refreshToken: window.localStorage.getItem('refreshToken') || undefined,
          user: JSON.parse(window.localStorage.getItem('currentUser') || 'null') || undefined,
        })
      } catch {
        hydrate({})
      }
    }
    sync()
    window.addEventListener('auth-session-refreshed', sync)
    window.addEventListener('auth-session-cleared', sync)
    return () => {
      window.removeEventListener('auth-session-refreshed', sync)
      window.removeEventListener('auth-session-cleared', sync)
    }
  }, [hydrate])
  return null
}

export default function AppProviders({ children }) {
  return <LocaleProvider><AuthStoreHydrator />{children}<ToastContainer position="top-right" autoClose={3000} /></LocaleProvider>
}
