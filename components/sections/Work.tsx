'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Briefcase, Mail, MoreHorizontal, ExternalLink } from 'lucide-react'
import { projects } from '@/data/projects'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import dynamic from 'next/dynamic'

const SideRays = dynamic(() => import('@/components/effects/SideRays'), { ssr: false })

gsap.registerPlugin(ScrollTrigger)

// --- Utility for fallback images ---
const safeImage = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement
  target.src = 'https://placehold.co/640x400/0c1e30/63b8ff?text=Preview+Unavailable'
}

function previewScreenshotUrl(url: string) {
  return `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=640`
}

const CARD_STEP = 1200 // px of scroll per project

export default function Work() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showRays, setShowRays] = useState(false)

  const sectionRef  = useRef<HTMLElement>(null)
  const stickyRef   = useRef<HTMLDivElement>(null)

  const TOTAL = projects.length

  // ─── Scroll to specific project index ────────────────────────────────────
  const scrollToIdx = useCallback((idx: number) => {
    const section = sectionRef.current
    if (!section) return
    const startY  = section.offsetTop
    const targetY = startY + (idx / (TOTAL - 1)) * ((TOTAL - 1) * CARD_STEP)
    window.scrollTo({ top: targetY, behavior: 'smooth' })
  }, [TOTAL])

  const next = useCallback(() => scrollToIdx((activeIndex + 1) % TOTAL), [activeIndex, scrollToIdx, TOTAL])
  const prev = useCallback(() => scrollToIdx((activeIndex - 1 + TOTAL) % TOTAL), [activeIndex, scrollToIdx, TOTAL])

  const handleProfileClick = useCallback((index: number) => {
    if (index !== activeIndex) scrollToIdx(index)
  }, [activeIndex, scrollToIdx])

  // ─── GSAP ScrollTrigger (logic unchanged) ────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current
    const sticky  = stickyRef.current

    if (!section || !sticky) return

    const mm = gsap.matchMedia()

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${(TOTAL - 1) * CARD_STEP}px`,
      pin: sticky,
      pinSpacing: true,
      scrub: 1.5,
      snap: 1 / (TOTAL - 1),
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const clampedProgress = Math.max(0, Math.min(1, self.progress))
        setScrollProgress(clampedProgress)
        const rawIndex = clampedProgress * (TOTAL - 1)
        setActiveIndex(Math.round(rawIndex))
      }
    })

    return () => {
      mm.revert()
    }
  }, [TOTAL])

  // ─── Keyboard navigation (unchanged) ─────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  // ─── SideRays guard (unchanged) ──────────────────────────────────────────
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReducedMotion && window.innerWidth >= 768) setShowRays(true)
  }, [])

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative z-10 w-full theme-dark-bg h-auto lg:h-[calc(100dvh+var(--scroll-height))]"
      style={{ '--scroll-height': `${(TOTAL - 1) * CARD_STEP}px` } as React.CSSProperties}
    >
      <div
        ref={stickyRef}
        className="relative w-full flex flex-col overflow-hidden pt-8 lg:pt-20 pb-10 h-auto lg:h-[100dvh]"
      >
        {/* Background glow ambient */}
        <div
          className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[var(--primary)]/5 blur-[120px] pointer-events-none -z-10"
          aria-hidden="true"
        />

        {/* SideRays Layer */}
        {showRays && (
          <div className="absolute inset-0 z-0 pointer-events-none">
            <SideRays
              speed={1.2}
              rayColor1="#63b8ff"
              rayColor2="#7364ff"
              intensity={1.1}
              spread={1.4}
              origin="top-right"
              tilt={0}
              saturation={1.0}
              blend={0.6}
              falloff={2.2}
              opacity={0.35}
            />
          </div>
        )}

        {/* ── Header ───────────────────────── */}
        <div
          className="max-w-7xl mx-auto w-full px-6 mb-8 text-center md:text-left flex flex-col items-center md:items-start flex-shrink-0"
        >
          <div className="flex flex-col gap-4 items-center md:items-start max-w-xl">
            <span className="font-body text-[var(--primary)] text-xs lg:text-sm font-semibold tracking-widest uppercase">
              THE PROOF
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-[var(--text)] leading-[1.1] tracking-tight">
              Selected works.
            </h2>
            <p className="font-body text-[var(--text-secondary)] text-base md:text-lg max-w-2xl leading-relaxed">
              Live project previews — scroll to rotate the orbit.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto w-full px-6 flex-1 flex flex-col justify-center min-h-0">

          {/* ── DESKTOP ORBIT LAYOUT ─────────────────────────────────────────
              Grid:
                lg  (1024–1279px): fixed 380px right panel + flexible left col
                xl+ (1280px+)    : even 50/50 split
              Gutter: gap-8 at lg, gap-6 at xl — ensures visible space between panels.
          */}
          <div className="hidden lg:grid lg:grid-cols-[1fr_380px] xl:grid-cols-2 lg:gap-8 xl:gap-6 items-center w-full">

            {/* ── Left: Sliding Images Column ──────────────────────────────────────── */}
            <div className="relative flex items-center justify-center w-full h-[50vh] min-h-[400px] max-h-[600px] overflow-hidden rounded-3xl">
              <div 
                className="absolute top-0 left-0 w-full h-full flex will-change-transform"
                style={{ transform: `translateX(-${scrollProgress * (TOTAL - 1) * 100}%) translateZ(0)` }}
              >
                {projects.map((p, i) => (
                  <div key={p.id} className="w-full h-full flex-shrink-0 relative">
                    <div className="w-full h-full p-4 md:p-8 flex items-center justify-center">
                      <motion.div
                        onClick={() => handleProfileClick(i)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full aspect-[16/10] rounded-2xl overflow-hidden border-[2px] cursor-pointer transition-all duration-300 relative ${
                          i === activeIndex
                            ? 'border-[var(--primary)] shadow-[0_0_35px_rgba(99,184,255,0.4)] scale-100'
                            : 'border-white/10 opacity-40 scale-95'
                        }`}
                      >
                        <img
                          src={previewScreenshotUrl(p.url)}
                          alt={p.title}
                          onError={safeImage}
                          loading="lazy"
                          className="w-full h-full object-cover object-top select-none"
                          draggable={false}
                        />
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Active Project Details Panel ─────────────────────── */}
            <div className="flex justify-center lg:justify-end w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="w-full max-w-[420px] bg-[#08121f]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-[0_32px_80px_rgba(0,0,0,0.4),0_0_40px_rgba(99,184,255,0.05)] relative"
                >
                  <div className="absolute top-8 right-8 text-white/20">
                    <MoreHorizontal size={24} />
                  </div>

                  <div className="flex justify-center mb-8 mt-2">
                    <div className="w-full aspect-[16/10] rounded-2xl p-[2px] bg-gradient-to-br from-[#7364ff]/60 to-transparent shadow-[0_0_35px_rgba(115,100,255,0.25)]">
                      <div className="w-full h-full rounded-2xl overflow-hidden border-[4px] border-[#08121f]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewScreenshotUrl(projects[activeIndex].url)}
                          alt={projects[activeIndex].title}
                          onError={safeImage}
                          loading="lazy"
                          className="w-full h-full object-cover object-top select-none"
                          draggable={false}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-center md:text-left">
                    <h3 className="text-3xl font-display font-bold text-white tracking-tight mb-3">
                      {projects[activeIndex].title}
                    </h3>
                    <div className="flex items-center justify-center md:justify-start text-sm text-[#8da6ff] mb-2 font-medium">
                      <Briefcase size={16} className="mr-2" />
                      <span>{projects[activeIndex].category}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start text-sm text-white/40 mb-6">
                      <Mail size={16} className="mr-2" />
                      <span>{projects[activeIndex].domain}</span>
                    </div>
                    <p className="text-sm text-white/60 leading-relaxed mb-8 min-h-[60px]">
                      {projects[activeIndex].description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <button
                      onClick={prev}
                      className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 flex-shrink-0"
                      aria-label="Previous project"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <a
                      href={projects[activeIndex].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3.5 rounded-2xl bg-[#5438ff] hover:bg-[#4b32e6] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(84,56,255,0.3)] hover:shadow-[0_0_30px_rgba(84,56,255,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                    >
                      View Live <ExternalLink size={16} />
                    </a>
                    <button
                      onClick={next}
                      className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 flex-shrink-0"
                      aria-label="Next project"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── MOBILE / TABLET CAROUSEL LAYOUT (<1024px) ──────────────────
              Horizontal swipe carousel — replaces the circular orbit entirely
              on small screens. No overlap possible.
          */}
          <div
            className="flex lg:hidden w-full overflow-x-auto snap-x snap-mandatory gap-4 pb-8 pt-4 -mx-6 px-6 relative z-20"
            style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
          >
            {projects.map((p) => (
              <div
                key={p.id}
                className="snap-center shrink-0 w-[85vw] max-w-[340px] bg-[#08121f]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 shadow-glass relative flex flex-col"
              >
                <div className="w-full aspect-[16/10] rounded-xl overflow-hidden mb-5 border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewScreenshotUrl(p.url)}
                    alt={p.title}
                    onError={safeImage}
                    loading="lazy"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <h3 className="text-2xl font-display font-bold text-white tracking-tight mb-2">
                  {p.title}
                </h3>
                <div className="flex items-center text-xs text-[#8da6ff] mb-4 font-medium">
                  <Briefcase size={14} className="mr-1.5" />
                  <span>{p.category}</span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed mb-6 flex-1">
                  {p.description}
                </p>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-[#5438ff] hover:bg-[#4b32e6] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  View Live <ExternalLink size={16} />
                </a>
              </div>
            ))}
          </div>

          {/* Dot Indicators (Desktop only) */}
          <div className="hidden lg:flex items-center justify-center space-x-3 mt-8 mb-4">
            {projects.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => handleProfileClick(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? 'bg-[var(--primary)] w-6 shadow-[0_0_10px_rgba(99,184,255,0.5)]'
                    : 'bg-white/20 w-2 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
