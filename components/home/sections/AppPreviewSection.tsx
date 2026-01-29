'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { SmartphoneIcon } from '@/components/ui/icon'
import type { SiteImagesConfig } from '@/lib/types/images'

interface AppPreviewSectionProps {
  mockups?: SiteImagesConfig['mockups']
}

export function AppPreviewSection({ mockups }: AppPreviewSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  const screens = [
    { url: mockups?.tripDetails || '/images/mockups/iphone15/trip-details.png', label: 'Trip Details', description: 'View & join trips' },
    { url: mockups?.tripChat || '/images/mockups/iphone15/trip-chat.png', label: 'Trip Chat', description: 'Chat with riders' },
    { url: mockups?.inAppCalling || '/images/mockups/iphone15/in-app-calling.png', label: 'In-App Calling', description: 'Call co-riders' },
    { url: mockups?.profileVerified || '/images/mockups/iphone15/profile-verified.png', label: 'Your Profile', description: 'KYC verified' },
  ]

  return (
    <section ref={containerRef} className="section-padding-lg bg-white">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.05, type: 'spring', stiffness: 250, damping: 12 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal/10 rounded-full mb-4"
          >
            <SmartphoneIcon className="w-4 h-4 text-teal" />
            <span className="text-teal text-sm font-semibold">App Preview</span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            See <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal to-primary">Snapgo</span> in Action
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            A beautiful, intuitive app designed for seamless ride-sharing experiences.
          </p>
        </motion.div>

        <div className="flex justify-center items-end gap-2 sm:gap-4 md:gap-6 lg:gap-8 pb-8 px-4 max-w-full overflow-hidden">
          {screens.map((screen, index) => {
            const isCenter = index === 1 || index === 2
            const visibilityClass = index >= 2 ? 'hidden sm:block' : ''

            return (
              <motion.div
                key={screen.label}
                initial={{ opacity: 0, y: 100, rotateY: index < 2 ? -15 : 15 }}
                animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
                transition={{ duration: 0.25, delay: index * 0.03, ease: [0.34, 1.56, 0.64, 1] }}
                whileHover={{ y: -20, scale: 1.05, rotateY: 5 }}
                className={`flex-shrink-0 group cursor-pointer ${visibilityClass}`}
                style={{ perspective: 1000 }}
              >
                <div className={`relative ${isCenter ? 'w-40 sm:w-48 md:w-56 lg:w-64' : 'w-36 sm:w-40 md:w-48 lg:w-52'} group-hover:drop-shadow-xl transition-all duration-500`}>
                  <Image
                    src={screen.url}
                    alt={`Snapgo ${screen.label}`}
                    width={260}
                    height={520}
                    className="w-full h-auto drop-shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[2rem] flex items-end p-4">
                    <div className="text-white text-center w-full">
                      <p className="font-semibold">{screen.label}</p>
                      <p className="text-xs text-white/70">{screen.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
