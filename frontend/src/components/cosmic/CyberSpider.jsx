'use client'

import { useEffect, useRef } from 'react'

const CARD_SELECTOR = '.recipe-summary-card, .recipe-card, .home-recipe-grid article, .category-tile, .category-card, .home-sidebar'
const PALETTES = {
  cyan: { primary: '#73f3ff', secondary: '#b18cff' },
  purple: { primary: '#d0a3ff', secondary: '#ff8ae1' },
  emerald: { primary: '#70ffc4', secondary: '#7dcfff' },
}

/** Eight two-bone IK legs, planted feet, and a 3D rig projected onto canvas. */
export default function CyberSpider() {
  const canvasRef = useRef(null)
  const hudRef = useRef(null)
  const scannerRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const hud = hudRef.current
    const scanner = scannerRef.current
    const context = canvas?.getContext('2d', { alpha: true })
    if (!context || !hud || !scanner || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let width = window.innerWidth, height = window.innerHeight
    let animationId = 0, lastTime = 0, elapsed = 0
    let fpsFrames = 0, fpsStarted = 0
    let heading = -.6, active = false, initialized = false
    let selectedCard = null, selectedBounds = null, hudWidth = 300
    let palette = PALETTES.cyan
    let density = 1
    const tileWidth = 320, tileHeight = 280
    const pointer = { x: width / 2, y: height / 2 }
    const body = { ...pointer }
    const legs = Array.from({ length: 8 }, (_, index) => ({
      side: index < 4 ? -1 : 1, pair: index % 4, parity: index % 2,
      x: 0, y: 0, fromX: 0, fromY: 0, toX: 0, toY: 0, step: 1,
    }))
    const syncPalette = () => { palette = PALETTES[document.documentElement.dataset.cosmicPalette] || PALETTES.cyan }
    const paletteObserver = new MutationObserver(syncPalette)
    paletteObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-cosmic-palette'] })
    syncPalette()

    const resize = () => {
      width = window.innerWidth; height = window.innerHeight
      density = Math.min(window.devicePixelRatio || 1, 1.25)
      // Upload a small sprite texture instead of a viewport-sized transparent
      // texture on every frame. Its position is a compositor-only transform.
      canvas.width = Math.round(tileWidth * density); canvas.height = Math.round(tileHeight * density)
      context.setTransform(density, 0, 0, density, 0, 0)
      selectedBounds = selectedCard?.getBoundingClientRect() || null
    }
    const rotate = (x, y) => ({ x: body.x + x * Math.cos(heading) - y * Math.sin(heading), y: body.y + x * Math.sin(heading) + y * Math.cos(heading) })
    const project = (point) => {
      const scale = 600 / (600 - point.z)
      return { x: body.x + (point.x - body.x) * scale, y: body.y + (point.y - body.y) * .88 * scale - point.z * .72 }
    }
    const footTarget = (leg) => rotate([-62, -25, 25, 66][leg.pair], leg.side * [58, 85, 86, 62][leg.pair])
    const hipTarget = (leg) => ({ ...rotate((leg.pair - 1.5) * 10, leg.side * 11), z: 21 + Math.sin(elapsed * .003) * 1.5 })
    const strokeSegment = (points, color, opacity, lineWidth) => {
      context.beginPath()
      points.forEach((point, index) => { const p = project(point); if (index === 0) context.moveTo(p.x, p.y); else context.lineTo(p.x, p.y) })
      context.strokeStyle = color; context.globalAlpha = opacity; context.lineWidth = lineWidth; context.stroke()
    }
    const joint = (point, radius, color) => {
      const p = project(point)
      context.beginPath(); context.arc(p.x, p.y, radius, 0, Math.PI * 2)
      context.fillStyle = '#0a152c'; context.fill()
      context.strokeStyle = color; context.lineWidth = 1.15; context.stroke()
    }
    const drawLeg = (leg, delta, index, speed) => {
      const target = footTarget(leg)
      const distance = Math.hypot(target.x - leg.x, target.y - leg.y)
      // Alternate planted feet instead of sliding every leg with the body.
      if (leg.step >= 1 && distance > 20 && (Math.floor(elapsed / 95) % 2 === leg.parity || distance > 65)) {
        leg.fromX = leg.x; leg.fromY = leg.y; leg.toX = target.x; leg.toY = target.y; leg.step = 0
      }
      leg.step = Math.min(1, leg.step + delta / (130 + index * 2))
      const ease = leg.step * leg.step * (3 - 2 * leg.step)
      leg.x = leg.fromX + (leg.toX - leg.fromX) * ease; leg.y = leg.fromY + (leg.toY - leg.fromY) * ease
      const hip = hipTarget(leg)
      const foot = { x: leg.x, y: leg.y, z: Math.sin(leg.step * Math.PI) * Math.min(14, 8 + speed * 1.7) }
      const dx = foot.x - hip.x, dy = foot.y - hip.y, dz = foot.z - hip.z
      const length = Math.max(1, Math.hypot(dx, dy, dz)), upper = 65, lower = 69
      const d = Math.min(length, upper + lower - .01)
      const along = (upper * upper - lower * lower + d * d) / (2 * d)
      const bend = Math.sqrt(Math.max(0, upper * upper - along * along))
      const direction = { x: dx / length, y: dy / length, z: dz / length }
      const pole = { x: -direction.y * leg.side * .45, y: direction.x * leg.side * .45, z: 1 }
      const dot = pole.x * direction.x + pole.y * direction.y + pole.z * direction.z
      pole.x -= dot * direction.x; pole.y -= dot * direction.y; pole.z -= dot * direction.z
      const poleLength = Math.hypot(pole.x, pole.y, pole.z) || 1
      const knee = { x: hip.x + direction.x * along + pole.x / poleLength * bend, y: hip.y + direction.y * along + pole.y / poleLength * bend, z: hip.z + direction.z * along + pole.z / poleLength * bend }
      const color = index % 2 ? palette.secondary : palette.primary
      context.shadowColor = color; context.shadowBlur = 8
      strokeSegment([hip, knee, foot], color, .62, 1.7)
      context.shadowBlur = 0
      strokeSegment([hip, knee, foot], '#d6fbff', .55, .65)
      context.globalAlpha = .85; joint(knee, 2.5, color); joint(foot, 1.7, color)
    }
    const drawBody = () => {
      const center = project({ ...body, z: 24 })
      context.save(); context.translate(center.x, center.y); context.rotate(heading)
      context.shadowColor = palette.primary; context.shadowBlur = 12; context.globalAlpha = .85
      context.fillStyle = '#091526'; context.strokeStyle = palette.primary; context.lineWidth = 1.5
      context.beginPath(); context.ellipse(-13, 0, 21, 13, 0, 0, Math.PI * 2); context.fill(); context.stroke()
      context.beginPath(); context.moveTo(5, -11); context.lineTo(20, -8); context.lineTo(25, 0); context.lineTo(20, 8); context.lineTo(5, 11); context.lineTo(-1, 0); context.closePath(); context.fill(); context.stroke()
      context.shadowBlur = 0; context.globalAlpha = .65; context.strokeStyle = palette.secondary; context.lineWidth = .8
      context.beginPath(); context.ellipse(-13, 0, 13, 8, 0, 0, Math.PI * 2); context.stroke()
      context.beginPath(); context.moveTo(-26, 0); context.lineTo(14, 0); context.stroke()
      context.fillStyle = palette.primary; context.globalAlpha = .95
      context.beginPath(); context.arc(18, -4.5, 2, 0, Math.PI * 2); context.arc(18, 4.5, 2, 0, Math.PI * 2); context.fill(); context.restore()
    }
    const drawScanner = () => {
      if (!selectedBounds || !selectedCard?.isConnected) return
      const center = project({ ...body, z: 27 })
      const scanY = selectedBounds.top + ((elapsed * .06) % Math.max(1, selectedBounds.height))
      const left = Math.max(0, selectedBounds.left), right = Math.min(width, selectedBounds.right)
      if (right <= left || scanY < 0 || scanY > height) { scanner.hidden = true; return }
      scanner.hidden = false
      scanner.style.width = `${right - left}px`
      scanner.style.transform = `translate3d(${Math.round(left)}px, ${Math.round(scanY)}px, 0)`
      context.shadowBlur = 0; context.globalAlpha = .19; context.strokeStyle = palette.primary; context.lineWidth = 1
      context.globalAlpha = .12
      context.beginPath(); context.moveTo(center.x, center.y); context.lineTo(Math.max(left + 12, Math.min(right - 12, center.x)), scanY); context.stroke()
    }
    const render = (time) => {
      animationId = 0
      if (!active || document.hidden) return
      const delta = Math.min(time - lastTime || 16.67, 33.34)
      lastTime = time; elapsed += delta
      context.setTransform(density, 0, 0, density, 0, 0)
      context.clearRect(0, 0, tileWidth, tileHeight)
      if (selectedCard && !selectedCard.isConnected) { selectedCard = null; selectedBounds = null; hud.hidden = true; scanner.hidden = true }
      const targetX = Math.max(105, Math.min(width - 105, pointer.x - 46)), targetY = Math.max(85, Math.min(height - 65, pointer.y + 50))
      const moveX = (targetX - body.x) * (1 - Math.exp(-delta / 90)), moveY = (targetY - body.y) * (1 - Math.exp(-delta / 90))
      const speed = Math.hypot(moveX, moveY)
      body.x += moveX; body.y += moveY
      const originX = Math.round(body.x - tileWidth / 2), originY = Math.round(body.y - tileHeight / 2)
      canvas.style.transform = `translate3d(${originX}px, ${originY}px, 0)`
      context.translate(-originX, -originY)
      if (speed > .6) { const desired = Math.atan2(moveY, moveX); heading += Math.atan2(Math.sin(desired - heading), Math.cos(desired - heading)) * .055 }
      drawScanner(); legs.forEach((leg, index) => drawLeg(leg, delta, index, speed)); drawBody(); context.globalAlpha = 1
      const hudX = Math.max(12, Math.min(width - hudWidth - 12, pointer.x + 28)), hudY = pointer.y > height - 88 ? pointer.y - 65 : pointer.y + 23
      hud.style.transform = `translate3d(${Math.round(hudX)}px, ${Math.round(hudY)}px, 0)`
      fpsFrames += 1
      if (time - fpsStarted >= 1000) { canvas.dataset.renderFps = String(Math.round(fpsFrames * 1000 / (time - fpsStarted))); fpsFrames = 0; fpsStarted = time }
      animationId = window.requestAnimationFrame(render)
    }
    const start = () => { if (!animationId && active && !document.hidden) { lastTime = 0; fpsFrames = 0; fpsStarted = performance.now(); animationId = window.requestAnimationFrame(render) } }
    const onMove = (event) => {
      if (event.pointerType === 'touch') return
      pointer.x = event.clientX; pointer.y = event.clientY
      if (!initialized) {
        body.x = pointer.x - 46; body.y = pointer.y + 50
        legs.forEach((leg) => { const target = footTarget(leg); leg.x = target.x; leg.y = target.y; leg.fromX = target.x; leg.fromY = target.y; leg.toX = target.x; leg.toY = target.y })
        initialized = true
      }
      active = true
      const card = event.target.closest?.(CARD_SELECTOR) || null
      if (card !== selectedCard) {
        selectedCard = card; selectedBounds = card?.getBoundingClientRect() || null
        const title = card?.querySelector('h2, h3')?.textContent?.trim()
        const metadata = card?.querySelector('.recipe-card-meta, .home-recipe-content small, .category-tile-content small')?.textContent?.replace(/\s+/g, ' ').trim()
        hud.textContent = title ? `[ Đang phân tích: ${title}${metadata ? ` · ${metadata}` : ''} ]` : ''
        hud.hidden = !title; scanner.hidden = !title; hudWidth = Math.min(340, Math.max(230, hud.offsetWidth || 300))
      }
      start()
    }
    const stop = () => { active = false; window.cancelAnimationFrame(animationId); animationId = 0; context.setTransform(density, 0, 0, density, 0, 0); context.clearRect(0, 0, tileWidth, tileHeight); hud.hidden = true; scanner.hidden = true; selectedCard = null; selectedBounds = null }
    const onVisibility = () => { window.cancelAnimationFrame(animationId); animationId = 0; if (document.hidden) { hud.hidden = true; scanner.hidden = true } else { hud.hidden = !selectedCard; start() } }
    const onScroll = () => { selectedBounds = selectedCard?.getBoundingClientRect() || null }
    resize()
    window.addEventListener('resize', resize, { passive: true }); document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', stop, { passive: true }); window.addEventListener('blur', stop)
    window.addEventListener('scroll', onScroll, { passive: true, capture: true }); document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.cancelAnimationFrame(animationId); paletteObserver.disconnect()
      window.removeEventListener('resize', resize); document.removeEventListener('pointermove', onMove); document.removeEventListener('pointerleave', stop)
      window.removeEventListener('blur', stop); window.removeEventListener('scroll', onScroll, true); document.removeEventListener('visibilitychange', onVisibility)
      context.setTransform(density, 0, 0, density, 0, 0)
      context.clearRect(0, 0, tileWidth, tileHeight)
    }
  }, [])

  return <>
    <canvas ref={canvasRef} className="cyber-spider-canvas" aria-hidden="true" style={{ position: 'fixed', left: 0, top: 0, width: 320, height: 280, pointerEvents: 'none', zIndex: 30, willChange: 'transform', contain: 'strict' }} />
    <div ref={scannerRef} className="cyber-spider-scan" aria-hidden="true" hidden />
    <div ref={hudRef} className="cyber-spider-hud" aria-hidden="true" hidden style={{ position: 'fixed', left: 0, top: 0, pointerEvents: 'none', zIndex: 31, maxWidth: 'min(340px, calc(100vw - 24px))' }} />
  </>
}
