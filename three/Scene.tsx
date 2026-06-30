'use client'

import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import IceShards from './IceShards'
import WaterSurface from './WaterSurface'
import FogWisps from './FogWisps'
import AuroraRibbon from './AuroraRibbon'
import Effects from './Effects'

export default function Scene() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  if (isMobile) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        frameloop="always"
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <PerspectiveCamera makeDefault fov={75} near={0.1} far={100} position={[0, 0, 10]} />
        <ambientLight intensity={0.4} color="#eaf7fd" />
        <pointLight position={[10, 10, 5]} intensity={1.2} color="#7dc9e8" />
        <pointLight position={[-8, -6, 3]} intensity={0.6} color="#ffffff" />
        <Suspense fallback={null}>
          <IceShards />
          <WaterSurface />
          <FogWisps />
          <AuroraRibbon />
          <Effects isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  )
}
