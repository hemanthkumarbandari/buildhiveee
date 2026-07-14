'use client'

import { useState, useEffect } from 'react'

export function useIsMobile(breakpoint: number = 767) {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    // Initial check
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`)
    setIsMobile(mql.matches)

    // Listener for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }

    // Modern browsers use addEventListener
    if (mql.addEventListener) {
      mql.addEventListener('change', handleChange)
      return () => mql.removeEventListener('change', handleChange)
    } else {
      // Fallback for older browsers
      mql.addListener(handleChange)
      return () => mql.removeListener(handleChange)
    }
  }, [breakpoint])

  return isMobile
}
