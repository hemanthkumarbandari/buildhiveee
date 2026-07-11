'use client'

import { useRef, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { gsap } from '@/lib/gsap'

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
}: MagneticButtonProps) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return

    const moveX = gsap.quickTo(inner, 'x', { duration: 0.4, ease: 'power3.out' })
    const moveY = gsap.quickTo(inner, 'y', { duration: 0.4, ease: 'power3.out' })

    const onMove = (e: MouseEvent) => {
      const rect = outer.getBoundingClientRect()
      const dx = e.clientX - (rect.left + rect.width / 2)
      const dy = e.clientY - (rect.top + rect.height / 2)
      moveX(dx * strength)
      moveY(dy * strength)
    }
    const onLeave = () => {
      moveX(0)
      moveY(0)
    }

    outer.addEventListener('mousemove', onMove)
    outer.addEventListener('mouseleave', onLeave)
    return () => {
      outer.removeEventListener('mousemove', onMove)
      outer.removeEventListener('mouseleave', onLeave)
    }
  }, [strength])

  const handleClick = useCallback(() => onClick?.(), [onClick])

  return (
    <div
      ref={outerRef}
      className={cn('magnetic-target', className)}
      onClick={handleClick}
    >
      <div ref={innerRef}>
        {children}
      </div>
    </div>
  )
}
