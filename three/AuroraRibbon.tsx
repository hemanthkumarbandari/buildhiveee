'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import auroraFrag from '@/shaders/aurora.frag.glsl'

const auroraVert = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const CONTROL_POINTS = [
  new THREE.Vector3(-20, 8, -6),
  new THREE.Vector3(-14, 11, -5),
  new THREE.Vector3(-7, 7, -7),
  new THREE.Vector3(0, 12, -5),
  new THREE.Vector3(7, 8, -6),
  new THREE.Vector3(14, 13, -5),
  new THREE.Vector3(18, 9, -7),
  new THREE.Vector3(22, 11, -6),
]

export default function AuroraRibbon() {
  const meshRef = useRef<THREE.Mesh>(null)
  const controlPoints = useRef(CONTROL_POINTS.map((p) => p.clone()))

  const { geometry, material } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(controlPoints.current)
    const geo = new THREE.TubeGeometry(curve, 200, 0.35, 8, false)

    const mat = new THREE.ShaderMaterial({
      vertexShader: auroraVert,
      fragmentShader: auroraFrag,
      uniforms: {
        uTime: { value: 0 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })

    return { geometry: geo, material: mat }
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    material.uniforms.uTime.value = t

    // Slowly morph control points
    if (meshRef.current) {
      controlPoints.current.forEach((pt, i) => {
        pt.y = CONTROL_POINTS[i].y + Math.sin(t * 0.2 + i * 0.8) * 1.2
        pt.z = CONTROL_POINTS[i].z + Math.cos(t * 0.15 + i * 0.6) * 0.8
      })
      const curve = new THREE.CatmullRomCurve3(controlPoints.current)
      const positions = geometry.getAttribute('position') as THREE.BufferAttribute
      const newGeo = new THREE.TubeGeometry(curve, 200, 0.35, 8, false)
      const newPos = newGeo.getAttribute('position') as THREE.BufferAttribute
      positions.array.set(newPos.array)
      positions.needsUpdate = true
      newGeo.dispose()
    }
  })

  return <mesh ref={meshRef} geometry={geometry} material={material} />
}
