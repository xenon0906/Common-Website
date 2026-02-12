'use client'

import { useState } from 'react'
import { Twitter, Facebook, Linkedin, Link as LinkIcon, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

interface ShareButtonsProps {
  url: string
  title: string
  className?: string
}

export function ShareButtons({ url, title, className = '' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  // Get full URL
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      toast({
        title: 'Link copied!',
        description: 'Blog link copied to clipboard',
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
      toast({
        title: 'Failed to copy',
        description: 'Could not copy link to clipboard',
        variant: 'destructive',
      })
    }
  }

  const handleShare = (platform: string, url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400')
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Share this article
      </p>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('twitter', shareLinks.twitter)}
          className="gap-2"
        >
          <Twitter className="w-4 h-4" />
          <span className="hidden sm:inline">Twitter</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('facebook', shareLinks.facebook)}
          className="gap-2"
        >
          <Facebook className="w-4 h-4" />
          <span className="hidden sm:inline">Facebook</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('linkedin', shareLinks.linkedin)}
          className="gap-2"
        >
          <Linkedin className="w-4 h-4" />
          <span className="hidden sm:inline">LinkedIn</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="gap-2"
        >
          {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
          <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Link'}</span>
        </Button>
      </div>
    </div>
  )
}
