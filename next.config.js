/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  basePath: '/ghibli-recipes',
  assetPrefix: '/ghibli-recipes',
}

module.exports = nextConfig

