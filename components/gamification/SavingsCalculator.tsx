'use client'

import { useRef, useState, useMemo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Calculator, Car, Users, Wallet, TrendingUp, IndianRupee, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SavingsCalculatorProps {
  className?: string
}

export function SavingsCalculator({ className }: SavingsCalculatorProps) {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  const [distance, setDistance] = useState(15) // km
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [riders, setRiders] = useState(2)
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly')

  // Pricing calculations (approximate INR rates)
  const calculations = useMemo(() => {
    const baseCabFarePerKm = 14 // INR per km for solo cab
    const snapgoFarePerKm = 8 // INR per km base
    const bookingFee = 30 // Base booking fee

    // Calculate costs
    const soloCabCost = distance * baseCabFarePerKm + bookingFee
    const snapgoCostPerPerson = (distance * snapgoFarePerKm + bookingFee) / riders

    // Calculate savings
    const savingsPerTrip = soloCabCost - snapgoCostPerPerson
    const savingsPercent = Math.round((savingsPerTrip / soloCabCost) * 100)

    // Frequency multipliers
    const tripsPerMonth = frequency === 'daily' ? 22 : frequency === 'weekly' ? 4 : 1
    const monthlySavings = savingsPerTrip * tripsPerMonth * 2 // Round trips
    const yearlySavings = monthlySavings * 12

    return {
      soloCabCost: Math.round(soloCabCost),
      snapgoCost: Math.round(snapgoCostPerPerson),
      savingsPerTrip: Math.round(savingsPerTrip),
      savingsPercent,
      monthlySavings: Math.round(monthlySavings),
      yearlySavings: Math.round(yearlySavings),
    }
  }, [distance, frequency, riders])

  const frequencyOptions = [
    { value: 'daily', label: 'Daily', icon: '🌅' },
    { value: 'weekly', label: 'Weekly', icon: '📅' },
    { value: 'monthly', label: 'Monthly', icon: '🗓️' },
  ] as const

  return (
    <section
      ref={containerRef}
      className={`section-padding bg-gradient-to-b from-white via-primary/5 to-white relative overflow-hidden ${className}`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-20 right-20 w-80 h-80 bg-teal/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24 2xl:px-32 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4"
          >
            <Calculator className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-semibold">Savings Calculator</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Calculate Your <span className="text-snapgo-gradient">Savings</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            See how much you can save by sharing your daily commute with Snapgo.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calculator Controls */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="gamification-card"
            >
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Car className="w-5 h-5 text-primary" />
                Trip Details
              </h3>

              {/* Distance Slider */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-gray-700">Distance (one way)</label>
                  <span className="text-2xl font-bold text-primary">{distance} km</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="50"
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>2 km</span>
                  <span>50 km</span>
                </div>
              </div>

              {/* Frequency Selector */}
              <div className="mb-8">
                <label className="text-sm font-medium text-gray-700 mb-3 block">How often do you travel?</label>
                <div className="grid grid-cols-3 gap-3">
                  {frequencyOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFrequency(option.value)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        frequency === option.value
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{option.icon}</div>
                      <div className="text-sm font-medium">{option.label}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Riders Selector */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Number of Riders
                  </label>
                  <span className="text-lg font-bold text-primary">{riders} people</span>
                </div>
                <div className="flex gap-3">
                  {[2, 3, 4].map((num) => (
                    <motion.button
                      key={num}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setRiders(num)}
                      className={`flex-1 py-4 rounded-xl border-2 font-semibold transition-all ${
                        riders === num
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      {num}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-6"
            >
              {/* Per Trip Comparison */}
              <div className="gamification-card bg-gradient-to-br from-gray-50 to-white">
                <h3 className="text-lg font-semibold mb-4">Per Trip Comparison</h3>

                {/* Solo Cab */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Solo Cab Ride</span>
                    <span className="text-gray-900 font-semibold">
                      <IndianRupee className="w-4 h-4 inline" />
                      {calculations.soloCabCost}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: '100%' } : {}}
                      transition={{ delay: 0.6, duration: 0.8 }}
                      className="h-full bg-gray-400 rounded-full"
                    />
                  </div>
                </div>

                {/* Snapgo */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-primary font-medium">With Snapgo</span>
                    <span className="text-primary font-bold">
                      <IndianRupee className="w-4 h-4 inline" />
                      {calculations.snapgoCost}
                    </span>
                  </div>
                  <div className="h-3 bg-primary/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${100 - calculations.savingsPercent}%` } : {}}
                      transition={{ delay: 0.8, duration: 0.8 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>

                {/* Savings Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 1, type: 'spring', stiffness: 200 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-full font-semibold"
                >
                  <TrendingUp className="w-4 h-4" />
                  Save {calculations.savingsPercent}% per trip
                </motion.div>
              </div>

              {/* Projected Savings */}
              <div className="gamification-card bg-gradient-to-br from-primary/5 to-teal/5 border-primary/20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Projected Savings</h3>
                  <div className="flex bg-white rounded-lg p-1 shadow-inner">
                    {['monthly', 'yearly'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode as 'monthly' | 'yearly')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                          viewMode === mode
                            ? 'bg-primary text-white shadow'
                            : 'text-gray-600 hover:text-primary'
                        }`}
                      >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={viewMode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-center py-6"
                  >
                    <div className="flex items-center justify-center gap-1 text-5xl md:text-6xl font-bold text-primary">
                      <IndianRupee className="w-10 h-10" />
                      <motion.span
                        key={viewMode === 'monthly' ? calculations.monthlySavings : calculations.yearlySavings}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="counter-value"
                      >
                        {(viewMode === 'monthly' ? calculations.monthlySavings : calculations.yearlySavings).toLocaleString()}
                      </motion.span>
                    </div>
                    <p className="text-gray-600 mt-2">
                      Estimated {viewMode} savings
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* What you could do */}
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm text-gray-600 text-center">
                    That's equivalent to{' '}
                    <span className="font-semibold text-primary">
                      {Math.round(
                        (viewMode === 'monthly' ? calculations.monthlySavings : calculations.yearlySavings) / 500
                      )}
                    </span>{' '}
                    movie tickets or{' '}
                    <span className="font-semibold text-primary">
                      {Math.round(
                        (viewMode === 'monthly' ? calculations.monthlySavings : calculations.yearlySavings) / 300
                      )}
                    </span>{' '}
                    meals out!
                  </p>
                </div>
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.2 }}
                className="flex gap-4"
              >
                <Button variant="gradient" size="lg" className="flex-1">
                  <Wallet className="w-5 h-5 mr-2" />
                  Start Saving Now
                </Button>
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
