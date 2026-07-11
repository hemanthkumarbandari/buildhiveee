'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import SnowEffect from '@/components/ui/SnowEffect'
import MagneticButton from '@/components/ui/MagneticButton'
import SnowmanHero from '@/components/ui/SnowmanHero'
import { gsap } from '@/lib/gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const childVariants = {
  hidden: { y: 44, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      if (headlineRef.current) {
        gsap.to(headlineRef.current, {
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative z-10 min-h-screen flex items-center pt-20 overflow-hidden isolate"
    >
      <SnowEffect />
      <div className="absolute top-[-20%] left-[-15%] w-[150%] max-w-[800px] aspect-square rounded-full bg-[var(--primary)]/15 blur-[160px] pointer-events-none -z-10" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-[55fr_45fr] gap-12 md:gap-8 items-center">
          <motion.div
            ref={headlineRef}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            <motion.div variants={childVariants} className="flex flex-col">
              <h1 className="font-display font-bold leading-[1.1] tracking-tight text-[var(--text)]" style={{ fontSize: 'clamp(2.5rem, 5vw + 1rem, 4.5rem)' }}>
                <div className="mb-2">We craft modern</div>
                <div className="gradient-text pb-2">digital experiences.</div>
              </h1>
            </motion.div>

            <motion.p
              variants={childVariants}
              className="font-body text-lg text-[var(--text-secondary)] max-w-lg leading-relaxed"
            >
              Interactive 3D worlds, live data dashboards, and high-performance applications designed to elevate your brand.
            </motion.p>

            <motion.div variants={childVariants} className="flex flex-wrap items-center gap-4">
              <MagneticButton>
                <a
                  href="#contact"
                  className="relative overflow-hidden inline-flex items-center gap-2 accent-gradient text-white font-body font-semibold px-7 py-3.5 rounded-full group"
                >
                  <span className="relative z-10">Start a Project</span>
                  <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                </a>
              </MagneticButton>
              <MagneticButton>
                <a
                  href="#work"
                  className="inline-flex items-center gap-2 bg-transparent border border-[var(--border)] text-[var(--text)] font-body font-semibold px-7 py-3.5 rounded-full hover:bg-white/5 transition-all duration-300"
                >
                  See the Work
                </a>
              </MagneticButton>
            </motion.div>

            <motion.div variants={childVariants} className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['var(--primary)', 'var(--primary-2)', '#7dc9e8'].map((color, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.2 + i * 0.08 }}
                    className="w-8 h-8 rounded-full border-2 border-[var(--bg-mid)]"
                    style={{ background: `radial-gradient(circle at 35% 35%, ${color}, var(--bg-end))` }}
                  />
                ))}
              </div>
              <span className="font-body text-sm text-[var(--text-secondary)]" aria-label="40 or more client brands shipped">40+ brands shipped</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative h-[420px] md:h-[520px] hidden md:flex items-center justify-center"
          >
            <div className="relative flex items-center justify-center w-full h-full min-h-[500px]">
              <SnowmanHero />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
