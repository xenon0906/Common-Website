'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X, Volume2, VolumeX } from 'lucide-react'
import Image from 'next/image'

interface VideoHeroProps {
  videoId: string
  title?: string
  subtitle?: string
  posterImage?: string
}

export function VideoHero({
  videoId,
  title = "Our Story",
  subtitle = "Watch how Snapgo is revolutionizing urban transportation",
  posterImage = "/images/mockups/video-poster.jpg",
}: VideoHeroProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePlay = () => {
    setIsModalOpen(true)
    setIsPlaying(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setIsPlaying(false)
  }

  return (
    <>
      <section className="relative section-padding bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute bottom-20 left-20 w-80 h-80 bg-teal/10 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4"
            >
              <Play className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-semibold">Watch Video</span>
            </motion.span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-snapgo-gradient">{title}</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              {subtitle}
            </p>
          </motion.div>

          {/* Video Container */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div
              className="youtube-container cursor-pointer group"
              onClick={handlePlay}
            >
              {/* Poster/Thumbnail */}
              <div className="absolute inset-0 bg-gray-900">
                <Image
                  src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                  alt="Video thumbnail"
                  fill
                  className="object-cover opacity-80 group-hover:opacity-70 transition-opacity"
                />
              </div>

              {/* Play Button Overlay */}
              <div className="play-button-overlay">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="play-icon"
                >
                  <Play className="w-8 h-8 text-primary ml-1" fill="currentColor" />
                </motion.div>
              </div>

              {/* Duration Badge */}
              <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 rounded-lg text-white text-sm font-medium">
                3:24
              </div>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 mt-10"
          >
            {[
              { label: 'Featured on TV', icon: '📺' },
              { label: 'DPIIT Recognized', icon: '🏆' },
              { label: 'Startup India', icon: '🚀' },
              { label: 'Startup Uttarakhand', icon: '🌿' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90"
            onClick={handleClose}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={handleClose}
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Video Player */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20 }}
              className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title="Snapgo Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
