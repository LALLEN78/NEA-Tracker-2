/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  distDir: "out",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable features that don't work with static export
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
