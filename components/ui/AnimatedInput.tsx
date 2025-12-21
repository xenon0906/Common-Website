'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnimatedInputProps {
  id: string
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
  isValid?: boolean
  required?: boolean
  className?: string
  rows?: number
  isTextarea?: boolean
}

export function AnimatedInput({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  isValid = false,
  required = false,
  className,
  rows = 4,
  isTextarea = false,
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(!!value)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    setHasValue(!!value)
  }, [value])

  const showFloatingLabel = isFocused || hasValue

  const InputComponent = isTextarea ? 'textarea' : 'input'

  return (
    <div className={cn('relative', className)}>
      {/* Floating Label */}
      <motion.label
        htmlFor={id}
        className={cn(
          'absolute left-4 pointer-events-none transition-colors duration-200 z-10',
          showFloatingLabel
            ? 'text-xs font-medium'
            : 'text-base text-gray-500',
          isFocused && !error && 'text-primary',
          error && 'text-red-500',
          isValid && !error && 'text-teal-500'
        )}
        initial={false}
        animate={{
          y: showFloatingLabel ? -12 : isTextarea ? 16 : 20,
          x: showFloatingLabel ? -4 : 0,
          scale: showFloatingLabel ? 0.85 : 1,
        }}
        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <span className="relative">
          {showFloatingLabel && (
            <motion.span
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              className="absolute inset-0 -inset-x-2 bg-white"
              style={{ zIndex: -1 }}
            />
          )}
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </span>
      </motion.label>

      {/* Input Container */}
      <div className="relative">
        <InputComponent
          ref={inputRef as any}
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused ? placeholder : ''}
          rows={isTextarea ? rows : undefined}
          className={cn(
            'w-full px-4 pt-6 pb-3 rounded-xl border-2 bg-white transition-all duration-300 outline-none',
            'text-gray-900 placeholder:text-gray-400',
            isTextarea ? 'min-h-[120px] resize-none' : 'h-16',
            // Default state
            !isFocused && !error && !isValid && 'border-gray-200 hover:border-gray-300',
            // Focused state
            isFocused && !error && 'border-primary shadow-lg shadow-primary/10',
            // Error state
            error && 'border-red-400 shadow-lg shadow-red-500/10',
            // Valid state
            isValid && !error && !isFocused && 'border-teal-400',
          )}
        />

        {/* Validation Icons */}
        <AnimatePresence mode="wait">
          {(isValid || error) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className={cn(
                'absolute right-4 top-1/2 -translate-y-1/2',
                isTextarea && 'top-8'
              )}
            >
              {isValid && !error ? (
                <motion.div
                  initial={{ rotate: -90 }}
                  animate={{ rotate: 0 }}
                  className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-teal-500" />
                </motion.div>
              ) : error ? (
                <motion.div
                  animate={{ x: [0, -3, 3, -3, 3, 0] }}
                  transition={{ duration: 0.4 }}
                  className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center"
                >
                  <AlertCircle className="w-4 h-4 text-red-500" />
                </motion.div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Focus glow ring */}
        <motion.div
          className={cn(
            'absolute inset-0 rounded-xl pointer-events-none',
            isFocused && !error && 'ring-4 ring-primary/20',
            error && 'ring-4 ring-red-500/20',
            isValid && !error && !isFocused && 'ring-2 ring-teal-400/20'
          )}
          initial={false}
          animate={{ opacity: isFocused ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="text-sm text-red-500 mt-2 flex items-center gap-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// Confetti burst animation component
interface ConfettiBurstProps {
  isActive: boolean
}

export function ConfettiBurst({ isActive }: ConfettiBurstProps) {
  const colors = ['#0066B3', '#0d9488', '#7c3aed', '#f59e0b', '#10b981']
  const particles = Array.from({ length: 50 })

  if (!isActive) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((_, i) => {
        const angle = (i / particles.length) * 360
        const velocity = 200 + Math.random() * 200
        const size = 4 + Math.random() * 8
        const color = colors[Math.floor(Math.random() * colors.length)]

        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: size,
              height: size,
              backgroundColor: color,
            }}
            initial={{
              x: 0,
              y: 0,
              scale: 1,
              opacity: 1,
            }}
            animate={{
              x: Math.cos((angle * Math.PI) / 180) * velocity,
              y: Math.sin((angle * Math.PI) / 180) * velocity + 200,
              scale: 0,
              opacity: 0,
            }}
            transition={{
              duration: 1 + Math.random() * 0.5,
              ease: 'easeOut',
            }}
          />
        )
      })}
    </div>
  )
}

// Success checkmark animation
export function SuccessCheckmark() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mx-auto"
    >
      <motion.svg
        viewBox="0 0 50 50"
        className="w-10 h-10 text-teal-500"
      >
        <motion.path
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 27 L 22 35 L 38 16"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
        />
      </motion.svg>
    </motion.div>
  )
}
