'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { GlowHighlight } from './GlowHighlight'
import { StepCounter } from './CounterAnimation'
import { ANIMATION_CONFIG } from '@/lib/animation-config'

interface AnimatedStepProps {
  stepNumber: number
  title: string
  description: string
  icon: LucideIcon
  isActive?: boolean
  variant?: 'card' | 'inline' | 'compact'
  alignment?: 'left' | 'right' | 'center'
  color?: 'teal' | 'primary' | 'purple'
  className?: string
  delay?: number
}

export function AnimatedStep({
  stepNumber,
  title,
  description,
  icon: Icon,
  isActive = false,
  variant = 'card',
  alignment = 'center',
  color = 'teal',
  className = '',
  delay = 0,
}: AnimatedStepProps) {
  const alignmentClasses = {
    left: 'text-left items-start',
    right: 'text-right items-end',
    center: 'text-center items-center',
  }

  const colorClasses = {
    teal: {
      icon: 'bg-teal/20 text-teal group-hover:bg-teal group-hover:text-white',
      iconActive: 'bg-teal text-white',
      border: 'border-teal/50',
    },
    primary: {
      icon: 'bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white',
      iconActive: 'bg-primary text-white',
      border: 'border-primary/50',
    },
    purple: {
      icon: 'bg-purple/20 text-purple group-hover:bg-purple group-hover:text-white',
      iconActive: 'bg-purple text-white',
      border: 'border-purple/50',
    },
  }

  if (variant === 'inline') {
    return (
      <motion.div
        className={`flex items-center gap-4 ${alignment === 'right' ? 'flex-row-reverse' : ''} ${className}`}
        initial={{ opacity: 0, x: alignment === 'right' ? 30 : -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ x: alignment === 'right' ? -5 : 5 }}
      >
        <GlowHighlight isActive={isActive} color={color} pulse={false}>
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
            ${isActive ? colorClasses[color].iconActive : colorClasses[color].icon}
          `}>
            <Icon className="w-6 h-6" />
          </div>
        </GlowHighlight>
        <div className={`flex-1 ${alignmentClasses[alignment]}`}>
          <div className="flex items-center gap-2 mb-1">
            <StepCounter step={stepNumber} isActive={isActive} size="sm" color={color} />
            <h4 className="font-semibold">{title}</h4>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </motion.div>
    )
  }

  if (variant === 'compact') {
    return (
      <motion.div
        className={`flex flex-col ${alignmentClasses[alignment]} gap-2 p-4 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
      >
        <div className="flex items-center gap-2">
          <StepCounter step={stepNumber} isActive={isActive} size="sm" color={color} />
          <GlowHighlight isActive={isActive} color={color} pulse={false}>
            <div className={`
              w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300
              ${isActive ? colorClasses[color].iconActive : colorClasses[color].icon}
            `}>
              <Icon className="w-4 h-4" />
            </div>
          </GlowHighlight>
        </div>
        <h4 className="font-medium text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </motion.div>
    )
  }

  // Default card variant
  return (
    <motion.div
      className={`group ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: ANIMATION_CONFIG.entrance.duration, delay }}
      whileHover={{ y: -5 }}
    >
      <GlowHighlight isActive={isActive} color={color} className="h-full">
        <Card className={`
          h-full transition-all duration-500
          ${isActive ? `border-2 ${colorClasses[color].border}` : 'border border-border/50'}
          hover:shadow-xl
        `}>
          <CardContent className={`p-6 flex flex-col ${alignmentClasses[alignment]}`}>
            {/* Step number badge */}
            <div className="mb-4">
              <StepCounter step={stepNumber} isActive={isActive} size="md" color={color} />
            </div>

            {/* Icon */}
            <motion.div
              className={`
                w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300
                ${isActive ? colorClasses[color].iconActive : colorClasses[color].icon}
              `}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Icon className="w-7 h-7" />
            </motion.div>

            {/* Content */}
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
          </CardContent>
        </Card>
      </GlowHighlight>
    </motion.div>
  )
}
