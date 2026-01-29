'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { DownloadIcon, CheckCircleIcon } from '@/components/ui/icon'
import type { AppStoreLinksData } from '@/lib/content'

interface DownloadSectionProps {
  appLinks?: AppStoreLinksData
}

export function DownloadSection({ appLinks }: DownloadSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const defaultLinks: AppStoreLinksData = {
    android: {
      url: 'https://play.google.com/store/apps/details?id=in.snapgo.app&hl=en_IN',
      isLive: true,
      qrCodeUrl: '/images/qr code/playstore-qr.png'
    },
    ios: {
      url: 'https://apps.apple.com/in/app/snapgo-connect-split-fare/id6748761741',
      isLive: true,
      qrCodeUrl: '/images/qr code/appstore-qr.png'
    }
  }

  const links = appLinks || defaultLinks

  return (
    <section ref={ref} className="section-padding-lg bg-gray-50">
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
            <DownloadIcon className="w-4 h-4 text-teal" />
            <span className="text-teal text-sm font-semibold">Get the App</span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Download <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal to-primary">Snapgo</span> Today
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Start saving on your daily commute. Scan the QR code or click to download.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
          {/* Android */}
          <motion.div
            initial={{ opacity: 0, x: -50, rotateY: -10 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.25, delay: 0.05, ease: [0.34, 1.56, 0.64, 1] }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group"
          >
            <Card className="h-full border-2 border-transparent hover:border-[#3DDC84]/50 transition-all duration-500 overflow-hidden">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.15 }}
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-[#3DDC84]/10 flex items-center justify-center"
                  >
                    <svg className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-[#3DDC84]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.6 11.4c-.3 0-.5-.2-.5-.5s.2-.5.5-.5.5.2.5.5-.2.5-.5.5m-11.2 0c-.3 0-.5-.2-.5-.5s.2-.5.5-.5.5.2.5.5-.2.5-.5.5M18.1 7l1.8-3.2c.1-.2 0-.4-.2-.5s-.4 0-.5.2l-1.8 3.3C15.7 5.7 13.9 5 12 5s-3.7.7-5.4 1.8L4.8 3.5c-.1-.2-.3-.3-.5-.2s-.3.3-.2.5L5.9 7C3.1 8.8 1.3 11.5 1 14.5h22c-.3-3-2.1-5.7-4.9-7.5"/>
                    </svg>
                  </motion.div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold">Android</h3>
                    <p className="text-muted-foreground">Google Play Store</p>
                  </div>
                </div>

                <motion.div
                  className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 mx-auto mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-shadow"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <Image
                      src={links.android.qrCodeUrl || "/images/qr code/playstore-qr.png"}
                      alt="Download Snapgo on Google Play Store"
                      fill
                      className="object-contain"
                    />
                  </div>
                </motion.div>

                <Badge className="mb-4 bg-[#3DDC84]/20 text-[#3DDC84] border-[#3DDC84]/30">
                  <CheckCircleIcon className="w-3 h-3 mr-1" /> {links.android.isLive ? 'Live on Play Store' : 'Coming Soon'}
                </Badge>

                <Button variant="gradient" className="w-full group" size="lg" asChild>
                  <Link href={links.android.url} target="_blank">
                    <DownloadIcon className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                    Download for Android
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* iOS */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: 10 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.25, delay: 0.08, ease: [0.34, 1.56, 0.64, 1] }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group"
          >
            <Card className="h-full border-2 border-transparent hover:border-gray-400/50 transition-all duration-500 overflow-hidden">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.15 }}
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gray-100 flex items-center justify-center"
                  >
                    <svg className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                  </motion.div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold">iOS</h3>
                    <p className="text-muted-foreground">App Store</p>
                  </div>
                </div>

                <motion.div
                  className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 mx-auto mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-shadow"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <Image
                      src={links.ios.qrCodeUrl || "/images/qr code/appstore-qr.png"}
                      alt="Download Snapgo on App Store"
                      fill
                      className="object-contain"
                    />
                  </div>
                </motion.div>

                <Badge className="mb-4 bg-gray-800 text-white border-gray-600">
                  <CheckCircleIcon className="w-3 h-3 mr-1" /> {links.ios.isLive ? 'Live on App Store' : 'Coming Soon'}
                </Badge>

                <Button variant="gradient" className="w-full group" size="lg" asChild>
                  <Link href={links.ios.url} target="_blank">
                    <DownloadIcon className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                    Download for iOS
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
