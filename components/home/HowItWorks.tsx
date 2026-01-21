'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { HOW_IT_WORKS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { GlowHighlight, StepCounter } from '@/components/shared/animations'
import { ANIMATION_CONFIG } from '@/lib/animation-config'
import { IconMap, ArrowRightIcon, SparklesIcon } from '@/components/ui/icon'
import { HowItWorksStepData } from '@/lib/content'

// Step type for compatibility
type StepType = HowItWorksStepData | typeof HOW_IT_WORKS[0]

const stepColors = [
  { bg: 'from-primary to-primary/70', glow: 'shadow-primary/20', color: 'primary' as const },
  { bg: 'from-teal to-teal/70', glow: 'shadow-teal/20', color: 'teal' as const },
  { bg: 'from-primary/80 to-teal/80', glow: 'shadow-primary/20', color: 'primary' as const },
]

interface HowItWorksProps {
  steps?: StepType[]
}

export function HowItWorks({ steps }: HowItWorksProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })
  const [activeStep, setActiveStep] = useState(0)
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)

  // Use provided steps or fall back to constants
  const displaySteps = steps || HOW_IT_WORKS

  // Auto-advance active step for sequential glow effect
  useEffect(() => {
    if (!isInView) return

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % displaySteps.length)
    }, ANIMATION_CONFIG.highlight.autoAdvanceDelay)

    return () => clearInterval(interval)
  }, [isInView, displaySteps.length])

  return (
    <section ref={containerRef} className="py-20 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="hidden sm:block absolute top-20 right-10 w-48 h-48 md:w-64 md:h-64 rounded-full bg-primary/5 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="hidden sm:block absolute bottom-20 left-10 w-56 h-56 md:w-80 md:h-80 rounded-full bg-teal/5 blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-center mb-12"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4"
          >
            <SparklesIcon className="w-4 h-4" />
            Simple Steps
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <span className="text-primary">Snapgo</span> Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Get started in three simple steps and start saving on your daily commute.
          </p>
        </motion.div>

        {/* Step progress indicator */}
        <motion.div
          className="flex justify-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            {displaySteps.map((_, index) => (
              <div key={index} className="flex items-center">
                <motion.button
                  onClick={() => setActiveStep(index)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-200",
                    activeStep === index
                      ? "bg-primary scale-125"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
                {index < displaySteps.length - 1 && (
                  <div className="w-8 h-0.5 mx-1 bg-muted-foreground/20 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-primary"
                      initial={{ width: '0%' }}
                      animate={{
                        width: activeStep > index ? '100%' : '0%'
                      }}
                      transition={{ duration: 0.25 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="relative">
          {/* Animated connection line - tablet and desktop */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] lg:left-[15%] lg:right-[15%] h-1 transform -translate-y-1/2 z-0">
            <div className="h-full bg-gradient-to-r from-primary via-teal to-primary/70 rounded-full opacity-20" />
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-teal to-primary/70 rounded-full"
              initial={{ width: '0%' }}
              animate={isInView ? { width: '100%' } : {}}
              transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
            />
            {/* Flowing dot animation */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg shadow-primary/30"
              initial={{ left: '0%', opacity: 0 }}
              animate={isInView ? {
                left: ['0%', '50%', '100%'],
                opacity: [0, 1, 0]
              } : {}}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 0.5,
                ease: 'easeInOut'
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-10 relative z-10">
            {displaySteps.map((step, index) => {
              const Icon = IconMap[step.icon]
              const colors = stepColors[index]
              const isActive = activeStep === index
              const isHovered = hoveredStep === index

              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.2, delay: 0.1 + index * 0.05, ease: [0.34, 1.56, 0.64, 1] }}
                  className="relative"
                  onMouseEnter={() => setHoveredStep(index)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  <GlowHighlight
                    isActive={isActive || isHovered}
                    color={colors.color}
                    intensity={isActive ? 'medium' : 'low'}
                  >
                    {/* Step number badge - positioned outside card for proper layering */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ duration: 0.2, delay: 0.15 + index * 0.05, type: 'spring', stiffness: 250, damping: 12 }}
                      className={cn(
                        "absolute -top-3 left-6 sm:left-8 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br text-white font-bold flex items-center justify-center text-base sm:text-lg shadow-lg",
                        colors.bg,
                        colors.glow,
                        isActive && "ring-2 ring-white/50 ring-offset-2 ring-offset-background"
                      )}
                    >
                      <StepCounter
                        step={step.step}
                        isActive={isInView}
                        className="text-xl"
                      />
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -6, scale: 1.01 }}
                      transition={{ duration: 0.25 }}
                      className="bg-card rounded-3xl pt-8 pb-6 px-4 sm:pt-10 sm:pb-8 sm:px-8 shadow-lg border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                    >
                      {/* Gradient overlay on hover */}
                      <div className={cn(
                        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500",
                        colors.bg
                      )} />

                      {/* Active indicator glow */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-3xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.1, 0.15, 0.1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          style={{
                            background: `linear-gradient(135deg, rgba(0, 102, 179, 0.08), transparent)`,
                          }}
                        />
                      )}

                      {/* Icon with animated background */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6">
                        <motion.div
                          className={cn(
                            "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-15 blur-xl",
                            colors.bg
                          )}
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.div
                          className="relative w-full h-full rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center group-hover:from-primary/10 group-hover:to-teal/10 transition-all duration-300"
                          animate={isActive ? {
                            boxShadow: ['0 0 0 0 rgba(0, 102, 179, 0)', '0 0 15px 5px rgba(0, 102, 179, 0.2)', '0 0 0 0 rgba(0, 102, 179, 0)']
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <motion.div
                            animate={isActive ? { rotate: [0, 3, -3, 0] } : {}}
                            transition={{ duration: 0.4 }}
                          >
                            <Icon className={cn(
                              "w-8 h-8 sm:w-10 sm:h-10 transition-colors duration-200",
                              isActive ? "text-primary" : "text-primary/70 group-hover:text-primary"
                            )} />
                          </motion.div>
                        </motion.div>
                      </div>

                      {/* Content */}
                      <h3 className={cn(
                        "text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-center transition-colors duration-200",
                        isActive ? "text-primary" : "group-hover:text-primary"
                      )}>
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-center leading-relaxed">
                        {step.description}
                      </p>
                    </motion.div>
                  </GlowHighlight>

                  {/* Arrow connector - mobile only */}
                  {index < displaySteps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ delay: 0.5 + index * 0.15 }}
                      className="flex justify-center my-4 sm:my-6 md:hidden"
                    >
                      <motion.div
                        animate={{ y: [0, 4, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      >
                        <ArrowRightIcon className="w-6 h-6 text-primary rotate-90" />
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
