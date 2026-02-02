'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Instagram, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Script from 'next/script'

// ============================================================================
// INSTAGRAM CONFIGURATION
// ============================================================================
//
// OPTION 1: Manual Reels (Current - No API needed)
// Just add reel IDs manually to the array below
//
// OPTION 2: Automatic Fetching (Requires Meta API)
// Set these environment variables in Vercel:
//   NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN = "your-long-lived-access-token"
//   NEXT_PUBLIC_INSTAGRAM_BUSINESS_ID = "your-instagram-business-account-id"
//
// To get these:
// 1. Go to developers.facebook.com
// 2. Create app → Add Instagram Graph API
// 3. Connect Instagram Business/Creator account
// 4. Generate long-lived access token
// 5. Get business ID from: GET /me?fields=id,username
//
// ============================================================================

const INSTAGRAM_USERNAME = 'snapgo.co.in'

interface InstagramReel {
  id: string
  title: string
  mediaUrl?: string
  permalink?: string
}

function InstagramEmbed({ reelId, isActive }: { reelId: string; isActive: boolean }) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(false)

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (isActive && typeof window !== 'undefined' && (window as any).instgrm) {
        (window as any).instgrm.Embeds.process()
        setIsLoaded(true)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [isActive, reelId])

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink={`https://www.instagram.com/reel/${reelId}/?utm_source=ig_embed&utm_campaign=loading`}
        data-instgrm-version="14"
        style={{
          background: '#000',
          border: 0,
          borderRadius: '24px',
          boxShadow: '0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)',
          margin: 0,
          padding: 0,
          width: '100%',
          maxWidth: '540px',
        }}
      >
        <div className="flex items-center justify-center h-full min-h-[400px] sm:min-h-[500px]">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <Instagram className="w-12 h-12 text-white/50" />
            <p className="text-white/50 text-sm">Loading reel...</p>
          </div>
        </div>
      </blockquote>
    </div>
  )
}

export default function InstagramSection() {
  const [reels, setReels] = useState<InstagramReel[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    fetchReelsFromFirestore()
  }, [])

  // Fetch reels from our API (backed by Firestore)
  const fetchReelsFromFirestore = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/instagram')
      if (!response.ok) {
        console.error('Failed to fetch reels:', response.status)
        return
      }
      const data = await response.json()
      if (Array.isArray(data) && data.length > 0) {
        const visibleReels: InstagramReel[] = data
          .filter((reel: any) => reel.visible !== false && reel.reelId)
          .map((reel: any) => ({
            id: reel.reelId,
            title: reel.title || 'Watch on Instagram',
          }))
        setReels(visibleReels)
      }
    } catch (error) {
      console.error('Failed to fetch Instagram reels:', error)
    } finally {
      setIsLoading(false)
    }
  }

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

      <section className="section-padding bg-gray-900 overflow-hidden">
        <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <Link
              href={`https://www.instagram.com/${INSTAGRAM_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 mb-4 hover:opacity-80 transition-opacity"
            >
              <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
              <span className="text-base sm:text-lg font-medium text-white">@{INSTAGRAM_USERNAME}</span>
            </Link>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              Watch Our Reels
            </h2>
            <p className="text-white/60 max-w-xl mx-auto text-sm sm:text-base">
              See real stories of commuters saving money and sharing rides with Snapgo.
            </p>

          </div>

          {/* Reels Carousel */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-pulse flex flex-col items-center gap-4">
                <Instagram className="w-12 h-12 text-white/50" />
                <p className="text-white/50 text-sm">Loading reels...</p>
              </div>
            </div>
          ) : reels.length === 0 ? (
            <div className="text-center py-16">
              <Instagram className="w-12 h-12 mx-auto text-white/30 mb-4" />
              <p className="text-white/50">No reels to display yet.</p>
            </div>
          ) : (
          <>
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto relative px-2">
            {/* Main Reel Display */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-black min-h-[350px] sm:min-h-[400px] md:min-h-[500px]">
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
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors z-20"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors z-20"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Reel Title */}
            <div className="text-center mt-4">
              <p className="text-white font-medium text-sm sm:text-base truncate px-4">{reels[currentIndex].title}</p>
            </div>

            {/* Dot Indicators */}
            <div className="flex justify-center gap-2 mt-3 sm:mt-4">
              {reels.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-white w-5 sm:w-6'
                      : 'bg-white/40 hover:bg-white/60 w-2'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Direct Link to Instagram */}
          <div className="text-center mt-8 sm:mt-10 space-y-3 sm:space-y-4">
            <Link
              href={`https://www.instagram.com/reel/${reels[currentIndex]?.id}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-colors border border-white/20 text-sm sm:text-base"
            >
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
              Watch on Instagram
            </Link>
            <div>
              <Link
                href={`https://www.instagram.com/${INSTAGRAM_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-medium hover:opacity-90 transition-opacity text-sm sm:text-base"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                Follow @{INSTAGRAM_USERNAME}
              </Link>
            </div>
          </div>
          </>
          )}
        </div>
      </section>
    </>
  )
}
