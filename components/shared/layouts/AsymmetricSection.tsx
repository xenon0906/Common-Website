'use client'

import { ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ANIMATION_CONFIG } from '@/lib/animation-config'

interface AsymmetricSectionProps {
  children: ReactNode
  index: number
  reverseOnMobile?: boolean
  contentWidth?: 'narrow' | 'wide' | 'equal'
  gap?: 'sm' | 'md' | 'lg'
  className?: string
  animate?: boolean
}

export function AsymmetricSection({
  children,
  index,
  reverseOnMobile = false,
  contentWidth = 'equal',
  gap = 'md',
  className = '',
  animate = true,
}: AsymmetricSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Odd indices: content left, visual right
  // Even indices: visual left, content right
  const isReversed = index % 2 !== 0

  const gapClasses = {
    sm: 'gap-4 md:gap-6',
    md: 'gap-6 md:gap-10',
    lg: 'gap-8 md:gap-16',
  }

  const widthClasses = {
    narrow: 'md:grid-cols-[2fr_3fr]',
    wide: 'md:grid-cols-[3fr_2fr]',
    equal: 'md:grid-cols-2',
  }

  const contentVariants = {
    hidden: { opacity: 0, x: isReversed ? 50 : -50 },
    visible: { opacity: 1, x: 0 },
  }

  const visualVariants = {
    hidden: { opacity: 0, x: isReversed ? -50 : 50 },
    visible: { opacity: 1, x: 0 },
  }

  if (!animate) {
    return (
      <div
        ref={ref}
        className={`
          grid grid-cols-1 ${widthClasses[contentWidth]} ${gapClasses[gap]}
          ${isReversed ? 'md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1' : ''}
          ${reverseOnMobile ? 'max-md:[&>*:first-child]:order-2' : ''}
          ${className}
        `}
      >
        {children}
      </div>
    )
  }

  // Convert children to array to apply animations
  const childrenArray = Array.isArray(children) ? children : [children]

  return (
    <motion.div
      ref={ref}
      className={`
        grid grid-cols-1 ${widthClasses[contentWidth]} ${gapClasses[gap]}
        ${isReversed ? 'md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1' : ''}
        ${reverseOnMobile ? 'max-md:[&>*:first-child]:order-2' : ''}
        ${className}
      `}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {childrenArray.map((child, i) => (
        <motion.div
          key={i}
          variants={i === 0 ? contentVariants : visualVariants}
          transition={{
            duration: ANIMATION_CONFIG.entrance.duration,
            delay: i * 0.2,
            ease: ANIMATION_CONFIG.entrance.ease,
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

// Alternating content section - automatically handles left/right based on index
interface AlternatingContentProps {
  content: ReactNode
  visual: ReactNode
  index: number
  className?: string
  contentClassName?: string
  visualClassName?: string
}

export function AlternatingContent({
  content,
  visual,
  index,
  className = '',
  contentClassName = '',
  visualClassName = '',
}: AlternatingContentProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const isReversed = index % 2 !== 0

  return (
    <motion.div
      ref={ref}
      className={`
        grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center
        ${className}
      `}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      {/* Content side */}
      <motion.div
        className={`
          ${isReversed ? 'md:order-2' : 'md:order-1'}
          ${contentClassName}
        `}
        initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {content}
      </motion.div>

      {/* Visual side */}
      <motion.div
        className={`
          ${isReversed ? 'md:order-1' : 'md:order-2'}
          ${visualClassName}
        `}
        initial={{ opacity: 0, x: isReversed ? -50 : 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {visual}
      </motion.div>
    </motion.div>
  )
}

// Simple asymmetric grid for cards
interface AsymmetricGridProps {
  children: ReactNode[]
  className?: string
}

export function AsymmetricGrid({ children, className = '' }: AsymmetricGridProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <div ref={ref} className={`grid gap-6 ${className}`}>
      {children.map((child, index) => {
        const isOdd = index % 2 !== 0
        return (
          <motion.div
            key={index}
            className={`
              ${isOdd ? 'md:ml-12 lg:ml-24' : 'md:mr-12 lg:mr-24'}
            `}
            initial={{ opacity: 0, x: isOdd ? 30 : -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: index * ANIMATION_CONFIG.stagger.normal,
            }}
          >
            {child}
          </motion.div>
        )
      })}
    </div>
  )
}
