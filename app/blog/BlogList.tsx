'use client'

import { useRef, useState, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { Calendar, Clock, ArrowRight, BookOpen, TrendingUp } from 'lucide-react'
import { CategoryFilter } from './components/CategoryFilter'

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  imageUrl: string | null
  createdAt: Date | string
  category?: string
  categoryName?: string
  categoryColor?: string
  tags?: string[]
  readingTime?: number
}

interface Category {
  id: string
  name: string
  slug: string
  color?: string
}

function formatDate(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date)
  if (isNaN(d.getTime())) return 'N/A'
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

function estimateReadTime(excerpt: string | null, readingTime?: number): string {
  if (readingTime) return `${readingTime} min`
  const words = excerpt?.split(' ').length || 100
  const minutes = Math.ceil(words / 200) + 3
  return `${minutes} min`
}

// Category info helper - uses blog's categoryName and categoryColor if available
function getCategoryInfo(blog: Blog) {
  if (!blog.category || !blog.categoryName) return null
  return {
    id: blog.category,
    name: blog.categoryName,
    color: blog.categoryColor || 'bg-primary',
  }
}

// Hero section
function BlogHero({ onScrollDown }: { onScrollDown: () => void }) {
  return (
    <section className="hero-viewport bg-gradient-to-br from-primary via-primary/90 to-primary-800">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title */}
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 flex items-center justify-center gap-2 xs:gap-3 sm:gap-4 md:gap-5 flex-wrap">
            <span>Latest from</span>
            <Image
              src="/images/logo/Snapgo Logo White.png"
              alt="Snapgo"
              width={200}
              height={50}
              className="object-contain h-[40px] xs:h-[47px] sm:h-[59px] md:h-[73px] lg:h-[87px] xl:h-[100px] w-auto translate-y-[10px] xs:translate-y-[12px] sm:translate-y-[18px] md:translate-y-[22px] lg:translate-y-[26px] xl:translate-y-[30px]"
            />
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8 sm:mb-12 mt-4 sm:mt-6 md:mt-8">
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
  const category = getCategoryInfo(blog)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <Link href={`/blog/${blog.slug}`} className="group block">
        <div className="relative grid md:grid-cols-5 gap-10 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 p-8">
          {/* Image */}
          <div className="relative md:col-span-2 h-72 md:h-full min-h-[300px] overflow-hidden rounded-xl">
            {blog.imageUrl ? (
              <Image
                src={blog.imageUrl}
                alt={blog.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                unoptimized={blog.imageUrl.startsWith('/uploads/')}
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
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
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-primary text-white border-0 shadow-lg">
                <TrendingUp className="w-3 h-3 mr-1" />
                Featured
              </Badge>
              {category && (
                <Badge className={`${category.color} text-white border-0 shadow-lg`}>
                  {category.name}
                </Badge>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3 flex flex-col justify-center">
            {/* Category badge */}
            {category && (
              <div className="mb-3">
                <Badge className={`${category.color} text-white border-0 text-xs uppercase tracking-wide`}>
                  {category.name}
                </Badge>
              </div>
            )}

            {/* Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight group-hover:text-primary transition-colors line-clamp-3">
              {blog.title}
            </h2>

            {/* Excerpt */}
            {blog.excerpt && (
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed">
                {blog.excerpt}
              </p>
            )}

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(blog.createdAt)}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {estimateReadTime(blog.excerpt, blog.readingTime)} read
              </span>
            </div>

            {/* Read more */}
            <motion.div
              className="inline-flex items-center gap-2 text-primary font-medium text-sm mt-2"
              whileHover={{ x: 5 }}
            >
              Continue reading
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// Blog card for grid
function BlogCard({ blog, index }: { blog: Blog; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const category = getCategoryInfo(blog)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/blog/${blog.slug}`} className="group block h-full">
        <article className="h-full flex flex-col bg-white dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700">
          {/* Image */}
          <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-800">
            {blog.imageUrl ? (
              <Image
                src={blog.imageUrl}
                alt={blog.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized={blog.imageUrl.startsWith('/uploads/')}
                loading={index < 6 ? 'eager' : 'lazy'}
                priority={index < 3}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-teal flex items-center justify-center">
                <span className="text-4xl font-bold text-white/30">
                  {blog.title.charAt(0)}
                </span>
              </div>
            )}

            {/* Category badge */}
            {category && (
              <div className="absolute top-3 left-3">
                <Badge className={`${category.color} text-white border-0 shadow-md text-xs`}>
                  {category.name}
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col p-6">
            {/* Category badge */}
            {category && (
              <div className="mb-3">
                <Badge className={`${category.color} text-white border-0 text-xs uppercase tracking-wide`}>
                  {category.name}
                </Badge>
              </div>
            )}

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {blog.title}
            </h3>

            {/* Excerpt */}
            {blog.excerpt && (
              <p className="text-gray-600 dark:text-gray-400 text-base line-clamp-3 mb-4 flex-1 leading-relaxed">
                {blog.excerpt}
              </p>
            )}

            {/* Meta */}
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-800">
              <span>{formatDate(blog.createdAt)}</span>
              <span>·</span>
              <span>{estimateReadTime(blog.excerpt, blog.readingTime)} read</span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}

// Empty state
function EmptyState({ filtered }: { filtered?: boolean }) {
  return (
    <div className="text-center py-20">
      <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
        <BookOpen className="w-10 h-10 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {filtered ? 'No articles in this category' : 'No articles yet'}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
        {filtered
          ? 'Try selecting a different category or check back later for new content.'
          : "We're working on some great content. Check back soon for tips on saving money, ride-sharing stories, and more!"}
      </p>
    </div>
  )
}

export function BlogList({ blogs }: { blogs: Blog[] }) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Filter blogs by category
  const filteredBlogs = useMemo(() => {
    if (!selectedCategory) return blogs
    return blogs.filter((blog) => blog.category === selectedCategory)
  }, [blogs, selectedCategory])

  const featuredBlog = filteredBlogs[0]
  const remainingBlogs = filteredBlogs.slice(1)

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <SiteLayout>
      <BlogHero onScrollDown={scrollToContent} />

      {/* Blog Content */}
      <section ref={contentRef} className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto">
            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </motion.div>

            {filteredBlogs.length > 0 ? (
              <>
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
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      More Articles
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({remainingBlogs.length})
                    </span>
                  </motion.div>
                )}

                {/* Blog grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {remainingBlogs.map((blog, index) => (
                    <BlogCard key={blog.id} blog={blog} index={index} />
                  ))}
                </div>
              </>
            ) : (
              <EmptyState filtered={selectedCategory !== null} />
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
