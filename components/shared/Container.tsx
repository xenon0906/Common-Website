'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const containerSizes = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-none',
}

export function Container({ children, className, size = 'xl' }: ContainerProps) {
  return (
    <div
      className={cn(
        'container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24',
        containerSizes[size],
        className
      )}
    >
      {children}
    </div>
  )
}
