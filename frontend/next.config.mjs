/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep development output separate from stale production build artifacts.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  reactStrictMode: true,
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
