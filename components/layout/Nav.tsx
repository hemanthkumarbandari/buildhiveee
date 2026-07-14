'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useUIStore } from '@/store/ui.store'
import { useScrollStore } from '@/store/scroll.store'
import MagneticButton from '@/components/ui/MagneticButton'

import { useIsMobile } from '@/hooks/useIsMobile'

const links = [
  { label: 'Craft', href: '#services' },
  { label: 'The Proof', href: '#work' },
  { label: 'The Edge', href: '#edge' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav() {
  const scrolled = useUIStore((s) => s.navScrolled)
  const setScrolled = useUIStore((s) => s.setNavScrolled)
  const mobileOpen = useUIStore((s) => s.mobileNavOpen)
  const setMobileOpen = useUIStore((s) => s.setMobileNav)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  
  // Use the new hook for any mobile-specific nav behaviors later
  const isMobile = useIsMobile()

  useEffect(() => {
    return useScrollStore.subscribe(
      (s) => s.scrollY,
      (y) => {
        const isScrolled = y > 50
        if (useUIStore.getState().navScrolled !== isScrolled) {
          setScrolled(isScrolled)
        }
      }
    )
  }, [setScrolled])

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sections = links.map((l) => document.querySelector(l.href))
    if (!sections.some(Boolean)) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`)
          }
        })
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    )

    sections.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 3.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 left-0 right-0 z-[100] flex flex-col items-center pointer-events-none px-4 md:px-8"
        aria-label="Main navigation"
      >
        <motion.div
          animate={{
            height: scrolled ? '56px' : '64px',
          }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          style={{
            background: scrolled
              ? 'rgba(6,10,20,0.85)'
              : 'rgba(6,10,20,0.45)',
            backdropFilter: scrolled ? 'blur(18px) saturate(180%)' : 'blur(12px)',
            WebkitBackdropFilter: scrolled ? 'blur(18px) saturate(180%)' : 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '24px',
            boxShadow: scrolled
              ? '0 8px 32px rgba(0,0,0,0.40)'
              : '0 4px 24px rgba(0,0,0,0.20)',
            transition: 'background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, height 0.35s ease',
          }}
          className="w-full max-w-[1400px] flex items-center justify-between pointer-events-auto"
        >
          {/* Full-width inner layout with generous side padding */}
          <div className="flex items-center justify-between w-full px-5 md:px-8">
            {/* Logo — restored original 3D cube logo */}
            <a href="/" className="flex items-center gap-2 group magnetic-target flex-shrink-0">
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                {/* Outer Hexagon */}
                <motion.path
                  d="M14 2L24.392 8V20L14 26L3.608 20V8L14 2Z"
                  stroke="#63b8ff" strokeWidth="2" strokeLinejoin="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 3.2, ease: 'easeInOut' }}
                  className="group-hover:stroke-white transition-colors"
                />
                {/* Inner Cube Lines */}
                <motion.path
                  d="M14 14L14 26"
                  stroke="#63b8ff" strokeWidth="2" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 4.2, ease: 'easeOut' }}
                  className="group-hover:stroke-white transition-colors"
                />
                <motion.path
                  d="M14 14L3.608 8"
                  stroke="#63b8ff" strokeWidth="2" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 4.4, ease: 'easeOut' }}
                  className="group-hover:stroke-white transition-colors"
                />
                <motion.path
                  d="M14 14L24.392 8"
                  stroke="#63b8ff" strokeWidth="2" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 4.6, ease: 'easeOut' }}
                  className="group-hover:stroke-white transition-colors"
                />
                {/* Center Dot for a tech feel */}
                <motion.circle
                  cx="14" cy="14" r="2.5"
                  fill="#63b8ff"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 5.0, type: 'spring' }}
                  className="group-hover:scale-[1.8] group-hover:fill-white transition-all duration-300 origin-center"
                />
              </svg>
              <span className="font-display font-black text-[1.1rem] md:text-[1.3rem] leading-none select-none tracking-[-0.02em]">
                <span className="text-white">Build</span>
                <span className="text-[#63b8ff]">Hive</span>
              </span>
            </a>

            {/* Desktop nav links — Fix 2: lighter weight, letter-spacing, smooth transitions */}
            <div className="hidden md:flex items-center gap-7">
              {links.map((link) => {
                const isActive = activeSection === link.href
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className="relative font-body text-[0.825rem] py-1 nav-link-item"
                    style={{
                      fontWeight: 400,
                      letterSpacing: '0.01em',
                      color: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)',
                      transition: 'color 0.2s ease, opacity 0.2s ease',
                    }}
                    onMouseEnter={() => setHoveredLink(link.label)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {link.label}
                    {/* Animated underline on hover */}
                    <AnimatePresence>
                      {hoveredLink === link.label && !isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute -bottom-0.5 left-0 right-0 h-px"
                          style={{ background: 'rgba(99,184,255,0.6)' }}
                          initial={{ scaleX: 0, opacity: 0 }}
                          animate={{ scaleX: 1, opacity: 1 }}
                          exit={{ scaleX: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                        />
                      )}
                    </AnimatePresence>
                    {/* Active section dot indicator */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-dot"
                        className="absolute -bottom-0.5 left-0 right-0 h-px rounded-full"
                        style={{ background: 'rgba(99,184,255,1)' }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      />
                    )}
                  </a>
                )
              })}
            </div>

            {/* Right side — Fix 3: border-fill CTA button, editorial radius */}
            <div className="hidden md:flex items-center">
              <MagneticButton>
                <a
                  href="#contact"
                  className="nav-cta-btn inline-flex items-center gap-2 font-body font-medium text-[0.8rem] px-5 py-2 rounded-[9px]"
                  style={{
                    letterSpacing: '0.015em',
                    border: '1px solid rgba(99,184,255,0.45)',
                    color: 'rgba(99,184,255,1)',
                    background: 'rgba(99,184,255,0.06)',
                    transition: 'background 0.22s ease, color 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget
                    el.style.background = 'rgba(99,184,255,1)'
                    el.style.color = '#020b14'
                    el.style.borderColor = 'rgba(99,184,255,1)'
                    el.style.boxShadow = '0 0 18px rgba(99,184,255,0.35)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget
                    el.style.background = 'rgba(99,184,255,0.06)'
                    el.style.color = 'rgba(99,184,255,1)'
                    el.style.borderColor = 'rgba(99,184,255,0.45)'
                    el.style.boxShadow = 'none'
                  }}
                >
                  Start a Project
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="flex-shrink-0">
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </MagneticButton>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-panel"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </motion.div>

        {/* Mobile panel */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-nav-panel"
              role="dialog"
              aria-label="Mobile navigation"
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: '12px' }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[1400px] overflow-hidden border border-white/10 p-6 flex flex-col gap-4 pointer-events-auto rounded-2xl"
              style={{
                background: 'rgba(6,10,20,0.95)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
              }}
            >
              <div className="flex flex-col gap-4">
                {links.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.06 }}
                    className="font-display font-bold text-2xl text-white border-b border-white/10 py-3 tracking-tight flex items-center min-h-[44px]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </motion.a>
                ))}
                <a
                  href="#contact"
                  className="mt-4 inline-flex justify-center items-center gap-2 border border-[#63b8ff]/40 text-[#63b8ff] font-medium text-sm px-6 py-4 rounded-[9px] min-h-[44px]"
                  style={{ background: 'rgba(99,184,255,0.06)', letterSpacing: '0.015em' }}
                  onClick={() => setMobileOpen(false)}
                >
                  Start a Project
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}
