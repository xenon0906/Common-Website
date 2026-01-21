'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Play, ExternalLink } from 'lucide-react'
import Image from 'next/image'

interface VideoSectionProps {
  videoId: string
  title?: string
  description?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function VideoSection({
  videoId,
  title,
  description,
  className = '',
  size = 'md',
}: VideoSectionProps) {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
  }

  const handlePlay = () => {
    setIsPlaying(true)
  }

  return (
    <div ref={containerRef} className={`${sizeClasses[size]} mx-auto ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        {/* Video Container */}
        <div className="youtube-container group">
          {!isPlaying ? (
            <>
              {/* Thumbnail */}
              <div className="absolute inset-0 bg-gray-900">
                <Image
                  src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                  alt={title || 'Video thumbnail'}
                  fill
                  className="object-cover opacity-90 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                  onLoad={() => setIsLoaded(true)}
                />
                {!isLoaded && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
              </div>

              {/* Play Button */}
              <button
                onClick={handlePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center shadow-2xl"
                >
                  <Play className="w-8 h-8 text-primary ml-1" fill="currentColor" />
                </motion.div>
              </button>

              {/* Video Info Overlay */}
              {title && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <h3 className="text-white font-semibold text-lg">{title}</h3>
                  {description && (
                    <p className="text-white/80 text-sm mt-1">{description}</p>
                  )}
                </div>
              )}
            </>
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={title || 'Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          )}
        </div>

        {/* Caption */}
        {(title || description) && !isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-4 text-center"
          >
            {title && <h4 className="font-medium text-gray-900">{title}</h4>}
            {description && <p className="text-gray-600 text-sm mt-1">{description}</p>}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

// Inline video embed without click-to-play (auto-embeds)
export function VideoEmbed({
  videoId,
  title,
  className = '',
}: {
  videoId: string
  title?: string
  className?: string
}) {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <div className="youtube-container">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0`}
          title={title || 'Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </motion.div>
  )
}
