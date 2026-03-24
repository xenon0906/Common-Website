'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { PageHero } from '@/components/shared/PageHero'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Zap,
  Map,
  Users,
  Target,
  ShieldCheck,
  Navigation,
  Download,
} from 'lucide-react'

const steps = [
  {
    step: 1,
    title: 'Set Your Route',
    description:
      'Enter your pickup and destination on the live map. Filter by seats needed, search radius, and gender preference.',
    image: '/images/services/realtime-map.png',
    alt: 'Snapgo Realtime tab — live map with pickup, filters for seats, radius, and gender',
  },
  {
    step: 2,
    title: 'View Nearby Members',
    description:
      'See the route on the map and nearby co-riders. Tap "View Nearby Members" to find people heading the same way.',
    image: '/images/services/realtime-route.png',
    alt: 'Snapgo Realtime — route displayed on map with nearby members button',
  },
  {
    step: 3,
    title: 'Get Matched',
    description:
      'The app connects you with travellers heading your way in real-time. Split the fare and save instantly.',
    image: '/images/services/realtime-matching.png',
    alt: 'Snapgo Finding Your Match — connecting you with travellers heading your way',
  },
]

const features = [
  { icon: Map, title: 'Live Map', description: 'See your location and nearby riders on a real-time map' },
  { icon: Target, title: 'Adjustable Radius', description: 'Set how far to search — 500m, 800m, or more' },
  { icon: Users, title: 'Gender Filter', description: 'Filter by All or Female-only for safer matching' },
  { icon: Navigation, title: 'Seats Selector', description: 'Specify how many seats you need' },
  { icon: Zap, title: 'Instant Matching', description: 'Find co-riders in seconds, not minutes' },
  { icon: ShieldCheck, title: 'KYC Verified', description: 'Every rider is Aadhaar verified' },
]

export default function RealtimeRideClient() {
  const stepsRef = useRef<HTMLDivElement>(null)
  const stepsInView = useInView(stepsRef, { once: true, margin: '-100px' })
  const featuresRef = useRef<HTMLDivElement>(null)
  const featuresInView = useInView(featuresRef, { once: true, margin: '-100px' })

  return (
    <SiteLayout>
      <PageHero
        badge="Realtime Ride"
        title="Find Co-Riders"
        titleHighlight="Instantly"
        description="Open the map, set your destination, and find people heading the same way — right now. Split the cab fare on the spot."
        icon={<Zap className="w-4 h-4 text-primary" />}
        trustBadges={[
          { label: 'Live Location', variant: 'teal' },
          { label: 'KYC Verified', variant: 'primary' },
        ]}
        cta={{ label: 'Download App', href: '/#download', variant: 'gradient' }}
      />

      {/* How It Works */}
      <section ref={stepsRef} className="section-padding bg-gray-50">
        <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={stepsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              How It <span className="text-primary">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Three steps to find a co-rider in real-time
            </p>
          </motion.div>

          <div className="space-y-16 max-w-5xl mx-auto">
            {steps.map((item, index) => {
              const isEven = index % 2 === 0
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 40 }}
                  animate={stepsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-12`}
                >
                  <div className="w-full lg:w-1/2 flex justify-center">
                    <div className="relative w-[220px] sm:w-[260px] md:w-[280px]">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        width={280}
                        height={560}
                        className="w-full h-auto rounded-3xl shadow-2xl"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-1/2 text-center lg:text-left">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold text-lg mb-4">
                      {item.step}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} className="section-padding bg-white">
        <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Why Go <span className="text-primary">Realtime</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Card className="h-full border hover:shadow-lg transition-shadow">
                  <CardContent className="p-5">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Need a Ride Right Now?
          </h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Download Snapgo and find co-riders near you in seconds.
          </p>
          <Button variant="outline" size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
            <Link href="/#download">
              <Download className="w-5 h-5 mr-2" />
              Download App
            </Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  )
}
