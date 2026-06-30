'use client'

import { Suspense, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import HeroCenterpiece from './HeroCenterpiece'
import { useCanvasVisibility } from '@/hooks/useCanvasVisibility'

function HeroSceneInner() {
  const containerRef = useRef<HTMLDivElement>(null)
  const visible = useCanvasVisibility(containerRef)

  return (
    <div ref={containerRef} className="w-full h-full">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={visible ? 'always' : 'demand'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
        <ambientLight intensity={0.5} color="#c1cedb" />
        <pointLight position={[4, 4, 4]} intensity={1.2} color="#63b8ff" />
        <pointLight position={[-3, -2, 2]} intensity={0.5} color="#3f9cff" />
        <Suspense fallback={null}>
          <HeroCenterpiece />
        </Suspense>
      </Canvas>
    </div>
  )
}

const HeroScene = dynamic(() => Promise.resolve(HeroSceneInner), { ssr: false })

export default HeroScene
