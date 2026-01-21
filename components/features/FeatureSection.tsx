'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  Users,
  MapPin,
  AlertTriangle,
  MessageCircle,
  Clock,
  Navigation,
  Wallet,
  Leaf,
  History,
  LucideIcon,
} from 'lucide-react'

// Feature icons mapping
const featureIcons: Record<string, LucideIcon> = {
  ShieldCheck,
  Users,
  MapPin,
  AlertTriangle,
  MessageCircle,
  Clock,
  Navigation,
  Wallet,
  Leaf,
  History,
}

// Feature-specific animations
const featureAnimations: Record<string, React.ReactNode> = {}

interface Feature {
  icon: string
  title: string
  description: string
  highlight?: boolean
  color?: string
  animation?: string
}

interface FeatureSectionProps {
  feature: Feature
  index: number
  isActive: boolean
  totalFeatures: number
}

// Individual animated icons for each feature
function ShieldAnimation() {
  return (
    <motion.div className="relative">
      <motion.div
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        <ShieldCheck className="w-24 h-24 text-teal-500" strokeWidth={1.5} />
      </motion.div>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5, type: 'spring' }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-8 h-8 bg-teal-500/20 rounded-full"
        />
      </motion.div>
    </motion.div>
  )
}

function UsersAnimation() {
  return (
    <div className="relative flex items-center justify-center">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: i === 1 ? 0 : i === 0 ? -30 : 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.2, duration: 0.5 }}
          className={`${i === 1 ? 'z-10' : 'z-0'}`}
          style={{ marginLeft: i > 0 ? '-20px' : 0 }}
        >
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-br ${
              i === 1 ? 'from-pink-400 to-pink-600' : 'from-primary to-primary/70'
            } flex items-center justify-center shadow-lg`}
          >
            <Users className="w-8 h-8 text-white" />
          </div>
        </motion.div>
      ))}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.5, 0] }}
        transition={{ delay: 1, duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        className="absolute w-32 h-32 border-2 border-pink-400/50 rounded-full"
      />
    </div>
  )
}

function MapAnimation() {
  return (
    <div className="relative w-32 h-32">
      <motion.div
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
      />
      <motion.div
        animate={{ scale: [1.1, 1.4, 1.1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        className="absolute inset-2 rounded-full border-2 border-dashed border-primary/20"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <MapPin className="w-16 h-16 text-primary" fill="currentColor" />
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -top-2 -right-2 w-4 h-4 bg-teal-500 rounded-full"
      />
    </div>
  )
}

function AlertAnimation() {
  return (
    <div className="relative">
      <motion.div
        animate={{
          boxShadow: [
            '0 0 0 0 rgba(239, 68, 68, 0.4)',
            '0 0 0 20px rgba(239, 68, 68, 0)',
          ],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center"
      >
        <AlertTriangle className="w-12 h-12 text-white" />
      </motion.div>
    </div>
  )
}

function ChatAnimation() {
  return (
    <div className="relative flex flex-col gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.3, duration: 0.4 }}
          className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
        >
          <div
            className={`px-4 py-2 rounded-2xl ${
              i % 2 === 0
                ? 'bg-primary text-white rounded-bl-none'
                : 'bg-gray-200 text-gray-700 rounded-br-none'
            }`}
          >
            <div className="w-16 h-2 rounded bg-current opacity-30" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function ClockAnimation() {
  return (
    <div className="relative w-28 h-28">
      <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
      <div className="absolute inset-2 rounded-full border-2 border-primary/10" />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute w-1 h-10 bg-primary rounded-full origin-bottom"
          style={{ bottom: '50%' }}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          className="absolute w-1.5 h-8 bg-teal-500 rounded-full origin-bottom"
          style={{ bottom: '50%' }}
        />
        <div className="w-3 h-3 bg-primary rounded-full" />
      </div>
    </div>
  )
}

function WalletAnimation() {
  return (
    <div className="relative">
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: [0, 10, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="w-24 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-xl"
      >
        <Wallet className="w-10 h-10 text-white" />
      </motion.div>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: -30 - i * 15, opacity: [0, 1, 0] }}
          transition={{
            delay: 0.5 + i * 0.3,
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="absolute top-0 left-1/2 -translate-x-1/2 text-green-500 font-bold"
        >
          ₹
        </motion.div>
      ))}
    </div>
  )
}

function LeafAnimation() {
  return (
    <div className="relative w-32 h-32">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0"
      >
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${i * 90}deg) translateY(-40px)`,
            }}
          >
            <Leaf className="w-8 h-8 text-teal-500" style={{ transform: `rotate(-${i * 90}deg)` }} />
          </motion.div>
        ))}
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center"
        >
          <Leaf className="w-6 h-6 text-teal-600" />
        </motion.div>
      </div>
    </div>
  )
}

// Get animation component based on feature
function getFeatureAnimation(iconName: string) {
  switch (iconName) {
    case 'ShieldCheck':
      return <ShieldAnimation />
    case 'Users':
      return <UsersAnimation />
    case 'MapPin':
      return <MapAnimation />
    case 'AlertTriangle':
      return <AlertAnimation />
    case 'MessageCircle':
      return <ChatAnimation />
    case 'Clock':
      return <ClockAnimation />
    case 'Wallet':
      return <WalletAnimation />
    case 'Leaf':
      return <LeafAnimation />
    default:
      const Icon = featureIcons[iconName] || ShieldCheck
      return <Icon className="w-24 h-24 text-primary" />
  }
}

// Background gradients for each feature
const featureBackgrounds = [
  'from-teal-50 via-white to-primary-50',
  'from-pink-50 via-white to-purple-50',
  'from-blue-50 via-white to-teal-50',
  'from-red-50 via-white to-orange-50',
  'from-indigo-50 via-white to-blue-50',
  'from-cyan-50 via-white to-teal-50',
  'from-violet-50 via-white to-indigo-50',
  'from-green-50 via-white to-teal-50',
  'from-emerald-50 via-white to-green-50',
  'from-slate-50 via-white to-gray-50',
]

export function FeatureSection({ feature, index, isActive, totalFeatures }: FeatureSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { amount: 0.5 })
  const Icon = featureIcons[feature.icon] || ShieldCheck

  const bgGradient = featureBackgrounds[index % featureBackgrounds.length]

  return (
    <section
      ref={sectionRef}
      className={`scroll-snap-section relative bg-gradient-to-br ${bgGradient}`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 h-full flex items-center relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}
          >
            {/* Feature number */}
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <span className="text-6xl font-bold text-primary/20">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="h-px w-12 bg-primary/30" />
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Feature {index + 1} of {totalFeatures}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              {feature.title}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-xl text-gray-600 leading-relaxed mb-8"
            >
              {feature.description}
            </motion.p>

            {/* Key Feature Badge */}
            {feature.highlight && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.6, type: 'spring' }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-full font-medium"
              >
                <Icon className="w-4 h-4" />
                Key Safety Feature
              </motion.div>
            )}
          </motion.div>

          {/* Animation Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`flex items-center justify-center ${
              index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'
            }`}
          >
            <div className="relative">
              {/* Glowing background */}
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 60px 30px rgba(0, 102, 179, 0.1)',
                    '0 0 80px 40px rgba(0, 102, 179, 0.15)',
                    '0 0 60px 30px rgba(0, 102, 179, 0.1)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-full"
              />

              {/* Animation Container */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                {isInView && getFeatureAnimation(feature.icon)}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  )
}

// Navigation dots component
export function FeatureNavDots({
  totalFeatures,
  activeIndex,
  onDotClick,
}: {
  totalFeatures: number
  activeIndex: number
  onDotClick: (index: number) => void
}) {
  return (
    <div className="feature-dots hidden lg:flex">
      {Array.from({ length: totalFeatures }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`feature-dot ${activeIndex === index ? 'active' : ''}`}
          aria-label={`Go to feature ${index + 1}`}
        />
      ))}
    </div>
  )
}
