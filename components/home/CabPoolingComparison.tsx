'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Car, Leaf, Wallet, Scale, X, Check, Users } from 'lucide-react'

const comparisonData = {
  carpooling: {
    title: 'Traditional Carpooling',
    subtitle: 'Private Cars',
    icon: X,
    color: 'red',
    points: [
      { text: 'Uses private vehicles for commercial use', negative: true },
      { text: 'Not legal in India', negative: true },
      { text: 'Bypasses taxi drivers', negative: true },
      { text: 'Same emissions per car', negative: true },
    ],
  },
  cabPooling: {
    title: 'Snapgo Cab Pooling',
    subtitle: 'Commercial Cabs',
    icon: Check,
    color: 'green',
    points: [
      { text: 'Uses licensed commercial cabs', negative: false },
      { text: '100% legal and regulated', negative: false },
      { text: 'Doesn\'t bypass taxi drivers', negative: false },
      { text: '75% less emissions per person', negative: false },
    ],
  },
}

const benefits = [
  {
    icon: Leaf,
    title: 'Planet Wins',
    description: '4 people in 1 cab instead of 4 separate cabs = 75% less pollution',
    color: 'emerald',
  },
  {
    icon: Wallet,
    title: 'You Win',
    description: 'Split the fare and save up to 75% on every ride',
    color: 'blue',
  },
  {
    icon: Users,
    title: 'Flexible Pooling',
    description: 'No car? Book together. Have a car? Offer rides. Your choice, same savings.',
    color: 'purple',
  },
]

export function CabPoolingComparison() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
    >
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-full text-sm font-medium mb-4">
            The Smarter Choice
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Cab Pooling, Not Carpooling?
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Not all shared rides are equal. Here's why Snapgo's approach is legal, eco-friendly, AND driver-friendly.
          </p>
        </motion.div>

        {/* Visual Comparison */}
        <div className="mb-16">
          {/* The 4 cabs vs 1 cab visual */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6 md:p-10 mb-8 sm:mb-10"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Without Snapgo */}
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500 mb-4">Without Cab Pooling</p>
                <div className="flex justify-center gap-3 mb-4">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="relative"
                    >
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-xl flex items-center justify-center">
                        <Car className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-[10px] text-white font-bold">1</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <p className="text-red-600 font-semibold">4 cabs, 4 people, 4x emissions</p>
              </div>

              {/* Divider */}
              <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-400 font-bold text-lg">VS</span>
                </div>
              </div>
              <div className="md:hidden flex justify-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-400 font-bold">VS</span>
                </div>
              </div>

              {/* With Snapgo */}
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500 mb-4">With Snapgo Cab Pooling</p>
                <div className="flex justify-center mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.7, type: 'spring' }}
                    className="relative"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-100 rounded-2xl flex items-center justify-center">
                      <Car className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-500" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">4</span>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ delay: 1 }}
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-emerald-500 rounded-full"
                    >
                      <span className="text-[10px] text-white font-medium whitespace-nowrap">75% less</span>
                    </motion.div>
                  </motion.div>
                </div>
                <p className="text-emerald-600 font-semibold">1 cab, 4 people, 75% less emissions</p>
              </div>
            </div>
          </motion.div>

          {/* Comparison Cards */}
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {/* Carpooling - Problems */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-red-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <X className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{comparisonData.carpooling.title}</h3>
                    <p className="text-sm text-gray-500">{comparisonData.carpooling.subtitle}</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {comparisonData.carpooling.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{point.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Cab Pooling - Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-emerald-200 relative overflow-hidden shadow-lg shadow-emerald-100/50"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full" />
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-500 rounded-full">
                <span className="text-[10px] text-white font-medium">Recommended</span>
              </div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Check className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{comparisonData.cabPooling.title}</h3>
                    <p className="text-sm text-gray-500">{comparisonData.cabPooling.subtitle}</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {comparisonData.cabPooling.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{point.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Triple Win Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-xl md:text-2xl font-bold text-center text-gray-900 mb-8">
            The Triple Win
          </h3>
          <div className="grid sm:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              const colorClasses = {
                emerald: 'bg-emerald-100 text-emerald-600',
                blue: 'bg-blue-100 text-blue-600',
                purple: 'bg-purple-100 text-purple-600',
              }[benefit.color]

              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className={`w-14 h-14 ${colorClasses} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{benefit.title}</h4>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="text-center mt-12 text-lg md:text-xl font-semibold text-gray-700"
        >
          Why pay for the full cab when you can{' '}
          <span className="text-emerald-600">save money</span> AND{' '}
          <span className="text-emerald-600">the environment</span>?
        </motion.p>
      </div>
    </section>
  )
}
