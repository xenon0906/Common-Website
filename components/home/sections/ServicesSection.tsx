'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Bus,
  Plane,
  MapPin,
  Search,
  CheckCircle,
  Flame,
  Users,
  ShieldCheck,
  Clock,
  ArrowRight,
} from 'lucide-react'
import type { ElementType } from 'react'

interface ServiceData {
  id: string
  name: string
  tagline: string
  description: string
  icon: ElementType
  badgeType: 'confirmed' | 'free-matching'
  extraBadge?: 'most-booked'
  trustLine: string
  isPrimary: boolean
  link?: string
}

const confirmedServices: ServiceData[] = [
  {
    id: 'snapride',
    name: 'SnapRide',
    tagline: 'Micro Cab Shuttle',
    description:
      'Daily fixed-route micro cab shuttle — book a seat, get stop details after booking. From just ₹80/ride in Greater Noida.',
    icon: Bus,
    badgeType: 'confirmed',
    extraBadge: 'most-booked',
    trustLine: 'Guaranteed seat, no matching needed',
    isPrimary: true,
    link: '/snapride',
  },
  {
    id: 'snapair',
    name: 'SnapAir',
    tagline: 'Shared Airport Transfers',
    description:
      'Shared airport cab transfers at 50% of normal fare. Driver confirmed 24 hours before your pickup.',
    icon: Plane,
    badgeType: 'confirmed',
    trustLine: 'Driver confirmed 24hr before',
    isPrimary: true,
    link: '/snapair',
  },
  {
    id: 'snaptrip',
    name: 'SnapTrip',
    tagline: 'Outstation Cabs — Name Your Price',
    description:
      'Book a dedicated cab at your price, or share a ride and split the cost. Sedan to Tempo Traveller — 10% off round trips.',
    icon: MapPin,
    badgeType: 'confirmed',
    trustLine: 'Transparent pricing, no surge',
    isPrimary: true,
    link: '/outstation-cabs',
  },
]

const snapPoolService: ServiceData = {
  id: 'snappool',
  name: 'SnapPool',
  tagline: 'Free Cab Matching',
  description:
    "Can't find a confirmed service on your route? SnapPool matches you with co-riders heading the same way — completely free.",
  icon: Search,
  badgeType: 'free-matching',
  trustLine: 'Free cab matching',
  isPrimary: false,
}

const iconColors: Record<string, { bg: string; text: string; border: string }> = {
  snapride: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
  snapair: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100' },
  snaptrip: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
  snappool: { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200' },
}

function ConfirmedBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
      <CheckCircle className="w-3 h-3" />
      Confirmed
    </span>
  )
}

function MostBookedBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold border border-orange-200">
      <Flame className="w-3 h-3" />
      Most Booked
    </span>
  )
}

function FreeMatchingBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold border border-gray-200">
      <Users className="w-3 h-3" />
      Free Matching
    </span>
  )
}

export function ServicesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="services" ref={ref} className="section-padding bg-background">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-semibold">Our Services</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Four Ways to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0e4493] to-emerald-500">
              Share & Save
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Confirmed rides with guaranteed seats. No matching hassle on our core services.
          </p>
        </motion.div>

        {/* Confirmed Services — 3-column grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {confirmedServices.map((service, index) => {
            const colors = iconColors[service.id]

            return (
              <Link key={service.id} href={service.link || '#'} className="block h-full">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group h-full"
                >
                  <Card className="h-full border bg-white hover:shadow-2xl transition-all duration-500 relative overflow-hidden cursor-pointer">
                    <CardContent className="p-5 sm:p-6">
                      {/* Badges row */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <ConfirmedBadge />
                        {service.extraBadge === 'most-booked' && <MostBookedBadge />}
                      </div>

                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center mb-4`}>
                        <service.icon className={`w-7 h-7 ${colors.text}`} />
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-sm font-medium text-muted-foreground mb-3">
                        {service.tagline}
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {service.description}
                      </p>

                      {/* Trust line */}
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                        <Clock className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span className="text-xs text-emerald-600 font-medium">
                          {service.trustLine}
                        </span>
                      </div>

                      {/* Learn More */}
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-4 group-hover:gap-2 transition-all">
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            )
          })}
        </div>

        {/* SnapPool — Secondary card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="border border-dashed border-gray-300 bg-gray-50/50 hover:bg-gray-50 transition-colors">
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Search className="w-6 h-6 text-gray-500" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-700">{snapPoolService.name}</h3>
                    <FreeMatchingBadge />
                  </div>
                  <p className="text-sm text-gray-500">{snapPoolService.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
