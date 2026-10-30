'use client'

import NextLink from 'next/link'
import { useEffect } from 'react'
import { useNavigate } from './navigation-hooks'

export function Link({ to, ...props }) { return <NextLink href={to} {...props} /> }
export function Navigate({ to, replace = false }) {
  const navigate = useNavigate()
  useEffect(() => { navigate(to, { replace }) }, [navigate, to, replace])
  return null
}
