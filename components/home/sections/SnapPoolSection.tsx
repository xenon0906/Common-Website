'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Leaf, Users, TrendingDown, Heart } from 'lucide-react'

const benefits = [
  {
    icon: TrendingDown,
    title: 'Reduce Carbon Footprint',
    description: '4 people sharing 1 cab means 75% fewer emissions per person.',
  },
  {
    icon: Users,
    title: 'Build a Sharing Culture',
    description: 'Connect with your community. Share rides, share stories.',
  },
  {
    icon: Heart,
    title: '100% Free for Everyone',
    description: 'Snappool is our free initiative. No commission, no hidden charges.',
  },
]

export function SnapPoolSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="py-20 sm:py-24 bg-emerald-50/60">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 border border-emerald-200 rounded-full mb-5">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 text-sm font-medium">100% Free Initiative</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              What We Offer for a Greener India
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-base sm:text-lg">
              Snappool is our free ride-matching platform — because saving the planet shouldn&apos;t cost you anything.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
                className="bg-white rounded-2xl p-6 border border-emerald-100 text-center shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-8 bg-white rounded-2xl border border-emerald-100 p-8 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 text-center shadow-sm"
          >
            <div>
              <div className="text-4xl font-bold text-emerald-600">500+</div>
              <div className="text-sm text-gray-500 mt-1">Trees worth CO2 saved</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gray-200" />
            <div>
              <div className="text-4xl font-bold text-emerald-600">75%</div>
              <div className="text-sm text-gray-500 mt-1">Less emissions per ride</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gray-200" />
            <div>
              <div className="text-4xl font-bold text-emerald-600">Free</div>
              <div className="text-sm text-gray-500 mt-1">Always, for everyone</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
