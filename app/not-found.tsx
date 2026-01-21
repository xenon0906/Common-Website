'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-secondary flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center text-white"
      >
        <div className="mb-8">
          <span className="text-9xl font-bold opacity-20">404</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Page Not Found
        </h1>

        <p className="text-xl text-white/70 mb-8 max-w-md mx-auto">
          Oops! Looks like you've taken a wrong turn. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
            <Link href="/">
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
            <Link href="/contact">
              <Search className="w-5 h-5 mr-2" />
              Contact Support
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
