'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMousePosition } from '@/hooks/useMousePosition'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { lerp } from '@/lib/utils'

export default function HeroCenterpiece() {
  const groupRef = useRef<THREE.Group>(null)
  const mouse = useMousePosition()
  const reduced = useReducedMotion()
  const targetRot = useRef({ x: 0, y: 0 })
  const currentRot = useRef({ x: 0, y: 0 })

  const wireMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#63b8ff'),
        wireframe: true,
        transparent: true,
        opacity: 0.85,
      }),
    []
  )

  const solidMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#3f9cff'),
        metalness: 0.6,
        roughness: 0.2,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
      }),
    []
  )

  useFrame(({ clock }) => {
    const group = groupRef.current
    if (!group) return

    const t = clock.getElapsedTime()

    if (!reduced) {
      targetRot.current.x = -mouse.normalizedY * 0.35
      targetRot.current.y = mouse.normalizedX * 0.45
    } else {
      targetRot.current.x = 0
      targetRot.current.y = 0
    }

    currentRot.current.x = lerp(currentRot.current.x, targetRot.current.x, 0.04)
    currentRot.current.y = lerp(currentRot.current.y, targetRot.current.y, 0.04)

    group.rotation.x = currentRot.current.x + Math.sin(t * 0.3) * 0.08
    group.rotation.y = currentRot.current.y + t * 0.25
    group.rotation.z = Math.sin(t * 0.2) * 0.05
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh material={solidMaterial}>
        <torusKnotGeometry args={[1.4, 0.38, 180, 24]} />
      </mesh>
      <mesh material={wireMaterial}>
        <torusKnotGeometry args={[1.4, 0.38, 180, 24]} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 4, 0, Math.PI / 6]} material={wireMaterial}>
        <icosahedronGeometry args={[2.2, 1]} />
      </mesh>
    </group>
  )
}
