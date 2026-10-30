'use client'

import { useEffect, useRef } from 'react'

export default function CosmicCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { alpha: true })
    if (!context) return
    let width = window.innerWidth
    let height = window.innerHeight
    let particles = []
    let ripples = []
    let frame = 0
    let lastTime = 0
    let animationId
    let hidden = document.hidden
    let fpsFrames = 0
    let fpsStarted = performance.now()
    let palette = ['103, 232, 249', '168, 139, 250', '52, 211, 153']
    const syncPalette = () => {
      const selected = document.documentElement.dataset.cosmicPalette
      palette = selected === 'purple' ? ['211, 163, 255', '255, 138, 225', '143, 164, 255'] : selected === 'emerald' ? ['112, 255, 196', '115, 221, 255', '183, 255, 164'] : ['103, 232, 249', '168, 139, 250', '52, 211, 153']
    }
    const paletteObserver = new MutationObserver(syncPalette)
    paletteObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-cosmic-palette'] })
    syncPalette()
    const pointer = { x: width * 0.7, y: height * 0.38, active: false }
    const follower = { x: pointer.x, y: pointer.y }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      // Nebula points intentionally use a soft lower-resolution texture;
      // crisp content and the projected companion retain their own resolution.
      const density = Math.min(window.devicePixelRatio || 1, 1.25) * .65
      canvas.width = Math.round(width * density)
      canvas.height = Math.round(height * density)
      context.setTransform(density, 0, 0, density, 0, 0)
      const count = Math.min(40, Math.max(18, Math.floor(width * height / 30000)))
      particles = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.24,
        vy: (Math.random() - 0.5) * 0.24,
        phase: Math.random() * Math.PI * 2,
        colorIndex: index % 3,
      }))
    }
    const onMove = (event) => { pointer.x = event.clientX; pointer.y = event.clientY; pointer.active = event.pointerType !== 'touch' }
    const onLeave = () => { pointer.active = false }
    const onClick = (event) => {
      ripples.push({ x: event.clientX, y: event.clientY, life: 0 })
      if (ripples.length > 5) ripples.shift()
    }
    const render = (time) => {
      if (hidden) return
      animationId = window.requestAnimationFrame(render)
      // Render with the display's requestAnimationFrame cadence, without
      // allocating React state or enforcing the previous 30 fps ceiling.
      const delta = Math.min((time - lastTime) / 16.67 || 1, 2)
      lastTime = time
      frame += delta
      context.clearRect(0, 0, width, height)
      follower.x += (pointer.x - follower.x) * 0.11
      follower.y += (pointer.y - follower.y) * 0.11

      if (pointer.active) {
        const halo = context.createRadialGradient(follower.x, follower.y, 0, follower.x, follower.y, 220)
        halo.addColorStop(0, `rgba(${palette[0]}, 0.09)`)
        halo.addColorStop(0.45, `rgba(${palette[1]}, 0.045)`)
        halo.addColorStop(1, `rgba(${palette[0]}, 0)`)
        context.fillStyle = halo
        context.fillRect(follower.x - 220, follower.y - 220, 440, 440)
      }

      particles.forEach((particle, index) => {
        const color = palette[particle.colorIndex]
        particle.x += particle.vx * delta
        particle.y += particle.vy * delta
        if (particle.x < -20) particle.x = width + 20
        if (particle.x > width + 20) particle.x = -20
        if (particle.y < -20) particle.y = height + 20
        if (particle.y > height + 20) particle.y = -20
        const dx = follower.x - particle.x
        const dy = follower.y - particle.y
        const distance = Math.hypot(dx, dy)
        if (pointer.active && distance < 210) {
          context.beginPath()
          context.moveTo(particle.x, particle.y)
          context.lineTo(follower.x, follower.y)
          context.strokeStyle = `rgba(${color}, ${0.22 * (1 - distance / 210)})`
          context.lineWidth = 0.7
          context.stroke()
        }
        for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
          const other = particles[nextIndex]
          const pairX = particle.x - other.x, pairY = particle.y - other.y
          const pairDistanceSquared = pairX * pairX + pairY * pairY
          if (pairDistanceSquared >= 13225) continue
          context.beginPath()
          context.moveTo(particle.x, particle.y)
          context.lineTo(other.x, other.y)
          context.strokeStyle = `rgba(${color}, ${0.10 * (1 - pairDistanceSquared / 13225)})`
          context.lineWidth = 0.6
          context.stroke()
        }
        context.beginPath()
        context.arc(particle.x, particle.y, pointer.active && distance < 160 ? 2 : 1.1, 0, Math.PI * 2)
        context.fillStyle = `rgba(${color}, ${0.35 + Math.sin(frame * 0.014 + particle.phase) * 0.2})`
        context.fill()
      })

      if (pointer.active) {
        const satellites = 9
        for (let index = 0; index < satellites; index += 1) {
          const angle = frame * 0.007 + index * Math.PI * 2 / satellites
          const radius = 24 + Math.sin(frame * 0.018 + index) * 9
          const x = follower.x + Math.cos(angle) * radius
          const y = follower.y + Math.sin(angle) * radius * 0.6
          context.beginPath()
          context.moveTo(follower.x, follower.y)
          context.lineTo(x, y)
          context.strokeStyle = `rgba(${palette[1]}, 0.25)`
          context.stroke()
          context.beginPath()
          context.arc(x, y, 1.7, 0, Math.PI * 2)
          context.fillStyle = `rgba(${palette[0]}, 0.65)`
          context.fill()
        }
      }

      ripples = ripples.filter((ripple) => ripple.life < 1)
      ripples.forEach((ripple) => {
        ripple.life += 0.013 * delta
        context.beginPath()
        context.arc(ripple.x, ripple.y, 8 + ripple.life * 135, 0, Math.PI * 2)
        context.strokeStyle = `rgba(${palette[0]}, ${(1 - ripple.life) * 0.45})`
        context.lineWidth = 1
        context.stroke()
      })
      fpsFrames += 1
      if (time - fpsStarted >= 1000) {
        canvas.dataset.renderFps = String(Math.round(fpsFrames * 1000 / (time - fpsStarted)))
        fpsFrames = 0
        fpsStarted = time
      }
    }
    const onVisibility = () => {
      hidden = document.hidden
      window.cancelAnimationFrame(animationId)
      if (!hidden) { lastTime = 0; fpsStarted = performance.now(); fpsFrames = 0; animationId = window.requestAnimationFrame(render) }
    }
    resize()
    animationId = window.requestAnimationFrame(render)
    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave, { passive: true })
    document.addEventListener('click', onClick, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.cancelAnimationFrame(animationId)
      paletteObserver.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('click', onClick)
      document.removeEventListener('visibilitychange', onVisibility)
      context.clearRect(0, 0, width, height)
    }
  }, [])

  return <canvas ref={canvasRef} className="cosmic-canvas" aria-hidden="true" />
}
