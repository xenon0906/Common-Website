'use client'

import { useEffect, useState, useRef, ReactNode, ComponentType } from 'react'
import { motion } from 'framer-motion'

interface LazySectionProps {
  children: ReactNode
  fallback?: ReactNode
  rootMargin?: string
  threshold?: number
}

/**
 * Lazy load a section only when it's about to enter the viewport
 * Uses Intersection Observer for efficient detection
 */
export function LazySection({
  children,
  fallback,
  rootMargin = '200px',
  threshold = 0,
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [rootMargin, threshold])

  return (
    <div ref={ref}>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      ) : (
        fallback || <SectionSkeleton />
      )}
    </div>
  )
}

/**
 * Default skeleton for lazy-loaded sections
 */
function SectionSkeleton() {
  return (
    <div className="min-h-[400px] bg-gradient-to-b from-muted/30 to-muted/10 animate-pulse flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-muted/50" />
        <div className="w-48 h-4 rounded bg-muted/50" />
        <div className="w-32 h-4 rounded bg-muted/50" />
      </div>
    </div>
  )
}

/**
 * HOC for lazy loading component imports
 * Use with next/dynamic for best results
 */
export function withLazyLoad<T extends object>(
  Component: ComponentType<T>,
  options?: { fallback?: ReactNode; rootMargin?: string }
) {
  return function LazyLoadedComponent(props: T) {
    return (
      <LazySection fallback={options?.fallback} rootMargin={options?.rootMargin}>
        <Component {...props} />
      </LazySection>
    )
  }
}
