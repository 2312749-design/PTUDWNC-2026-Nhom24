'use client'

import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from 'react'
import { CosmicContext } from './cosmic-preferences'
import CosmicCanvas from './CosmicCanvas'
import CyberSpider from './CyberSpider'
import { createSciFiAudio } from '../../lib/sci-fi-audio'

const STORAGE_KEY = 'culinary:cosmic-preferences'
const PREFERENCES_EVENT = 'culinary:cosmic-preferences-changed'
const defaults = Object.freeze({ soundEnabled: true, effectsEnabled: true, effectsOverride: false, spiderEnabled: true, sfxVolume: 1, boost: false, palette: 'cyan' })
let cachedRaw
let cachedPreferences = defaults

function readPreferences() {
  let raw = null
  try { raw = window.localStorage.getItem(STORAGE_KEY) } catch { return cachedPreferences }
  if (raw === cachedRaw) return cachedPreferences
  cachedRaw = raw
  try {
    const value = raw ? JSON.parse(raw) : {}
    cachedPreferences = {
      soundEnabled: value.soundEnabled !== false,
      effectsEnabled: value.effectsEnabled !== false,
      effectsOverride: value.effectsOverride === true,
      spiderEnabled: value.spiderEnabled !== false,
      sfxVolume: Number.isFinite(value.sfxVolume) ? Math.min(1, Math.max(0, value.sfxVolume)) : 1,
      boost: value.boost === true,
      palette: ['cyan', 'purple', 'emerald'].includes(value.palette) ? value.palette : 'cyan',
    }
  } catch { cachedPreferences = defaults }
  return cachedPreferences
}

function subscribePreferences(onChange) {
  window.addEventListener('storage', onChange)
  window.addEventListener(PREFERENCES_EVENT, onChange)
  return () => { window.removeEventListener('storage', onChange); window.removeEventListener(PREFERENCES_EVENT, onChange) }
}

function writePreferences(patch) {
  cachedPreferences = { ...readPreferences(), ...patch }
  cachedRaw = JSON.stringify(cachedPreferences)
  try { window.localStorage.setItem(STORAGE_KEY, cachedRaw) } catch { /* Settings still apply for this visit. */ }
  window.dispatchEvent(new Event(PREFERENCES_EVENT))
}

const subscribeMotion = (onChange) => {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}
const readMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const interactiveSelector = 'a, button, summary, [role="button"], [role="tab"], .feed-post, .editorial-card, .recipe-card, .recipe-summary-card, .category-tile, .home-sidebar, .home-recipe-grid article'
const tiltSelector = '.feed-post, .editorial-card, .recipe-card, .recipe-summary-card, .category-tile, .home-sidebar, .home-recipe-grid article, .member-card'

export default function CosmicExperienceProvider({ children }) {
  const preferences = useSyncExternalStore(subscribePreferences, readPreferences, () => defaults)
  const reducedMotion = useSyncExternalStore(subscribeMotion, readMotion, () => false)
  // Respect the OS default until the visitor explicitly chooses their setting.
  const effectsEnabled = preferences.effectsEnabled && (!reducedMotion || preferences.effectsOverride)
  const audioRef = useRef(null)
  const playSfx = useCallback((kind = 'click') => {
    if (!readPreferences().soundEnabled) return
    audioRef.current?.unlock()
    audioRef.current?.[kind]?.()
  }, [])
  const toggleSound = useCallback(() => {
    const enabled = !readPreferences().soundEnabled
    writePreferences({ soundEnabled: enabled })
    if (enabled) { audioRef.current?.unlock(); audioRef.current?.click() }
  }, [])
  const toggleEffects = useCallback(() => {
    const current = readPreferences()
    const active = current.effectsEnabled && (!reducedMotion || current.effectsOverride)
    writePreferences({ effectsEnabled: !active, effectsOverride: true })
  }, [reducedMotion])
  const toggleSpider = useCallback(() => writePreferences({ spiderEnabled: !readPreferences().spiderEnabled }), [])
  const setSfxVolume = useCallback((value) => writePreferences({ sfxVolume: Math.max(0, Math.min(1, Number(value) || 0)) }), [])
  const toggleBoost = useCallback(() => writePreferences({ boost: !readPreferences().boost }), [])
  const setPalette = useCallback((palette) => {
    if (!['cyan', 'purple', 'emerald'].includes(palette)) return
    writePreferences({ palette })
    playSfx('power')
  }, [playSfx])

  useEffect(() => {
    document.documentElement.dataset.cosmicEffects = effectsEnabled ? 'on' : 'off'
  }, [effectsEnabled])

  useEffect(() => {
    document.documentElement.dataset.cosmicPalette = preferences.palette
  }, [preferences.palette])

  useEffect(() => {
    audioRef.current?.setVolume(preferences.sfxVolume)
    audioRef.current?.setBoost(preferences.boost)
    audioRef.current?.setEnabled(preferences.soundEnabled)
  }, [preferences.sfxVolume, preferences.boost, preferences.soundEnabled])

  useEffect(() => {
    const audio = createSciFiAudio()
    audioRef.current = audio
    const current = readPreferences()
    audio.setVolume(current.sfxVolume)
    audio.setBoost(current.boost)
    audio.setEnabled(current.soundEnabled)
    const onUnlock = (event) => {
      if (!readPreferences().soundEnabled || event.target.closest?.('[data-cosmic-sound-control]')) return
      audio.unlock()
    }
    const onHover = (event) => {
      if (!readPreferences().soundEnabled || event.pointerType === 'touch') return
      const element = event.target.closest?.(interactiveSelector)
      if (!element || element.contains(event.relatedTarget) || element.matches(':disabled')) return
      audio.hover()
    }
    const onClick = (event) => {
      if (!readPreferences().soundEnabled || event.target.closest?.('[data-cosmic-sound-control]')) return
      if (!event.target.closest?.('a, button, summary, [role="button"], [role="tab"]')) return
      audio.unlock()
      const kind = event.target.closest?.('[data-cosmic-sfx]')?.dataset.cosmicSfx || 'click'
      if (typeof audio[kind] === 'function') audio[kind]()
    }
    const onTyping = (event) => {
      if (!readPreferences().soundEnabled || event.isComposing || event.ctrlKey || event.metaKey || event.altKey) return
      const target = event.target
      if (!target.matches?.('input[type="search"], input[data-cosmic-search], input[placeholder*="Tìm"], input[placeholder*="tìm"]')) return
      if (event.key.length !== 1 && !['Backspace', 'Delete'].includes(event.key)) return
      audio.unlock()
      audio.typing()
    }
    const onSfx = (event) => {
      if (!readPreferences().soundEnabled) return
      const kind = event.detail?.kind
      if (['power', 'roulette', 'jackpot'].includes(kind)) { audio.unlock(); audio[kind]() }
    }
    document.addEventListener('pointerdown', onUnlock, { passive: true, capture: true })
    document.addEventListener('pointerover', onHover, { passive: true })
    document.addEventListener('click', onClick, { passive: true, capture: true })
    document.addEventListener('keydown', onTyping, { passive: true })
    window.addEventListener('culinary:sfx', onSfx)
    return () => {
      audio.dispose()
      audioRef.current = null
      document.removeEventListener('pointerdown', onUnlock, true)
      document.removeEventListener('pointerover', onHover)
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('keydown', onTyping)
      window.removeEventListener('culinary:sfx', onSfx)
    }
  }, [])

  useEffect(() => {
    if (!effectsEnabled || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let hoveredCard = null
    let animationId = 0
    const reset = () => {
      if (!hoveredCard) return
      hoveredCard.style.removeProperty('--cosmic-tilt-x')
      hoveredCard.style.removeProperty('--cosmic-tilt-y')
      hoveredCard.style.removeProperty('--cosmic-pointer-x')
      hoveredCard.style.removeProperty('--cosmic-pointer-y')
      hoveredCard.removeAttribute('data-cosmic-tilt')
      hoveredCard = null
    }
    const onMove = (event) => {
      const card = event.target.closest?.(tiltSelector)
      if (card !== hoveredCard) { reset(); hoveredCard = card }
      window.cancelAnimationFrame(animationId)
      if (!card || event.pointerType === 'touch') return
      const { clientX, clientY } = event
      animationId = window.requestAnimationFrame(() => {
        if (!card.isConnected) { reset(); return }
        const bounds = card.getBoundingClientRect()
        const x = (clientX - bounds.left) / bounds.width - 0.5
        const y = (clientY - bounds.top) / bounds.height - 0.5
        card.style.setProperty('--cosmic-tilt-x', `${(-y * 8).toFixed(2)}deg`)
        card.style.setProperty('--cosmic-tilt-y', `${(x * 8).toFixed(2)}deg`)
        card.style.setProperty('--cosmic-pointer-x', `${((x + 0.5) * 100).toFixed(1)}%`)
        card.style.setProperty('--cosmic-pointer-y', `${((y + 0.5) * 100).toFixed(1)}%`)
        card.dataset.cosmicTilt = 'true'
      })
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', reset, { passive: true })
    window.addEventListener('blur', reset)
    return () => {
      window.cancelAnimationFrame(animationId)
      reset()
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', reset)
      window.removeEventListener('blur', reset)
    }
  }, [effectsEnabled])

  const value = useMemo(() => ({ ...preferences, effectsEnabled, reducedMotion, toggleSound, toggleEffects, toggleSpider, setSfxVolume, toggleBoost, setPalette, playSfx }), [preferences, effectsEnabled, reducedMotion, toggleSound, toggleEffects, toggleSpider, setSfxVolume, toggleBoost, setPalette, playSfx])
  return <CosmicContext.Provider value={value}>
    <div className="cosmic-backdrop" aria-hidden="true"><div className="cosmic-aurora" /><div className="cosmic-grid" /></div>
    {effectsEnabled && <CosmicCanvas />}
    {effectsEnabled && preferences.spiderEnabled && <CyberSpider />}
    {children}
  </CosmicContext.Provider>
}
