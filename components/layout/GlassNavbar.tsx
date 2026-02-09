'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet'
import { NAV_LINKS, SITE_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { DownloadDropdown } from '@/components/shared/DownloadDropdown'

interface NavLink {
  label: string
  href: string
}

export function GlassNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [isFloating, setIsFloating] = useState(false)
  const [navLinks, setNavLinks] = useState<NavLink[]>(NAV_LINKS)
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const lastScrollY = useRef(0)

  // Fetch navigation from Firebase (with NAV_LINKS fallback)
  useEffect(() => {
    fetch('/api/navigation')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const headerLinks = data
            .filter((l: any) => l.isActive !== false && (!l.location || l.location === 'header'))
            .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
            .map((l: any) => ({ label: l.label, href: l.href }))
          if (headerLinks.length > 0) setNavLinks(headerLinks)
        }
      })
      .catch(() => {})
  }, [])

  // Hide on scroll down, show on scroll up
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = lastScrollY.current

    // Only hide/show after scrolling past 100px
    if (latest > 100) {
      // Scrolling down - hide
      if (latest > previous && latest - previous > 5) {
        setHidden(true)
      }
      // Scrolling up - show
      if (latest < previous && previous - latest > 5) {
        setHidden(false)
      }
    } else {
      setHidden(false)
    }

    // Apply floating style after scrolling 50px
    setIsFloating(latest > 50)

    lastScrollY.current = latest
  })

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: hidden ? -100 : 0,
        opacity: hidden ? 0 : 1
      }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isFloating ? 'py-2' : 'py-0'
      )}
    >
      <nav
        className={cn(
          'transition-all duration-500',
          isFloating
            ? 'glass-nav-floating mx-4 md:mx-8 lg:mx-12'
            : 'bg-white/95 backdrop-blur-md border-b border-gray-100'
        )}
      >
        <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Empty div for mobile balance - hidden on desktop */}
            <div className="w-10 lg:hidden" />

            {/* Logo - centered on mobile/tablet, left on desktop */}
            <Link href="/" className="flex items-center group absolute left-1/2 -translate-x-1/2 lg:relative lg:left-0 lg:translate-x-0">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative w-28 h-10 md:w-36 md:h-12 translate-y-[5px]"
              >
                <Image
                  src="/images/logo/Snapgo%20Logo%20Blue.png"
                  alt={SITE_CONFIG.name}
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href ||
                  (link.href !== '/' && pathname.startsWith(link.href))

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'text-primary'
                        : 'text-gray-700 hover:text-primary'
                    )}
                  >
                    <motion.span
                      whileHover={{ y: -1 }}
                      transition={{ duration: 0.2 }}
                      className="relative inline-block"
                    >
                      {link.label}
                      {/* Underline indicator - inside span to match text width */}
                      {isActive && (
                        <motion.div
                          layoutId="navbar-underline"
                          className="absolute -bottom-1 -left-1 w-[calc(100%+8px)] h-0.5 bg-gradient-to-r from-primary to-teal rounded-full"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </motion.span>
                  </Link>
                )
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <DownloadDropdown variant="gradient" size="default" />
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-700 hover:bg-gray-100"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:w-80 bg-white/95 backdrop-blur-xl border-l border-gray-200"
                >
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                  <div className="flex flex-col h-full">
                    {/* Mobile Logo */}
                    <div className="flex items-center justify-center py-8 border-b border-gray-100">
                      <div className="relative w-32 h-12">
                        <Image
                          src="/images/logo/Snapgo%20Logo%20Blue.png"
                          alt={SITE_CONFIG.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>

                    {/* Mobile Navigation Links */}
                    <nav className="flex flex-col gap-1 py-6 flex-1">
                      {navLinks.map((link, index) => {
                        const isActive = pathname === link.href ||
                          (link.href !== '/' && pathname.startsWith(link.href))

                        return (
                          <SheetClose asChild key={link.href}>
                            <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Link
                                href={link.href}
                                className={cn(
                                  'flex items-center px-4 py-3 mx-2 rounded-xl text-base font-medium transition-all duration-200 border-l-4',
                                  isActive
                                    ? 'text-primary border-primary bg-primary/5'
                                    : 'text-gray-900 border-transparent hover:bg-gray-50 hover:text-primary'
                                )}
                              >
                                {link.label}
                              </Link>
                            </motion.div>
                          </SheetClose>
                        )
                      })}
                    </nav>

                    {/* Mobile Download Button */}
                    <div className="p-4 border-t border-gray-100">
                      <DownloadDropdown
                        variant="gradient"
                        size="lg"
                        className="w-full justify-center"
                      />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </motion.header>
  )
}
