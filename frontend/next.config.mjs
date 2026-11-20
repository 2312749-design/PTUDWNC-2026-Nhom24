const configuredImagePatterns = [process.env.NEXT_PUBLIC_API_BASE_URL, process.env.NEXT_PUBLIC_MEDIA_ORIGIN]
  .filter(Boolean)
  .flatMap(value => {
    try {
      const origin = new URL(value)
      return [{ protocol: origin.protocol.replace(':', ''), hostname: origin.hostname, port: origin.port, pathname: '/**' }]
    } catch {
      return []
    }
  })

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep development output separate from stale production build artifacts.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  reactStrictMode: true,
  images: {
    // The imported catalog already provides final CDN/MinIO URLs. Serve them
    // directly so a production rebuild cannot replace working images with a
    // failing Next.js optimizer request.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '5152', pathname: '/uploads/**' },
      { protocol: 'http', hostname: 'localhost', port: '9000', pathname: '/**' },
      { protocol: 'http', hostname: '127.0.0.1', port: '5152', pathname: '/uploads/**' },
      { protocol: 'http', hostname: '127.0.0.1', port: '9000', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'commons.wikimedia.org', pathname: '/**' },
      { protocol: 'https', hostname: 'upload.wikimedia.org', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.tgdd.vn', pathname: '/**' },
      { protocol: 'https', hostname: 'cdnv2.tgdd.vn', pathname: '/**' },
      ...configuredImagePatterns,
    ],
    qualities: [70, 75, 85],
  },
  turbopack: {
    root: process.cwd(),
  },
  // Windows can intermittently deny simultaneous creation of App Router
  // segment folders. A single static-generation worker keeps production
  // builds deterministic for this local/CI project.
  experimental: {
    cpus: 1,
  },
}

export default nextConfig
