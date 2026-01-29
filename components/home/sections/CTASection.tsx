'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { DownloadIcon, ArrowRightIcon, SparklesIcon } from '@/components/ui/icon'

export function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="section-padding-lg bg-[#0e4493]">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 0.05, type: 'spring', stiffness: 250, damping: 12 }}
              className="inline-flex items-center gap-2 px-4 py-2 glass-dark rounded-full mb-6"
            >
              <SparklesIcon className="w-4 h-4 text-teal-300" />
              <span className="text-white text-sm font-semibold">Start Your Journey</span>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Ready to Start{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-teal-100">Saving?</span>
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join thousands of verified users saving up to 75% on their daily commute with Snapgo.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="xl" className="bg-white text-primary hover:bg-white/90 shadow-2xl shadow-white/20" asChild>
                  <Link href="#download">
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    Download Now
                  </Link>
                </Button>
              </motion.div>
              <Button
                size="xl"
                variant="glass"
                className="text-white border-white/30 transition-transform duration-200 hover:scale-105 active:scale-95"
                asChild
              >
                <Link href="/how-it-works">
                  Learn More
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-10 md:mt-12"
            >
              {[
                { value: '10,000+', label: 'App Downloads' },
                { value: '75%', label: 'Cost Savings' },
                { value: '150+', label: 'Daily Rides' },
                { value: '500+', label: 'Trees Equivalent', isEco: true },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className={`text-2xl sm:text-3xl md:text-4xl font-bold ${stat.isEco ? 'text-emerald-400' : 'text-teal-300'}`}>{stat.value}</div>
                  <div className={`text-sm ${stat.isEco ? 'text-emerald-300/80' : 'text-white/80'}`}>{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
