'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, X } from 'lucide-react'

const comparisonRows = [
  { feature: 'Delhi Airport Cab', competitor: '₹800–1,200', snapgo: '₹400–600', snapgoWin: true },
  { feature: 'Daily Commute (GN)', competitor: '₹300–400', snapgo: '₹80–100', snapgoWin: true },
  { feature: 'Surge Pricing', competitor: 'Yes, up to 3x', snapgo: 'Never', snapgoWin: true },
  { feature: 'Rider Verification', competitor: 'Phone only', snapgo: 'Aadhaar KYC', snapgoWin: true },
  { feature: 'Women Safety Filter', competitor: 'No', snapgo: 'Yes', snapgoWin: true },
  { feature: 'Driver Confirmed Before', competitor: 'No', snapgo: '24hr before', snapgoWin: true },
  { feature: 'Environmental Impact', competitor: '1 person, 1 cab', snapgo: '4 people, 1 cab', snapgoWin: true },
]

export function ComparisonSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-20 sm:py-24 bg-white">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <span className="text-primary text-sm font-semibold">Why Pay Full Fare?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Snapgo vs{' '}
            <span className="text-gray-400">Solo Cabs</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Real prices. Side by side.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="overflow-hidden border rounded-xl shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-3 border-b">
              <div className="p-4 sm:p-5 bg-gray-50 font-semibold text-sm text-gray-500">
                Feature
              </div>
              <div className="p-4 sm:p-5 bg-gray-50 text-center font-semibold text-sm text-gray-500">
                Ola / Uber <span className="hidden sm:inline">(Solo)</span>
              </div>
              <div className="p-4 sm:p-5 bg-[#0e4493]/8 text-center font-bold text-sm text-[#0e4493]">
                Snapgo
              </div>
            </div>

            {/* Rows */}
            {comparisonRows.map((row, index) => (
              <motion.div
                key={row.feature}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
                className={`grid grid-cols-3 border-b last:border-b-0 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
              >
                <div className="p-4 sm:p-5 text-sm font-medium text-gray-700">
                  {row.feature}
                </div>
                <div className="p-4 sm:p-5 text-center text-sm text-gray-500 flex items-center justify-center gap-1.5">
                  <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{row.competitor}</span>
                </div>
                <div className="p-4 sm:p-5 bg-[#0e4493]/[0.03] text-center text-sm font-semibold text-[#0e4493] flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{row.snapgo}</span>
                </div>
              </motion.div>
            ))}
          </Card>

        </motion.div>
      </div>
    </section>
  )
}
