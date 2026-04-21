import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Sparkles } from '@react-three/drei'
import VinylRecord from './VinylRecord'
import ReflectiveFloor from './ReflectiveFloor'

function SceneLoader() {
  return (
    <mesh>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color="#1DB954" wireframe />
    </mesh>
  )
}

export default function VinylScene({ imageUrl, showSparkles = false }) {
  return (
    <Canvas
      camera={{ position: [0, 2.5, 5], fov: 50 }}
      gl={{ antialias: true }}
      shadows
    >
      {/* Base ambient so nothing is pure-black */}
      <ambientLight intensity={1.2} />

      {/* Main key light (warm white from upper-right) */}
      <directionalLight
        position={[4, 6, 4]}
        intensity={2.5}
        color="#ffffff"
        castShadow
      />

      {/* Fill light (cool tone, opposite side) */}
      <directionalLight
        position={[-4, 3, -4]}
        intensity={1.2}
        color="#8888ff"
      />

      {/* Spotify green rim light from below */}
      <pointLight position={[0, -1, 3]} intensity={3} color="#1DB954" distance={10} />

      {/* Top spotlight to show vinyl surface */}
      <spotLight
        position={[0, 6, 2]}
        angle={0.5}
        penumbra={0.8}
        intensity={4}
        color="#ffffff"
        castShadow
      />

      <Suspense fallback={<SceneLoader />}>
        <VinylRecord imageUrl={imageUrl} />
        <ReflectiveFloor />
        {/* "warehouse" provides neutral bright ambient without being too harsh */}
        <Environment preset="warehouse" />
        {showSparkles && (
          <Sparkles
            count={80}
            scale={6}
            size={1.5}
            speed={0.4}
            color="#1DB954"
            opacity={0.6}
          />
        )}
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
      />
    </Canvas>
  )
}
