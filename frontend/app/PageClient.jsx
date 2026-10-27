'use client'

import { Suspense } from 'react'
import LoadingState from '../src/components/common/LoadingState'

// Browser-only views are hydrated here; authenticated API calls use HttpOnly cookies.
export default function PageClient({ children }) {
  return <Suspense fallback={<LoadingState />}><>{children}</></Suspense>
}
