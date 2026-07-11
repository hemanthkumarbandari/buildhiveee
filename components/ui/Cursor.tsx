'use client'

import { useEffect, useRef } from 'react'

/**
 * Cursor — renders a small white dot exactly at the tip (hotspot) of the default OS cursor.
 * Uses zero React re-renders and has zero bundle weight.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return

    const onMove = (e: MouseEvent) => {
      // Center the 8px dot exactly at the mouse pointer coordinate (the tip)
      dot.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <div
      ref={dotRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        willChange: 'transform',
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: '#ffffffff', // Royal Blue
        zIndex: 9999,
      }}
    />
  )
}


