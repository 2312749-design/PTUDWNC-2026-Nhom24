import { chromium } from '@playwright/test'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1500, height: 1150 } })
await page.emulateMedia({ reducedMotion: 'no-preference' })
await page.addInitScript(() => {
  const raf = window.requestAnimationFrame.bind(window)
  window.__rafCosts = {}
  window.requestAnimationFrame = (callback) => raf((time) => {
    const before = performance.now()
    callback(time)
    const key = `${callback.name}:${String(callback).slice(0, 70)}`
    const entry = window.__rafCosts[key] ||= { count: 0, total: 0, max: 0 }
    const duration = performance.now() - before
    entry.count += 1; entry.total += duration; entry.max = Math.max(entry.max, duration)
  })
})
const measurements = []
async function sample(name, css = '') {
  const style = css ? await page.addStyleTag({ content: css }) : null
  await page.waitForTimeout(300)
  const data = await page.evaluate(() => new Promise(resolve => {
    window.__rafCosts = {}
    const start = performance.now()
    let previous = start, count = 0, longest = 0
    function measure(now) {
      count += 1; longest = Math.max(longest, now - previous); previous = now
      if (now - start < 2000) { requestAnimationFrame(measure); return }
      resolve({ fps: +(count * 1000 / (now - start)).toFixed(1), longest: +longest.toFixed(1), callbacks: Object.entries(window.__rafCosts).map(([key, value]) => ({ key, average: +(value.total / value.count).toFixed(2), max: +value.max.toFixed(2) })).sort((a, b) => b.average - a.average).slice(0, 5) })
    }
    requestAnimationFrame(measure)
  }))
  measurements.push({ name, ...data })
  if (style) await style.evaluate(node => node.remove())
}
try {
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' })
  const card = page.locator('.home-recipe-grid article').first()
  await card.waitFor()
  await page.evaluate(() => document.fonts.ready)
  await page.getByRole('switch', { name: 'Hiệu ứng 3D', exact: true }).click()
  await sample('effects off')
  await page.getByRole('switch', { name: 'Hiệu ứng 3D', exact: true }).click()
  await page.getByRole('switch', { name: 'Nhện AI', exact: true }).click()
  await sample('background only')
  await page.getByRole('switch', { name: 'Nhện AI', exact: true }).click()
  await card.hover({ position: { x: 90, y: 60 } })
  await sample('background spider hover')
  await page.locator('.home-music-player__play').click()
  await card.hover({ position: { x: 90, y: 60 } })
  await sample('all + music')
  await sample('all no backdrop filters', '* { backdrop-filter:none !important; -webkit-backdrop-filter:none !important }')
  await sample('all no shadows', '* { box-shadow:none !important; text-shadow:none !important; filter:none !important }')
  await sample('all no CSS animations', '*:not(.Toastify *) { animation:none !important }')
  await sample('all hidden canvases', '.cosmic-canvas,.cyber-spider-canvas { visibility:hidden !important }')
  await page.mouse.move(1480, 1100)
  await sample('all no card hover')
  console.log(JSON.stringify(measurements, null, 2))
} finally { await browser.close() }
