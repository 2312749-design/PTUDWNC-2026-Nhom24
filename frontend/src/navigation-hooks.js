'use client'

import { useCallback } from 'react'
import { useParams as useNextParams, usePathname, useRouter, useSearchParams } from 'next/navigation'

export { useNextParams as useParams }

export function useNavigate() {
  const router = useRouter()
  return useCallback((href, options = {}) => {
    if (href === -1) return router.back()
    if (typeof href !== 'string' || !href.startsWith('/') || href.startsWith('//')) return undefined
    return options.replace ? router.replace(href) : router.push(href)
  }, [router])
}

export function useLocation() {
  const pathname = usePathname()
  const params = useSearchParams()
  return { pathname, search: params.size ? `?${params}` : '' }
}
