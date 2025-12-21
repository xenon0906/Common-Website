'use client'

import { Suspense, useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { PhoneModel } from './PhoneModel'
import { Hand } from 'lucide-react'

interface Interactive3DPhoneProps {
  className?: string
}

export function Interactive3DPhone({ className }: Interactive3DPhoneProps) {
  const [isInteracting, setIsInteracting] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const handleInteractionStart = useCallback(() => {
    setIsInteracting(true)
    setHasInteracted(true)
  }, [])

  const handleInteractionEnd = useCallback(() => {
    setIsInteracting(false)
  }, [])

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <spotLight
            position={[-10, -10, -10]}
            angle={0.15}
            penumbra={1}
            intensity={0.5}
          />
          <directionalLight position={[0, 5, 5]} intensity={0.5} />

          {/* Phone with Float animation when not interacting */}
          <Float
            speed={isInteracting ? 0 : 2}
            rotationIntensity={isInteracting ? 0 : 0.2}
            floatIntensity={isInteracting ? 0 : 0.5}
          >
            <PhoneModel isInteracting={isInteracting} />
          </Float>

          {/* Shadow */}
          <ContactShadows
            position={[0, -2.8, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
          />

          {/* Environment for reflections */}
          <Environment preset="city" />

          {/* Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
            minAzimuthAngle={-Math.PI / 4}
            maxAzimuthAngle={Math.PI / 4}
            onStart={handleInteractionStart}
            onEnd={handleInteractionEnd}
          />
        </Suspense>
      </Canvas>

      {/* Gesture Indicator */}
      <AnimatePresence>
        {!hasInteracted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-100"
          >
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              <Hand className="w-5 h-5" />
            </motion.div>
            <span className="text-sm font-medium">Drag to explore</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-teal/10 rounded-full blur-3xl" />
      </div>
    </div>
  )
}

// Loading fallback component
export function Phone3DLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full"
      />
    </div>
  )
}
