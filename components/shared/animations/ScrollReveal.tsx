'use client'

import { useRef, ReactNode } from 'react'
import { motion, useInView, Variants } from 'framer-motion'
import { fadeInUp, fadeInDown, fadeInLeft, fadeInRight, fadeIn, scaleIn } from './variants'

type AnimationDirection = 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale'
type MarginType = `${number}px` | `${number}%` | `${number}px ${number}px` | `${number}px ${number}px ${number}px ${number}px`

interface ScrollRevealProps {
  children: ReactNode
  direction?: AnimationDirection
  delay?: number
  duration?: number
  className?: string
  once?: boolean
  margin?: MarginType
  threshold?: number
}

const directionVariants: Record<AnimationDirection, Variants> = {
  up: fadeInUp,
  down: fadeInDown,
  left: fadeInLeft,
  right: fadeInRight,
  fade: fadeIn,
  scale: scaleIn
}

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration,
  className = '',
  once = true,
  margin = '-50px' as MarginType,
  threshold = 0.1
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin, amount: threshold })

  const variants = directionVariants[direction]

  // Override duration if provided
  const customTransition = duration
    ? { duration, delay }
    : { delay }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={customTransition}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger container that reveals children sequentially
interface StaggerRevealProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  once?: boolean
  margin?: MarginType
}

export function StaggerReveal({
  children,
  className = '',
  staggerDelay = 0.03,
  once = true,
  margin = '-100px' as MarginType
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.02
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Individual stagger item
interface StaggerItemProps {
  children: ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale'
}

export function StaggerItem({
  children,
  className = '',
  direction = 'up'
}: StaggerItemProps) {
  const directionMap = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
    scale: { scale: 0.95 }
  }

  const offset = directionMap[direction]

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, ...offset },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          transition: { duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Hero reveal - immediate animation on page load
interface HeroRevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function HeroReveal({
  children,
  className = '',
  delay = 0
}: HeroRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.2,
        delay,
        ease: [0.34, 1.56, 0.64, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Section reveal with custom animation
interface SectionRevealProps {
  children: ReactNode
  className?: string
  animation?: 'fade' | 'slide' | 'scale' | 'reveal'
}

export function SectionReveal({
  children,
  className = '',
  animation = 'fade'
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const animations = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.15 } }
    },
    slide: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] } }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.15, ease: [0.34, 1.56, 0.64, 1] } }
    },
    reveal: {
      hidden: { opacity: 0, y: 15, filter: 'blur(10px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.2 } }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={animations[animation]}
      className={className}
    >
      {children}
    </motion.div>
  )
}
