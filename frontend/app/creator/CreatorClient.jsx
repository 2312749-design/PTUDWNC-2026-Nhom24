'use client'

import { ToastContainer } from 'react-toastify'
import { LocaleProvider } from '../../src/LocaleContext.jsx'
import { NextCreatorDashboardPage } from '../../src/PlatformFeaturePages.jsx'

export default function CreatorClient() {
  return (
    <LocaleProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
      <NextCreatorDashboardPage />
    </LocaleProvider>
  )
}