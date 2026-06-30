'use client'

import { useRef } from 'react'
import { useScrollStore } from '@/store/scroll.store'
import { lerp } from '@/lib/utils'

export function useScrollVelocity(): number {
  const velocity = useScrollStore((s) => s.velocity)
  const smoothed = useRef(0)
  smoothed.current = lerp(smoothed.current, velocity, 0.08)
  return smoothed.current
}
