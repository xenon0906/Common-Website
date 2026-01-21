'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import NextImage from 'next/image'
import { motion } from 'framer-motion'
import { SITE_CONFIG } from '@/lib/constants'
import { USE_FIREBASE } from '@/lib/config'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { getFirebaseAuth } from '@/lib/firebase'
import {
  LayoutDashboard,
  FileText,
  Award,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Home,
  Users,
  Layers,
  Sparkles,
  BarChart3,
  Star,
  MessageSquare,
  Info,
  Smartphone,
  Mail,
  Share2,
  Search,
  Globe,
  Image as ImageIcon,
  Instagram,
  HelpCircle,
  FileStack,
  Navigation,
  AlertTriangle,
  CheckCircle,
  Flame,
  Loader2,
} from 'lucide-react'

const sidebarLinks = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/pages', icon: FileStack, label: 'Pages Overview' },
  { href: '/admin/content', icon: Layers, label: 'Content Manager', isSection: true },
  { href: '/admin/content/hero', icon: Sparkles, label: 'Hero Section', parent: '/admin/content' },
  { href: '/admin/content/stats', icon: BarChart3, label: 'Statistics', parent: '/admin/content' },
  { href: '/admin/content/features', icon: Star, label: 'Features', parent: '/admin/content' },
  { href: '/admin/content/how-it-works', icon: Layers, label: 'How It Works', parent: '/admin/content' },
  { href: '/admin/content/testimonials', icon: MessageSquare, label: 'Testimonials', parent: '/admin/content' },
  { href: '/admin/content/about', icon: Info, label: 'About Content', parent: '/admin/content' },
  { href: '/admin/content/apps', icon: Smartphone, label: 'App Store Links', parent: '/admin/content' },
  { href: '/admin/content/contact', icon: Mail, label: 'Contact Info', parent: '/admin/content' },
  { href: '/admin/content/social', icon: Share2, label: 'Social Links', parent: '/admin/content' },
  { href: '/admin/content/images', icon: ImageIcon, label: 'Images & Assets', parent: '/admin/content' },
  { href: '/admin/blogs', icon: FileText, label: 'Blog Manager' },
  { href: '/admin/team', icon: Users, label: 'Team Manager' },
  { href: '/admin/achievements', icon: Award, label: 'Achievements' },
  { href: '/admin/faq', icon: HelpCircle, label: 'FAQ Manager' },
  { href: '/admin/instagram', icon: Instagram, label: 'Instagram Reels' },
  { href: '/admin/media', icon: ImageIcon, label: 'Media Library' },
  { href: '/admin/navigation', icon: Navigation, label: 'Navigation Editor' },
  { href: '/admin/seo', icon: Search, label: 'SEO & Optimization' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  // IMPORTANT: Check for login page FIRST, before any state that could cause loading UI
  // This must be before other useState calls to ensure login page renders immediately
  const isLoginPage = pathname?.includes('/admin/login')

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [authLoading, setAuthLoading] = useState(USE_FIREBASE && !isLoginPage)
  const [user, setUser] = useState<User | null>(null)
  const [firebaseConnected, setFirebaseConnected] = useState(false)

  // Firebase auth state listener (skip for login page)
  useEffect(() => {
    if (!USE_FIREBASE || isLoginPage) {
      setAuthLoading(false)
      return
    }

    const auth = getFirebaseAuth()
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setFirebaseConnected(true)
      setAuthLoading(false)

      // Redirect to login if not authenticated and not already on login page
      if (!currentUser && !pathname?.includes('/admin/login')) {
        router.push('/admin/login')
      }
    })

    return () => unsubscribe()
  }, [pathname, router, isLoginPage])

  const handleLogout = async () => {
    try {
      if (USE_FIREBASE) {
        const auth = getFirebaseAuth()
        await signOut(auth)
        router.push('/admin/login')
        router.refresh()
      } else {
        await fetch('/api/admin/logout', { method: 'POST' })
        router.push('/admin/login')
        router.refresh()
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // For login page, just render children without the admin layout
  if (isLoginPage) {
    return <>{children}</>
  }

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If Firebase is enabled and user is not authenticated, don't render the layout
  if (USE_FIREBASE && !user) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-background border-r transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <NextImage
                src="/images/logo/Snapgo%20Logo%20White.png"
                alt={SITE_CONFIG.name}
                fill
                className="object-contain brightness-110"
              />
            </div>
            {sidebarOpen && (
              <span className="font-bold text-lg">Admin</span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex"
          >
            <ChevronRight className={cn(
              'w-5 h-5 transition-transform',
              !sidebarOpen && 'rotate-180'
            )} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href ||
              (link.href !== '/admin' && pathname.startsWith(link.href))
            const isParentActive = link.parent && pathname.startsWith(link.parent)
            const hasParent = 'parent' in link

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 py-2.5 rounded-lg transition-all duration-200',
                  hasParent ? 'pl-8 pr-4' : 'px-4',
                  hasParent && !sidebarOpen && 'pl-4',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  'isSection' in link && 'font-semibold text-foreground mt-4 first:mt-0'
                )}
              >
                <Icon className={cn('flex-shrink-0', hasParent ? 'w-4 h-4' : 'w-5 h-5')} />
                {sidebarOpen && <span className={hasParent ? 'text-sm' : ''}>{link.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t space-y-2">
          <Link
            href="/"
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors'
            )}
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Back to Site</span>}
          </Link>
          <button
            onClick={handleLogout}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors'
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          'min-h-screen transition-all duration-300',
          sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
        )}
      >
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-background border-b flex items-center px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-6 h-6" />
          </Button>
          <span className="ml-4 font-semibold">Admin Panel</span>
        </header>

        {/* Firebase/Static Mode Banner */}
        {USE_FIREBASE ? (
          <div className={cn(
            'border-b px-4 py-3',
            firebaseConnected
              ? 'bg-teal/5 border-teal/20'
              : 'bg-amber-50 border-amber-200'
          )}>
            <div className="flex items-center gap-3 max-w-7xl mx-auto">
              {firebaseConnected ? (
                <>
                  <Flame className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold text-teal">Firebase Connected</span>
                      {user && (
                        <span className="text-muted-foreground ml-2">
                          • {user.isAnonymous ? 'Anonymous user' : user.email || user.uid}
                        </span>
                      )}
                    </p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-teal flex-shrink-0" />
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-amber-800">
                      <span className="font-semibold">Connecting to Firebase...</span>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
            <div className="flex items-center gap-3 max-w-7xl mx-auto">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">Static Mode Active:</span> Database is not connected.
                  Content changes will not be saved. To enable persistence, configure DATABASE_URL and update lib/config.ts.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
