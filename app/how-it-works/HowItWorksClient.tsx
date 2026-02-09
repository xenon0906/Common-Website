'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { InteractiveWalkthrough, PhoneMockup } from '@/components/how-it-works/InteractiveStepCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import type { SiteImagesConfig } from '@/lib/types/images'
import type { HowItWorksDetailedStep, HowItWorksComparison } from '@/lib/content'
import type { LucideIcon } from 'lucide-react'
import {
  MapPin,
  Search,
  Users,
  MessageCircle,
  Navigation,
  Wallet,
  Calendar,
  Zap,
  Target,
  Download,
  Sparkles,
  ArrowRight,
  Check,
  Clock,
  Shield,
} from 'lucide-react'

// Map icon string names to Lucide components
const ICON_MAP: Record<string, LucideIcon> = {
  MapPin,
  Search,
  Users,
  MessageCircle,
  Navigation,
  Wallet,
  Calendar,
  Zap,
  Target,
  Download,
  Sparkles,
  ArrowRight,
  Check,
  Clock,
  Shield,
}

function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] || MapPin
}

interface HowItWorksClientProps {
  realTimeSteps: HowItWorksDetailedStep[]
  scheduledSteps: HowItWorksDetailedStep[]
  comparisons: HowItWorksComparison[]
  images: SiteImagesConfig
}

// Hero section
function HeroSection() {
  return (
    <section className="hero-viewport bg-gradient-to-br from-primary via-primary/90 to-primary-800">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Two Ways to{' '}
            <span className="text-white/90">Share Rides</span>
          </h1>

          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12">
            Whether you need a ride right now or want to plan ahead, Snapgo has flexible options for every commuter.
          </p>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
            {[
              { value: '30 sec', label: 'Average Match Time' },
              { value: '100%', label: 'Verified Users' },
              { value: '75%', label: 'Max Savings' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="text-xl sm:text-2xl font-bold text-white">{stat.value}</span>
                <p className="text-white/50 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <a
              href="#real-time"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-xl font-medium hover:bg-white/90 transition-colors"
            >
              <Zap className="w-5 h-5" />
              Real-Time Rides
            </a>
            <a
              href="#scheduled"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors border border-white/20"
            >
              <Calendar className="w-5 h-5" />
              Scheduled Rides
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// Real-time rides section
function RealTimeSection({ steps, mockupUrl }: { steps: HowItWorksDetailedStep[]; mockupUrl: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const mappedSteps = steps.map(s => ({
    icon: getIcon(s.icon),
    title: s.title,
    description: s.description,
    details: s.details,
  }))

  return (
    <section id="real-time" ref={ref} className="section-padding-lg bg-white">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full text-teal-600 text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Real-Time Rides
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find a Ride{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">
              Instantly
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Connect with verified riders within 750m radius in seconds. Perfect for spontaneous trips.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div>
            <InteractiveWalkthrough
              steps={mappedSteps}
              color="teal"
              autoPlay={true}
              autoPlayDelay={5000}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative w-[260px] xl:w-[300px]">
              <Image
                src={mockupUrl}
                alt="Snapgo Real-Time Rides - Find nearby trips instantly"
                width={300}
                height={600}
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Scheduled rides section
function ScheduledSection({ steps, mockupUrl }: { steps: HowItWorksDetailedStep[]; mockupUrl: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const mappedSteps = steps.map(s => ({
    icon: getIcon(s.icon),
    title: s.title,
    description: s.description,
    details: s.details,
  }))

  return (
    <section id="scheduled" ref={ref} className="section-padding-lg bg-gray-50">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
            <Calendar className="w-4 h-4" />
            Scheduled Rides
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Plan Ahead for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              Better Matches
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            2km search radius for more options. Create or join rides for guaranteed matches.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:flex justify-center order-2 lg:order-1"
          >
            <div className="relative w-[260px] xl:w-[300px]">
              <Image
                src={mockupUrl}
                alt="Snapgo Scheduled Rides - Plan your trip with date and time"
                width={300}
                height={600}
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>
          </motion.div>

          <div className="order-1 lg:order-2">
            <InteractiveWalkthrough
              steps={mappedSteps}
              color="primary"
              autoPlay={true}
              autoPlayDelay={5000}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// Comparison section
function ComparisonSection({ comparisons }: { comparisons: HowItWorksComparison[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="section-padding-lg bg-white">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Style
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Both options offer the same safety features and savings—pick what works for you.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Real-time card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-teal-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border-2 border-teal-100 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-teal-500 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900">Real-Time</h3>
                  <p className="text-teal-600 text-sm">Instant matching</p>
                </div>
              </div>
              <ul className="space-y-4">
                {comparisons.map((item) => {
                  const Icon = getIcon(item.icon)
                  return (
                    <li key={item.feature} className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-teal-500" />
                      <div>
                        <span className="text-gray-500 text-sm">{item.feature}</span>
                        <p className="font-medium text-gray-900">{item.realTime}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </motion.div>

            {/* Scheduled card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-primary/10 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border-2 border-primary/20 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900">Scheduled</h3>
                  <p className="text-primary text-sm">Plan ahead</p>
                </div>
              </div>
              <ul className="space-y-4">
                {comparisons.map((item) => {
                  const Icon = getIcon(item.icon)
                  return (
                    <li key={item.feature} className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-primary" />
                      <div>
                        <span className="text-gray-500 text-sm">{item.feature}</span>
                        <p className="font-medium text-gray-900">{item.scheduled}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

// CTA section
function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="section-padding-lg bg-gradient-to-br from-primary via-primary/90 to-teal-600">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Start Saving Today
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Transform Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-white">
              Commute?
            </span>
          </h2>

          <p className="text-xl text-white/80 mb-10">
            Join thousands of smart commuters saving money and the environment with every ride.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="xl"
                className="bg-white text-primary hover:bg-white/90 shadow-2xl shadow-white/20"
                asChild
              >
                <Link href="/#download">
                  <Download className="w-5 h-5 mr-2" />
                  Download Snapgo
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="xl"
                className="bg-teal-500 text-white hover:bg-teal-600 shadow-lg shadow-teal-500/30"
                asChild
              >
                <Link href="/features">
                  Explore Features
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default function HowItWorksClient({ realTimeSteps, scheduledSteps, comparisons, images }: HowItWorksClientProps) {
  return (
    <SiteLayout>
      <HeroSection />
      <RealTimeSection steps={realTimeSteps} mockupUrl={images.mockups.homeScreen} />
      <ScheduledSection steps={scheduledSteps} mockupUrl={images.mockups.createTrip} />
      <ComparisonSection comparisons={comparisons} />
      <CTASection />
    </SiteLayout>
  )
}
