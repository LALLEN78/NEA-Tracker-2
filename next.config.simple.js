/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  distDir: "out",
  trailingSlash: true,
  basePath: "",
  assetPrefix: "",
  images: {
    unoptimized: true,
    loader: "custom",
    loaderFile: "./image-loader.js",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  swcMinify: false,
  experimental: {
    esmExternals: false,
  },
}

module.exports = nextConfig
