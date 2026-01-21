'use client'

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { FlowingLine, DashedLine } from './ConnectionLine'
import { ANIMATION_CONFIG } from '@/lib/animation-config'

interface StepSequenceContextType {
  activeStep: number
  totalSteps: number
  setActiveStep: (step: number) => void
  isInView: boolean
}

const StepSequenceContext = createContext<StepSequenceContextType>({
  activeStep: 0,
  totalSteps: 0,
  setActiveStep: () => {},
  isInView: false,
})

export const useStepSequence = () => useContext(StepSequenceContext)

interface StepSequenceProps {
  children: ReactNode
  steps: number
  direction?: 'horizontal' | 'vertical'
  showConnections?: boolean
  staggerDelay?: number
  connectionStyle?: 'solid' | 'dashed' | 'gradient' | 'flowing'
  autoAdvance?: boolean
  autoAdvanceDelay?: number
  className?: string
  connectionClassName?: string
}

export function StepSequence({
  children,
  steps,
  direction = 'horizontal',
  showConnections = true,
  staggerDelay = ANIMATION_CONFIG.stagger.normal,
  connectionStyle = 'flowing',
  autoAdvance = true,
  autoAdvanceDelay = ANIMATION_CONFIG.highlight.autoAdvanceDelay,
  className = '',
  connectionClassName = '',
}: StepSequenceProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, margin: '-100px' })
  const [activeStep, setActiveStep] = useState(0)

  // Auto-advance steps when in view
  useEffect(() => {
    if (!autoAdvance || !isInView) return

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps)
    }, autoAdvanceDelay)

    return () => clearInterval(interval)
  }, [autoAdvance, autoAdvanceDelay, isInView, steps])

  // Reset to first step when leaving view
  useEffect(() => {
    if (!isInView) {
      setActiveStep(0)
    }
  }, [isInView])

  const isHorizontal = direction === 'horizontal'

  return (
    <StepSequenceContext.Provider value={{ activeStep, totalSteps: steps, setActiveStep, isInView }}>
      <div ref={ref} className={`relative ${className}`}>
        {/* Connection lines */}
        {showConnections && (
          <div
            className={`
              absolute pointer-events-none z-0
              ${isHorizontal
                ? 'left-0 right-0 top-1/2 -translate-y-1/2 h-1'
                : 'top-0 bottom-0 left-1/2 -translate-x-1/2 w-1'
              }
              ${connectionClassName}
            `}
          >
            {connectionStyle === 'flowing' ? (
              <FlowingLine direction={direction} length="100%" />
            ) : connectionStyle === 'dashed' ? (
              <DashedLine direction={direction} length="100%" color="hsl(var(--teal))" />
            ) : (
              <div
                className={`
                  ${isHorizontal ? 'h-0.5 w-full' : 'w-0.5 h-full'}
                  bg-gradient-to-${isHorizontal ? 'r' : 'b'} from-teal/20 via-teal/50 to-teal/20
                `}
              />
            )}
          </div>
        )}

        {/* Steps container */}
        <div
          className={`
            relative z-10
            ${isHorizontal
              ? 'flex flex-row items-stretch gap-4 md:gap-6'
              : 'flex flex-col items-center gap-6'
            }
          `}
        >
          {children}
        </div>
      </div>
    </StepSequenceContext.Provider>
  )
}

// Step wrapper that automatically handles active state
interface StepItemProps {
  index: number
  children: ReactNode | ((isActive: boolean, stepNumber: number) => ReactNode)
  className?: string
}

export function StepItem({ index, children, className = '' }: StepItemProps) {
  const { activeStep, isInView } = useStepSequence()
  const isActive = activeStep === index

  return (
    <motion.div
      className={`flex-1 ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: ANIMATION_CONFIG.entrance.duration,
        delay: index * ANIMATION_CONFIG.stagger.normal,
      }}
    >
      {typeof children === 'function' ? children(isActive, index + 1) : children}
    </motion.div>
  )
}

// Progress indicator for step sequence
interface StepProgressProps {
  className?: string
}

export function StepProgress({ className = '' }: StepProgressProps) {
  const { activeStep, totalSteps } = useStepSequence()
  const progress = ((activeStep + 1) / totalSteps) * 100

  return (
    <div className={`w-full h-1 bg-muted rounded-full overflow-hidden ${className}`}>
      <motion.div
        className="h-full bg-gradient-to-r from-teal to-primary rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  )
}

// Step dots navigation
interface StepDotsProps {
  onStepClick?: (step: number) => void
  className?: string
}

export function StepDots({ onStepClick, className = '' }: StepDotsProps) {
  const { activeStep, totalSteps, setActiveStep } = useStepSequence()

  const handleClick = (step: number) => {
    setActiveStep(step)
    onStepClick?.(step)
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <motion.button
          key={index}
          className={`
            w-2 h-2 rounded-full transition-all duration-300
            ${activeStep === index
              ? 'w-8 bg-teal'
              : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }
          `}
          onClick={() => handleClick(index)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        />
      ))}
    </div>
  )
}
