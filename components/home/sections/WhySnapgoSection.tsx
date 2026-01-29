'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import {
  WalletIcon,
  ShieldIcon,
  CarIcon,
  LeafIcon,
  SparklesIcon,
} from '@/components/ui/icon'

export function WhySnapgoSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const reasons = [
    {
      icon: WalletIcon,
      title: 'Save Up to 75%',
      description: 'Pool a cab with verified co-riders and split the fare — why pay full?',
      gradient: 'from-teal-50 to-primary-50',
      iconBg: 'bg-teal-100',
      iconBgHover: 'hover:bg-teal-200',
      iconColor: 'text-teal-600',
      shadowClass: 'hover:shadow-teal-500/20'
    },
    {
      icon: ShieldIcon,
      title: '100% Legal & Verified',
      description: 'We pool commercial cabs (not private cars) with Aadhaar-verified riders',
      gradient: 'from-primary-50 to-purple-50',
      iconBg: 'bg-primary-100',
      iconBgHover: 'hover:bg-primary-200',
      iconColor: 'text-primary',
      shadowClass: 'hover:shadow-primary/20'
    },
    {
      icon: CarIcon,
      title: 'Pool Your Way',
      description: 'No car? Book a cab together. Have a car? Share your ride. Flexibility for everyone.',
      gradient: 'from-purple-50 to-teal-50',
      iconBg: 'bg-purple-100',
      iconBgHover: 'hover:bg-purple-200',
      iconColor: 'text-purple-600',
      shadowClass: 'hover:shadow-purple-500/20'
    },
    {
      icon: LeafIcon,
      title: 'Green Cab Pooling',
      description: '4 people, 1 cab = 75% less emissions. Good for you AND the planet',
      gradient: 'from-teal-50 to-primary-50',
      iconBg: 'bg-teal-100',
      iconBgHover: 'hover:bg-teal-200',
      iconColor: 'text-teal-600',
      shadowClass: 'hover:shadow-teal-500/20'
    },
  ]

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.05, type: 'spring', stiffness: 250, damping: 12 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal/10 rounded-full mb-4"
          >
            <SparklesIcon className="w-4 h-4 text-teal" />
            <span className="text-teal text-sm font-semibold">Why Choose Snapgo?</span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Why Cab Pooling is
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal via-primary to-purple"> Smarter</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Pool commercial cabs with verified riders. Legal, eco-friendly, and up to 75% cheaper.
          </p>
        </motion.div>

        {/* Step dots indicator */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            {reasons.map((_, index) => (
              <div key={index} className="flex items-center">
                <motion.div
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                    hoveredIndex === index ? 'bg-teal scale-125' : 'bg-muted-foreground/30'
                  }`}
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.3 + index * 0.1 }}
                />
                {index < reasons.length - 1 && (
                  <motion.div
                    className="w-6 h-0.5 mx-1 bg-muted-foreground/20"
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : {}}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    style={{ transformOrigin: 'left' }}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {reasons.map((reason, index) => {
            const isOdd = index % 2 !== 0
            const asymmetricClass = isOdd ? 'lg:translate-y-4' : 'lg:-translate-y-4'
            const isHovered = hoveredIndex === index

            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                transition={{ duration: 0.2, delay: index * 0.03, ease: [0.34, 1.56, 0.64, 1] }}
                whileHover={{ y: isOdd ? -6 : -14, scale: 1.02 }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                className={`group ${asymmetricClass} transition-transform duration-300`}
              >
                <div className={`relative ${isHovered ? 'z-10' : 'z-0'}`}>
                  {isHovered && (
                    <motion.div
                      className="absolute -inset-2 rounded-3xl bg-teal/20 blur-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                  <Card className={`h-full min-h-[200px] border-0 bg-gradient-to-br ${reason.gradient} backdrop-blur-sm hover:shadow-2xl ${reason.shadowClass} transition-all duration-500 relative overflow-hidden`}>
                    <motion.div
                      className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-900/10 text-xs font-bold flex items-center justify-center text-gray-700"
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                    >
                      {index + 1}
                    </motion.div>
                    <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-14 h-14 rounded-2xl ${reason.iconBg} ${reason.iconBgHover} flex items-center justify-center mb-4 transition-colors relative`}
                      >
                        <reason.icon className={`w-7 h-7 ${reason.iconColor}`} />
                        {isHovered && (
                          <motion.div
                            className="absolute inset-0 rounded-2xl border-2 border-teal/30"
                            initial={{ scale: 1, opacity: 1 }}
                            animate={{ scale: 1.5, opacity: 0 }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        )}
                      </motion.div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-teal transition-colors">{reason.title}</h3>
                      <p className="text-muted-foreground text-sm mt-auto">{reason.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
