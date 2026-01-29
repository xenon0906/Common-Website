'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ANIMATION } from '@/lib/animation-config'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          duration: ANIMATION.duration.fast,
          ease: ANIMATION.ease.standard,
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Fade-only transition for less jarring effect
export function FadeTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: ANIMATION.duration.fast,
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Slide transition for sidebar content
export function SlideTransition({
  children,
  className,
  direction = 'right'
}: PageTransitionProps & { direction?: 'left' | 'right' | 'up' | 'down' }) {
  const pathname = usePathname()

  const variants = {
    left: { initial: { x: -20 }, exit: { x: 20 } },
    right: { initial: { x: 20 }, exit: { x: -20 } },
    up: { initial: { y: -20 }, exit: { y: 20 } },
    down: { initial: { y: 20 }, exit: { y: -20 } },
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, ...variants[direction].initial }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, ...variants[direction].exit }}
        transition={{
          duration: ANIMATION.duration.normal,
          ease: ANIMATION.ease.standard,
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Staggered children animation
interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = ANIMATION.stagger.normal
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

// Stagger item that works with StaggerContainer
export function StaggerItem({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: ANIMATION.duration.fast,
            ease: ANIMATION.ease.smooth,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

// Scale-in animation for cards and modals
export function ScaleIn({
  children,
  className,
  delay = 0
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: ANIMATION.duration.fast,
        delay,
        ...ANIMATION.spring.smooth,
      }}
    >
      {children}
    </motion.div>
  )
}
