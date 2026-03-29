'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star } from 'lucide-react'
import { TESTIMONIALS } from '@/lib/constants'
import { TestimonialData } from '@/lib/content'

type TestimonialType = TestimonialData | typeof TESTIMONIALS[0]

interface TestimonialCarouselProps {
  testimonials?: TestimonialType[]
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : TESTIMONIALS

  return (
    <section ref={containerRef} className="py-20 sm:py-24 bg-white">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            What Our Riders Say
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base sm:text-lg">
            Real savings. Real stories.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {displayTestimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="relative bg-white rounded-2xl p-7 border border-gray-100 h-full flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300">
                {/* Decorative quote */}
                <span className="absolute top-4 right-5 text-6xl leading-none text-gray-100 font-serif select-none">&ldquo;</span>

                {/* Stars */}
                <div className="flex gap-1 mb-5 relative z-10">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6 flex-1 relative z-10">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="border-t border-gray-100 pt-4 relative z-10">
                  <div className="text-[#0e4493] font-semibold text-sm">
                    {testimonial.author}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
