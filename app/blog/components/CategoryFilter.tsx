'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DEFAULT_CATEGORIES } from '@/lib/types/blog'

interface CategoryFilterProps {
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
  className?: string
}

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  className = '',
}: CategoryFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  // Check scroll position
  const checkScrollPosition = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setShowLeftArrow(scrollLeft > 10)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    checkScrollPosition()
    window.addEventListener('resize', checkScrollPosition)
    return () => window.removeEventListener('resize', checkScrollPosition)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const scrollAmount = 200
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  const allCategories = [
    { id: null, name: 'All', slug: 'all', color: 'bg-primary' },
    ...DEFAULT_CATEGORIES,
  ]

  return (
    <div className={`relative ${className}`}>
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Scrollable Categories */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-1"
        onScroll={checkScrollPosition}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {allCategories.map((category) => {
          const isSelected =
            category.id === null
              ? selectedCategory === null
              : selectedCategory === category.id

          return (
            <motion.button
              key={category.slug}
              onClick={() => onCategoryChange(category.id)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all
                ${
                  isSelected
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {category.name}
            </motion.button>
          )
        })}
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default CategoryFilter
