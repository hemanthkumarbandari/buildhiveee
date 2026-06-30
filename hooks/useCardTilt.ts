'use client'

import { useCallback, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const MAX_TILT = 7

export function useCardTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const reduced = useReducedMotion()

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduced || !ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const rotX = ((e.clientY - cy) / rect.height) * -MAX_TILT
      const rotY = ((e.clientX - cx) / rect.width) * MAX_TILT
      ref.current.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`
    },
    [reduced]
  )

  const onMouseLeave = useCallback(() => {
    if (!ref.current) return
    ref.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)'
  }, [])

  return { ref, onMouseMove, onMouseLeave, reduced }
}
