/** @type {import('next').NextConfig} */
const config = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's0.wp.com',
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(glsl|vert|frag)$/,
      exclude: /node_modules/,
      use: 'raw-loader',
    })
    return config
  },
  experimental: {
    optimizePackageImports: [
      'three',
      'framer-motion',
      'gsap',
      '@react-three/fiber',
    ],
  },
}

export default config
