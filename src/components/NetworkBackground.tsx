import { useEffect, useRef } from 'react'

const LINK_DISTANCE = 140
const MOUSE_DISTANCE = 180

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
}

export function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const mouse = { x: -1000, y: -1000 }
    let particles: Particle[] = []
    let frame = 0
    let width = 0
    let height = 0

    const resize = () => {
      const widthChanged = innerWidth !== width
      const nextHeight = widthChanged ? innerHeight : Math.max(height, innerHeight)
      if (!widthChanged && nextHeight === height) return
      width = innerWidth
      height = nextHeight
      const dpr = Math.min(window.devicePixelRatio || 1, width < 720 ? 1.5 : 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (!widthChanged && particles.length) return
      const count = Math.min(width < 720 ? 40 : 80, Math.round((width * height) / 18000))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      for (const p of particles) {
        p.x = (p.x + p.vx + width) % width
        p.y = (p.y + p.vy + height) % height
      }
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < LINK_DISTANCE) {
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.22 * (1 - d / LINK_DISTANCE)})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y)
        if (dm < MOUSE_DISTANCE) {
          ctx.strokeStyle = `rgba(255, 122, 26, ${0.35 * (1 - dm / MOUSE_DISTANCE)})`
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }
        ctx.fillStyle = 'rgba(196, 181, 253, 0.5)'
        ctx.beginPath()
        ctx.arc(a.x, a.y, 1.4, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const loop = () => {
      draw()
      frame = requestAnimationFrame(loop)
    }

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    resize()
    window.addEventListener('resize', resize)
    if (reduceMotion) {
      draw()
    } else {
      window.addEventListener('pointermove', onMove)
      loop()
    }

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="network" aria-hidden="true" />
}
