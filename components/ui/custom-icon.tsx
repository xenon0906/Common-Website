'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface CustomIconProps {
  name: string
  className?: string
  size?: number
  alt?: string
}

// Icon name mapping for easy usage
export const IconNames = {
  wallet: 'wallet',
  shieldVerified: 'shield-verified',
  usersGroup: 'users-group',
  clockFast: 'clock-fast',
  leafEco: 'leaf-eco',
  locationPin: 'location-pin',
  carSide: 'car-side',
  sosEmergency: 'sos-emergency',
  chatMessage: 'chat-message',
  routePath: 'route-path',
  rupeeCoin: 'rupee-coin',
  phoneCall: 'phone-call',
  mailSend: 'mail-send',
} as const

export type IconName = keyof typeof IconNames

export function CustomIcon({ name, className, size = 24, alt }: CustomIconProps) {
  return (
    <Image
      src={`/icons/${name}.svg`}
      alt={alt || name.replace(/-/g, ' ')}
      width={size}
      height={size}
      className={cn('inline-block', className)}
    />
  )
}

// Wrapper component for animated icons
export function AnimatedCustomIcon({
  name,
  className,
  size = 24,
  alt,
}: CustomIconProps) {
  return (
    <div className={cn('transition-transform duration-200 hover:scale-110', className)}>
      <CustomIcon name={name} size={size} alt={alt} />
    </div>
  )
}
