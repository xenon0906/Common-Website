'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface SiteSettings {
  site: {
    name: string
    legalName: string
    tagline: string
    description: string
    url: string
  }
  contact: {
    email: string
    phone: string
    address: string
  }
  social: {
    facebook: string
    instagram: string
    linkedin: string
  }
  founders: string[]
  hero: {
    headline: string
    subtext: string
  }
  stats: Array<{
    label: string
    value: number
    suffix: string
    prefix: string
  }>
  features: Array<{
    title: string
    description: string
    icon: string
  }>
  howItWorks: Array<{
    step: number
    title: string
    description: string
    icon: string
  }>
  testimonials: Array<{
    quote: string
    author: string
    location: string
  }>
  about: {
    origin: string
    spark: string
    mission: string
    vision: string
    values: string
  }
  apps: {
    androidUrl: string
    iosUrl: string
    androidLive: boolean
    iosLive: boolean
  }
}

const defaultSettings: SiteSettings = {
  site: {
    name: 'Snapgo',
    legalName: 'Snapgo Service Private Limited',
    tagline: 'Share Rides, Save Money, Travel Together',
    description: 'Connect with people going to the same destination. Save up to 75% on cab fares.',
    url: 'https://snapgo.in',
  },
  contact: {
    email: 'info@snapgo.co.in',
    phone: '+91 6398786105',
    address: 'Block 45, Sharda University, Knowledge Park 3, Greater Noida, Uttar Pradesh, India',
  },
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61578285621863',
    instagram: 'https://www.instagram.com/snapgo.co.in/',
    linkedin: 'https://www.linkedin.com/company/snapgo-service-private-limited/',
  },
  founders: ['Mohit Purohit', 'Surya Purohit'],
  hero: {
    headline: 'Revolutionizing Urban Transportation, One Shared Ride at a Time.',
    subtext: "At Snapgo, we believe that getting around your city shouldn't break the bank.",
  },
  stats: [
    { label: 'App Downloads', value: 7000, suffix: '+', prefix: '' },
    { label: 'Peak Daily Rides', value: 110, suffix: '+', prefix: '' },
    { label: 'Cost Savings', value: 75, suffix: '%', prefix: '' },
    { label: 'Active Users', value: 400, suffix: '+', prefix: '' },
  ],
  features: [],
  howItWorks: [],
  testimonials: [],
  about: {
    origin: '',
    spark: '',
    mission: '',
    vision: '',
    values: '',
  },
  apps: {
    androidUrl: 'https://play.google.com/store/apps/details?id=in.snapgo.app&hl=en_IN',
    iosUrl: 'https://apps.apple.com/in/app/snapgo-connect-split-fare/id6748761741',
    androidLive: true,
    iosLive: true,
  },
}

interface SettingsContextType {
  settings: SiteSettings
  loading: boolean
  error: string | null
  refreshSettings: () => Promise<void>
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/settings', {
        cache: 'no-store',
      })
      if (response.ok) {
        const data = await response.json()
        setSettings({ ...defaultSettings, ...data })
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err)
      setError('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        refreshSettings: fetchSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
