'use client'

import { create } from 'zustand'
import type { AuthTokens, UserProfile } from '../types/api'

type AuthState = {
  accessToken: string | null
  user: UserProfile | null
  hydrated: boolean
  isAuthenticated: boolean
  setSession: (tokens: AuthTokens) => void
  setUser: (user: UserProfile | null) => void
  clearSession: () => void
  hydrate: (session: Partial<AuthTokens>) => void
}

/** Reactive authentication state. Access credentials stay in memory; the API
 * persists the browser session in HttpOnly cookies, never localStorage. */
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  hydrated: false,
  isAuthenticated: false,
  setSession: (tokens) => set({
    accessToken: tokens.accessToken,
    user: tokens.user ?? null,
    hydrated: true,
    isAuthenticated: Boolean(tokens.accessToken),
  }),
  setUser: (user) => set({ user }),
  clearSession: () => set({
    accessToken: null,
    user: null,
    hydrated: true,
    isAuthenticated: false,
  }),
  hydrate: (session) => set((state) => {
    // The provider also synchronizes user metadata after saveSession(). Its
    // storage snapshot intentionally contains no token, so keep the credential
    // already held in memory instead of forcing every API call to rotate it.
    const accessToken = session.accessToken === undefined ? state.accessToken : session.accessToken
    const user = session.user ?? null
    return { accessToken, user, hydrated: true, isAuthenticated: Boolean(accessToken || user) }
  }),
}))
