/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  // basePath and assetPrefix are only needed for GitHub Pages deployment
  // Commented out for local development - uncomment before deploying
  // basePath: '/ghibli-recipes',
  // assetPrefix: '/ghibli-recipes',
}

module.exports = nextConfig

