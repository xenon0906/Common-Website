'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import { trackBlogView } from '@/lib/google-analytics'
import { ReadingProgress } from '@/components/blog/ReadingProgress'
import type { BlogAuthor, ContentBlock, ContentVersion } from '@/lib/types/blog'
import { ContentRenderer } from '@/components/blog/ContentRenderer'

// Dynamic imports for below-the-fold components
const TableOfContents = dynamic(() => import('@/components/blog/TableOfContents').then(mod => ({ default: mod.TableOfContents })), {
  ssr: false,
  loading: () => <div className="h-48 animate-pulse bg-gray-100 dark:bg-gray-800 rounded" />,
})

const ShareButtons = dynamic(() => import('@/components/blog/ShareButtons').then(mod => ({ default: mod.ShareButtons })), {
  loading: () => <div className="h-24 animate-pulse bg-gray-100 dark:bg-gray-800 rounded" />,
})

const RelatedPosts = dynamic(() => import('@/components/blog/RelatedPosts').then(mod => ({ default: mod.RelatedPosts })))

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

export function BlogPost({ blog, relatedPosts = [] }: BlogPostProps) {

  useEffect(() => {
    // Track blog view in Google Analytics
    trackBlogView(blog.slug)
  }, [blog.slug])

  return (
    <>
      {/* Reading Progress Bar */}
      <ReadingProgress />

      {/* Article Header */}
      <article className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary mb-8 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {/* Category badge */}
            {blog.categoryName && (
              <div className="mb-4">
                <Badge className="bg-primary/10 text-primary border-0 text-xs uppercase tracking-wider font-medium">
                  {blog.categoryName}
                </Badge>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
              {blog.title}
            </h1>

            {/* Excerpt */}
            {blog.excerpt && (
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                {blog.excerpt}
              </p>
            )}

            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 pb-8 border-b border-gray-200 dark:border-gray-800">
              {blog.author && (
                <div className="flex items-center gap-3">
                  {blog.author.avatar && (
                    <Image
                      src={blog.author.avatar}
                      alt={blog.author.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {blog.author.name}
                  </span>
                </div>
              )}
              <span>·</span>
              <time dateTime={typeof blog.createdAt === 'string' ? blog.createdAt : blog.createdAt.toISOString()}>
                {formatDate(blog.createdAt)}
              </time>
              <span>·</span>
              <span>{estimateReadTime(blog.content, blog.readingTime)}</span>
            </div>
          </motion.div>
        </div>
      </article>

      {/* Featured Image */}
      {blog.imageUrl && (
        <div className="mb-12">
          <div className="container mx-auto px-6 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
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

      {/* Content with Sidebar */}
      <section className="pb-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_250px] gap-12 max-w-7xl mx-auto">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-[700px]"
            >
              <article className="prose prose-lg prose-gray dark:prose-invert max-w-none
                         prose-headings:font-bold prose-headings:tracking-tight
                         prose-h1:text-4xl prose-h1:mt-12 prose-h1:mb-6
                         prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4
                         prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
                         prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6
                         prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                         prose-img:rounded-lg prose-img:my-8
                         prose-blockquote:border-l-4 prose-blockquote:border-primary
                         prose-blockquote:pl-6 prose-blockquote:italic
                         prose-code:bg-gray-100 dark:prose-code:bg-gray-800
                         prose-code:px-2 prose-code:py-1 prose-code:rounded
                         prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950"
              >
                <ContentRenderer
                  content={blog.content}
                  contentBlocks={blog.contentBlocks}
                  contentVersion={blog.contentVersion}
                />
              </article>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                <ShareButtons
                  url={`/blog/${blog.slug}`}
                  title={blog.title}
                />
              </div>
            </motion.div>

            {/* Sidebar - Desktop Only */}
            <aside className="hidden lg:block">
              <TableOfContents />
            </aside>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <RelatedPosts posts={relatedPosts} className="bg-gray-50 dark:bg-gray-950" />
      )}
    </>
  )
}
