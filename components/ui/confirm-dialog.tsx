'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Trash2, Info, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ConfirmDialogVariant = 'default' | 'destructive' | 'warning' | 'success'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  variant?: ConfirmDialogVariant
  loading?: boolean
}

const variantConfig = {
  default: {
    icon: Info,
    iconColor: 'text-primary',
    iconBg: 'bg-primary/10',
    buttonVariant: 'default' as const,
  },
  destructive: {
    icon: Trash2,
    iconColor: 'text-destructive',
    iconBg: 'bg-destructive/10',
    buttonVariant: 'destructive' as const,
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
    iconBg: 'bg-yellow-100',
    buttonVariant: 'default' as const,
  },
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-100',
    buttonVariant: 'default' as const,
  },
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  loading = false,
}: ConfirmDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const config = variantConfig[variant]
  const Icon = config.icon

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } catch (error) {
      console.error('Error in confirm action:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  const actualLoading = loading || isLoading

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className={cn('p-2 rounded-full', config.iconBg)}>
              <Icon className={cn('w-5 h-5', config.iconColor)} />
            </div>
            <div className="flex-1">
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <DialogDescription className="mt-2">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={actualLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={handleConfirm}
            disabled={actualLoading}
          >
            {actualLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Hook for easy usage
interface UseConfirmDialogOptions {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: ConfirmDialogVariant
}

export function useConfirmDialog() {
  const [state, setState] = React.useState<{
    open: boolean
    options: UseConfirmDialogOptions
    resolve: ((confirmed: boolean) => void) | null
  }>({
    open: false,
    options: { title: '' },
    resolve: null,
  })

  const confirm = React.useCallback((options: UseConfirmDialogOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        open: true,
        options,
        resolve,
      })
    })
  }, [])

  const handleConfirm = React.useCallback(() => {
    state.resolve?.(true)
    setState((prev) => ({ ...prev, open: false, resolve: null }))
  }, [state.resolve])

  const handleCancel = React.useCallback(() => {
    state.resolve?.(false)
    setState((prev) => ({ ...prev, open: false, resolve: null }))
  }, [state.resolve])

  const ConfirmDialogComponent = React.useMemo(() => {
    return (
      <ConfirmDialog
        open={state.open}
        onOpenChange={(open) => {
          if (!open) handleCancel()
        }}
        title={state.options.title}
        description={state.options.description}
        confirmText={state.options.confirmText}
        cancelText={state.options.cancelText}
        variant={state.options.variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    )
  }, [state.open, state.options, handleConfirm, handleCancel])

  return {
    confirm,
    ConfirmDialog: ConfirmDialogComponent,
  }
}
