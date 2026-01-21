'use client'

import * as React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedCardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  variant?: 'default' | 'glass' | 'gradient' | 'glow'
  hoverEffect?: 'lift' | 'scale' | 'tilt' | 'glow'
  children: React.ReactNode
}

const variantStyles = {
  default: 'bg-card border border-border',
  glass: 'bg-white/5 backdrop-blur-xl border border-white/10',
  gradient: 'bg-gradient-to-br from-card via-card to-primary/5 border border-border',
  glow: 'bg-card border border-primary/20 shadow-lg shadow-primary/5',
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, variant = 'default', hoverEffect = 'lift', children, ...props }, ref) => {
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (hoverEffect !== 'tilt') return
      const rect = e.currentTarget.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) / 20
      const y = (e.clientY - rect.top - rect.height / 2) / 20
      setMousePosition({ x: -y, y: x })
    }

    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 })
    }

    const hoverAnimations = {
      lift: {
        y: -8,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 30px -15px rgba(13, 148, 136, 0.2)',
      },
      scale: {
        scale: 1.02,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      tilt: {
        rotateX: mousePosition.x,
        rotateY: mousePosition.y,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      glow: {
        boxShadow: '0 0 40px -10px rgba(13, 148, 136, 0.4), 0 25px 50px -12px rgba(0, 0, 0, 0.15)',
      },
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-xl text-card-foreground shadow-sm overflow-hidden',
          variantStyles[variant],
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        whileHover={hoverAnimations[hoverEffect]}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
AnimatedCard.displayName = 'AnimatedCard'

const AnimatedCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
AnimatedCardHeader.displayName = 'AnimatedCardHeader'

const AnimatedCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
AnimatedCardContent.displayName = 'AnimatedCardContent'

const AnimatedCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
AnimatedCardFooter.displayName = 'AnimatedCardFooter'

export { AnimatedCard, AnimatedCardHeader, AnimatedCardContent, AnimatedCardFooter }
