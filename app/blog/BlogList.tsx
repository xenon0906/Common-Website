'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { Calendar, Clock, ArrowRight, BookOpen, TrendingUp } from 'lucide-react'

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  imageUrl: string | null
  createdAt: Date
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

function estimateReadTime(excerpt: string | null): string {
  const words = excerpt?.split(' ').length || 100
  const minutes = Math.ceil(words / 200) + 3
  return `${minutes} min`
}

// Hero section - Centered content like How It Works page
function BlogHero({ onScrollDown }: { onScrollDown: () => void }) {
  return (
    <section className="hero-viewport bg-gradient-to-br from-primary via-primary/90 to-primary-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Latest from{' '}
            <span className="text-white/90">Snapgo</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12">
            Tips, stories, and insights about ride-sharing, saving money, and sustainable travel.
          </p>

          {/* Simple stats row */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {[
              { value: 'Weekly', label: 'New Articles' },
              { value: 'Expert', label: 'Insights' },
              { value: 'Free', label: 'To Read' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                <p className="text-white/50 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={onScrollDown}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-xl font-medium hover:bg-white/90 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              Read Articles
            </button>
            <a
              href="/#download"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors border border-white/20"
            >
              Download App
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// Featured blog card (first article)
function FeaturedBlogCard({ blog }: { blog: Blog }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <Link href={`/blog/${blog.slug}`} className="group block">
        <div className="relative grid md:grid-cols-2 gap-8 bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100">
          {/* Image */}
          <div className="relative h-64 md:h-auto min-h-[300px] overflow-hidden">
            {blog.imageUrl ? (
              <Image
                src={blog.imageUrl}
                alt={blog.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary via-teal-500 to-emerald-500 flex items-center justify-center">
                <span className="text-8xl font-bold text-white/20">
                  {blog.title.charAt(0)}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent md:bg-none" />

            {/* Featured badge */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-primary text-white border-0 shadow-lg">
                <TrendingUp className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-10 flex flex-col justify-center">
            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(blog.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {estimateReadTime(blog.excerpt)}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
              {blog.title}
            </h2>

            {/* Excerpt */}
            {blog.excerpt && (
              <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                {blog.excerpt}
              </p>
            )}

            {/* Read more */}
            <motion.div
              className="inline-flex items-center gap-2 text-primary font-semibold"
              whileHover={{ x: 5 }}
            >
              Read Full Article
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// Horizontal blog card (list view)
function HorizontalBlogCard({ blog, index }: { blog: Blog; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/blog/${blog.slug}`} className="group block">
        <div className="flex flex-col md:flex-row gap-6 p-6 bg-white rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary/20">
          {/* Image */}
          <div className="relative w-full md:w-64 h-48 md:h-40 flex-shrink-0 rounded-xl overflow-hidden">
            {blog.imageUrl ? (
              <Image
                src={blog.imageUrl}
                alt={blog.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-teal flex items-center justify-center">
                <span className="text-4xl font-bold text-white/30">
                  {blog.title.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center">
            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(blog.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {estimateReadTime(blog.excerpt)}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {blog.title}
            </h3>

            {/* Excerpt */}
            {blog.excerpt && (
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {blog.excerpt}
              </p>
            )}

            {/* Read more */}
            <motion.div
              className="inline-flex items-center gap-2 text-primary font-medium text-sm"
              whileHover={{ x: 5 }}
            >
              Read more
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// Empty state
function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
        <BookOpen className="w-10 h-10 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">No articles yet</h2>
      <p className="text-gray-600 max-w-md mx-auto">
        We're working on some great content. Check back soon for tips on saving money, ride-sharing stories, and more!
      </p>
    </div>
  )
}

export function BlogList({ blogs }: { blogs: Blog[] }) {
  const contentRef = useRef<HTMLDivElement>(null)
  const featuredBlog = blogs[0]
  const remainingBlogs = blogs.slice(1)

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <SiteLayout>
      <BlogHero onScrollDown={scrollToContent} />

      {/* Blog Content */}
      <section ref={contentRef} className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          {blogs.length > 0 ? (
            <div className="max-w-5xl mx-auto">
              {/* Featured article */}
              <FeaturedBlogCard blog={featuredBlog} />

              {/* More articles header */}
              {remainingBlogs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 mb-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900">More Articles</h2>
                </motion.div>
              )}

              {/* Remaining articles in list view */}
              <div className="space-y-6">
                {remainingBlogs.map((blog, index) => (
                  <HorizontalBlogCard key={blog.id} blog={blog} index={index} />
                ))}
              </div>
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </section>
    </SiteLayout>
  )
}
