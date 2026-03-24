'use client'

import {
  ShieldIcon,
  StarIcon,
  ShieldCheckIcon,
  UsersIcon,
  AlertIcon,
  ClockIcon,
  LeafIcon,
  CheckCircleIcon,
} from '@/components/ui/icon'

export function TrustBadgesSection() {
  const badges = [
    { icon: ShieldIcon, label: 'DPIIT Certified' },
    { icon: StarIcon, label: 'Startup India' },
    { icon: StarIcon, label: 'Startup Uttarakhand', isGreen: true },
    { icon: ShieldCheckIcon, label: 'Aadhaar KYC Verified' },
    { icon: UsersIcon, label: 'Women-Only Matching' },
    { icon: AlertIcon, label: 'SOS Emergency Button' },
    { icon: CheckCircleIcon, label: '100% Legal' },
    { icon: ClockIcon, label: 'Driver Confirmed 24hr Before' },
    { icon: LeafIcon, label: 'Eco-Friendly', isGreen: true },
  ]

  return (
    <section className="py-8 bg-muted/30 overflow-hidden border-y border-border/50">
      <div className="flex animate-marquee">
        {[...badges, ...badges].map((badge, index) => (
          <div
            key={`${badge.label}-${index}`}
            className="flex items-center gap-2 px-6 sm:px-8 py-2 whitespace-nowrap"
          >
            <badge.icon className={`w-5 h-5 ${badge.isGreen ? 'text-emerald-500' : 'text-teal'}`} />
            <span className={`text-sm font-medium ${badge.isGreen ? 'text-emerald-600' : 'text-muted-foreground'}`}>{badge.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
