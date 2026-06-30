import { create } from 'zustand'

type CursorState = 'default' | 'hover' | 'click'

interface UIState {
  navScrolled: boolean
  mobileNavOpen: boolean
  cursorState: CursorState
  cursorX: number
  cursorY: number
  preloaderDone: boolean
  activeSection: string
  setNavScrolled: (v: boolean) => void
  setMobileNav: (v: boolean) => void
  setCursor: (state: CursorState) => void
  setCursorPos: (x: number, y: number) => void
  setPreloader: (v: boolean) => void
  setSection: (s: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  navScrolled: false,
  mobileNavOpen: false,
  cursorState: 'default',
  cursorX: 0,
  cursorY: 0,
  preloaderDone: false,
  activeSection: 'hero',
  setNavScrolled: (v) => set({ navScrolled: v }),
  setMobileNav: (v) => set({ mobileNavOpen: v }),
  setCursor: (state) => set({ cursorState: state }),
  setCursorPos: (x, y) => set({ cursorX: x, cursorY: y }),
  setPreloader: (v) => set({ preloaderDone: v }),
  setSection: (s) => set({ activeSection: s }),
}))
