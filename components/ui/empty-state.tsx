'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { LucideIcon, FileQuestion, FolderOpen, Search, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick?: () => void
    href?: string
  }
  variant?: 'default' | 'minimal' | 'card'
  className?: string
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  variant = 'default',
  className,
}: EmptyStateProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        variant === 'default' && 'py-16',
        variant === 'minimal' && 'py-8',
        variant === 'card' && 'p-12 rounded-xl border bg-card',
        className
      )}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className={cn(
          'rounded-full flex items-center justify-center mb-4',
          variant === 'minimal' ? 'w-12 h-12 bg-muted' : 'w-16 h-16 bg-muted'
        )}
      >
        <Icon
          className={cn(
            'text-muted-foreground',
            variant === 'minimal' ? 'w-6 h-6' : 'w-8 h-8'
          )}
        />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className={cn(
          'font-semibold mb-2',
          variant === 'minimal' ? 'text-base' : 'text-lg'
        )}
      >
        {title}
      </motion.h3>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            'text-muted-foreground max-w-sm mb-6',
            variant === 'minimal' ? 'text-sm' : 'text-sm'
          )}
        >
          {description}
        </motion.p>
      )}

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          {action.href ? (
            <Button asChild variant="default">
              <a href={action.href}>{action.label}</a>
            </Button>
          ) : (
            <Button onClick={action.onClick} variant="default">
              {action.label}
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  )

  return content
}

// Pre-built empty states for common scenarios
export function NoResultsEmptyState({ searchQuery }: { searchQuery?: string }) {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      description={
        searchQuery
          ? `No items match "${searchQuery}". Try adjusting your search or filters.`
          : 'No items match your current filters.'
      }
    />
  )
}

export function NoDataEmptyState({
  title = 'No data yet',
  description = 'Get started by adding your first item.',
  actionLabel,
  onAction,
}: {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <EmptyState
      icon={FolderOpen}
      title={title}
      description={description}
      action={
        actionLabel
          ? {
              label: actionLabel,
              onClick: onAction,
            }
          : undefined
      }
    />
  )
}

export function ErrorEmptyState({
  title = 'Something went wrong',
  description = 'An error occurred while loading this content.',
  onRetry,
}: {
  title?: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <EmptyState
      icon={FileQuestion}
      title={title}
      description={description}
      action={
        onRetry
          ? {
              label: 'Try again',
              onClick: onRetry,
            }
          : undefined
      }
    />
  )
}
