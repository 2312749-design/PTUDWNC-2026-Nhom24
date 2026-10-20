/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep development output separate from stale production build artifacts.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  reactStrictMode: true,
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig
