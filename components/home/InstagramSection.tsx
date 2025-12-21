'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Instagram, Play, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Reels data - replace with actual Instagram reels later
const reels = [
  { id: 1, title: 'Save 75% on Daily Commute', views: '12K', color: 'from-[#0066B3] to-teal-500' },
  { id: 2, title: 'How Snapgo Matching Works', views: '8.5K', color: 'from-teal-500 to-emerald-500' },
  { id: 3, title: 'Student Success Stories', views: '15K', color: 'from-purple-500 to-[#0066B3]' },
  { id: 4, title: 'Safety Features Demo', views: '6.2K', color: 'from-[#0066B3] to-indigo-500' },
  { id: 5, title: 'Real Rides, Real Savings', views: '9.8K', color: 'from-teal-600 to-[#0066B3]' },
]

export function InstagramSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play reels
  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reels.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToPrev = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + reels.length) % reels.length)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % reels.length)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
  }

  return (
    <section className="section-padding bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Instagram className="w-6 h-6 text-pink-500" />
            <span className="text-lg font-medium text-white">@snapgo.in</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Watch Our Reels
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            See real stories of commuters saving money and sharing rides with Snapgo.
          </p>
        </div>

        {/* Reels Carousel */}
        <div className="max-w-sm mx-auto relative">
          {/* Main Reel Display */}
          <div className="relative aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className={`absolute inset-0 bg-gradient-to-br ${reels[currentIndex].color}`}
              >
                {/* Reel Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-6">
                    <Play className="w-10 h-10 text-white ml-1" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {reels[currentIndex].title}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {reels[currentIndex].views} views
                  </p>
                </div>

                {/* Instagram Reel Overlay */}
                <div className="absolute top-4 right-4">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9.5v5l4.5-2.5L10 10.5z" />
                  </svg>
                </div>

                {/* Progress bars */}
                <div className="absolute top-4 left-4 right-12 flex gap-1">
                  {reels.map((_, index) => (
                    <div
                      key={index}
                      className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden"
                    >
                      <motion.div
                        className="h-full bg-white"
                        initial={{ width: '0%' }}
                        animate={{
                          width: index === currentIndex ? '100%' : index < currentIndex ? '100%' : '0%'
                        }}
                        transition={{
                          duration: index === currentIndex && isAutoPlaying ? 4 : 0,
                          ease: 'linear'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-white hover:bg-black/50 transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-white hover:bg-black/50 transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {reels.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white w-6'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href="https://instagram.com/snapgo.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            <Instagram className="w-5 h-5" />
            Follow @snapgo.in
          </Link>
        </div>
      </div>
    </section>
  )
}
