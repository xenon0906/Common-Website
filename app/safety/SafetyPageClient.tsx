'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { SafetyChecklist } from '@/components/safety/SafetyChecklist'
import Link from 'next/link'
import Image from 'next/image'
import type { SiteImagesConfig } from '@/lib/types/images'
import type { SafetyContentData } from '@/lib/content'
import {
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Users,
  Clock,
  Download,
  Award,
  Check,
  Sparkles,
} from 'lucide-react'

const ICON_MAP: Record<string, any> = {
  MapPin,
  Users,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Award,
}

interface SafetyPageClientProps {
  safety: SafetyContentData
  images: SiteImagesConfig
}

function SafetyHero({ mockupUrl, data }: { mockupUrl: string; data: SafetyContentData['hero'] }) {
  return (
    <section className="hero-viewport bg-gradient-to-br from-primary via-primary/90 to-primary-800">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {data.headline}
            </h1>

            <p className="text-lg text-white/70 mb-8 max-w-lg mx-auto lg:mx-0">
              {data.subtext}
            </p>

            <ul className="space-y-4 mb-10 max-w-md mx-auto lg:mx-0">
              {data.points.map((point, index) => (
                <li key={index} className="flex items-center gap-3 text-white/80">
                  <ShieldCheck className="w-5 h-5 text-white flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap justify-center lg:justify-start gap-8">
              {data.stats.map((stat, i) => (
                <div key={i}>
                  <p className="text-3xl font-bold text-teal-400">{stat.value}</p>
                  <p className="text-sm text-white/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative w-[220px] sm:w-[260px] md:w-[280px] lg:w-[300px]">
              <Image
                src={mockupUrl}
                alt="Snapgo App - Emergency SOS Feature"
                width={300}
                height={600}
                className="w-full h-auto drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ChecklistSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="section-padding bg-gray-50 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 rounded-full text-teal-700 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Interactive Checklist
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Safety Features{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">
              Checklist
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Scroll through to discover all the safety features that protect you on every ride.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <SafetyChecklist />
        </div>
      </div>
    </section>
  )
}

function SOSSection({ data }: { data: SafetyContentData['sos'] }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="section-padding bg-gray-900 text-white">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <div className="text-center mb-16">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {data.headline.includes('SOS') ? (
              <>Emergency <span className="text-red-400">SOS</span> Feature</>
            ) : (
              data.headline
            )}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            {data.subtext}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              What Gets Shared
            </h3>
            <div className="space-y-4">
              {data.shares.map((item) => {
                const Icon = ICON_MAP[item.icon] || MapPin
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-xl"
                  >
                    <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-red-400" />
                    </div>
                    <span className="text-white/90 font-medium">{item.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-teal-400" />
              </div>
              How It Works
            </h3>
            <div className="space-y-4">
              {data.steps.map((step, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center font-bold text-teal-400">
                    {index + 1}
                  </div>
                  <span className="text-white/80">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TrustSection({ data }: { data: SafetyContentData['trust'] }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="section-padding bg-white">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <Award className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {data.headline}
          </h2>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
            {data.subtext}
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {data.certifications.map((cert, index) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="p-6 bg-gray-50 rounded-2xl"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{cert.title}</h3>
                <p className="text-sm text-gray-500">{cert.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function CTASection({ data }: { data: SafetyContentData['cta'] }) {
  return (
    <section className="section-padding-lg bg-gradient-to-br from-primary to-teal-600">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <div className="text-center max-w-3xl mx-auto">
          <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-8">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>

          <p className="text-xl md:text-2xl font-medium text-white mb-8 leading-relaxed">
            {data.quote}
          </p>

          <p className="text-white/70 mb-10">{data.badge}</p>

          <Button
            size="xl"
            className="bg-white text-primary hover:bg-white/90"
            asChild
          >
            <Link href={data.buttonLink}>
              <Download className="w-5 h-5 mr-2" />
              {data.buttonText}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default function SafetyPageClient({ safety, images }: SafetyPageClientProps) {
  return (
    <SiteLayout>
      <SafetyHero mockupUrl={images.mockups.emergencySos} data={safety.hero} />
      <ChecklistSection />
      <SOSSection data={safety.sos} />
      <TrustSection data={safety.trust} />
      <CTASection data={safety.cta} />
    </SiteLayout>
  )
}
