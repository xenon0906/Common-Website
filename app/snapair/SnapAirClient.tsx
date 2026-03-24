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
  Plane,
  ArrowLeftRight,
  Clock,
  Car,
  Users,
  ShieldCheck,
  Download,
} from 'lucide-react'

const steps = [
  {
    step: 1,
    title: 'Open Airport Cabs',
    description:
      'Go to the Services tab and select "Airport Cabs" to start booking your airport transfer.',
    image: '/images/services/services-hub.png',
    alt: 'Snapgo Services tab — select Airport Cabs',
  },
  {
    step: 2,
    title: 'Book Your Ride',
    description:
      'Choose direction (To Airport or From Airport), select terminal (T1, T2, or T3), set pickup location, date, time, passengers, and vehicle type.',
    image: '/images/services/snapair-booking.png',
    alt: 'Snapgo Airport Services — Delhi IGI, terminal selection, direction, schedule',
  },
  {
    step: 3,
    title: 'Confirm & Travel',
    description:
      'Review your booking details and pay securely. Your driver is confirmed 24 hours before pickup — no last-minute surprises.',
    image: '/images/services/snapair-booking.png',
    alt: 'Snapgo Airport booking confirmation',
  },
]

const features = [
  { icon: ArrowLeftRight, title: 'To & From Airport', description: 'Book rides in both directions seamlessly' },
  { icon: Plane, title: 'All Terminals', description: 'Delhi IGI Terminal 1, 2 & 3 supported' },
  { icon: Car, title: 'Multiple Vehicles', description: 'Choose from Sedan, Ertiga, SUV and more' },
  { icon: Clock, title: 'Driver Confirmed 24hr Before', description: 'Know your driver details well in advance' },
  { icon: Users, title: 'Shared = 50% Cheaper', description: 'Share the ride and pay half the normal fare' },
  { icon: ShieldCheck, title: 'Safe & Verified', description: 'KYC verified riders and licensed cabs' },
]

export default function SnapAirClient() {
  const stepsRef = useRef<HTMLDivElement>(null)
  const stepsInView = useInView(stepsRef, { once: true, margin: '-100px' })
  const featuresRef = useRef<HTMLDivElement>(null)
  const featuresInView = useInView(featuresRef, { once: true, margin: '-100px' })

  return (
    <SiteLayout>
      <PageHero
        badge="SnapAir"
        title="Airport Transfers"
        titleHighlight="at Half the Price"
        description="Shared cabs to Delhi IGI Airport — T1, T2 & T3. Driver confirmed 24 hours before your pickup. Save 50% on every airport ride."
        icon={<Plane className="w-4 h-4 text-primary" />}
        trustBadges={[
          { label: '50% Savings', variant: 'teal' },
          { label: 'Driver Confirmed 24hr Before', variant: 'primary' },
          { label: 'All Terminals', variant: 'teal' },
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
              Book your airport cab in 3 easy steps
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
              Why <span className="text-primary">SnapAir</span>
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
            Flying Soon?
          </h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Book your shared airport cab on Snapgo and save 50%.
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
