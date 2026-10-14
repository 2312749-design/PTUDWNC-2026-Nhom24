'use client'

import { ToastContainer } from 'react-toastify'
import { LocaleProvider } from '../../../src/LocaleContext.jsx'
import { NextArticlePage } from '../../../src/CommunityPages.jsx'

export default function ArticleClient() {
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
      <NextArticlePage />
    </LocaleProvider>
  )
}