'use client'

import { motion } from 'framer-motion'
import Marquee from '@/components/ui/Marquee'
import ColorBends from '@/components/ui/ColorBends'

const cards = [
  {
    index: '01',
    title: 'Custom Admin Panels',
    body: "Bespoke dashboards with role-based access, live data, and full control. No third-party CMS dependency.",
  },
  {
    index: '02',
    title: 'Backend That Holds Up',
    body: 'REST APIs, auth flows, and server logic — engineered for real traffic, not just a demo.',
  },
  {
    index: '03',
    title: 'Automation Pipelines',
    body: 'Forms that auto-route to CRMs. Webhooks, scheduled jobs, and event-driven workflows.',
  },
  {
    index: '04',
    title: 'Long-Term Security',
    body: 'HTTPS, sanitized inputs, rate limiting, encrypted storage, and regular dependency audits.',
  },
  {
    index: '05',
    title: 'Performance at Every Layer',
    body: 'Sub-second loads. Optimized queries. CDN-ready. We benchmark before and after every deploy.',
  },
  {
    index: '06',
    title: 'Clean Handoff. Lasting Partnership.',
    body: "Documented codebase, staging envs, and deployment pipelines. We don't vanish after launch.",
  },
]

const brands = [
  'NGS', 'IND MASTERS', 'ROS', 'Sophrion',
  'NGS', 'IND MASTERS', 'ROS', 'Sophrion',
  'NGS', 'IND MASTERS', 'ROS', 'Sophrion',
  'NGS', 'IND MASTERS', 'ROS', 'Sophrion',
]

function EdgeCard({ card, delay }: { card: typeof cards[0]; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="edge-card group"
    >
      <span className="edge-card-num">[{card.index}]</span>
      <h3 className="edge-card-title">{card.title}</h3>
      <p className="edge-card-body">{card.body}</p>
    </motion.div>
  )
}

export default function Edge() {
  return (
    <section
      id="edge"
      className="relative z-10 py-20 overflow-hidden"
    >
      {/* ColorBends ambient — untouched */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto opacity-30 mix-blend-screen">
        <ColorBends
          colors={['#7dc9e8', '#3f9cff', '#0a192f']}
          rotation={90}
          speed={0.15}
          scale={1.2}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1.5}
          noise={0.1}
          parallax={0.3}
          iterations={2}
          intensity={1}
          bandWidth={4}
          transparent={true}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ── Header — compact two-col layout ─── */}
        <div className="edge-header">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55 }}
          >
            <p className="font-body text-glacier text-xs font-semibold tracking-widest uppercase mb-3">
              The Edge
            </p>
            <h2 className="font-display font-bold leading-[1.15]" style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.75rem)' }}>
              <span className="text-white block mb-1">Not just a studio.</span>
              <span className="text-[var(--primary)] block">A full production partner.</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="font-body text-white/50"
            style={{ fontSize: '0.95rem', lineHeight: '1.7', maxWidth: '420px', marginTop: 'auto', marginBottom: '4px' }}
          >
            Most agencies hand you a Figma file and disappear. We stay — through backend, infrastructure, admin systems, and everything after launch.
          </motion.p>
        </div>

        {/* ── 3-Col Card Grid ─────────────────── */}
        <div className="edge-card-grid">
          {cards.map((card, i) => (
            <EdgeCard key={card.index} card={card} delay={i * 0.06} />
          ))}
        </div>

        {/* ── Bottom tagline ───────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            borderTop: '1px solid rgba(255,255,255,0.07)',
            padding: '28px 0',
            textAlign: 'center',
          }}
        >
          <p
            className="font-body"
            style={{ fontSize: '0.95rem', opacity: 0.4, letterSpacing: '0.03em' }}
          >
            While other studios ship you a site — we ship you a system.
          </p>
        </motion.div>

        {/* ── Brand Marquee ────────────────────── */}
        <div className="border-t border-white/10 pt-12 pb-12 relative">
          <div className="trusted-wave-layer" aria-hidden="true">
            <svg className="trusted-wave-1" viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,30 C180,55 360,5 540,30 C720,55 900,5 1080,30 C1260,55 1440,5 1440,30 L1440,60 L0,60 Z" fill="#0d1e30" fillOpacity="0.55" />
            </svg>
            <svg className="trusted-wave-2" viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,35 C240,10 480,55 720,35 C960,10 1200,55 1440,35 L1440,60 L0,60 Z" fill="#0a1828" fillOpacity="0.45" />
            </svg>
            <svg className="trusted-wave-3" viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,40 C200,20 400,55 600,40 C800,20 1000,55 1200,40 C1300,30 1380,45 1440,40 L1440,60 L0,60 Z" fill="#0e2235" fillOpacity="0.35" />
            </svg>
          </div>
          <p className="font-body text-xs text-white/30 uppercase tracking-widest text-center mb-8 relative z-10">
            Trusted by
          </p>
          <div className="relative z-10">
            <Marquee speed={30}>
              {brands.map((brand, idx) => (
                <div
                  key={`${brand}-${idx}`}
                  className="mx-3 md:mx-5 py-4 cursor-default group perspective-1000"
                >
                  <div className="px-8 md:px-10 py-4 bg-[#0a1828]/40 backdrop-blur-md border border-white/5 hover:border-[var(--primary)]/30 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-500 ease-out flex items-center justify-center min-w-[180px] transform group-hover:-translate-y-1.5 group-hover:rotate-x-2 group-hover:shadow-[0_15px_40px_rgba(99,184,255,0.1)] relative overflow-hidden">
                    {/* Glide/Shine Effect */}
                    <div className="absolute inset-0 -translate-x-[150%] group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />

                    <span className="font-display font-bold text-lg md:text-xl text-white/30 group-hover:text-white transition-colors duration-500 relative z-10 tracking-wider">
                      {brand}
                    </span>
                  </div>
                </div>
              ))}
            </Marquee>
          </div>
        </div>

      </div>
    </section>
  )
}
