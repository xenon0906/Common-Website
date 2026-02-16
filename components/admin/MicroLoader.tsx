import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MicroLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export function MicroLoader({ size = 'md', className, text }: MicroLoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-teal-500', sizeClasses[size])} />
      {text && (
        <span className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          {text}
        </span>
      )}
    </div>
  )
}

interface MicroSpinnerProps {
  size?: number
  className?: string
}

export function MicroSpinner({ size = 20, className }: MicroSpinnerProps) {
  return (
    <svg
      className={cn('animate-spin text-teal-500', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width={size}
      height={size}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

interface LoadingDotsProps {
  className?: string
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" />
    </div>
  )
}

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse bg-gray-200 dark:bg-gray-800 rounded', className)} />
  )
}
