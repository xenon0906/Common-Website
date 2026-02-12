'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Heading {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Extract h2 and h3 headings from article
    const articleElement = document.querySelector('article')
    if (!articleElement) return

    const elements = articleElement.querySelectorAll('h2, h3')
    const headingData: Heading[] = Array.from(elements).map((elem, idx) => {
      // Ensure heading has an ID for linking
      let id = elem.id
      if (!id) {
        id = `heading-${idx}`
        elem.id = id
      }

      return {
        id,
        text: elem.textContent || '',
        level: parseInt(elem.tagName.charAt(1)),
      }
    })

    setHeadings(headingData)

    // Setup intersection observer for active heading tracking
    const observerOptions = {
      rootMargin: '-80px 0px -80% 0px',
      threshold: 0,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id)
        }
      })
    }, observerOptions)

    elements.forEach((elem) => observer.observe(elem))

    return () => observer.disconnect()
  }, [])

  // Don't render if no headings or too few headings
  if (headings.length < 2) return null

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100 // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
        Table of Contents
      </h3>

      <ul className="space-y-2">
        <AnimatePresence>
          {headings.map((heading) => (
            <motion.li
              key={heading.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
            >
              <button
                onClick={() => handleClick(heading.id)}
                className={`block py-1 text-sm transition-all text-left w-full ${
                  activeId === heading.id
                    ? 'text-primary font-semibold border-l-2 border-primary pl-3 -ml-3'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {heading.text}
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </nav>
  )
}
