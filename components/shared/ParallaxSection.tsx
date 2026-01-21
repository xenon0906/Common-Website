'use client'

import { useRef, ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ParallaxSectionProps {
  children: ReactNode
  className?: string
  speed?: number // Negative = slower, Positive = faster
  direction?: 'up' | 'down'
}

export function ParallaxSection({
  children,
  className = '',
  speed = 0.5,
  direction = 'up',
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const factor = direction === 'up' ? -1 : 1
  const y = useTransform(scrollYProgress, [0, 1], [0, 200 * speed * factor])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  )
}

// Parallax background with foreground content
interface ParallaxBackgroundProps {
  children: ReactNode
  backgroundContent: ReactNode
  className?: string
  backgroundSpeed?: number
  minHeight?: string
}

export function ParallaxBackground({
  children,
  backgroundContent,
  className = '',
  backgroundSpeed = 0.3,
  minHeight = '100vh',
}: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 300 * backgroundSpeed])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} style={{ minHeight }}>
      {/* Background layer */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ y, scale }}
      >
        {backgroundContent}
      </motion.div>

      {/* Foreground content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// Floating elements that move on scroll
interface FloatingElementProps {
  children: ReactNode
  className?: string
  xRange?: [number, number]
  yRange?: [number, number]
  rotateRange?: [number, number]
}

export function FloatingElement({
  children,
  className = '',
  xRange = [-20, 20],
  yRange = [-30, 30],
  rotateRange = [-5, 5],
}: FloatingElementProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const x = useTransform(scrollYProgress, [0, 1], xRange)
  const y = useTransform(scrollYProgress, [0, 1], yRange)
  const rotate = useTransform(scrollYProgress, [0, 1], rotateRange)

  return (
    <motion.div ref={ref} style={{ x, y, rotate }} className={className}>
      {children}
    </motion.div>
  )
}

// Horizontal scroll section (Apple-style)
interface HorizontalScrollProps {
  children: ReactNode
  className?: string
}

export function HorizontalScroll({ children, className = '' }: HorizontalScrollProps) {
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  })

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-75%'])

  return (
    <section ref={targetRef} className={`relative h-[300vh] ${className}`}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-8 pl-[10vw]">
          {children}
        </motion.div>
      </div>
    </section>
  )
}

// Sticky reveal section
interface StickyRevealProps {
  children: ReactNode
  className?: string
  height?: string
}

export function StickyReveal({
  children,
  className = '',
  height = '200vh',
}: StickyRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8])

  return (
    <div ref={ref} className={`relative ${className}`} style={{ height }}>
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <motion.div style={{ opacity, scale }}>{children}</motion.div>
      </div>
    </div>
  )
}
