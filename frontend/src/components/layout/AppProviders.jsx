'use client'

import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import { LocaleProvider } from '../../LocaleContext'
import { useAuthStore } from '../../store/auth-store'
import { MusicPlayerProvider } from './music-player-context'
import CosmicExperienceProvider from '../cosmic/CosmicExperienceProvider'
import ToastDeadlineManager from '../common/ToastDeadlineManager'

function AuthStoreHydrator() {
  const hydrate = useAuthStore((state) => state.hydrate)

  useEffect(() => {
    const sync = () => {
      try {
        hydrate({
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
  useEffect(() => {
    const applyAppearance = () => {
      try {
        const value = JSON.parse(window.localStorage.getItem('culinary:appearance') || '{}')
        document.documentElement.dataset.theme = value.theme || 'system'
        document.documentElement.dataset.fontScale = value.fontScale || 'normal'
        document.documentElement.dataset.contrast = String(Boolean(value.highContrast))
      } catch { /* Keep system defaults when a legacy value cannot be read. */ }
    }
    applyAppearance()
    window.addEventListener('culinary:appearance-changed', applyAppearance)
    return () => window.removeEventListener('culinary:appearance-changed', applyAppearance)
  }, [])

  return null
}

export default function AppProviders({ children }) {
  return <LocaleProvider><MusicPlayerProvider><CosmicExperienceProvider><AuthStoreHydrator /><ToastDeadlineManager />{children}<ToastContainer position="top-right" theme="dark" autoClose={5000} limit={3} closeButton closeOnClick pauseOnHover={false} pauseOnFocusLoss={false} draggable={false} /></CosmicExperienceProvider></MusicPlayerProvider></LocaleProvider>
}
