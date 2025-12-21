/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization for Hostinger
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'snapgo.in',
      },
      {
        protocol: 'https',
        hostname: 'snapgo.co.in',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
    // Use unoptimized for static hosting on Hostinger
    // Set to true if not using Vercel or other platforms with image optimization
    unoptimized: process.env.NODE_ENV === 'production' && !process.env.VERCEL,
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', '@react-three/drei', 'framer-motion'],
  },

  // Compression
  compress: true,

  // Strict mode for better development
  reactStrictMode: true,

  // Trailing slash for better static hosting compatibility
  trailingSlash: true,

  // Powered by header
  poweredByHeader: false,

  // Generate ETags for caching
  generateEtags: true,

  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        // Cache static assets
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache fonts
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
