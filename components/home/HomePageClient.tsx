'use client'

import { useState, useEffect, memo, Component, type ReactNode } from 'react'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { HeroPremium } from '@/components/home/HeroPremium'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LoadingAnimation,
  ServicesSection,
  HowItWorksSection,
  SnapPoolSection,
  ComparisonSection,
  CTASection,
} from '@/components/home/sections'
import {
  HeroContentData,
  TestimonialData,
  AppStoreLinksData,
} from '@/lib/content'
import type { SiteImagesConfig } from '@/lib/types/images'
import { DEFAULT_IMAGES } from '@/lib/types/images'
import TestimonialCarousel from '@/components/home/TestimonialCarousel'

// Error boundary to isolate section crashes
class SectionErrorBoundary extends Component<
  { children: ReactNode; name?: string },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; name?: string }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error(`[SectionErrorBoundary] ${this.props.name || 'Section'} crashed:`, error)
  }

  render() {
    if (this.state.hasError) {
      return null
    }
    return this.props.children
  }
}

const MemoizedHeroPremium = memo(HeroPremium)

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

export interface HomePageClientProps {
  hero: HeroContentData
  stats?: unknown[]
  features?: unknown[]
  howItWorks?: unknown[]
  testimonials: TestimonialData[]
  appLinks: AppStoreLinksData
  images?: SiteImagesConfig
}

export function HomePageClient({
  hero,
  testimonials,
  appLinks,
  images,
}: HomePageClientProps) {
  const siteImages = images || DEFAULT_IMAGES
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [contentRevealed, setContentRevealed] = useState(false)

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('snapgo_visited')

    if (hasVisited) {
      setIsLoading(false)
      setShowContent(true)
      setContentRevealed(true)
      return
    }

    const minLoadTime = setTimeout(() => {
      setIsLoading(false)
      sessionStorage.setItem('snapgo_visited', 'true')
    }, 2500)

    const showContentTimer = setTimeout(() => setShowContent(true), 2600)
    const revealTimer = setTimeout(() => setContentRevealed(true), 3000)

    return () => {
      clearTimeout(minLoadTime)
      clearTimeout(showContentTimer)
      clearTimeout(revealTimer)
    }
  }, [])

  return (
    <SiteLayout>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingAnimation key="loader" logoUrl={siteImages.logos.white} />}
      </AnimatePresence>

      {/* 1. Hero */}
      <motion.div
        initial="hidden"
        animate={showContent ? 'visible' : 'hidden'}
        custom={0}
        variants={sectionVariants}
      >
        <MemoizedHeroPremium hero={hero} heroMockupUrl={siteImages.mockups.homeScreen} />
      </motion.div>

      {/* 2. Services */}
      <SectionErrorBoundary name="ServicesSection">
        <motion.div
          initial="hidden"
          animate={contentRevealed ? 'visible' : 'hidden'}
          custom={0.1}
          variants={sectionVariants}
        >
          <ServicesSection />
        </motion.div>
      </SectionErrorBoundary>

      {/* 3. How It Works */}
      <SectionErrorBoundary name="HowItWorksSection">
        <motion.div
          initial="hidden"
          animate={contentRevealed ? 'visible' : 'hidden'}
          custom={0.15}
          variants={sectionVariants}
        >
          <HowItWorksSection />
        </motion.div>
      </SectionErrorBoundary>

      {/* 4. SnapPool — Sustainability */}
      <SectionErrorBoundary name="SnapPoolSection">
        <motion.div
          initial="hidden"
          animate={contentRevealed ? 'visible' : 'hidden'}
          custom={0.2}
          variants={sectionVariants}
        >
          <SnapPoolSection />
        </motion.div>
      </SectionErrorBoundary>

      {/* 5. Comparison */}
      <SectionErrorBoundary name="ComparisonSection">
        <motion.div
          initial="hidden"
          animate={contentRevealed ? 'visible' : 'hidden'}
          custom={0.25}
          variants={sectionVariants}
        >
          <ComparisonSection />
        </motion.div>
      </SectionErrorBoundary>

      {/* 6. Testimonials */}
      <SectionErrorBoundary name="TestimonialCarousel">
        <motion.div
          initial="hidden"
          animate={contentRevealed ? 'visible' : 'hidden'}
          custom={0.3}
          variants={sectionVariants}
        >
          <TestimonialCarousel testimonials={testimonials} />
        </motion.div>
      </SectionErrorBoundary>

      {/* 7. CTA + Download */}
      <motion.div
        id="download"
        initial="hidden"
        animate={contentRevealed ? 'visible' : 'hidden'}
        custom={0.35}
        variants={sectionVariants}
      >
        <CTASection appLinks={appLinks} />
      </motion.div>
    </SiteLayout>
  )
}
