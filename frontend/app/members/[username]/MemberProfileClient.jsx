'use client'

import { ToastContainer } from 'react-toastify'
import { LocaleProvider } from '../../../src/LocaleContext.jsx'
import { NextMemberProfilePage } from '../../../src/CommunityPages.jsx'

export default function MemberProfileClient() {
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
      <NextMemberProfilePage />
    </LocaleProvider>
  )
}