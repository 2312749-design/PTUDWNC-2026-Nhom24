import test from 'node:test'
import assert from 'node:assert/strict'
import { encodeRouteSegment } from '../src/api/route-segment.js'

test('Vietnamese slug works on initial load and an already escaped navigation', () => {
  const slug = 'sườn-non-kho-thơm'
  assert.equal(encodeRouteSegment(slug), encodeURIComponent(slug))
  assert.equal(encodeRouteSegment(encodeURIComponent(slug)), encodeURIComponent(slug))
  assert.equal(encodeRouteSegment('100% ngon'), '100%25%20ngon')
})
