/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' for Vercel - it supports full Next.js features
  // Keep output: 'export' only if you want static export
  images: {
    unoptimized: false, // Vercel optimizes images automatically
  },
}

module.exports = nextConfig

