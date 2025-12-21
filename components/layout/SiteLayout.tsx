'use client'

import { GlassNavbar } from '@/components/layout/GlassNavbar'
import { Footer } from '@/components/layout/Footer'

interface SiteLayoutProps {
  children: React.ReactNode
  hideFooter?: boolean
  hideNavbar?: boolean
}

export function SiteLayout({ children, hideFooter = false, hideNavbar = false }: SiteLayoutProps) {
  return (
    <>
      {!hideNavbar && <GlassNavbar />}
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </>
  )
}
