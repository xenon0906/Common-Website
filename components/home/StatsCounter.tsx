'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { STATS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { StatisticData } from '@/lib/content'

interface AnimatedCounterProps {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
}

function AnimatedCounter({ value, prefix = '', suffix = '', duration = 2.5 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (inView) {
      let startTime: number
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)

        // Smooth easing function
        const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
        setDisplayValue(Math.floor(easeOutExpo * value))

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setDisplayValue(value)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [inView, value, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {displayValue.toLocaleString('en-IN')}
      {suffix}
    </span>
  )
}

// Stat type for compatibility
type StatType = StatisticData | (typeof STATS[0] & { isEco?: boolean })

// Individual stat card with hover effects
function StatCard({ stat, index, isInView }: { stat: StatType; index: number; isInView: boolean }) {
  const [isHovered, setIsHovered] = useState(false)
  const isEco = 'isEco' in stat && stat.isEco

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="text-center"
    >
      <motion.div
        className="relative"
        animate={isHovered ? { scale: 1.03 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Animated glow effect */}
        <motion.div
          className="absolute inset-0 blur-3xl rounded-full"
          style={{ background: isEco
            ? 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(0, 102, 179, 0.3) 0%, transparent 70%)'
          }}
          animate={isHovered ? { scale: 1.4, opacity: 0.6 } : { scale: 1, opacity: 0.2 }}
          transition={{ duration: 0.3 }}
        />

        <div className={`relative backdrop-blur-md rounded-2xl p-4 sm:p-6 md:p-8 border transition-all duration-300 group ${
          isEco
            ? 'bg-emerald-500/20 border-emerald-400/40 hover:border-emerald-400/60'
            : 'bg-white/20 border-white/30 hover:border-white/50'
        }`}>
          {/* Inner glow on hover */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            isEco ? 'from-emerald-400/20 to-transparent' : 'from-white/10 to-transparent'
          }`} />

          <div className="relative z-10">
            <motion.div
              className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2 ${isEco ? 'text-emerald-300' : 'text-white'}`}
              animate={isHovered ? { y: -3 } : { y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AnimatedCounter
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
            </motion.div>
            <motion.div
              className={`text-xs sm:text-sm md:text-base font-medium leading-tight ${isEco ? 'text-emerald-200' : 'text-white/90'}`}
              animate={isHovered ? { y: -2 } : { y: 0 }}
              transition={{ duration: 0.2, delay: 0.03 }}
            >
              {stat.label}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

interface StatsCounterProps {
  stats?: StatType[]
}

export function StatsCounter({ stats }: StatsCounterProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  // Use provided stats or fall back to constants
  const displayStats = stats || STATS

  // Parallax scrolling effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  return (
    <section ref={containerRef} className="py-20 bg-gradient-to-br from-primary to-primary/90 relative overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 opacity-25 overflow-hidden">
        <motion.div
          className="hidden md:block absolute top-0 left-1/4 w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] rounded-full bg-white/20 blur-[100px]"
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="hidden md:block absolute bottom-0 right-1/4 w-[250px] h-[250px] lg:w-[400px] lg:h-[400px] rounded-full bg-white/15 blur-[80px]"
          animate={{
            x: [0, -20, 0],
            y: [0, -25, 0],
            scale: [1.05, 1, 1.05],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Grid pattern overlay */}
      <motion.div
        className="absolute inset-0 opacity-8"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </motion.div>

      {/* Floating particles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          style={{
            left: `${20 + i * 18}%`,
            top: `${30 + i * 12}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.4,
          }}
        />
      ))}

      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-12"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-block px-5 py-2 glass-dark rounded-full text-sm font-semibold text-white mb-4"
          >
            Our Impact
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Growing <span className="text-white/90">Every Day</span>
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto text-lg">
            Trusted by thousands of students and professionals across India for their daily commute.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {displayStats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
