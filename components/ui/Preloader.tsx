'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '@/store/ui.store'
import dynamic from 'next/dynamic'

const MagicRings = dynamic(() => import('@/components/ui/MagicRings'), {
  ssr: false,
  loading: () => null,
})

export default function Preloader() {
  const setPreloader = useUIStore((s) => s.setPreloader)
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const start = Date.now()
    const duration = 4000

    const tick = () => {
      const elapsed = Date.now() - start
      const p = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setProgress(Math.round(eased * 100))
      if (p < 1) {
        requestAnimationFrame(tick)
      } else {
        setTimeout(() => {
          setVisible(false)
          setPreloader(true)
        }, 500)
      }
    }
    requestAnimationFrame(tick)
  }, [setPreloader])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-8 bg-[#0a0f1e]"
        >
          {/* MagicRings Background */}
          <div className="absolute inset-0 z-0 pointer-events-auto">
            <MagicRings
              color="#7dc9e8"
              colorTwo="#3b82f6"
              ringCount={6}
              speed={0.8}
              attenuation={10}
              lineThickness={2}
              baseRadius={0.35}
              radiusStep={0.12}
              scaleRate={0.15}
              opacity={0.7}
              noiseAmount={0.08}
              ringGap={1.6}
              fadeIn={0.5}
              fadeOut={0.7}
              followMouse={true}
              mouseInfluence={0.2}
              hoverScale={1.2}
              parallax={0.05}
              clickBurst={true}
              blur={0}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center gap-8">
            <div className="w-20 h-20 rounded-full border-2 border-[var(--border)] border-t-[var(--primary)] animate-spin" />

            <div className="text-center">
              <div className="font-display font-bold text-4xl text-[var(--text)] tabular-nums">
                {progress}
              </div>
              <p className="font-body text-sm text-[var(--text-secondary)] mt-2 tracking-widest uppercase">
                Loading BuildHive
              </p>
              <div className="mt-5 w-48 h-px bg-[var(--border)] rounded overflow-hidden mx-auto">
                <motion.div
                  className="h-full accent-gradient"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
