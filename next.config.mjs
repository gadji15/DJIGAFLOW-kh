/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },

  // Image optimization
  images: {
    domains: ['placeholder.svg', 'images.unsplash.com', 'via.placeholder.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    unoptimized: true,
  },

  // Redirects for SEO
  async redirects() {
    return [
      // Legacy redirects
      {
        source: '/old-shop/:path*',
        destination: '/catalogue/:path*',
        permanent: true,
      },
      {
        source: '/old-admin/:path*',
        destination: '/admin/:path*',
        permanent: true,
      },
      // Common typos
      {
        source: '/catalouge',
        destination: '/catalogue',
        permanent: true,
      },
      {
        source: '/connextion',
        destination: '/connexion',
        permanent: true,
      },
    ]
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=60'
          },
        ],
      },
    ]
  },

  // Rewrites for API routes
  async rewrites() {
    return [
      {
        source: '/health',
        destination: '/api/health',
      },
      {
        source: '/monitor/:path*',
        destination: '/api/monitor/:path*',
      },
    ]
  },

  // Compression
  compress: true,

  // Power by header
  poweredByHeader: false,

  // Trailing slash
  trailingSlash: false,

  // Generate ETags
  generateEtags: true,

  // Output
  output: 'standalone',
}

export default nextConfig
