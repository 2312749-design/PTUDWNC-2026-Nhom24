'use client'

import { useEffect } from 'react'
import { toast } from 'react-toastify'

/** Wall-clock expiry also works when CSS motion is disabled or focus is lost. */
export default function ToastDeadlineManager() {
  useEffect(() => {
    const timers = new Map()
    const unsubscribe = toast.onChange((item) => {
      const key = `${item.containerId ?? 'default'}:${item.id}`
      const previousTimer = timers.get(key)
      if (previousTimer !== undefined) window.clearTimeout(previousTimer)
      timers.delete(key)
      if (item.status === 'removed' || item.isLoading) return

      timers.set(key, window.setTimeout(() => {
        timers.delete(key)
        toast.dismiss({ id: item.id, containerId: item.containerId })
      }, 5000))
    })

    return () => {
      unsubscribe()
      timers.forEach((timer) => window.clearTimeout(timer))
      timers.clear()
    }
  }, [])

  return null
}
