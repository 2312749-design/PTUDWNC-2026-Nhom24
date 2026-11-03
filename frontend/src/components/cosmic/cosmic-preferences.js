'use client'

import { createContext, useContext } from 'react'

export const CosmicContext = createContext(null)

export function useCosmicPreferences() {
  const value = useContext(CosmicContext)
  if (!value) throw new Error('Cosmic controls need CosmicExperienceProvider.')
  return value
}
