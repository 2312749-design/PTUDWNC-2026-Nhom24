// App Router may supply an escaped segment during navigation. Encode exactly
// once so Vietnamese slugs resolve equally on first load and client navigation.
export function encodeRouteSegment(value) {
  let decoded = String(value)
  try { decoded = decodeURIComponent(decoded) } catch { /* Preserve literal %. */ }
  return encodeURIComponent(decoded)
}
