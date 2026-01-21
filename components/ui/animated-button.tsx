'use client'

import * as React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnimatedButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: 'default' | 'gradient' | 'outline' | 'ghost' | 'glow'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  iconPosition?: 'left' | 'right' | 'none'
  icon?: React.ReactNode
  loading?: boolean
  children: React.ReactNode
}

const variantStyles = {
  default: 'bg-primary text-white hover:bg-primary/90 shadow-md',
  gradient: 'bg-gradient-to-r from-teal via-[#0d9488] to-primary text-white shadow-xl shadow-primary/30 border border-white/20',
  outline: 'border-2 border-primary bg-transparent text-primary hover:bg-primary/5',
  ghost: 'bg-transparent text-primary hover:bg-primary/5',
  glow: 'bg-gradient-to-r from-teal to-primary text-white shadow-lg shadow-teal/40',
}

const sizeStyles = {
  sm: 'h-9 px-4 text-sm rounded-lg',
  md: 'h-10 px-5 text-sm rounded-lg',
  lg: 'h-12 px-8 text-base rounded-xl',
  xl: 'h-14 px-10 text-lg rounded-xl',
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({
    variant = 'default',
    size = 'md',
    iconPosition = 'right',
    icon,
    loading = false,
    children,
    className,
    disabled,
    ...props
  }, ref) => {
    const IconComponent = icon || <ArrowRight className="w-4 h-4" />

    return (
      <motion.button
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        whileHover={{
          scale: 1.02,
          boxShadow: variant === 'glow'
            ? '0 0 35px rgba(13, 148, 136, 0.5)'
            : '0 10px 30px -10px rgba(0, 0, 0, 0.3)'
        }}
        whileTap={{ scale: 0.98 }}
        disabled={disabled || loading}
        {...props}
      >
        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />

        {loading ? (
          <motion.div
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <>
            {iconPosition === 'left' && (
              <motion.span
                className="relative"
                initial={{ x: 0 }}
                whileHover={{ x: -3 }}
                transition={{ duration: 0.2 }}
              >
                {IconComponent}
              </motion.span>
            )}
            <span className="relative">{children}</span>
            {iconPosition === 'right' && (
              <motion.span
                className="relative"
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                {IconComponent}
              </motion.span>
            )}
          </>
        )}
      </motion.button>
    )
  }
)
AnimatedButton.displayName = 'AnimatedButton'

// Magnetic button that follows cursor slightly
interface MagneticButtonProps extends AnimatedButtonProps {
  strength?: number
}

const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ strength = 0.3, children, className, ...props }, ref) => {
    const [position, setPosition] = React.useState({ x: 0, y: 0 })
    const buttonRef = React.useRef<HTMLButtonElement | null>(null)

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = (e.clientX - rect.left - rect.width / 2) * strength
      const y = (e.clientY - rect.top - rect.height / 2) * strength
      setPosition({ x, y })
    }

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 })
    }

    const setRefs = React.useCallback((node: HTMLButtonElement | null) => {
      buttonRef.current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
      }
    }, [ref])

    return (
      <motion.button
        ref={setRefs}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 font-semibold bg-gradient-to-r from-teal to-primary text-white px-6 py-3 rounded-xl shadow-lg transition-shadow hover:shadow-xl',
          className
        )}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 150, damping: 15 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)
MagneticButton.displayName = 'MagneticButton'

// Ripple button with click effect
interface RippleButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: 'default' | 'gradient' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  ({ variant = 'default', size = 'md', children, className, onClick, ...props }, ref) => {
    const [ripples, setRipples] = React.useState<{ x: number; y: number; id: number }[]>([])

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const id = Date.now()
      setRipples([...ripples, { x, y, id }])
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id))
      }, 600)
      onClick?.(e)
    }

    return (
      <motion.button
        ref={ref}
        className={cn(
          'relative overflow-hidden inline-flex items-center justify-center gap-2 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none"
            style={{ left: ripple.x, top: ripple.y }}
            initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 1 }}
            animate={{ width: 200, height: 200, x: -100, y: -100, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </motion.button>
    )
  }
)
RippleButton.displayName = 'RippleButton'

export { AnimatedButton, MagneticButton, RippleButton }
