'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DEFAULT_CATEGORIES } from '@/lib/types/blog'

interface RelatedPost {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  imageUrl?: string | null
  category?: string
  categoryName?: string
  readingTime?: number
  createdAt: Date | string
}

interface RelatedPostsProps {
  posts: RelatedPost[]
  className?: string
}

function formatDate(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date)
  if (isNaN(d.getTime())) return 'N/A'
  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
  }).format(d)
}

function getCategoryInfo(categoryId?: string) {
  if (!categoryId) return null
  return DEFAULT_CATEGORIES.find((c) => c.id === categoryId)
}

function RelatedPostCard({ post, index }: { post: RelatedPost; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const category = getCategoryInfo(post.category)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/blog/${post.slug}`} className="group block h-full">
        <div className="h-full flex flex-col bg-white dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800">
          {/* Image */}
          <div className="relative h-40 overflow-hidden">
            {post.imageUrl ? (
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized={post.imageUrl.startsWith('/uploads/')}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-teal flex items-center justify-center">
                <span className="text-3xl font-bold text-white/30">
                  {post.title.charAt(0)}
                </span>
              </div>
            )}

            {/* Category badge */}
            {category && (
              <div className="absolute top-2 left-2">
                <Badge className={`${category.color} text-white border-0 shadow-sm text-xs`}>
                  {category.name}
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col p-4">
            {/* Meta */}
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(post.createdAt)}
              </span>
              {post.readingTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readingTime} min
                </span>
              )}
            </div>

            {/* Title */}
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-2 text-sm">
              {post.title}
            </h4>

            {/* Read more */}
            <motion.div
              className="inline-flex items-center gap-1 text-primary font-medium text-xs mt-auto"
              whileHover={{ x: 3 }}
            >
              Read more
              <ArrowRight className="w-3 h-3" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function RelatedPosts({ posts, className = '' }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={`py-12 ${className}`}
    >
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Related Articles
            </h3>
            <Link
              href="/blog"
              className="text-primary font-medium text-sm flex items-center gap-1 hover:underline"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Posts Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(0, 3).map((post, index) => (
              <RelatedPostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default RelatedPosts
