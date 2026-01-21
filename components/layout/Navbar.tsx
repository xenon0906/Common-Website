'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet'
import { NAV_LINKS, SITE_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { DownloadDropdown } from '@/components/shared/DownloadDropdown'

const DEFAULT_LOGO = '/images/logo/Snapgo%20Logo%20Blue.png'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [logoUrl, setLogoUrl] = useState(DEFAULT_LOGO)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)

    // Fetch dynamic logo from images API
    fetch('/api/content/images')
      .then(res => res.json())
      .then(data => {
        if (data?.logos?.blue) {
          setLogoUrl(data.logos.blue)
        }
      })
      .catch(() => {
        // Keep default on error
      })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/95 backdrop-blur-md shadow-lg border-b'
          : 'bg-transparent'
      )}
    >
      <nav className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Only image, no text */}
          <Link href="/" className="flex items-center group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-32 h-12 md:w-40 md:h-14"
            >
              <Image
                src={logoUrl}
                alt={SITE_CONFIG.name}
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                  pathname === link.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-muted hover:text-primary'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <DownloadDropdown variant="gradient" size="default" />
          </div>

          {/* Mobile Menu */}
          <div className="flex lg:hidden items-center gap-2">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                {/* Mobile Menu Logo - Only image */}
                <div className="flex items-center justify-center mb-6 sm:mb-8">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative w-28 h-28 sm:w-32 sm:h-32"
                  >
                    <Image
                      src={logoUrl}
                      alt={SITE_CONFIG.name}
                      fill
                      className="object-contain"
                    />
                  </motion.div>
                </div>

                <nav className="flex flex-col gap-2 flex-1">
                  {NAV_LINKS.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          'px-4 py-3 rounded-lg text-base font-medium transition-all duration-300',
                          pathname === link.href
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground hover:bg-muted'
                        )}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>

                {/* Mobile Download Button */}
                <div className="pt-4 border-t">
                  <DownloadDropdown variant="gradient" size="lg" className="w-full" />
                </div>
              </div>
            </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </motion.header>
  )
}
