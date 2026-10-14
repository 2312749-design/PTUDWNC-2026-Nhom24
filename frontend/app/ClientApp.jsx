'use client'

import { StrictMode, useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ToastContainer } from 'react-toastify'
import App from '../src/App'
import { LocaleProvider } from '../src/LocaleContext'

function AppShell() {
  return (
    <BrowserRouter>
      <LocaleProvider>
        <App />
      </LocaleProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </BrowserRouter>
  )
}

export default function ClientApp() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#475569' }}>Loading CulinaryBlog...</div>
  }

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  return (
    <StrictMode>
      {googleClientId ? (
        <GoogleOAuthProvider clientId={googleClientId}>
          <AppShell />
        </GoogleOAuthProvider>
      ) : (
        <AppShell />
      )}
    </StrictMode>
  )
}
