import { createContext, useContext } from 'react'

export const LocaleContext = createContext({
  settings: { language: 'vi', unit: 'g', region: 'VN' },
  applySettings: () => {},
  t: (value) => value,
  normalizeInput: (value) => value,
})

/** Hook đọc các thiết lập ngôn ngữ ở bất kỳ client component nào. */
export function useLocale() {
  return useContext(LocaleContext)
}
