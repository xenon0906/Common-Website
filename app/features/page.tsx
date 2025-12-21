'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { FeatureSection, FeatureNavDots } from '@/components/features/FeatureSection'
import Link from 'next/link'
import { Download, ChevronDown } from 'lucide-react'

// Feature data for scroll-snap sections
const features = [
  {
    icon: 'ShieldCheck',
    title: 'Aadhaar KYC Verification',
    description: 'All users are verified through Aadhaar and DigiLocker integration. Every profile displays a KYC-approved badge, eliminating fake profiles and ensuring complete identity verification. Your safety starts with knowing who you\'re riding with.',
    highlight: true,
  },
  {
    icon: 'Users',
    title: 'Female-Only Option',
    description: 'Women can filter to connect exclusively with verified female riders for enhanced safety and comfort. This feature empowers women to travel confidently, knowing they\'re matched with fellow verified female commuters.',
    highlight: true,
  },
  {
    icon: 'MapPin',
    title: 'Smart Radius Matching',
    description: 'Our intelligent algorithm matches riders within a 750m radius for both source and destination, ensuring perfect route alignment. The radius auto-expands to 1km if no immediate matches are found, maximizing your ride opportunities.',
    highlight: false,
  },
  {
    icon: 'AlertTriangle',
    title: 'SOS Safety Feature',
    description: 'One-tap emergency alert instantly shares your live location and complete trip details with your saved emergency contacts. In any situation, help is just one tap away. Your safety is our absolute priority.',
    highlight: true,
  },
  {
    icon: 'MessageCircle',
    title: 'In-App Group Chat',
    description: 'A secure group chat is automatically created when riders match. Coordinate pickup points, share ETAs, and communicate seamlessly with your co-riders without exchanging personal phone numbers.',
    highlight: false,
  },
  {
    icon: 'Clock',
    title: 'Real-Time & Scheduled Rides',
    description: 'Need a ride now? Find matches instantly. Planning ahead? Schedule rides in advance. Snapgo adapts to your lifestyle, whether you\'re spontaneous or prefer to plan your commute meticulously.',
    highlight: false,
  },
  {
    icon: 'Navigation',
    title: 'Optimal Path Suggestion',
    description: 'Our smart algorithm calculates and suggests the most convenient meeting point for all matched riders. No more complicated coordination—just show up at the optimized pickup location.',
    highlight: false,
  },
  {
    icon: 'Wallet',
    title: 'Transparent Fare Splitting',
    description: 'Crystal-clear cost breakdown shows exactly what you pay. Save up to 75% compared to solo cab rides. If no match is found, you get an instant refund—no questions asked, no delays.',
    highlight: false,
  },
  {
    icon: 'Leaf',
    title: 'Eco-Friendly Impact',
    description: 'Every shared ride contributes to a greener planet. Track your personal carbon footprint savings and see the collective impact. Together, we\'re reducing traffic congestion and urban pollution.',
    highlight: false,
  },
]

export default function FeaturesPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  // Handle scroll to update active index
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const sectionHeight = window.innerHeight
      const newIndex = Math.round(scrollTop / sectionHeight)
      setActiveIndex(Math.min(newIndex, features.length - 1))
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle dot click navigation
  const handleDotClick = useCallback((index: number) => {
    const container = containerRef.current
    if (!container || isScrolling) return

    setIsScrolling(true)
    const sectionHeight = window.innerHeight
    container.scrollTo({
      top: index * sectionHeight,
      behavior: 'smooth',
    })

    setTimeout(() => setIsScrolling(false), 800)
  }, [isScrolling])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        if (activeIndex < features.length - 1) {
          handleDotClick(activeIndex + 1)
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        if (activeIndex > 0) {
          handleDotClick(activeIndex - 1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, handleDotClick])

  return (
    <SiteLayout hideFooter>
      {/* Scroll-snap container */}
      <div
        ref={containerRef}
        className="scroll-snap-container"
      >
        {/* Hero Section - Centered content like How It Works page */}
        <section className="scroll-snap-section relative bg-gradient-to-br from-primary via-primary/90 to-primary-800">
          <div className="container mx-auto px-4 h-full flex flex-col justify-center text-center">
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Features Built for{' '}
              <span className="text-white/90">Safe Travel</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12">
              Every feature is meticulously designed with your safety, savings, and convenience at its core.
            </p>

            {/* Simple stats row */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              {[
                { value: '100%', label: 'KYC Verified' },
                { value: '75%', label: 'Cost Savings' },
                { value: '24/7', label: 'Support' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                  <p className="text-white/50 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleDotClick(1)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-xl font-medium hover:bg-white/90 transition-colors"
              >
                View All Features
                <ChevronDown className="w-5 h-5" />
              </button>
              <Link
                href="/#download"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors border border-white/20"
              >
                <Download className="w-5 h-5" />
                Download App
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Sections */}
        {features.map((feature, index) => (
          <FeatureSection
            key={feature.title}
            feature={feature}
            index={index}
            isActive={activeIndex === index + 1}
            totalFeatures={features.length}
          />
        ))}

        {/* Final CTA Section */}
        <section className="scroll-snap-section bg-gradient-to-br from-primary via-primary/90 to-teal-600">
          <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
            {/* Title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Start Your Smart Commute{' '}
              <span className="text-teal-300">Today</span>
            </h2>

            {/* Description */}
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
              Join thousands of verified users who save money, reduce emissions, and travel safely with Snapgo.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              {[
                { value: '8.5K+', label: 'Users' },
                { value: '75%', label: 'Average Savings' },
                { value: '4.8★', label: 'App Rating' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-teal-300">{stat.value}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons - Matching styles */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/#download"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0066B3] rounded-xl font-semibold hover:bg-white/90 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Now
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white border border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-colors"
              >
                See How It Works
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Navigation Dots - Fixed on side (only dots, no arrows) */}
      <FeatureNavDots
        totalFeatures={features.length + 2} // +2 for hero and CTA
        activeIndex={activeIndex}
        onDotClick={handleDotClick}
      />
    </SiteLayout>
  )
}
