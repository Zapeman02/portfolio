import { Instance, Instances, RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, type ReactNode } from 'react'
import { CatmullRomCurve3, Shape, Vector2, Vector3, type Group } from 'three'
import { weaveTexture } from './textures'

const ORANGE = '#ff7a1a'
const PURPLE = '#8b5cf6'
const DARK = '#1c1924'

function Wheel({ position, radius = 0.06, width = 0.05 }: { position: [number, number, number]; radius?: number; width?: number }) {
  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[radius, radius, width, 16]} />
      <meshStandardMaterial color="#111" />
    </mesh>
  )
}

function Glow({ color, children }: { color: string; children: ReactNode }) {
  return (
    <mesh>
      {children}
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
    </mesh>
  )
}

function mowerShape(scale = 1) {
  const shape = new Shape()
  const p = (x: number, y: number) => [x * scale, y * scale] as const
  shape.moveTo(...p(-0.2, -0.17))
  shape.quadraticCurveTo(...p(0.04, -0.2), ...p(0.2, -0.09))
  shape.quadraticCurveTo(...p(0.27, -0.03), ...p(0.27, 0))
  shape.quadraticCurveTo(...p(0.27, 0.03), ...p(0.2, 0.09))
  shape.quadraticCurveTo(...p(0.04, 0.2), ...p(-0.2, 0.17))
  shape.quadraticCurveTo(...p(-0.28, 0), ...p(-0.2, -0.17))
  return shape
}

export function Mower() {
  const shell = useMemo(() => mowerShape(), [])
  const skirt = useMemo(() => mowerShape(1.04), [])
  return (
    <group>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <extrudeGeometry args={[skirt, { depth: 0.045, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 4, curveSegments: 40 }]} />
        <meshStandardMaterial color="#1b1c1f" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.092, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <extrudeGeometry args={[mowerShape(1.26), { depth: 0.01, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 2, curveSegments: 40 }]} />
        <meshStandardMaterial color="#ff6a13" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <extrudeGeometry args={[shell, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.045, bevelSegments: 10, curveSegments: 48 }]} />
        <meshStandardMaterial color="#50545c" roughness={0.32} metalness={0.15} />
      </mesh>
      <mesh position={[0.0, 0.175, 0]} scale={[0.24, 0.045, 0.15]}>
        <sphereGeometry args={[1, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#5a5e66" roughness={0.3} metalness={0.15} />
      </mesh>
      <group position={[-0.08, 0.205, 0]}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.052, 0.012, 32]} />
          <meshStandardMaterial color="#2a2c31" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.014, 0]}>
          <cylinderGeometry args={[0.038, 0.042, 0.018, 32]} />
          <meshStandardMaterial color="#d9381e" roughness={0.35} />
        </mesh>
      </group>
      <RoundedBox args={[0.075, 0.012, 0.1]} radius={0.005} position={[0.08, 0.205, 0]} rotation={[0, 0, -0.3]}>
        <meshStandardMaterial color="#1e2024" roughness={0.1} metalness={0.4} />
      </RoundedBox>
      <mesh position={[0.08, 0.2125, 0]} rotation={[-Math.PI / 2, 0.3, 0]}>
        <planeGeometry args={[0.04, 0.06]} />
        <meshStandardMaterial color="#9be7a8" emissive="#4ade80" emissiveIntensity={0.8} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side} position={[-0.12, 0.085, side * 0.215]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.085, 0.085, 0.05, 32]} />
            <meshStandardMaterial color="#141416" roughness={0.9} />
          </mesh>
          <Instances limit={16}>
            <boxGeometry args={[0.012, 0.052, 0.008]} />
            <meshStandardMaterial color="#0c0c0e" />
            {Array.from({ length: 16 }, (_, i) => {
              const a = (i / 16) * Math.PI * 2
              return <Instance key={i} rotation={[0, a, 0]} position={[Math.cos(a) * 0.083, 0, -Math.sin(a) * 0.083]} />
            })}
          </Instances>
          <mesh position={[0, side * 0.026, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.006, 24]} />
            <meshStandardMaterial color="#9a9da5" metalness={0.7} roughness={0.25} />
          </mesh>
        </group>
      ))}
      <mesh position={[0.22, 0.025, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.03, 16]} />
        <meshStandardMaterial color="#141416" />
      </mesh>
    </group>
  )
}

export function Silo() {
  return (
    <group>
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.16, 0.56, 20]} />
        <meshStandardMaterial color="#b9b6c6" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.63, 0]} castShadow>
        <coneGeometry args={[0.18, 0.16, 20]} />
        <meshStandardMaterial color="#8f8ba0" metalness={0.6} roughness={0.35} />
      </mesh>
      <RoundedBox args={[0.1, 0.08, 0.06]} radius={0.021} smoothness={3} position={[0.2, 0.12, 0.05]}>
        <meshStandardMaterial color={DARK} />
      </RoundedBox>
      <mesh position={[0.2, 0.12, 0.081]}>
        <planeGeometry args={[0.05, 0.03]} />
        <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={2} toneMapped={false} />
      </mesh>
    </group>
  )
}

export function RaceCar({ color = PURPLE }: { color?: string }) {
  return (
    <group>
      <RoundedBox args={[0.5, 0.06, 0.16]} radius={0.021} smoothness={3} position={[0, 0.07, 0]} castShadow>
        <meshStandardMaterial color={color} roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[0.14, 0.05, 0.1]} radius={0.0175} smoothness={3} position={[-0.02, 0.12, 0]} castShadow>
        <meshStandardMaterial color="#111" />
      </RoundedBox>
      <RoundedBox args={[0.04, 0.02, 0.28]} radius={0.007} smoothness={3} position={[0.27, 0.06, 0]}>
        <meshStandardMaterial color={color} />
      </RoundedBox>
      <RoundedBox args={[0.05, 0.02, 0.24]} radius={0.007} smoothness={3} position={[-0.25, 0.14, 0]}>
        <meshStandardMaterial color={color} />
      </RoundedBox>
      <Wheel position={[0.16, 0.05, 0.12]} radius={0.05} />
      <Wheel position={[0.16, 0.05, -0.12]} radius={0.05} />
      <Wheel position={[-0.16, 0.05, 0.12]} radius={0.055} />
      <Wheel position={[-0.16, 0.05, -0.12]} radius={0.055} />
    </group>
  )
}

export function BlackHole() {
  const ring = useRef<Group>(null)
  useFrame((_, delta) => {
    if (ring.current) ring.current.rotation.z += delta * 0.6
  })
  return (
    <group position={[0, 0.3, 0]}>
      <mesh castShadow>
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      <group rotation={[1.2, 0, 0]}>
        <group ref={ring}>
          <Glow color={ORANGE}>
            <torusGeometry args={[0.25, 0.025, 12, 48]} />
          </Glow>
        </group>
      </group>
    </group>
  )
}

export function Motorbike() {
  const GREEN = '#3ddc4a'
  const tube = (from: [number, number, number], to: [number, number, number], r = 0.008) => {
    const dx = to[0] - from[0]
    const dy = to[1] - from[1]
    const len = Math.hypot(dx, dy)
    return (
      <mesh position={[(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, from[2]]} rotation={[0, 0, Math.atan2(dy, dx) - Math.PI / 2]}>
        <cylinderGeometry args={[r, r, len, 8]} />
        <meshStandardMaterial color={GREEN} roughness={0.4} metalness={0.2} />
      </mesh>
    )
  }
  return (
    <group>
      {[-0.17, 0.17].map((x) => (
        <group key={x} position={[x, 0.085, 0]}>
          <mesh castShadow>
            <torusGeometry args={[0.058, 0.03, 14, 32]} />
            <meshStandardMaterial color="#121214" roughness={0.85} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.03, 20]} />
            <meshStandardMaterial color="#9a9ca3" metalness={0.8} roughness={0.25} />
          </mesh>
        </group>
      ))}
      {[-0.025, 0.025].map((z) => (
        <group key={z}>
          {tube([-0.17, 0.085, z], [-0.02, 0.2, z])}
          {tube([-0.02, 0.2, z], [0.1, 0.13, z])}
          {tube([-0.17, 0.085, z], [0.1, 0.1, z])}
          {tube([-0.1, 0.2, z], [-0.02, 0.2, z])}
        </group>
      ))}
      <mesh position={[0.135, 0.17, 0]} rotation={[0, 0, -0.35]}>
        <cylinderGeometry args={[0.008, 0.008, 0.2, 8]} />
        <meshStandardMaterial color="#c9cbd1" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.08, 0.17, 0]} scale={[0.12, 0.085, 0.07]} rotation={[0, 0, -0.25]} castShadow>
        <sphereGeometry args={[1, 32, 20]} />
        <meshStandardMaterial color="#1a1a1e" roughness={0.75} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0.09, 0.17, side * 0.069]} rotation={[0, 0, -0.6]} scale={[1, 1, 0.3]}>
          <boxGeometry args={[0.13, 0.008, 0.01]} />
          <meshStandardMaterial color={GREEN} emissive={GREEN} emissiveIntensity={0.4} />
        </mesh>
      ))}
      <mesh position={[0.17, 0.12, 0]} scale={[0.07, 0.025, 0.035]}>
        <sphereGeometry args={[1, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1a1a1e" roughness={0.75} />
      </mesh>
      <mesh position={[0.1, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.007, 0.007, 0.16, 8]} />
        <meshStandardMaterial color="#222" metalness={0.6} />
      </mesh>
      {[-0.08, 0.08].map((z) => (
        <mesh key={z} position={[0.1, 0.25, z]} rotation={[Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[0.011, 0.035, 4, 10]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
      ))}
      <RoundedBox args={[0.17, 0.04, 0.07]} radius={0.018} smoothness={4} position={[-0.1, 0.225, 0]} rotation={[0, 0, 0.08]} castShadow>
        <meshStandardMaterial color="#1c1c20" roughness={0.6} />
      </RoundedBox>
      <mesh position={[-0.17, 0.22, 0]} scale={[0.06, 0.03, 0.04]} rotation={[0, 0, 0.3]}>
        <sphereGeometry args={[1, 20, 12]} />
        <meshStandardMaterial color="#1a1a1e" roughness={0.75} />
      </mesh>
      <mesh position={[-0.2, 0.226, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.03, 0.006, 0.06]} />
        <meshStandardMaterial color={GREEN} emissive={GREEN} emissiveIntensity={0.4} />
      </mesh>
      <RoundedBox args={[0.12, 0.07, 0.06]} radius={0.02} position={[-0.02, 0.135, 0]}>
        <meshStandardMaterial color="#1a1a1e" roughness={0.75} />
      </RoundedBox>
    </group>
  )
}

function Dashboard() {
  return (
    <group>
      <mesh>
        <planeGeometry args={[0.3, 0.19]} />
        <meshStandardMaterial color="#0a0614" emissive="#160d28" emissiveIntensity={1} />
      </mesh>
      <mesh position={[-0.08, 0.015, 0.001]}>
        <ringGeometry args={[0.035, 0.043, 32, 1, Math.PI * 0.75, Math.PI * 1.5]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[-0.08, 0.015, 0.002]}>
        <ringGeometry args={[0.035, 0.043, 32, 1, Math.PI * 1.25, Math.PI]} />
        <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
      <mesh position={[-0.08, -0.055, 0.001]}>
        <planeGeometry args={[0.1, 0.01]} />
        <meshStandardMaterial color={PURPLE} emissive={PURPLE} emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      {[0.035, 0.055, 0.025, 0.045, 0.06].map((h, i) => (
        <mesh key={i} position={[0.03 + i * 0.022, -0.065 + h / 2, 0.001]}>
          <planeGeometry args={[0.014, h]} />
          <meshStandardMaterial color={PURPLE} emissive={PURPLE} emissiveIntensity={1.2} toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[0.075, 0.05, 0.001]}>
        <planeGeometry args={[0.11, 0.04]} />
        <meshStandardMaterial color="#2a2438" emissive="#2a2438" />
      </mesh>
    </group>
  )
}

export function MacBook() {
  const ALU = '#c9ccd3'
  return (
    <group>
      <RoundedBox args={[0.32, 0.012, 0.22]} radius={0.005} smoothness={4} position={[0, 0.006, 0]} castShadow>
        <meshStandardMaterial color={ALU} metalness={0.85} roughness={0.28} />
      </RoundedBox>
      <RoundedBox args={[0.27, 0.002, 0.1]} radius={0.001} position={[0, 0.0125, -0.035]}>
        <meshStandardMaterial color="#1a1a1e" roughness={0.6} />
      </RoundedBox>
      <Instances limit={65}>
        <planeGeometry args={[0.016, 0.015]} />
        <meshStandardMaterial color="#26262b" roughness={0.5} />
        {Array.from({ length: 65 }, (_, i) => (
          <Instance key={i} position={[-0.12 + (i % 13) * 0.02, 0.0138, -0.075 + Math.floor(i / 13) * 0.019]} rotation={[-Math.PI / 2, 0, 0]} />
        ))}
      </Instances>
      <RoundedBox args={[0.11, 0.001, 0.065]} radius={0.0005} position={[0, 0.0125, 0.065]}>
        <meshStandardMaterial color="#bfc2c9" metalness={0.7} roughness={0.2} />
      </RoundedBox>
      <group position={[0, 0.012, -0.108]} rotation={[-0.32, 0, 0]}>
        <RoundedBox args={[0.32, 0.21, 0.008]} radius={0.004} smoothness={4} position={[0, 0.105, -0.004]} castShadow>
          <meshStandardMaterial color={ALU} metalness={0.85} roughness={0.28} />
        </RoundedBox>
        <mesh position={[0, 0.105, 0.0005]}>
          <planeGeometry args={[0.31, 0.2]} />
          <meshStandardMaterial color="#050507" roughness={0.1} />
        </mesh>
        <group position={[0, 0.105, 0.001]}>
          <Dashboard />
        </group>
      </group>
    </group>
  )
}

export function Notebook() {
  return (
    <group>
      <RoundedBox args={[0.44, 0.03, 0.32]} radius={0.0105} smoothness={3} position={[0, 0.02, 0]} castShadow>
        <meshStandardMaterial color="#c4b5fd" />
      </RoundedBox>
      <RoundedBox args={[0.03, 0.005, 0.32]} radius={0.0017} smoothness={3} position={[-0.2, 0.036, 0]}>
        <meshStandardMaterial color="#6d4fd1" />
      </RoundedBox>
      <mesh position={[0.05, 0.045, 0.2]} rotation={[0, 0.3, Math.PI / 2]}>
        <cylinderGeometry args={[0.008, 0.008, 0.3, 8]} />
        <meshStandardMaterial color={ORANGE} />
      </mesh>
    </group>
  )
}

export function Bulb() {
  return (
    <group>
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.07, 0.1, 16]} />
        <meshStandardMaterial color="#888" metalness={0.7} roughness={0.3} />
      </mesh>
      <group position={[0, 0.2, 0]}>
        <Glow color="#ffd28a">
          <sphereGeometry args={[0.11, 24, 24]} />
        </Glow>
      </group>
    </group>
  )
}

export function Phone() {
  return (
    <group>
      <RoundedBox args={[0.16, 0.02, 0.32]} radius={0.007} smoothness={3} position={[0, 0.012, 0]} castShadow>
        <meshStandardMaterial color="#111" />
      </RoundedBox>
      <mesh position={[0, 0.023, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.14, 0.29]} />
        <meshStandardMaterial color="#1c2a3a" emissive="#3a6ea5" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 0.024, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 0.05]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}

export function Bag() {
  const PAPER = '#c9a571'
  const w = 0.24
  const d = 0.15
  const h = 0.26
  const t = 0.006
  return (
    <group>
      <mesh position={[0, t / 2, 0]} receiveShadow>
        <boxGeometry args={[w, t, d]} />
        <meshStandardMaterial color={PAPER} roughness={0.95} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={`f${side}`}>
          <mesh position={[0, h / 2, (side * d) / 2]} castShadow>
            <boxGeometry args={[w, h, t]} />
            <meshStandardMaterial color={PAPER} roughness={0.95} />
          </mesh>
          <mesh position={[(side * w) / 2, h / 2, 0]} castShadow>
            <boxGeometry args={[t, h, d]} />
            <meshStandardMaterial color="#b8935f" roughness={0.95} />
          </mesh>
          <mesh position={[0, h - 0.012, (side * (d + t)) / 2]}>
            <boxGeometry args={[w + t, 0.024, t]} />
            <meshStandardMaterial color="#b08a56" roughness={0.95} />
          </mesh>
        </group>
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[-w / 2 + 0.02 + i * 0.04, h + 0.006, d / 2]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.014, 0.014, t]} />
          <meshStandardMaterial color={PAPER} roughness={0.95} />
        </mesh>
      ))}
      <mesh position={[0, h * 0.5, d / 2 + 0.004]}>
        <planeGeometry args={[0.1, 0.06]} />
        <meshStandardMaterial color="#e3001b" roughness={0.8} />
      </mesh>
      <mesh position={[-0.06, h + 0.05, -0.01]} rotation={[0.2, 0, 0.35]} castShadow>
        <capsuleGeometry args={[0.022, 0.2, 6, 12]} />
        <meshStandardMaterial color="#d9a24e" roughness={0.8} />
      </mesh>
      <RoundedBox args={[0.06, 0.13, 0.06]} radius={0.008} position={[0.05, h + 0.01, -0.02]} rotation={[0, 0.3, -0.08]} castShadow>
        <meshStandardMaterial color="#f2f2f5" roughness={0.6} />
      </RoundedBox>
      <mesh position={[0.05, h + 0.083, -0.02]} rotation={[0, 0.3, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.06, 3]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.6} />
      </mesh>
      <mesh position={[0.0, h + 0.015, 0.035]} castShadow>
        <sphereGeometry args={[0.032, 20, 16]} />
        <meshStandardMaterial color="#d62828" roughness={0.4} />
      </mesh>
      <mesh position={[0.0, h + 0.05, 0.035]}>
        <cylinderGeometry args={[0.003, 0.003, 0.02, 6]} />
        <meshStandardMaterial color="#4a2a1c" />
      </mesh>
      <mesh position={[0.075, h + 0.02, 0.045]} rotation={[0.3, 0, -0.3]} castShadow>
        <coneGeometry args={[0.018, 0.09, 12]} />
        <meshStandardMaterial color="#ff7a1a" roughness={0.6} />
      </mesh>
    </group>
  )
}

export function Books() {
  const books: [number, number, string][] = [
    [-0.1, 0.42, '#2d6a4f'],
    [-0.03, 0.38, '#d9467a'],
    [0.045, 0.44, '#e5e5ea'],
    [0.115, 0.36, '#3a3a44'],
  ]
  return (
    <group>
      {books.map(([x, h, color]) => (
        <mesh key={x} position={[x, h / 2, 0]} castShadow>
          <boxGeometry args={[0.06, h, 0.26]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  )
}

export function ConnectBoard() {
  const discs: [number, number, string][] = [
    [0, 0, '#f5d742'],
    [1, 0, '#e33'],
    [2, 0, '#f5d742'],
    [1, 1, '#f5d742'],
    [2, 1, '#e33'],
    [2, 2, '#e33'],
    [3, 0, '#e33'],
  ]
  return (
    <group>
      <RoundedBox args={[0.42, 0.04, 0.12]} radius={0.014} smoothness={3} position={[0, 0.02, 0]}>
        <meshStandardMaterial color="#1d4ed8" />
      </RoundedBox>
      <RoundedBox args={[0.36, 0.3, 0.04]} radius={0.014} smoothness={3} position={[0, 0.2, 0]} castShadow>
        <meshStandardMaterial color="#2563eb" />
      </RoundedBox>
      {discs.map(([col, row, color]) => (
        <mesh key={`${col}-${row}`} position={[-0.12 + col * 0.08, 0.1 + row * 0.08, 0.022]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.01, 16]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  )
}

export function Tag() {
  return (
    <group>
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.03, 24]} />
        <meshStandardMaterial color="#f2f2f5" />
      </mesh>
      <mesh position={[0, 0.036, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.02, 16]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <mesh position={[0.1, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.035, 0.007, 8, 20]} />
        <meshStandardMaterial color="#aaa" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

export function CircuitBoard() {
  return (
    <group rotation={[-0.9, 0, 0]} position={[0, 0.16, -0.04]}>
      <RoundedBox args={[0.36, 0.26, 0.015]} radius={0.0052} smoothness={3} castShadow>
        <meshStandardMaterial color="#14532d" />
      </RoundedBox>
      <RoundedBox args={[0.08, 0.08, 0.01]} radius={0.0035} smoothness={3} position={[-0.08, 0.02, 0.012]}>
        <meshStandardMaterial color="#111" />
      </RoundedBox>
      {[true, false].map((lit) => (
        <Instances key={String(lit)} limit={16}>
          <boxGeometry args={[0.015, 0.015, 0.005]} />
          <meshStandardMaterial color={lit ? ORANGE : '#3b2470'} emissive={lit ? ORANGE : '#3b2470'} emissiveIntensity={1.5} toneMapped={false} />
          {Array.from({ length: 16 }, (_, i) => i)
            .filter((i) => (i % 3 === 0) === lit)
            .map((i) => (
              <Instance key={i} position={[0.06 + (i % 4) * 0.025, -0.04 + Math.floor(i / 4) * 0.025, 0.01]} />
            ))}
        </Instances>
      ))}
    </group>
  )
}

export function Lamp() {
  return (
    <group>
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.18, 0.04, 24]} />
        <meshStandardMaterial color={DARK} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 1, 8]} />
        <meshStandardMaterial color={DARK} />
      </mesh>
      <mesh position={[0.16, 1.0, 0]} rotation={[0, 0, -0.5]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.4, 8]} />
        <meshStandardMaterial color={DARK} />
      </mesh>
      <mesh position={[0.34, 1.08, 0]} rotation={[0, 0, 0.6]}>
        <coneGeometry args={[0.14, 0.2, 24, 1, true]} />
        <meshStandardMaterial color={DARK} side={2} />
      </mesh>
      <mesh position={[0.37, 1.04, 0]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#ffe6b3" emissive="#ffe6b3" emissiveIntensity={3} toneMapped={false} />
      </mesh>
    </group>
  )
}

export function Plant() {
  return (
    <group>
      <mesh position={[0, 0.09, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.08, 0.18, 16]} />
        <meshStandardMaterial color="#d6cfc4" />
      </mesh>
      {[0, 1.3, 2.6, 3.9, 5.2].map((angle) => (
        <mesh key={angle} position={[Math.cos(angle) * 0.06, 0.28, Math.sin(angle) * 0.06]} rotation={[Math.sin(angle) * 0.5, 0, Math.cos(angle) * 0.5]} castShadow>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#3f7d4a" flatShading />
        </mesh>
      ))}
    </group>
  )
}

const GI_PROFILE = [
  [0.0, 0.0],
  [0.1, 0.0],
  [0.1, 0.012],
  [0.096, 0.07],
  [0.088, 0.14],
  [0.093, 0.2],
  [0.104, 0.27],
  [0.108, 0.305],
  [0.092, 0.34],
  [0.055, 0.358],
  [0.032, 0.362],
].map(([r, y]) => new Vector2(r, y))

function flatten(points: [number, number, number][], depth = 0.7) {
  return new CatmullRomCurve3(points.map(([x, y, z]) => new Vector3(x, y, z * depth)))
}

function GiFabric() {
  const map = useMemo(() => weaveTexture(), [])
  return <meshStandardMaterial color="#fbf8f1" map={map} bumpMap={map} bumpScale={1.2} roughness={0.95} />
}

export function Gi() {
  const TRIM = '#ded7c8'
  const BROWN = '#6b3e1f'
  const lapels = useMemo(
    () =>
      [1, -1].map((side) =>
        flatten([
          [side * 0.03, 0.362, -0.03],
          [side * 0.035, 0.355, 0.06],
          [side * 0.012, 0.3, 0.105],
          [-side * 0.03, 0.22, 0.1],
          [-side * 0.05, 0.15, 0.092],
        ]),
      ),
    [],
  )
  const ribbons = useMemo(
    () =>
      [1, -1].map((side) =>
        flatten([
          [side * 0.045, 0.358, -0.02],
          [side * 0.05, 0.35, 0.07],
          [side * 0.022, 0.3, 0.108],
          [0, 0.262, 0.112],
        ]),
      ),
    [],
  )
  return (
    <group>
      <mesh scale={[1, 1, 0.7]} castShadow receiveShadow>
        <latheGeometry args={[GI_PROFILE, 48]} />
        <GiFabric />
      </mesh>
      <mesh position={[0, 0.361, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 0.7, 1]}>
        <circleGeometry args={[0.03, 24]} />
        <meshStandardMaterial color="#3a3530" />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.088, 0.312, 0]} rotation={[0, 0, side * 0.42]}>
          <mesh scale={[1, 1, 0.85]}>
            <sphereGeometry args={[0.043, 24, 16]} />
            <GiFabric />
          </mesh>
          <mesh position={[0, -0.085, 0]} scale={[1, 1, 0.85]} castShadow>
            <cylinderGeometry args={[0.043, 0.05, 0.17, 24]} />
            <GiFabric />
          </mesh>
          <mesh position={[0, -0.168, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.85, 1]}>
            <torusGeometry args={[0.049, 0.006, 8, 28]} />
            <meshStandardMaterial color={TRIM} roughness={0.9} />
          </mesh>
        </group>
      ))}
      {lapels.map((curve, i) => (
        <mesh key={i} scale={[1, 1, 1]}>
          <tubeGeometry args={[curve, 40, 0.0085, 8, false]} />
          <meshStandardMaterial color={TRIM} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 0.14, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.7, 1]}>
        <torusGeometry args={[0.09, 0.011, 12, 48]} />
        <meshStandardMaterial color={BROWN} roughness={0.75} />
      </mesh>
      <RoundedBox args={[0.034, 0.028, 0.02]} radius={0.009} position={[0.012, 0.14, 0.066]}>
        <meshStandardMaterial color={BROWN} roughness={0.75} />
      </RoundedBox>
      {[-1, 1].map((side) => (
        <RoundedBox key={side} args={[0.02, 0.09, 0.007]} radius={0.003} position={[0.012 + side * 0.016, 0.092, 0.068]} rotation={[0.08, 0, side * 0.22]}>
          <meshStandardMaterial color={BROWN} roughness={0.75} />
        </RoundedBox>
      ))}
      {ribbons.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 30, 0.006, 6, false]} />
          <meshStandardMaterial color="#1d4ed8" roughness={0.6} />
        </mesh>
      ))}
      <group position={[0, 0.24, 0.083]} rotation={[-0.25, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.026, 0.026, 0.006, 32]} />
          <meshStandardMaterial color="#f5c542" metalness={0.95} roughness={0.18} emissive="#7a5a10" emissiveIntensity={0.35} />
        </mesh>
        <mesh position={[0, 0, 0.0035]}>
          <torusGeometry args={[0.018, 0.0025, 8, 24]} />
          <meshStandardMaterial color="#c9971c" metalness={0.95} roughness={0.2} />
        </mesh>
      </group>
    </group>
  )
}

export function Sapling() {
  return (
    <group>
      <mesh position={[0, 0.07, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.06, 0.14, 16]} />
        <meshStandardMaterial color="#8a5a3b" />
      </mesh>
      <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0.1]} castShadow>
        <cylinderGeometry args={[0.018, 0.025, 0.16, 8]} />
        <meshStandardMaterial color="#6b4a2e" />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.05, 0.28, 0]} rotation={[0, 0, side * -0.8]} castShadow>
          <sphereGeometry args={[0.04, 8, 6]} />
          <meshStandardMaterial color="#4f9a4a" flatShading />
        </mesh>
      ))}
    </group>
  )
}
