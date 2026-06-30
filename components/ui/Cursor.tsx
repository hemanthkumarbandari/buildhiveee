'use client'

import { useEffect, useRef, useState } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useUIStore } from '@/store/ui.store'

export default function Cursor() {
  const setCursor = useUIStore((s) => s.setCursor)
  const cursorState = useUIStore((s) => s.cursorState)
  const dotRef = useRef({ x: 0, y: 0 })
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [echoPositions, setEchoPositions] = useState<Array<{ x: number; y: number }>>(
    Array(5).fill({ x: 0, y: 0 })
  )
  const echoQueue = useRef<Array<{ x: number; y: number }>>(Array(5).fill({ x: 0, y: 0 }))

  const [ringSpring, ringApi] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    config: { mass: 1, tension: 180, friction: 24 },
  }))

  useEffect(() => {
    let frame: number
    const onMove = (e: MouseEvent) => {
      dotRef.current = { x: e.clientX, y: e.clientY }
      setPos({ x: e.clientX, y: e.clientY })
      // Echo trail with delay
      echoQueue.current = [{ x: e.clientX, y: e.clientY }, ...echoQueue.current.slice(0, 4)]
    }

    const tick = () => {
      ringApi.start({ x: dotRef.current.x, y: dotRef.current.y })
      setEchoPositions([...echoQueue.current])
      frame = requestAnimationFrame(tick)
    }

    const onDown = () => {
      setCursor('click')
      ringApi.start({ scale: 0.7 })
      setTimeout(() => ringApi.start({ scale: 1 }), 250)
    }
    const onUp = () => setCursor('default')

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    frame = requestAnimationFrame(tick)

    // Detect magnetic targets
    const handleEnter = (e: Event) => {
      if ((e.target as Element).closest('.magnetic-target')) {
        setCursor('hover')
        ringApi.start({ scale: 2.2 })
      }
    }
    const handleLeave = (e: Event) => {
      if ((e.target as Element).closest('.magnetic-target')) {
        setCursor('default')
        ringApi.start({ scale: 1 })
      }
    }

    document.addEventListener('mouseover', handleEnter)
    document.addEventListener('mouseout', handleLeave)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseover', handleEnter)
      document.removeEventListener('mouseout', handleLeave)
    }
  }, [ringApi, setCursor])

  return (
    <>
      {/* Echo trail */}
      {echoPositions.map((ep, i) => (
        <div
          key={i}
          style={{
            position: 'fixed',
            left: ep.x - 2,
            top: ep.y - 2,
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: '#7dc9e8',
            opacity: 0.35 - i * 0.07,
            pointerEvents: 'none',
            zIndex: 9998,
            transform: 'translate(-50%, -50%)',
            transition: `opacity 0.1s ease`,
          }}
        />
      ))}

      {/* Dot */}
      <div
        style={{
          position: 'fixed',
          left: pos.x,
          top: pos.y,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#7dc9e8',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: cursorState === 'hover' ? 0 : 1,
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* Ring */}
      <animated.div
        style={{
          position: 'fixed',
          left: ringSpring.x,
          top: ringSpring.y,
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: '1.5px solid rgba(125,201,232,0.65)',
          transform: ringSpring.scale.to(
            (s) => `translate(-50%, -50%) scale(${s})`
          ),
          background: cursorState === 'hover' ? 'rgba(125,201,232,0.1)' : 'transparent',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'background 0.3s ease',
        }}
      />
    </>
  )
}
