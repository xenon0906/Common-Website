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
  Calendar,
  Search,
  MapPin,
  Clock,
  Car,
  ShieldCheck,
  Users,
  Sliders,
  Download,
} from 'lucide-react'

const steps = [
  {
    step: 1,
    title: 'Create a Trip',
    description:
      'Set your pickup & drop location, choose date, time, number of seats, and transport mode — Cab, Auto, or Self Drive.',
    image: '/images/services/schedule-create.png',
    alt: 'Snapgo Create Trip screen — set route, date, time, seats, and transport mode',
  },
  {
    step: 2,
    title: 'Search Existing Trips',
    description:
      'Looking to join someone? Search trips by route, travel date, and search radius to find co-riders near you.',
    image: '/images/services/schedule-search.png',
    alt: 'Snapgo Search Trips screen — enter route, date, and radius',
  },
  {
    step: 3,
    title: 'Browse Nearby Trips',
    description:
      'See all trips near your location — with rider details, route info, date, time, and a countdown showing time left to join.',
    image: '/images/services/schedule-home.png',
    alt: 'Snapgo Schedule tab — nearby trips with rider details and countdown',
  },
]

const features = [
  { icon: Calendar, title: 'Set Date & Time', description: 'Plan rides days or weeks in advance' },
  { icon: Car, title: 'Choose Transport', description: 'Cab, Auto, or Self Drive — your pick' },
  { icon: Sliders, title: 'Adjustable Radius', description: 'Find trips within your preferred range' },
  { icon: MapPin, title: 'Nearby Trips', description: 'See who is heading your way with distance info' },
  { icon: ShieldCheck, title: 'KYC Verified', description: 'Every rider is Aadhaar verified via DigiLocker' },
  { icon: Users, title: 'Female-Only Option', description: 'Women can filter to see only female co-riders' },
]

export default function ScheduleRideClient() {
  const stepsRef = useRef<HTMLDivElement>(null)
  const stepsInView = useInView(stepsRef, { once: true, margin: '-100px' })
  const featuresRef = useRef<HTMLDivElement>(null)
  const featuresInView = useInView(featuresRef, { once: true, margin: '-100px' })

  return (
    <SiteLayout>
      <PageHero
        badge="Schedule Ride"
        title="Plan Your Trip"
        titleHighlight="in Advance"
        description="Schedule rides ahead of time — set your route, date, and find co-riders going your way. Save up to 75% on every trip."
        icon={<Calendar className="w-4 h-4 text-primary" />}
        trustBadges={[
          { label: 'Aadhaar Verified', variant: 'primary' },
          { label: 'Female-Only Option', variant: 'teal' },
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
              Three simple steps to schedule your shared ride
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
                  {/* Screenshot */}
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

                  {/* Text */}
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
              Why Schedule on <span className="text-primary">Snapgo</span>
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
            Ready to Plan Your Next Ride?
          </h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Download Snapgo and start scheduling rides with verified co-riders.
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
