'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useUIStore } from '@/store/ui.store'
import { useScrollStore } from '@/store/scroll.store'
import MagneticButton from '@/components/ui/MagneticButton'

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

  useEffect(() => {
    return useScrollStore.subscribe(
      (s) => s.scrollY,
      (y) => {
        const isScrolled = y > 40
        if (useUIStore.getState().navScrolled !== isScrolled) {
          setScrolled(isScrolled)
        }
      }
    )
  }, [setScrolled])


  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 3.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 left-0 right-0 z-[100] flex flex-col items-center gap-2 px-4 pointer-events-none"
        aria-label="Main navigation"
      >
        <motion.div
          animate={{
            height: scrolled ? '56px' : '64px',
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full max-w-5xl bg-night/70 backdrop-blur-md border border-white/10 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.3)] flex items-center justify-between px-4 md:px-6 pointer-events-auto"
        >
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group magnetic-target">
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
                stroke="#7dc9e8" strokeWidth="2" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 3.2, ease: 'easeInOut' }}
                className="group-hover:stroke-white transition-colors"
              />
              {/* Inner Cube Lines */}
              <motion.path
                d="M14 14L14 26"
                stroke="#7dc9e8" strokeWidth="2" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 4.2, ease: 'easeOut' }}
                className="group-hover:stroke-white transition-colors"
              />
              <motion.path
                d="M14 14L3.608 8"
                stroke="#7dc9e8" strokeWidth="2" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 4.4, ease: 'easeOut' }}
                className="group-hover:stroke-white transition-colors"
              />
              <motion.path
                d="M14 14L24.392 8"
                stroke="#7dc9e8" strokeWidth="2" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 4.6, ease: 'easeOut' }}
                className="group-hover:stroke-white transition-colors"
              />
              {/* Center Dot for a tech feel */}
              <motion.circle
                cx="14" cy="14" r="2.5"
                fill="#7dc9e8"
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 5.0, type: 'spring' }}
                className="group-hover:scale-[1.8] group-hover:fill-white transition-all duration-300 origin-center"
              />
            </svg>
            <span className="font-display font-black text-[1.1rem] md:text-[1.3rem] leading-none select-none">
              <span className="text-white">Build</span>
              <span className="text-glacier">Hive</span>
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative font-body text-sm text-white/70 hover:text-white transition-colors py-1"
                onMouseEnter={() => setHoveredLink(link.label)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {link.label}
                <AnimatePresence>
                  {hoveredLink === link.label && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-glacier"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      exit={{ scaleX: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center">
            <MagneticButton>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-glacier to-deep text-white font-body font-semibold text-sm px-5 py-2 rounded-full hover:shadow-ice transition-shadow"
              >
                Start a Project →
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
        </motion.div>

        {/* Mobile panel */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-nav-panel"
              role="dialog"
              aria-label="Mobile navigation"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-5xl overflow-hidden bg-night/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 flex flex-col gap-4 pointer-events-auto shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] mt-2"
            >
              <div className="flex flex-col gap-4">
                {links.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.06 }}
                    className="font-display font-bold text-2xl text-white border-b border-glacier/20 pb-3"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </motion.a>
                ))}
                <a
                  href="#contact"
                  className="mt-2 inline-flex justify-center bg-gradient-to-r from-glacier to-deep text-white font-semibold text-sm px-6 py-3 rounded-full shadow-ice"
                  onClick={() => setMobileOpen(false)}
                >
                  Start a Project →
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}
