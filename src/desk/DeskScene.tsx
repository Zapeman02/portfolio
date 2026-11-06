import { OrbitControls, Sparkles, useProgress } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer, ToneMapping, Vignette } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { Vector3 } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { ProjectDetail } from '../components/ProjectDetail'
import type { Project } from '../data/projects'
import { DeskItem } from './DeskItem'
import * as M from './models'
import { Chair, FloorPlant, GameConsole, Headset, Ivy } from './Furniture'
import { CarWithJetSki, ClimbingHold, EnergyCore, GoldenEgg, LootCrate, MountainBike, RoundShield, SpinningTop, Watch } from './interests'
import { Mug, Prop } from './Props'
import { DESK_Y, SHELF_LEVELS, SIDEBOARD } from './layout'
import { Room } from './Room'
import './desk.css'

type Placement = {
  position: [number, number, number]
  rotation?: number
  scale?: number
  tipHeight?: number
  model: ReactNode
}

const SHELF_Z = 0.17
const [L1, L2, TOP] = SHELF_LEVELS
const shelf = (x: number, y: number): [number, number, number] => [x, y, SHELF_Z]
const board = (z: number, level: number): [number, number, number] => [SIDEBOARD.depth / 2, SIDEBOARD.levels[level], SIDEBOARD.z0 + z]
const FACE = Math.PI / 2
const onDesk = (x: number, z: number): [number, number, number] => [x, DESK_Y, z]

const placements: Record<string, Placement> = {
  raceday: { position: onDesk(1.4, 0.5), rotation: 0.15, scale: 1.25, tipHeight: 0.45, model: <M.MacBook /> },
  'calm-week': { position: onDesk(0.85, 0.5), rotation: 0.2, scale: 0.8, model: <M.Notebook /> },
  carspotter: { position: onDesk(2.4, 0.6), rotation: -0.3, scale: 0.8, model: <M.Phone /> },
  racerlearning: { position: onDesk(0.42, 2.4), rotation: -0.9, scale: 0.7, model: <M.RaceCar /> },
  'sepm-robot': { position: onDesk(0.42, 1.12), rotation: 1.3, scale: 0.9, model: <M.Mower /> },
  rocketbike: { position: onDesk(0.42, 1.92), rotation: 0.45, scale: 1.15, model: <M.Motorbike /> },
  agb: { position: shelf(0.55, L1), scale: 0.5, tipHeight: 0.8, model: <M.Silo /> },
  eventhorizon: { position: shelf(1.7, L1 - 0.08), scale: 0.65, model: <M.BlackHole /> },
  'smart-home': { position: shelf(2.85, L1), scale: 0.8, model: <M.Bulb /> },
  kundboken: { position: shelf(0.6, TOP), scale: 0.8, model: <M.Books /> },
  'four-in-a-row': { position: shelf(1.7, TOP), scale: 0.75, model: <M.ConnectBoard /> },
  'sensor-node': { position: shelf(2.8, TOP), scale: 0.7, model: <M.CircuitBoard /> },
  bletracker: { position: shelf(0.55, L2), scale: 1, tipHeight: 0.3, model: <M.Tag /> },
  'ica-list': { position: shelf(1.45, L2), scale: 0.7, model: <M.Bag /> },
  'arc-raiders-path': { position: shelf(2.35, L2), scale: 0.95, tipHeight: 0.35, model: <LootCrate /> },
}

const hobbies: (Placement & { title: string; text: string })[] = [
  { title: 'Interstellar', text: 'We used to look up at the sky and wonder at our place in the stars.', position: board(0.3, 0), rotation: FACE, scale: 1.3, tipHeight: 0.25, model: <Watch /> },
  { title: 'Inception', text: 'Is it still spinning?', position: board(0.72, 0), scale: 1.6, tipHeight: 0.25, model: <SpinningTop /> },
  { title: 'Ready Player One', text: 'Still looking for the Easter egg.', position: board(1.14, 0), scale: 1.4, tipHeight: 0.25, model: <GoldenEgg /> },
  { title: 'Bouldering', text: 'Solving boulders is really fun.', position: board(0.2, 1), rotation: FACE, scale: 0.9, tipHeight: 0.36, model: <ClimbingHold /> },
  { title: 'Mountain biking', text: 'To get my mind calm after a long day.', position: board(0.72, 1), rotation: FACE, scale: 1.15, tipHeight: 0.38, model: <MountainBike /> },
  { title: 'Ju-jutsu', text: 'Pretty much my life for the first 16 years. Gold medal from the Swedish Championships.', position: board(1.24, 1), rotation: FACE - 0.25, scale: 0.85, tipHeight: 0.4, model: <M.Gi /> },
  {
    title: 'JDM cars and my jet ski',
    text: 'A deep purple Nissan 240SX with a Rocket Bunny kit, towing my Sea-Doo Spark Trixx.',
    position: board(0.72, 2),
    rotation: -Math.PI / 2,
    scale: 1.2,
    tipHeight: 0.32,
    model: <CarWithJetSki />,
  },
  { title: 'Marvel', text: 'I love you 3000.', position: board(0.3, 3), rotation: FACE, scale: 1.3, tipHeight: 0.45, model: <EnergyCore /> },
  { title: 'Marvel', text: 'Pretty much every Marvel movie, more than once.', position: board(0.75, 3), rotation: FACE, scale: 1.1, tipHeight: 0.4, model: <RoundShield /> },
  { title: 'Sapling', text: 'I am Groot.', position: board(1.18, 3), scale: 1.1, tipHeight: 0.5, model: <M.Sapling /> },
]

const TARGET = new Vector3(2.0, 1.2, 2.0)
const VIEW_DIR = new Vector3(5.4, 2.7, 5.4).normalize()
const START_DIR = new Vector3(Math.sin(1.35), 0.55, Math.cos(1.35)).normalize()
const ROOM_HALF_WIDTH = 3.3
const MIN_DISTANCE = 8.1
const INTRO_SECONDS = 2.6
const FOV = 34
const GUIDE_SHIFT = 120

const guideLabels: Record<string, string> = {
  'sepm-robot': 'Self-driving robot',
  'smart-home': 'Smart home',
  'ica-list': 'Shopping list',
  'four-in-a-row': 'Four in a row',
  'sensor-node': 'Sensor node',
}
const guideLabel = (project: Project) => guideLabels[project.id] ?? project.title.split(':')[0]

export default function DeskScene({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null)
  const [ready, setReady] = useState(false)
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const [guideOpen, setGuideOpen] = useState<boolean | null>(null)
  const lite = useMediaQuery('(max-width: 719px), (pointer: coarse)')
  const close = useCallback(() => setSelected(null), [])
  const placed = projects.filter((p) => placements[p.id])
  const hover = (key: string) => (value: boolean) => setActiveKey((current) => (value ? key : current === key ? null : current))

  return (
    <div className="desk-scene">
      <Canvas shadows={!lite} dpr={lite ? [1, 1.5] : [1, 2]} camera={{ position: TARGET.clone().addScaledVector(START_DIR, 14).toArray(), fov: FOV }}>
        <color attach="background" args={['#160e20']} />
        <ambientLight intensity={0.55} color="#b9a4e6" />
        <hemisphereLight args={['#d8c8ff', '#3a2418', 0.5]} />
        <pointLight position={[0.45, 1.35, 0.45]} color="#ffb46b" intensity={6} distance={5} decay={1.4} />
        <pointLight position={[1.7, 1.35, 0.6]} color="#a855f7" intensity={2.5} distance={3} decay={1.6} />
        <directionalLight position={[6, 9, 5]} color="#ffe2c4" intensity={0.9} castShadow shadow-mapSize={lite ? [1024, 1024] : [2048, 2048]} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-bias={-0.0004} />
        <Suspense fallback={null}>
          <Room />
          <Decor />
          {placed.map((project) => {
            const place = placements[project.id]
            return (
              <DeskItem
                key={project.id}
                title={project.title}
                text={project.problem}
                position={place.position}
                rotation={place.rotation}
                scale={place.scale}
                tipHeight={place.tipHeight}
                active={activeKey === project.id}
                onHover={hover(project.id)}
                onClick={() => setSelected(project)}
              >
                {place.model}
              </DeskItem>
            )
          })}
          {hobbies.map(({ title, text, model, ...place }) => (
            <DeskItem key={text} title={title} text={text} {...place} active={activeKey === text} onHover={hover(text)}>
              {model}
            </DeskItem>
          ))}
          <Sparkles count={lite ? 30 : 70} scale={[3.8, 2.6, 3.8]} position={[2.1, 1.5, 2.1]} size={2.2} speed={0.25} opacity={0.7} color="#ffcf7a" />
          <Ready onReady={() => setReady(true)} />
        </Suspense>
        <CameraRig ready={ready} shift={!lite && (guideOpen ?? true) ? GUIDE_SHIFT : 0} />
        <EffectComposer multisampling={0} resolutionScale={lite ? 0.5 : 1}>
          <Bloom mipmapBlur luminanceThreshold={1} intensity={0.9} radius={0.75} levels={lite ? 5 : 8} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          <Vignette offset={0.25} darkness={0.7} />
        </EffectComposer>
      </Canvas>
      <Loader ready={ready} />
      {ready && (
        <Guide
          projects={placed}
          activeKey={activeKey}
          open={guideOpen ?? !lite}
          onToggle={() => setGuideOpen(!(guideOpen ?? !lite))}
          onActive={setActiveKey}
          onOpen={setSelected}
        />
      )}
      {ready && <p className="desk-hint">{lite ? 'Drag to look around. Tap once to peek, twice to open.' : 'Drag to look around. Click an object to open the project.'}</p>}
      {selected && <ProjectDetail project={selected} onClose={close} />}
    </div>
  )
}

interface GuideProps {
  projects: Project[]
  activeKey: string | null
  open: boolean
  onToggle: () => void
  onActive: (key: string | null) => void
  onOpen: (project: Project) => void
}

function Guide({ projects, activeKey, open, onToggle, onActive, onOpen }: GuideProps) {
  return (
    <nav className={`desk-guide${open ? ' is-open' : ''}`} aria-label="Desk guide">
      <button type="button" className="desk-guide-toggle" aria-expanded={open} onClick={onToggle}>
        {open ? 'Hide guide' : 'Guide'}
      </button>
      {open && (
        <div className="desk-guide-body" onMouseLeave={() => onActive(null)}>
          <h2>Projects</h2>
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <button
                  type="button"
                  aria-current={activeKey === project.id}
                  onMouseEnter={() => onActive(project.id)}
                  onFocus={() => onActive(project.id)}
                  onClick={() => onOpen(project)}
                >
                  {guideLabel(project)}
                </button>
              </li>
            ))}
          </ul>
          <h2>Interests</h2>
          <ul>
            {hobbies.map(({ title, text }) => (
              <li key={text}>
                <button
                  type="button"
                  aria-current={activeKey === text}
                  onMouseEnter={() => onActive(text)}
                  onFocus={() => onActive(text)}
                  onClick={() => onActive(activeKey === text ? null : text)}
                >
                  {title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}

function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    const id = setTimeout(onReady, 400)
    return () => clearTimeout(id)
  }, [onReady])
  return null
}

function Loader({ ready }: { ready: boolean }) {
  const { progress } = useProgress()
  return (
    <div className={`desk-loader${ready ? ' is-done' : ''}`} aria-live="polite">
      <p>Setting up the desk…</p>
      <div className="desk-loader-bar">
        <span style={{ width: `${ready ? 100 : Math.max(8, progress * 0.9)}%` }} />
      </div>
    </div>
  )
}

function CameraRig({ ready, shift }: { ready: boolean; shift: number }) {
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  const aspect = useThree((s) => s.size.width / s.size.height)
  const controls = useRef<OrbitControlsImpl>(null)
  const start = useRef<number | null>(null)
  const [done, setDone] = useState(false)

  const { from, to } = useMemo(() => {
    const halfFov = ((FOV / 2) * Math.PI) / 180
    const horizontal = Math.atan(Math.tan(halfFov) * aspect)
    const distance = Math.max(MIN_DISTANCE, ROOM_HALF_WIDTH / Math.tan(horizontal))
    return {
      from: TARGET.clone().addScaledVector(START_DIR, distance * 1.6),
      to: TARGET.clone().addScaledVector(VIEW_DIR, distance),
    }
  }, [aspect])

  useEffect(() => {
    if (!('setViewOffset' in camera)) return
    if (shift) camera.setViewOffset(size.width, size.height, -shift, 0, size.width, size.height)
    else camera.clearViewOffset()
    camera.updateProjectionMatrix()
  }, [camera, shift, size.width, size.height])

  useFrame(({ clock }) => {
    if (!ready || done) {
      if (!ready) {
        camera.position.copy(from)
        camera.lookAt(TARGET)
      }
      return
    }
    start.current ??= clock.elapsedTime
    const t = Math.min(1, (clock.elapsedTime - start.current) / INTRO_SECONDS)
    const ease = 1 - Math.pow(1 - t, 3)
    camera.position.lerpVectors(from, to, ease)
    camera.lookAt(TARGET)
    if (t === 1) {
      controls.current?.update()
      setDone(true)
    }
  })

  return (
    <OrbitControls
      ref={controls}
      target={TARGET}
      enabled={done}
      enablePan={false}
      enableZoom={false}
      enableDamping
      minPolarAngle={1.0}
      maxPolarAngle={1.4}
      minAzimuthAngle={0.35}
      maxAzimuthAngle={1.2}
    />
  )
}

function Decor() {
  return (
    <group>
      <pointLight position={[0.75, SIDEBOARD.levels[2] + 0.35, SIDEBOARD.z0 + 0.72]} color="#d8c8ff" intensity={1.6} distance={1.6} decay={1.5} />
      <group position={[0.28, DESK_Y, 0.22]} rotation={[0, 0.6, 0]} scale={0.6}>
        <M.Lamp />
      </group>
      <group position={[1.98, DESK_Y, 0.5]}>
        <Mug />
      </group>
      <group position={[2.2, DESK_Y, 0.22]}>
        <Headset />
      </group>
      <group position={[2.85, DESK_Y, 0.3]} rotation={[0, 0.3, 0]}>
        <GameConsole />
      </group>
      <group position={[3.95, 0, 1.45]}>
        <FloorPlant />
      </group>
      <group position={[3.2, SHELF_LEVELS[1], 0.14]}>
        <Ivy />
      </group>
      <group position={[1.6, 0, 1.15]} rotation={[0, Math.PI + 0.45, 0]}>
        <Chair />
      </group>
      <Prop model="speaker" position={[1.08, DESK_Y, 0.2]} scale={1.3} />
    </group>
  )
}
