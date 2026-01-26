/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.vercel.app']
    }
  },

  // TypeScript configuration
  typescript: {
    // Enable strict mode
    ignoreBuildErrors: false
  },

  // ESLint configuration
  eslint: {
    // Don't run ESLint during builds (run separately)
    ignoreDuringBuilds: false
  },

  // Image optimization
  images: {
    // Enable image optimization
    formats: ['image/webp', 'image/avif'],
    // Add domains for external images
    domains: [
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com'
    ],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Image sizes for different breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          // CORS headers for MediaPipe
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          // Permissions Policy for camera/microphone
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      },
      // Cache headers for static assets
      {
        source: '/models/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/sounds/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  },

  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add support for Web Workers
    config.module.rules.push({
      test: /\.worker\.(js|ts)$/,
      use: {
        loader: 'worker-loader',
        options: {
          name: 'static/[hash].worker.js',
          publicPath: '/_next/'
        }
      }
    })

    // Add support for WebAssembly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true
    }

    // Optimize MediaPipe imports - removed problematic alias
    // config.resolve.alias = {
    //   ...config.resolve.alias,
    //   '@mediapipe/tasks-vision': '@mediapipe/tasks-vision/vision_bundle'
    // }

    // Add fallbacks for Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false
    }

    // Optimize bundle splitting
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          mediapipe: {
            test: /[\\/]node_modules[\\/]@mediapipe[\\/]/,
            name: 'mediapipe',
            chunks: 'all',
            priority: 10
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 5
          }
        }
      }
    }

    return config
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_VERSION: '3.0.0',
    NEXT_PUBLIC_APP_NAME: 'Silent-Connect'
  },

  // Redirects
  async redirects() {
    return []
  },

  // Rewrites for API routes
  async rewrites() {
    return [
      {
        source: '/api/health',
        destination: '/api/health/check'
      }
    ]
  },

  // Output configuration
  output: 'standalone',

  // Compression
  compress: true,

  // Power by header
  poweredByHeader: false,

  // Generate ETags
  generateEtags: true,

  // Page extensions
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

  // Trailing slash
  trailingSlash: false,

  // React strict mode
  reactStrictMode: true
}

export default nextConfig