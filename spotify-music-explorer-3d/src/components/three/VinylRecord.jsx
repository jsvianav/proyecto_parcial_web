import { useRef, useMemo, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { usePlayer } from '../../context/PlayerContext'

function useGrooveRings() {
  return useMemo(() => {
    const rings = []
    for (let i = 0; i < 18; i++) rings.push(0.35 + i * 0.07)
    return rings
  }, [])
}

function VinylGeometry({ texture, isPlaying }) {
  const groupRef = useRef()
  const rings = useGrooveRings()

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isPlaying ? 2 : 0.3)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main vinyl disc — slightly above pure-black so light reflections show */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.8, 1.8, 0.04, 64]} />
        <meshStandardMaterial color="#1c1c1c" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Groove rings */}
      {rings.map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.021, 0]}>
          <torusGeometry args={[r, 0.004, 6, 80]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* Center label with album art */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.005, 64]} />
        <meshStandardMaterial map={texture} metalness={0.1} roughness={0.8} />
      </mesh>

      {/* Center hole */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.06, 32]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  )
}

function RemoteTextureVinyl({ imageUrl, isPlaying }) {
  const texture = useLoader(THREE.TextureLoader, imageUrl, (loader) => {
    loader.crossOrigin = 'anonymous'
  })
  return <VinylGeometry texture={texture} isPlaying={isPlaying} />
}

function FallbackVinyl({ isPlaying }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    gradient.addColorStop(0, '#1DB954')
    gradient.addColorStop(1, '#0a5c26')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 256, 256)
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 80px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('🎵', 128, 128)
    return new THREE.CanvasTexture(canvas)
  }, [])

  return <VinylGeometry texture={texture} isPlaying={isPlaying} />
}

export default function VinylRecord({ imageUrl }) {
  const { isPlaying } = usePlayer()

  if (imageUrl) {
    return (
      <Suspense fallback={<FallbackVinyl isPlaying={isPlaying} />}>
        <RemoteTextureVinyl imageUrl={imageUrl} isPlaying={isPlaying} />
      </Suspense>
    )
  }

  return <FallbackVinyl isPlaying={isPlaying} />
}
