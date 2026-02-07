import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky, Cloud, Html, Float } from '@react-three/drei'
import { Suspense, useState, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

// Game state types
interface WheatPlot {
  id: number
  position: [number, number, number]
  growthStage: number // 0-3
  planted: boolean
}

// Low-poly Barn
function Barn({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Main barn body */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 3, 6]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 3.5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <coneGeometry args={[3.5, 2, 4]} />
        <meshStandardMaterial color="#5C3317" />
      </mesh>
      {/* Door */}
      <mesh position={[0, 1, 3.01]}>
        <boxGeometry args={[1.5, 2, 0.1]} />
        <meshStandardMaterial color="#3D2314" />
      </mesh>
      {/* Windows */}
      <mesh position={[-1.5, 2, 3.01]}>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        <meshStandardMaterial color="#FFE4B5" emissive="#FFD700" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[1.5, 2, 3.01]}>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        <meshStandardMaterial color="#FFE4B5" emissive="#FFD700" emissiveIntensity={0.3} />
      </mesh>
      {/* Silo */}
      <mesh position={[3.5, 2, 0]} castShadow>
        <cylinderGeometry args={[1, 1, 4, 8]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>
      <mesh position={[3.5, 4.5, 0]} castShadow>
        <coneGeometry args={[1.2, 1, 8]} />
        <meshStandardMaterial color="#5C3317" />
      </mesh>
    </group>
  )
}

// Low-poly Tree
function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 2, 6]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Foliage layers */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[1.2, 2, 6]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      <mesh position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[0.9, 1.5, 6]} />
        <meshStandardMaterial color="#32CD32" />
      </mesh>
      <mesh position={[0, 4.3, 0]} castShadow>
        <coneGeometry args={[0.5, 1, 6]} />
        <meshStandardMaterial color="#3CB371" />
      </mesh>
    </group>
  )
}

// Animated Cow
function Cow({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null!)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Body */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[1.2, 0.8, 0.7]} />
        <meshStandardMaterial color={hovered ? "#FFFAFA" : "#F5F5F5"} />
      </mesh>
      {/* Spots */}
      <mesh position={[0.3, 0.7, 0.36]}>
        <sphereGeometry args={[0.15, 6, 6]} />
        <meshStandardMaterial color="#2F2F2F" />
      </mesh>
      <mesh position={[-0.2, 0.5, 0.36]}>
        <sphereGeometry args={[0.12, 6, 6]} />
        <meshStandardMaterial color="#2F2F2F" />
      </mesh>
      {/* Head */}
      <mesh position={[0.7, 0.7, 0]} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.5]} />
        <meshStandardMaterial color="#F5F5F5" />
      </mesh>
      {/* Snout */}
      <mesh position={[0.95, 0.6, 0]}>
        <boxGeometry args={[0.15, 0.2, 0.35]} />
        <meshStandardMaterial color="#FFB6C1" />
      </mesh>
      {/* Legs */}
      {[[-0.35, 0.2, 0.2], [-0.35, 0.2, -0.2], [0.35, 0.2, 0.2], [0.35, 0.2, -0.2]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.15, 0.4, 0.15]} />
          <meshStandardMaterial color="#F5F5F5" />
        </mesh>
      ))}
      {/* Ears */}
      <mesh position={[0.75, 0.95, 0.2]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.1, 0.15, 0.08]} />
        <meshStandardMaterial color="#FFB6C1" />
      </mesh>
      <mesh position={[0.75, 0.95, -0.2]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.1, 0.15, 0.08]} />
        <meshStandardMaterial color="#FFB6C1" />
      </mesh>
      {hovered && (
        <Html position={[0, 1.5, 0]} center>
          <div className="bg-amber-100 px-2 py-1 rounded-lg text-xs font-bold text-amber-800 whitespace-nowrap shadow-lg border-2 border-amber-300">
            Moo! 🐄
          </div>
        </Html>
      )}
    </group>
  )
}

// Animated Chicken
function Chicken({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null!)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 3) * 0.3
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 3) > 0 ? 0 : Math.PI
    }
  })

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Body */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshStandardMaterial color={hovered ? "#FFFAF0" : "#F5DEB3"} />
      </mesh>
      {/* Head */}
      <mesh position={[0.2, 0.45, 0]} castShadow>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#F5DEB3" />
      </mesh>
      {/* Beak */}
      <mesh position={[0.35, 0.42, 0]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.04, 0.1, 4]} />
        <meshStandardMaterial color="#FFA500" />
      </mesh>
      {/* Comb */}
      <mesh position={[0.2, 0.58, 0]}>
        <boxGeometry args={[0.08, 0.08, 0.03]} />
        <meshStandardMaterial color="#FF4500" />
      </mesh>
      {/* Tail */}
      <mesh position={[-0.25, 0.35, 0]} rotation={[0, 0, 0.5]}>
        <coneGeometry args={[0.08, 0.2, 4]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Legs */}
      <mesh position={[0.05, 0.05, 0.05]}>
        <cylinderGeometry args={[0.02, 0.02, 0.1, 4]} />
        <meshStandardMaterial color="#FFA500" />
      </mesh>
      <mesh position={[0.05, 0.05, -0.05]}>
        <cylinderGeometry args={[0.02, 0.02, 0.1, 4]} />
        <meshStandardMaterial color="#FFA500" />
      </mesh>
      {hovered && (
        <Html position={[0, 0.8, 0]} center>
          <div className="bg-amber-100 px-2 py-1 rounded-lg text-xs font-bold text-amber-800 whitespace-nowrap shadow-lg border-2 border-amber-300">
            Cluck! 🐔
          </div>
        </Html>
      )}
    </group>
  )
}

// Animated Pig
function Pig({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null!)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.z = position[2] + Math.sin(state.clock.elapsedTime * 1.5) * 0.5
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.5) > 0 ? Math.PI / 2 : -Math.PI / 2
    }
  })

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Body */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.8, 0.5, 0.5]} />
        <meshStandardMaterial color={hovered ? "#FFB6C1" : "#FFC0CB"} />
      </mesh>
      {/* Head */}
      <mesh position={[0.5, 0.45, 0]} castShadow>
        <boxGeometry args={[0.35, 0.35, 0.4]} />
        <meshStandardMaterial color="#FFC0CB" />
      </mesh>
      {/* Snout */}
      <mesh position={[0.7, 0.4, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.1, 8]} />
        <meshStandardMaterial color="#FF69B4" />
      </mesh>
      {/* Ears */}
      <mesh position={[0.45, 0.65, 0.12]} rotation={[0.3, 0, 0.3]}>
        <boxGeometry args={[0.1, 0.15, 0.05]} />
        <meshStandardMaterial color="#FF69B4" />
      </mesh>
      <mesh position={[0.45, 0.65, -0.12]} rotation={[-0.3, 0, 0.3]}>
        <boxGeometry args={[0.1, 0.15, 0.05]} />
        <meshStandardMaterial color="#FF69B4" />
      </mesh>
      {/* Legs */}
      {[[-0.25, 0.12, 0.15], [-0.25, 0.12, -0.15], [0.2, 0.12, 0.15], [0.2, 0.12, -0.15]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.1, 0.25, 0.1]} />
          <meshStandardMaterial color="#FFC0CB" />
        </mesh>
      ))}
      {/* Curly tail */}
      <mesh position={[-0.45, 0.5, 0]} rotation={[0, 0, 0.5]}>
        <torusGeometry args={[0.06, 0.02, 8, 16, Math.PI * 1.5]} />
        <meshStandardMaterial color="#FF69B4" />
      </mesh>
      {hovered && (
        <Html position={[0, 1, 0]} center>
          <div className="bg-pink-100 px-2 py-1 rounded-lg text-xs font-bold text-pink-800 whitespace-nowrap shadow-lg border-2 border-pink-300">
            Oink! 🐷
          </div>
        </Html>
      )}
    </group>
  )
}

// Wheat crop at different growth stages
function WheatCrop({
  position,
  growthStage,
  onClick,
  planted
}: {
  position: [number, number, number]
  growthStage: number
  onClick: () => void
  planted: boolean
}) {
  const [hovered, setHovered] = useState(false)

  const getWheatColor = () => {
    switch (growthStage) {
      case 0: return "#8B4513" // Soil
      case 1: return "#90EE90" // Sprout
      case 2: return "#32CD32" // Growing
      case 3: return "#DAA520" // Ready
      default: return "#8B4513"
    }
  }

  const getWheatHeight = () => {
    switch (growthStage) {
      case 0: return 0.05
      case 1: return 0.3
      case 2: return 0.6
      case 3: return 0.9
      default: return 0.05
    }
  }

  return (
    <group
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Soil plot */}
      <mesh position={[0, 0.025, 0]} receiveShadow>
        <boxGeometry args={[0.9, 0.05, 0.9]} />
        <meshStandardMaterial color={hovered ? "#A0522D" : "#654321"} />
      </mesh>

      {planted && growthStage > 0 && (
        <>
          {/* Wheat stalks */}
          {[[-0.2, 0, -0.2], [0.2, 0, -0.2], [-0.2, 0, 0.2], [0.2, 0, 0.2], [0, 0, 0]].map((pos, i) => (
            <group key={i} position={pos as [number, number, number]}>
              <mesh position={[0, getWheatHeight() / 2 + 0.05, 0]} castShadow>
                <cylinderGeometry args={[0.02, 0.03, getWheatHeight(), 6]} />
                <meshStandardMaterial color={getWheatColor()} />
              </mesh>
              {growthStage >= 3 && (
                <mesh position={[0, getWheatHeight() + 0.1, 0]} castShadow>
                  <sphereGeometry args={[0.06, 6, 6]} />
                  <meshStandardMaterial color="#DAA520" />
                </mesh>
              )}
            </group>
          ))}
        </>
      )}

      {hovered && (
        <Html position={[0, 1.2, 0]} center>
          <div className="bg-amber-50 px-3 py-2 rounded-xl text-xs font-bold text-amber-900 whitespace-nowrap shadow-xl border-2 border-amber-400">
            {!planted ? "Click to plant! 🌱" :
             growthStage === 0 ? "Planting..." :
             growthStage === 3 ? "Ready! Click to harvest! 🌾" :
             `Growing... Stage ${growthStage}/3`}
          </div>
        </Html>
      )}
    </group>
  )
}

// Fence
function Fence({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Posts */}
      <mesh position={[-0.4, 0.3, 0]} castShadow>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0.4, 0.3, 0]} castShadow>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Rails */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.9, 0.08, 0.05]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.9, 0.08, 0.05]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>
    </group>
  )
}

// Ground
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#7CFC00" />
    </mesh>
  )
}

// Farm field area
function FarmField({ position }: { position: [number, number, number] }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position} receiveShadow>
      <planeGeometry args={[6, 6]} />
      <meshStandardMaterial color="#8B4513" />
    </mesh>
  )
}

// Main Scene
function FarmScene({
  wheatPlots,
  onPlotClick
}: {
  wheatPlots: WheatPlot[]
  onPlotClick: (id: number) => void
}) {
  return (
    <>
      <Sky sunPosition={[100, 20, 100]} />
      <Cloud position={[-10, 15, -10]} speed={0.2} opacity={0.7} />
      <Cloud position={[10, 12, 5]} speed={0.3} opacity={0.5} />
      <Cloud position={[0, 14, -15]} speed={0.25} opacity={0.6} />

      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <hemisphereLight args={['#87CEEB', '#7CFC00', 0.3]} />

      <Ground />

      {/* Barn */}
      <Barn position={[-8, 0, -5]} />

      {/* Farm field */}
      <FarmField position={[3, 0.01, 3]} />

      {/* Wheat plots in a grid */}
      {wheatPlots.map((plot) => (
        <WheatCrop
          key={plot.id}
          position={plot.position}
          growthStage={plot.growthStage}
          planted={plot.planted}
          onClick={() => onPlotClick(plot.id)}
        />
      ))}

      {/* Trees around the farm */}
      <Tree position={[-12, 0, 8]} scale={1.2} />
      <Tree position={[-10, 0, 10]} scale={0.9} />
      <Tree position={[12, 0, -8]} scale={1.1} />
      <Tree position={[10, 0, -10]} scale={0.8} />
      <Tree position={[14, 0, 5]} scale={1.3} />
      <Tree position={[-5, 0, 12]} scale={1} />
      <Tree position={[8, 0, 12]} scale={1.1} />

      {/* Animals */}
      <Float speed={1} rotationIntensity={0} floatIntensity={0.2}>
        <Cow position={[-4, 0, -8]} />
      </Float>
      <Float speed={1.2} rotationIntensity={0} floatIntensity={0.2}>
        <Cow position={[-2, 0, -10]} />
      </Float>
      <Chicken position={[-6, 0, 2]} />
      <Chicken position={[-7, 0, 3]} />
      <Chicken position={[-5.5, 0, 3.5]} />
      <Pig position={[8, 0, -3]} />
      <Pig position={[10, 0, -2]} />

      {/* Fences */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Fence key={`fence-x-${i}`} position={[-6 + i, 0, -12]} />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <Fence key={`fence-z-${i}`} position={[-6, 0, -12 + i]} rotation={Math.PI / 2} />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <Fence key={`fence-z2-${i}`} position={[2, 0, -12 + i]} rotation={Math.PI / 2} />
      ))}

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={30}
        maxPolarAngle={Math.PI / 2.1}
      />
    </>
  )
}

// UI Components
function GameUI({
  wheat,
  seeds,
  onBuySeeds
}: {
  wheat: number
  seeds: number
  onBuySeeds: () => void
}) {
  return (
    <div className="absolute top-4 left-4 right-4 md:right-auto flex flex-col gap-3 z-10">
      {/* Stats Card */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-4 md:p-5 shadow-xl border-4 border-amber-300 backdrop-blur-sm max-w-xs">
        <h2 className="font-display text-xl md:text-2xl text-amber-900 mb-3 tracking-tight">
          🌾 Farm Stats
        </h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-white/60 rounded-xl px-3 py-2">
            <span className="font-body text-amber-800 text-sm md:text-base">Wheat</span>
            <span className="font-display text-lg md:text-xl text-amber-900">{wheat}</span>
          </div>
          <div className="flex items-center justify-between bg-white/60 rounded-xl px-3 py-2">
            <span className="font-body text-amber-800 text-sm md:text-base">Seeds</span>
            <span className="font-display text-lg md:text-xl text-amber-900">{seeds}</span>
          </div>
        </div>
      </div>

      {/* Shop Card */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-4 md:p-5 shadow-xl border-4 border-emerald-300 backdrop-blur-sm max-w-xs">
        <h2 className="font-display text-xl md:text-2xl text-emerald-900 mb-3 tracking-tight">
          🏪 Shop
        </h2>
        <button
          onClick={onBuySeeds}
          disabled={wheat < 2}
          className={`w-full py-3 px-4 rounded-xl font-display text-base md:text-lg transition-all duration-300 ${
            wheat >= 2
              ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Buy Seeds (2 🌾)
        </button>
        <p className="text-xs md:text-sm text-emerald-700 mt-2 font-body text-center">
          Trade wheat for more seeds!
        </p>
      </div>
    </div>
  )
}

function Instructions() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="absolute bottom-20 md:bottom-16 right-4 z-10 max-w-xs">
      <div
        className={`bg-gradient-to-br from-sky-50 to-blue-100 rounded-2xl shadow-xl border-4 border-sky-300 backdrop-blur-sm overflow-hidden transition-all duration-300 ${
          collapsed ? 'p-3' : 'p-4 md:p-5'
        }`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-between w-full"
        >
          <h2 className="font-display text-lg md:text-xl text-sky-900 tracking-tight">
            📖 How to Play
          </h2>
          <span className="text-sky-600 text-xl">{collapsed ? '+' : '−'}</span>
        </button>
        {!collapsed && (
          <ul className="mt-3 space-y-2 text-xs md:text-sm text-sky-800 font-body">
            <li className="flex items-start gap-2">
              <span>🌱</span>
              <span>Click empty soil to plant wheat</span>
            </li>
            <li className="flex items-start gap-2">
              <span>⏳</span>
              <span>Wait for wheat to grow (3 stages)</span>
            </li>
            <li className="flex items-start gap-2">
              <span>🌾</span>
              <span>Click golden wheat to harvest</span>
            </li>
            <li className="flex items-start gap-2">
              <span>🐄</span>
              <span>Hover over animals to say hi!</span>
            </li>
            <li className="flex items-start gap-2">
              <span>🔄</span>
              <span>Drag to orbit, scroll to zoom</span>
            </li>
          </ul>
        )}
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="absolute bottom-2 md:bottom-4 left-0 right-0 text-center z-10">
      <p className="font-body text-xs text-amber-800/50 tracking-wide">
        Requested by <span className="font-semibold">@0xPaulius</span> · Built by <span className="font-semibold">@clonkbot</span>
      </p>
    </footer>
  )
}

// Main App
export default function App() {
  const [wheat, setWheat] = useState(0)
  const [seeds, setSeeds] = useState(5)

  const [wheatPlots, setWheatPlots] = useState<WheatPlot[]>(() => {
    const plots: WheatPlot[] = []
    let id = 0
    for (let x = 0; x < 5; x++) {
      for (let z = 0; z < 5; z++) {
        plots.push({
          id: id++,
          position: [x + 0.5, 0.05, z + 0.5],
          growthStage: 0,
          planted: false
        })
      }
    }
    return plots
  })

  // Growth timer
  const growthInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  const startGrowth = useCallback(() => {
    if (growthInterval.current) return

    growthInterval.current = setInterval(() => {
      setWheatPlots(prev => prev.map(plot => {
        if (plot.planted && plot.growthStage < 3) {
          return { ...plot, growthStage: plot.growthStage + 1 }
        }
        return plot
      }))
    }, 3000)
  }, [])

  // Start growth on mount
  useState(() => {
    startGrowth()
  })

  const handlePlotClick = useCallback((id: number) => {
    setWheatPlots(prev => prev.map(plot => {
      if (plot.id !== id) return plot

      // Plant if not planted and has seeds
      if (!plot.planted && seeds > 0) {
        setSeeds(s => s - 1)
        return { ...plot, planted: true, growthStage: 1 }
      }

      // Harvest if ready
      if (plot.planted && plot.growthStage === 3) {
        setWheat(w => w + 3)
        return { ...plot, planted: false, growthStage: 0 }
      }

      return plot
    }))
  }, [seeds])

  const handleBuySeeds = useCallback(() => {
    if (wheat >= 2) {
      setWheat(w => w - 2)
      setSeeds(s => s + 3)
    }
  }, [wheat])

  return (
    <div className="w-screen h-dvh bg-gradient-to-b from-sky-300 via-sky-200 to-amber-100 relative overflow-hidden">
      {/* Decorative grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <Canvas
        shadows
        camera={{ position: [15, 12, 15], fov: 50 }}
        className="touch-none"
      >
        <Suspense fallback={null}>
          <FarmScene wheatPlots={wheatPlots} onPlotClick={handlePlotClick} />
        </Suspense>
      </Canvas>

      <GameUI wheat={wheat} seeds={seeds} onBuySeeds={handleBuySeeds} />
      <Instructions />
      <Footer />
    </div>
  )
}
