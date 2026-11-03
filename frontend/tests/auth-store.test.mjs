import test from 'node:test'
import assert from 'node:assert/strict'
import { useAuthStore } from '../src/store/auth-store.ts'

const user = { id: 'submission-test-user', username: 'submission-test', role: 'User' }

test('metadata hydration after login preserves the in-memory access credential', () => {
  const store = useAuthStore.getState()
  store.clearSession()
  store.setSession({ accessToken: 'in-memory-test-credential', user })

  // AuthStoreHydrator receives only metadata from localStorage when
  // saveSession emits auth-session-refreshed. It must not discard the token.
  store.hydrate({ user })
  store.hydrate({ user: { ...user, fullName: 'Updated profile' } })

  const state = useAuthStore.getState()
  assert.equal(state.accessToken, 'in-memory-test-credential')
  assert.equal(state.user.fullName, 'Updated profile')
  assert.equal(state.isAuthenticated, true)
  store.clearSession()
})

test('a fresh document can hydrate cookie session metadata without a stored token', () => {
  const store = useAuthStore.getState()
  store.clearSession()
  store.hydrate({ user })

  const state = useAuthStore.getState()
  assert.equal(state.accessToken, null)
  assert.equal(state.user.id, user.id)
  assert.equal(state.isAuthenticated, true)
  store.clearSession()
})

test('clearing a session remains logged out after the storage synchronizer runs', () => {
  const store = useAuthStore.getState()
  store.setSession({ accessToken: 'in-memory-test-credential', user })
  store.clearSession()
  store.hydrate({})

  const state = useAuthStore.getState()
  assert.equal(state.accessToken, null)
  assert.equal(state.user, null)
  assert.equal(state.isAuthenticated, false)
  assert.equal(state.hydrated, true)
})
