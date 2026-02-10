'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import {
  Share2,
  X,
  Check,
  Copy,
  Facebook,
  Linkedin,
  MessageCircle,
} from 'lucide-react'

// Custom X (Twitter) icon
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

// WhatsApp icon
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

interface ShareButtonProps {
  title: string
  url?: string
  excerpt?: string
  className?: string
  variant?: 'default' | 'floating'
}

interface ShareOption {
  name: string
  icon: React.ReactNode
  color: string
  hoverColor: string
  action: (url: string, title: string, excerpt: string) => void
}

export function ShareButton({
  title,
  url,
  excerpt = '',
  className = '',
  variant = 'default',
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState(url || '')
  const [copied, setCopied] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!url) {
      setShareUrl(window.location.href)
    }
    setCanNativeShare(typeof navigator !== 'undefined' && !!navigator.share)
  }, [url])

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: excerpt || title,
          url: shareUrl,
        })
      } catch (error) {
        // User cancelled or share failed, open fallback
        if ((error as Error).name !== 'AbortError') {
          setIsOpen(true)
        }
      }
    } else {
      setIsOpen(true)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast({
        title: 'Link copied!',
        description: 'The link has been copied to your clipboard.',
      })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Please copy the link manually.',
        variant: 'destructive',
      })
    }
  }

  const shareOptions: ShareOption[] = [
    {
      name: 'WhatsApp',
      icon: <WhatsAppIcon className="w-5 h-5" />,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      action: (url, title) => {
        const text = encodeURIComponent(`${title}\n\n${url}`)
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
      },
    },
    {
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      action: (url) => {
        window.open(
          `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank'
        )
      },
    },
    {
      name: 'X',
      icon: <XIcon className="w-4 h-4" />,
      color: 'bg-black',
      hoverColor: 'hover:bg-gray-800',
      action: (url, title) => {
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          '_blank'
        )
      },
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-5 h-5" />,
      color: 'bg-blue-700',
      hoverColor: 'hover:bg-blue-800',
      action: (url, title) => {
        window.open(
          `https://linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
          '_blank'
        )
      },
    },
  ]

  // Floating variant - fixed position share button
  if (variant === 'floating') {
    return (
      <>
        <motion.button
          onClick={handleNativeShare}
          className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center ${className}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Share2 className="w-6 h-6" />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <ShareBottomSheet
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              shareOptions={shareOptions}
              shareUrl={shareUrl}
              title={title}
              excerpt={excerpt}
              onCopy={copyToClipboard}
              copied={copied}
            />
          )}
        </AnimatePresence>
      </>
    )
  }

  // Default inline variant
  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-muted-foreground text-sm">Share:</span>

        {/* Quick share buttons for desktop */}
        <div className="hidden sm:flex items-center gap-1">
          {shareOptions.map((option) => (
            <Button
              key={option.name}
              variant="ghost"
              size="icon"
              className="w-9 h-9"
              onClick={() => option.action(shareUrl, title, excerpt)}
              title={`Share on ${option.name}`}
            >
              {option.icon}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9"
            onClick={copyToClipboard}
            title="Copy link"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Share button for mobile */}
        <Button
          variant="outline"
          size="sm"
          className="sm:hidden"
          onClick={handleNativeShare}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <ShareBottomSheet
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            shareOptions={shareOptions}
            shareUrl={shareUrl}
            title={title}
            excerpt={excerpt}
            onCopy={copyToClipboard}
            copied={copied}
          />
        )}
      </AnimatePresence>
    </>
  )
}

interface ShareBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  shareOptions: ShareOption[]
  shareUrl: string
  title: string
  excerpt: string
  onCopy: () => void
  copied: boolean
}

function ShareBottomSheet({
  isOpen,
  onClose,
  shareOptions,
  shareUrl,
  title,
  excerpt,
  onCopy,
  copied,
}: ShareBottomSheetProps) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl z-50 p-6 pb-safe"
      >
        {/* Handle */}
        <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-6" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Share this article</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Share Options Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={() => {
                option.action(shareUrl, title, excerpt)
                onClose()
              }}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={`w-14 h-14 rounded-full ${option.color} ${option.hoverColor} flex items-center justify-center text-white transition-colors`}
              >
                {option.icon}
              </div>
              <span className="text-xs text-muted-foreground">{option.name}</span>
            </button>
          ))}
        </div>

        {/* Copy Link */}
        <div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <div className="flex-1 truncate text-sm text-muted-foreground">
            {shareUrl}
          </div>
          <Button
            variant={copied ? 'default' : 'outline'}
            size="sm"
            onClick={onCopy}
            className={copied ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </>
  )
}

export default ShareButton
