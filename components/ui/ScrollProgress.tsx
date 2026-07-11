'use client'

import { useEffect, useRef } from 'react'
import { useScrollStore } from '@/store/scroll.store'

/**
 * ScrollProgress — reads from the existing Zustand scroll store (fed by Lenis)
 * instead of attaching a second scroll listener via framer-motion's useScroll.
 * Uses direct DOM style mutation — zero React re-renders on scroll.
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return useScrollStore.subscribe(
      (s) => s.scrollProgress,
      (progress) => {
        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${progress})`
        }
      }
    )
  }, [])

  return (
    <div
      ref={barRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, #7dc9e8, #b8e4f7, #7dc9e8)',
        transformOrigin: '0%',
        transform: 'scaleX(0)',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
  )
}

