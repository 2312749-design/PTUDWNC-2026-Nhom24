'use client'

import { ToastContainer } from 'react-toastify'
import { LocaleProvider } from '../../src/LocaleContext.jsx'
import { NextChallengesPage } from '../../src/PlatformFeaturePages.jsx'

export default function ChallengesClient() {
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
      <NextChallengesPage />
    </LocaleProvider>
  )
}