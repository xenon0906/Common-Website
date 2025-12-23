'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Calculator, Car, Users, Wallet, TrendingUp, IndianRupee, Share2, Leaf, TreeDeciduous, Sun, Calendar, CalendarDays, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SavingsCalculatorProps {
  className?: string
}

export function SavingsCalculator({ className }: SavingsCalculatorProps) {
  const containerRef = useRef(null)
  const sliderRef = useRef<HTMLInputElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  const [distance, setDistance] = useState(15) // km
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [riders, setRiders] = useState(2)
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly')
  const [showCelebration, setShowCelebration] = useState(false)

  // Update slider progress CSS variable
  useEffect(() => {
    if (sliderRef.current) {
      const progress = ((distance - 2) / (50 - 2)) * 100
      sliderRef.current.style.setProperty('--slider-progress', `${progress}%`)
    }
  }, [distance])

  // Pricing calculations (approximate INR rates)
  const calculations = useMemo(() => {
    const baseCabFarePerKm = 14 // INR per km for solo cab
    const snapgoFarePerKm = 8 // INR per km base
    const bookingFee = 30 // Base booking fee
    const co2PerKm = 120 // grams CO2 per km for average car

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

    // CO2 calculations - savings from sharing ride instead of multiple solo trips
    const co2SavedPerTrip = (distance * co2PerKm * (riders - 1)) / 1000 // in kg
    const monthlyCO2Saved = co2SavedPerTrip * tripsPerMonth * 2 // round trips
    const yearlyCO2Saved = monthlyCO2Saved * 12
    const treesEquivalent = yearlyCO2Saved / 22

    return {
      soloCabCost: Math.round(soloCabCost),
      snapgoCost: Math.round(snapgoCostPerPerson),
      savingsPerTrip: Math.round(savingsPerTrip),
      savingsPercent,
      monthlySavings: Math.round(monthlySavings),
      yearlySavings: Math.round(yearlySavings),
      co2SavedPerTrip: Math.round(co2SavedPerTrip * 10) / 10,
      monthlyCO2Saved: Math.round(monthlyCO2Saved),
      yearlyCO2Saved: Math.round(yearlyCO2Saved),
      treesEquivalent: Math.round(treesEquivalent * 10) / 10,
    }
  }, [distance, frequency, riders])

  // Show celebration for large savings
  useEffect(() => {
    const currentSavings = viewMode === 'monthly' ? calculations.monthlySavings : calculations.yearlySavings
    if (currentSavings > 2000) {
      setShowCelebration(true)
      const timer = setTimeout(() => setShowCelebration(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [calculations.monthlySavings, calculations.yearlySavings, viewMode])

  const frequencyOptions = [
    { value: 'daily' as const, label: 'Daily', Icon: Sun },
    { value: 'weekly' as const, label: 'Weekly', Icon: Calendar },
    { value: 'monthly' as const, label: 'Monthly', Icon: CalendarDays },
  ]

  // Get savings tier for styling
  const getSavingsTier = () => {
    const savings = viewMode === 'monthly' ? calculations.monthlySavings : calculations.yearlySavings
    if (savings > 5000) return 'high'
    if (savings > 2000) return 'medium'
    return 'low'
  }

  return (
    <section
      ref={containerRef}
      className={`section-padding bg-gradient-to-b from-white via-primary/5 to-white relative overflow-hidden ${className}`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
            x: [0, 20, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -left-20 w-72 h-72 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.1, 0.2, 0.1],
            y: [0, -30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-20 -right-20 w-64 h-64 sm:w-80 sm:h-80 bg-teal/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute top-1/2 left-1/3 w-48 h-48 sm:w-64 sm:h-64 bg-emerald-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 2xl:px-24 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/10 rounded-full mb-3 sm:mb-4"
          >
            <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            <span className="text-primary text-xs sm:text-sm font-semibold">Savings Calculator</span>
          </motion.div>
          <h2 className="text-2xl xs:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            Calculate Your <span className="text-snapgo-gradient">Savings</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-2">
            See how much you can save by sharing your daily commute with Snapgo.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Calculator Controls */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="gamification-card relative overflow-hidden"
            >
              {/* Accent border */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-teal to-primary rounded-l-2xl" />

              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-2 pl-2">
                <Car className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Trip Details
              </h3>

              {/* Distance Slider */}
              <div className="mb-6 sm:mb-8 pl-2">
                <div className="flex justify-between items-center mb-2 sm:mb-3">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Distance (one way)</label>
                  <motion.span
                    key={distance}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-xl sm:text-2xl font-bold text-primary"
                  >
                    {distance} km
                  </motion.span>
                </div>
                <input
                  ref={sliderRef}
                  type="range"
                  min="2"
                  max="50"
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  className="custom-slider w-full h-2 rounded-full cursor-pointer"
                />
                <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 mt-1">
                  <span>2 km</span>
                  <span>50 km</span>
                </div>
              </div>

              {/* Frequency Selector */}
              <div className="mb-6 sm:mb-8 pl-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 block">How often do you travel?</label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {frequencyOptions.map((option) => {
                    const IconComponent = option.Icon
                    return (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setFrequency(option.value)}
                        className={`p-2.5 sm:p-4 rounded-xl border-2 transition-all min-h-[70px] sm:min-h-[88px] flex flex-col items-center justify-center ${
                          frequency === option.value
                            ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 text-primary shadow-lg shadow-primary/10'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 ${
                          frequency === option.value ? 'text-primary' : 'text-gray-500'
                        }`} />
                        <div className="text-xs sm:text-sm font-medium">{option.label}</div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Riders Selector */}
              <div className="pl-2">
                <div className="flex justify-between items-center mb-2 sm:mb-3">
                  <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5 sm:gap-2">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Number of Riders
                  </label>
                  <span className="text-base sm:text-lg font-bold text-primary">{riders} people</span>
                </div>
                <div className="flex gap-2 sm:gap-3">
                  {[2, 3, 4].map((num) => (
                    <motion.button
                      key={num}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setRiders(num)}
                      className={`flex-1 py-3 sm:py-4 rounded-xl border-2 font-bold text-lg sm:text-xl transition-all ${
                        riders === num
                          ? 'border-primary bg-gradient-to-br from-primary to-primary/90 text-white shadow-lg shadow-primary/25'
                          : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
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
              className="space-y-4 sm:space-y-6"
            >
              {/* Per Trip Comparison */}
              <div className="gamification-card bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-400 to-primary rounded-l-2xl" />
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 pl-2">Per Trip Comparison</h3>

                {/* Solo Cab */}
                <div className="mb-3 sm:mb-4 pl-2">
                  <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                    <span className="text-gray-600 text-sm sm:text-base">Solo Cab Ride</span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-base flex items-center">
                      <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {calculations.soloCabCost}
                    </span>
                  </div>
                  <div className="h-2.5 sm:h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: '100%' } : {}}
                      transition={{ delay: 0.6, duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Snapgo */}
                <div className="mb-3 sm:mb-4 pl-2">
                  <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                    <span className="text-primary font-medium text-sm sm:text-base">With Snapgo</span>
                    <span className="text-primary font-bold text-sm sm:text-base flex items-center">
                      <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {calculations.snapgoCost}
                    </span>
                  </div>
                  <div className="h-2.5 sm:h-3 bg-primary/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${100 - calculations.savingsPercent}%` } : {}}
                      transition={{ delay: 0.8, duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-primary to-teal rounded-full"
                    />
                  </div>
                </div>

                {/* Savings Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 1, type: 'spring', stiffness: 200 }}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-700 rounded-full font-semibold text-xs sm:text-sm ml-2"
                >
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Save {calculations.savingsPercent}% per trip
                </motion.div>
              </div>

              {/* Projected Savings */}
              <div className="gamification-card bg-gradient-to-br from-primary/5 via-white to-teal/5 border-primary/20 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-blue-500 to-teal rounded-l-2xl" />

                {/* Celebration effect */}
                <AnimatePresence>
                  {showCelebration && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-r from-primary/10 via-teal/10 to-primary/10 rounded-2xl"
                    />
                  )}
                </AnimatePresence>

                <div className="flex justify-between items-center mb-3 sm:mb-4 pl-2">
                  <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                    Projected Savings
                    {showCelebration && (
                      <motion.span
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                      >
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                      </motion.span>
                    )}
                  </h3>
                  <div className="flex bg-white rounded-xl p-1 shadow-inner border border-gray-100">
                    {['monthly', 'yearly'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode as 'monthly' | 'yearly')}
                        className={`px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                          viewMode === mode
                            ? 'bg-gradient-to-r from-primary to-primary/90 text-white shadow-md'
                            : 'text-gray-600 hover:text-primary hover:bg-gray-50'
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
                    className="text-center py-4 sm:py-6"
                  >
                    <div className={`flex items-center justify-center gap-0.5 sm:gap-1 text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold ${
                      getSavingsTier() === 'high' ? 'text-primary glow-primary' : 'text-primary'
                    }`}>
                      <IndianRupee className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
                      <motion.span
                        key={viewMode === 'monthly' ? calculations.monthlySavings : calculations.yearlySavings}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        className="counter-value"
                      >
                        {(viewMode === 'monthly' ? calculations.monthlySavings : calculations.yearlySavings).toLocaleString()}
                      </motion.span>
                    </div>
                    <p className="text-gray-600 mt-1.5 sm:mt-2 text-xs sm:text-sm">
                      Estimated {viewMode} savings
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* What you could do */}
                <div className="border-t border-gray-200/50 pt-2.5 sm:pt-3 mt-2.5 sm:mt-3 pl-2">
                  <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 text-center">
                    That's equivalent to{' '}
                    <span className="font-semibold text-primary">
                      {Math.round((viewMode === 'monthly' ? calculations.monthlySavings : calculations.yearlySavings) / 500)}
                    </span>{' '}
                    movie tickets or{' '}
                    <span className="font-semibold text-primary">
                      {Math.round((viewMode === 'monthly' ? calculations.monthlySavings : calculations.yearlySavings) / 300)}
                    </span>{' '}
                    meals out!
                  </p>
                </div>
              </div>

              {/* Environmental Impact Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="gamification-card bg-gradient-to-br from-emerald-100/80 to-teal-50 border-emerald-200 relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 via-green-500 to-teal-500 rounded-l-2xl" />

                {/* Subtle leaf pattern background */}
                <div className="absolute right-2 top-2 opacity-5">
                  <Leaf className="w-24 h-24 sm:w-32 sm:h-32 text-emerald-900" />
                </div>

                <div className="flex items-center gap-2 mb-3 sm:mb-4 pl-2 relative">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h3 className="text-sm sm:text-lg font-semibold text-emerald-800">Environmental Impact</h3>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 pl-2 relative">
                  {/* CO2 Saved */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-2.5 sm:p-4 border border-emerald-100">
                    <p className="text-[10px] sm:text-xs text-emerald-700 mb-0.5 sm:mb-1 font-medium">CO₂ Saved</p>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={viewMode}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="flex items-baseline gap-0.5 sm:gap-1"
                      >
                        <span className="text-lg sm:text-2xl md:text-3xl font-bold text-emerald-600 glow-success">
                          {viewMode === 'monthly' ? calculations.monthlyCO2Saved : calculations.yearlyCO2Saved}
                        </span>
                        <span className="text-[10px] sm:text-xs text-emerald-600/70">kg/{viewMode === 'monthly' ? 'mo' : 'yr'}</span>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Trees Equivalent */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-2.5 sm:p-4 border border-emerald-100">
                    <p className="text-[10px] sm:text-xs text-emerald-700 mb-0.5 sm:mb-1 font-medium">Trees Equivalent</p>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <TreeDeciduous className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                      <span className="text-lg sm:text-2xl md:text-3xl font-bold text-emerald-600">
                        {calculations.treesEquivalent}
                      </span>
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-emerald-600/60 mt-0.5">planted per year</p>
                  </div>
                </div>

                {/* Per trip info */}
                <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-emerald-200/50 pl-2 relative">
                  <p className="text-[10px] sm:text-xs text-emerald-700 text-center">
                    Each shared trip saves{' '}
                    <span className="font-bold text-emerald-600">{calculations.co2SavedPerTrip} kg</span>{' '}
                    of CO₂ emissions
                  </p>
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.2 }}
                className="flex flex-col sm:flex-row gap-2 sm:gap-3"
              >
                <Button variant="gradient" size="lg" className="flex-1 h-11 sm:h-12 text-sm sm:text-base">
                  <Wallet className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Start Saving Now
                </Button>
                <Button variant="outline" size="lg" className="flex items-center justify-center gap-2 h-11 sm:h-12 text-sm sm:text-base">
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
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
