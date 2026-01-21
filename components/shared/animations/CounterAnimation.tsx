'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useTransform, useInView } from 'framer-motion'
import { ANIMATION_CONFIG } from '@/lib/animation-config'

interface CounterAnimationProps {
  value: number
  duration?: number
  delay?: number
  prefix?: string
  suffix?: string
  className?: string
  triggerOnView?: boolean
}

export function CounterAnimation({
  value,
  duration = ANIMATION_CONFIG.counter.duration,
  delay = 0,
  prefix = '',
  suffix = '',
  className = '',
  triggerOnView = true,
}: CounterAnimationProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [hasStarted, setHasStarted] = useState(!triggerOnView)

  const spring = useSpring(0, {
    ...ANIMATION_CONFIG.counter.spring,
    duration: duration * 1000,
  })

  const display = useTransform(spring, (current) => Math.round(current))
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (triggerOnView && isInView && !hasStarted) {
      const timer = setTimeout(() => {
        setHasStarted(true)
      }, delay * 1000)
      return () => clearTimeout(timer)
    }
  }, [isInView, triggerOnView, delay, hasStarted])

  useEffect(() => {
    if (hasStarted) {
      spring.set(value)
    }
  }, [hasStarted, value, spring])

  useEffect(() => {
    const unsubscribe = display.on('change', (v) => {
      setDisplayValue(v)
    })
    return () => unsubscribe()
  }, [display])

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={hasStarted ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.3, delay: delay }}
    >
      {prefix}{displayValue}{suffix}
    </motion.span>
  )
}

// Simple step counter (1, 2, 3, 4...)
interface StepCounterProps {
  step: number
  isActive: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'teal' | 'primary' | 'purple'
  className?: string
}

export function StepCounter({
  step,
  isActive,
  size = 'md',
  color = 'teal',
  className = '',
}: StepCounterProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  }

  const colorClasses = {
    teal: {
      active: 'bg-teal text-white shadow-teal/50',
      inactive: 'bg-teal/20 text-teal',
    },
    primary: {
      active: 'bg-primary text-white shadow-primary/50',
      inactive: 'bg-primary/20 text-primary',
    },
    purple: {
      active: 'bg-purple text-white shadow-purple/50',
      inactive: 'bg-purple/20 text-purple',
    },
  }

  return (
    <motion.div
      className={`
        ${sizeClasses[size]}
        ${isActive ? colorClasses[color].active : colorClasses[color].inactive}
        rounded-full flex items-center justify-center font-bold
        transition-colors duration-300
        ${isActive ? 'shadow-lg' : ''}
        ${className}
      `}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      whileHover={{ scale: 1.1 }}
    >
      <motion.span
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {step}
      </motion.span>
    </motion.div>
  )
}
