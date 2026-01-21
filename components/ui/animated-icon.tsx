'use client'

import * as React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedIconProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  icon: React.ReactNode
  variant?: 'default' | 'glow' | 'pulse' | 'bounce'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'teal' | 'primary' | 'white' | 'muted'
}

const sizeStyles = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
}

const colorStyles = {
  teal: 'bg-teal/10 text-teal',
  primary: 'bg-primary/10 text-primary',
  white: 'bg-white/10 text-white',
  muted: 'bg-muted text-muted-foreground',
}

const hoverStyles = {
  default: {
    scale: 1.1,
    rotate: 5,
    transition: { duration: 0.3 },
  },
  glow: {
    scale: 1.1,
    boxShadow: '0 0 25px rgba(13, 148, 136, 0.5)',
    transition: { duration: 0.3 },
  },
  pulse: {
    scale: [1, 1.1, 1],
    transition: { duration: 0.6, repeat: Infinity },
  },
  bounce: {
    y: [0, -5, 0],
    transition: { duration: 0.5, repeat: Infinity },
  },
}

const AnimatedIcon = React.forwardRef<HTMLDivElement, AnimatedIconProps>(
  ({ icon, variant = 'default', size = 'md', color = 'teal', className, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false)

    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-xl flex items-center justify-center transition-colors duration-300',
          sizeStyles[size],
          colorStyles[color],
          'hover:bg-opacity-20',
          className
        )}
        whileHover={hoverStyles[variant]}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        {...props}
      >
        <motion.div
          animate={isHovered && (variant === 'pulse' || variant === 'bounce')
            ? hoverStyles[variant]
            : {}
          }
        >
          {icon}
        </motion.div>
      </motion.div>
    )
  }
)
AnimatedIcon.displayName = 'AnimatedIcon'

// Floating icon with continuous subtle animation
interface FloatingIconProps {
  icon: React.ReactNode
  className?: string
  delay?: number
}

const FloatingIcon: React.FC<FloatingIconProps> = ({ icon, className, delay = 0 }) => {
  return (
    <motion.div
      className={cn('flex items-center justify-center', className)}
      animate={{
        y: [0, -8, 0],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      {icon}
    </motion.div>
  )
}

// Icon with ripple effect on click
interface RippleIconProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  icon: React.ReactNode
  onClick?: () => void
  className?: string
}

const RippleIcon = React.forwardRef<HTMLDivElement, RippleIconProps>(
  ({ icon, onClick, className, ...props }, ref) => {
    const [ripples, setRipples] = React.useState<{ x: number; y: number; id: number }[]>([])

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const id = Date.now()
      setRipples([...ripples, { x, y, id }])
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id))
      }, 600)
      onClick?.()
    }

    return (
      <motion.div
        ref={ref}
        className={cn('relative overflow-hidden cursor-pointer', className)}
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        {icon}
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none"
            style={{ left: ripple.x, top: ripple.y }}
            initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 1 }}
            animate={{ width: 100, height: 100, x: -50, y: -50, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </motion.div>
    )
  }
)
RippleIcon.displayName = 'RippleIcon'

export { AnimatedIcon, FloatingIcon, RippleIcon }
