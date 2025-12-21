'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Linkedin, Twitter, Mail, User, Quote } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface TeamMember {
  id?: string
  name: string
  role?: string
  bio?: string | null
  details?: string | null
  quote?: string | null
  imageUrl?: string | null
  portraitUrl?: string | null
  email?: string | null
  linkedin?: string | null
  twitter?: string | null
  order: number
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const gradients = [
  'from-primary via-primary/80 to-teal-500',
  'from-teal-500 via-teal-600 to-primary',
  'from-violet-500 via-purple-600 to-primary',
  'from-primary via-blue-600 to-teal-400',
  'from-teal-600 via-cyan-500 to-primary',
  'from-indigo-500 via-purple-500 to-teal-500',
]

// Individual editorial card with unique styling based on layout position
interface EditorialCardProps {
  member: TeamMember
  index: number
  layout: 'large' | 'medium' | 'small' | 'wide'
  className?: string
}

function EditorialCard({ member, index, layout, className }: EditorialCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const isInView = useInView(cardRef, { once: true, margin: '-50px' })

  // Parallax effect for images
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [30, -30])

  const aspectRatios = {
    large: 'aspect-[4/5]',
    medium: 'aspect-[3/4]',
    small: 'aspect-square',
    wide: 'aspect-[16/9]',
  }

  const gradient = gradients[index % gradients.length]

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        'relative overflow-hidden rounded-2xl cursor-pointer group',
        aspectRatios[layout],
        className
      )}
    >
      {/* Background with parallax */}
      <motion.div className="absolute inset-0" style={{ y }}>
        {member.portraitUrl ? (
          <Image
            src={member.portraitUrl}
            alt={member.name}
            fill
            className={cn(
              'object-cover transition-transform duration-700',
              isHovered && 'scale-110'
            )}
          />
        ) : (
          <div
            className={cn(
              'w-full h-full bg-gradient-to-br flex flex-col items-center justify-center',
              gradient
            )}
          >
            <span className="text-6xl md:text-8xl font-bold text-white/30 mb-4">
              {getInitials(member.name)}
            </span>
            <User className="w-16 h-16 text-white/20" />
          </div>
        )}
      </motion.div>

      {/* Gradient overlay - always visible, intensifies on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"
        initial={{ opacity: 0.4 }}
        animate={{ opacity: isHovered ? 0.9 : 0.5 }}
        transition={{ duration: 0.3 }}
      />

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
        {/* Name - always visible */}
        <motion.h3
          className={cn(
            'font-bold text-white drop-shadow-lg',
            layout === 'large' ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'
          )}
          animate={{ y: isHovered ? -10 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {member.name}
        </motion.h3>

        {/* Role - visible on hover or always for large cards */}
        <motion.p
          className="text-white/80 text-sm md:text-base mt-1"
          initial={{ opacity: layout === 'large' ? 1 : 0, y: 10 }}
          animate={{
            opacity: isHovered || layout === 'large' ? 1 : 0,
            y: isHovered || layout === 'large' ? 0 : 10,
          }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          {member.role || 'Team Member'}
        </motion.p>

        {/* Quote - slides up on hover */}
        <motion.div
          className="mt-4 flex items-start gap-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 30 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Quote className="w-4 h-4 text-teal-400 flex-shrink-0 mt-1" />
          <p className="text-white/70 text-sm italic line-clamp-3">
            {member.quote || member.details || member.bio || 'Passionate about transforming urban mobility.'}
          </p>
        </motion.div>

        {/* Social links - appear on hover */}
        <motion.div
          className="flex items-center gap-3 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          {member.email && (
            <motion.a
              href={`mailto:${member.email}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-colors"
            >
              <Mail className="w-4 h-4" />
            </motion.a>
          )}
          {member.linkedin && (
            <motion.a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#0077B5] transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </motion.a>
          )}
          {member.twitter && (
            <motion.a
              href={member.twitter}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#1DA1F2] transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </motion.a>
          )}
        </motion.div>
      </div>

      {/* Index number - editorial style */}
      <motion.div
        className="absolute top-4 right-4 md:top-6 md:right-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: index * 0.1 + 0.3 }}
      >
        <span className="text-4xl md:text-5xl font-bold text-white/10">
          {String(index + 1).padStart(2, '0')}
        </span>
      </motion.div>
    </motion.div>
  )
}

interface EditorialTeamGridProps {
  members: TeamMember[]
}

export function EditorialTeamGrid({ members }: EditorialTeamGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  // Generate layout patterns for groups of members
  const getLayoutPattern = (groupIndex: number): ('large' | 'medium' | 'small' | 'wide')[] => {
    const patterns = [
      ['large', 'medium', 'medium'],      // Row 1: 60% + 40%
      ['medium', 'large'],                // Row 2: 40% + 60%
      ['medium', 'medium', 'medium'],     // Row 3: 33% + 33% + 33%
      ['wide', 'small', 'small'],         // Row 4: Wide + two small
    ]
    return patterns[groupIndex % patterns.length] as ('large' | 'medium' | 'small' | 'wide')[]
  }

  // Group members into rows
  const rows: { member: TeamMember; layout: 'large' | 'medium' | 'small' | 'wide'; index: number }[][] = []
  let currentIndex = 0

  for (let i = 0; members && currentIndex < members.length; i++) {
    const pattern = getLayoutPattern(i)
    const row: { member: TeamMember; layout: 'large' | 'medium' | 'small' | 'wide'; index: number }[] = []

    for (const layout of pattern) {
      if (currentIndex < members.length) {
        row.push({
          member: members[currentIndex],
          layout,
          index: currentIndex,
        })
        currentIndex++
      }
    }

    if (row.length > 0) {
      rows.push(row)
    }
  }

  return (
    <div ref={containerRef} className="space-y-6 md:space-y-8">
      {rows.map((row, rowIndex) => {
        // Different grid layouts for each row pattern
        const rowLength = row.length
        let gridClass = 'grid gap-6 md:gap-8'

        if (rowLength === 3 && row[0].layout === 'large') {
          // 60% + 20% + 20%
          gridClass += ' grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr]'
        } else if (rowLength === 2 && row[0].layout === 'medium' && row[1].layout === 'large') {
          // 40% + 60%
          gridClass += ' grid-cols-1 md:grid-cols-[1fr_1.5fr]'
        } else if (rowLength === 2 && row[0].layout === 'large') {
          // 60% + 40%
          gridClass += ' grid-cols-1 md:grid-cols-[1.5fr_1fr]'
        } else if (rowLength === 3 && row[0].layout === 'medium') {
          // Equal thirds
          gridClass += ' grid-cols-1 md:grid-cols-3'
        } else if (rowLength === 3 && row[0].layout === 'wide') {
          // Wide + two stacked
          gridClass += ' grid-cols-1 md:grid-cols-[2fr_1fr]'
        } else {
          // Default equal columns
          gridClass += ` grid-cols-1 md:grid-cols-${Math.min(rowLength, 3)}`
        }

        return (
          <motion.div
            key={rowIndex}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: rowIndex * 0.2 }}
            className={gridClass}
          >
            {row.map((item, itemIndex) => {
              // Special handling for wide + small pattern
              if (row.length === 3 && row[0].layout === 'wide' && itemIndex > 0) {
                if (itemIndex === 1) {
                  return (
                    <div key={item.index} className="flex flex-col gap-6 md:gap-8">
                      <EditorialCard
                        member={item.member}
                        index={item.index}
                        layout={item.layout}
                      />
                      {row[2] && (
                        <EditorialCard
                          member={row[2].member}
                          index={row[2].index}
                          layout={row[2].layout}
                        />
                      )}
                    </div>
                  )
                }
                return null // Already handled in the stacked column
              }

              return (
                <EditorialCard
                  key={item.index}
                  member={item.member}
                  index={item.index}
                  layout={item.layout}
                />
              )
            })}
          </motion.div>
        )
      })}
    </div>
  )
}

// Hero section with featured team member
export function TeamHeroSection({ featuredMember }: { featuredMember?: TeamMember }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  return (
    <motion.section
      ref={containerRef}
      style={{ opacity, scale }}
      className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-primary/20"
    >
      <motion.div style={{ y }} className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
        >
          The Minds Behind{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-primary-300">
            Snapgo
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl text-white/70 max-w-2xl mx-auto"
        >
          A passionate team dedicated to transforming urban mobility in India. Together, we're building a more connected and sustainable future.
        </motion.p>
      </motion.div>
    </motion.section>
  )
}
