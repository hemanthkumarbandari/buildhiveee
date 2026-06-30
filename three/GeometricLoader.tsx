'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function GeometricLoader() {
  const outerRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  const wireMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#63b8ff',
        wireframe: true,
        transparent: true,
        opacity: 0.9,
      }),
    []
  )

  const solidMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#3f9cff',
        transparent: true,
        opacity: 0.2,
        wireframe: false,
      }),
    []
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (outerRef.current) {
      outerRef.current.rotation.x = t * 0.8
      outerRef.current.rotation.y = t * 1.1
    }
    if (innerRef.current) {
      innerRef.current.rotation.x = -t * 1.2
      innerRef.current.rotation.z = t * 0.9
    }
    if (ringRef.current) {
      ringRef.current.rotation.y = t * 1.5
      ringRef.current.rotation.x = Math.sin(t) * 0.3
    }
  })

  return (
    <group scale={1.2}>
      <mesh ref={outerRef} material={wireMat}>
        <icosahedronGeometry args={[1, 1]} />
      </mesh>
      <mesh ref={innerRef} material={solidMat}>
        <octahedronGeometry args={[0.55, 0]} />
      </mesh>
      <mesh ref={ringRef} material={wireMat} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.35, 0.02, 8, 64]} />
      </mesh>
    </group>
  )
}
