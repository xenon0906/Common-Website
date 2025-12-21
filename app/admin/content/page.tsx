'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Sparkles,
  BarChart3,
  Star,
  MessageSquare,
  Info,
  Smartphone,
  Mail,
  Share2,
  ArrowRight,
} from 'lucide-react'

const contentSections = [
  {
    href: '/admin/content/hero',
    icon: Sparkles,
    title: 'Hero Section',
    description: 'Edit the main hero headline, subtext, badge, and call-to-action buttons',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    href: '/admin/content/stats',
    icon: BarChart3,
    title: 'Statistics',
    description: 'Manage the key statistics displayed on the homepage',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    href: '/admin/content/features',
    icon: Star,
    title: 'Features',
    description: 'Edit the feature cards showcasing Snapgo benefits',
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    href: '/admin/content/testimonials',
    icon: MessageSquare,
    title: 'Testimonials',
    description: 'Manage user testimonials and reviews',
    color: 'bg-green-100 text-green-600',
  },
  {
    href: '/admin/content/about',
    icon: Info,
    title: 'About Content',
    description: 'Edit the origin story, mission, vision, and values',
    color: 'bg-teal-100 text-teal-600',
  },
  {
    href: '/admin/content/apps',
    icon: Smartphone,
    title: 'App Store Links',
    description: 'Update Android and iOS app store URLs and QR codes',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    href: '/admin/content/contact',
    icon: Mail,
    title: 'Contact Info',
    description: 'Edit email, phone, and address information',
    color: 'bg-pink-100 text-pink-600',
  },
  {
    href: '/admin/content/social',
    icon: Share2,
    title: 'Social Links',
    description: 'Manage social media profile URLs',
    color: 'bg-indigo-100 text-indigo-600',
  },
]

export default function ContentManagerPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Content Manager</h1>
        <p className="text-muted-foreground mt-2">
          Manage all website content from one place. Changes are reflected immediately on the website.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentSections.map((section, index) => {
          const Icon = section.icon
          return (
            <motion.div
              key={section.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={section.href}>
                <Card className="h-full hover:shadow-lg hover:border-primary/30 transition-all duration-300 group cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${section.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {section.title}
                        </CardTitle>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{section.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
