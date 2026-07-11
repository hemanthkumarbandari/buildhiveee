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
  target.src = "https://placehold.co/640x400/0c1e30/63b8ff?text=Preview+Unavailable"
}

function previewScreenshotUrl(url: string) {
  return `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=640`
}

const CARD_STEP = 1200 // px of scroll per project

export default function Work() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showRays, setShowRays] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)

  const sectionRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  const containerRadius = 240
  const nodeW = 144
  const nodeH = 90
  const containerSize = containerRadius * 2 + 180

  const TOTAL = projects.length
  const anglePerProject = 360 / TOTAL
  // continuous rotation: maps 0..1 to 0..(N-1)*anglePerProject
  const currentRotation = scrollProgress * (TOTAL - 1) * anglePerProject

  // Scroll to specific index
  const scrollToIdx = useCallback((idx: number) => {
    const section = sectionRef.current
    if (!section) return
    const startY = section.offsetTop
    const targetY = startY + (idx / (TOTAL - 1)) * ((TOTAL - 1) * CARD_STEP)
    
    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    })
  }, [TOTAL])

  // Navigation
  const next = useCallback(() => {
    const n = (activeIndex + 1) % TOTAL
    scrollToIdx(n)
  }, [activeIndex, scrollToIdx, TOTAL])

  const prev = useCallback(() => {
    const n = (activeIndex - 1 + TOTAL) % TOTAL
    scrollToIdx(n)
  }, [activeIndex, scrollToIdx, TOTAL])

  const handleProfileClick = useCallback((index: number) => {
    if (index === activeIndex) return
    scrollToIdx(index)
  }, [activeIndex, scrollToIdx])

  // ScrollTrigger Setup
  useEffect(() => {
    const section = sectionRef.current
    const sticky = stickyRef.current
    const isDesk = window.innerWidth >= 1024
    setIsDesktop(isDesk)
    
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024)
    window.addEventListener('resize', handleResize)
    
    if (!section || !sticky || !isDesk) {
      return () => window.removeEventListener('resize', handleResize)
    }

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `+=${(TOTAL - 1) * CARD_STEP}px`,
      pin: sticky,
      pinSpacing: true,
      scrub: 1.5,
      snap: 1 / (TOTAL - 1),
      onUpdate: (self) => {
        setScrollProgress(self.progress)
        const rawIndex = self.progress * (TOTAL - 1)
        setActiveIndex(Math.round(rawIndex))
      }
    })

    return () => {
      trigger.kill()
      window.removeEventListener('resize', handleResize)
    }
  }, [TOTAL])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'ArrowLeft') prev()
      else if (event.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [prev, next])

  // Check for mobile or reduced motion to disable SideRays
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768
    
    if (!prefersReducedMotion && !isMobile) {
      setShowRays(true)
    }
  }, [])

  return (
    <section 
      id="work" 
      ref={sectionRef}
      className="relative z-10 w-full theme-dark-bg"
      style={{ height: isDesktop ? `calc(100dvh + ${(TOTAL - 1) * CARD_STEP}px)` : 'auto' }}
    >
      <div 
        ref={stickyRef}
        className="relative w-full flex flex-col overflow-hidden pt-16 lg:pt-20 pb-10"
        style={{ height: isDesktop ? '100dvh' : 'auto' }}
      >
        {/* Background glow ambient */}
        <div className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[var(--primary)]/5 blur-[120px] pointer-events-none -z-10" aria-hidden="true" />
        
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

        {/* Header */}
        <div className="max-w-7xl mx-auto w-full px-6 mb-8 text-center md:text-left flex flex-col items-center md:items-start flex-shrink-0">
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
          {/* DESKTOP ORBIT LAYOUT */}
          <div className="hidden lg:grid grid-cols-2 gap-4 items-center w-full">
            
            {/* Left: Orbiting Carousel */}
            <div className="relative flex items-center justify-center w-full min-h-[400px] lg:min-h-[600px] overflow-hidden py-0 mt-4 lg:mt-8">
              <div
                className="relative flex items-center justify-center select-none scale-[0.45] sm:scale-[0.6] lg:scale-[0.8] xl:scale-[0.95] transition-transform duration-300 origin-center"
                style={{ width: containerSize, height: containerSize }}
              >
                
                {/* 
                  SINGLE ROTATING CONTAINER
                  By placing both the SVG arcs and the thumbnails inside the exact same DOM node 
                  that rotates based on scroll progress, we guarantee zero subpixel drift between them.
                  translateZ(0) forces GPU composition to prevent rendering artifacts.
                */}
                <div 
                  className="absolute inset-0 origin-center will-change-transform"
                  style={{ transform: `rotate(${-currentRotation}deg) translateZ(0)` }}
                >
                  {/* Animated Segmented Orbit Rings matching tech/hud design */}
                  <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible pointer-events-none" style={{ width: containerRadius * 2, height: containerRadius * 2 }}>
                    <defs>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Ring 1 - Outer */}
                    <circle cx={containerRadius} cy={containerRadius} r={containerRadius + 50} 
                      fill="none" stroke="rgba(99,184,255,0.4)" strokeWidth="1" 
                      strokeDasharray="60 120 40 200 100 80" strokeLinecap="square"
                    />
                    
                    {/* Ring 2 - Outer */}
                    <circle cx={containerRadius} cy={containerRadius} r={containerRadius + 42} 
                      fill="none" stroke="rgba(99,184,255,0.2)" strokeWidth="2" 
                      strokeDasharray="150 100 50 200 30 150" strokeLinecap="square"
                    />

                    {/* Ring 3 - Middle thick */}
                    <circle cx={containerRadius} cy={containerRadius} r={containerRadius + 15} 
                      fill="none" stroke="rgba(99,184,255,0.5)" strokeWidth="4" 
                      strokeDasharray="40 300 200 150" strokeLinecap="square" filter="url(#glow)"
                    />

                    {/* Ring 4 - Inner */}
                    <circle cx={containerRadius} cy={containerRadius} r={containerRadius} 
                      fill="none" stroke="rgba(99,184,255,0.3)" strokeWidth="1.5" 
                      strokeDasharray="100 50 20 200 300 100" strokeLinecap="square"
                    />
                    
                    {/* Ring 5 - Inner thick glowing */}
                    <circle cx={containerRadius} cy={containerRadius} r={containerRadius - 10} 
                      fill="none" stroke="rgba(99,184,255,0.6)" strokeWidth="2" 
                      strokeDasharray="80 150 40 300 250 80" strokeLinecap="square" filter="url(#glow)"
                    />
                  </svg>

                  {/* Orbiting Project Nodes */}
                  {projects.map((p, i) => {
                    const baseAngle = i * anglePerProject
                    const isActive = i === activeIndex
                    return (
                      <div
                        key={p.id}
                        style={{
                          width: nodeW,
                          height: nodeH,
                          position: "absolute",
                          top: `calc(50% - ${nodeH / 2}px)`,
                          left: `calc(50% - ${nodeW / 2}px)`,
                          transform: `rotate(${baseAngle}deg) translateY(-${containerRadius}px) translateZ(0)`,
                        }}
                        className="z-10 will-change-transform"
                      >
                        {/* Counter-rotation to keep items upright */}
                        <div
                          style={{
                            transform: `rotate(${currentRotation - baseAngle}deg) translateZ(0)`,
                          }}
                          className="w-full h-full relative will-change-transform"
                        >
                          {/* Rectangular Preview Image */}
                          <motion.div
                            onClick={() => handleProfileClick(i)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-full h-full rounded-xl overflow-hidden border-[2px] cursor-pointer transition-all duration-300 relative ${
                              isActive 
                                ? "border-[var(--primary)] shadow-[0_0_25px_rgba(99,184,255,0.6)] z-20 scale-110" 
                                : "border-white/10 hover:border-white/30 z-10 opacity-60 hover:opacity-100"
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
                            {/* Overlay gradient to darken slightly if not active */}
                            {!isActive && <div className="absolute inset-0 bg-black/50 hover:bg-black/20 transition-colors" />}
                          </motion.div>

                          {/* Text below the rectangular node */}
                          <div className={`absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 text-center whitespace-nowrap pointer-events-none transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                            <h4 className="text-xs font-display font-bold text-white tracking-wide">
                              {p.title}
                            </h4>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Center Logo - Animated Cube like Navbar (kept outside rotation so it stays upright/static) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-[#63b8ff]/60 pointer-events-none">
                  <svg
                    key={activeIndex}
                    width="64"
                    height="64"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-shrink-0"
                  >
                    {/* Outer Hexagon */}
                    <motion.path
                      d="M14 2L24.392 8V20L14 26L3.608 20V8L14 2Z"
                      stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 1.0, ease: 'easeInOut' }}
                    />
                    {/* Inner Cube Lines */}
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
                    {/* Center Dot for a tech feel */}
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

            {/* Right: Active Project Details Card */}
            <div className="flex justify-center lg:justify-end w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full max-w-[420px] bg-[#08121f]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-[0_32px_80px_rgba(0,0,0,0.4),0_0_40px_rgba(99,184,255,0.05)] relative"
                >
                  {/* Dots top right */}
                  <div className="absolute top-8 right-8 text-white/20">
                    <MoreHorizontal size={24} />
                  </div>

                  {/* Large Rectangular Preview Image */}
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

                  {/* Details */}
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

                  {/* Navigation Buttons */}
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

          {/* MOBILE CAROUSEL LAYOUT */}
          <div className="flex lg:hidden w-full overflow-x-auto snap-x snap-mandatory gap-4 pb-8 pt-4 -mx-6 px-6 relative z-20" style={{ scrollbarWidth: 'none' }}>
            {projects.map((p, i) => (
              <div key={p.id} className="snap-center shrink-0 w-[85vw] max-w-[340px] bg-[#08121f]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 shadow-glass relative flex flex-col">
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
                    ? "bg-[var(--primary)] w-6 shadow-[0_0_10px_rgba(99,184,255,0.5)]"
                    : "bg-white/20 w-2 hover:bg-white/40"
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
