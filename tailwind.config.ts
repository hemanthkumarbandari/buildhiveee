import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './three/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ice:     '#d4ecff',
        snow:    '#f8fafc',
        mist:    '#bae6fd',
        glacier: '#63b8ff',
        deep:    '#3f9cff',
        night:   '#081421',
      },
      fontFamily: {
        display: ['var(--font-outfit)', 'sans-serif'],
        body:    ['var(--font-plus-jakarta)', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        pulse3d: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':      { transform: 'scale(1.12)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-14px)' },
        },
        'spin-slow': {
          '0%':   { transform: 'rotateY(0deg) rotateX(12deg)' },
          '100%': { transform: 'rotateY(360deg) rotateX(12deg)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        shimmer:     'shimmer 2.4s linear infinite',
        pulse3d:     'pulse3d 2.5s ease-in-out infinite',
        float:       'float 4s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
        marquee:     'marquee 18s linear infinite',
      },
      backgroundImage: {
        'ice-gradient':    'linear-gradient(135deg, #eaf7fd 0%, #d6f0fb 50%, #b8e4f7 100%)',
        'night-gradient':  'linear-gradient(180deg, #0d3a52 0%, #1a5f7a 100%)',
        'glacier-glow':    'radial-gradient(ellipse at center, rgba(125,201,232,0.35) 0%, transparent 70%)',
      },
      boxShadow: {
        glass:  '0 8px 32px rgba(26,95,122,0.12), inset 0 1px 0 rgba(255,255,255,0.6)',
        'glass-hover': '0 28px 64px rgba(26,95,122,0.18), inset 0 1px 0 rgba(255,255,255,0.7)',
        ice:    '0 4px 24px rgba(125,201,232,0.25)',
        deep:   '0 20px 60px rgba(13,58,82,0.25)',
      },
      backdropBlur: {
        xs: '4px',
      },
    },
  },
  plugins: [],
}

export default config
