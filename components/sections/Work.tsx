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

// ─── Orbit geometry interface ────────────────────────────────────────────────
interface OrbitGeom {
  radius:     number
  nodeW:      number
  nodeH:      number
  containerW: number  // width  of orbit bounding box (wider than height due to card aspect)
  containerH: number  // height of orbit bounding box
}

/**
 * computeGeom — derives all orbit dimensions from the real available space.
 *
 * WIDTH  axis: orbit extends ±(radius + nodeW/2) from center
 *              nodeW = radius * 0.68  →  half-extent = radius * 1.34
 *              containerW = radius * 2.68 + PADDING
 *              constraint: containerW ≤ colW  →  radius ≤ (colW - PADDING) / 2.68
 *
 * HEIGHT axis: orbit extends ±(radius + nodeH/2) from center
 *              nodeH = radius * 0.43  →  half-extent = radius * 1.215
 *              containerH = radius * 2.43 + PADDING
 *              constraint: containerH ≤ availH  →  radius ≤ (availH - PADDING) / 2.43
 *
 * availH is computed OUTSIDE this function from:
 *   viewportH - stickyTopPad - headerH - headerMargin - dotsH - stickyBotPad - safety
 * This ensures it reflects the actual visible space for the orbit, not the grid row height
 * (which can be dominated by the right panel and far exceed the viewport).
 *
 * Minimum radius for n=6 cards with no overlap:
 *   chord between adjacent centers = 2 * radius * sin(π/6) = radius   (for n=6)
 *   required chord ≥ nodeW + gap  →  radius ≥ 0.68*radius + gap
 *   →  0.32 * radius ≥ gap  →  radius ≥ gap / 0.32
 *   With gap=20px: minRadius = 62.5px — easily satisfied by our 110px floor.
 */
function computeGeom(colW: number, availH: number): OrbitGeom {
  const PADDING = 20
  const CAP     = 260  // never exceed 260px radius (prevents over-large orbits)
  const MIN_R   = 110  // floor (satisfies no-overlap for n=6 with 20px gap)

  const maxByW = (colW   - PADDING) / 2.68  // width  constraint
  const maxByH = (availH - PADDING) / 2.43  // height constraint ← key fix vs. previous version

  const radius = Math.max(Math.min(maxByW, maxByH, CAP), MIN_R)

  const nodeW      = Math.round(radius * 0.68)
  const nodeH      = Math.round(radius * 0.43)
  const containerW = Math.round(radius * 2.68) + PADDING  // always ≤ colW
  const containerH = Math.round(radius * 2.43) + PADDING  // always ≤ availH

  if (process.env.NODE_ENV !== 'production') {
    const chord = radius // 2*r*sin(π/6) = r for n=6
    console.info(
      '[Orbit] radius=%dpx nodeW=%d nodeH=%d containerW=%d containerH=%d' +
      ' | colW=%d availH=%d | chord=%d gap=%d',
      radius, nodeW, nodeH, containerW, containerH,
      Math.round(colW), Math.round(availH),
      Math.round(chord), Math.round(chord - nodeW)
    )
  }

  return { radius, nodeW, nodeH, containerW, containerH }
}

// Layout constants used for availH computation (lg breakpoint, desktop orbit)
// These match the actual Tailwind classes on stickyRef and its children:
const STICKY_TOP_PAD   = 80  // lg:pt-20  = 5rem = 80px
const STICKY_BOT_PAD   = 40  // pb-10     = 2.5rem = 40px
const HEADER_MARGIN    = 32  // mb-8 on header div (not in getBoundingClientRect)
const DOTS_H           = 58  // dots: mt-8(32) + h-2(8) + mb-4(16) + line(2) = 58px
const AVAIL_SAFETY     = 16  // breathing room

export default function Work() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showRays, setShowRays] = useState(false)

  // Responsive orbit geometry — recomputed on resize
  const [geom, setGeom] = useState<OrbitGeom>({
    radius: 160, nodeW: 109, nodeH: 69, containerW: 450, containerH: 408,
  })

  const sectionRef  = useRef<HTMLElement>(null)
  const stickyRef   = useRef<HTMLDivElement>(null)
  const orbitColRef = useRef<HTMLDivElement>(null)  // measures column WIDTH only
  const headerRef   = useRef<HTMLDivElement>(null)  // measures header HEIGHT

  const { radius, nodeW, nodeH, containerW, containerH } = geom

  const TOTAL = projects.length
  const anglePerProject = 360 / TOTAL
  const currentRotation = scrollProgress * (TOTAL - 1) * anglePerProject

  // ─── Geometry recalculation ───────────────────────────────────────────────
  // availH derivation:
  //   flex-1 height = viewportH - STICKY_TOP_PAD - STICKY_BOT_PAD - headerH - HEADER_MARGIN
  //   orbit must fit within flex-1 minus the dots section:
  //   availH = flex-1_height - DOTS_H - AVAIL_SAFETY
  //
  // WHY NOT use orbitColRef.getBoundingClientRect().height?
  //   The orbit column sits inside a CSS grid with items-center. Without self-stretch,
  //   the column's height = its content = containerH. That creates a circular dependency.
  //   With self-stretch, height = grid row height = right panel height (~600px) which
  //   EXCEEDS the visible area at short viewports, causing the incorrect large radius
  //   that was the root cause of the previous fix's failure.
  const recalcGeom = useCallback(() => {
    const col    = orbitColRef.current
    const header = headerRef.current
    if (!col || !header) return

    const colW    = col.getBoundingClientRect().width
    if (colW < 50) return  // not yet laid out

    const viewH   = window.innerHeight
    const headerH = header.getBoundingClientRect().height
    const flexH   = viewH - STICKY_TOP_PAD - STICKY_BOT_PAD - headerH - HEADER_MARGIN
    const availH  = Math.max(flexH - DOTS_H - AVAIL_SAFETY, 160)

    setGeom(computeGeom(colW, availH))
  }, [])

  useEffect(() => {
    const col = orbitColRef.current
    if (!col) return

    recalcGeom()

    // Watch column width changes (grid reflow, window resize)
    const ro = new ResizeObserver(recalcGeom)
    ro.observe(col)

    // Also respond to window height changes (viewport resize changes availH)
    window.addEventListener('resize', recalcGeom)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', recalcGeom)
    }
  }, [recalcGeom])

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
        setScrollProgress(self.progress)
        const rawIndex = self.progress * (TOTAL - 1)
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

        {/* ── Header — ref'd for height measurement ───────────────────────── */}
        {/*
          headerRef.getBoundingClientRect().height is used in recalcGeom to derive
          the true available vertical space for the orbit (excluding header + margins).
          This avoids the circular dependency of measuring a container whose height
          depends on the orbit geometry we're computing.
        */}
        <div
          ref={headerRef}
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

            {/* ── Left: Orbit column ──────────────────────────────────────── */}
            {/*
              orbitColRef is placed here to measure the column WIDTH (reliable).
              We do NOT use its height — see recalcGeom() above for why.
              overflow:visible allows orbit rings to extend slightly past containerW/H
              without being clipped by this div's own box.
            */}
            <div
              ref={orbitColRef}
              className="relative flex items-center justify-center w-full"
              style={{ overflow: 'visible' }}
            >
              {/*
                ORBIT CONTAINER — sized to (containerW × containerH), derived from
                computeGeom(). Both dimensions are strictly bounded by the available
                column width and available viewport height respectively, so this box
                will always fit within the sticky section without any overflow.

                The container is NOT a square: cards are wider than tall, so:
                  containerW = radius*2.68 + PADDING  (horizontal card extents)
                  containerH = radius*2.43 + PADDING  (vertical card extents)
              */}
              <div
                className="relative flex items-center justify-center select-none flex-shrink-0 origin-center"
                style={{
                  width:  containerW,
                  height: containerH,
                  transition: 'width 0.25s ease, height 0.25s ease',
                }}
              >
                {/*
                  SINGLE ROTATING CONTAINER
                  SVG rings and orbit nodes share the same parent that rotates,
                  guaranteeing zero subpixel drift between them.
                  translateZ(0) forces GPU compositing layer.
                */}
                <div
                  className="absolute inset-0 origin-center will-change-transform"
                  style={{ transform: `rotate(${-currentRotation}deg) translateZ(0)` }}
                >
                  {/* ── Segmented Orbit Rings ───────────────────────────── */}
                  <svg
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible pointer-events-none"
                    style={{ width: radius * 2, height: radius * 2 }}
                  >
                    <defs>
                      <filter id="orbitGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    {/* Ring 1 — Outermost subtle */}
                    <circle cx={radius} cy={radius} r={radius + 50}
                      fill="none" stroke="rgba(99,184,255,0.4)" strokeWidth="1"
                      strokeDasharray="60 120 40 200 100 80" strokeLinecap="square"
                    />
                    {/* Ring 2 — Outer */}
                    <circle cx={radius} cy={radius} r={radius + 42}
                      fill="none" stroke="rgba(99,184,255,0.2)" strokeWidth="2"
                      strokeDasharray="150 100 50 200 30 150" strokeLinecap="square"
                    />
                    {/* Ring 3 — Middle thick glowing */}
                    <circle cx={radius} cy={radius} r={radius + 15}
                      fill="none" stroke="rgba(99,184,255,0.5)" strokeWidth="4"
                      strokeDasharray="40 300 200 150" strokeLinecap="square" filter="url(#orbitGlow)"
                    />
                    {/* Ring 4 — Main orbit track */}
                    <circle cx={radius} cy={radius} r={radius}
                      fill="none" stroke="rgba(99,184,255,0.3)" strokeWidth="1.5"
                      strokeDasharray="100 50 20 200 300 100" strokeLinecap="square"
                    />
                    {/* Ring 5 — Inner thick glowing */}
                    <circle cx={radius} cy={radius} r={radius - 10}
                      fill="none" stroke="rgba(99,184,255,0.6)" strokeWidth="2"
                      strokeDasharray="80 150 40 300 250 80" strokeLinecap="square" filter="url(#orbitGlow)"
                    />
                  </svg>

                  {/* ── Orbiting Project Nodes ──────────────────────────── */}
                  {projects.map((p, i) => {
                    const baseAngle = i * anglePerProject
                    const isActive  = i === activeIndex
                    return (
                      <div
                        key={p.id}
                        className="will-change-transform"
                        style={{
                          width:    nodeW,
                          height:   nodeH,
                          position: 'absolute',
                          // Center the card in the orbit container
                          top:  `calc(50% - ${nodeH / 2}px)`,
                          left: `calc(50% - ${nodeW / 2}px)`,
                          // Orbit placement: rotate to angle, then push outward by radius
                          transform: `rotate(${baseAngle}deg) translateY(-${radius}px) translateZ(0)`,
                          // z-index on this outer wrapper (within the rotating parent's stacking
                          // context created by will-change:transform) controls sibling stacking.
                          // Active card renders above its neighbors.
                          zIndex: isActive ? 20 : 10,
                        }}
                      >
                        {/* Counter-rotation keeps the card visually upright */}
                        <div
                          className="w-full h-full relative will-change-transform"
                          style={{ transform: `rotate(${currentRotation - baseAngle}deg) translateZ(0)` }}
                        >
                          {/* Rectangular Preview Image */}
                          <motion.div
                            onClick={() => handleProfileClick(i)}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-full h-full rounded-xl overflow-hidden border-[2px] cursor-pointer transition-all duration-300 relative ${
                              isActive
                                ? 'border-[var(--primary)] shadow-[0_0_25px_rgba(99,184,255,0.6)] scale-110'
                                : 'border-white/10 hover:border-white/30 opacity-60 hover:opacity-100'
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={previewScreenshotUrl(p.url)}
                              alt={p.title}
                              onError={safeImage}
                              loading="lazy"
                              className="w-full h-full object-cover object-top select-none"
                              draggable={false}
                            />
                            {/* Darken overlay for inactive cards */}
                            {!isActive && (
                              <div className="absolute inset-0 bg-black/50 hover:bg-black/20 transition-colors" />
                            )}
                          </motion.div>

                          {/* Card label — only visible when active */}
                          <div
                            className={`absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 text-center whitespace-nowrap pointer-events-none transition-opacity duration-300 ${
                              isActive ? 'opacity-100' : 'opacity-0'
                            }`}
                          >
                            <h4 className="text-xs font-display font-bold text-white tracking-wide">
                              {p.title}
                            </h4>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* ── Center Hub Logo — static, outside rotation ──────── */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-[#63b8ff]/60 pointer-events-none">
                  <svg
                    key={activeIndex}
                    width="64"
                    height="64"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-shrink-0"
                  >
                    <motion.path
                      d="M14 2L24.392 8V20L14 26L3.608 20V8L14 2Z"
                      stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 1.0, ease: 'easeInOut' }}
                    />
                    <motion.path
                      d="M14 14L14 26"
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
                    />
                    <motion.path
                      d="M14 14L3.608 8"
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
                    />
                    <motion.path
                      d="M14 14L24.392 8"
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
                    />
                    <motion.circle
                      cx="14" cy="14" r="2.5"
                      fill="currentColor"
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.7, type: 'spring' }}
                    />
                  </svg>
                </div>
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
