'use client'

import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SEOScoreCardProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function SEOScoreCard({ score, size = 'md', showLabel = true }: SEOScoreCardProps) {
  const getScoreColor = () => {
    if (score >= 90) return { text: 'text-green-600', bg: 'bg-green-100', ring: 'ring-green-500' }
    if (score >= 70) return { text: 'text-yellow-600', bg: 'bg-yellow-100', ring: 'ring-yellow-500' }
    if (score >= 50) return { text: 'text-orange-600', bg: 'bg-orange-100', ring: 'ring-orange-500' }
    return { text: 'text-red-600', bg: 'bg-red-100', ring: 'ring-red-500' }
  }

  const getScoreLabel = () => {
    if (score >= 90) return 'Excellent'
    if (score >= 70) return 'Good'
    if (score >= 50) return 'Needs Work'
    return 'Poor'
  }

  const getIcon = () => {
    if (score >= 90) return CheckCircle
    if (score >= 70) return Info
    if (score >= 50) return AlertTriangle
    return AlertCircle
  }

  const colors = getScoreColor()
  const Icon = getIcon()

  const sizeClasses = {
    sm: 'w-16 h-16 text-lg',
    md: 'w-24 h-24 text-2xl',
    lg: 'w-32 h-32 text-4xl',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn(
          'relative rounded-full flex items-center justify-center font-bold ring-4',
          sizeClasses[size],
          colors.bg,
          colors.text,
          colors.ring
        )}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {score}
        </motion.span>
        <div className={cn('absolute -top-1 -right-1 rounded-full p-1', colors.bg)}>
          <Icon className={cn(iconSizes[size], colors.text)} />
        </div>
      </motion.div>
      {showLabel && (
        <span className={cn('text-sm font-medium', colors.text)}>{getScoreLabel()}</span>
      )}
    </div>
  )
}

export function SEOScoreIndicator({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 90) return 'text-green-500 bg-green-100'
    if (score >= 70) return 'text-yellow-500 bg-yellow-100'
    if (score >= 50) return 'text-orange-500 bg-orange-100'
    return 'text-red-500 bg-red-100'
  }

  return (
    <div className={cn('inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold text-sm', getColor())}>
      {score >= 90 ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {score}/100
    </div>
  )
}
