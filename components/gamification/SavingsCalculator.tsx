'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Calculator, Car, Users, TrendingUp, IndianRupee, Share2, Leaf, TreeDeciduous,
  Sun, Calendar, CalendarDays, Sparkles, ShoppingBag, Smartphone, Plane,
  Laptop, Headphones, Pizza, Watch, Camera, Dumbbell, Bike, Check, Lock,
  ChevronLeft, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import html2canvas from 'html2canvas'

interface SavingsCalculatorProps {
  className?: string
}

// Format number in Indian style (1,50,000) consistently on server and client
const formatIndianNumber = (num: number): string => {
  const str = Math.abs(num).toString()
  if (str.length <= 3) return num.toString()

  // Indian numbering: last 3 digits, then groups of 2
  const lastThree = str.slice(-3)
  const remaining = str.slice(0, -3)
  const formatted = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree

  return num < 0 ? '-' + formatted : formatted
}

// Expanded purchasable items for carousel
const purchasableItems = [
  { icon: Bike, name: 'Royal Enfield', cost: 150000, color: 'from-red-500 to-orange-600' },
  { icon: Laptop, name: 'MacBook Pro', cost: 120000, color: 'from-gray-600 to-gray-800' },
  { icon: Smartphone, name: 'iPhone 15 Pro', cost: 100000, color: 'from-blue-500 to-purple-600' },
  { icon: Plane, name: 'International Trip', cost: 80000, color: 'from-cyan-500 to-blue-600' },
  { icon: Camera, name: 'Sony Camera', cost: 60000, color: 'from-orange-500 to-red-600' },
  { icon: Laptop, name: 'Gaming Laptop', cost: 50000, color: 'from-green-500 to-emerald-600' },
  { icon: Plane, name: 'Goa Trip', cost: 30000, color: 'from-teal-500 to-cyan-600' },
  { icon: Headphones, name: 'AirPods Max', cost: 25000, color: 'from-pink-500 to-rose-600' },
  { icon: Watch, name: 'Apple Watch', cost: 20000, color: 'from-slate-500 to-slate-700' },
  { icon: ShoppingBag, name: 'Shopping Spree', cost: 15000, color: 'from-amber-500 to-orange-600' },
  { icon: Dumbbell, name: 'Gym Membership', cost: 10000, color: 'from-violet-500 to-purple-600' },
  { icon: Pizza, name: 'Pizza Parties', cost: 5000, color: 'from-red-500 to-orange-500' },
]

export default function SavingsCalculator({ className }: SavingsCalculatorProps) {
  const containerRef = useRef(null)
  const shareableRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLInputElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Carousel scroll functions
  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -160, behavior: 'smooth' })
  }
  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 160, behavior: 'smooth' })
  }
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  const [distance, setDistance] = useState(15)
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [riders, setRiders] = useState(2)
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly')
  const [showCelebration, setShowCelebration] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [tempName, setTempName] = useState('')
  const shareNameRef = useRef('')
  const viewModeRef = useRef<'monthly' | 'yearly'>('monthly')

  useEffect(() => {
    if (sliderRef.current) {
      const progress = ((distance - 2) / (50 - 2)) * 100
      sliderRef.current.style.setProperty('--slider-progress', `${progress}%`)
    }
  }, [distance])

  // Keep ref in sync with state for PNG rendering
  useEffect(() => {
    viewModeRef.current = viewMode
  }, [viewMode])

  const calculations = useMemo(() => {
    const baseCabFarePerKm = 14
    const snapgoFarePerKm = 8
    const bookingFee = 30
    const co2PerKm = 120

    const soloCabCost = distance * baseCabFarePerKm + bookingFee
    const snapgoCostPerPerson = (distance * snapgoFarePerKm + bookingFee) / riders
    const savingsPerTrip = soloCabCost - snapgoCostPerPerson
    const savingsPercent = Math.round((savingsPerTrip / soloCabCost) * 100)

    const tripsPerMonth = frequency === 'daily' ? 22 : frequency === 'weekly' ? 4 : 1
    const monthlySavings = savingsPerTrip * tripsPerMonth * 2
    const yearlySavings = monthlySavings * 12

    const co2SavedPerTrip = (distance * co2PerKm * (riders - 1)) / 1000
    const monthlyCO2Saved = co2SavedPerTrip * tripsPerMonth * 2
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

  const getSavingsTier = () => {
    const savings = viewMode === 'monthly' ? calculations.monthlySavings : calculations.yearlySavings
    if (savings > 5000) return 'high'
    if (savings > 2000) return 'medium'
    return 'low'
  }

  const handleShareWithName = async (name: string) => {
    shareNameRef.current = name
    setShareDialogOpen(false)
    setTempName('')
    // Force re-render and wait
    await new Promise(resolve => setTimeout(resolve, 150))
    await generateAndShare()
  }

  const handleShareWithoutName = async () => {
    shareNameRef.current = ''
    setShareDialogOpen(false)
    setTempName('')
    await new Promise(resolve => setTimeout(resolve, 150))
    await generateAndShare()
  }

  const generateAndShare = async () => {
    if (!shareableRef.current) return
    setIsSharing(true)
    try {
      const canvas = await html2canvas(shareableRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
      })
      canvas.toBlob(async (blob) => {
        if (!blob) { setIsSharing(false); return }
        const file = new File([blob], 'snapgo-savings.png', { type: 'image/png' })

        const currentViewMode = viewModeRef.current
        const name = shareNameRef.current
        const displaySavings = currentViewMode === 'monthly' ? calculations.monthlySavings : calculations.yearlySavings
        const displayCO2 = currentViewMode === 'monthly' ? calculations.monthlyCO2Saved : calculations.yearlyCO2Saved
        const period = currentViewMode === 'monthly' ? 'month' : 'year'

        const shareMessage = `🚗 ${name ? `${name} is saving` : "I'm saving"} ₹${formatIndianNumber(displaySavings)}/${period} with Snapgo!

📊 ${calculations.savingsPercent}% less than solo cabs
🌱 Reducing ${displayCO2}kg CO₂ emissions
🎬 That's ${Math.round(displaySavings / 250)} movie tickets!

Calculate yours too 👇
https://snapgo.co.in

#Snapgo #Carpooling #SaveMoney #GreenCommute`

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              text: shareMessage,
              title: 'My Snapgo Savings',
            })
          } catch { downloadImage(blob) }
        } else { downloadImage(blob) }
        setIsSharing(false)
      }, 'image/png', 0.95)
    } catch { setIsSharing(false) }
  }

  const downloadImage = (blob: Blob) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'snapgo-savings.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Count affordable items and sort: unlocked first, then locked
  const affordableCount = purchasableItems.filter(item => calculations.yearlySavings >= item.cost).length

  // Sort items: unlocked items first (sorted by cost descending), then locked items
  const sortedItems = useMemo(() => {
    const unlocked = purchasableItems.filter(item => calculations.yearlySavings >= item.cost)
      .sort((a, b) => b.cost - a.cost) // Highest unlocked first
    const locked = purchasableItems.filter(item => calculations.yearlySavings < item.cost)
      .sort((a, b) => a.cost - b.cost) // Cheapest locked first (easiest to unlock)
    return [...unlocked, ...locked]
  }, [calculations.yearlySavings])

  return (
    <section
      ref={containerRef}
      className={`gradient-mesh-bg py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 2xl:px-24 relative z-10 overflow-x-hidden">
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4 border border-white/30"
          >
            <Calculator className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-semibold">Savings Calculator</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 text-white drop-shadow-lg">
            Calculate Your <span className="text-yellow-300">Savings</span>
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
            See how much you can save by sharing your daily commute with Snapgo.
          </p>
        </motion.div>

        {/* Main Grid - Equal Height Columns */}
        <div className="max-w-6xl mx-auto w-full overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 w-full overflow-hidden">

            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-4 sm:gap-5 w-full min-w-0">
              {/* Card 1: Trip Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="glass-card-solid p-5 sm:p-6 w-full"
              >
                <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center">
                    <Car className="w-4 h-4 text-white" />
                  </div>
                  Trip Details
                </h3>

                {/* Distance */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-600">Distance</label>
                    <motion.span key={distance} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-lg sm:text-xl font-bold text-primary">
                      {distance} km
                    </motion.span>
                  </div>
                  <input ref={sliderRef} type="range" min="2" max="50" value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="custom-slider w-full h-2 rounded-full cursor-pointer" />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>2 km</span><span>50 km</span></div>
                </div>

                {/* Frequency */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Frequency</label>
                  <div className="flex gap-2">
                    {frequencyOptions.map((option) => {
                      const IconComponent = option.Icon
                      return (
                        <motion.button key={option.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setFrequency(option.value)}
                          className={`flex-1 py-3 px-3 rounded-xl border-2 transition-all flex items-center justify-center gap-1.5 ${
                            frequency === option.value ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}>
                          <IconComponent className="w-4 h-4" />
                          <span className="text-sm font-medium">{option.label}</span>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {/* Riders */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1.5"><Users className="w-4 h-4" />Riders</label>
                    <span className="text-sm font-semibold text-primary">{riders} people</span>
                  </div>
                  <div className="flex gap-2">
                    {[2, 3, 4].map((num) => (
                      <motion.button key={num} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setRiders(num)}
                        className={`flex-1 py-3 rounded-xl border-2 font-bold text-base transition-all ${
                          riders === num ? 'border-primary bg-gradient-to-br from-primary to-teal-600 text-white shadow-lg' : 'border-gray-200 text-gray-500 hover:border-primary/50'
                        }`}>
                        {num}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Card 2: What You Could Buy - Extended with Carousel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="glass-card-solid p-5 sm:p-6 flex-1 flex flex-col min-h-[200px] sm:min-h-[260px] lg:min-h-0 w-full overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-gray-800">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 text-white" />
                    </div>
                    What You Could Buy
                  </h3>
                  <span className="text-xs sm:text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    {affordableCount} Unlocked
                  </span>
                </div>

                {/* Carousel Container with Manual Scroll */}
                <div className="relative flex-1 overflow-hidden">
                  {/* Left Arrow - Hidden on mobile */}
                  <button
                    onClick={scrollLeft}
                    className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 rounded-full shadow-lg items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>

                  {/* Scrollable Container - Unlocked items first */}
                  <div
                    ref={carouselRef}
                    className="overflow-x-auto scroll-smooth snap-x snap-mandatory flex gap-3 py-2 px-1 sm:px-10 no-scrollbar touch-pan-x"
                  >
                    {sortedItems.map((item, idx) => {
                      const ItemIcon = item.icon
                      const isAffordable = calculations.yearlySavings >= item.cost
                      const amountNeeded = item.cost - calculations.yearlySavings

                      return (
                        <div
                          key={idx}
                          className={`snap-start flex-shrink-0 w-[115px] sm:w-36 rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 transition-all ${
                            isAffordable
                              ? 'bg-white border-emerald-400 shadow-xl shadow-emerald-500/20'
                              : 'bg-gray-100 border-gray-300 opacity-70'
                          }`}
                        >
                          {/* Status Badge */}
                          <div className={`text-[11px] sm:text-xs font-bold mb-2 flex items-center justify-center gap-1 py-1 px-2 rounded-full ${
                            isAffordable ? 'text-white bg-emerald-500' : 'text-gray-500 bg-gray-200'
                          }`}>
                            {isAffordable ? (
                              <><Check className="w-3 h-3" /> UNLOCKED</>
                            ) : (
                              <><Lock className="w-3 h-3" /> ₹{Math.round(amountNeeded/1000)}K more</>
                            )}
                          </div>

                          {/* Icon */}
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl mx-auto mb-2 sm:mb-3 flex items-center justify-center ${
                            isAffordable ? `bg-gradient-to-br ${item.color}` : 'bg-gray-300'
                          }`}>
                            <ItemIcon className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ${isAffordable ? 'text-white' : 'text-gray-500'}`} />
                          </div>

                          {/* Name & Cost */}
                          <p className={`text-sm font-bold text-center mb-1 leading-tight ${isAffordable ? 'text-gray-900' : 'text-gray-500'}`}>
                            {item.name}
                          </p>
                          <p className={`text-xs font-semibold text-center ${isAffordable ? 'text-emerald-600' : 'text-gray-400'}`}>
                            ₹{formatIndianNumber(item.cost)}
                          </p>
                        </div>
                      )
                    })}
                  </div>

                  {/* Right Arrow - Hidden on mobile */}
                  <button
                    onClick={scrollRight}
                    className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 rounded-full shadow-lg items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                {/* Swipe hint for mobile */}
                <p className="text-[11px] text-gray-400 text-center mt-1 sm:hidden">
                  ← Swipe to see more →
                </p>
                <p className="text-xs text-gray-500 text-center mt-2 sm:mt-3">
                  Your yearly savings: <span className="font-bold text-primary">₹{formatIndianNumber(calculations.yearlySavings)}</span>
                </p>
              </motion.div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-4 sm:gap-5 w-full min-w-0">
              {/* Card 3: Per Trip Comparison */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="glass-card-solid p-5 sm:p-6 w-full"
              >
                <h3 className="text-sm sm:text-base font-semibold mb-4 flex items-center gap-2 text-gray-800">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5 text-white" />
                  </div>
                  Per Trip Comparison
                </h3>

                <div className="space-y-3">
                  {/* Solo Cab */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-gray-600 text-xs sm:text-sm">Solo Cab Ride</span>
                      <span className="text-gray-800 font-semibold text-sm flex items-center"><IndianRupee className="w-3 h-3" />{calculations.soloCabCost}</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={isInView ? { width: '100%' } : {}} transition={{ delay: 0.6, duration: 0.8 }} className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full" />
                    </div>
                  </div>

                  {/* Snapgo */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-primary font-medium text-xs sm:text-sm">With Snapgo</span>
                      <span className="text-primary font-bold text-sm flex items-center"><IndianRupee className="w-3 h-3" />{calculations.snapgoCost}</span>
                    </div>
                    <div className="h-3 bg-primary/20 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={isInView ? { width: `${100 - calculations.savingsPercent}%` } : {}} transition={{ delay: 0.8, duration: 0.8 }} className="h-full bg-gradient-to-r from-primary to-teal-600 rounded-full" />
                    </div>
                  </div>
                </div>

                <motion.div initial={{ scale: 0 }} animate={isInView ? { scale: 1 } : {}} transition={{ delay: 1, type: 'spring' }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 mt-4 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-full font-semibold text-xs">
                  <TrendingUp className="w-3.5 h-3.5" />Save {calculations.savingsPercent}% per trip
                </motion.div>
              </motion.div>

              {/* Card 4: Projected Savings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="glass-card-solid p-5 sm:p-6 relative overflow-hidden w-full"
              >
                <AnimatePresence>
                  {showCelebration && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-gradient-to-r from-primary/10 via-teal-500/10 to-emerald-500/10" />
                  )}
                </AnimatePresence>

                <div className="flex justify-between items-center mb-3 relative">
                  <h3 className="text-sm sm:text-base font-semibold flex items-center gap-2 text-gray-800">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center">
                      <IndianRupee className="w-3.5 h-3.5 text-white" />
                    </div>
                    Projected Savings
                    {showCelebration && <Sparkles className="w-4 h-4 text-yellow-500" />}
                  </h3>
                  <div className="flex bg-gray-100 rounded-lg p-0.5">
                    {['monthly', 'yearly'].map((mode) => (
                      <button key={mode} onClick={() => setViewMode(mode as 'monthly' | 'yearly')}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                          viewMode === mode ? 'bg-gradient-to-r from-primary to-teal-600 text-white shadow-sm' : 'text-gray-600 hover:text-primary'
                        }`}>
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={viewMode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center py-3 sm:py-4 relative">
                    <div className="flex items-center justify-center gap-1 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
                      <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                      <motion.span key={viewMode === 'monthly' ? calculations.monthlySavings : calculations.yearlySavings} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="counter-value">
                        {formatIndianNumber(viewMode === 'monthly' ? calculations.monthlySavings : calculations.yearlySavings)}
                      </motion.span>
                    </div>
                    <p className="text-gray-500 mt-1 text-[11px] sm:text-xs md:text-sm">Estimated {viewMode} savings</p>
                  </motion.div>
                </AnimatePresence>

                <div className="border-t border-gray-100 pt-3 mt-2 relative">
                  <p className="text-[10px] sm:text-xs text-gray-500 text-center">
                    That's <span className="font-semibold text-primary">{Math.round((viewMode === 'monthly' ? calculations.monthlySavings : calculations.yearlySavings) / 500)}</span> movie tickets!
                  </p>
                </div>
              </motion.div>

              {/* Card 5: Environmental Impact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="glass-card-solid p-5 sm:p-6 bg-gradient-to-br from-emerald-50 to-teal-50 flex-1 w-full"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Leaf className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-emerald-800">Environmental Impact</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/80 rounded-lg sm:rounded-xl p-2.5 sm:p-3 border border-emerald-100">
                    <p className="text-[10px] sm:text-xs text-emerald-700 font-medium mb-1">CO₂ Saved</p>
                    <AnimatePresence mode="wait">
                      <motion.div key={viewMode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-baseline gap-1">
                        <span className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-600">{viewMode === 'monthly' ? calculations.monthlyCO2Saved : calculations.yearlyCO2Saved}</span>
                        <span className="text-[9px] text-emerald-500">kg/{viewMode === 'monthly' ? 'mo' : 'yr'}</span>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="bg-white/80 rounded-lg sm:rounded-xl p-2.5 sm:p-3 border border-emerald-100">
                    <p className="text-[10px] sm:text-xs text-emerald-700 font-medium mb-1">Trees Equivalent</p>
                    <div className="flex items-center gap-1">
                      <TreeDeciduous className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                      <span className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-600">{calculations.treesEquivalent}</span>
                    </div>
                    <p className="text-[8px] text-emerald-500">planted/year</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Share Button - Centered */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.8 }}
            className="flex justify-center mt-6 sm:mt-8">
            <Button
              size="lg"
              onClick={() => setShareDialogOpen(true)}
              disabled={isSharing}
              className="px-6 sm:px-10 h-12 sm:h-14 text-sm sm:text-base bg-white text-primary border-2 border-white hover:bg-gray-100 font-bold shadow-xl rounded-full"
            >
              {isSharing ? (
                <><span className="animate-spin mr-2">⏳</span> Generating...</>
              ) : (
                <><Share2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Share My Savings</>
              )}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Share Dialog */}
      <AnimatePresence>
        {shareDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShareDialogOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Share Your Savings</h3>
                  <p className="text-sm text-gray-500">Add your name to personalize</p>
                </div>
              </div>

              {/* Name Input */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Your Name (optional)</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Preview */}
              <div className="bg-gradient-to-br from-primary/5 to-teal-500/5 rounded-xl p-4 mb-5 border border-primary/10">
                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                <p className="text-sm font-semibold text-gray-800">
                  {tempName.trim() ? (
                    <><span className="text-primary">{tempName.trim()}</span> is saving <span className="text-emerald-600">₹{formatIndianNumber(viewMode === 'monthly' ? calculations.monthlySavings : calculations.yearlySavings)}</span> per {viewMode === 'monthly' ? 'month' : 'year'}</>
                  ) : (
                    <>I'm saving <span className="text-emerald-600">₹{formatIndianNumber(viewMode === 'monthly' ? calculations.monthlySavings : calculations.yearlySavings)}</span> per {viewMode === 'monthly' ? 'month' : 'year'}</>
                  )}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => handleShareWithName(tempName.trim())}
                  disabled={!tempName.trim() || isSharing}
                  className="w-full bg-gradient-to-r from-primary to-teal-600 hover:from-primary/90 hover:to-teal-600/90 text-white font-semibold h-12"
                >
                  {isSharing ? 'Generating...' : 'Share with Name'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShareWithoutName}
                  disabled={isSharing}
                  className="w-full border-gray-300 hover:bg-gray-50 font-medium h-12"
                >
                  Share without Name
                </Button>
              </div>

              <p className="text-xs text-gray-400 text-center mt-4">
                Your savings card will be generated as a shareable image
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Shareable Template - Spotify Wrapped Style */}
      <div className="fixed -left-[9999px] top-0">
        <div
          ref={shareableRef}
          style={{
            width: '400px',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            backgroundColor: '#ffffff'
          }}
        >
          {/* Main Container */}
          <div style={{ padding: '40px 32px', textAlign: 'center' as const }}>

            {/* Logo Section */}
            <div style={{ marginBottom: '20px' }}>
              <img
                src="/images/logo/Snapgo%20Logo%20Blue.png"
                alt="Snapgo"
                style={{
                  width: 'auto',
                  height: '60px',
                  margin: '0 auto',
                  display: 'block'
                }}
              />
              <div style={{
                fontSize: '11px',
                color: '#6b7280',
                marginTop: '4px',
                letterSpacing: '1px',
                textTransform: 'uppercase' as const
              }}>
                Smart Ride Sharing
              </div>
            </div>

            {/* Divider */}
            <div style={{
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)',
              marginBottom: '32px'
            }} />

            {/* Hero Savings */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                fontSize: '14px',
                color: '#6b7280',
                marginBottom: '4px'
              }}>
                {shareNameRef.current ? `${shareNameRef.current} is saving` : "I'm saving"}
              </div>
              <div style={{
                fontSize: '56px',
                fontWeight: 900,
                color: '#0e4493',
                lineHeight: '1',
                letterSpacing: '-2px'
              }}>
                ₹{formatIndianNumber(viewModeRef.current === 'monthly' ? calculations.monthlySavings : calculations.yearlySavings)}
              </div>
              <div style={{
                fontSize: '18px',
                color: '#10b981',
                fontWeight: 600,
                marginTop: '14px'
              }}>
                per {viewModeRef.current === 'monthly' ? 'month' : 'year'}
              </div>
            </div>

            {/* Divider */}
            <div style={{
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)',
              marginBottom: '24px'
            }} />

            {/* Stats Boxes */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '28px'
            }}>
              {/* Savings Box */}
              <div style={{
                flex: 1,
                background: '#0e4493',
                borderRadius: '16px',
                padding: '24px 20px',
                color: 'white',
                textAlign: 'center' as const
              }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  lineHeight: '1.2'
                }}>
                  {calculations.savingsPercent}%
                </div>
                <div style={{
                  fontSize: '11px',
                  opacity: 0.85,
                  marginTop: '10px',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.5px'
                }}>
                  saved per trip
                </div>
              </div>

              {/* CO₂ Box */}
              <div style={{
                flex: 1,
                background: '#10b981',
                borderRadius: '16px',
                padding: '24px 20px',
                color: 'white',
                textAlign: 'center' as const
              }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  lineHeight: '1.2'
                }}>
                  {viewModeRef.current === 'monthly' ? calculations.monthlyCO2Saved : calculations.yearlyCO2Saved}kg
                </div>
                <div style={{
                  fontSize: '11px',
                  opacity: 0.85,
                  marginTop: '10px',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.5px'
                }}>
                  CO₂ reduced
                </div>
              </div>
            </div>

            {/* Footer - Minimal */}
            <div style={{
              marginTop: '28px',
              paddingTop: '20px',
              borderTop: '1px solid #e5e7eb',
              textAlign: 'center' as const
            }}>
              <div style={{
                fontSize: '13px',
                color: '#9ca3af',
                marginBottom: '6px'
              }}>
                {distance}km • {frequency === 'daily' ? 'Daily Commuter' : frequency === 'weekly' ? 'Weekly Traveller' : 'Monthly Trips'} • {riders} Riders
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#0e4493',
                letterSpacing: '-0.3px'
              }}>
                🚗  Ride Smart . Save More 💸
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
