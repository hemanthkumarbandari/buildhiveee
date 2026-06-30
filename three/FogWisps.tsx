'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScrollStore } from '@/store/scroll.store'
import fogFrag from '@/shaders/fog.frag.glsl'

const FOG_COUNT = 12
const fogVert = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export default function FogWisps() {
  const groupRef = useRef<THREE.Group>(null)
  const scrollY = useScrollStore((s) => s.scrollY)

  const wisps = useMemo(() => {
    return Array.from({ length: FOG_COUNT }, (_, i) => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 30,
        -2 + Math.random() * 4,
        -3 - Math.random() * 6
      ),
      scale: new THREE.Vector3(8 + Math.random() * 12, 3 + Math.random() * 5, 1),
      rotation: Math.random() * Math.PI,
      index: i,
    }))
  }, [])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: fogVert,
        fragmentShader: fogFrag,
        uniforms: {
          uTime: { value: 0 },
          uScrollY: { value: 0 },
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.NormalBlending,
      }),
    []
  )

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.getElapsedTime()
    material.uniforms.uScrollY.value = scrollY
    if (groupRef.current) {
      groupRef.current.position.y = scrollY * -0.001
    }
  })

  return (
    <group ref={groupRef}>
      {wisps.map((wisp, i) => (
        <mesh
          key={i}
          position={wisp.position}
          scale={wisp.scale}
          rotation={[0, wisp.rotation, 0]}
          material={material}
        >
          <planeGeometry args={[1, 1, 1, 1]} />
        </mesh>
      ))}
    </group>
  )
}
