/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Environment variables exposed to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000',
  },

  // Image optimization
  images: {
    domains: [],
    formats: ['image/webp'],
  },

  // Enable experimental features if needed
  experimental: {
    // Add experimental features here if required
  },
}

module.exports = nextConfig
