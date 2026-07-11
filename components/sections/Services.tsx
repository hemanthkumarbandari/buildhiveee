'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

import { serviceCarouselItems } from '@/data/serviceCarousel'
import { cn } from '@/lib/utils'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useLenisContext } from '@/components/layout/Providers'
import Image from 'next/image'

export default function Services() {
  const [active, setActive] = useState(0)
  const [hoveredCat, setHoveredCat] = useState<string | null>(null)
  
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const lenis = useLenisContext()

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    // Wait a tick for layout to settle
    const timer = setTimeout(() => {
      const totalItems = serviceCarouselItems.length
      const totalScrollHeight = window.innerHeight * 2.5 // Adjust this multiplier to control scroll speed

      const tween = gsap.to(track, {
        y: `-${(totalItems - 1) * 100}%`,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1, // Smooth scrub matching scroll
          start: 'top top',
          end: () => `+=${window.innerHeight * 2.5}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          refreshPriority: 10,
          snap: {
            snapTo: 1 / (totalItems - 1),
            duration: { min: 0.2, max: 0.5 },
            delay: 0.1,
            ease: 'power1.inOut'
          },
          onUpdate: (self) => {
            // Update active index based on progress (0 to 1)
            const newActive = Math.round(self.progress * (totalItems - 1))
            setActive(newActive)
          }
        },
      })

      triggerRef.current = tween.scrollTrigger as ScrollTrigger
      ScrollTrigger.refresh()
    }, 100)

    return () => {
      clearTimeout(timer)
      if (triggerRef.current) {
        triggerRef.current.kill()
        triggerRef.current = null
      }
    }
  }, [])

  const scrollToPanel = useCallback((index: number) => {
    if (!triggerRef.current || !lenis) return
    const totalItems = serviceCarouselItems.length
    const progress = index / (totalItems - 1)
    
    // Calculate the target scroll position based on the ScrollTrigger's start and end
    const start = triggerRef.current.start
    const end = triggerRef.current.end
    const targetScroll = start + (end - start) * progress
    
    // Smoothly scroll to the target position using Lenis
    lenis.scrollTo(targetScroll, { duration: 1.2, lock: false })
  }, [lenis])

  return (
    <section id="services" ref={sectionRef} className="relative z-10 border-t border-[var(--border)] overflow-hidden h-screen theme-dark-bg">
      <div className="lg:grid lg:grid-cols-[minmax(240px,300px)_1fr] max-w-[1400px] mx-auto h-full">

        {/* Sidebar — sticky, only on desktop */}
        <aside className="hidden lg:flex flex-col h-full border-r border-[var(--border)] bg-[var(--bg-start)]/80 backdrop-blur-md z-20">
          <div className="px-8 pt-20 pb-8">
            <p className="font-body text-[var(--primary)] text-xs font-semibold tracking-widest uppercase mb-3">
              What we build
            </p>
            <h2 className="font-display font-bold text-4xl text-[var(--text)] leading-tight">Services</h2>
          </div>

          <nav className="flex-1 flex flex-col justify-center px-6 gap-4">
            {serviceCarouselItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToPanel(index)}
                className={cn(
                  'group text-left px-4 py-4 rounded-xl transition-all duration-300 border border-transparent',
                  active === index
                    ? 'bg-[var(--card)] border-[var(--border)] shadow-[0_8px_32px_rgba(0,0,0,0.25)]'
                    : 'hover:bg-white/[0.03]'
                )}
              >
                <span
                  className={cn(
                    'font-body text-[10px] tracking-widest uppercase block mb-1 transition-colors duration-300',
                    active === index ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'
                  )}
                >
                  0{index + 1}
                </span>
                <span
                  className={cn(
                    'font-display font-bold tracking-tight transition-all duration-300 block',
                    active === index
                      ? 'text-2xl text-[var(--text)]'
                      : 'text-xl text-[var(--text-secondary)] group-hover:text-[var(--text)]'
                  )}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          <p className="px-8 pb-10 font-body text-xs text-[var(--text-secondary)]">
            Scroll to browse each service
          </p>
        </aside>

        {/* Mobile header */}
        <div className="lg:hidden px-6 pt-16 pb-4 shrink-0 absolute top-0 left-0 w-full z-20 bg-[var(--bg-start)]/90 backdrop-blur-md border-b border-[var(--border)]">
          <p className="font-body text-[var(--primary)] text-sm font-semibold tracking-widest uppercase mb-3">
            What we build
          </p>
          <h2 className="font-display font-bold text-5xl text-[var(--text)]">Services</h2>
        </div>

        {/* Right column: Fixed carousel viewport */}
        <div className="relative h-full flex flex-col items-center justify-center px-6 lg:px-10 py-24 lg:py-20 z-10 w-full">
          <div
            className="relative w-full overflow-hidden rounded-3xl border border-[var(--border)] shadow-[0_32px_80px_rgba(0,0,0,0.4)]"
            style={{ height: 'min(72vh, 620px)', maxHeight: 'calc(100vh - 200px)' }}
          >
            {/* The Track that scrubs up */}
            <div
              ref={trackRef}
              className="absolute top-0 left-0 w-full h-full"
              style={{ willChange: 'transform' }}
            >
              {serviceCarouselItems.map((item) => (
                <article
                  key={item.id}
                  className="relative w-full h-full shrink-0"
                >
                  <Image
                    src={item.image}
                    alt={item.label}
                    fill
                    className="object-cover"
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, rgba(4,12,24,0.92) 0%, rgba(4,12,24,0.35) 45%, ${item.accent}18 100%)`,
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 pointer-events-auto">
                    <p className="font-body text-xs text-[var(--primary)] uppercase tracking-widest mb-2">
                      {item.subtitle}
                    </p>
                    <h3 className="font-display font-bold text-4xl md:text-5xl text-[var(--text)] mb-4">
                      {item.label}
                    </h3>
                    <p className="font-body text-[var(--text-secondary)] text-base md:text-lg leading-relaxed max-w-xl">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* Progress dots */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 pointer-events-none z-10" aria-hidden="true">
              {serviceCarouselItems.map((item, index) => (
                <span
                  key={item.id}
                  className={cn(
                    'w-1.5 rounded-full transition-all duration-300',
                    active === index ? 'h-8 bg-[var(--primary)]' : 'h-1.5 bg-white/25'
                  )}
                />
              ))}
            </div>
          </div>

          {/* Category Pills outside the card */}
          <div className="flex flex-wrap gap-2 pointer-events-auto w-full px-2 mt-6 mb-4">
            {serviceCarouselItems[active].categories.map((cat) => (
              <div
                key={cat}
                onMouseEnter={() => setHoveredCat(cat)}
                onMouseLeave={() => setHoveredCat(null)}
                className="px-4 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-mid)]/80 backdrop-blur-md font-body text-xs text-[var(--text-secondary)] transition-all duration-300 cursor-default"
                style={{
                  transform: hoveredCat === cat ? "translateY(-4px) scale(1.05)" : "none",
                  boxShadow: hoveredCat === cat ? "0 8px 24px rgba(77,163,255,0.4)" : "none",
                  color: hoveredCat === cat ? "var(--text)" : undefined,
                  borderColor: hoveredCat === cat ? "rgba(255,255,255,0.2)" : undefined,
                  background: hoveredCat === cat ? "rgba(255,255,255,0.1)" : undefined
                }}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
