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
  Bus,
  MapPin,
  Clock,
  Wifi,
  Navigation,
  IndianRupee,
  Download,
  GraduationCap,
} from 'lucide-react'

const steps = [
  {
    step: 1,
    title: 'Open Services',
    description:
      'Go to the Services tab in the Snapgo app and select "Micro Cab Shuttles" to browse available routes.',
    image: '/images/services/services-hub.png',
    alt: 'Snapgo Services tab — My Bookings, Micro Cab Shuttles, Airport Cabs, Outstation Cabs',
  },
  {
    step: 2,
    title: 'Select Your Institution',
    description:
      'Browse colleges in Greater Noida — IILM University, NIET, Sharda University, GL Bajaj, and more.',
    image: '/images/services/snapride-institutions.png',
    alt: 'Snapgo Micro Cab Shuttles — list of institutions in Greater Noida',
  },
  {
    step: 3,
    title: 'Pick Your Route',
    description:
      'Choose from available routes with fixed prices (₹80-₹90), set timings, and amenities like AC, WiFi, and GPS tracking.',
    image: '/images/services/snapride-routes.png',
    alt: 'Snapgo Sharda University routes — Botanical to Sharda ₹90, Gaur City to Sharda ₹80',
  },
]

const features = [
  { icon: IndianRupee, title: 'From ₹80/Ride', description: 'Fixed prices, no surge, no surprises' },
  { icon: GraduationCap, title: 'College Routes', description: 'IILM, NIET, Sharda, GL Bajaj & more' },
  { icon: Clock, title: 'Set Timings', description: 'Weekday service with fixed departure times' },
  { icon: Wifi, title: 'AC + WiFi', description: 'Comfortable rides with AC and WiFi onboard' },
  { icon: Navigation, title: 'GPS Tracked', description: 'Real-time tracking for safety and ETA' },
  { icon: MapPin, title: 'Stop-Based Pickup', description: 'Fixed stops along the route — details shared after booking' },
]

export default function SnapRideClient() {
  const stepsRef = useRef<HTMLDivElement>(null)
  const stepsInView = useInView(stepsRef, { once: true, margin: '-100px' })
  const featuresRef = useRef<HTMLDivElement>(null)
  const featuresInView = useInView(featuresRef, { once: true, margin: '-100px' })
  const savingsRef = useRef<HTMLDivElement>(null)
  const savingsInView = useInView(savingsRef, { once: true, margin: '-100px' })

  return (
    <SiteLayout>
      <PageHero
        badge="SnapRide"
        title="Your Daily Commute,"
        titleHighlight="Sorted"
        description="Fixed-route micro cab shuttles for college students in Greater Noida — from just ₹80/ride. Pick a stop, book a seat."
        icon={<Bus className="w-4 h-4 text-primary" />}
        trustBadges={[
          { label: 'From ₹80/ride', variant: 'teal' },
          { label: 'AC + WiFi', variant: 'primary' },
          { label: 'GPS Tracked', variant: 'teal' },
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
              Book a seat on your daily shuttle in 3 simple steps
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

      {/* Savings Comparison */}
      <section ref={savingsRef} className="section-padding bg-white">
        <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={savingsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8">
              Save More Than <span className="text-primary">College Buses</span>
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="border-2 border-red-200 bg-red-50/50">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-red-600 font-semibold mb-2">College Bus</p>
                  <p className="text-3xl font-bold text-red-700">₹5,000-6,000</p>
                  <p className="text-sm text-muted-foreground mt-1">/month</p>
                  <p className="text-xs text-muted-foreground mt-3">No door pickup, fixed schedule, walk to bus stop</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-emerald-200 bg-emerald-50/50">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-emerald-600 font-semibold mb-2">SnapRide Shuttle</p>
                  <p className="text-3xl font-bold text-emerald-700">₹3,520</p>
                  <p className="text-sm text-muted-foreground mt-1">/month (₹80 x 2 x 22 days)</p>
                  <p className="text-xs text-muted-foreground mt-3">AC cab, WiFi, GPS, stop-based pickup</p>
                </CardContent>
              </Card>
            </div>

            <p className="text-center text-lg font-semibold text-emerald-600 mt-6">
              Save ₹1,500-2,500 every month
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} className="section-padding bg-gray-50">
        <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Why <span className="text-primary">SnapRide</span>
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
            Book Your Daily Shuttle
          </h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Download Snapgo and book a seat on your college shuttle route.
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
