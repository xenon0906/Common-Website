'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ABOUT_STORY, JOURNEY_TIMELINE, SITE_CONFIG } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { VideoHero } from '@/components/about/VideoHero'
import {
  MessageCircle,
  Car,
  Award,
  TrendingUp,
  Target,
  Eye,
  Heart,
  Users,
  Lightbulb,
  ArrowRight,
  Play,
} from 'lucide-react'

const timelineIcons: Record<string, React.ElementType> = {
  MessageCircle,
  Car,
  Award,
  TrendingUp,
}

// Clean Hero Section - no floating orbs or decorative elements
function AboutHero() {
  return (
    <section className="hero-viewport bg-gradient-to-br from-slate-900 via-primary to-primary/90">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Pioneering{' '}
            <span className="text-teal-400">Cab Pooling</span> in India
          </h1>

          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Pool and go — with or without a car. Whether you're booking a cab together
            or sharing your own ride, join India's greenest commuting community.
            Save money, reduce emissions, travel together.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <a
              href="#video"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0066B3] rounded-xl font-semibold hover:bg-white/90 transition-colors"
            >
              <Play className="w-5 h-5" />
              Watch Our Story
            </a>
            <Link
              href="/team"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white border border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-colors"
            >
              Meet the Team
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Simple quote - no decorative frame */}
          <div className="max-w-2xl mx-auto">
            <p className="text-white/80 italic text-lg leading-relaxed">
              "Every day, millions take separate cabs to the same destination. With cab pooling, 4 people share 1 cab — saving money, supporting drivers, and reducing emissions by 75%."
            </p>
            <p className="text-teal-400 text-sm mt-4 font-medium">— Mohit & Surya Purohit, Co-Founders</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// Video Documentary Section
function VideoDocumentarySection() {
  return (
    <section id="video" className="section-padding bg-white">
      <VideoHero
        videoId="drglwf8KjVU"
        title="The Snapgo Story"
        subtitle="See how cab pooling is transforming daily commutes — saving money, supporting drivers, and reducing emissions"
      />
    </section>
  )
}

// Founder Story - clean, no decorative elements
function FounderStory() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="section-padding bg-gray-50">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Visual Side - simple gradient box */}
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <Car className="w-16 h-16 mx-auto mb-6" />
                <p className="text-2xl font-bold">Cab Pooling</p>
                <p className="text-4xl font-bold mt-2">Not Carpooling</p>
                <p className="text-sm mt-4 opacity-80">Legal • Eco-Friendly • Driver-Friendly</p>
              </div>
            </div>

            {/* Content Side */}
            <div>
              <p className="text-sm font-medium text-teal-600 mb-2">Our Innovation</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why <span className="text-primary">Cab Pooling</span>, Not Carpooling?
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {ABOUT_STORY.origin}
              </p>

              <p className="text-gray-600 italic mb-6">
                "{ABOUT_STORY.spark}"
              </p>

              <div className="flex items-center gap-4 pt-4 border-t">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Image
                    src="/images/logo/Snapgo%20Logo%20Blue.png"
                    alt="Snapgo"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Mohit & Surya Purohit</p>
                  <p className="text-sm text-gray-500">Co-Founders, Snapgo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Mission, Vision, Values - Premium Cards
function MissionVisionValues() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const items = [
    {
      icon: Target,
      title: 'Mission',
      content: ABOUT_STORY.mission,
      gradient: 'from-primary/10 to-primary/5',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      icon: Eye,
      title: 'Vision',
      content: ABOUT_STORY.vision,
      gradient: 'from-teal/10 to-teal/5',
      iconBg: 'bg-teal/10',
      iconColor: 'text-teal-600',
    },
    {
      icon: Heart,
      title: 'Values',
      content: ABOUT_STORY.values,
      gradient: 'from-purple/10 to-purple/5',
      iconBg: 'bg-purple/10',
      iconColor: 'text-purple-600',
    },
  ]

  return (
    <section ref={ref} className="section-padding bg-white relative">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            What Drives Us
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Our Core <span className="text-snapgo-gradient">Beliefs</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            The principles that guide every decision we make at Snapgo.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <div className={`h-full rounded-2xl sm:rounded-3xl bg-gradient-to-b ${item.gradient} p-4 sm:p-6 md:p-8 border border-gray-100 hover:shadow-xl transition-all duration-300`}>
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  className={`w-16 h-16 rounded-2xl ${item.iconBg} flex items-center justify-center mb-6`}
                >
                  <item.icon className={`w-8 h-8 ${item.iconColor}`} />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Timeline Section - clean, no floating orbs
function Timeline() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="section-padding bg-gradient-to-br from-primary to-teal-600 text-white">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <div className="text-center mb-16">
          <p className="text-white/60 text-sm font-medium mb-2">Our Journey</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Milestones Along the Way
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            From a simple idea to a growing platform connecting thousands of commuters.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {JOURNEY_TIMELINE.map((item) => {
            const Icon = timelineIcons[item.icon]
            return (
              <div
                key={item.title}
                className="bg-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/10 hover:bg-white/15 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/70 leading-relaxed">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Team CTA Section
function TeamCTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="section-padding bg-gray-50">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="flex justify-center mb-8">
            <div className="flex -space-x-2 sm:-space-x-4">
              {SITE_CONFIG.founders.map((founder, index) => (
                <motion.div
                  key={founder}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.2 + index * 0.1, type: 'spring' }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-teal-500 border-4 border-white flex items-center justify-center shadow-lg"
                >
                  <Users className="w-10 h-10 text-white" />
                </motion.div>
              ))}
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Meet the <span className="text-snapgo-gradient">Visionaries</span>
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            The passionate team behind Snapgo's mission to pioneer cab pooling — making travel legal, green, and affordable for everyone.
          </p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/team">
              <Button variant="gradient" size="lg">
                View Full Team
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default function AboutPage() {
  return (
    <SiteLayout>
      <AboutHero />
      <VideoDocumentarySection />
      <FounderStory />
      <MissionVisionValues />
      <Timeline />
      <TeamCTA />
    </SiteLayout>
  )
}
