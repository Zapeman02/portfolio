import { RoundedBox } from '@react-three/drei'
import { useMemo } from 'react'
import { CatmullRomCurve3, Shape, Vector3 } from 'three'

const FABRIC = '#3b2a55'
const FABRIC_DARK = '#2a1d3f'
const ORANGE = '#ff8a3d'

export function Chair() {
  return (
    <group>
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2
        return (
          <group key={i} rotation={[0, a, 0]}>
            <mesh position={[0.17, 0.06, 0]} rotation={[0, 0, Math.PI / 2 - 0.12]} castShadow>
              <capsuleGeometry args={[0.022, 0.3, 4, 10]} />
              <meshStandardMaterial color="#16101f" metalness={0.5} roughness={0.4} />
            </mesh>
            <mesh position={[0.33, 0.03, 0]}>
              <sphereGeometry args={[0.03, 12, 12]} />
              <meshStandardMaterial color="#0d0912" />
            </mesh>
          </group>
        )
      })}
      <mesh position={[0, 0.26, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.035, 0.36, 16]} />
        <meshStandardMaterial color="#2a2233" metalness={0.7} roughness={0.3} />
      </mesh>
      <RoundedBox args={[0.52, 0.1, 0.5]} radius={0.045} smoothness={4} position={[0, 0.48, 0]} castShadow>
        <meshStandardMaterial color={FABRIC} roughness={0.85} />
      </RoundedBox>
      <group position={[0, 0.98, -0.25]} rotation={[-0.12, 0, 0]}>
        <RoundedBox args={[0.5, 0.9, 0.1]} radius={0.05} smoothness={4} castShadow>
          <meshStandardMaterial color={FABRIC} roughness={0.85} />
        </RoundedBox>
        <RoundedBox args={[0.1, 0.84, 0.02]} radius={0.01} position={[0, -0.01, 0.05]}>
          <meshStandardMaterial color={ORANGE} roughness={0.6} />
        </RoundedBox>
        <RoundedBox args={[0.3, 0.14, 0.07]} radius={0.035} smoothness={4} position={[0, 0.3, 0.07]} castShadow>
          <meshStandardMaterial color={FABRIC_DARK} roughness={0.9} />
        </RoundedBox>
      </group>
      {[-0.28, 0.28].map((x) => (
        <group key={x} position={[x, 0.62, 0.02]}>
          <mesh position={[0, -0.08, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.16, 10]} />
            <meshStandardMaterial color="#16101f" />
          </mesh>
          <RoundedBox args={[0.07, 0.035, 0.3]} radius={0.017} smoothness={3} castShadow>
            <meshStandardMaterial color="#16101f" roughness={0.6} />
          </RoundedBox>
        </group>
      ))}
    </group>
  )
}

function Leaf({ position, rotation, size = 1, color = '#3f8f52' }: { position: [number, number, number]; rotation: [number, number, number]; size?: number; color?: string }) {
  return (
    <mesh position={position} rotation={rotation} scale={[0.13 * size, 0.018 * size, 0.07 * size]} castShadow>
      <sphereGeometry args={[1, 16, 10]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  )
}

export function FloorPlant() {
  const leaves = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => {
        const a = i * 2.4
        const h = 0.55 + (i / 16) * 0.55
        const r = 0.08 + (i % 4) * 0.035
        return {
          position: [Math.cos(a) * r, h, Math.sin(a) * r] as [number, number, number],
          rotation: [0.4 * Math.sin(a), -a, -0.5] as [number, number, number],
          size: 1 + (i % 3) * 0.15,
          color: i % 3 === 0 ? '#4fa35f' : '#3a8049',
        }
      }),
    [],
  )
  return (
    <group>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.15, 0.4, 32]} />
        <meshStandardMaterial color="#6fa3a8" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.2, 0.025, 12, 32]} />
        <meshStandardMaterial color="#6fa3a8" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.39, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.19, 32]} />
        <meshStandardMaterial color="#3a2418" />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.014, 0.02, 0.65, 8]} />
        <meshStandardMaterial color="#5a4030" />
      </mesh>
      {leaves.map((leaf, i) => (
        <Leaf key={i} {...leaf} />
      ))}
    </group>
  )
}

export function Ivy() {
  const strands = useMemo(
    () =>
      [
        [0, 0],
        [0.08, 0.05],
        [-0.07, 0.04],
      ].map(([dx, dz], s) => {
        const curve = new CatmullRomCurve3([
          new Vector3(dx, 0.1, dz),
          new Vector3(dx + 0.12, -0.05, dz + 0.1),
          new Vector3(dx + 0.15, -0.4 - s * 0.1, dz + 0.12),
          new Vector3(dx + 0.12, -0.85 - s * 0.2, dz + 0.1),
        ])
        return { curve, leaves: curve.getSpacedPoints(10 + s * 2) }
      }),
    [],
  )
  return (
    <group>
      <mesh position={[0, 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.08, 0.13, 24]} />
        <meshStandardMaterial color="#7c3aed" roughness={0.5} />
      </mesh>
      {strands.map(({ curve, leaves }, s) => (
        <group key={s}>
          <mesh>
            <tubeGeometry args={[curve, 30, 0.005, 5, false]} />
            <meshStandardMaterial color="#2f6b3a" />
          </mesh>
          {leaves.map((p, i) => (
            <mesh key={i} position={p} rotation={[i, i * 1.7, 0.4]} scale={[0.045, 0.01, 0.035]} castShadow>
              <sphereGeometry args={[1, 10, 8]} />
              <meshStandardMaterial color={i % 2 ? '#3f8f52' : '#2f7a42'} roughness={0.6} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

function consolePanel() {
  const shape = new Shape()
  shape.moveTo(-0.105, 0)
  shape.bezierCurveTo(-0.112, 0.15, -0.14, 0.32, -0.15, 0.452)
  shape.quadraticCurveTo(-0.148, 0.468, -0.13, 0.468)
  shape.bezierCurveTo(-0.02, 0.462, 0.07, 0.462, 0.15, 0.468)
  shape.quadraticCurveTo(0.162, 0.466, 0.16, 0.452)
  shape.bezierCurveTo(0.14, 0.3, 0.12, 0.14, 0.115, 0.012)
  shape.quadraticCurveTo(0.112, 0, 0.1, 0)
  shape.lineTo(-0.105, 0)
  return shape
}

export function GameConsole() {
  const panel = useMemo(() => consolePanel(), [])
  const WHITE = '#f6f6f8'
  return (
    <group>
      <mesh position={[0, 0.006, 0]}>
        <cylinderGeometry args={[0.062, 0.066, 0.012, 36]} />
        <meshStandardMaterial color="#141418" roughness={0.4} />
      </mesh>
      <RoundedBox args={[0.064, 0.43, 0.2]} radius={0.016} smoothness={4} position={[0, 0.235, 0]} castShadow>
        <meshStandardMaterial color="#0c0c10" roughness={0.12} metalness={0.4} />
      </RoundedBox>
      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={i} position={[0, 0.451, -0.08 + i * 0.02]}>
          <boxGeometry args={[0.05, 0.003, 0.008]} />
          <meshStandardMaterial color="#000" />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.034, 0.008, 0]} rotation={[0, 0, -s * 0.045]}>
          <mesh position={[s > 0 ? 0 : -0.012, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
            <extrudeGeometry args={[panel, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 4, curveSegments: 36 }]} />
            <meshStandardMaterial color={WHITE} roughness={0.28} />
          </mesh>
          <mesh position={[s * -0.002, 0.24, 0.1]}>
            <boxGeometry args={[0.004, 0.4, 0.004]} />
            <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={3.5} toneMapped={false} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.06, 0.101]}>
        <boxGeometry args={[0.02, 0.006, 0.002]} />
        <meshStandardMaterial color="#2a2a30" />
      </mesh>
    </group>
  )
}

export function Headset() {
  return (
    <group>
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 0.02, 20]} />
        <meshStandardMaterial color="#16101f" />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.26, 8]} />
        <meshStandardMaterial color="#16101f" />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <torusGeometry args={[0.1, 0.018, 10, 32, Math.PI]} />
        <meshStandardMaterial color="#2a1d3f" roughness={0.6} />
      </mesh>
      {[-0.1, 0.1].map((x) => (
        <group key={x} position={[x, 0.2, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.055, 0.055, 0.04, 24]} />
            <meshStandardMaterial color="#2a1d3f" roughness={0.6} />
          </mesh>
          <mesh position={[x > 0 ? 0.021 : -0.021, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.035, 0.006, 8, 24]} />
            <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={2.5} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
