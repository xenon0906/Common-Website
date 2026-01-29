'use client'

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import { CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant ?? undefined} {...props}>
            <div className="flex gap-3 items-start">
              <ToastIcon variant={variant} />
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

function ToastIcon({ variant }: { variant?: 'default' | 'destructive' | null }) {
  if (variant === 'destructive') {
    return <AlertCircle className="h-5 w-5 text-destructive-foreground" />
  }
  return <CheckCircle className="h-5 w-5 text-green-500" />
}

// Helper functions for common toast patterns
export const showToast = {
  success: (title: string, description?: string) => {
    const { toast } = require('@/components/ui/use-toast')
    return toast({
      title,
      description,
    })
  },
  error: (title: string, description?: string) => {
    const { toast } = require('@/components/ui/use-toast')
    return toast({
      title,
      description,
      variant: 'destructive',
    })
  },
  warning: (title: string, description?: string) => {
    const { toast } = require('@/components/ui/use-toast')
    return toast({
      title,
      description,
    })
  },
  info: (title: string, description?: string) => {
    const { toast } = require('@/components/ui/use-toast')
    return toast({
      title,
      description,
    })
  },
}
