'use client'

import { cn } from '@/lib/utils'

interface IconProps {
  className?: string
  size?: number
}

// Base SVG wrapper component
const SvgIcon = ({
  children,
  className,
  size = 24,
  viewBox = "0 0 24 24"
}: IconProps & { children: React.ReactNode; viewBox?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={viewBox}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={cn('inline-block', className)}
  >
    {children}
  </svg>
)

// Professional Icon Components
export function WalletIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>
      <path d="M3 7h18a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3"/>
      <circle cx="17" cy="12" r="1.5" fill="currentColor" stroke="none"/>
    </SvgIcon>
  )
}

export function ShieldCheckIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M12 2l8 4v6c0 5.5-3.8 10.3-8 11.5-4.2-1.2-8-6-8-11.5V6l8-4z"/>
      <path d="M9 12l2 2 4-4"/>
    </SvgIcon>
  )
}

export function UsersIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <circle cx="9" cy="7" r="3"/>
      <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
      <circle cx="17" cy="7" r="2.5"/>
      <path d="M21 21v-1.5a3 3 0 0 0-2.5-2.96"/>
    </SvgIcon>
  )
}

export function ClockIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 6v6l4 2"/>
    </SvgIcon>
  )
}

export function LeafIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M6 21c3-3 7-5 12-5 0-5-2-9-5-12-6 6-9 11-7 17z"/>
      <path d="M6 21c2-2 4-4 5-8"/>
    </SvgIcon>
  )
}

export function MapPinIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </SvgIcon>
  )
}

export function SearchIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <circle cx="11" cy="11" r="7"/>
      <path d="M21 21l-4.35-4.35"/>
    </SvgIcon>
  )
}

export function StarIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </SvgIcon>
  )
}

export function CheckCircleIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <circle cx="12" cy="12" r="9"/>
      <path d="M9 12l2 2 4-4"/>
    </SvgIcon>
  )
}

export function HeartIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </SvgIcon>
  )
}

export function ZapIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </SvgIcon>
  )
}

export function AlertIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/>
    </SvgIcon>
  )
}

export function MessageIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      <path d="M8 10h8"/>
      <path d="M8 14h4"/>
    </SvgIcon>
  )
}

export function NavigationIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <polygon points="3 11 22 2 13 21 11 13 3 11"/>
    </SvgIcon>
  )
}

export function HistoryIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
      <path d="M12 7v5l4 2"/>
    </SvgIcon>
  )
}

export function TargetIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </SvgIcon>
  )
}

export function EyeIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </SvgIcon>
  )
}

export function EditIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </SvgIcon>
  )
}

export function LockIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none"/>
    </SvgIcon>
  )
}

export function ShieldIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M12 2l8 4v6c0 5.5-3.8 10.3-8 11.5-4.2-1.2-8-6-8-11.5V6l8-4z"/>
    </SvgIcon>
  )
}

export function UserCheckIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="8.5" cy="7" r="4"/>
      <path d="M17 11l2 2 4-4"/>
    </SvgIcon>
  )
}

export function ArrowRightIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M5 12h14"/>
      <path d="M12 5l7 7-7 7"/>
    </SvgIcon>
  )
}

export function SparklesIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/>
      <path d="M5 19l.5 1.5L7 21l-1.5.5L5 23l-.5-1.5L3 21l1.5-.5L5 19z"/>
      <path d="M19 5l.5 1.5L21 7l-1.5.5L19 9l-.5-1.5L17 7l1.5-.5L19 5z"/>
    </SvgIcon>
  )
}

export function DownloadIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </SvgIcon>
  )
}

export function SmartphoneIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
      <line x1="12" y1="18" x2="12.01" y2="18"/>
    </SvgIcon>
  )
}

export function CarIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10H8s-2.7.6-4.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"/>
      <circle cx="7" cy="17" r="2"/>
      <circle cx="17" cy="17" r="2"/>
      <path d="M5 10l2-5h10l2 5"/>
      <path d="M9 17h6"/>
    </SvgIcon>
  )
}

export function CalendarIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </SvgIcon>
  )
}

export function PiggyBankIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8.4 3 1 4l-2 3h4c1.6.8 4 1 6 1s4.4-.2 6-1h4l-2-3c.6-1 1-2.2 1-4 0-2-1-3-3-3"/>
      <path d="M2 9a2 2 0 0 1 2-2"/>
      <circle cx="15" cy="11" r="1" fill="currentColor" stroke="none"/>
    </SvgIcon>
  )
}

export function BadgeCheckIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M12 2l2.4 2.4L18 4l.4 3.6L21 10l-2.4 2.4L19 16l-3.6.4L13 19l-2.4-2.4L7 17l-.4-3.6L4 11l2.4-2.4L6 5l3.6-.4L12 2z"/>
      <path d="M9 12l2 2 4-4"/>
    </SvgIcon>
  )
}

export function CoinIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <circle cx="12" cy="12" r="8"/>
      <path d="M12 6v2"/>
      <path d="M12 16v2"/>
      <path d="M9.5 9.5c.5-1 1.5-1.5 2.5-1.5 1.5 0 2.5 1 2.5 2.5s-1 2-2.5 2.5c-1 .3-2.5.5-2.5 2s1 2 2.5 2c1 0 2-.5 2.5-1.5"/>
    </SvgIcon>
  )
}

export function VerifiedIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <circle cx="12" cy="12" r="10"/>
      <path d="M9 12l2 2 4-4"/>
      <path d="M12 2a10 10 0 0 1 0 20"/>
    </SvgIcon>
  )
}

export function ShuffleIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M16 3h5v5"/>
      <path d="M4 20L21 3"/>
      <path d="M21 16v5h-5"/>
      <path d="M15 15l6 6"/>
      <path d="M4 4l5 5"/>
    </SvgIcon>
  )
}

// Icon component map for dynamic rendering
export const IconMap: Record<string, React.FC<IconProps>> = {
  Wallet: WalletIcon,
  ShieldCheck: ShieldCheckIcon,
  Users: UsersIcon,
  Clock: ClockIcon,
  Leaf: LeafIcon,
  MapPin: MapPinIcon,
  Search: SearchIcon,
  Star: StarIcon,
  CheckCircle: CheckCircleIcon,
  Heart: HeartIcon,
  Zap: ZapIcon,
  Alert: AlertIcon,
  AlertTriangle: AlertIcon,
  Message: MessageIcon,
  MessageSquare: MessageIcon,
  Navigation: NavigationIcon,
  History: HistoryIcon,
  Target: TargetIcon,
  Eye: EyeIcon,
  Edit: EditIcon,
  Lock: LockIcon,
  Shield: ShieldIcon,
  UserCheck: UserCheckIcon,
  ArrowRight: ArrowRightIcon,
  Sparkles: SparklesIcon,
  Download: DownloadIcon,
  Smartphone: SmartphoneIcon,
  Car: CarIcon,
  Calendar: CalendarIcon,
  Shuffle: ShuffleIcon,
}

// Dynamic Icon component
export function Icon({ name, className, size = 24 }: { name: string; className?: string; size?: number }) {
  const IconComponent = IconMap[name]
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`)
    return null
  }
  return <IconComponent className={className} size={size} />
}
