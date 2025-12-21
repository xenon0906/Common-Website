'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Check, ChevronRight, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  icon: LucideIcon
  title: string
  description: string
  details?: string
  mockupContent?: React.ReactNode
}

interface InteractiveStepCardProps {
  step: Step
  index: number
  isActive: boolean
  isCompleted: boolean
  color?: 'teal' | 'primary'
}

export function InteractiveStepCard({
  step,
  index,
  isActive,
  isCompleted,
  color = 'teal',
}: InteractiveStepCardProps) {
  const Icon = step.icon
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: '-50px' })

  const colorClasses = {
    teal: {
      bg: 'bg-teal-500',
      bgLight: 'bg-teal-50',
      text: 'text-teal-500',
      border: 'border-teal-500',
      glow: 'shadow-teal-500/30',
      gradient: 'from-teal-500 to-teal-600',
    },
    primary: {
      bg: 'bg-primary',
      bgLight: 'bg-primary/10',
      text: 'text-primary',
      border: 'border-primary',
      glow: 'shadow-primary/30',
      gradient: 'from-primary to-blue-600',
    },
  }

  const colors = colorClasses[color]

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={cn(
        'relative',
        isActive && 'z-10'
      )}
    >
      <motion.div
        layout
        className={cn(
          'relative rounded-2xl overflow-hidden transition-all duration-500',
          'bg-white border-2',
          isActive ? `${colors.border} shadow-2xl ${colors.glow}` : 'border-gray-100',
          isCompleted && !isActive && 'opacity-80'
        )}
      >
        {/* Card content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            {/* Step indicator */}
            <motion.div
              className={cn(
                'relative w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300',
                isActive && `bg-gradient-to-br ${colors.gradient} shadow-lg`,
                isCompleted && !isActive && colors.bg,
                !isActive && !isCompleted && colors.bgLight
              )}
              animate={isActive ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 2 }}
            >
              {isCompleted && !isActive ? (
                <Check className="w-6 h-6 text-white" />
              ) : (
                <Icon className={cn('w-6 h-6', isActive ? 'text-white' : colors.text)} />
              )}

              {/* Step number badge */}
              <div className={cn(
                'absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold',
                isActive ? 'bg-white text-gray-900' : `${colors.bg} text-white`
              )}>
                {index + 1}
              </div>
            </motion.div>

            {/* Title & description */}
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                'font-semibold text-lg transition-colors',
                isActive && colors.text
              )}>
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {step.description}
              </p>
            </div>

            {/* Expand indicator */}
            <motion.div
              animate={{ rotate: isActive ? 90 : 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
                isActive ? colors.bgLight : 'bg-gray-50'
              )}
            >
              <ChevronRight className={cn('w-4 h-4', isActive ? colors.text : 'text-gray-400')} />
            </motion.div>
          </div>

          {/* Expanded content - shown when active */}
          <AnimatePresence>
            {isActive && step.details && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.details}
                  </p>

                  {/* Mockup placeholder */}
                  {step.mockupContent && (
                    <div className="mt-4">
                      {step.mockupContent}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Active indicator glow */}
        {isActive && (
          <motion.div
            className={cn(
              'absolute inset-0 rounded-2xl pointer-events-none',
              `bg-gradient-to-br ${colors.gradient} opacity-5`
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}

// Step connector line with draw animation
interface StepConnectorProps {
  isCompleted: boolean
  isActive: boolean
  color?: 'teal' | 'primary'
  orientation?: 'vertical' | 'horizontal'
}

export function StepConnector({
  isCompleted,
  isActive,
  color = 'teal',
  orientation = 'vertical',
}: StepConnectorProps) {
  const colorClasses = {
    teal: {
      active: 'from-teal-500 to-teal-400',
      inactive: 'from-gray-200 to-gray-200',
    },
    primary: {
      active: 'from-primary to-blue-500',
      inactive: 'from-gray-200 to-gray-200',
    },
  }

  const colors = colorClasses[color]

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        orientation === 'vertical' ? 'w-0.5 h-8 mx-auto' : 'h-0.5 w-8'
      )}
    >
      {/* Background line */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-b',
        colors.inactive
      )} />

      {/* Animated fill line */}
      <motion.div
        className={cn(
          'absolute inset-0 bg-gradient-to-b',
          colors.active
        )}
        initial={{ scaleY: 0, originY: 0 }}
        animate={{ scaleY: isCompleted || isActive ? 1 : 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />

      {/* Pulse effect when active */}
      {isActive && (
        <motion.div
          className={cn(
            'absolute w-2 h-2 rounded-full -translate-x-1/2 left-1/2',
            color === 'teal' ? 'bg-teal-500' : 'bg-primary'
          )}
          animate={{
            y: ['0%', '100%'],
            opacity: [1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </div>
  )
}

// Progress indicator
interface WalkthroughProgressProps {
  currentStep: number
  totalSteps: number
  color?: 'teal' | 'primary'
}

export function WalkthroughProgress({
  currentStep,
  totalSteps,
  color = 'teal',
}: WalkthroughProgressProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100

  const colorClasses = {
    teal: {
      bar: 'bg-teal-500',
      text: 'text-teal-500',
    },
    primary: {
      bar: 'bg-primary',
      text: 'text-primary',
    },
  }

  const colors = colorClasses[color]

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Progress bar */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn('text-sm font-medium', colors.text)}>
            Step {currentStep + 1}
          </span>
          <span className="text-gray-400 text-sm">of {totalSteps}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className={cn('h-full rounded-full', colors.bar)}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Step dots */}
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'w-2.5 h-2.5 rounded-full transition-colors',
              i === currentStep && colors.bar,
              i < currentStep && 'bg-gray-300',
              i > currentStep && 'bg-gray-200'
            )}
          />
        ))}
      </div>
    </div>
  )
}

// Phone mockup for step demonstrations
interface PhoneMockupProps {
  children: React.ReactNode
  className?: string
}

export function PhoneMockup({ children, className }: PhoneMockupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateY: -10 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'relative mx-auto w-[280px] h-[560px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl',
        className
      )}
      style={{ perspective: 1000 }}
    >
      {/* Phone frame details */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl" />
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-gray-800 rounded-full" />

      {/* Screen */}
      <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
        {children}
      </div>

      {/* Side buttons */}
      <div className="absolute -right-1 top-24 w-1 h-12 bg-gray-800 rounded-l-sm" />
      <div className="absolute -right-1 top-40 w-1 h-12 bg-gray-800 rounded-l-sm" />
      <div className="absolute -left-1 top-32 w-1 h-16 bg-gray-800 rounded-r-sm" />
    </motion.div>
  )
}

// Complete walkthrough component with scroll-based activation
interface InteractiveWalkthroughProps {
  steps: Step[]
  color?: 'teal' | 'primary'
  autoPlay?: boolean
  autoPlayDelay?: number
}

export function InteractiveWalkthrough({
  steps,
  color = 'teal',
}: InteractiveWalkthroughProps) {
  const [activeSteps, setActiveSteps] = useState<Set<number>>(new Set([0]))
  const containerRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  // Use Intersection Observer to track which steps are visible
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    stepRefs.current.forEach((ref, index) => {
      if (!ref) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
              setActiveSteps((prev) => {
                const newSet = new Set(prev)
                // Add this step and all previous steps
                for (let i = 0; i <= index; i++) {
                  newSet.add(i)
                }
                return newSet
              })
            }
          })
        },
        {
          threshold: 0.5,
          rootMargin: '-20% 0px -20% 0px',
        }
      )

      observer.observe(ref)
      observers.push(observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [steps.length])

  const currentStep = Math.max(...Array.from(activeSteps))

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Progress bar */}
      <WalkthroughProgress
        currentStep={currentStep}
        totalSteps={steps.length}
        color={color}
      />

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.title}
            ref={(el) => {
              stepRefs.current[index] = el
            }}
          >
            <InteractiveStepCard
              step={step}
              index={index}
              isActive={activeSteps.has(index)}
              isCompleted={index < currentStep}
              color={color}
            />
            {index < steps.length - 1 && (
              <StepConnector
                isCompleted={index < currentStep}
                isActive={activeSteps.has(index)}
                color={color}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
