import { Instance, Instances, RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { CatmullRomCurve3, DoubleSide, PlaneGeometry, SphereGeometry, Vector3, type MeshStandardMaterial } from 'three'
import { DESK_A, DESK_B, DESK_Y, ROOM, SHELF_DEPTH, SHELF_LEVELS, SIDEBOARD, WALL, WALL_H, WINDOW_Z } from './layout'
import { artTexture, rugTexture, weaveTexture, WOOD, woodTexture } from './textures'

type WoodKind = keyof typeof WOOD
type Vec3 = [number, number, number]

function Wood({ kind, repeat }: { kind: WoodKind; repeat?: [number, number] }) {
  const map = useMemo(() => {
    const texture = woodTexture(kind, WOOD[kind]).clone()
    if (repeat) texture.repeat.set(...repeat)
    texture.needsUpdate = true
    return texture
  }, [kind, repeat])
  return <meshStandardMaterial map={map} bumpMap={map} bumpScale={1.2} roughness={0.7} />
}

function Board({ size, position, kind = 'desk', repeat, radius }: { size: Vec3; position: Vec3; kind?: WoodKind; repeat?: [number, number]; radius?: number }) {
  return (
    <RoundedBox args={size} radius={radius ?? Math.min(0.03, Math.min(...size) / 2.2)} smoothness={4} position={position} castShadow receiveShadow>
      <Wood kind={kind} repeat={repeat} />
    </RoundedBox>
  )
}

function Shell() {
  const wallColor = '#3a2752'
  return (
    <group>
      <RoundedBox args={[ROOM + WALL, 0.3, ROOM + WALL]} radius={0.08} smoothness={4} position={[ROOM / 2 - WALL / 2, -0.2, ROOM / 2 - WALL / 2]} receiveShadow>
        <meshStandardMaterial color="#24152f" roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[ROOM + WALL, WALL_H + 0.3, WALL]} radius={0.08} smoothness={4} position={[ROOM / 2 - WALL / 2, WALL_H / 2 - 0.15, -WALL / 2]} receiveShadow>
        <meshStandardMaterial color={wallColor} roughness={0.95} />
      </RoundedBox>
      <RoundedBox args={[WALL, WALL_H + 0.3, ROOM]} radius={0.08} smoothness={4} position={[-WALL / 2, WALL_H / 2 - 0.15, ROOM / 2]} receiveShadow>
        <meshStandardMaterial color="#432d5e" roughness={0.95} />
      </RoundedBox>
      <Planks />
      <Board kind="dark" size={[ROOM, 0.12, 0.04]} position={[ROOM / 2, 0.06, 0.02]} />
      <Board kind="dark" size={[0.04, 0.12, ROOM]} position={[0.02, 0.06, ROOM / 2]} />
    </group>
  )
}

function Planks() {
  const rows = 11
  const width = ROOM / rows
  const planks = useMemo(() => {
    const list: { x: number; len: number; z: number }[] = []
    for (let r = 0; r < rows; r++) {
      const split = 1 + ((r * 37) % 23) / 10
      list.push({ x: split / 2, len: split - 0.02, z: r * width + width / 2 })
      list.push({ x: split + (ROOM - split) / 2, len: ROOM - split - 0.02, z: r * width + width / 2 })
    }
    return list
  }, [width])
  return (
    <group>
      {planks.map((p, i) => (
        <Board key={i} kind="floor" size={[p.len, 0.08, width - 0.02]} position={[p.x, -0.04, p.z]} radius={0.025} repeat={[p.len / 2, 0.3]} />
      ))}
    </group>
  )
}

function StringLights() {
  const bulb = useRef<MeshStandardMaterial>(null)
  const { tube, points } = useMemo(() => {
    const anchors = [new Vector3(0.05, 3.0, 0.3), new Vector3(0.07, 2.84, 1.1), new Vector3(0.05, 3.0, 1.9), new Vector3(0.07, 2.8, 2.8), new Vector3(0.05, 3.0, 3.6), new Vector3(0.07, 2.84, 4.3)]
    const curve = new CatmullRomCurve3(anchors)
    return { tube: curve, points: curve.getSpacedPoints(16).slice(1, -1) }
  }, [])
  useFrame(({ clock }) => {
    if (bulb.current) bulb.current.emissiveIntensity = 2.3 + Math.sin(clock.elapsedTime * 1.4) * 0.4
  })
  return (
    <group>
      <mesh>
        <tubeGeometry args={[tube, 80, 0.008, 6, false]} />
        <meshStandardMaterial color="#1a1020" />
      </mesh>
      <Instances limit={points.length}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial ref={bulb} color="#ffd27a" emissive="#ffb44a" emissiveIntensity={2.4} toneMapped={false} />
        {points.map((p, i) => (
          <Instance key={i} position={[p.x + 0.02, p.y - 0.05, p.z]} />
        ))}
      </Instances>
      <pointLight position={[0.5, 2.7, 2.2]} color="#ffbf66" intensity={1.6} distance={4} decay={1.5} />
    </group>
  )
}

function Valance() {
  const geometry = useMemo(() => {
    const g = new PlaneGeometry(1.5, 0.24, 40, 4)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      pos.setZ(i, Math.sin(x * 26) * 0.02)
      if (y < 0) pos.setY(i, y - Math.abs(Math.sin(x * 13)) * 0.04)
    }
    g.computeVertexNormals()
    return g
  }, [])
  return (
    <group position={[0, 0.6, 0.12]}>
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial color="#6a4a8c" roughness={0.95} side={DoubleSide} />
      </mesh>
      <mesh position={[0, 0.12, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 1.6, 10]} />
        <meshStandardMaterial color="#2a1814" />
      </mesh>
    </group>
  )
}

function Window() {
  return (
    <group>
      <group position={[0.01, 1.95, WINDOW_Z]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0, 0.004]}>
          <planeGeometry args={[1.2, 1.1]} />
          <meshStandardMaterial color="#2a2470" emissive="#3b3a9a" emissiveIntensity={0.9} />
        </mesh>
        <mesh position={[0.3, 0.25, 0.008]}>
          <circleGeometry args={[0.08, 32]} />
          <meshStandardMaterial color="#fff1d6" emissive="#fff1d6" emissiveIntensity={3} toneMapped={false} />
        </mesh>
        <Instances limit={22}>
          <circleGeometry args={[0.008, 6]} />
          <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} toneMapped={false} />
          {Array.from({ length: 22 }, (_, i) => (
            <Instance key={i} position={[((i * 37) % 110) / 100 - 0.55, ((i * 53) % 90) / 100 - 0.3, 0.006]} scale={0.6 + (i % 3) * 0.35} />
          ))}
        </Instances>
        <Board kind="dark" size={[1.3, 0.07, 0.1]} position={[0, 0.58, 0.05]} />
        <Board kind="dark" size={[1.3, 0.07, 0.1]} position={[0, -0.58, 0.05]} />
        <Board kind="dark" size={[0.07, 1.2, 0.1]} position={[-0.62, 0, 0.05]} />
        <Board kind="dark" size={[0.07, 1.2, 0.1]} position={[0.62, 0, 0.05]} />
        <Board kind="dark" size={[0.04, 1.1, 0.06]} position={[0, 0, 0.03]} />
        <Board kind="desk" size={[1.45, 0.05, 0.2]} position={[0, -0.63, 0.1]} />
        <Valance />
      </group>
    </group>
  )
}

function Frame({ position, size, seed, rotation = Math.PI / 2 }: { position: Vec3; size: [number, number]; seed: number; rotation?: number }) {
  const map = useMemo(() => artTexture(seed), [seed])
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <RoundedBox args={[size[0] + 0.08, size[1] + 0.08, 0.04]} radius={0.015} smoothness={3} castShadow>
        <meshStandardMaterial color="#ff8a3d" roughness={0.5} />
      </RoundedBox>
      <mesh position={[0, 0, 0.021]}>
        <planeGeometry args={size} />
        <meshStandardMaterial map={map} roughness={0.8} />
      </mesh>
    </group>
  )
}

function SlatPanel() {
  return (
    <group position={[0, 1.72, 0.66]} rotation={[0, Math.PI / 2, 0]}>
      <RoundedBox args={[0.58, 1.6, 0.02]} radius={0.008} position={[0, 0, 0.01]}>
        <meshStandardMaterial color="#120c18" roughness={1} />
      </RoundedBox>
      {Array.from({ length: 7 }, (_, i) => (
        <Board key={i} kind="slat" size={[0.05, 1.6, 0.04]} position={[-0.24 + i * 0.08, 0, 0.04]} radius={0.012} repeat={[0.1, 1]} />
      ))}
    </group>
  )
}

function Desk() {
  const legY = DESK_Y / 2
  return (
    <group>
      <Board size={[DESK_A.length, 0.06, DESK_A.depth]} position={[DESK_A.length / 2, DESK_Y - 0.03, DESK_A.depth / 2]} repeat={[2, 0.5]} />
      <Board size={[DESK_B.depth, 0.06, DESK_B.length]} position={[DESK_B.depth / 2, DESK_Y - 0.03, DESK_A.depth + DESK_B.length / 2]} repeat={[0.5, 1]} />
      <mesh position={[(DESK_A.length + DESK_B.depth) / 2, DESK_Y - 0.07, DESK_A.depth - 0.02]}>
        <boxGeometry args={[DESK_A.length - DESK_B.depth, 0.012, 0.012]} />
        <meshStandardMaterial color="#ff8a3d" emissive="#ff8a3d" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <group position={[DESK_A.length - 0.34, 0, DESK_A.depth / 2]}>
        <Board kind="dark" size={[0.62, DESK_Y - 0.06, DESK_A.depth - 0.08]} position={[0, legY - 0.03, 0]} />
        {[0.16, 0.39, 0.61].map((y) => (
          <group key={y}>
            <Board kind="desk" size={[0.56, 0.2, 0.03]} position={[0, y, DESK_A.depth / 2 - 0.03]} radius={0.012} />
            <mesh position={[0, y + 0.03, DESK_A.depth / 2 - 0.005]} rotation={[0, 0, Math.PI / 2]}>
              <capsuleGeometry args={[0.012, 0.12, 4, 12]} />
              <meshStandardMaterial color="#ff8a3d" metalness={0.5} roughness={0.3} />
            </mesh>
          </group>
        ))}
      </group>
      {[
        [0.07, DESK_A.depth + DESK_B.length - 0.07],
        [DESK_B.depth - 0.07, DESK_A.depth + DESK_B.length - 0.07],
        [DESK_B.depth - 0.07, DESK_A.depth - 0.07],
      ].map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, legY - 0.03, z]} castShadow>
          <capsuleGeometry args={[0.03, DESK_Y - 0.12, 4, 12]} />
          <meshStandardMaterial color="#1a1422" metalness={0.6} roughness={0.35} />
        </mesh>
      ))}
    </group>
  )
}

function Hutch() {
  const width = DESK_A.length - 0.1
  const top = SHELF_LEVELS[SHELF_LEVELS.length - 1]
  const height = top - DESK_Y
  return (
    <group position={[width / 2 + 0.05, 0, SHELF_DEPTH / 2]}>
      {[-width / 2, width / 2].map((x) => (
        <Board key={x} kind="dark" size={[0.05, height, SHELF_DEPTH]} position={[x, DESK_Y + height / 2, 0]} repeat={[0.1, 1]} />
      ))}
      {SHELF_LEVELS.map((y) => (
        <Board key={y} size={[width + 0.06, 0.045, SHELF_DEPTH + 0.02]} position={[0, y - 0.022, 0]} repeat={[2, 0.15]} />
      ))}
      {[
        [SHELF_LEVELS[0], '#c084fc'],
        [SHELF_LEVELS[1], '#ff8a3d'],
      ].map(([y, color]) => (
        <mesh key={y as number} position={[0, (y as number) - 0.05, SHELF_DEPTH / 2 - 0.03]}>
          <boxGeometry args={[width - 0.1, 0.008, 0.008]} />
          <meshStandardMaterial color={color as string} emissive={color as string} emissiveIntensity={3} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function Bookcase() {
  const { z0, length, depth, height, levels } = SIDEBOARD
  return (
    <group position={[depth / 2, 0, z0 + length / 2]}>
      <Board kind="dark" size={[depth, 0.04, length]} position={[0, 0.06, 0]} repeat={[0.3, 1]} />
      {levels.map((y, i) => (
        <Board key={y} size={[depth + (i === levels.length - 1 ? 0.03 : 0.01), 0.045, length + (i === levels.length - 1 ? 0.04 : 0)]} position={[0, y - 0.022, 0]} repeat={[0.3, 1]} />
      ))}
      {[-1, 1].map((side) => (
        <Board key={side} kind="dark" size={[depth, height, 0.045]} position={[0, height / 2, (side * length) / 2]} repeat={[0.2, 1]} />
      ))}
      {[-1, 1].map((side) => (
        <group key={side} position={[depth / 2 - 0.01, (levels[0] + 0.08) / 2, (side * length) / 4]}>
          <Board kind="desk" size={[0.025, levels[0] - 0.1, length / 2 - 0.06]} position={[0, 0, 0]} radius={0.01} />
          <mesh position={[0.016, 0.02, -side * (length / 4 - 0.07)]}>
            <sphereGeometry args={[0.016, 16, 12]} />
            <meshStandardMaterial color="#ff8a3d" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      ))}
      {levels.slice(1).map((y, i) => (
        <mesh key={y} position={[depth / 2 - 0.02, y - 0.05, 0]}>
          <boxGeometry args={[0.008, 0.008, length - 0.1]} />
          <meshStandardMaterial color={i % 2 ? '#ff8a3d' : '#c084fc'} emissive={i % 2 ? '#ff8a3d' : '#c084fc'} emissiveIntensity={3} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function beanbagGeometry() {
  const g = new SphereGeometry(1, 96, 64)
  const pos = g.attributes.position
  const v = new Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    let { x, y, z } = v
    if (y < 0) y *= 0.45
    if (z < 0) y += -z * 0.75 * Math.max(0, y + 0.3)
    const dent = Math.exp(-(x * x) / 0.22 - ((z - 0.3) * (z - 0.3)) / 0.18)
    if (y > 0) y -= dent * 0.6 * y
    y += Math.sin(x * 9 + z * 5) * 0.025 + Math.sin(z * 11 - x * 4) * 0.02
    y = Math.max(y, -0.4)
    x *= 1 + Math.max(0, -y - 0.2) * 0.25
    z *= 1 + Math.max(0, -y - 0.2) * 0.25
    pos.setXYZ(i, x * 0.48, (y + 0.4) * 0.42, z * 0.48)
  }
  g.computeVertexNormals()
  return g
}

function Beanbag() {
  const geometry = useMemo(() => beanbagGeometry(), [])
  const map = useMemo(() => {
    const t = weaveTexture().clone()
    t.repeat.set(16, 10)
    t.needsUpdate = true
    return t
  }, [])
  return (
    <group position={[3.4, 0, 3.1]} rotation={[0, -0.8, 0]} scale={0.95}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial color="#9a7bd6" map={map} bumpMap={map} bumpScale={0.8} roughness={0.95} />
      </mesh>
      <RoundedBox args={[0.24, 0.07, 0.18]} radius={0.034} smoothness={5} position={[0.04, 0.36, 0.1]} rotation={[-0.15, 0.3, 0.1]} castShadow>
        <meshStandardMaterial color="#ff8a3d" roughness={0.9} />
      </RoundedBox>
    </group>
  )
}

function FloorLamp() {
  return (
    <group position={[4.12, 0, 0.42]}>
      <mesh position={[0, 0.015, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.16, 0.03, 32]} />
        <meshStandardMaterial color="#1a1422" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 1.6, 10]} />
        <meshStandardMaterial color="#1a1422" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.66, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.2, 0.24, 32, 1, true]} />
        <meshStandardMaterial color="#f3e2c7" emissive="#ffb46b" emissiveIntensity={0.9} roughness={0.9} side={2} />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.045, 16, 12]} />
        <meshStandardMaterial color="#fff1d6" emissive="#ffd9a0" emissiveIntensity={4} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 1.5, 0]} color="#ffbf7a" intensity={2} distance={3.5} decay={1.6} />
    </group>
  )
}

function Rug() {
  const map = useMemo(() => rugTexture(), [])
  return (
    <mesh position={[2.2, 0.006, 2.5]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.2, 1, 1]} receiveShadow>
      <circleGeometry args={[1.0, 64]} />
      <meshStandardMaterial map={map} roughness={1} />
    </mesh>
  )
}

export function Room() {
  return (
    <group>
      <Shell />
      <SlatPanel />
      <Window />
      <StringLights />
      <Frame position={[3.85, 1.95, 0.02]} size={[0.42, 0.56]} seed={1} rotation={0} />
      <Frame position={[3.88, 1.35, 0.02]} size={[0.3, 0.22]} seed={2} rotation={0} />
      <Bookcase />
      <Beanbag />
      <FloorLamp />
      <Desk />
      <Hutch />
      <Rug />
    </group>
  )
}
