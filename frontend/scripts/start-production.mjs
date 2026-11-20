import { spawn } from 'node:child_process'
import { randomBytes } from 'node:crypto'

// A per-process secret lets startup invalidate HTML built without a running API.
// It is never included in browser bundles, files or logs.
const secret = randomBytes(32).toString('hex')
const args = process.argv.slice(2)
const portIndex = args.findIndex(value => value === '--port' || value === '-p')
const port = portIndex >= 0 ? args[portIndex + 1] : process.env.PORT || '3000'
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', ...args], {
  stdio: 'inherit', env: { ...process.env, INTERNAL_REVALIDATE_SECRET: secret },
})
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal))
child.on('exit', code => process.exit(code ?? 1))
for (let attempt = 0; attempt < 120; attempt++) {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/internal/revalidate`, {
      method: 'POST', headers: { Authorization: `Bearer ${secret}` }, signal: AbortSignal.timeout(3000),
    })
    if (response.ok) { console.log('Public page cache refreshed for this deployment.'); break }
  } catch { /* The server or API may still be starting. */ }
  await new Promise(resolve => setTimeout(resolve, 1000))
}
