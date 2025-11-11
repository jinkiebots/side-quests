/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/ghibli-recipes',
  images: {
    unoptimized: true,
  },
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: 'bottom-left',
  },
};

module.exports = nextConfig

