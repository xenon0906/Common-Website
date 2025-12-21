'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Instagram, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Script from 'next/script'

// Add your actual Instagram reel IDs here
// Get the reel ID from the URL: instagram.com/reel/REEL_ID/
const reels = [
  {
    id: 'DDxfo_TTOZF', // Replace with actual reel ID
    title: 'Save 75% on Daily Commute',
  },
  {
    id: 'DDxfo_TTOZF', // Replace with actual reel ID
    title: 'How Snapgo Matching Works',
  },
  {
    id: 'DDxfo_TTOZF', // Replace with actual reel ID
    title: 'Student Success Stories',
  },
]

function InstagramEmbed({ reelId, isActive }: { reelId: string; isActive: boolean }) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Reload Instagram embeds when switching
    if (isActive && typeof window !== 'undefined' && (window as any).instgrm) {
      (window as any).instgrm.Embeds.process()
    }
  }, [isActive, reelId])

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={`https://www.instagram.com/reel/${reelId}/`}
        data-instgrm-version="14"
        style={{
          background: '#000',
          border: 0,
          borderRadius: '24px',
          margin: 0,
          padding: 0,
          width: '100%',
          maxWidth: '540px',
        }}
      >
        <div className="flex items-center justify-center h-full min-h-[500px]">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <Instagram className="w-12 h-12 text-white/50" />
            <p className="text-white/50 text-sm">Loading reel...</p>
          </div>
        </div>
      </blockquote>
    </div>
  )
}

export function InstagramSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Process Instagram embeds after script loads
  useEffect(() => {
    if (mounted && typeof window !== 'undefined' && (window as any).instgrm) {
      (window as any).instgrm.Embeds.process()
    }
  }, [mounted, currentIndex])

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reels.length) % reels.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reels.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <>
      {/* Instagram Embed Script */}
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
          if ((window as any).instgrm) {
            (window as any).instgrm.Embeds.process()
          }
        }}
      />

      <section className="section-padding bg-gray-900">
        <div className="container mx-auto px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24 2xl:px-32">
          {/* Header */}
          <div className="text-center mb-12">
            <Link
              href="https://www.instagram.com/snapgo.co.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 mb-4 hover:opacity-80 transition-opacity"
            >
              <Instagram className="w-6 h-6 text-pink-500" />
              <span className="text-lg font-medium text-white">@snapgo.co.in</span>
            </Link>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Watch Our Reels
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              See real stories of commuters saving money and sharing rides with Snapgo.
            </p>
          </div>

          {/* Reels Carousel */}
          <div className="max-w-md mx-auto relative">
            {/* Main Reel Display */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black min-h-[600px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  {mounted && (
                    <InstagramEmbed
                      reelId={reels[currentIndex].id}
                      isActive={true}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={goToPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors z-20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors z-20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Reel Title */}
            <div className="text-center mt-4">
              <p className="text-white font-medium">{reels[currentIndex].title}</p>
            </div>

            {/* Dot Indicators */}
            <div className="flex justify-center gap-2 mt-4">
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

          {/* Direct Link to Instagram */}
          <div className="text-center mt-10 space-y-4">
            <Link
              href={`https://www.instagram.com/reel/${reels[currentIndex].id}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-colors border border-white/20"
            >
              <ExternalLink className="w-5 h-5" />
              Watch on Instagram
            </Link>
            <div>
              <Link
                href="https://www.instagram.com/snapgo.co.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-medium hover:opacity-90 transition-opacity"
              >
                <Instagram className="w-5 h-5" />
                Follow @snapgo.co.in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
