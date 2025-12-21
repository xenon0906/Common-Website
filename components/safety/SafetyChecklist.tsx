'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Shield,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  MessageCircle,
  History,
  Clock,
  Lock,
  Check,
  Sparkles,
  LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SafetyItem {
  id: string
  icon: LucideIcon
  title: string
  description: string
  color: string
}

const safetyItems: SafetyItem[] = [
  {
    id: 'kyc',
    icon: ShieldCheck,
    title: 'Aadhaar KYC Verification',
    description: 'All users verified via government ID',
    color: 'from-teal-500 to-emerald-500',
  },
  {
    id: 'female',
    icon: UserCheck,
    title: 'Female-Only Option',
    description: 'Women can ride with verified women only',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'sos',
    icon: AlertTriangle,
    title: 'Emergency SOS',
    description: 'One-tap emergency alert system',
    color: 'from-red-500 to-orange-500',
  },
  {
    id: 'chat',
    icon: MessageCircle,
    title: 'Chat Records',
    description: 'All conversations saved securely',
    color: 'from-primary to-blue-500',
  },
  {
    id: 'history',
    icon: History,
    title: 'Trip History',
    description: 'Complete record of all rides',
    color: 'from-violet-500 to-purple-500',
  },
  {
    id: 'support',
    icon: Clock,
    title: '24-Hour Support',
    description: 'Round-the-clock assistance',
    color: 'from-cyan-500 to-teal-500',
  },
  {
    id: 'privacy',
    icon: Lock,
    title: 'Data Privacy',
    description: 'Encrypted personal information',
    color: 'from-indigo-500 to-primary',
  },
  {
    id: 'verified',
    icon: Shield,
    title: 'Verified Platform',
    description: 'DPIIT recognized startup',
    color: 'from-amber-500 to-orange-500',
  },
]

// Individual checklist item
interface ChecklistItemProps {
  item: SafetyItem
  index: number
  isChecked: boolean
  onCheck: () => void
}

function ChecklistItem({ item, index, isChecked, onCheck }: ChecklistItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const Icon = item.icon

  // Auto-check when scrolled into view
  useEffect(() => {
    if (isInView && !isChecked) {
      const timer = setTimeout(() => {
        onCheck()
      }, index * 200 + 500)
      return () => clearTimeout(timer)
    }
  }, [isInView, isChecked, onCheck, index])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onClick={onCheck}
      className="group cursor-pointer"
    >
      <div
        className={cn(
          'relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300',
          'border-2 bg-white',
          isChecked
            ? 'border-teal-400 shadow-lg shadow-teal-500/10'
            : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
        )}
      >
        {/* Checkbox */}
        <motion.div
          className={cn(
            'relative w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300',
            isChecked ? 'bg-teal-500' : 'bg-gray-100 group-hover:bg-gray-200'
          )}
          animate={isChecked ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {isChecked ? (
              <motion.div
                key="check"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Check className="w-5 h-5 text-white" strokeWidth={3} />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                className="w-4 h-4 border-2 border-gray-400 rounded"
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Icon */}
        <motion.div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br shadow-lg',
            item.color
          )}
          animate={isChecked ? { rotate: [0, 10, -10, 0] } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              'font-semibold text-gray-900 transition-colors',
              isChecked && 'text-teal-700'
            )}
          >
            {item.title}
          </h3>
          <p className="text-sm text-gray-500">{item.description}</p>
        </div>

        {/* Checked indicator line */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-teal-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: isChecked ? '100%' : 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      </div>
    </motion.div>
  )
}

// Progress bar component
interface ProgressBarProps {
  progress: number
  total: number
}

function ProgressBar({ progress, total }: ProgressBarProps) {
  const percentage = (progress / total) * 100
  const isComplete = progress === total

  return (
    <div className="sticky top-24 z-20 mb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Shield className={cn('w-5 h-5', isComplete ? 'text-teal-500' : 'text-gray-400')} />
            <span className="font-medium text-gray-900">Safety Checklist</span>
          </div>
          <span className={cn('text-sm font-semibold', isComplete ? 'text-teal-500' : 'text-gray-500')}>
            {progress} / {total}
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className={cn(
              'h-full rounded-full',
              isComplete
                ? 'bg-gradient-to-r from-teal-500 to-emerald-400'
                : 'bg-gradient-to-r from-primary to-teal-500'
            )}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        {isComplete && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-teal-600 text-sm font-medium mt-2"
          >
            All safety features verified!
          </motion.p>
        )}
      </motion.div>
    </div>
  )
}

// Celebration animation
function CelebrationAnimation({ isActive }: { isActive: boolean }) {
  const sparkles = Array.from({ length: 20 })

  if (!isActive) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {sparkles.map((_, i) => {
        const delay = Math.random() * 0.5
        const x = Math.random() * window.innerWidth
        const size = 8 + Math.random() * 16

        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: x, top: -20 }}
            initial={{ y: 0, opacity: 1, rotate: 0 }}
            animate={{
              y: window.innerHeight + 100,
              opacity: 0,
              rotate: 360,
            }}
            transition={{
              duration: 2 + Math.random(),
              delay,
              ease: 'easeIn',
            }}
          >
            <Sparkles
              className="text-teal-500"
              style={{ width: size, height: size }}
            />
          </motion.div>
        )
      })}
    </div>
  )
}

// Main checklist component
export function SafetyChecklist() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [showCelebration, setShowCelebration] = useState(false)

  const handleCheck = (id: string) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }

      // Check if all items are now checked
      if (newSet.size === safetyItems.length && !prev.has(id)) {
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      }

      return newSet
    })
  }

  return (
    <div className="relative">
      {/* Progress bar */}
      <ProgressBar progress={checkedItems.size} total={safetyItems.length} />

      {/* Checklist items */}
      <div className="space-y-4">
        {safetyItems.map((item, index) => (
          <ChecklistItem
            key={item.id}
            item={item}
            index={index}
            isChecked={checkedItems.has(item.id)}
            onCheck={() => handleCheck(item.id)}
          />
        ))}
      </div>

      {/* Celebration */}
      <CelebrationAnimation isActive={showCelebration} />

      {/* Completion message */}
      <AnimatePresence>
        {checkedItems.size === safetyItems.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 p-6 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl text-center text-white shadow-xl"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ShieldCheck className="w-12 h-12 mx-auto mb-3" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2">You're Fully Protected!</h3>
            <p className="text-white/80">
              Snapgo has all these safety features to ensure your secure journey.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
