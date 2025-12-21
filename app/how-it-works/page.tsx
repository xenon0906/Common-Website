'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { InteractiveWalkthrough, PhoneMockup } from '@/components/how-it-works/InteractiveStepCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
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

// Step data for real-time rides
const realTimeSteps = [
  {
    icon: MapPin,
    title: 'Enter Your Locations',
    description: 'Set your pickup point and destination',
    details: 'Use auto-detect for instant location or manually enter addresses. Specify how many people are traveling with you for accurate matching.',
  },
  {
    icon: Search,
    title: 'Set Your Preferences',
    description: 'Customize your ride matching options',
    details: 'Choose the number of co-riders, enable female-only matching for added safety, and set your preferred search radius (750m default, expandable to 1km).',
  },
  {
    icon: Users,
    title: 'Find Verified Matches',
    description: 'Connect with nearby verified riders',
    details: 'Our algorithm instantly finds KYC-verified users heading your way. View profiles, ratings, and verification status before connecting.',
  },
  {
    icon: MessageCircle,
    title: 'Connect & Coordinate',
    description: 'Chat securely with your co-riders',
    details: 'Send ride requests to potential matches. Once accepted, a secure group chat opens for easy coordination of pickup time and location.',
  },
  {
    icon: Navigation,
    title: 'Meet at the Optimal Point',
    description: 'Navigate to your suggested meetup',
    details: 'The app calculates the most convenient meeting point for all riders. Use the built-in navigation to reach the pickup spot effortlessly.',
  },
  {
    icon: Wallet,
    title: 'Share & Save',
    description: 'Split fare and save up to 75%',
    details: 'Book your cab together, share the fare equally, and enjoy massive savings. Track your total savings over time in your profile.',
  },
]

// Step data for scheduled rides
const scheduledSteps = [
  {
    icon: Calendar,
    title: 'Plan Your Trip',
    description: 'Set date, time, and route details',
    details: 'Enter your pickup location, destination, preferred date and time. Perfect for regular commutes or planned journeys.',
  },
  {
    icon: Search,
    title: 'Browse Available Rides',
    description: 'Find existing rides matching your route',
    details: 'Search within a 2km radius to find rides posted by other users. See ride details, host profiles, and available seats.',
  },
  {
    icon: Users,
    title: 'Request to Join or Create',
    description: 'Join existing rides or host your own',
    details: 'Send join requests to suitable rides, or create your own ride and let others find you. Set preferences like gender filter and additional notes.',
  },
  {
    icon: Check,
    title: 'Confirm & Connect',
    description: 'Get confirmed and start chatting',
    details: 'Once your request is accepted (or you accept joiners), connect via group chat to finalize details before the trip.',
  },
]

// Hero section - clean, no decorative elements
function HeroSection() {
  return (
    <section className="hero-viewport bg-gradient-to-br from-primary via-primary/90 to-primary-800">
      <div className="container mx-auto px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24 2xl:px-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Two Ways to{' '}
            <span className="text-white/90">Share Rides</span>
          </h1>

          {/* Description */}
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12">
            Whether you need a ride right now or want to plan ahead, Snapgo has flexible options for every commuter.
          </p>

          {/* Simple stats row */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {[
              { value: '30 sec', label: 'Average Match Time' },
              { value: '100%', label: 'Verified Users' },
              { value: '75%', label: 'Max Savings' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                <p className="text-white/50 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Mode toggle hint */}
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
function RealTimeSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="real-time" ref={ref} className="section-padding-lg bg-white">
      <div className="container mx-auto px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24 2xl:px-32">
        {/* Section header */}
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

        {/* Interactive walkthrough */}
        <div className="max-w-3xl mx-auto">
          <InteractiveWalkthrough
            steps={realTimeSteps}
            color="teal"
            autoPlay={true}
            autoPlayDelay={5000}
          />
        </div>
      </div>
    </section>
  )
}

// Scheduled rides section
function ScheduledSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="scheduled" ref={ref} className="section-padding-lg bg-gray-50">
      <div className="container mx-auto px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24 2xl:px-32">
        {/* Section header */}
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

        {/* Interactive walkthrough */}
        <div className="max-w-3xl mx-auto">
          <InteractiveWalkthrough
            steps={scheduledSteps}
            color="primary"
            autoPlay={true}
            autoPlayDelay={5000}
          />
        </div>
      </div>
    </section>
  )
}

// Comparison section
function ComparisonSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const comparisons = [
    {
      feature: 'Match Speed',
      realTime: 'Instant (30 sec)',
      scheduled: 'Planned ahead',
      icon: Clock,
    },
    {
      feature: 'Search Radius',
      realTime: '750m - 1km',
      scheduled: 'Up to 2km',
      icon: Target,
    },
    {
      feature: 'Best For',
      realTime: 'Spontaneous trips',
      scheduled: 'Daily commutes',
      icon: Zap,
    },
    {
      feature: 'Flexibility',
      realTime: 'High - ride now',
      scheduled: 'Plan & confirm',
      icon: Navigation,
    },
  ]

  return (
    <section ref={ref} className="section-padding-lg bg-white">
      <div className="container mx-auto px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24 2xl:px-32">
        {/* Section header */}
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

        {/* Comparison cards */}
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Real-time card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-teal-50 to-white rounded-2xl p-8 border-2 border-teal-100 shadow-lg"
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
                {comparisons.map((item) => (
                  <li key={item.feature} className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-teal-500" />
                    <div>
                      <span className="text-gray-500 text-sm">{item.feature}</span>
                      <p className="font-medium text-gray-900">{item.realTime}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Scheduled card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-primary/10 to-white rounded-2xl p-8 border-2 border-primary/20 shadow-lg"
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
                {comparisons.map((item) => (
                  <li key={item.feature} className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-primary" />
                    <div>
                      <span className="text-gray-500 text-sm">{item.feature}</span>
                      <p className="font-medium text-gray-900">{item.scheduled}</p>
                    </div>
                  </li>
                ))}
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
      <div className="container mx-auto px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24 2xl:px-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Start Saving Today
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Transform Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-white">
              Commute?
            </span>
          </h2>

          {/* Description */}
          <p className="text-xl text-white/80 mb-10">
            Join thousands of smart commuters saving money and the environment with every ride.
          </p>

          {/* CTA buttons */}
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

export default function HowItWorksPage() {
  return (
    <SiteLayout>
      <HeroSection />
      <RealTimeSection />
      <ScheduledSection />
      <ComparisonSection />
      <CTASection />
    </SiteLayout>
  )
}
