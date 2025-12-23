'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'
import { Leaf, TreeDeciduous, Car, Wind, Sparkles } from 'lucide-react'

interface CO2ImpactTrackerProps {
  className?: string
}

// Animated counter component
function AnimatedCounter({ value, suffix = '', duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / (duration * 1000), 1)
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplayValue(Math.floor(value * eased))

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [isInView, value, duration])

  return (
    <span ref={ref} className="counter-value">
      {displayValue.toLocaleString()}{suffix}
    </span>
  )
}

// Tree growth animation
function GrowingTree({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.5, type: 'spring', stiffness: 200 }}
      className="relative"
    >
      <TreeDeciduous className="w-8 h-8 text-teal-500" />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.5, 0] }}
        transition={{ delay: delay + 0.3, duration: 1, repeat: Infinity, repeatDelay: 3 }}
        className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 rounded-full opacity-60"
      />
    </motion.div>
  )
}

// Floating leaf particle
function FloatingLeaf({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ y: 0, x: 0, opacity: 0, rotate: 0 }}
      animate={{
        y: [-20, -60, -100],
        x: [0, 20, -10],
        opacity: [0, 1, 0],
        rotate: [0, 180, 360],
      }}
      transition={{
        delay,
        duration: 3,
        repeat: Infinity,
        repeatDelay: 2,
        ease: 'easeOut',
      }}
      className="absolute"
    >
      <Leaf className="w-4 h-4 text-teal-400" />
    </motion.div>
  )
}

export function CO2ImpactTracker({ className }: CO2ImpactTrackerProps) {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  // Sample impact data (in a real app, this would come from API/user data)
  const impactData = {
    carbonSavedKg: 2450,
    treesEquivalent: 122,
    carMilesAvoided: 5890,
    ridesShared: 1240,
  }

  const impactCards = [
    {
      icon: Wind,
      value: impactData.carbonSavedKg,
      suffix: ' kg',
      label: 'CO2 Saved',
      description: 'Carbon emissions prevented',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
    },
    {
      icon: TreeDeciduous,
      value: impactData.treesEquivalent,
      suffix: '',
      label: 'Trees Equivalent',
      description: 'Annual CO2 absorption',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      icon: Car,
      value: impactData.carMilesAvoided,
      suffix: ' mi',
      label: 'Car Miles Avoided',
      description: 'Solo driving prevented',
      color: 'text-primary',
      bgColor: 'bg-primary/5',
      borderColor: 'border-primary/20',
    },
  ]

  return (
    <section
      ref={containerRef}
      className={`section-padding bg-gradient-to-b from-white via-teal-50/30 to-white relative overflow-hidden ${className}`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-20 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-20 left-20 w-80 h-80 bg-green-100 rounded-full blur-3xl opacity-20"
        />
      </div>

      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 rounded-full mb-4"
          >
            <Leaf className="w-4 h-4 text-teal-600" />
            <span className="text-teal-700 text-sm font-semibold">Environmental Impact</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Your <span className="text-snapgo-gradient">Green Journey</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Every shared ride makes a difference. See how our community is helping the planet.
          </p>
        </motion.div>

        {/* Impact Cards */}
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {impactCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <div className={`gamification-card ${card.bgColor} border ${card.borderColor} relative overflow-hidden`}>
                {/* Floating Leaves Animation */}
                {index === 1 && isInView && (
                  <>
                    <FloatingLeaf delay={1} />
                    <FloatingLeaf delay={2.5} />
                    <FloatingLeaf delay={4} />
                  </>
                )}

                <div className="flex items-start justify-between mb-4">
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className={`w-14 h-14 rounded-2xl ${card.bgColor} flex items-center justify-center border ${card.borderColor}`}
                  >
                    <card.icon className={`w-7 h-7 ${card.color}`} />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                  >
                    <Sparkles className="w-5 h-5 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                </div>

                <div className={`text-4xl md:text-5xl font-bold ${card.color} mb-2`}>
                  <AnimatedCounter value={card.value} suffix={card.suffix} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{card.label}</h3>
                <p className="text-gray-500 text-sm">{card.description}</p>

                {/* Progress indicator */}
                <div className="mt-4 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: '75%' } : {}}
                    transition={{ delay: 0.8 + index * 0.1, duration: 1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      index === 0 ? 'bg-teal-500' : index === 1 ? 'bg-green-500' : 'bg-primary'
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Visual Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="gamification-card bg-gradient-to-br from-teal-50 to-green-50 border border-teal-100">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Equivalent Impact</h3>
              <p className="text-gray-600">Your shared rides have the same environmental benefit as:</p>
            </div>

            {/* Tree Forest Visualization */}
            <div className="flex justify-center items-end gap-2 mb-6 min-h-[80px]">
              {isInView && Array.from({ length: 12 }).map((_, i) => (
                <GrowingTree key={i} delay={0.8 + i * 0.1} />
              ))}
            </div>

            <div className="text-center">
              <span className="text-3xl font-bold text-teal-600">
                <AnimatedCounter value={impactData.treesEquivalent} />
              </span>
              <span className="text-gray-600 ml-2">trees planted and growing for one year</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
