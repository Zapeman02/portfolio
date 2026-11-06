import { Html, useCursor } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Box3, Matrix4, Vector3, type Group } from 'three'

interface DeskItemProps {
  title: string
  text: string
  position: [number, number, number]
  rotation?: number
  tipHeight?: number
  scale?: number
  active?: boolean
  onHover?: (hovered: boolean) => void
  onClick?: () => void
  children: ReactNode
}

const HIT_PADDING = 0.06
const LEAVE_DELAY_MS = 120

export function DeskItem({ title, text, position, rotation = 0, tipHeight = 0.6, scale = 1, active = false, onHover, onClick, children }: DeskItemProps) {
  const ref = useRef<Group>(null)
  const content = useRef<Group>(null)
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [pointerHover, setPointerHover] = useState(false)
  const hovered = pointerHover || active
  const [hitbox, setHitbox] = useState<{ center: Vector3; size: Vector3 } | null>(null)
  useCursor(pointerHover && !!onClick)
  const setHovered = (value: boolean) => {
    setPointerHover(value)
    onHover?.(value)
  }

  useLayoutEffect(() => {
    const group = ref.current
    const inner = content.current
    if (!group || !inner) return
    group.updateWorldMatrix(true, true)
    const box = new Box3().setFromObject(inner)
    if (box.isEmpty()) return
    box.applyMatrix4(new Matrix4().copy(group.matrixWorld).invert())
    const size = box.getSize(new Vector3()).addScalar(HIT_PADDING / scale)
    setHitbox({ center: box.getCenter(new Vector3()), size })
  }, [scale])

  useEffect(() => () => clearTimeout(leaveTimer.current), [])

  useFrame((_, delta) => {
    const group = ref.current
    if (!group) return
    const target = hovered ? scale * 1.1 : scale
    group.scale.setScalar(group.scale.x + (target - group.scale.x) * Math.min(1, delta * 10))
  })

  return (
    <group
      ref={ref}
      position={position}
      scale={scale}
      rotation={[0, rotation, 0]}
      onPointerOver={(e) => {
        e.stopPropagation()
        clearTimeout(leaveTimer.current)
        setHovered(true)
      }}
      onPointerOut={() => {
        clearTimeout(leaveTimer.current)
        leaveTimer.current = setTimeout(() => setHovered(false), LEAVE_DELAY_MS)
      }}
      onClick={(e) => {
        e.stopPropagation()
        if ((e.nativeEvent as PointerEvent).pointerType === 'touch' && !pointerHover) {
          setHovered(true)
          return
        }
        onClick?.()
      }}
    >
      <group ref={content}>{children}</group>
      {hitbox && (
        <mesh position={hitbox.center}>
          <boxGeometry args={hitbox.size.toArray()} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
        </mesh>
      )}
      {hovered && (
        <Html position={[0, tipHeight, 0]} center className="desk-tip-anchor">
          <div className="desk-tip">
            <strong>{title}</strong>
            <span>{text}</span>
          </div>
        </Html>
      )}
    </group>
  )
}
