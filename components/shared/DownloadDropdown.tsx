'use client'

import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

// Custom Apple icon since lucide doesn't have a proper Apple logo
function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  )
}

// Custom Android icon
function AndroidIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.6 11.4c-.3 0-.5-.2-.5-.5s.2-.5.5-.5.5.2.5.5-.2.5-.5.5m-11.2 0c-.3 0-.5-.2-.5-.5s.2-.5.5-.5.5.2.5.5-.2.5-.5.5M18.1 7l1.8-3.2c.1-.2 0-.4-.2-.5s-.4 0-.5.2l-1.8 3.3C15.7 5.7 13.9 5 12 5s-3.7.7-5.4 1.8L4.8 3.5c-.1-.2-.3-.3-.5-.2s-.3.3-.2.5L5.9 7C3.1 8.8 1.3 11.5 1 14.5h22c-.3-3-2.1-5.7-4.9-7.5M12 22c-1.1 0-2-.9-2-2v-8H3v8c0 1.1-.9 2-2 2S.5 21.1.5 20V12c0-1.1.9-2 2-2h19c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2s-2-.9-2-2v-8h-7v8c0 1.1-.9 2-2 2z"/>
    </svg>
  )
}

interface DownloadDropdownProps {
  variant?: 'gradient' | 'default' | 'teal' | 'primary-solid'
  size?: 'default' | 'sm' | 'lg' | 'xl'
  className?: string
}

export function DownloadDropdown({ variant = 'gradient', size = 'lg', className }: DownloadDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Download className="w-5 h-5 mr-2" />
          Download App
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link
            href="https://play.google.com/store/apps/details?id=in.snapgo.app&hl=en_IN"
            target="_blank"
            className="flex items-center gap-3 cursor-pointer"
          >
            <AndroidIcon className="w-5 h-5 text-[#3DDC84]" />
            <div>
              <div className="font-medium">Android</div>
              <div className="text-xs text-muted-foreground">Get it on Google Play</div>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="https://apps.apple.com/in/app/snapgo-connect-split-fare/id6748761741"
            target="_blank"
            className="flex items-center gap-3 cursor-pointer"
          >
            <AppleIcon className="w-5 h-5" />
            <div>
              <div className="font-medium">iOS</div>
              <div className="text-xs text-muted-foreground">Get it on App Store</div>
            </div>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
