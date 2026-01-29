'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface LoadingAnimationProps {
  logoUrl: string
}

export function LoadingAnimation({ logoUrl }: LoadingAnimationProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] min-h-screen bg-primary flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={logoUrl}
            alt="Snapgo"
            width={160}
            height={160}
            className="object-contain"
            priority
          />
        </motion.div>

        {/* Simple loading bar */}
        <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </motion.div>
  )
}
