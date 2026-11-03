import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  workers: 1,
  use: { baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000', headless: true, trace: 'retain-on-failure' },
  webServer: process.env.E2E_EXTERNAL_SERVER ? undefined : {
    command: 'npm run start -- --port 3000', url: 'http://localhost:3000', reuseExistingServer: !process.env.CI,
  },
})
