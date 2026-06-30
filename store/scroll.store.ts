import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface ScrollState {
  scrollY: number
  scrollProgress: number
  velocity: number
  direction: 'up' | 'down'
  setScrollY: (y: number) => void
  setScrollProgress: (p: number) => void
  setVelocity: (v: number) => void
  setDirection: (d: 'up' | 'down') => void
}

// Use subscribeWithSelector so components can subscribe to specific slices
// without triggering re-renders on every other slice change.
// Batch all scroll fields in a single set() call to avoid multiple renders per frame.
export const useScrollStore = create<ScrollState>()(
  subscribeWithSelector((set) => ({
    scrollY: 0,
    scrollProgress: 0,
    velocity: 0,
    direction: 'down',
    setScrollY: (y) => set({ scrollY: y }),
    setScrollProgress: (p) => set({ scrollProgress: p }),
    setVelocity: (v) => set({ velocity: v }),
    setDirection: (d) => set({ direction: d }),
  }))
)
