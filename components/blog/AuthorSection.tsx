'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { User } from 'lucide-react'

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
  // Default author if not provided
  const displayAuthor = author || {
    id: 'snapgo',
    name: 'Snapgo Team',
    bio: 'The Snapgo team is dedicated to making ride-sharing accessible, affordable, and sustainable for everyone across India.',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 ${className}`}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {displayAuthor.avatar ? (
            <div className="relative w-16 h-16 rounded-full overflow-hidden">
              <Image
                src={displayAuthor.avatar}
                alt={displayAuthor.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
          )}
        </div>

        {/* Author Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {displayAuthor.name}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">Author</span>
          </div>

          {publishedAt && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Published on {formatDate(publishedAt)}
            </p>
          )}

          {displayAuthor.bio && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {displayAuthor.bio}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default AuthorSection
