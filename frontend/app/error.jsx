'use client'

import { useEffect } from 'react'
import ErrorState from '../src/components/common/ErrorState'

export default function Error({ error, reset }) {
  useEffect(() => { console.error(error) }, [error])
  return <ErrorState message="Trang này gặp sự cố khi tải dữ liệu." retry={reset} />
}
