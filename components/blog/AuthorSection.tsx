'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

interface Author {
  id: string
  name: string
  avatar?: string
  bio?: string
}

interface AuthorSectionProps {
  author?: Author
  publishedAt?: Date | string
  className?: string
}

function formatDate(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date)
  if (isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

export function AuthorSection({
  author,
  publishedAt,
  className = '',
}: AuthorSectionProps) {
  // If no author name provided, don't render the section at all
  if (!author?.name) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`bg-gray-50 rounded-2xl p-6 ${className}`}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {author.avatar ? (
            <div className="relative w-16 h-16 rounded-full overflow-hidden">
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              {author.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Author Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">
              {author.name}
            </h3>
            <span className="text-xs text-gray-500">Author</span>
          </div>

          {publishedAt && (
            <p className="text-sm text-gray-500 mb-2">
              Published on {formatDate(publishedAt)}
            </p>
          )}

          {author.bio && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {author.bio}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default AuthorSection
