'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScrollStore } from '@/store/scroll.store'
import waterVert from '@/shaders/water.vert.glsl'
import waterFrag from '@/shaders/water.frag.glsl'

export default function WaterSurface() {
  const meshRef = useRef<THREE.Mesh>(null)
  const scrollY = useScrollStore((s) => s.scrollY)

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: waterVert,
        fragmentShader: waterFrag,
        uniforms: {
          uTime: { value: 0 },
          uWaveHeight: { value: 0.28 },
          uScrollY: { value: 0 },
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    []
  )

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.getElapsedTime()
    material.uniforms.uScrollY.value = scrollY
  })

  return (
    <mesh
      ref={meshRef}
      material={material}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -5, 0]}
    >
      <planeGeometry args={[60, 60, 128, 128]} />
    </mesh>
  )
}
