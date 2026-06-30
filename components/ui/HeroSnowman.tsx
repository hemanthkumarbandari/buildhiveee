'use client'

import React, { useEffect, useRef, useState } from 'react'

export default function HeroSnowman() {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgGroupRef = useRef<SVGGElement>(null)
  const leftPupilRef = useRef<SVGCircleElement>(null)
  const rightPupilRef = useRef<SVGCircleElement>(null)
  const leftSpecRef = useRef<SVGCircleElement>(null)
  const rightSpecRef = useRef<SVGCircleElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let currentRot = 0

    // Initialize snowflakes
    const particles = Array.from({ length: 18 }).map(() => ({
      x: Math.random() * 420,
      y: Math.random() * 520,
      size: 1 + Math.random() * 2.5,
      opacity: 0.15 + Math.random() * 0.35,
      speed: 0.2 + Math.random() * 0.5,
      drift: -0.3 + Math.random() * 0.6,
      wobbleOffset: Math.random() * Math.PI * 2,
    }))

    let frameId: number
    let frameCount = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    window.addEventListener('mousemove', handleMouseMove)

    const render = () => {
      frameCount++

      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dist = Math.hypot(mouseX - centerX, mouseY - centerY)

      const isNear = dist < 120
      setHovered(isNear)

      const speedMult = isNear ? 1.6 : 1.0
      const maxEyeOffset = isNear ? 9 : 5

      // Render snowflakes
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          particles.forEach((p) => {
            p.y += p.speed * speedMult
            p.x += Math.sin(frameCount * 0.02 + p.wobbleOffset) * 0.4 + p.drift
            if (p.y > canvas.height) {
              p.y = -10
              p.x = Math.random() * canvas.width
            }
            ctx.beginPath()
            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
            ctx.fill()
          })
        }
      }

      // Update eyes
      const scaleX = rect.width / 420
      const scaleY = rect.height / 520

      const updateEye = (
        baseX: number,
        baseY: number,
        pupilRef: React.RefObject<SVGCircleElement>,
        specRef: React.RefObject<SVGCircleElement>
      ) => {
        const eyeWorldX = rect.left + baseX * scaleX
        const eyeWorldY = rect.top + baseY * scaleY
        const angle = Math.atan2(mouseY - eyeWorldY, mouseX - eyeWorldX)
        const distance = Math.min(
          maxEyeOffset,
          Math.hypot(mouseX - eyeWorldX, mouseY - eyeWorldY) / 10
        )

        const px = baseX + Math.cos(angle) * distance
        const py = baseY + Math.sin(angle) * distance

        if (pupilRef.current) {
          pupilRef.current.setAttribute('cx', px.toString())
          pupilRef.current.setAttribute('cy', py.toString())
        }
        if (specRef.current) {
          specRef.current.setAttribute('cx', (px - 2).toString())
          specRef.current.setAttribute('cy', (py - 2).toString())
        }
      }

      updateEye(187, 128, leftPupilRef, leftSpecRef)
      updateEye(233, 128, rightPupilRef, rightSpecRef)

      // Lean body
      const targetRot = Math.max(
        -6,
        Math.min(6, ((mouseX - centerX) / window.innerWidth) * 8)
      )
      currentRot += (targetRot - currentRot) * 0.06
      if (svgGroupRef.current) {
        svgGroupRef.current.setAttribute('transform', `rotate(${currentRot}, 210, 490)`)
      }

      frameId = requestAnimationFrame(render)
    }

    frameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full max-w-[420px]"
      style={{ aspectRatio: '420/520' }}
    >
      {/* Snowflakes overlay */}
      <canvas
        ref={canvasRef}
        width={420}
        height={520}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Snowman SVG */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 420 520"
        className="pointer-events-auto"
        style={{
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform 0.3s ease',
        }}
      >
        <g ref={svgGroupRef}>
          {/* Body */}
          <ellipse
            cx="210"
            cy="400"
            rx="110"
            ry="90"
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.5"
          />
          <ellipse cx="210" cy="400" rx="100" ry="80" fill="url(#bodyGlow)" />

          {/* Arms */}
          <path
            d="M 132,255 Q 80,260 -10,210"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 288,255 Q 340,260 430,210"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />

          {/* Torso */}
          <ellipse
            cx="210"
            cy="255"
            rx="78"
            ry="68"
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.5"
          />
          <ellipse cx="210" cy="255" rx="70" ry="60" fill="url(#torsoGlow)" />

          {/* Buttons */}
          <circle cx="210" cy="230" r="4" fill="rgba(255,255,255,0.3)" />
          <circle cx="210" cy="255" r="4" fill="rgba(255,255,255,0.3)" />
          <circle cx="210" cy="280" r="4" fill="rgba(255,255,255,0.3)" />

          {/* Scarf */}
          <path
            d="M 148,195 Q 170,188 190,195 Q 210,202 230,195 Q 250,188 272,195"
            stroke="rgba(100,180,255,0.5)"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 272,195 L 278,218"
            stroke="rgba(100,180,255,0.5)"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Head */}
          <circle
            cx="210"
            cy="140"
            r="62"
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.5"
          />
          <circle cx="210" cy="140" r="56" fill="url(#headGlow)" />

          {/* Left Eye */}
          <circle cx="187" cy="128" r="7" fill="#fff" />
          <circle ref={leftPupilRef} cx="187" cy="128" r="4" fill="#000" />
          <circle ref={leftSpecRef} cx="185" cy="126" r="1.5" fill="#fff" />

          {/* Right Eye */}
          <circle cx="233" cy="128" r="7" fill="#fff" />
          <circle ref={rightPupilRef} cx="233" cy="128" r="4" fill="#000" />
          <circle ref={rightSpecRef} cx="231" cy="126" r="1.5" fill="#fff" />

          {/* Nose */}
          <ellipse
            cx="210"
            cy="145"
            rx="5"
            ry="12"
            fill="#ff8c42"
            opacity="0.9"
            transform="rotate(15, 210, 145)"
          />

          {/* Mouth */}
          <circle cx="195.9" cy="178.8" r="3" fill="rgba(255,255,255,0.5)" />
          <circle cx="202.5" cy="182.6" r="3" fill="rgba(255,255,255,0.5)" />
          <circle cx="210" cy="184" r="3" fill="rgba(255,255,255,0.5)" />
          <circle cx="217.5" cy="182.6" r="3" fill="rgba(255,255,255,0.5)" />
          <circle cx="224.1" cy="178.8" r="3" fill="rgba(255,255,255,0.5)" />

          {/* Hat */}
          <rect
            x="152"
            y="82"
            width="116"
            height="10"
            rx="3"
            fill="rgba(255,255,255,0.12)"
            stroke="rgba(255,255,255,0.2)"
          />
          <rect
            x="172"
            y="30"
            width="76"
            height="54"
            rx="4"
            fill="rgba(255,255,255,0.12)"
            stroke="rgba(255,255,255,0.2)"
          />
          <rect x="172" y="74" width="76" height="10" fill="rgba(100,180,255,0.2)" />
        </g>
        <defs>
          <radialGradient id="bodyGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(100,180,255,0.08)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="torsoGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(100,180,255,0.08)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="headGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.04)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}
