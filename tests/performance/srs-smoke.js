import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  scenarios: {
    public_browse: {
      executor: 'constant-vus',
      vus: Number(__ENV.VUS || 100),
      duration: __ENV.DURATION || '30s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    checks: ['rate>0.99'],
  },
}

const baseUrl = __ENV.BASE_URL || 'http://localhost'

export default function () {
  const health = http.get(`${baseUrl}/health`)
  check(health, { 'health is 200': (response) => response.status === 200 })

  const recipes = http.get(`${baseUrl}/api/v1/recipes?page=1&pageSize=12`)
  check(recipes, {
    'recipes is 200': (response) => response.status === 200,
    'recipes is JSON': (response) => response.headers['Content-Type']?.includes('application/json'),
  })
  sleep(1)
}

