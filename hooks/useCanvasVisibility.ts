'use client'

import { useEffect, useState, type RefObject } from 'react'

export function useCanvasVisibility(ref: RefObject<HTMLElement | null>): boolean {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: '100px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return visible
}
