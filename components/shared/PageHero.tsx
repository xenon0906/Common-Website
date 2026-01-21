'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { ReactNode } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface TrustBadge {
  label: string
  variant?: 'primary' | 'teal'
}

interface CTAButton {
  label: string
  href: string
  variant?: 'gradient' | 'outline'
}

interface PageHeroProps {
  badge: string
  title: string
  titleHighlight?: string
  description: string
  icon?: ReactNode
  trustBadges?: TrustBadge[]
  cta?: CTAButton
  visual?: ReactNode
}

export function PageHero({
  badge,
  title,
  titleHighlight,
  description,
  icon,
  trustBadges,
  cta,
  visual,
}: PageHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)

  // Parallax scroll effects - snappier
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  })

  // Smooth parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 30])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // Snappier spring
  const smoothBackgroundY = useSpring(backgroundY, { stiffness: 150, damping: 25 })
  const smoothContentY = useSpring(contentY, { stiffness: 150, damping: 25 })

  return (
    <section ref={sectionRef} className="pt-24 pb-12 md:pt-28 md:pb-16 bg-white relative overflow-hidden">
      {/* Subtle decorative elements */}
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ y: smoothBackgroundY }}
      >
        {/* Very subtle blue accent blob */}
        <motion.div
          className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]"
          animate={{ scale: [1, 1.1, 1], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-primary/3 blur-[80px]"
          animate={{ scale: [1.05, 1, 1.05], y: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <motion.div
        className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 text-center relative z-10"
        style={{ y: smoothContentY, opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
          className="max-w-3xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4"
          >
            {icon || <Sparkles className="w-4 h-4 text-primary" />}
            <span className="text-sm font-semibold text-primary">{badge}</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-foreground"
          >
            {title}
            {titleHighlight && (
              <span className="block text-primary">{titleHighlight}</span>
            )}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            {description}
          </motion.p>

          {/* Trust Badges */}
          {trustBadges && trustBadges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
              className="flex flex-wrap items-center justify-center gap-3 mt-6"
            >
              {trustBadges.map((trustBadge, index) => (
                <span
                  key={index}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                    trustBadge.variant === 'teal'
                      ? 'bg-teal-500/10 text-teal-600 border border-teal-500/20'
                      : 'bg-primary/10 text-primary border border-primary/20'
                  }`}
                >
                  {trustBadge.label}
                </span>
              ))}
            </motion.div>
          )}

          {/* CTA Button */}
          {cta && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
              className="mt-8"
            >
              <Button variant={cta.variant || 'gradient'} size="lg" asChild>
                <Link href={cta.href}>{cta.label}</Link>
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Optional Visual Element */}
        {visual && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            className="mt-10"
          >
            {visual}
          </motion.div>
        )}
      </motion.div>

      {/* Bottom fade to blend with next section */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
