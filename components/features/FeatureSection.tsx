'use client'

import { motion } from 'framer-motion'
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
  LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  Users,
  MapPin,
  AlertTriangle,
  MessageCircle,
  Clock,
  Navigation,
  Wallet,
  Leaf,
}

interface Feature {
  icon: string
  title: string
  description: string
  highlight?: boolean
}

interface FeatureSectionProps {
  feature: Feature
  index: number
  isActive: boolean
  totalFeatures: number
}

export function FeatureSection({ feature, index, isActive, totalFeatures }: FeatureSectionProps) {
  const Icon = iconMap[feature.icon] || ShieldCheck
  const isEven = index % 2 === 0

  return (
    <section
      className={cn(
        'scroll-snap-section relative overflow-hidden',
        isEven
          ? 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
          : 'bg-gradient-to-br from-slate-100 via-slate-50 to-white'
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={cn(
            'absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-30',
            isEven ? '-right-40 -top-40' : '-left-40 -bottom-40',
            feature.highlight ? 'bg-teal/30' : 'bg-primary/20'
          )}
        />
      </div>

      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 h-full flex items-center">
        <div
          className={cn(
            'grid md:grid-cols-2 gap-12 items-center w-full',
            isEven ? '' : 'md:flex-row-reverse'
          )}
        >
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0.3, x: isEven ? -20 : 20 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={cn(isEven ? '' : 'md:order-2')}
          >
            <div className="flex items-center gap-4 mb-6">
              <div
                className={cn(
                  'w-14 h-14 rounded-xl flex items-center justify-center',
                  feature.highlight
                    ? 'bg-teal text-white'
                    : 'bg-primary/10 text-primary'
                )}
              >
                <Icon className="w-7 h-7" />
              </div>
              {feature.highlight && (
                <span className="px-3 py-1 bg-teal/10 text-teal text-sm font-medium rounded-full">
                  Key Feature
                </span>
              )}
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
              {feature.title}
            </h2>

            <p className="text-lg text-slate-600 leading-relaxed">
              {feature.description}
            </p>

            <div className="mt-8 flex items-center gap-4 text-sm text-slate-400">
              <span>Feature {index + 1} of {totalFeatures}</span>
            </div>
          </motion.div>

          {/* Visual/Icon side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.3, scale: 0.9 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={cn(
              'flex items-center justify-center',
              isEven ? 'md:order-2' : ''
            )}
          >
            <div
              className={cn(
                'relative w-64 h-64 md:w-80 md:h-80 rounded-3xl flex items-center justify-center',
                feature.highlight
                  ? 'bg-gradient-to-br from-teal/20 to-teal/5'
                  : 'bg-gradient-to-br from-primary/20 to-primary/5'
              )}
            >
              <Icon
                className={cn(
                  'w-32 h-32 md:w-40 md:h-40',
                  feature.highlight ? 'text-teal/60' : 'text-primary/60'
                )}
                strokeWidth={1}
              />

              {/* Decorative rings */}
              <div
                className={cn(
                  'absolute inset-4 rounded-2xl border-2 border-dashed',
                  feature.highlight ? 'border-teal/20' : 'border-primary/20'
                )}
              />
              <div
                className={cn(
                  'absolute -inset-4 rounded-[2rem] border',
                  feature.highlight ? 'border-teal/10' : 'border-primary/10'
                )}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

interface FeatureNavDotsProps {
  totalFeatures: number
  activeIndex: number
  onDotClick: (index: number) => void
}

export function FeatureNavDots({ totalFeatures, activeIndex, onDotClick }: FeatureNavDotsProps) {
  return (
    <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      {Array.from({ length: totalFeatures }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={cn(
            'w-3 h-3 rounded-full transition-all duration-300',
            activeIndex === index
              ? 'bg-primary scale-125'
              : 'bg-slate-300 hover:bg-slate-400'
          )}
          aria-label={`Go to section ${index + 1}`}
        />
      ))}
    </div>
  )
}
