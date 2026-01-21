'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRightIcon,
  DownloadIcon,
  ShieldCheckIcon,
  UsersIcon,
  WalletIcon,
  BadgeCheckIcon,
  PiggyBankIcon
} from '@/components/ui/icon'
import { SITE_CONFIG, STATS } from '@/lib/constants'

export function Hero3D() {
  return (
    <section className="relative min-h-[90vh] bg-snapgo-hero overflow-hidden transition-colors duration-500">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Gradient Orbs - Visible accents for light background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="hidden sm:block absolute top-20 right-20 w-64 h-64 md:w-96 md:h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="hidden sm:block absolute bottom-20 left-20 w-48 h-48 md:w-80 md:h-80 bg-teal-500/10 rounded-full blur-[80px]" />
        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] bg-primary/8 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 relative z-10">
        <div className="min-h-screen flex items-center py-20 pt-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-foreground space-y-6"
            >
              {/* Certification Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
                  <BadgeCheckIcon className="w-4 h-4 mr-2" />
                  DPIIT Certified | Startup India | Startup Uttarakhand
                </Badge>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground"
              >
                Share Rides,
                <br />
                <span className="text-primary">Save Money,</span>
                <br />
                Travel Together
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-muted-foreground max-w-lg"
              >
                Connect with verified users going your way. Split cab fares and
                <span className="text-primary font-semibold"> save up to 75%</span> on every ride.
              </motion.p>

              {/* Key Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4 text-sm"
              >
                <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-foreground">
                  <ShieldCheckIcon className="w-4 h-4 text-primary" />
                  <span>Aadhaar Verified</span>
                </div>
                <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-foreground">
                  <UsersIcon className="w-4 h-4 text-primary" />
                  <span>Female-Only Option</span>
                </div>
                <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-foreground">
                  <WalletIcon className="w-4 h-4 text-primary" />
                  <span>Save 75%</span>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4 pt-2"
              >
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-6 text-lg shadow-lg shadow-primary/30"
                  asChild
                >
                  <Link href="#download">
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    Download Now
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border text-foreground hover:bg-muted px-8 py-6 text-lg"
                  asChild
                >
                  <Link href="/how-it-works">
                    Learn More
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </motion.div>

              {/* Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 border-t border-border mt-8"
              >
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">10,000+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">App Downloads</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">75%</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Cost Savings</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">150+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Daily Rides</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-500">500+</div>
                  <div className="text-xs sm:text-sm text-emerald-600">Trees Equivalent</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - App Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:flex justify-center items-center"
            >
              <div className="relative">
                {/* Phone Frame */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-[300px] h-[600px] rounded-[3rem] overflow-hidden shadow-2xl shadow-black/50 border-8 border-gray-800"
                >
                  {/* Screen Content */}
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800">
                    <Image
                      src="/images/app-hero-mockup.png"
                      alt="Snapgo App"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-800 rounded-b-3xl" />
                </motion.div>

                {/* Floating Cards */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -left-16 top-20 bg-white rounded-2xl p-4 shadow-xl border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                      <PiggyBankIcon className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">Save ₹200</div>
                      <div className="text-xs text-gray-500">On this ride</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="absolute -right-16 bottom-32 bg-white rounded-2xl p-4 shadow-xl border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <BadgeCheckIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">Verified User</div>
                      <div className="text-xs text-gray-500">KYC Complete</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 85C840 90 960 90 1080 85C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  )
}
