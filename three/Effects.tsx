'use client'

import { Vector2 } from 'three'
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { useScrollVelocity } from '@/hooks/useScrollVelocity'
import { useMemo } from 'react'

interface EffectsProps {
  isMobile: boolean
}

export default function Effects({ isMobile }: EffectsProps) {
  const velocity = useScrollVelocity()
  const aberrationOffset = useMemo(
    () => new Vector2(
      0.00015 + Math.abs(velocity) * 0.00002,
      0.00012 + Math.abs(velocity) * 0.000015
    ),
    [velocity]
  )

  return (
    <EffectComposer multisampling={isMobile ? 0 : 4}>
      <Bloom
        intensity={isMobile ? 0.15 : 0.25}
        luminanceThreshold={0.85}
        luminanceSmoothing={0.95}
        mipmapBlur
      />
      <ChromaticAberration
        offset={aberrationOffset}
        radialModulation
        modulationOffset={0.4}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise opacity={0.025} blendFunction={BlendFunction.ADD} />
      <Vignette eskil={false} offset={0.15} darkness={0.28} />
    </EffectComposer>
  )
}
