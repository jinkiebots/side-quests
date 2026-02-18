/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/side-quests',
  images: {
    unoptimized: true,
  },
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: 'bottom-left',
  },
};

module.exports = nextConfig

