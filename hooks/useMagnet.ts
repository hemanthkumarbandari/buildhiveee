'use client'

import { useRef, useCallback, RefObject } from 'react'
import { useSpring } from '@react-spring/web'

interface MagnetResult {
  x: number
  y: number
  bind: {
    onMouseMove: (e: React.MouseEvent<Element>) => void
    onMouseLeave: () => void
  }
}

export function useMagnet(ref: RefObject<HTMLElement>, strength = 0.35): MagnetResult {
  const [{ x, y }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    config: { mass: 1, tension: 200, friction: 20 },
  }))

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<Element>) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 120) {
        api.start({ x: dx * strength, y: dy * strength })
      }
    },
    [ref, strength, api]
  )

  const handleMouseLeave = useCallback(() => {
    api.start({ x: 0, y: 0 })
  }, [api])

  return {
    x: x.get(),
    y: y.get(),
    bind: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  }
}
