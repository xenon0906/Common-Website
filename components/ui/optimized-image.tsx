'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  className?: string
  containerClassName?: string
  sizes?: string
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  loading?: 'lazy' | 'eager'
  onLoad?: () => void
  onError?: () => void
}

// Generate a simple blur placeholder
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f0f0f0" offset="20%" />
      <stop stop-color="#e0e0e0" offset="50%" />
      <stop stop-color="#f0f0f0" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f0f0f0" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className,
  containerClassName,
  sizes,
  quality = 85,
  placeholder,
  blurDataURL,
  objectFit = 'cover',
  loading,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Generate blur placeholder if not provided
  const blurPlaceholder = blurDataURL || `data:image/svg+xml;base64,${toBase64(shimmer(width || 700, height || 475))}`

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  // Default sizes for responsive images
  const defaultSizes = fill
    ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
    : undefined

  if (hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted text-muted-foreground',
          fill ? 'absolute inset-0' : '',
          containerClassName
        )}
        style={!fill ? { width, height } : undefined}
      >
        <span className="text-sm">Failed to load image</span>
      </div>
    )
  }

  const imageStyles = {
    objectFit,
  } as const

  return (
    <div className={cn('relative', containerClassName)} style={!fill ? { width, height } : undefined}>
      {isLoading && (
        <Skeleton
          className={cn(
            'absolute inset-0',
            fill ? 'w-full h-full' : ''
          )}
          style={!fill ? { width, height } : undefined}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        sizes={sizes || defaultSizes}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={placeholder === 'blur' ? blurPlaceholder : undefined}
        loading={priority ? 'eager' : loading || 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        style={imageStyles}
      />
    </div>
  )
}

// Preset variants for common image uses
export function HeroImage(props: Omit<OptimizedImageProps, 'priority' | 'quality' | 'sizes'>) {
  return (
    <OptimizedImage
      {...props}
      priority
      quality={90}
      sizes="100vw"
    />
  )
}

export function ThumbnailImage(props: Omit<OptimizedImageProps, 'quality' | 'sizes'>) {
  return (
    <OptimizedImage
      {...props}
      quality={75}
      sizes="(max-width: 640px) 50vw, 200px"
    />
  )
}

export function AvatarImage(props: Omit<OptimizedImageProps, 'quality' | 'sizes' | 'objectFit'>) {
  return (
    <OptimizedImage
      {...props}
      quality={80}
      objectFit="cover"
      sizes="48px"
      className={cn('rounded-full', props.className)}
    />
  )
}

export function CardImage(props: Omit<OptimizedImageProps, 'quality' | 'sizes'>) {
  return (
    <OptimizedImage
      {...props}
      quality={80}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
    />
  )
}
