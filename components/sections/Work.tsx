'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Briefcase, Mail, MoreHorizontal } from 'lucide-react'
import { projects } from '@/data/projects'

// --- Utility for fallback images ---
const safeImage = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement
  target.src = "https://placehold.co/300x200/0c1e30/63b8ff?text=Preview+Unavailable"
}

function previewScreenshotUrl(url: string) {
  return `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=640`
}

export default function Work() {
  const [activeIndex, setActiveIndex] = useState(0)

  const containerRadius = 240
  const nodeW = 144 // Increased size
  const nodeH = 90
  const containerSize = containerRadius * 2 + 180

  // Calculate rotation for each project
  const getRotation = useCallback(
    (index: number): number => (index - activeIndex) * (360 / projects.length),
    [activeIndex]
  )

  // Navigation
  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % projects.length)
  }, [])

  const prev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + projects.length) % projects.length)
  }, [])

  const handleProfileClick = useCallback((index: number) => {
    if (index === activeIndex) return
    setActiveIndex(index)
  }, [activeIndex])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'ArrowLeft') prev()
      else if (event.key === 'ArrowRight') next()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [prev, next])

  // Autoplay auto-cycling every 5 seconds (resets on interaction/activeIndex change)
  useEffect(() => {
    const timer = setTimeout(() => {
      next()
    }, 5000)
    return () => clearTimeout(timer)
  }, [activeIndex, next])

  return (
    <section id="work" className="relative z-10 py-24 w-full overflow-hidden">
      {/* Background glow ambient */}
      <div className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[var(--primary)]/5 blur-[120px] pointer-events-none -z-10" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 mb-8 text-center md:text-left flex flex-col items-center md:items-start">
        <div className="flex flex-col gap-4 items-center md:items-start">
          <p className="font-body text-[var(--primary)] text-sm font-semibold tracking-widest uppercase">
            THE PROOF
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-[var(--text)] leading-tight">
            Selected works.
          </h2>
          <p className="font-body text-[var(--text-secondary)] text-base md:text-lg max-w-2xl leading-relaxed">
            Live project previews — scroll to stack through each build.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-4 items-center w-full">
          
          {/* Left: Orbiting Carousel */}
          <div className="relative flex items-center justify-center w-full min-h-[500px] lg:min-h-[600px] overflow-hidden py-0">
            <div
              className="relative flex items-center justify-center select-none scale-[0.5] sm:scale-[0.7] lg:scale-[0.95] xl:scale-100 transition-transform duration-300 origin-center"
              style={{ width: containerSize, height: containerSize }}
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
                <motion.circle cx={containerRadius} cy={containerRadius} r={containerRadius + 50} 
                  fill="none" stroke="rgba(99,184,255,0.4)" strokeWidth="1" 
                  strokeDasharray="60 120 40 200 100 80" strokeLinecap="square"
                  animate={{ rotate: 360 }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: `${containerRadius}px ${containerRadius}px` }}
                />
                
                {/* Ring 2 - Outer */}
                <motion.circle cx={containerRadius} cy={containerRadius} r={containerRadius + 42} 
                  fill="none" stroke="rgba(99,184,255,0.2)" strokeWidth="2" 
                  strokeDasharray="150 100 50 200 30 150" strokeLinecap="square"
                  animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: `${containerRadius}px ${containerRadius}px` }}
                />

                {/* Ring 3 - Middle thick */}
                <motion.circle cx={containerRadius} cy={containerRadius} r={containerRadius + 15} 
                  fill="none" stroke="rgba(99,184,255,0.5)" strokeWidth="4" 
                  strokeDasharray="40 300 200 150" strokeLinecap="square" filter="url(#glow)"
                  animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: `${containerRadius}px ${containerRadius}px` }}
                />

                {/* Ring 4 - Inner */}
                <motion.circle cx={containerRadius} cy={containerRadius} r={containerRadius} 
                  fill="none" stroke="rgba(99,184,255,0.3)" strokeWidth="1.5" 
                  strokeDasharray="100 50 20 200 300 100" strokeLinecap="square"
                  animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: `${containerRadius}px ${containerRadius}px` }}
                />
                
                {/* Ring 5 - Inner thick glowing */}
                <motion.circle cx={containerRadius} cy={containerRadius} r={containerRadius - 10} 
                  fill="none" stroke="rgba(99,184,255,0.6)" strokeWidth="2" 
                  strokeDasharray="80 150 40 300 250 80" strokeLinecap="square" filter="url(#glow)"
                  animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: `${containerRadius}px ${containerRadius}px` }}
                />
              </svg>

              {/* Center Logo - Animated Cube like Navbar */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 text-[#63b8ff]/60 pointer-events-none">
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

              {/* Orbiting Project Nodes */}
              {projects.map((p, i) => {
                const rotation = getRotation(i)
                const isActive = i === activeIndex
                return (
                  <motion.div
                    key={p.id}
                    animate={{
                      transform: `rotate(${rotation}deg) translateY(-${containerRadius}px)`,
                    }}
                    transition={{
                      duration: 0.8,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                    style={{
                      width: nodeW,
                      height: nodeH,
                      position: "absolute",
                      top: `calc(50% - ${nodeH / 2}px)`,
                      left: `calc(50% - ${nodeW / 2}px)`,
                    }}
                    className="z-10"
                  >
                    {/* Counter-rotation to keep items upright */}
                    <motion.div
                      animate={{ rotate: -rotation }}
                      transition={{
                        duration: 0.8,
                        ease: [0.34, 1.56, 0.64, 1],
                      }}
                      className="w-full h-full relative"
                    >
                      {/* Rectangular Preview Image */}
                      <motion.div
                        onClick={() => handleProfileClick(i)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full h-full rounded-xl overflow-hidden border-[2px] cursor-pointer transition-all duration-300 relative ${
                          isActive 
                            ? "border-[var(--primary)] shadow-[0_0_25px_rgba(99,184,255,0.6)] z-20" 
                            : "border-white/10 hover:border-white/30 z-10"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewScreenshotUrl(p.url)}
                          alt={p.title}
                          onError={safeImage}
                          className="w-full h-full object-cover object-top select-none"
                          draggable={false}
                        />
                        {/* Overlay gradient to darken slightly if not active */}
                        {!isActive && <div className="absolute inset-0 bg-black/40 hover:bg-black/10 transition-colors" />}
                      </motion.div>

                      {/* Text below the rectangular node */}
                      <div className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 text-center whitespace-nowrap pointer-events-none">
                        <h4 className="text-xs font-display font-bold text-white tracking-wide">
                          {p.title}
                        </h4>
                        <div className="flex items-center justify-center text-[10px] text-white/50 mt-0.5 font-body">
                          <Briefcase size={10} className="mr-1 text-white/40" />
                          <span>{p.category}</span>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Right: Active Project Details Card */}
          <div className="flex justify-center lg:justify-end w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
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

                  <p className="text-sm text-white/60 leading-relaxed mb-10 min-h-[60px]">
                    {projects[activeIndex].description}
                  </p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={prev}
                    className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
                    aria-label="Previous project"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <a
                    href={projects[activeIndex].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3.5 rounded-2xl bg-[#5438ff] hover:bg-[#4b32e6] text-white font-bold text-sm flex items-center justify-center transition-all shadow-[0_0_20px_rgba(84,56,255,0.3)] hover:shadow-[0_0_30px_rgba(84,56,255,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Connect
                  </a>
                  <button
                    onClick={next}
                    className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
                    aria-label="Next project"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Dot Indicators */}
        <div className="flex items-center justify-center space-x-3 mt-4 mb-8">
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
    </section>
  )
}
