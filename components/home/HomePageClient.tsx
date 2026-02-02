'use client'

import { useState, useEffect, memo, Component, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { HeroPremium } from '@/components/home/HeroPremium'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SectionLoader,
  LoadingAnimation,
  WhySnapgoSection,
  TrustBadgesSection,
  DownloadSection,
  CTASection,
  AppPreviewSection,
} from '@/components/home/sections'
import {
  HeroContentData,
  StatisticData,
  FeatureData,
  HowItWorksStepData,
  TestimonialData,
  AppStoreLinksData,
} from '@/lib/content'
import type { SiteImagesConfig } from '@/lib/types/images'
import { DEFAULT_IMAGES } from '@/lib/types/images'

// Error boundary to isolate section crashes from taking down the whole page
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

// Dynamic imports for heavy components (loaded only when needed)
const StatsCounter = dynamic(
  () => import('@/components/home/StatsCounter'),
  { loading: () => <SectionLoader /> }
)

const FeaturesGrid = dynamic(
  () => import('@/components/home/FeaturesGrid'),
  { loading: () => <SectionLoader /> }
)

const HowItWorks = dynamic(
  () => import('@/components/home/HowItWorks'),
  { loading: () => <SectionLoader /> }
)

const TestimonialCarousel = dynamic(
  () => import('@/components/home/TestimonialCarousel'),
  { loading: () => <SectionLoader /> }
)

const CO2ImpactTracker = dynamic(
  () => import('@/components/gamification/CO2ImpactTracker'),
  { loading: () => <SectionLoader /> }
)

const SavingsCalculator = dynamic(
  () => import('@/components/gamification/SavingsCalculator'),
  { loading: () => <SectionLoader /> }
)

const InstagramSection = dynamic(
  () => import('@/components/home/InstagramSection'),
  { loading: () => <SectionLoader />, ssr: false }
)

const CabPoolingComparison = dynamic(
  () => import('@/components/home/CabPoolingComparison'),
  { loading: () => <SectionLoader /> }
)

// Memoized hero component for performance
const MemoizedHeroPremium = memo(HeroPremium)

// Animation variants for consistent page-wide animations
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.34, 1.56, 0.64, 1] },
  }),
}

// Props interface for HomePageClient
export interface HomePageClientProps {
  hero: HeroContentData
  stats: StatisticData[]
  features: FeatureData[]
  howItWorks: HowItWorksStepData[]
  testimonials: TestimonialData[]
  appLinks: AppStoreLinksData
  images?: SiteImagesConfig
}

export function HomePageClient({
  hero,
  stats,
  features,
  howItWorks,
  testimonials,
  appLinks,
  images,
}: HomePageClientProps) {
  const siteImages = images || DEFAULT_IMAGES
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [contentRevealed, setContentRevealed] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
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

      <motion.div
        initial="hidden"
        animate={showContent ? 'visible' : 'hidden'}
        custom={0}
        variants={sectionVariants}
      >
        <MemoizedHeroPremium hero={hero} heroMockupUrl={siteImages.mockups.homeScreen} />
      </motion.div>

      <motion.div
        initial="hidden"
        animate={contentRevealed ? 'visible' : 'hidden'}
        custom={0.1}
        variants={sectionVariants}
      >
        <TrustBadgesSection />
      </motion.div>

      <motion.div
        initial="hidden"
        animate={contentRevealed ? 'visible' : 'hidden'}
        custom={0.2}
        variants={sectionVariants}
      >
        <WhySnapgoSection />
      </motion.div>

      <SectionErrorBoundary name="CabPoolingComparison">
        <motion.div
          initial="hidden"
          animate={contentRevealed ? 'visible' : 'hidden'}
          custom={0.25}
          variants={sectionVariants}
        >
          <CabPoolingComparison />
        </motion.div>
      </SectionErrorBoundary>

      <SectionErrorBoundary name="StatsCounter">
        <motion.div
          initial="hidden"
          animate={contentRevealed ? 'visible' : 'hidden'}
          custom={0.3}
          variants={sectionVariants}
        >
          <StatsCounter stats={stats} />
        </motion.div>
      </SectionErrorBoundary>

      <SectionErrorBoundary name="CO2ImpactTracker">
        <motion.div
          initial="hidden"
          animate={contentRevealed ? 'visible' : 'hidden'}
          custom={0.35}
          variants={sectionVariants}
        >
          <CO2ImpactTracker />
        </motion.div>
      </SectionErrorBoundary>

      <SectionErrorBoundary name="SavingsCalculator">
        <motion.div
          initial="hidden"
          animate={contentRevealed ? 'visible' : 'hidden'}
          custom={0.4}
          variants={sectionVariants}
        >
          <SavingsCalculator />
        </motion.div>
      </SectionErrorBoundary>

      <SectionErrorBoundary name="FeaturesGrid">
        <motion.div
          initial="hidden"
          animate={contentRevealed ? 'visible' : 'hidden'}
          custom={0.4}
          variants={sectionVariants}
        >
          <FeaturesGrid features={features} />
        </motion.div>
      </SectionErrorBoundary>

      <SectionErrorBoundary name="HowItWorks">
        <motion.div
          initial="hidden"
          animate={contentRevealed ? 'visible' : 'hidden'}
          custom={0.5}
          variants={sectionVariants}
        >
          <HowItWorks steps={howItWorks} />
        </motion.div>
      </SectionErrorBoundary>

      <SectionErrorBoundary name="AppPreviewSection">
        <motion.div
          initial="hidden"
          animate={contentRevealed ? 'visible' : 'hidden'}
          custom={0.6}
          variants={sectionVariants}
        >
          <AppPreviewSection mockups={siteImages.mockups} />
        </motion.div>
      </SectionErrorBoundary>

      <motion.div
        id="download"
        initial="hidden"
        animate={contentRevealed ? 'visible' : 'hidden'}
        custom={0.7}
        variants={sectionVariants}
      >
        <DownloadSection appLinks={appLinks} />
      </motion.div>

      <SectionErrorBoundary name="TestimonialCarousel">
        <motion.div
          initial="hidden"
          animate={contentRevealed ? 'visible' : 'hidden'}
          custom={0.8}
          variants={sectionVariants}
        >
          <TestimonialCarousel testimonials={testimonials} />
        </motion.div>
      </SectionErrorBoundary>

      <SectionErrorBoundary name="InstagramSection">
        <motion.div
          initial="hidden"
          animate={contentRevealed ? 'visible' : 'hidden'}
          custom={0.85}
          variants={sectionVariants}
        >
          <InstagramSection />
        </motion.div>
      </SectionErrorBoundary>

      <motion.div
        initial="hidden"
        animate={contentRevealed ? 'visible' : 'hidden'}
        custom={0.9}
        variants={sectionVariants}
      >
        <CTASection />
      </motion.div>
    </SiteLayout>
  )
}
