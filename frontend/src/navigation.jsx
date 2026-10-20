'use client'

import NextLink from 'next/link'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect } from 'react'

export { useParams }
export function Link({ to, ...props }) { return <NextLink href={to} {...props} /> }
export function useNavigate() {
  const router = useRouter()
  return useCallback((href, options = {}) => {
    if (href === -1) return router.back()
    if (typeof href !== 'string' || !href.startsWith('/') || href.startsWith('//')) return
    return options.replace ? router.replace(href) : router.push(href)
  }, [router])
}
export function useLocation() {
  const pathname = usePathname()
  const params = useSearchParams()
  return { pathname, search: params.size ? `?${params}` : '' }
}
export function Navigate({ to, replace = false }) {
  const navigate = useNavigate()
  useEffect(() => { navigate(to, { replace }) }, [navigate, to, replace])
  return null
}
