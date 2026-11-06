import { Instance, Instances, RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { IcosahedronGeometry, Quaternion, Shape, Vector3, type Group } from 'three'

type V3 = [number, number, number]

function Rod({ from, to, r = 0.006, color, metal = 0.3 }: { from: V3; to: V3; r?: number; color: string; metal?: number }) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new Vector3(...from)
    const b = new Vector3(...to)
    const dir = b.clone().sub(a)
    return {
      position: a.clone().add(b).multiplyScalar(0.5),
      quaternion: new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir.clone().normalize()),
      length: dir.length(),
    }
  }, [from, to])
  return (
    <mesh position={position} quaternion={quaternion} castShadow>
      <cylinderGeometry args={[r, r, length, 10]} />
      <meshStandardMaterial color={color} metalness={metal} roughness={0.35} />
    </mesh>
  )
}

function Wheel({ position, radius, tire, rim, width = 0.03, spoked = false }: { position: V3; radius: number; tire: number; rim: string; width?: number; spoked?: boolean }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <torusGeometry args={[radius, tire, 12, 40]} />
        <meshStandardMaterial color="#121214" roughness={0.85} />
      </mesh>
      {spoked ? (
        <mesh>
          <torusGeometry args={[radius - tire * 1.1, tire * 0.35, 8, 40]} />
          <meshStandardMaterial color={rim} metalness={0.8} roughness={0.25} />
        </mesh>
      ) : (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[radius - tire * 0.6, radius - tire * 0.6, width, 28]} />
          <meshStandardMaterial color={rim} metalness={0.8} roughness={0.25} />
        </mesh>
      )}
    </group>
  )
}

function s13Profile() {
  const s = new Shape()
  s.moveTo(-0.225, 0.03)
  s.lineTo(0.215, 0.03)
  s.quadraticCurveTo(0.232, 0.032, 0.232, 0.052)
  s.lineTo(0.228, 0.066)
  s.quadraticCurveTo(0.2, 0.074, 0.1, 0.086)
  s.lineTo(0.055, 0.09)
  s.quadraticCurveTo(0.02, 0.125, -0.005, 0.132)
  s.lineTo(-0.075, 0.134)
  s.quadraticCurveTo(-0.15, 0.118, -0.205, 0.096)
  s.lineTo(-0.222, 0.094)
  s.lineTo(-0.226, 0.08)
  s.quadraticCurveTo(-0.232, 0.05, -0.225, 0.03)
  return s
}

function sideWindow() {
  const s = new Shape()
  s.moveTo(0.048, 0.093)
  s.quadraticCurveTo(0.018, 0.122, -0.005, 0.127)
  s.lineTo(-0.072, 0.128)
  s.quadraticCurveTo(-0.13, 0.116, -0.16, 0.101)
  s.lineTo(-0.15, 0.095)
  s.lineTo(0.048, 0.093)
  return s
}

const CAR_W = 0.15

function Fender({ x, front }: { x: number; front: boolean }) {
  const len = front ? 0.12 : 0.13
  return (
    <group>
      {[-1, 1].map((side) => (
        <group key={side} position={[x, 0.058, side * (CAR_W / 2 + 0.012)]}>
          <RoundedBox args={[len, 0.05, 0.03]} radius={0.012} smoothness={4} castShadow>
            <meshPhysicalMaterial color="#3b1366" roughness={0.25} metalness={0.55} clearcoat={1} clearcoatRoughness={0.1} />
          </RoundedBox>
          <Instances limit={7}>
            <sphereGeometry args={[0.0028, 8, 6]} />
            <meshStandardMaterial color="#9a9ca3" metalness={0.9} roughness={0.2} />
            {Array.from({ length: 7 }, (_, i) => {
              const a = Math.PI * (0.1 + (i / 6) * 0.8)
              return <Instance key={i} position={[Math.cos(a) * len * 0.48, -0.022 + Math.sin(a) * 0.04, side * 0.0155]} />
            })}
          </Instances>
        </group>
      ))}
    </group>
  )
}

function DishWheel({ position }: { position: V3 }) {
  const side = Math.sign(position[2])
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.037, 0.037, 0.03, 28]} />
        <meshStandardMaterial color="#121214" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0, side * 0.0155]}>
        <torusGeometry args={[0.026, 0.004, 8, 28]} />
        <meshStandardMaterial color="#d8d9de" metalness={0.95} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0, side * 0.008]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.022, 0.018, 0.012, 24, 1, true]} />
        <meshStandardMaterial color="#c08a3e" metalness={0.8} roughness={0.25} side={2} />
      </mesh>
      <mesh position={[0, 0, side * 0.003]}>
        <circleGeometry args={[0.018, 24]} />
        <meshStandardMaterial color="#c08a3e" metalness={0.8} roughness={0.25} side={2} />
      </mesh>
    </group>
  )
}

export function JdmCar() {
  const body = useMemo(() => s13Profile(), [])
  const glass = useMemo(() => sideWindow(), [])
  const WHITE = '#3b1366'
  return (
    <group>
      <mesh position={[0, 0, -CAR_W / 2]} castShadow>
        <extrudeGeometry args={[body, { depth: CAR_W, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.008, bevelSegments: 5, curveSegments: 24 }]} />
        <meshPhysicalMaterial color={WHITE} roughness={0.25} metalness={0.55} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0, 0, side * (CAR_W / 2 + 0.0125)]} rotation={[0, side > 0 ? 0 : Math.PI, 0]} scale={[side > 0 ? 1 : -1, 1, 1]}>
          <shapeGeometry args={[glass]} />
          <meshStandardMaterial color="#0b0e16" roughness={0.05} metalness={0.7} side={2} />
        </mesh>
      ))}
      {[
        { center: [0.026, 0.111], angle: -0.611, length: 0.066 },
        { center: [-0.14, 0.115], angle: 0.284, length: 0.12 },
      ].map(({ center, angle, length }) => (
        <group key={angle} position={[center[0], center[1], 0]} rotation={[0, 0, angle]}>
          <mesh position={[0, 0.0105, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[length, CAR_W - 0.01]} />
            <meshStandardMaterial color="#0b0e16" roughness={0.05} metalness={0.7} />
          </mesh>
        </group>
      ))}
      {[-1, 1].map((side) => (
        <group key={side} position={[0.195, 0.088, side * 0.045]}>
          <RoundedBox args={[0.03, 0.018, 0.042]} radius={0.005} castShadow>
            <meshPhysicalMaterial color="#3b1366" roughness={0.25} metalness={0.55} clearcoat={1} clearcoatRoughness={0.1} />
          </RoundedBox>
          {[-0.01, 0.01].map((z) => (
            <mesh key={z} position={[0.0155, 0, z]} rotation={[0, Math.PI / 2, 0]}>
              <circleGeometry args={[0.0075, 20]} />
              <meshStandardMaterial color="#7cc4ff" emissive="#3b9cff" emissiveIntensity={4} toneMapped={false} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0.237, 0.045, 0]}>
        <boxGeometry args={[0.006, 0.012, CAR_W - 0.02]} />
        <meshStandardMaterial color="#141416" />
      </mesh>
      <RoundedBox args={[0.05, 0.006, CAR_W + 0.04]} radius={0.002} position={[0.225, 0.026, 0]}>
        <meshStandardMaterial color="#141416" roughness={0.5} />
      </RoundedBox>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0.225, 0.045, side * (CAR_W / 2 + 0.018)]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.03, 0.004, 0.02]} />
          <meshStandardMaterial color="#141416" />
        </mesh>
      ))}
      {[-1, 1].map((side) => (
        <RoundedBox key={side} args={[0.16, 0.016, 0.01]} radius={0.004} position={[0.005, 0.034, side * (CAR_W / 2 + 0.02)]}>
          <meshStandardMaterial color="#141416" roughness={0.5} />
        </RoundedBox>
      ))}
      <mesh position={[-0.236, 0.075, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[CAR_W, 0.016]} />
        <meshStandardMaterial color="#ff2a2a" emissive="#ff2a2a" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <RoundedBox args={[0.03, 0.008, CAR_W + 0.02]} radius={0.003} position={[-0.215, 0.103, 0]} rotation={[0, 0, 0.35]}>
        <meshStandardMaterial color="#141416" roughness={0.4} />
      </RoundedBox>
      <RoundedBox args={[0.04, 0.008, CAR_W + 0.03]} radius={0.003} position={[-0.215, 0.024, 0]}>
        <meshStandardMaterial color="#141416" roughness={0.5} />
      </RoundedBox>
      <Fender x={0.135} front />
      <Fender x={-0.14} front={false} />
      {[0.135, -0.14].map((x) => [-1, 1].map((sd) => <DishWheel key={`${x}${sd}`} position={[x, 0.037, sd * (CAR_W / 2 + 0.012)]} />))}
      <mesh position={[-0.245, 0.03, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.005, 0.005, 0.03, 8]} />
        <meshStandardMaterial color="#333" metalness={0.8} />
      </mesh>
    </group>
  )
}

export function Trailer() {
  return (
    <group>
      <Rod from={[0.2, 0.03, 0]} to={[0.08, 0.045, 0]} r={0.005} color="#1c1c20" metal={0.6} />
      {[-0.055, 0.055].map((z) => (
        <group key={z}>
          <Rod from={[0.08, 0.045, 0]} to={[0.08, 0.045, z]} r={0.005} color="#1c1c20" metal={0.6} />
          <Rod from={[0.08, 0.045, z]} to={[-0.2, 0.045, z]} r={0.005} color="#1c1c20" metal={0.6} />
          <RoundedBox args={[0.22, 0.01, 0.018]} radius={0.004} position={[-0.06, 0.054, z * 0.8]}>
            <meshStandardMaterial color="#3a2a5a" roughness={0.9} />
          </RoundedBox>
          <group position={[-0.06, 0.028, z * 1.45]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.028, 0.028, 0.016, 20]} />
              <meshStandardMaterial color="#121214" roughness={0.85} />
            </mesh>
            <mesh position={[0, 0, Math.sign(z) * 0.0085]}>
              <circleGeometry args={[0.016, 20]} />
              <meshStandardMaterial color="#c9cbd1" metalness={0.8} roughness={0.25} />
            </mesh>
            <RoundedBox args={[0.075, 0.008, 0.026]} radius={0.003} position={[0, 0.034, 0]}>
              <meshStandardMaterial color="#1c1c20" />
            </RoundedBox>
          </group>
        </group>
      ))}
      <Rod from={[-0.2, 0.045, -0.055]} to={[-0.2, 0.045, 0.055]} r={0.005} color="#1c1c20" metal={0.6} />
      <Rod from={[0.08, 0.045, 0]} to={[0.08, 0.09, 0]} r={0.004} color="#1c1c20" metal={0.6} />
      {[-0.05, 0.05].map((z) => (
        <mesh key={z} position={[-0.205, 0.05, z]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.02, 0.01]} />
          <meshStandardMaterial color="#ff2a2a" emissive="#ff2a2a" emissiveIntensity={2} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

export function CarWithJetSki() {
  return (
    <group>
      <group position={[0.24, 0, 0]}>
        <JdmCar />
      </group>
      <group position={[-0.23, 0, 0]}>
        <Trailer />
        <group position={[-0.06, 0.012, 0]} scale={0.82}>
          <JetSki onTrailer />
        </group>
      </group>
    </group>
  )
}

function hullShape(scale: number) {
  const s = new Shape()
  s.moveTo(-0.17 * scale, -0.08 * scale)
  s.lineTo(0.05 * scale, -0.085 * scale)
  s.quadraticCurveTo(0.2 * scale, -0.06 * scale, 0.24 * scale, 0)
  s.quadraticCurveTo(0.2 * scale, 0.06 * scale, 0.05 * scale, 0.085 * scale)
  s.lineTo(-0.17 * scale, 0.08 * scale)
  s.quadraticCurveTo(-0.19 * scale, 0, -0.17 * scale, -0.08 * scale)
  return s
}

export function JetSki({ onTrailer = false }: { onTrailer?: boolean }) {
  const lower = useMemo(() => hullShape(1), [])
  const deck = useMemo(() => hullShape(0.94), [])
  const TEAL = '#14b8c4'
  return (
    <group>
      {!onTrailer && (
        <>
          <mesh position={[0, 0.015, 0]}>
            <boxGeometry args={[0.3, 0.012, 0.03]} />
            <meshStandardMaterial color="#2a2233" />
          </mesh>
          {[-0.08, 0.08].map((x) => (
            <mesh key={x} position={[x, 0.035, 0]}>
              <cylinderGeometry args={[0.006, 0.006, 0.04, 8]} />
              <meshStandardMaterial color="#2a2233" />
            </mesh>
          ))}
        </>
      )}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <extrudeGeometry args={[hullShape(1.02), { depth: 0.008, bevelEnabled: false, curveSegments: 24 }]} />
        <meshStandardMaterial color="#3a3d45" roughness={0.6} />
      </mesh>
      {[-1, 1].map((side) => (
        <RoundedBox key={side} args={[0.09, 0.012, 0.025]} radius={0.004} position={[-0.09, 0.125, side * 0.05]}>
          <meshStandardMaterial color="#17171b" roughness={0.8} />
        </RoundedBox>
      ))}
      <mesh position={[0.16, 0.112, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.05, 0.004, 0.09]} />
        <meshStandardMaterial color="#0f8f94" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.055, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <extrudeGeometry args={[lower, { depth: 0.035, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 4, curveSegments: 24 }]} />
        <meshStandardMaterial color="#141417" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <extrudeGeometry args={[deck, { depth: 0.018, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.01, bevelSegments: 4, curveSegments: 24 }]} />
        <meshStandardMaterial color={TEAL} roughness={0.25} metalness={0.1} />
      </mesh>
      <RoundedBox args={[0.13, 0.03, 0.06]} radius={0.014} smoothness={4} position={[-0.07, 0.14, 0]} castShadow>
        <meshStandardMaterial color="#17171b" roughness={0.7} />
      </RoundedBox>
      <mesh position={[0.1, 0.13, 0]} scale={[0.06, 0.03, 0.06]}>
        <sphereGeometry args={[1, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={TEAL} roughness={0.25} />
      </mesh>
      <Rod from={[0.04, 0.13, 0]} to={[0.02, 0.22, 0]} r={0.008} color="#17171b" />
      <Rod from={[0.02, 0.22, -0.06]} to={[0.02, 0.22, 0.06]} r={0.006} color="#17171b" />
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0.02, 0.22, s * 0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[0.008, 0.02, 4, 8]} />
          <meshStandardMaterial color="#16c6c9" />
        </mesh>
      ))}
    </group>
  )
}

export function MountainBike() {
  const FRAME = '#ff7a1a'
  const rear: V3 = [-0.13, 0.09, 0]
  const front: V3 = [0.14, 0.09, 0]
  const bb: V3 = [-0.01, 0.075, 0]
  const seat: V3 = [-0.05, 0.2, 0]
  const head: V3 = [0.1, 0.21, 0]
  return (
    <group>
      {[rear, front].map((p, i) => (
        <group key={i}>
          <Wheel position={p} radius={0.07} tire={0.01} rim="#9a9ca3" spoked />
          <Instances limit={8} position={p}>
            <cylinderGeometry args={[0.0012, 0.0012, 0.124, 4]} />
            <meshStandardMaterial color="#9a9ca3" metalness={0.8} roughness={0.35} />
            {Array.from({ length: 8 }, (_, k) => (
              <Instance key={k} rotation={[0, 0, (k / 8) * Math.PI]} />
            ))}
          </Instances>
        </group>
      ))}
      <Rod from={bb} to={seat} r={0.008} color={FRAME} />
      <Rod from={seat} to={head} r={0.008} color={FRAME} />
      <Rod from={bb} to={[0.095, 0.19, 0]} r={0.009} color={FRAME} />
      {[-0.012, 0.012].map((z) => (
        <group key={z}>
          <Rod from={[bb[0], bb[1], z]} to={[rear[0], rear[1], z]} r={0.004} color={FRAME} />
          <Rod from={[seat[0], seat[1] - 0.02, z]} to={[rear[0], rear[1], z]} r={0.004} color={FRAME} />
          <Rod from={[head[0], head[1] - 0.02, z]} to={[front[0], front[1], z * 1.4]} r={0.005} color="#1c1c20" metal={0.6} />
        </group>
      ))}
      <Rod from={seat} to={[-0.06, 0.235, 0]} r={0.005} color="#1c1c20" />
      <RoundedBox args={[0.06, 0.012, 0.025]} radius={0.005} position={[-0.065, 0.242, 0]}>
        <meshStandardMaterial color="#17171b" roughness={0.7} />
      </RoundedBox>
      <Rod from={head} to={[0.11, 0.24, 0]} r={0.006} color="#1c1c20" />
      <Rod from={[0.11, 0.24, -0.06]} to={[0.11, 0.24, 0.06]} r={0.005} color="#1c1c20" />
      <mesh position={bb} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.006, 16]} />
        <meshStandardMaterial color="#9a9ca3" metalness={0.8} roughness={0.25} />
      </mesh>
    </group>
  )
}

export function ClimbingHold() {
  const geometry = useMemo(() => {
    const g = new IcosahedronGeometry(0.07, 5)
    const pos = g.attributes.position
    const v = new Vector3()
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i)
      const n = 1 + 0.18 * Math.sin(v.x * 40) * Math.cos(v.y * 33) + 0.1 * Math.sin(v.z * 55 + v.x * 20)
      v.multiplyScalar(n)
      if (v.z < 0) v.z *= 0.25
      v.y *= 0.8
      if (v.y > 0.02 && v.z > 0) v.z += (v.y - 0.02) * 0.6
      pos.setXYZ(i, v.x, v.y, v.z)
    }
    g.computeVertexNormals()
    return g
  }, [])
  return (
    <group rotation={[-0.25, 0, 0]}>
      <RoundedBox args={[0.26, 0.26, 0.03]} radius={0.012} smoothness={3} position={[0, 0.14, -0.015]} castShadow>
        <meshStandardMaterial color="#3a3f4a" roughness={0.95} />
      </RoundedBox>
      <mesh geometry={geometry} position={[0, 0.14, 0.005]} castShadow>
        <meshStandardMaterial color="#f43f8e" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.125, 0.045]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.01, 16]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.3} />
      </mesh>
      {[
        [-0.09, 0.05],
        [0.09, 0.23],
      ].map(([x, y]) => (
        <mesh key={x} position={[x, y, 0.002]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.007, 0.007, 0.004, 12]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      ))}
    </group>
  )
}

export function LootCrate() {
  return (
    <group>
      <RoundedBox args={[0.24, 0.13, 0.16]} radius={0.018} smoothness={4} position={[0, 0.065, 0]} castShadow>
        <meshStandardMaterial color="#3d4048" roughness={0.6} metalness={0.3} />
      </RoundedBox>
      {[-0.07, 0, 0.07].map((x) => (
        <mesh key={x} position={[x, 0.065, 0.081]} rotation={[0, 0, 0.6]}>
          <planeGeometry args={[0.025, 0.12]} />
          <meshStandardMaterial color="#ffb020" />
        </mesh>
      ))}
      <mesh position={[0, 0.131, 0]}>
        <boxGeometry args={[0.2, 0.004, 0.12]} />
        <meshStandardMaterial color="#38e0ff" emissive="#38e0ff" emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
      <group position={[0, 0.13, -0.08]} rotation={[-1.1, 0, 0]}>
        <RoundedBox args={[0.25, 0.02, 0.17]} radius={0.008} position={[0, 0, 0.085]} castShadow>
          <meshStandardMaterial color="#4a4e57" roughness={0.6} metalness={0.3} />
        </RoundedBox>
      </group>
      <group position={[0.17, 0.003, 0.05]} rotation={[-Math.PI / 2, 0, 0.3]}>
        <mesh>
          <planeGeometry args={[0.08, 0.11]} />
          <meshStandardMaterial color="#efe8d8" />
        </mesh>
        {[0.03, 0.01, -0.01, -0.03].map((y, i) => (
          <group key={y} position={[0, y, 0.001]}>
            <mesh position={[-0.025, 0, 0]}>
              <planeGeometry args={[0.01, 0.01]} />
              <meshStandardMaterial color={i < 2 ? '#22c55e' : '#999'} />
            </mesh>
            <mesh position={[0.008, 0, 0]}>
              <planeGeometry args={[0.045, 0.004]} />
              <meshStandardMaterial color="#777" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

export function EnergyCore() {
  return (
    <group>
      <mesh position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.075, 0.08, 0.03, 40]} />
        <meshStandardMaterial color="#1a1422" metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.034, 0]}>
        <cylinderGeometry args={[0.066, 0.066, 0.008, 40]} />
        <meshStandardMaterial color="#c9971c" metalness={0.9} roughness={0.2} />
      </mesh>
      <group position={[0, 0.12, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.022, 40]} />
          <meshStandardMaterial color="#5a5e66" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, 0.012]}>
          <torusGeometry args={[0.034, 0.006, 12, 40]} />
          <meshStandardMaterial color="#9fe7ff" emissive="#38c8ff" emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * 0.034, Math.sin(a) * 0.034, 0.012]} rotation={[0, 0, a]}>
              <boxGeometry args={[0.004, 0.012, 0.008]} />
              <meshStandardMaterial color="#2a2c31" metalness={0.8} />
            </mesh>
          )
        })}
        <mesh position={[0, 0, 0.013]}>
          <circleGeometry args={[0.016, 32]} />
          <meshStandardMaterial color="#e8fbff" emissive="#7ad8ff" emissiveIntensity={1.8} toneMapped={false} />
        </mesh>
      </group>
      <mesh position={[0, 0.085, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.04, 8]} />
        <meshStandardMaterial color="#2a2c31" metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.068, 0.068, 0.16, 40, 1, true]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.12} roughness={0.05} metalness={0} side={2} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.068, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.12} roughness={0.05} side={2} depthWrite={false} />
      </mesh>
    </group>
  )
}

export function SpinningTop() {
  const ref = useRef<Group>(null)
  useFrame(({ clock }, delta) => {
    const top = ref.current
    if (!top) return
    top.rotation.y += delta * 9
    top.rotation.z = Math.sin(clock.elapsedTime * 1.3) * 0.06
  })
  return (
    <group ref={ref}>
      <mesh position={[0, 0.03, 0]} castShadow>
        <coneGeometry args={[0.035, 0.05, 32]} />
        <meshStandardMaterial color="#9a9ca3" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.062, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <coneGeometry args={[0.035, 0.014, 32]} />
        <meshStandardMaterial color="#9a9ca3" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.03, 10]} />
        <meshStandardMaterial color="#b9bbc2" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.006, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.006, 0.012, 10]} />
        <meshStandardMaterial color="#b9bbc2" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  )
}

export function Watch() {
  return (
    <group rotation={[-0.5, 0, 0]} position={[0, 0.05, 0]}>
      <RoundedBox args={[0.03, 0.12, 0.012]} radius={0.005} position={[0, 0, -0.008]}>
        <meshStandardMaterial color="#4a2a1c" roughness={0.7} />
      </RoundedBox>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.012, 32]} />
        <meshStandardMaterial color="#c9cbd1" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.0065]}>
        <circleGeometry args={[0.026, 32]} />
        <meshStandardMaterial color="#f4efe4" roughness={0.4} />
      </mesh>
      {[0, 1.2].map((a, i) => (
        <mesh key={a} position={[Math.sin(a) * 0.008, Math.cos(a) * 0.008, 0.007]} rotation={[0, 0, -a]}>
          <boxGeometry args={[0.002, i ? 0.014 : 0.02, 0.001]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      ))}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.sin(a) * 0.022, Math.cos(a) * 0.022, 0.007]}>
            <circleGeometry args={[0.0015, 6]} />
            <meshStandardMaterial color="#333" />
          </mesh>
        )
      })}
    </group>
  )
}

export function GoldenEgg() {
  return (
    <group>
      <mesh position={[0, 0.012, 0]}>
        <cylinderGeometry args={[0.03, 0.036, 0.024, 24]} />
        <meshStandardMaterial color="#1a1422" />
      </mesh>
      <mesh position={[0, 0.065, 0]} scale={[0.034, 0.046, 0.034]} castShadow>
        <sphereGeometry args={[1, 32, 24]} />
        <meshStandardMaterial color="#f5c542" metalness={1} roughness={0.15} emissive="#7a5a10" emissiveIntensity={0.25} />
      </mesh>
    </group>
  )
}

export function RoundShield() {
  const rings: [number, string][] = [
    [0.1, '#ff8a3d'],
    [0.08, '#f4f1ea'],
    [0.06, '#ff8a3d'],
    [0.04, '#6a43a0'],
  ]
  return (
    <group position={[0, 0.11, 0]} rotation={[-0.2, 0, 0]}>
      {rings.map(([r, color], i) => (
        <mesh key={r} position={[0, 0, i * 0.003]} rotation={[Math.PI / 2, 0, 0]} castShadow={i === 0}>
          <cylinderGeometry args={[r, r, 0.012, 48]} />
          <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, -0.1, -0.03]}>
        <boxGeometry args={[0.05, 0.012, 0.05]} />
        <meshStandardMaterial color="#1a1422" />
      </mesh>
    </group>
  )
}
