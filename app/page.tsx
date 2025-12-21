'use client'

import { useRef, useState, useEffect } from 'react'
import { StatsCounter } from '@/components/home/StatsCounter'
import { FeaturesGrid } from '@/components/home/FeaturesGrid'
import { HowItWorks } from '@/components/home/HowItWorks'
import { TestimonialCarousel } from '@/components/home/TestimonialCarousel'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { CO2ImpactTracker } from '@/components/gamification/CO2ImpactTracker'
import { SavingsCalculator } from '@/components/gamification/SavingsCalculator'
import { HeroPremium } from '@/components/home/HeroPremium'
import { InstagramSection } from '@/components/home/InstagramSection'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import {
  DownloadIcon,
  ArrowRightIcon,
  SmartphoneIcon,
  CarIcon,
  UsersIcon,
  MapPinIcon,
  SparklesIcon,
  ShieldIcon,
  WalletIcon,
  ClockIcon,
  HeartIcon,
  LeafIcon,
  StarIcon,
  CheckCircleIcon,
  ZapIcon
} from '@/components/ui/icon'

// Minimal Professional Loading Animation
function LoadingAnimation() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] min-h-screen bg-primary flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src="/images/logo/Snapgo Logo White.png"
            alt="Snapgo"
            width={72}
            height={72}
            className="object-contain"
            priority
          />
        </motion.div>

        {/* Simple loading bar */}
        <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </motion.div>
  )
}


// Why Snapgo Section - Enhanced with Asymmetric Layout
function WhySnapgoSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const reasons = [
    {
      icon: WalletIcon,
      title: 'Save Up to 75%',
      description: 'Split your cab fare with verified co-riders going your way',
      gradient: 'from-teal-50 to-primary-50',
      iconBg: 'bg-teal-100',
      iconBgHover: 'hover:bg-teal-200',
      iconColor: 'text-teal-600',
      shadowClass: 'hover:shadow-teal-500/20'
    },
    {
      icon: ShieldIcon,
      title: '100% Verified Users',
      description: 'Aadhaar-based KYC ensures everyone on the platform is verified',
      gradient: 'from-primary-50 to-purple-50',
      iconBg: 'bg-primary-100',
      iconBgHover: 'hover:bg-primary-200',
      iconColor: 'text-primary',
      shadowClass: 'hover:shadow-primary/20'
    },
    {
      icon: ClockIcon,
      title: 'Real-Time Matching',
      description: 'Find co-riders within 750m radius in seconds, not minutes',
      gradient: 'from-purple-50 to-teal-50',
      iconBg: 'bg-purple-100',
      iconBgHover: 'hover:bg-purple-200',
      iconColor: 'text-purple-600',
      shadowClass: 'hover:shadow-purple-500/20'
    },
    {
      icon: LeafIcon,
      title: 'Eco-Friendly Travel',
      description: 'Reduce carbon footprint by sharing rides instead of traveling alone',
      gradient: 'from-teal-50 to-primary-50',
      iconBg: 'bg-teal-100',
      iconBgHover: 'hover:bg-teal-200',
      iconColor: 'text-teal-600',
      shadowClass: 'hover:shadow-teal-500/20'
    },
  ]

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container mx-auto px-4">
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
            The Smarter Way to
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal via-primary to-purple"> Commute</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Join thousands of verified users already saving money and reducing their carbon footprint.
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, index) => {
            // Asymmetric: odd indices shifted up, even shifted down on desktop
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
                  {/* Glow effect when hovered */}
                  {isHovered && (
                    <motion.div
                      className="absolute -inset-2 rounded-3xl bg-teal/20 blur-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                  <Card className={`h-full border-0 bg-gradient-to-br ${reason.gradient} backdrop-blur-sm hover:shadow-2xl ${reason.shadowClass} transition-all duration-500 relative overflow-hidden`}>
                    {/* Number badge */}
                    <motion.div
                      className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-900/10 text-xs font-bold flex items-center justify-center text-gray-700"
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                    >
                      {index + 1}
                    </motion.div>
                    <CardContent className="p-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-14 h-14 rounded-2xl ${reason.iconBg} ${reason.iconBgHover} flex items-center justify-center mb-4 transition-colors relative`}
                      >
                        <reason.icon className={`w-7 h-7 ${reason.iconColor}`} />
                        {/* Pulse effect when hovered */}
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
                      <p className="text-muted-foreground text-sm">{reason.description}</p>
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

// Trust Badges Section - Scrolling Marquee
function TrustBadgesSection() {
  const badges = [
    { icon: ShieldIcon, label: 'DPIIT Certified' },
    { icon: StarIcon, label: 'Startup India' },
    { icon: CheckCircleIcon, label: 'Aadhaar Verified' },
    { icon: UsersIcon, label: '8500+ Users' },
    { icon: MapPinIcon, label: '110+ Daily Rides' },
    { icon: HeartIcon, label: 'Trusted Platform' },
    { icon: ZapIcon, label: 'Real-Time Matching' },
    { icon: LeafIcon, label: 'Eco-Friendly' },
  ]

  return (
    <section className="py-8 bg-muted/30 overflow-hidden border-y border-border/50">
      <div className="flex animate-marquee">
        {[...badges, ...badges].map((badge, index) => (
          <div
            key={`${badge.label}-${index}`}
            className="flex items-center gap-2 px-8 py-2 whitespace-nowrap"
          >
            <badge.icon className="w-5 h-5 text-teal" />
            <span className="text-sm font-medium text-muted-foreground">{badge.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

// Download App Section with QR Codes - Enhanced
function DownloadSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="section-padding-lg bg-gray-50">
      <div className="container mx-auto px-4">
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
            <DownloadIcon className="w-4 h-4 text-teal" />
            <span className="text-teal text-sm font-semibold">Get the App</span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Download <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal to-primary">Snapgo</span> Today
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Start saving on your daily commute. Scan the QR code or click to download.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Android */}
          <motion.div
            initial={{ opacity: 0, x: -50, rotateY: -10 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.25, delay: 0.05, ease: [0.34, 1.56, 0.64, 1] }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group"
          >
            <Card className="h-full border-2 border-transparent hover:border-[#3DDC84]/50 transition-all duration-500 overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.15 }}
                    className="w-16 h-16 rounded-2xl bg-[#3DDC84]/10 flex items-center justify-center"
                  >
                    <svg className="w-10 h-10 text-[#3DDC84]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.6 11.4c-.3 0-.5-.2-.5-.5s.2-.5.5-.5.5.2.5.5-.2.5-.5.5m-11.2 0c-.3 0-.5-.2-.5-.5s.2-.5.5-.5.5.2.5.5-.2.5-.5.5M18.1 7l1.8-3.2c.1-.2 0-.4-.2-.5s-.4 0-.5.2l-1.8 3.3C15.7 5.7 13.9 5 12 5s-3.7.7-5.4 1.8L4.8 3.5c-.1-.2-.3-.3-.5-.2s-.3.3-.2.5L5.9 7C3.1 8.8 1.3 11.5 1 14.5h22c-.3-3-2.1-5.7-4.9-7.5"/>
                    </svg>
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold">Android</h3>
                    <p className="text-muted-foreground">Google Play Store</p>
                  </div>
                </div>

                {/* QR Code - Android Live */}
                <motion.div
                  className="bg-white rounded-2xl p-4 w-52 h-52 mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <Image
                      src="/images/qr code/playstore-qr.png"
                      alt="Download Snapgo on Google Play Store"
                      fill
                      className="object-contain"
                    />
                  </div>
                </motion.div>

                <Badge className="mb-4 bg-[#3DDC84]/20 text-[#3DDC84] border-[#3DDC84]/30">
                  <CheckCircleIcon className="w-3 h-3 mr-1" /> Live on Play Store
                </Badge>

                <Button variant="gradient" className="w-full group" size="lg" asChild>
                  <Link href="https://play.google.com/store/apps/details?id=com.snapgo.app" target="_blank">
                    <DownloadIcon className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                    Download for Android
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* iOS */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: 10 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.25, delay: 0.08, ease: [0.34, 1.56, 0.64, 1] }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group"
          >
            <Card className="h-full border-2 border-transparent hover:border-gray-400/50 transition-all duration-500 overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.15 }}
                    className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center"
                  >
                    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold">iOS</h3>
                    <p className="text-muted-foreground">App Store</p>
                  </div>
                </div>

                {/* QR Code - iOS Live */}
                <motion.div
                  className="bg-white rounded-2xl p-4 w-52 h-52 mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <Image
                      src="/images/qr code/appstore-qr.png"
                      alt="Download Snapgo on App Store"
                      fill
                      className="object-contain"
                    />
                  </div>
                </motion.div>

                <Badge className="mb-4 bg-gray-800 text-white border-gray-600">
                  <CheckCircleIcon className="w-3 h-3 mr-1" /> Live on App Store
                </Badge>

                <Button variant="gradient" className="w-full group" size="lg" asChild>
                  <Link href="https://apps.apple.com/app/snapgo/id6739696498" target="_blank">
                    <DownloadIcon className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                    Download for iOS
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// CTA Section component - Enhanced
function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="section-padding-lg bg-[#0066B3]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 0.05, type: 'spring', stiffness: 250, damping: 12 }}
              className="inline-flex items-center gap-2 px-4 py-2 glass-dark rounded-full mb-6"
            >
              <SparklesIcon className="w-4 h-4 text-teal-300" />
              <span className="text-white text-sm font-semibold">Start Your Journey</span>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Ready to Start{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-teal-100">Saving?</span>
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join thousands of verified users saving up to 75% on their daily commute with Snapgo.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="xl" className="bg-white text-primary hover:bg-white/90 shadow-2xl shadow-white/20" asChild>
                  <Link href="#download">
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    Download Now
                  </Link>
                </Button>
              </motion.div>
              <Button
                size="xl"
                variant="glass"
                className="text-white border-white/30 transition-transform duration-200 hover:scale-105 active:scale-95"
                asChild
              >
                <Link href="/how-it-works">
                  Learn More
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-8 mt-12"
            >
              {[
                { value: '8500+', label: 'Happy Users' },
                { value: '75%', label: 'Cost Savings' },
                { value: '110+', label: 'Daily Rides' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-teal-300">{stat.value}</div>
                  <div className="text-white/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// App Preview Section with enhanced scroll animations
function AppPreviewSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  const screens = [
    { file: 'home-screen', label: 'Home Screen', description: 'Find rides instantly' },
    { file: 'search-trip', label: 'Search Trip', description: 'Smart matching' },
    { file: 'create-trip', label: 'Create Trip', description: 'Share your ride' },
    { file: 'my-trips', label: 'My Trips', description: 'Track everything' },
  ]

  return (
    <section ref={containerRef} className="section-padding-lg bg-white">
      <div className="container mx-auto px-4">
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
            <SmartphoneIcon className="w-4 h-4 text-teal" />
            <span className="text-teal text-sm font-semibold">App Preview</span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            See <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal to-primary">Snapgo</span> in Action
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            A beautiful, intuitive app designed for seamless ride-sharing experiences.
          </p>
        </motion.div>

        {/* Phone mockups */}
        <div className="flex justify-center items-end gap-4 md:gap-8 overflow-x-auto pb-8 no-scrollbar px-4">
          {screens.map((screen, index) => {
            const isCenter = index === 1 || index === 2

            return (
              <motion.div
                key={screen.file}
                initial={{ opacity: 0, y: 100, rotateY: index < 2 ? -15 : 15 }}
                animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
                transition={{ duration: 0.25, delay: index * 0.03, ease: [0.34, 1.56, 0.64, 1] }}
                whileHover={{ y: -20, scale: 1.05, rotateY: 5 }}
                className="flex-shrink-0 group cursor-pointer"
                style={{ perspective: 1000 }}
              >
                <div className={`relative ${isCenter ? 'w-48 md:w-60' : 'w-40 md:w-48'} aspect-[9/19] rounded-[2.5rem] overflow-hidden shadow-2xl group-hover:shadow-teal/20 transition-all duration-500`}>
                  {/* Phone frame */}
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2.5rem]" />
                  {/* Screen */}
                  <div className="absolute inset-[3px] rounded-[2.3rem] overflow-hidden bg-black">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-20" />
                    <Image
                      src={`/images/mockups/${screen.file}.png`}
                      alt={`Snapgo ${screen.label}`}
                      fill
                      className="object-cover"
                    />
                    {/* Overlay gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="text-white text-center w-full">
                        <p className="font-semibold">{screen.label}</p>
                        <p className="text-xs text-white/70">{screen.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  // Start with consistent initial state for SSR hydration
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [contentRevealed, setContentRevealed] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)

    // Check if already visited in this session
    const hasVisited = sessionStorage.getItem('snapgo_visited')

    if (hasVisited) {
      // Already visited - skip loader, show content immediately
      setIsLoading(false)
      setShowContent(true)
      setContentRevealed(true)
      return
    }

    // First visit - show minimal loader (2.5 seconds)
    const minLoadTime = setTimeout(() => {
      setIsLoading(false)
      sessionStorage.setItem('snapgo_visited', 'true')
    }, 2500)

    // Start revealing content after loader starts fading
    const showContentTimer = setTimeout(() => {
      setShowContent(true)
    }, 2600)

    // Trigger content reveal animation
    const revealTimer = setTimeout(() => {
      setContentRevealed(true)
    }, 3000)

    return () => {
      clearTimeout(minLoadTime)
      clearTimeout(showContentTimer)
      clearTimeout(revealTimer)
    }
  }, [])

  return (
    <SiteLayout>
      {/* Loading Screen with AnimatePresence for smooth exit */}
      <AnimatePresence mode="wait">
        {isLoading && <LoadingAnimation key="loader" />}
      </AnimatePresence>

      {/* Premium Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{
          opacity: showContent ? 1 : 0,
          y: showContent ? 0 : 30,
          scale: showContent ? 1 : 0.98
        }}
        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <HeroPremium />
      </motion.div>

      {/* Trust Badges Marquee */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: contentRevealed ? 1 : 0,
          y: contentRevealed ? 0 : 20
        }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <TrustBadgesSection />
      </motion.div>

      {/* Why Snapgo - New Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: contentRevealed ? 1 : 0,
          y: contentRevealed ? 0 : 30
        }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <WhySnapgoSection />
      </motion.div>

      {/* Stats Counter Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: contentRevealed ? 1 : 0,
          y: contentRevealed ? 0 : 30
        }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <StatsCounter />
      </motion.div>

      {/* CO2 Impact Tracker - Gamification */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: contentRevealed ? 1 : 0,
          y: contentRevealed ? 0 : 30
        }}
        transition={{ duration: 0.6, delay: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <CO2ImpactTracker />
      </motion.div>

      {/* Savings Calculator - Gamification */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: contentRevealed ? 1 : 0,
          y: contentRevealed ? 0 : 30
        }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <SavingsCalculator />
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: contentRevealed ? 1 : 0,
          y: contentRevealed ? 0 : 30
        }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <FeaturesGrid />
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: contentRevealed ? 1 : 0,
          y: contentRevealed ? 0 : 30
        }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <HowItWorks />
      </motion.div>

      {/* App Preview */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: contentRevealed ? 1 : 0,
          y: contentRevealed ? 0 : 30
        }}
        transition={{ duration: 0.6, delay: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <AppPreviewSection />
      </motion.div>

      {/* Download Section with QR Codes */}
      <motion.div
        id="download"
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: contentRevealed ? 1 : 0,
          y: contentRevealed ? 0 : 30
        }}
        transition={{ duration: 0.6, delay: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <DownloadSection />
      </motion.div>

      {/* Testimonials */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: contentRevealed ? 1 : 0,
          y: contentRevealed ? 0 : 30
        }}
        transition={{ duration: 0.6, delay: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <TestimonialCarousel />
      </motion.div>

      {/* Instagram Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: contentRevealed ? 1 : 0,
          y: contentRevealed ? 0 : 30
        }}
        transition={{ duration: 0.6, delay: 0.85, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <InstagramSection />
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: contentRevealed ? 1 : 0,
          y: contentRevealed ? 0 : 30
        }}
        transition={{ duration: 0.6, delay: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <CTASection />
      </motion.div>
    </SiteLayout>
  )
}
