'use client'

import { useEffect, useMemo, useState } from 'react'

const SNOW_CHARS = ['❄', '❅', '❆', '✻', '❄', '❅', '❆', '✻']
const DEFAULT_FLAKE_COUNT = 40

interface Flake {
  id: number
  char: string
  size: number
  left: number
  opacity: number
  duration: number
  delay: number
}

function createFlakes(count: number): Flake[] {
  return Array.from({ length: count }, (_, id) => {
    const duration = Math.random() * 10 + 20
    // Negative delay makes the CSS animation start mid-way through,
    // ensuring the screen is already filled with snow on page load.
    const delay = -(Math.random() * duration)
    
    return {
      id,
      char: SNOW_CHARS[Math.floor(Math.random() * SNOW_CHARS.length)],
      size: Math.random() * 12 + 10,
      left: Math.random() * 96 + 2,
      opacity: Math.random() * 0.35 + 0.45,
      duration,
      delay,
    }
  })
}

export default function SnowEffect({ count = DEFAULT_FLAKE_COUNT }: { count?: number }) {
  const [mounted, setMounted] = useState(false)
  const flakes = useMemo(() => (mounted ? createFlakes(count) : []), [mounted, count])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="hero-snow-container" aria-hidden>
      {flakes.map((flake) => (
        <span
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            top: '-24px',
            fontSize: `${flake.size}px`,
            ['--flake-opacity' as string]: String(flake.opacity),
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
          }}
        >
          {flake.char}
        </span>
      ))}
    </div>
  )
}
