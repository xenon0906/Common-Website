'use client'

import { useRef, ReactNode } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

interface ParallaxWrapperProps {
  children: ReactNode
  className?: string
  speed?: number // negative = slower, positive = faster
  offset?: [number, number] // [start, end] in pixels
}

export function ParallaxWrapper({
  children,
  className = '',
  speed = 0.5,
  offset = [0, 300]
}: ParallaxWrapperProps) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], [offset[0], offset[1] * speed])
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      ref={ref}
      style={{ y: smoothY }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Parallax section with background/foreground layers
interface ParallaxSectionProps {
  children: ReactNode
  className?: string
  backgroundSpeed?: number
  foregroundSpeed?: number
}

export function ParallaxSection({
  children,
  className = '',
  backgroundSpeed = 0.3,
  foregroundSpeed = 0.1
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 150 * backgroundSpeed])
  const foregroundY = useTransform(scrollYProgress, [0, 1], [0, 50 * foregroundSpeed])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      >
        {/* Background layer - pass as children or slots */}
      </motion.div>
      <motion.div
        className="relative z-10"
        style={{ y: foregroundY }}
      >
        {children}
      </motion.div>
    </div>
  )
}

// Floating orb decoration with parallax
interface FloatingOrbProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'teal' | 'purple' | 'blue' | 'gradient'
  blur?: boolean
  speed?: number
}

export function FloatingOrb({
  className = '',
  size = 'md',
  color = 'teal',
  blur = true,
  speed = 0.5
}: FloatingOrbProps) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200 * speed])
  const smoothY = useSpring(y, { stiffness: 50, damping: 20 })

  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
    xl: 'w-96 h-96'
  }

  const colorClasses = {
    teal: 'bg-teal/30',
    purple: 'bg-purple/30',
    blue: 'bg-primary/30',
    gradient: 'bg-gradient-to-br from-teal/30 via-primary/30 to-purple/30'
  }

  return (
    <motion.div
      ref={ref}
      style={{ y: smoothY }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 0.8, 0.5]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={`
        ${sizeClasses[size]}
        ${colorClasses[color]}
        rounded-full
        ${blur ? 'blur-3xl' : ''}
        pointer-events-none
        ${className}
      `}
    />
  )
}

// Scale on scroll
interface ScaleOnScrollProps {
  children: ReactNode
  className?: string
  startScale?: number
  endScale?: number
}

export function ScaleOnScroll({
  children,
  className = '',
  startScale = 0.95,
  endScale = 1
}: ScaleOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center']
  })

  const scale = useTransform(scrollYProgress, [0, 1], [startScale, endScale])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.5, 1])

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Rotate on scroll
interface RotateOnScrollProps {
  children: ReactNode
  className?: string
  startRotate?: number
  endRotate?: number
}

export function RotateOnScroll({
  children,
  className = '',
  startRotate = -5,
  endRotate = 0
}: RotateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center']
  })

  const rotate = useTransform(scrollYProgress, [0, 1], [startRotate, endRotate])

  return (
    <motion.div
      ref={ref}
      style={{ rotate }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Horizontal scroll on vertical scroll
interface HorizontalScrollProps {
  children: ReactNode
  className?: string
  distance?: number
}

export function HorizontalScroll({
  children,
  className = '',
  distance = 200
}: HorizontalScrollProps) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])

  return (
    <motion.div
      ref={ref}
      style={{ x }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
