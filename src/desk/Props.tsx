import { Clone, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { CatmullRomCurve3, Vector3, type Group } from 'three'
import speaker from './assets/speakerSmall.glb?url'

const kenney = { speaker }

interface PropProps {
  model: keyof typeof kenney
  position: [number, number, number]
  rotation?: number
  scale?: number
}

export function Prop({ model, position, rotation = 0, scale = 1 }: PropProps) {
  const { scene } = useGLTF(kenney[model])
  return <Clone object={scene} position={position} rotation={[0, rotation, 0]} scale={scale} castShadow receiveShadow />
}

function Steam() {
  const ref = useRef<Group>(null)
  const curves = useMemo(
    () =>
      [-0.012, 0.012].map(
        (x, i) =>
          new CatmullRomCurve3(
            Array.from({ length: 6 }, (_, k) => new Vector3(x + Math.sin(k * 1.3 + i * 2) * 0.012, 0.1 + k * 0.028, Math.cos(k * 1.1 + i) * 0.006)),
          ),
      ),
    [],
  )
  useFrame(({ clock }) => {
    const group = ref.current
    if (!group) return
    group.children.forEach((child, i) => {
      const t = (clock.elapsedTime * 0.35 + i * 0.5) % 1
      child.position.y = t * 0.04
      child.scale.setScalar(0.8 + t * 0.4)
      const material = (child as unknown as { material: { opacity: number } }).material
      material.opacity = Math.sin(t * Math.PI) * 0.35
    })
  })
  return (
    <group ref={ref}>
      {curves.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 24, 0.004, 6, false]} />
          <meshBasicMaterial color="#fff4e6" transparent opacity={0.3} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

export function Mug() {
  return (
    <group>
      <Steam />
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.036, 0.1, 28, 1, true]} />
        <meshStandardMaterial color="#ff8a3d" roughness={0.4} side={2} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.035, 0.032, 0.098, 28, 1, true]} />
        <meshStandardMaterial color="#f3e6d6" roughness={0.4} side={1} />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.035, 0.04, 28]} />
        <meshStandardMaterial color="#ff9a55" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.036, 28]} />
        <meshStandardMaterial color="#d96a24" />
      </mesh>
      <mesh position={[0, 0.082, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.0335, 28]} />
        <meshStandardMaterial color="#3b1d0c" roughness={0.1} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.0825, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.024, 0.033, 28]} />
        <meshStandardMaterial color="#8a5a32" roughness={0.3} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0.045, 0.05, 0]}>
        <torusGeometry args={[0.022, 0.007, 10, 20]} />
        <meshStandardMaterial color="#d96a24" />
      </mesh>
    </group>
  )
}
