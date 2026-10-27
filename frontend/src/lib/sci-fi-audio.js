/** Gesture-unlocked, layered Web Audio SFX. This graph never fetches media. */
export function createSciFiAudio() {
  let context
  let volumeGain
  let noiseBuffer
  let unlocked = false
  let disposed = false
  let enabled = true
  let volume = 1
  let boost = false
  const voices = new Set()
  const lastPlayed = new Map()

  const updateVolume = () => {
    if (!context || !volumeGain) return
    volumeGain.gain.cancelScheduledValues(context.currentTime)
    volumeGain.gain.setTargetAtTime(enabled ? volume * (boost ? 1.45 : 1) : 0, context.currentTime, 0.012)
  }

  const unlock = () => {
    if (disposed || !enabled) return Promise.resolve(false)
    if (!context) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      if (!AudioContextClass) return Promise.resolve(false)
      try {
        context = new AudioContextClass({ latencyHint: 'interactive' })
        volumeGain = context.createGain()
        volumeGain.gain.value = volume * (boost ? 1.45 : 1)
        const master = context.createGain()
        master.gain.value = 0.75
        const compressor = context.createDynamicsCompressor()
        compressor.threshold.value = -17
        compressor.knee.value = 16
        compressor.ratio.value = 4
        compressor.attack.value = 0.003
        compressor.release.value = 0.14
        const limiter = context.createDynamicsCompressor()
        limiter.threshold.value = -2
        limiter.knee.value = 0
        limiter.ratio.value = 20
        limiter.attack.value = 0.001
        limiter.release.value = 0.08
        const ceiling = context.createGain()
        ceiling.gain.value = 0.94
        volumeGain.connect(master)
        master.connect(compressor)
        compressor.connect(limiter)
        limiter.connect(ceiling)
        ceiling.connect(context.destination)
        noiseBuffer = context.createBuffer(1, Math.ceil(context.sampleRate * 0.65), context.sampleRate)
        const samples = noiseBuffer.getChannelData(0)
        for (let index = 0; index < samples.length; index += 1) samples[index] = Math.random() * 2 - 1
      } catch {
        context?.close().catch(() => {})
        context = undefined
        return Promise.resolve(false)
      }
    }
    unlocked = true
    return (context.state === 'suspended' ? context.resume() : Promise.resolve())
      .then(() => context?.state === 'running')
      .catch(() => false)
  }

  const register = (source, nodes) => {
    const voice = { source, nodes }
    voices.add(voice)
    source.onended = () => {
      voices.delete(voice)
      source.disconnect()
      nodes.forEach((node) => node.disconnect())
    }
  }

  const oscillator = ({ frequency, endFrequency = frequency, type = 'sine', gain = 0.25, duration = 0.1, delay = 0, attack = 0.004, filterFrequency = 6000 }) => {
    if (voices.size > 48) return
    const start = context.currentTime + delay
    const source = context.createOscillator()
    const envelope = context.createGain()
    const filter = context.createBiquadFilter()
    source.type = type
    source.frequency.setValueAtTime(frequency, start)
    source.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), start + duration)
    filter.type = 'lowpass'
    filter.frequency.value = filterFrequency
    envelope.gain.setValueAtTime(0.0001, start)
    envelope.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), start + attack)
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    source.connect(filter)
    filter.connect(envelope)
    envelope.connect(volumeGain)
    register(source, [envelope, filter])
    source.start(start)
    source.stop(start + duration + 0.018)
  }

  const noise = ({ gain = 0.15, duration = 0.08, frequency = 3000, endFrequency = 700, delay = 0 }) => {
    if (voices.size > 48) return
    const start = context.currentTime + delay
    const source = context.createBufferSource()
    const filter = context.createBiquadFilter()
    const envelope = context.createGain()
    source.buffer = noiseBuffer
    filter.type = 'bandpass'
    filter.Q.value = 1.8
    filter.frequency.setValueAtTime(frequency, start)
    filter.frequency.exponentialRampToValueAtTime(endFrequency, start + duration)
    envelope.gain.setValueAtTime(0.0001, start)
    envelope.gain.exponentialRampToValueAtTime(gain, start + 0.002)
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    source.connect(filter)
    filter.connect(envelope)
    envelope.connect(volumeGain)
    register(source, [filter, envelope])
    source.start(start)
    source.stop(start + duration + 0.015)
  }

  const play = (kind) => {
    if (!unlocked || !enabled || disposed || !context) return
    const schedule = () => {
      if (!enabled || disposed || context?.state !== 'running') return
      const now = context.currentTime
      const minimumInterval = kind === 'hover' ? 0.085 : kind === 'typing' ? 0.055 : kind === 'roulette' ? 0.035 : 0.08
      if (now - (lastPlayed.get(kind) ?? -Infinity) < minimumInterval) return
      lastPlayed.set(kind, now)

      if (kind === 'hover') {
        oscillator({ frequency: 1450, endFrequency: 2150, gain: 0.28, duration: 0.065 })
        oscillator({ frequency: 2900, endFrequency: 2400, type: 'triangle', gain: 0.10, duration: 0.045, delay: 0.01 })
        noise({ gain: 0.13, duration: 0.025, frequency: 4700, endFrequency: 1900 })
      } else if (kind === 'click') {
        oscillator({ frequency: 165, endFrequency: 48, gain: 0.64, duration: 0.23, attack: 0.005 })
        oscillator({ frequency: 530, endFrequency: 170, type: 'triangle', gain: 0.24, duration: 0.11 })
        oscillator({ frequency: 1720, endFrequency: 840, gain: 0.17, duration: 0.05 })
        noise({ gain: 0.28, duration: 0.055, frequency: 3600, endFrequency: 650 })
      } else if (kind === 'power') {
        oscillator({ frequency: 150, endFrequency: 1050, type: 'sawtooth', gain: 0.19, duration: 0.42, attack: 0.055, filterFrequency: 2100 })
        oscillator({ frequency: 300, endFrequency: 2100, gain: 0.30, duration: 0.48, attack: 0.07 })
        oscillator({ frequency: 2200, endFrequency: 1600, gain: 0.18, duration: 0.19, delay: 0.30 })
        noise({ gain: 0.20, duration: 0.36, frequency: 380, endFrequency: 4500 })
      } else if (kind === 'typing') {
        noise({ gain: 0.28, duration: 0.025, frequency: 4200, endFrequency: 1100 })
        oscillator({ frequency: 900, endFrequency: 390, type: 'triangle', gain: 0.22, duration: 0.036 })
        oscillator({ frequency: 180, endFrequency: 130, gain: 0.17, duration: 0.04, delay: 0.006 })
      } else if (kind === 'roulette') {
        const pitch = 540 + Math.random() * 260
        oscillator({ frequency: pitch, endFrequency: pitch * 1.8, gain: 0.30, duration: 0.065 })
        noise({ gain: 0.20, duration: 0.025, frequency: 2600, endFrequency: 1200 })
      } else if (kind === 'jackpot') {
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]
        notes.forEach((frequency, index) => {
          oscillator({ frequency, type: 'triangle', gain: 0.25, duration: 0.38, delay: index * 0.075, attack: 0.013 })
          oscillator({ frequency: frequency * 2, gain: 0.10, duration: 0.28, delay: index * 0.075, attack: 0.015 })
        })
        oscillator({ frequency: 196, endFrequency: 98, gain: 0.45, duration: 0.55, delay: 0.30 })
        noise({ gain: 0.20, duration: 0.40, frequency: 1500, endFrequency: 7200, delay: 0.34 })
      }
    }
    if (context.state === 'suspended') context.resume().then(schedule).catch(() => {})
    else schedule()
  }

  const stopVoices = () => {
    voices.forEach(({ source }) => { try { source.stop() } catch { /* A voice can finish between events. */ } })
  }

  return {
    unlock,
    hover: () => play('hover'),
    click: () => play('click'),
    power: () => play('power'),
    typing: () => play('typing'),
    roulette: () => play('roulette'),
    jackpot: () => play('jackpot'),
    setVolume: (value) => { volume = Math.min(1, Math.max(0, Number(value) || 0)); updateVolume() },
    setBoost: (value) => { boost = Boolean(value); updateVolume() },
    setEnabled: (value) => { enabled = Boolean(value); if (!enabled) stopVoices(); updateVolume() },
    dispose: () => {
      disposed = true
      stopVoices()
      if (context && context.state !== 'closed') context.close().catch(() => {})
    },
  }
}
