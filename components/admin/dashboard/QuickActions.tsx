'use client'

import { useRouter } from 'next/navigation'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '../GlassCard'
import { Button } from '@/components/ui/button'
import { Plus, Hash, Instagram, BarChart3, Upload, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { animations } from '@/lib/design-tokens'

interface Action {
  label: string
  icon: React.ElementType
  href: string
  variant?: 'default' | 'outline'
}

const actions: Action[] = [
  {
    label: 'New Blog Post',
    icon: Plus,
    href: '/admin/blogs/create',
    variant: 'default',
  },
  {
    label: 'Update Numbers',
    icon: Hash,
    href: '/admin/numbers',
    variant: 'outline',
  },
  {
    label: 'Manage Instagram',
    icon: Instagram,
    href: '/admin/instagram',
    variant: 'outline',
  },
  {
    label: 'View Analytics',
    icon: BarChart3,
    href: '/admin',
    variant: 'outline',
  },
]

export function QuickActions() {
  const router = useRouter()

  return (
    <GlassCard>
      <GlassCardHeader>
        <GlassCardTitle>Quick Actions</GlassCardTitle>
      </GlassCardHeader>
      <GlassCardContent>
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.href}
                variant={action.variant}
                className={cn(
                  'w-full justify-start gap-3 h-12',
                  animations.smooth,
                  action.variant === 'default' && 'bg-teal-600 hover:bg-teal-700 text-white'
                )}
                onClick={() => router.push(action.href)}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{action.label}</span>
              </Button>
            )
          })}
        </div>
      </GlassCardContent>
    </GlassCard>
  )
}
