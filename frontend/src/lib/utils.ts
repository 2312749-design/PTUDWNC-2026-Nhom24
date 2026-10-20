import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Joins conditional class names for every shared UI component. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toUserMessage(error: unknown, fallback = 'Đã có lỗi xảy ra. Vui lòng thử lại.') {
  if (error instanceof Error && error.message) return error.message
  return fallback
}
