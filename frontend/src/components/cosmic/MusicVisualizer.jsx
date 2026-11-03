'use client'

import { useEffect, useRef } from 'react'
import { useMusicPlayer } from '../layout/music-player-context'
import { useCosmicPreferences } from './cosmic-preferences'

const BAR_COUNT = 32

export default function MusicVisualizer() {
  const rootRef = useRef(null)
  const barsRef = useRef([])
  const { isPlaying, getAnalysis } = useMusicPlayer()
  const { effectsEnabled } = useCosmicPreferences()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const station = root.closest('.home-music-player')
    let animationId = 0
    let visible = true
    let active = false
    let smoothedBass = 0
    const heights = new Float32Array(BAR_COUNT).fill(0.06)

    const reset = () => {
      barsRef.current.forEach((bar) => { if (bar) bar.style.transform = 'scaleY(0.06)' })
      station?.style.setProperty('--music-bass', '0')
      root.dataset.signal = 'idle'
    }
    const draw = () => {
      if (!active) return
      const { frequencyData, bass, available } = getAnalysis()
      smoothedBass += (bass - smoothedBass) * 0.24
      station?.style.setProperty('--music-bass', smoothedBass.toFixed(3))
      root.dataset.signal = available ? 'live' : 'unavailable'
      for (let index = 0; index < BAR_COUNT; index += 1) {
        const start = Math.floor(Math.pow(index / BAR_COUNT, 1.7) * frequencyData.length * 0.65)
        const end = Math.max(start + 1, Math.floor(Math.pow((index + 1) / BAR_COUNT, 1.7) * frequencyData.length * 0.65))
        let total = 0
        for (let bin = start; bin < end; bin += 1) total += frequencyData[bin] || 0
        const level = available ? Math.max(0.06, Math.min(1, total / ((end - start) * 255))) : 0.06
        heights[index] += (level - heights[index]) * (level > heights[index] ? 0.55 : 0.16)
        const bar = barsRef.current[index]
        if (bar) bar.style.transform = `scaleY(${heights[index].toFixed(3)})`
      }
      animationId = window.requestAnimationFrame(draw)
    }
    const sync = () => {
      const shouldRun = isPlaying && effectsEnabled && visible && !document.hidden
      if (shouldRun === active) return
      active = shouldRun
      window.cancelAnimationFrame(animationId)
      if (active) animationId = window.requestAnimationFrame(draw)
      else reset()
    }
    const observer = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() }, { threshold: 0.01 }) : null
    observer?.observe(root)
    document.addEventListener('visibilitychange', sync)
    reset()
    sync()
    return () => {
      active = false
      window.cancelAnimationFrame(animationId)
      observer?.disconnect()
      document.removeEventListener('visibilitychange', sync)
      reset()
    }
  }, [isPlaying, effectsEnabled, getAnalysis])

  return <div ref={rootRef} className="music-visualizer" data-playing={isPlaying} role="img" aria-label={isPlaying ? 'Sóng nhạc neon theo tần số bài hát đang phát' : 'Sóng nhạc đang tạm dừng'}>
    <div className="music-visualizer__bars" aria-hidden="true">{Array.from({ length: BAR_COUNT }, (_, index) => <i key={index} ref={(bar) => { barsRef.current[index] = bar }} className="music-visualizer__bar" style={{ '--bar-index': index, transform: 'scaleY(0.06)' }} />)}</div>
  </div>
}
