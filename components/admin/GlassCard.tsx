import { cn } from '@/lib/utils'
import { glassCard, animations } from '@/lib/design-tokens'
import { HTMLAttributes, ReactNode } from 'react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
  padding?: boolean
  className?: string
}

export function GlassCard({
  children,
  hover = true,
  padding = true,
  className,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        glassCard(hover),
        padding && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface GlassCardHeaderProps {
  children: ReactNode
  className?: string
}

export function GlassCardHeader({ children, className }: GlassCardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-6', className)}>
      {children}
    </div>
  )
}

interface GlassCardTitleProps {
  children: ReactNode
  className?: string
}

export function GlassCardTitle({ children, className }: GlassCardTitleProps) {
  return (
    <h3 className={cn('text-xl font-semibold text-gray-900', className)}>
      {children}
    </h3>
  )
}

interface GlassCardDescriptionProps {
  children: ReactNode
  className?: string
}

export function GlassCardDescription({ children, className }: GlassCardDescriptionProps) {
  return (
    <p className={cn('text-sm text-gray-600 mt-1', className)}>
      {children}
    </p>
  )
}

interface GlassCardContentProps {
  children: ReactNode
  className?: string
}

export function GlassCardContent({ children, className }: GlassCardContentProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {children}
    </div>
  )
}

interface GlassCardFooterProps {
  children: ReactNode
  className?: string
}

export function GlassCardFooter({ children, className }: GlassCardFooterProps) {
  return (
    <div className={cn('flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200/50', className)}>
      {children}
    </div>
  )
}
