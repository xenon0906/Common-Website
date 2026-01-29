'use client'

import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  color?: 'primary' | 'teal' | 'white' | 'muted'
}

const sizeClasses = {
  xs: 'w-3 h-3 border',
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-2',
  xl: 'w-12 h-12 border-3',
}

const colorClasses = {
  primary: 'border-primary border-t-transparent',
  teal: 'border-teal border-t-transparent',
  white: 'border-white border-t-transparent',
  muted: 'border-muted-foreground border-t-transparent',
}

export function Spinner({ size = 'md', className, color = 'primary' }: SpinnerProps) {
  return (
    <div
      className={cn(
        'rounded-full animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

interface LoadingOverlayProps {
  loading: boolean
  children: React.ReactNode
  className?: string
  spinnerSize?: SpinnerProps['size']
  text?: string
}

export function LoadingOverlay({
  loading,
  children,
  className,
  spinnerSize = 'lg',
  text,
}: LoadingOverlayProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {loading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 rounded-lg">
          <Spinner size={spinnerSize} />
          {text && (
            <p className="mt-3 text-sm text-muted-foreground">{text}</p>
          )}
        </div>
      )}
    </div>
  )
}

interface LoadingStateProps {
  loading: boolean
  children: React.ReactNode
  fallback?: React.ReactNode
  minHeight?: string
}

export function LoadingState({
  loading,
  children,
  fallback,
  minHeight = '200px',
}: LoadingStateProps) {
  if (loading) {
    return (
      fallback || (
        <div
          className="flex flex-col items-center justify-center"
          style={{ minHeight }}
        >
          <Spinner size="lg" />
          <p className="mt-3 text-sm text-muted-foreground">Loading...</p>
        </div>
      )
    )
  }

  return <>{children}</>
}

interface ButtonSpinnerProps {
  loading: boolean
  children: React.ReactNode
  loadingText?: string
}

export function ButtonSpinner({ loading, children, loadingText }: ButtonSpinnerProps) {
  if (loading) {
    return (
      <>
        <Spinner size="sm" color="white" className="mr-2" />
        {loadingText || 'Loading...'}
      </>
    )
  }
  return <>{children}</>
}
