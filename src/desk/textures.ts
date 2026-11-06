import { CanvasTexture, RepeatWrapping, SRGBColorSpace, type Texture } from 'three'

interface WoodOptions {
  base: string
  dark: string
  light: string
  planks?: number
  repeat?: [number, number]
}

const cache = new Map<string, Texture>()

function random(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function drawGrain(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, o: WoodOptions, rnd: () => number) {
  ctx.fillStyle = o.base
  ctx.fillRect(x, y, w, h)
  const lines = Math.round(h / 3)
  for (let i = 0; i < lines; i++) {
    const ly = y + rnd() * h
    const amp = 1 + rnd() * 4
    const freq = 0.004 + rnd() * 0.01
    const phase = rnd() * 10
    ctx.strokeStyle = rnd() > 0.5 ? o.dark : o.light
    ctx.globalAlpha = 0.08 + rnd() * 0.22
    ctx.lineWidth = 0.6 + rnd() * 1.8
    ctx.beginPath()
    for (let px = x; px <= x + w; px += 8) {
      const py = ly + Math.sin(px * freq + phase) * amp + Math.sin(px * freq * 3.1) * amp * 0.3
      if (px === x) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
  }
  for (let k = 0; k < 2; k++) {
    if (rnd() > 0.6) continue
    const kx = x + rnd() * w
    const ky = y + rnd() * h
    for (let r = 14; r > 2; r -= 3) {
      ctx.globalAlpha = 0.12
      ctx.strokeStyle = o.dark
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.ellipse(kx, ky, r * 2.4, r * 0.7, 0, 0, Math.PI * 2)
      ctx.stroke()
    }
  }
  ctx.globalAlpha = 1
}

export function woodTexture(key: string, o: WoodOptions) {
  const cached = cache.get(key)
  if (cached) return cached
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const rnd = random(key.length * 7919 + 17)
  const planks = o.planks ?? 1
  const ph = size / planks
  for (let p = 0; p < planks; p++) {
    drawGrain(ctx, 0, p * ph, size, ph, o, rnd)
    ctx.fillStyle = `rgba(0,0,0,${0.04 + rnd() * 0.1})`
    ctx.fillRect(0, p * ph, size, ph)
    if (planks > 1) {
      ctx.fillStyle = 'rgba(0,0,0,0.55)'
      ctx.fillRect(0, p * ph, size, 2)
      const seam = rnd() * size
      ctx.fillRect(seam, p * ph, 2, ph)
    }
  }
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.wrapS = texture.wrapT = RepeatWrapping
  texture.anisotropy = 8
  if (o.repeat) texture.repeat.set(...o.repeat)
  cache.set(key, texture)
  return texture
}

export function rugTexture() {
  const cached = cache.get('rug')
  if (cached) return cached
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const c = size / 2
  const rings: [number, string][] = [
    [0.5, '#4c1d63'],
    [0.42, '#ff8a3d'],
    [0.405, '#4c1d63'],
    [0.32, '#5b2577'],
    [0.2, '#c084fc'],
    [0.19, '#5b2577'],
  ]
  for (const [r, color] of rings) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(c, c, r * size, 0, Math.PI * 2)
    ctx.fill()
  }
  const rnd = random(99)
  for (let i = 0; i < 6000; i++) {
    ctx.fillStyle = `rgba(${rnd() > 0.5 ? '255,255,255' : '0,0,0'},0.05)`
    ctx.fillRect(rnd() * size, rnd() * size, 2, 2)
  }
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  cache.set('rug', texture)
  return texture
}

export function artTexture(seed: number) {
  const key = `art-${seed}`
  const cached = cache.get(key)
  if (cached) return cached
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 320
  const ctx = canvas.getContext('2d')!
  const sky = ctx.createLinearGradient(0, 0, 0, 320)
  sky.addColorStop(0, seed === 1 ? '#2a1650' : '#4c1d63')
  sky.addColorStop(1, seed === 1 ? '#d9467a' : '#ff8a3d')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, 256, 320)
  ctx.fillStyle = '#ffd27a'
  ctx.beginPath()
  ctx.arc(seed === 1 ? 170 : 90, 130, seed === 1 ? 42 : 30, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#1a1024'
  ctx.beginPath()
  ctx.moveTo(0, 320)
  for (let x = 0; x <= 256; x += 32) ctx.lineTo(x, 220 - Math.abs(Math.sin(x * 0.02 + seed)) * 70)
  ctx.lineTo(256, 320)
  ctx.fill()
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  cache.set(key, texture)
  return texture
}

export function weaveTexture() {
  const cached = cache.get('weave')
  if (cached) return cached
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#d8d3c8'
  ctx.fillRect(0, 0, size, size)
  const cell = 16
  for (let y = 0; y < size; y += cell) {
    for (let x = 0; x < size; x += cell) {
      const ox = (y / cell) % 2 ? cell / 2 : 0
      const g = ctx.createRadialGradient(x + ox + cell / 2, y + cell / 2, 1, x + ox + cell / 2, y + cell / 2, cell / 2)
      g.addColorStop(0, '#ffffff')
      g.addColorStop(0.7, '#ebe6dc')
      g.addColorStop(1, '#b9b3a6')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.ellipse(x + ox + cell / 2, y + cell / 2, cell / 2 - 1, cell / 2.6, 0, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.wrapS = texture.wrapT = RepeatWrapping
  texture.repeat.set(10, 10)
  texture.anisotropy = 8
  cache.set('weave', texture)
  return texture
}

export const WOOD = {
  desk: { base: '#a0683f', dark: '#5a3420', light: '#c98f5f' },
  dark: { base: '#4a2a20', dark: '#24140f', light: '#6b3e2e' },
  floor: { base: '#8a5a3c', dark: '#4a2a1c', light: '#b07a52' },
  slat: { base: '#8a5634', dark: '#3e2316', light: '#b57a4f' },
}
