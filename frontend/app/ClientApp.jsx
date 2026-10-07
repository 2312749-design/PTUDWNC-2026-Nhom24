'use client'

import { StrictMode, useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import App from '../src/App'
import { LocaleProvider } from '../src/LocaleContext'

export default function ClientApp() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#475569' }}>Loading CulinaryBlog...</div>
  }

  return (
    <StrictMode>
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
    </StrictMode>
  )
}
