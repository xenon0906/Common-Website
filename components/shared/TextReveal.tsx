'use client'

import { useRef, ReactNode } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

// Character-by-character reveal
interface TextRevealProps {
  text: string
  className?: string
  delay?: number
  staggerDelay?: number
  once?: boolean
}

export function TextReveal({
  text,
  className = '',
  delay = 0,
  staggerDelay = 0.03,
  once = true,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: '-10% 0px' })

  const characters = text.split('')

  return (
    <span ref={ref} className={className}>
      {characters.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.4,
            delay: delay + index * staggerDelay,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

// Word-by-word reveal
interface WordRevealProps {
  text: string
  className?: string
  delay?: number
  staggerDelay?: number
  once?: boolean
}

export function WordReveal({
  text,
  className = '',
  delay = 0,
  staggerDelay = 0.08,
  once = true,
}: WordRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: '-10% 0px' })

  const words = text.split(' ')

  return (
    <span ref={ref} className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 30, filter: 'blur(10px)' }}
          transition={{
            duration: 0.5,
            delay: delay + index * staggerDelay,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          style={{ display: 'inline-block', marginRight: '0.3em' }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

// Scroll-based text reveal (like Apple's product pages)
interface ScrollTextRevealProps {
  children: ReactNode
  className?: string
}

export function ScrollTextReveal({ children, className = '' }: ScrollTextRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.6, 1])
  const y = useTransform(scrollYProgress, [0, 1], [50, 0])
  const blur = useTransform(scrollYProgress, [0, 1], [8, 0])

  return (
    <motion.div
      ref={ref}
      style={{
        opacity,
        y,
        filter: blur.get() > 0 ? `blur(${blur.get()}px)` : 'none',
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Line reveal with mask
interface LineRevealProps {
  text: string
  className?: string
  delay?: number
}

export function LineReveal({ text, className = '', delay = 0 }: LineRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '100%' }}
        animate={isInView ? { y: 0 } : { y: '100%' }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        {text}
      </motion.div>
    </div>
  )
}

// Counter animation
interface CounterProps {
  from?: number
  to: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
  decimals?: number
}

export function Counter({
  from = 0,
  to,
  duration = 2,
  className = '',
  prefix = '',
  suffix = '',
  decimals = 0,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      >
        {isInView && (
          <CounterNumber from={from} to={to} duration={duration} decimals={decimals} />
        )}
      </motion.span>
      {suffix}
    </span>
  )
}

function CounterNumber({
  from,
  to,
  duration,
  decimals,
}: {
  from: number
  to: number
  duration: number
  decimals: number
}) {
  const ref = useRef<HTMLSpanElement>(null)

  // Use motion value for smooth animation
  const motionValue = useTransform(
    useScroll().scrollYProgress,
    [0, 1],
    [from, to]
  )

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        animate={{
          transition: { duration, ease: 'easeOut' }
        }}
      >
        <AnimatedNumber value={to} duration={duration} decimals={decimals} />
      </motion.span>
    </motion.span>
  )
}

function AnimatedNumber({ value, duration, decimals }: { value: number; duration: number; decimals: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      onAnimationStart={() => {
        if (ref.current) {
          let start = 0
          const end = value
          const startTime = Date.now()
          const durationMs = duration * 1000

          const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / durationMs, 1)
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3)
            const current = start + (end - start) * easeProgress

            if (ref.current) {
              ref.current.textContent = current.toFixed(decimals)
            }

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          animate()
        }
      }}
    >
      0
    </motion.span>
  )
}

// Gradient text reveal
interface GradientTextProps {
  children: ReactNode
  className?: string
  from?: string
  to?: string
}

export function GradientText({
  children,
  className = '',
  from = '#4ECDC4',
  to = '#0a3577',
}: GradientTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const gradientPosition = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{
        backgroundImage: `linear-gradient(90deg, ${from}, ${to}, ${from})`,
        backgroundSize: '200% 100%',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundPosition: gradientPosition as any,
      }}
    >
      {children}
    </motion.span>
  )
}
