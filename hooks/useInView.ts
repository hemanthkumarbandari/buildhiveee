'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useInView<T extends Element>(
  options: UseInViewOptions = {}
): [React.RefObject<T>, boolean, IntersectionObserverEntry | null] {
  const { threshold = 0.15, rootMargin = '0px', once = true } = options
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)

  const callback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [e] = entries
      setEntry(e)
      if (e.isIntersecting) {
        setInView(true)
        if (once && ref.current) {
          observer.current?.unobserve(ref.current)
        }
      } else if (!once) {
        setInView(false)
      }
    },
    [once]
  )

  const observer = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observer.current = new IntersectionObserver(callback, { threshold, rootMargin })
    const el = ref.current
    if (el) observer.current.observe(el)
    return () => observer.current?.disconnect()
  }, [callback, threshold, rootMargin])

  return [ref, inView, entry]
}
