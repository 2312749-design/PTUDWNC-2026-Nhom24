'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

export const MUSIC_TRACKS = [
  {
    id: 'exs-hate-me-2-neyun-drill',
    src: '/music/exs-hate-me-2-neyun-drill.mp3',
    cover: '/music/exs-hate-me-cover.png',
    title: "Ex's Hate Me 2 (Neyun Drill)",
    artists: 'Phiên bản Neyun Drill',
  },
]

const MusicPlayerContext = createContext(null)

// A media element may only be wrapped by createMediaElementSource once.
// Keeping the graph against the actual element also survives track changes.
const musicGraphs = new WeakMap()

async function prepareMusicGraph(audio) {
  const existing = musicGraphs.get(audio)
  if (existing) {
    if (existing.context.state !== 'running' && existing.context.state !== 'closed') {
      try { await existing.context.resume() } catch { /* Native playback still gets its own play request. */ }
    }
    return existing.ready
  }
  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  if (!AudioContextClass) return null

  let context
  try { context = new AudioContextClass({ latencyHint: 'playback' }) } catch { return null }
  const graph = { context, analyser: null, source: null, frequencyData: new Uint8Array(512), available: false, ready: null }
  musicGraphs.set(audio, graph)
  graph.ready = (async () => {
    try {
      if (context.state !== 'running') await context.resume()
      // Do not reroute native playback until the Web Audio output is ready.
      if (context.state !== 'running') return graph
      const analyser = context.createAnalyser()
      analyser.fftSize = 1024
      analyser.smoothingTimeConstant = 0.78
      analyser.minDecibels = -88
      analyser.maxDecibels = -18
      analyser.connect(context.destination)
      const source = context.createMediaElementSource(audio)
      graph.source = source
      source.connect(analyser)
      graph.analyser = analyser
      graph.frequencyData = new Uint8Array(analyser.frequencyBinCount)
      graph.available = true
    } catch {
      // If analysis is unavailable, keep music audible through a direct path.
      if (graph.source) {
        try { graph.source.disconnect(); graph.source.connect(context.destination) } catch { /* Browser tears down graphs on page exit. */ }
      }
      graph.available = false
    }
    return graph
  })()
  return graph.ready
}

export function MusicPlayerProvider({ children }) {
  const audioRef = useRef(null)
  const analysisGraphRef = useRef(null)
  const analysisSnapshotRef = useRef({ frequencyData: new Uint8Array(512), bass: 0, available: false })
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolumeState] = useState(0.55)
  const [trackId, setTrackId] = useState(MUSIC_TRACKS[0].id)
  const resumeAfterTrackChange = useRef(false)
  const track = MUSIC_TRACKS.find((item) => item.id === trackId) || MUSIC_TRACKS[0]

  useEffect(() => {
    let initialVolume = 0.55
    try {
      const stored = window.localStorage.getItem('culinary:music-volume')
      const savedVolume = stored === null ? NaN : Number(stored)
      if (Number.isFinite(savedVolume) && savedVolume >= 0 && savedVolume <= 1) initialVolume = savedVolume
    } catch { /* Use the audible default when browser storage is unavailable. */ }
    setVolumeState(initialVolume)
    if (audioRef.current) audioRef.current.volume = initialVolume
  }, [])

  useEffect(() => () => {
    const graph = analysisGraphRef.current
    if (graph && graph.context.state !== 'closed') graph.context.close().catch(() => {})
  }, [])

  const togglePlayback = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      try {
        // Both operations begin in the trusted click handler. Playback does
        // not depend on analysis being available on the current device.
        const [analysis] = await Promise.all([prepareMusicGraph(audio), audio.play()])
        analysisGraphRef.current = analysis
      } catch {
        setIsPlaying(false)
      }
      return
    }
    audio.pause()
  }, [])

  const seek = useCallback((time) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(time)) return
    audio.currentTime = Math.min(Math.max(time, 0), Number.isFinite(audio.duration) ? audio.duration : time)
    setCurrentTime(audio.currentTime)
  }, [])

  const skip = useCallback((seconds) => {
    const audio = audioRef.current
    if (audio) seek(audio.currentTime + seconds)
  }, [seek])

  const setVolume = useCallback((nextVolume) => {
    const normalized = Math.min(Math.max(Number(nextVolume) || 0, 0), 1)
    setVolumeState(normalized)
    try { window.localStorage.setItem('culinary:music-volume', String(normalized)) } catch { /* Keep this visit's volume in memory. */ }
    if (audioRef.current) audioRef.current.volume = normalized
  }, [])

  const getAnalysis = useCallback(() => {
    const snapshot = analysisSnapshotRef.current
    const graph = analysisGraphRef.current
    if (!graph?.available || !graph.analyser || graph.context.state !== 'running' || audioRef.current?.paused) {
      snapshot.available = false
      snapshot.bass = 0
      snapshot.frequencyData.fill(0)
      return snapshot
    }
    graph.analyser.getByteFrequencyData(graph.frequencyData)
    let bass = 0
    // At FFT 1024 these bins cover roughly 43-258 Hz at a 44.1 kHz rate.
    for (let index = 1; index <= 6; index += 1) bass += graph.frequencyData[index]
    snapshot.frequencyData = graph.frequencyData
    snapshot.bass = Math.min(1, bass / (6 * 255))
    snapshot.available = true
    return snapshot
  }, [])

  const selectTrack = useCallback((nextTrackId) => {
    if (!MUSIC_TRACKS.some((item) => item.id === nextTrackId) || nextTrackId === trackId) return
    resumeAfterTrackChange.current = Boolean(audioRef.current && !audioRef.current.paused)
    setTrackId(nextTrackId)
  }, [trackId])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const shouldResume = resumeAfterTrackChange.current
    resumeAfterTrackChange.current = false
    setCurrentTime(0)
    setDuration(0)
    if (shouldResume) audio.play().catch(() => setIsPlaying(false))
  }, [track.id])

  const value = useMemo(() => ({ track, tracks: MUSIC_TRACKS, isPlaying, duration, currentTime, volume, togglePlayback, seek, skip, setVolume, selectTrack, getAnalysis }), [track, isPlaying, duration, currentTime, volume, togglePlayback, seek, skip, setVolume, selectTrack, getAnalysis])

  return <MusicPlayerContext.Provider value={value}>
    <audio
      ref={audioRef}
      src={track.src}
      preload="metadata"
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onEnded={() => { setIsPlaying(false); setCurrentTime(0) }}
      onLoadedMetadata={(event) => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)}
      onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
    />
    {children}
  </MusicPlayerContext.Provider>
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext)
  if (!context) throw new Error('useMusicPlayer phải được dùng trong MusicPlayerProvider.')
  return context
}
