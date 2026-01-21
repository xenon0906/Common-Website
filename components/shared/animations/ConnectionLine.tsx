'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import { ANIMATION_CONFIG } from '@/lib/animation-config'

interface ConnectionLineProps {
  direction?: 'horizontal' | 'vertical' | 'diagonal'
  progress?: MotionValue<number>
  color?: string
  thickness?: number
  arrowHead?: boolean
  length?: string
  className?: string
  animated?: boolean
  delay?: number
}

export function ConnectionLine({
  direction = 'horizontal',
  progress,
  color = 'currentColor',
  thickness = 2,
  arrowHead = true,
  length = '100%',
  className = '',
  animated = true,
  delay = 0,
}: ConnectionLineProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Use internal scroll progress if none provided
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center'],
  })

  const pathProgress = progress || scrollYProgress
  const pathLength = useTransform(pathProgress, [0, 1], [0, 1])

  // Calculate dimensions based on direction
  const isHorizontal = direction === 'horizontal'
  const isVertical = direction === 'vertical'

  const svgWidth = isHorizontal ? length : `${thickness + 10}px`
  const svgHeight = isVertical ? length : `${thickness + 10}px`

  // Path definition
  const getPath = () => {
    if (isHorizontal) {
      return `M 0 ${thickness / 2 + 5} L 100 ${thickness / 2 + 5}`
    } else if (isVertical) {
      return `M ${thickness / 2 + 5} 0 L ${thickness / 2 + 5} 100`
    } else {
      // Diagonal
      return `M 0 0 L 100 100`
    }
  }

  // Arrow head path
  const getArrowPath = () => {
    if (isHorizontal) {
      return `M 95 ${thickness / 2} L 100 ${thickness / 2 + 5} L 95 ${thickness / 2 + 10}`
    } else if (isVertical) {
      return `M ${thickness / 2} 95 L ${thickness / 2 + 5} 100 L ${thickness / 2 + 10} 95`
    } else {
      return `M 92 98 L 100 100 L 98 92`
    }
  }

  if (!animated) {
    return (
      <div
        className={`${className}`}
        style={{
          width: isHorizontal ? length : thickness,
          height: isVertical ? length : thickness,
          backgroundColor: color,
          opacity: 0.3,
        }}
      />
    )
  }

  return (
    <div ref={containerRef} className={className}>
      <svg
        className="overflow-visible"
        width={svgWidth}
        height={svgHeight}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ opacity: 0.6 }}
      >
        {/* Background line (subtle) */}
        <motion.path
          d={getPath()}
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="none"
          opacity={0.2}
          vectorEffect="non-scaling-stroke"
        />

        {/* Animated line */}
        <motion.path
          d={getPath()}
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="none"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength }}
          initial={{ pathLength: 0 }}
          transition={{
            duration: ANIMATION_CONFIG.connectionLine.duration,
            ease: ANIMATION_CONFIG.connectionLine.ease,
            delay,
          }}
        />

        {/* Arrow head */}
        {arrowHead && (
          <motion.path
            d={getArrowPath()}
            stroke={color}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            vectorEffect="non-scaling-stroke"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: ANIMATION_CONFIG.connectionLine.duration + delay }}
          />
        )}
      </svg>
    </div>
  )
}

// Simpler dashed connection line
interface DashedLineProps {
  direction?: 'horizontal' | 'vertical'
  length?: string
  color?: string
  className?: string
}

export function DashedLine({
  direction = 'horizontal',
  length = '100%',
  color = 'currentColor',
  className = '',
}: DashedLineProps) {
  const isHorizontal = direction === 'horizontal'

  return (
    <motion.div
      className={`${className}`}
      style={{
        width: isHorizontal ? length : '2px',
        height: isHorizontal ? '2px' : length,
        background: `repeating-linear-gradient(
          ${isHorizontal ? '90deg' : '180deg'},
          ${color} 0,
          ${color} 8px,
          transparent 8px,
          transparent 16px
        )`,
      }}
      initial={{ scaleX: isHorizontal ? 0 : 1, scaleY: isHorizontal ? 1 : 0 }}
      whileInView={{ scaleX: 1, scaleY: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    />
  )
}

// Flowing gradient line
interface FlowingLineProps {
  direction?: 'horizontal' | 'vertical'
  length?: string
  className?: string
}

export function FlowingLine({
  direction = 'horizontal',
  length = '100%',
  className = '',
}: FlowingLineProps) {
  const isHorizontal = direction === 'horizontal'

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      style={{
        width: isHorizontal ? length : '3px',
        height: isHorizontal ? '3px' : length,
        background: 'rgba(78, 205, 196, 0.2)',
        borderRadius: '2px',
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: isHorizontal
            ? 'linear-gradient(90deg, transparent, rgba(78, 205, 196, 0.8), transparent)'
            : 'linear-gradient(180deg, transparent, rgba(78, 205, 196, 0.8), transparent)',
          width: isHorizontal ? '50%' : '100%',
          height: isHorizontal ? '100%' : '50%',
        }}
        animate={{
          x: isHorizontal ? ['0%', '200%'] : 0,
          y: isHorizontal ? 0 : ['0%', '200%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </motion.div>
  )
}
