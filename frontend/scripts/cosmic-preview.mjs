import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const output = resolve(process.cwd(), '..', 'artifacts', 'cosmic-vip')
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1500, height: 1150 } })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  const origin = process.env.E2E_BASE_URL || 'http://localhost:3000'
  await page.goto(origin, { waitUntil: 'domcontentloaded' })
  await page.locator('.home-recipe-grid article').first().waitFor()
  await page.evaluate(() => document.fonts.ready)
  await page.locator('.home-music-player__play').click()
  await page.locator('.music-visualizer[data-signal="live"]').waitFor()
  const card = page.locator('.home-recipe-grid article').first()
  await card.hover({ position: { x: 90, y: 60 } })
  const metrics = await page.evaluate(() => new Promise(resolveMetrics => {
    let frames = 0
    let longestFrame = 0
    const start = performance.now()
    let previous = start
    const sample = now => {
      frames += 1
      longestFrame = Math.max(longestFrame, now - previous)
      previous = now
      if (now - start < 2500) { requestAnimationFrame(sample); return }
      resolveMetrics({
        averageFps: Number((frames * 1000 / (now - start)).toFixed(1)),
        longestFrameMs: Number(longestFrame.toFixed(1)),
        backgroundFps: document.querySelector('.cosmic-canvas')?.dataset.renderFps,
        spiderFps: document.querySelector('.cyber-spider-canvas')?.dataset.renderFps,
        liveBars: document.querySelectorAll('.music-visualizer__bar').length,
      })
    }
    requestAnimationFrame(sample)
  }))
  await page.screenshot({ path: resolve(output, 'vip-desktop.png') })
  await page.getByRole('combobox', { name: 'Tông màu vũ trụ', exact: true }).selectOption('purple')
  await card.hover({ position: { x: 90, y: 60 } })
  await page.screenshot({ path: resolve(output, 'vip-purple.png') })
  await page.keyboard.press('Control+k')
  await page.getByRole('combobox', { name: 'Tìm kiếm nhanh', exact: true }).fill('canh')
  await page.locator('.cosmic-command-result').first().waitFor()
  await page.screenshot({ path: resolve(output, 'vip-command.png') })
  await page.keyboard.press('Escape')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({ path: resolve(output, 'vip-mobile.png') })
  console.log(JSON.stringify({ output, metrics, errors }, null, 2))
} finally {
  await browser.close()
}
