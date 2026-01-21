'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ChevronDown, Search, HelpCircle, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface FAQItem {
  question: string
  answer: string
  category: string
}

interface FAQAccordionProps {
  items: FAQItem[]
  categories: string[]
}

// Highlight matching text in search results
function HighlightText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight.trim()) {
    return <>{text}</>
  }

  const regex = new RegExp(`(${highlight})`, 'gi')
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="bg-primary/20 text-primary rounded px-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  )
}

// Individual FAQ item with premium animations
function FAQItemComponent({
  item,
  index,
  isOpen,
  onToggle,
  searchQuery,
}: {
  item: FAQItem
  index: number
  isOpen: boolean
  onToggle: () => void
  searchQuery: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        type: 'spring',
        stiffness: 100,
        damping: 15,
      }}
    >
      <div
        className={cn(
          'overflow-hidden rounded-2xl transition-all duration-300 border-2',
          'bg-white cursor-pointer',
          isOpen
            ? 'border-primary/50 shadow-xl shadow-primary/10'
            : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
        )}
        onClick={onToggle}
      >
        {/* Question Header */}
        <div className="flex items-start justify-between p-4 sm:p-6 gap-3 sm:gap-4">
          {/* Number badge */}
          <motion.div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm transition-all duration-300',
              isOpen ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
            )}
            animate={isOpen ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {index + 1}
          </motion.div>

          {/* Question content */}
          <div className="flex-1">
            <h3
              className={cn(
                'font-semibold text-left text-base sm:text-lg transition-colors duration-200',
                isOpen && 'text-primary'
              )}
            >
              <HighlightText text={item.question} highlight={searchQuery} />
            </h3>
            <motion.span
              initial={false}
              animate={{ opacity: isOpen ? 0 : 1, height: isOpen ? 0 : 'auto' }}
              className="inline-block mt-2"
            >
              <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-500 font-medium">
                {item.category}
              </span>
            </motion.span>
          </div>

          {/* Arrow icon */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{
              duration: 0.3,
              type: 'spring',
              stiffness: 200,
              damping: 20,
            }}
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200',
              isOpen ? 'bg-primary/10' : 'bg-gray-50'
            )}
          >
            <ChevronDown
              className={cn(
                'w-5 h-5 transition-colors duration-200',
                isOpen ? 'text-primary' : 'text-gray-400'
              )}
            />
          </motion.div>
        </div>

        {/* Answer Content with spring animation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: 'auto',
                opacity: 1,
                transition: {
                  height: {
                    duration: 0.4,
                    type: 'spring',
                    stiffness: 100,
                    damping: 20,
                  },
                  opacity: { duration: 0.25, delay: 0.15 },
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  height: { duration: 0.3 },
                  opacity: { duration: 0.2 },
                },
              }}
            >
              <div className="px-6 pb-6">
                <div className="pt-4 border-t border-gray-100 ml-14">
                  <p className="text-gray-600 leading-relaxed">
                    <HighlightText text={item.answer} highlight={searchQuery} />
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export function FAQAccordion({ items, categories }: FAQAccordionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [openItem, setOpenItem] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const matchesSearch =
      searchQuery === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index)
  }

  // Reset open item when filter changes
  useEffect(() => {
    setOpenItem(null)
  }, [activeCategory, searchQuery])

  return (
    <div className="space-y-10">
      {/* Search Bar - Premium styling */}
      <motion.div
        className="relative max-w-lg mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className={cn(
            'relative transition-all duration-300',
            isSearchFocused && 'transform scale-[1.02]'
          )}
        >
          <Search
            className={cn(
              'absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200',
              isSearchFocused ? 'text-primary' : 'text-gray-400'
            )}
          />
          <Input
            type="text"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={cn(
              'pl-14 pr-6 h-14 rounded-2xl border-2 text-base transition-all duration-300',
              'bg-white shadow-lg focus:shadow-xl',
              isSearchFocused
                ? 'border-primary ring-4 ring-primary/10'
                : 'border-gray-100 hover:border-gray-200'
            )}
          />
          {searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-sm"
            >
              &times;
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Category Tabs - Animated underline style */}
      <div className="flex flex-wrap justify-center gap-2">
        <motion.button
          onClick={() => setActiveCategory('all')}
          className={cn(
            'relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300',
            activeCategory === 'all'
              ? 'bg-primary text-white shadow-lg shadow-primary/30'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Sparkles className="w-4 h-4 inline-block mr-1.5" />
          All Questions
        </motion.button>
        {categories.map((category) => (
          <motion.button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              'relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300',
              activeCategory === category
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {category}
          </motion.button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="space-y-4 max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4"
              >
                <HelpCircle className="w-10 h-10 text-gray-400" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500">
                Try adjusting your search or browse all categories.
              </p>
            </motion.div>
          ) : (
            filteredItems.map((item, index) => (
              <FAQItemComponent
                key={`${item.category}-${index}`}
                item={item}
                index={index}
                isOpen={openItem === index}
                onToggle={() => toggleItem(index)}
                searchQuery={searchQuery}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Results Count with animation */}
      <AnimatePresence>
        {searchQuery && filteredItems.length > 0 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center text-sm text-gray-500"
          >
            Found{' '}
            <span className="font-semibold text-primary">{filteredItems.length}</span>{' '}
            {filteredItems.length === 1 ? 'result' : 'results'} for "{searchQuery}"
          </motion.p>
        )}
      </AnimatePresence>

      {/* Keyboard navigation hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-xs text-gray-400"
      >
        Press Tab to navigate, Enter to expand
      </motion.p>
    </div>
  )
}
