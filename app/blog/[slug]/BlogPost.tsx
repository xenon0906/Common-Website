'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react'
import { trackBlogView } from '@/lib/google-analytics'
import { ShareButton } from '@/components/blog/ShareButton'
import { AuthorSection } from '@/components/blog/AuthorSection'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { DEFAULT_CATEGORIES, type BlogAuthor, type ContentBlock, type ContentVersion } from '@/lib/types/blog'
import { ContentRenderer } from '@/components/blog/ContentRenderer'

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

interface Blog {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  imageUrl: string | null
  createdAt: Date | string
  updatedAt: Date | string
  category?: string
  categoryName?: string
  tags?: string[]
  readingTime?: number
  author?: BlogAuthor
  contentBlocks?: ContentBlock[]
  contentVersion?: ContentVersion
}

interface BlogPostProps {
  blog: Blog
  relatedPosts?: RelatedPost[]
}

function formatDate(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date)
  if (isNaN(d.getTime())) return 'N/A'
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

function estimateReadTime(content: string, readingTime?: number): string {
  if (readingTime) return `${readingTime} min read`
  const words = content.split(' ').length
  const minutes = Math.ceil(words / 200)
  return `${minutes} min read`
}

function getCategoryInfo(categoryId?: string) {
  if (!categoryId) return null
  return DEFAULT_CATEGORIES.find((c) => c.id === categoryId)
}

export function BlogPost({ blog, relatedPosts = [] }: BlogPostProps) {
  const category = getCategoryInfo(blog.category)

  useEffect(() => {
    // Track blog view in Google Analytics
    trackBlogView(blog.slug)
  }, [blog.slug])

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="teal">Blog</Badge>
              {category && (
                <Badge className={`${category.color} text-white border-0`}>
                  {category.name}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-white/80">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(blog.createdAt)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {estimateReadTime(blog.content, blog.readingTime)}
              </span>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <Tag className="w-4 h-4 text-white/60" />
                {blog.tags.slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-white/10 text-white/80 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      {blog.imageUrl && (
        <div className="relative -mt-8 z-10">
          <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={blog.imageUrl}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  priority
                  unoptimized={blog.imageUrl.startsWith('/uploads/')}
                />
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Content */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            {/* Author Section */}
            <AuthorSection
              author={blog.author}
              publishedAt={blog.createdAt}
              className="mb-8"
            />

            <ContentRenderer
              content={blog.content}
              contentBlocks={blog.contentBlocks}
              contentVersion={blog.contentVersion}
            />

            <Separator className="my-8" />

            {/* Share */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <ShareButton
                title={blog.title}
                excerpt={blog.excerpt || undefined}
              />

              <Button variant="outline" asChild>
                <Link href="/blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to all posts
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <RelatedPosts posts={relatedPosts} className="bg-gray-50 dark:bg-gray-950" />
      )}

      {/* Floating Share Button for mobile */}
      <div className="lg:hidden">
        <ShareButton
          title={blog.title}
          excerpt={blog.excerpt || undefined}
          variant="floating"
        />
      </div>
    </>
  )
}
