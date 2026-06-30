/** @type {import('next').NextConfig} */
const config = {
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
