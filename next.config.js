/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  basePath: '/dust-bunnies',
  assetPrefix: '/dust-bunnies',
}

module.exports = nextConfig

