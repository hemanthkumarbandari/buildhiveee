'use client'

import { motion, useAnimationControls } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MarqueeProps {
  children: React.ReactNode
  className?: string
  speed?: number
}

export default function Marquee({ children, className, speed = 18 }: MarqueeProps) {
  const controls = useAnimationControls()

  return (
    <div className={cn('overflow-hidden', className)}>
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
        onHoverStart={() => controls.stop()}
        onHoverEnd={() =>
          controls.start({ x: ['0%', '-50%'], transition: { duration: speed, ease: 'linear', repeat: Infinity } })
        }
      >
        {/* Duplicate for seamless loop */}
        <span className="flex items-center">{children}</span>
        <span className="flex items-center">{children}</span>
      </motion.div>
    </div>
  )
}
