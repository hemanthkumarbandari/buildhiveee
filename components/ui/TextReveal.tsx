'use client'

import React, { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface TextRevealProps {
  text: string
  type?: 'chars' | 'words' | 'lines'
  className?: string
  delay?: number
  once?: boolean
  as?: keyof JSX.IntrinsicElements
}

export default function TextReveal({
  text,
  type = 'chars',
  className,
  delay = 0,
  once = true,
  as: Tag = 'div',
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const triggered = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Split text into tokens
    const tokens = type === 'chars'
      ? text.split('')
      : type === 'words'
      ? text.split(' ')
      : [text]

    container.innerHTML = ''
    container.style.overflow = 'hidden'

    // Build split spans
    const wrapper = document.createElement('span')
    wrapper.style.display = 'block'

    tokens.forEach((token, i) => {
      const span = document.createElement('span')
      span.style.display = 'inline-block'
      span.style.overflow = 'hidden'
      span.style.verticalAlign = 'bottom'

      const inner = document.createElement('span')
      inner.style.display = 'inline-block'
      inner.textContent = type === 'words' ? token + (i < tokens.length - 1 ? '\u00a0' : '') : token === ' ' ? '\u00a0' : token

      if (!reduced) {
        inner.style.transform = 'translateY(60px) rotateX(-40deg)'
        inner.style.opacity = '0'
        inner.style.transition = `transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay + i * 0.025}s, opacity 0.7s ease ${delay + i * 0.025}s`
      }

      span.appendChild(inner)
      wrapper.appendChild(span)
    })

    container.appendChild(wrapper)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && (!triggered.current || !once)) {
            triggered.current = true
            container.querySelectorAll('span span').forEach((inner) => {
              ;(inner as HTMLElement).style.transform = 'translateY(0) rotateX(0deg)'
              ;(inner as HTMLElement).style.opacity = '1'
            })
          } else if (!entry.isIntersecting && !once) {
            triggered.current = false
            container.querySelectorAll('span span').forEach((inner) => {
              ;(inner as HTMLElement).style.transform = 'translateY(60px) rotateX(-40deg)'
              ;(inner as HTMLElement).style.opacity = '0'
            })
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [text, type, delay, once, reduced])

  return <Tag ref={containerRef as React.Ref<HTMLElement>} className={cn('perspective-[600px]', className)} />
}
