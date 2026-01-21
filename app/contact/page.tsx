'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { z } from 'zod'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { AnimatedInput, ConfettiBurst, SuccessCheckmark } from '@/components/ui/AnimatedInput'
import { Button } from '@/components/ui/button'
import { SITE_CONFIG } from '@/lib/constants'
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Sparkles,
} from 'lucide-react'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

// Clean hero with embedded form - no rotating rings
function ContactHero() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateField = (field: keyof ContactFormData, value: string) => {
    try {
      contactSchema.shape[field].parse(value)
      setErrors((prev) => ({ ...prev, [field]: '' }))
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [field]: error.errors[0].message }))
      }
      return false
    }
  }

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (touched[field]) {
      validateField(field, value)
    }
  }

  const handleBlur = (field: keyof ContactFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    validateField(field, formData[field])
  }

  const isFieldValid = (field: keyof ContactFormData) => {
    if (!touched[field] || !formData[field]) return false
    try {
      contactSchema.shape[field].parse(formData[field])
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let isValid = true
    const fields: (keyof ContactFormData)[] = ['name', 'email', 'subject', 'message']
    fields.forEach((field) => {
      setTouched((prev) => ({ ...prev, [field]: true }))
      if (!validateField(field, formData[field])) {
        isValid = false
      }
    })

    if (!isValid) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setIsSubmitted(true)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
    } catch (error) {
      console.error('Form submission error:', error)
      setErrors((prev) => ({
        ...prev,
        submit: error instanceof Error ? error.message : 'Failed to send message. Please try again.'
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: '', email: '', subject: '', message: '' })
    setErrors({})
    setTouched({})
    setIsSubmitted(false)
  }

  const contactInfo = [
    { icon: Mail, label: 'Email', value: SITE_CONFIG.email },
    { icon: Phone, label: 'Phone', value: SITE_CONFIG.phone },
    { icon: MapPin, label: 'Location', value: 'Greater Noida, UP' },
  ]

  return (
    <section className="hero-viewport bg-gradient-to-br from-slate-900 to-primary">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Contact Info */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Get in <span className="text-teal-400">Touch</span>
            </h1>

            <p className="text-lg text-white/70 mb-10 max-w-md mx-auto lg:mx-0">
              Have questions? We'd love to hear from you. Send us a message and we'll respond within 24 hours.
            </p>

            {/* Contact info - simple text list */}
            <div className="space-y-6 max-w-md mx-auto lg:mx-0">
              {contactInfo.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">{item.label}</p>
                      <p className="text-white font-medium">{item.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right - Form embedded in hero */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl">
            {isSubmitted ? (
              <div className="text-center py-8">
                <SuccessCheckmark />
                <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-2">Message Sent!</h3>
                <p className="text-gray-600 mb-6">We'll get back to you within 24 hours.</p>
                <Button variant="outline" onClick={resetForm}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatedInput
                  id="name"
                  label="Your Name"
                  value={formData.name}
                  onChange={(value) => handleChange('name', value)}
                  error={touched.name ? errors.name : undefined}
                  isValid={isFieldValid('name')}
                  required
                />

                <AnimatedInput
                  id="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(value) => handleChange('email', value)}
                  error={touched.email ? errors.email : undefined}
                  isValid={isFieldValid('email')}
                  required
                />

                <AnimatedInput
                  id="subject"
                  label="Subject"
                  value={formData.subject}
                  onChange={(value) => handleChange('subject', value)}
                  error={touched.subject ? errors.subject : undefined}
                  isValid={isFieldValid('subject')}
                  required
                />

                <AnimatedInput
                  id="message"
                  label="Your Message"
                  value={formData.message}
                  onChange={(value) => handleChange('message', value)}
                  error={touched.message ? errors.message : undefined}
                  isValid={isFieldValid('message')}
                  isTextarea
                  rows={4}
                  required
                />

                {errors.submit && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {errors.submit}
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
      <ConfettiBurst isActive={showConfetti} />
    </section>
  )
}


// Company info section
function CompanyInfo() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="section-padding-sm bg-gradient-to-br from-primary via-primary/90 to-teal/80">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-md mb-6"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>

          <h3 className="text-2xl font-bold text-white mb-2">
            {SITE_CONFIG.legalName}
          </h3>
          <p className="text-white/70 mb-6">
            Officially registered and recognized by the Government of India under the Startup India initiative
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {['DPIIT Certified', 'Startup India', 'ISO Compliant'].map((badge, index) => (
              <motion.span
                key={badge}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm border border-white/10"
              >
                {badge}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default function ContactPage() {
  return (
    <SiteLayout>
      <ContactHero />
      <CompanyInfo />
    </SiteLayout>
  )
}
