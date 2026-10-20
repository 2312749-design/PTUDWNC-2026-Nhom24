'use client'

import { create } from 'zustand'
import type { AuthTokens, UserProfile } from '../types/api'

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  user: UserProfile | null
  hydrated: boolean
  isAuthenticated: boolean
  setSession: (tokens: AuthTokens) => void
  setUser: (user: UserProfile | null) => void
  clearSession: () => void
  hydrate: (session: Partial<AuthTokens>) => void
}

/** Reactive, application-wide authentication state. Persistent token storage is
 * intentionally kept in api/session.js so all API access has one source. */
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  hydrated: false,
  isAuthenticated: false,
  setSession: (tokens) => set({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: tokens.user ?? null,
    hydrated: true,
    isAuthenticated: Boolean(tokens.accessToken && tokens.refreshToken),
  }),
  setUser: (user) => set({ user }),
  clearSession: () => set({
    accessToken: null,
    refreshToken: null,
    user: null,
    hydrated: true,
    isAuthenticated: false,
  }),
  hydrate: (session) => set({
    accessToken: session.accessToken ?? null,
    refreshToken: session.refreshToken ?? null,
    user: session.user ?? null,
    hydrated: true,
    isAuthenticated: Boolean(session.accessToken || session.refreshToken),
  }),
}))
