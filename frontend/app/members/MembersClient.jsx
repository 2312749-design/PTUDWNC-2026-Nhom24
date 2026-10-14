'use client'

import { ToastContainer } from 'react-toastify'
import { LocaleProvider } from '../../src/LocaleContext.jsx'
import { NextMembersPage } from '../../src/CommunityPages.jsx'

export default function MembersClient() {
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
      <NextMembersPage />
    </LocaleProvider>
  )
}