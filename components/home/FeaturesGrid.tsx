'use client'

import { useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { FEATURES } from '@/lib/constants'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { GlowHighlight } from '@/components/shared/animations'
import { ANIMATION_CONFIG } from '@/lib/animation-config'
import { IconMap } from '@/components/ui/icon'
import { FeatureData } from '@/lib/content'

// Feature type for compatibility
type FeatureType = FeatureData | typeof FEATURES[0]

// 3D Tilt Card Component with GlowHighlight
function FeatureCard({ feature, index }: { feature: FeatureType; index: number }) {
  const Icon = IconMap[feature.icon] || IconMap['Star']
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    setRotateX(-mouseY / 15)
    setRotateY(mouseX / 15)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="h-full transition-transform duration-200"
    >
      <GlowHighlight isActive={isHovered} color="primary" intensity="medium">
        <Card className="h-full min-h-[180px] sm:min-h-[200px] group hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-200 cursor-pointer relative">
          {/* Spotlight effect - contained in its own wrapper */}
          <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{
                background: isHovered
                  ? `radial-gradient(400px circle at ${rotateY * 10 + 50}% ${-rotateX * 10 + 50}%, rgba(0, 102, 179, 0.1), transparent 40%)`
                  : 'none',
              }}
            />
          </div>

          <CardContent className="p-4 sm:p-6 relative h-full flex flex-col">
            {/* Background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg overflow-hidden" />

            <div className="relative z-10 flex flex-col flex-1" style={{ transform: 'translateZ(30px)' }}>
              {/* Feature number badge */}
              <motion.div
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                initial={{ scale: 0 }}
                animate={isHovered ? { scale: 1 } : { scale: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                {index + 1}
              </motion.div>

              <motion.div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-all duration-200 relative"
                whileHover={{ scale: 1.05, rotate: 3 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                {/* Pulse ring on hover */}
                {isHovered && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-primary/20"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
              </motion.div>

              <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                {feature.title}
              </h3>

              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </GlowHighlight>
    </motion.div>
  )
}

interface FeaturesGridProps {
  features?: FeatureType[]
}

export default function FeaturesGrid({ features }: FeaturesGridProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  // Use provided features or fall back to constants
  const displayFeatures = features || FEATURES

  // Parallax effect for the section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <section ref={containerRef} className="py-20 bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="hidden sm:block absolute -top-40 -right-40 w-48 h-48 md:w-80 md:h-80 rounded-full bg-primary/5 blur-3xl"
          style={{ y }}
        />
        <motion.div
          className="hidden sm:block absolute -bottom-40 -left-40 w-48 h-48 md:w-80 md:h-80 rounded-full bg-teal/5 blur-3xl"
          style={{ y: useTransform(scrollYProgress, [0, 1], [-50, 50]) }}
        />
      </div>

      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4"
          >
            Features
          </motion.span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="text-primary">Snapgo</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            Experience the smarter way to travel with features designed for your safety, savings, and convenience.
          </p>
        </motion.div>

        {/* Feature count indicator */}
        <motion.div
          className="flex justify-center mb-6 sm:mb-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-1.5">
            {displayFeatures.map((_, index) => (
              <motion.div
                key={index}
                className="w-2 h-2 rounded-full bg-primary/30"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: 0.2 + index * 0.03 }}
              />
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {displayFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: ANIMATION_CONFIG.entrance.duration,
                delay: index * ANIMATION_CONFIG.stagger.normal,
                ease: ANIMATION_CONFIG.entrance.ease
              }}
            >
              <FeatureCard feature={feature} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
