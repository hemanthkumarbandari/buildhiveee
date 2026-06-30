'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'

// Register all GSAP plugins once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, CustomEase)

  // Register smooth custom ease for BuildHive
  CustomEase.create('buildhive', '0.16, 1, 0.3, 1')
  CustomEase.create('buildhive-in', '0.7, 0, 0.84, 0')
  CustomEase.create('buildhive-spring', '0.34, 1.56, 0.64, 1')

  // Sync GSAP ticker with Lenis (Lenis calls this externally)
  gsap.ticker.lagSmoothing(0)
}

export { gsap, ScrollTrigger, CustomEase }
