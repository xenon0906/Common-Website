'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Html } from '@react-three/drei'
import * as THREE from 'three'

interface PhoneModelProps {
  isInteracting: boolean
}

export function PhoneModel({ isInteracting }: PhoneModelProps) {
  const phoneRef = useRef<THREE.Group>(null)
  const [screenImage] = useState('/images/mockups/app-screen-1.png')

  // Auto-rotation when not interacting
  useFrame((state, delta) => {
    if (phoneRef.current && !isInteracting) {
      // Gentle floating animation
      phoneRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      // Slow auto-rotation
      phoneRef.current.rotation.y += delta * 0.15
    }
  })

  return (
    <group ref={phoneRef} position={[0, 0, 0]}>
      {/* Phone Body - Generic Premium Style */}
      <RoundedBox
        args={[2.2, 4.5, 0.25]}
        radius={0.15}
        smoothness={4}
        position={[0, 0, 0]}
      >
        <meshPhysicalMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </RoundedBox>

      {/* Screen Bezel */}
      <RoundedBox
        args={[2.0, 4.3, 0.02]}
        radius={0.12}
        smoothness={4}
        position={[0, 0, 0.13]}
      >
        <meshStandardMaterial color="#0a0a0a" />
      </RoundedBox>

      {/* Screen */}
      <RoundedBox
        args={[1.9, 4.1, 0.01]}
        radius={0.1}
        smoothness={4}
        position={[0, 0, 0.14]}
      >
        <meshBasicMaterial color="#0e4493" />
      </RoundedBox>

      {/* Screen Content - App UI Mock */}
      <Html
        transform
        occlude
        position={[0, 0, 0.15]}
        rotation={[0, 0, 0]}
        scale={0.23}
        style={{
          width: '375px',
          height: '812px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, #0e4493 0%, #0a3577 100%)',
            borderRadius: '40px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '60px 20px 40px',
            color: 'white',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Status Bar */}
          <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '14px',
            marginBottom: '40px',
            padding: '0 10px',
          }}>
            <span>9:41</span>
            <span>100%</span>
          </div>

          {/* Logo Area */}
          <div style={{
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '20px',
            letterSpacing: '1px',
          }}>
            Snapgo
          </div>

          {/* Tagline */}
          <div style={{
            fontSize: '14px',
            opacity: 0.9,
            marginBottom: '40px',
            textAlign: 'center',
          }}>
            Shared Mobility, Simplified
          </div>

          {/* Mock Map Area */}
          <div style={{
            width: '90%',
            height: '200px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              background: '#0d9488',
              borderRadius: '50%',
              boxShadow: '0 0 20px rgba(13,148,136,0.8)',
            }} />
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '15px',
            marginBottom: '30px',
          }}>
            <div style={{
              padding: '15px 25px',
              background: 'white',
              color: '#0e4493',
              borderRadius: '30px',
              fontSize: '14px',
              fontWeight: '600',
            }}>
              Book Now
            </div>
            <div style={{
              padding: '15px 25px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '30px',
              fontSize: '14px',
              fontWeight: '500',
              border: '1px solid rgba(255,255,255,0.3)',
            }}>
              Schedule
            </div>
          </div>

          {/* Bottom Stats */}
          <div style={{
            display: 'flex',
            gap: '30px',
            marginTop: 'auto',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>7K+</div>
              <div style={{ fontSize: '11px', opacity: 0.7 }}>Downloads</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>75%</div>
              <div style={{ fontSize: '11px', opacity: 0.7 }}>Savings</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>400+</div>
              <div style={{ fontSize: '11px', opacity: 0.7 }}>Users</div>
            </div>
          </div>
        </div>
      </Html>

      {/* Camera Notch */}
      <mesh position={[0, 2.0, 0.14]}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Side Button */}
      <RoundedBox
        args={[0.05, 0.4, 0.08]}
        radius={0.02}
        smoothness={2}
        position={[1.15, 0.5, 0]}
      >
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
      </RoundedBox>

      {/* Volume Buttons */}
      <RoundedBox
        args={[0.05, 0.25, 0.08]}
        radius={0.02}
        smoothness={2}
        position={[-1.15, 0.7, 0]}
      >
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
      </RoundedBox>
      <RoundedBox
        args={[0.05, 0.25, 0.08]}
        radius={0.02}
        smoothness={2}
        position={[-1.15, 0.3, 0]}
      >
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
      </RoundedBox>
    </group>
  )
}
