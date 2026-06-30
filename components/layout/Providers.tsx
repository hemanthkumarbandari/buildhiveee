'use client'

import { createContext, useContext, useEffect, useRef } from 'react'
import type { LenisInstance } from '@/lib/lenis'
import { createLenis } from '@/lib/lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useScrollStore } from '@/store/scroll.store'
import { useUIStore } from '@/store/ui.store'

export const LenisContext = createContext<LenisInstance | null>(null)

export function useLenisContext() {
  return useContext(LenisContext)
}

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  const lenisRef = useRef<LenisInstance | null>(null)
  const setScrollY = useScrollStore((s) => s.setScrollY)
  const setScrollProgress = useScrollStore((s) => s.setScrollProgress)
  const setVelocity = useScrollStore((s) => s.setVelocity)
  const setDirection = useScrollStore((s) => s.setDirection)
  const preloaderDone = useUIStore((s) => s.preloaderDone)

  // Keep stable refs to setters so the effect doesn't re-run
  const settersRef = useRef({ setScrollY, setScrollProgress, setVelocity, setDirection })
  settersRef.current = { setScrollY, setScrollProgress, setVelocity, setDirection }

  useEffect(() => {
    const lenis = createLenis()
    lenisRef.current = lenis

    // ─── GSAP ticker drives Lenis RAF ────────────────────────────────
    gsap.ticker.lagSmoothing(0)
    const onTick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)

    // ─── Throttle Zustand updates to max 30fps ────────────────────────
    // Lenis fires scroll at 60fps. Zustand → React re-renders every call.
    // By batching into a RAF we skip frames where scroll didn't change meaningfully.
    let rafId: number | null = null
    let pendingScroll = 0
    let pendingProgress = 0
    let pendingVelocity = 0
    let pendingDirection: 'up' | 'down' = 'down'
    let dirty = false

    const flushStore = () => {
      rafId = null
      if (!dirty) return
      dirty = false
      const { setScrollY, setScrollProgress, setVelocity, setDirection } = settersRef.current
      setScrollY(pendingScroll)
      setScrollProgress(pendingProgress)
      setVelocity(pendingVelocity)
      setDirection(pendingDirection)
    }

    lenis.on('scroll', ({ scroll, progress, velocity, direction }: {
      scroll: number
      progress: number
      velocity: number
      direction: number
    }) => {
      pendingScroll = scroll
      pendingProgress = progress
      pendingVelocity = velocity
      pendingDirection = direction > 0 ? 'down' : 'up'
      dirty = true
      if (rafId === null) {
        rafId = requestAnimationFrame(flushStore)
      }
    })

    // ─── ScrollTrigger integration ────────────────────────────────────
    // scrollerProxy must include pinType for sticky elements to work correctly
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value?: number) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true })
        }
        return lenis.scroll
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
      },
      pinType: document.body.style.transform ? 'transform' : 'fixed',
    })

    // Keep ScrollTrigger in sync with Lenis scroll position
    lenis.on('scroll', () => ScrollTrigger.update())

    ScrollTrigger.addEventListener('refresh', () => lenis.resize())
    ScrollTrigger.refresh()

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      gsap.ticker.remove(onTick)
      lenis.destroy()
      ScrollTrigger.removeEventListener('refresh', () => lenis.resize())
      ScrollTrigger.clearScrollMemory()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ─── Pause/resume Lenis around preloader ─────────────────────────
  useEffect(() => {
    if (!lenisRef.current) return
    if (preloaderDone) {
      lenisRef.current.start()
    } else {
      lenisRef.current.stop()
    }
  }, [preloaderDone])

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  )
}
