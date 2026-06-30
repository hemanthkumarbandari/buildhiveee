'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  const mouse = useRef({ x: 0, y: 0 })
  const outer = useRef({ x: 0, y: 0 })

  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    // Skip on touch-only devices
    if (window.matchMedia('(hover: none)').matches) return

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      // Inner dot — instant
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${e.clientX - 2.5}px, ${e.clientY - 2.5}px)`
      }
    }

    const onEnter = (e: Event) => {
      const target = e.target as Element
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-cursor="hover"]')
      ) {
        setHovered(true)
      }
    }

    const onLeave = () => setHovered(false)

    const onDown = () => setClicked(true)
    const onUp = () => setClicked(false)

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout', onLeave)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)

    // RAF lerp loop for outer ring
    let raf: number
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const tick = () => {
      outer.current.x = lerp(outer.current.x, mouse.current.x, 0.08)
      outer.current.y = lerp(outer.current.y, mouse.current.y, 0.08)

      if (outerRef.current) {
        const size = 28
        outerRef.current.style.transform = `translate(${outer.current.x - size / 2}px, ${outer.current.y - size / 2}px)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onLeave)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
    }
  }, [])

  // Don't render on touch screens (SSR safe — hide via CSS)
  return (
    <>
      {/* Outer ring */}
      <div
        ref={outerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: clicked ? '20px' : hovered ? '48px' : '28px',
          height: clicked ? '20px' : hovered ? '48px' : '28px',
          marginLeft: clicked ? '4px' : hovered ? '-10px' : '0px',
          marginTop: clicked ? '4px' : hovered ? '-10px' : '0px',
          border: hovered
            ? '1px solid rgba(100,180,255,0.6)'
            : '1px solid rgba(255,255,255,0.35)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'width 0.2s ease, height 0.2s ease, margin 0.2s ease, border-color 0.2s ease',
          willChange: 'transform',
        }}
        className="custom-cursor-ring"
      />
      {/* Inner dot */}
      <div
        ref={innerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: hovered ? '8px' : '5px',
          height: hovered ? '8px' : '5px',
          background: '#fff',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'width 0.2s ease, height 0.2s ease',
          willChange: 'transform',
        }}
        className="custom-cursor-dot"
      />
    </>
  )
}
