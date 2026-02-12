'use client'

import { useEffect, useState } from 'react'

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(Math.min(100, Math.max(0, scrollPercent)))
    }

    // Update on mount
    updateProgress()

    // Update on scroll
    window.addEventListener('scroll', updateProgress, { passive: true })

    // Update on resize (content height might change)
    window.addEventListener('resize', updateProgress, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-800 z-50">
      <div
        className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
        aria-label={`Reading progress: ${Math.round(progress)}%`}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  )
}
