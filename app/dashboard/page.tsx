'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lock, Download, Smartphone } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pt-32 pb-20">
      <div className="container mx-auto px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24 2xl:px-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-primary" />
          </div>

          <Badge className="mb-4">Protected Area</Badge>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            User Dashboard Coming Soon
          </h1>

          <p className="text-muted-foreground mb-8">
            The web dashboard for snapgo users is under development. For now, please use our mobile app for the best experience.
          </p>

          <Card className="bg-gradient-to-r from-teal/10 to-primary/10 border-teal/30 mb-8">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Download the snapgo App</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get full access to all features including real-time ride matching, chat, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="gradient" asChild>
                  <Link href="https://play.google.com/store" target="_blank">
                    <Download className="w-5 h-5 mr-2" />
                    Google Play
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="https://apps.apple.com" target="_blank">
                    <Smartphone className="w-5 h-5 mr-2" />
                    App Store
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-sm text-muted-foreground">
            Are you an admin?{' '}
            <Link href="/admin" className="text-teal hover:underline">
              Go to Admin Panel
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
