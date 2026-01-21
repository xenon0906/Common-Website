'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { GLOW_COLORS, ANIMATION_CONFIG } from '@/lib/animation-config'

interface GlowHighlightProps {
  children: ReactNode
  isActive: boolean
  color?: 'teal' | 'primary' | 'purple'
  intensity?: 'low' | 'medium' | 'high'
  className?: string
  pulse?: boolean
}

export function GlowHighlight({
  children,
  isActive,
  color = 'teal',
  intensity = 'medium',
  className = '',
  pulse = true,
}: GlowHighlightProps) {
  const glowColors = GLOW_COLORS[color]

  const intensityMap = {
    low: glowColors.subtle,
    medium: glowColors.base,
    high: glowColors.bright,
  }

  const glowColor = intensityMap[intensity]

  const glowVariants = {
    inactive: {
      boxShadow: `0 0 0px transparent`,
      scale: 1,
    },
    active: {
      boxShadow: `0 0 30px ${glowColor}, 0 0 60px ${glowColors.subtle}`,
      scale: 1.02,
    },
  }

  const pulseVariants = {
    inactive: {},
    active: {
      boxShadow: [
        `0 0 20px ${glowColors.subtle}`,
        `0 0 40px ${glowColor}`,
        `0 0 20px ${glowColors.subtle}`,
      ],
    },
  }

  return (
    <motion.div
      className={`relative overflow-visible ${className}`}
      initial="inactive"
      animate={isActive ? 'active' : 'inactive'}
      variants={pulse ? pulseVariants : glowVariants}
      transition={{
        duration: ANIMATION_CONFIG.glow.duration,
        ...(pulse && isActive ? {
          repeat: Infinity,
          repeatType: 'loop' as const,
          duration: ANIMATION_CONFIG.glow.pulseInterval,
        } : {}),
      }}
    >
      {/* Glow backdrop */}
      <motion.div
        className="absolute inset-0 rounded-inherit -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `radial-gradient(circle at center, ${glowColors.subtle} 0%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
      />
      {children}
    </motion.div>
  )
}
