'use client'

import { useRef, useCallback } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { cn } from '@/lib/utils'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
  onClick?: () => void
  href?: string
  as?: 'button' | 'a' | 'div'
}

export default function MagneticButton({
  children,
  className,
  strength = 0.35,
  onClick,
  href,
  as: Tag = 'div',
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ x, y }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    config: { mass: 1, tension: 200, friction: 20 },
  }))

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      api.start({ x: dx * strength, y: dy * strength })
    },
    [api, strength]
  )

  const handleMouseLeave = useCallback(() => {
    api.start({ x: 0, y: 0 })
  }, [api])

  return (
    <div
      ref={ref}
      className={cn('magnetic-target', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <animated.div style={{ x, y }}>
        {Tag === 'a' ? (
          <a href={href} onClick={onClick}>
            {children}
          </a>
        ) : Tag === 'button' ? (
          <button onClick={onClick}>{children}</button>
        ) : (
          <div onClick={onClick}>{children}</div>
        )}
      </animated.div>
    </div>
  )
}
