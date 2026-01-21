'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence, PanInfo } from 'framer-motion'
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { TESTIMONIALS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { TestimonialData } from '@/lib/content'

// Testimonial type for compatibility
type TestimonialType = TestimonialData | typeof TESTIMONIALS[0]

interface TestimonialCarouselProps {
  testimonials?: TestimonialType[]
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  // Use provided testimonials or fall back to constants
  const displayTestimonials = testimonials || TESTIMONIALS

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9,
    }),
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prev) => {
      let next = prev + newDirection
      if (next < 0) next = displayTestimonials.length - 1
      if (next >= displayTestimonials.length) next = 0
      return next
    })
  }

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x)
    if (swipe < -swipeConfidenceThreshold) {
      paginate(1)
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1)
    }
  }

  return (
    <section ref={containerRef} className="py-20 bg-dark overflow-hidden">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Our Users Say
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto">
            Real stories from real users who are saving money and making connections with snapgo.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Navigation buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/10 hidden md:flex"
            onClick={() => paginate(-1)}
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/10 hidden md:flex"
            onClick={() => paginate(1)}
          >
            <ChevronRight className="w-8 h-8" />
          </Button>

          {/* Carousel */}
          <div className="overflow-hidden px-4 md:px-16">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={handleDragEnd}
                className="cursor-grab active:cursor-grabbing"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 border border-white/20">
                  {/* Quote icon */}
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 mx-auto">
                    <Quote className="w-8 h-8 text-primary" />
                  </div>

                  {/* Stars */}
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                    ))}
                  </div>

                  {/* Quote text */}
                  <blockquote className="text-base sm:text-lg md:text-xl lg:text-2xl text-white text-center mb-6 sm:mb-8 leading-relaxed">
                    "{displayTestimonials[currentIndex].quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="text-center">
                    <div className="text-primary font-semibold">
                      {displayTestimonials[currentIndex].author}
                    </div>
                    <div className="text-white/80 text-sm">
                      {displayTestimonials[currentIndex].location}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center gap-2 mt-8">
            {displayTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1)
                  setCurrentIndex(index)
                }}
                className={cn(
                  'w-3 h-3 rounded-full transition-all duration-300',
                  index === currentIndex
                    ? 'bg-primary w-8'
                    : 'bg-white/30 hover:bg-white/50'
                )}
              />
            ))}
          </div>

          {/* Swipe hint - mobile */}
          <p className="text-center text-white/70 text-sm mt-4 md:hidden">
            Swipe to see more testimonials
          </p>
        </div>
      </div>
    </section>
  )
}
