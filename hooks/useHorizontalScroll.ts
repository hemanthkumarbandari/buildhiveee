'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface UseHorizontalScrollOptions {
  itemCount: number
}

export function useHorizontalScroll({ itemCount }: UseHorizontalScrollOptions) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const scrollStartX = useRef(0)
  const velocity = useRef(0)
  const lastX = useRef(0)
  const lastTime = useRef(0)
  const momentumId = useRef<number | null>(null)
  const reduced = useReducedMotion()

  const updateScrollState = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollLeft(scrollLeft > 8)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8)

    const itemWidth = el.firstElementChild?.clientWidth ?? clientWidth
    const gap = 24
    const index = Math.round(scrollLeft / (itemWidth + gap))
    setActiveIndex(Math.min(Math.max(index, 0), itemCount - 1))
  }, [itemCount])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    return () => el.removeEventListener('scroll', updateScrollState)
  }, [updateScrollState])

  const scrollBy = useCallback((direction: -1 | 1) => {
    const el = containerRef.current
    if (!el) return
    const itemWidth = el.firstElementChild?.clientWidth ?? el.clientWidth
    el.scrollBy({ left: direction * (itemWidth + 24), behavior: reduced ? 'auto' : 'smooth' })
  }, [reduced])

  const stopMomentum = () => {
    if (momentumId.current !== null) {
      cancelAnimationFrame(momentumId.current)
      momentumId.current = null
    }
  }

  const applyMomentum = () => {
    const el = containerRef.current
    if (!el || Math.abs(velocity.current) < 0.5) {
      stopMomentum()
      return
    }
    el.scrollLeft += velocity.current
    velocity.current *= 0.92
    momentumId.current = requestAnimationFrame(applyMomentum)
  }

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (reduced) return
    const el = containerRef.current
    if (!el) return
    stopMomentum()
    isDragging.current = true
    dragStartX.current = e.clientX
    scrollStartX.current = el.scrollLeft
    lastX.current = e.clientX
    lastTime.current = performance.now()
    el.setPointerCapture(e.pointerId)
    el.style.cursor = 'grabbing'
  }, [reduced])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !containerRef.current) return
    const el = containerRef.current
    const dx = e.clientX - dragStartX.current
    el.scrollLeft = scrollStartX.current - dx

    const now = performance.now()
    const dt = now - lastTime.current
    if (dt > 0) {
      velocity.current = ((lastX.current - e.clientX) / dt) * 16
    }
    lastX.current = e.clientX
    lastTime.current = now
  }, [])

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!containerRef.current) return
    isDragging.current = false
    containerRef.current.releasePointerCapture(e.pointerId)
    containerRef.current.style.cursor = 'grab'
    if (!reduced) applyMomentum()
  }, [reduced])

  return {
    containerRef,
    canScrollLeft,
    canScrollRight,
    activeIndex,
    scrollBy,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  }
}
