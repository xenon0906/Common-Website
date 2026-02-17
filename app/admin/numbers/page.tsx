'use client'

import { useState, useEffect } from 'react'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardDescription, GlassCardContent, GlassCardFooter } from '@/components/admin/GlassCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { MicroLoader } from '@/components/admin/MicroLoader'
import { Save, Hash, DollarSign, Phone, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { animations } from '@/lib/design-tokens'

interface NumbersData {
  // Homepage Stats
  stats: {
    totalRides: number
    activeUsers: number
    cities: number
    drivers: number
  }
  // Pricing
  pricing: {
    basePrice: number
    pricePerKm: number
    pricePerMinute: number
  }
  // Contact
  contact: {
    phone: string
    email: string
    address: string
  }
}

const defaultData: NumbersData = {
  stats: {
    totalRides: 50000,
    activeUsers: 10000,
    cities: 25,
    drivers: 5000,
  },
  pricing: {
    basePrice: 30,
    pricePerKm: 8,
    pricePerMinute: 1,
  },
  contact: {
    phone: '+91 9876543210',
    email: 'support@snapgo.co.in',
    address: 'Mumbai, Maharashtra, India',
  },
}

export default function NumbersPage() {
  const [data, setData] = useState<NumbersData>(defaultData)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/numbers')
        if (res.ok) {
          const fetchedData = await res.json()
          setData(fetchedData)
        }
      } catch (err) {
        console.error('Error fetching numbers:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleStatChange = (key: keyof NumbersData['stats'], value: string) => {
    const numValue = parseInt(value) || 0
    setData((prev) => ({
      ...prev,
      stats: { ...prev.stats, [key]: numValue },
    }))
  }

  const handlePricingChange = (key: keyof NumbersData['pricing'], value: string) => {
    const numValue = parseFloat(value) || 0
    setData((prev) => ({
      ...prev,
      pricing: { ...prev.pricing, [key]: numValue },
    }))
  }

  const handleContactChange = (key: keyof NumbersData['contact'], value: string) => {
    setData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [key]: value },
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/numbers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Failed to save')

      toast({
        title: 'Numbers updated',
        description: 'All numbers have been saved successfully.',
      })
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to save numbers. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <MicroLoader size="lg" text="Loading numbers..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Numbers</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Update all editable numbers across your website from one place
        </p>
      </div>

      {/* Homepage Stats */}
      <GlassCard>
        <GlassCardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <GlassCardTitle>Homepage Statistics</GlassCardTitle>
          </div>
          <GlassCardDescription>
            The big numbers displayed on your homepage hero section
          </GlassCardDescription>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="totalRides" className="text-gray-700 dark:text-gray-300">
                Total Rides Completed
              </Label>
              <Input
                id="totalRides"
                type="number"
                value={data.stats.totalRides}
                onChange={(e) => handleStatChange('totalRides', e.target.value)}
                className={cn(
                  'bg-white/50 dark:bg-gray-800/50',
                  'border-gray-200 dark:border-gray-700',
                  animations.smooth
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activeUsers" className="text-gray-700 dark:text-gray-300">
                Active Users
              </Label>
              <Input
                id="activeUsers"
                type="number"
                value={data.stats.activeUsers}
                onChange={(e) => handleStatChange('activeUsers', e.target.value)}
                className={cn(
                  'bg-white/50 dark:bg-gray-800/50',
                  'border-gray-200 dark:border-gray-700',
                  animations.smooth
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cities" className="text-gray-700 dark:text-gray-300">
                Cities Covered
              </Label>
              <Input
                id="cities"
                type="number"
                value={data.stats.cities}
                onChange={(e) => handleStatChange('cities', e.target.value)}
                className={cn(
                  'bg-white/50 dark:bg-gray-800/50',
                  'border-gray-200 dark:border-gray-700',
                  animations.smooth
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="drivers" className="text-gray-700 dark:text-gray-300">
                Verified Drivers
              </Label>
              <Input
                id="drivers"
                type="number"
                value={data.stats.drivers}
                onChange={(e) => handleStatChange('drivers', e.target.value)}
                className={cn(
                  'bg-white/50 dark:bg-gray-800/50',
                  'border-gray-200 dark:border-gray-700',
                  animations.smooth
                )}
              />
            </div>
          </div>
        </GlassCardContent>
      </GlassCard>

      {/* Pricing Information */}
      <GlassCard>
        <GlassCardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            <GlassCardTitle>Pricing</GlassCardTitle>
          </div>
          <GlassCardDescription>
            Base pricing information displayed on the pricing page
          </GlassCardDescription>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="basePrice" className="text-gray-700 dark:text-gray-300">
                Base Price (₹)
              </Label>
              <Input
                id="basePrice"
                type="number"
                step="0.01"
                value={data.pricing.basePrice}
                onChange={(e) => handlePricingChange('basePrice', e.target.value)}
                className={cn(
                  'bg-white/50 dark:bg-gray-800/50',
                  'border-gray-200 dark:border-gray-700',
                  animations.smooth
                )}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Initial charge per ride
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricePerKm" className="text-gray-700 dark:text-gray-300">
                Price per KM (₹)
              </Label>
              <Input
                id="pricePerKm"
                type="number"
                step="0.01"
                value={data.pricing.pricePerKm}
                onChange={(e) => handlePricingChange('pricePerKm', e.target.value)}
                className={cn(
                  'bg-white/50 dark:bg-gray-800/50',
                  'border-gray-200 dark:border-gray-700',
                  animations.smooth
                )}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Per kilometer charge
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricePerMinute" className="text-gray-700 dark:text-gray-300">
                Price per Minute (₹)
              </Label>
              <Input
                id="pricePerMinute"
                type="number"
                step="0.01"
                value={data.pricing.pricePerMinute}
                onChange={(e) => handlePricingChange('pricePerMinute', e.target.value)}
                className={cn(
                  'bg-white/50 dark:bg-gray-800/50',
                  'border-gray-200 dark:border-gray-700',
                  animations.smooth
                )}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Per minute charge
              </p>
            </div>
          </div>
        </GlassCardContent>
      </GlassCard>

      {/* Contact Information */}
      <GlassCard>
        <GlassCardHeader>
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <GlassCardTitle>Contact Information</GlassCardTitle>
          </div>
          <GlassCardDescription>
            Contact details displayed in the footer and contact page
          </GlassCardDescription>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={data.contact.phone}
                onChange={(e) => handleContactChange('phone', e.target.value)}
                className={cn(
                  'bg-white/50 dark:bg-gray-800/50',
                  'border-gray-200 dark:border-gray-700',
                  animations.smooth
                )}
                placeholder="+91 9876543210"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={data.contact.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
                className={cn(
                  'bg-white/50 dark:bg-gray-800/50',
                  'border-gray-200 dark:border-gray-700',
                  animations.smooth
                )}
                placeholder="support@snapgo.co.in"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-gray-700 dark:text-gray-300">
                Office Address
              </Label>
              <Input
                id="address"
                type="text"
                value={data.contact.address}
                onChange={(e) => handleContactChange('address', e.target.value)}
                className={cn(
                  'bg-white/50 dark:bg-gray-800/50',
                  'border-gray-200 dark:border-gray-700',
                  animations.smooth
                )}
                placeholder="Mumbai, Maharashtra, India"
              />
            </div>
          </div>
        </GlassCardContent>
        <GlassCardFooter>
          <Button
            onClick={handleSave}
            disabled={saving}
            className={cn(
              'bg-teal-600 hover:bg-teal-700 text-white',
              animations.smooth
            )}
          >
            {saving ? (
              <>
                <MicroLoader size="sm" className="mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save All Changes
              </>
            )}
          </Button>
        </GlassCardFooter>
      </GlassCard>
    </div>
  )
}
