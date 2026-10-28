import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_BASE_URL ?? "http://localhost:5217"}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${process.env.API_BASE_URL ?? "http://localhost:5217"}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;