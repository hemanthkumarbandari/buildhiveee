'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScrollVelocity } from '@/hooks/useScrollVelocity'
import { useMousePosition } from '@/hooks/useMousePosition'
import { lerp } from '@/lib/utils'

const SHARD_COUNT = 180

interface ShardData {
  position: THREE.Vector3
  rotation: THREE.Euler
  scale: number
  speed: number
  phase: number
  depth: number
}

export default function IceShards() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const matrix = useMemo(() => new THREE.Matrix4(), [])
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const velocity = useScrollVelocity()
  const mouse = useMousePosition()

  const shards = useMemo<ShardData[]>(() => {
    return Array.from({ length: SHARD_COUNT }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 24,
        (Math.random() - 0.5) * 10 - 2
      ),
      rotation: new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      ),
      scale: 0.08 + Math.random() * 0.52,
      speed: 0.3 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
      depth: Math.random(),
    }))
  }, [])

  const currentPositions = useRef(shards.map((s) => s.position.clone()))

  useFrame(({ clock }) => {
    const mesh = meshRef.current
    if (!mesh) return
    const t = clock.getElapsedTime()
    const windForce = Math.abs(velocity) * 0.015

    for (let i = 0; i < SHARD_COUNT; i++) {
      const shard = shards[i]
      const pos = currentPositions.current[i]

      // Float
      pos.y = shard.position.y + Math.sin(t * 0.4 * shard.speed + shard.phase) * 0.8

      // Mouse parallax
      pos.x = lerp(pos.x, shard.position.x + mouse.normalizedX * 1.2 * shard.depth, 0.02)

      // Scroll wind
      pos.x += (Math.random() - 0.5) * windForce

      // Rotation
      shard.rotation.x += 0.003 * shard.speed
      shard.rotation.y += 0.002 * shard.speed

      // Scale surge on scroll
      const scaleMod = 1 + Math.abs(velocity) * 0.008
      const finalScale = shard.scale * scaleMod

      dummy.position.copy(pos)
      dummy.rotation.copy(shard.rotation)
      dummy.scale.setScalar(finalScale)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#d6f0fb'),
        transmission: 0.92,
        roughness: 0.04,
        thickness: 1.4,
        ior: 1.45,
        reflectivity: 0.88,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        transparent: true,
        opacity: 0.85,
      }),
    []
  )

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, SHARD_COUNT]} material={material}>
      <icosahedronGeometry args={[1, 0]} />
    </instancedMesh>
  )
}
