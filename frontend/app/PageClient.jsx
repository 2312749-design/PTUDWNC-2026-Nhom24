'use client'

import { Suspense } from 'react'
import LoadingState from '../src/components/common/LoadingState'

// Browser-only cooking tools read saved sessions and preferences from localStorage.
export default function PageClient({ children }) {
  return <Suspense fallback={<LoadingState />}><>{children}</></Suspense>
}
