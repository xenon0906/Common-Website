import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-auth'

// Default settings structure (used for initial seeding)
const DEFAULT_SETTINGS = {
  site: {
    name: 'Snapgo',
    legalName: 'Snapgo Service Private Limited',
    tagline: 'Share Rides, Save Money, Travel Together',
    description: 'Connect with people going to the same destination. Save up to 75% on cab fares while making your journey safer and eco-friendly.',
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
  apps: {
    androidUrl: 'https://play.google.com/store/apps/details?id=com.snapgo.app',
    iosUrl: 'https://apps.apple.com/app/snapgo/id6739696498',
    androidLive: true,
    iosLive: true,
  },
  theme: {
    primaryColor: '#0066B3',
    accentColor: '#0d9488',
    backgroundColor: '#ffffff',
    cardColor: '#f9fafb',
    mode: 'light',
  },
  images: {
    logo: '/images/logo/Snapgo%20Logo%20White.png',
    logoDark: '/images/logo/Snapgo%20Logo%20White.png',
    heroBackground: '',
    favicon: '/images/logo/Snapgo%20Logo%20White.png',
  },
}

// Convert flat key-value database records to nested object
function dbToNested(records: { key: string; value: string; category: string }[]): Record<string, any> {
  const result: Record<string, any> = {}

  for (const record of records) {
    const { category, key, value } = record

    if (!result[category]) {
      result[category] = {}
    }

    try {
      result[category][key] = JSON.parse(value)
    } catch {
      result[category][key] = value
    }
  }

  return result
}

// Convert nested object to flat key-value pairs for database
function nestedToFlat(obj: Record<string, any>): { category: string; key: string; value: string }[] {
  const pairs: { category: string; key: string; value: string }[] = []

  for (const [category, values] of Object.entries(obj)) {
    if (typeof values === 'object' && values !== null && !Array.isArray(values)) {
      for (const [key, value] of Object.entries(values)) {
        pairs.push({
          category,
          key,
          value: JSON.stringify(value),
        })
      }
    } else {
      // Handle top-level arrays/primitives
      pairs.push({
        category: 'general',
        key: category,
        value: JSON.stringify(values),
      })
    }
  }

  return pairs
}

// Load settings from database, merge with defaults
async function loadSettings(): Promise<Record<string, any>> {
  try {
    const records = await prisma.siteSettings.findMany()

    if (records.length === 0) {
      // No settings in DB, seed with defaults
      await seedDefaultSettings()
      return DEFAULT_SETTINGS
    }

    const dbSettings = dbToNested(records)

    // Merge with defaults to ensure all keys exist
    return deepMerge(DEFAULT_SETTINGS, dbSettings)
  } catch (error) {
    console.error('Error loading settings from database:', error)
    return DEFAULT_SETTINGS
  }
}

// Deep merge objects
function deepMerge(target: any, source: any): any {
  const result = { ...target }

  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key])
    } else {
      result[key] = source[key]
    }
  }

  return result
}

// Seed default settings to database
async function seedDefaultSettings() {
  const pairs = nestedToFlat(DEFAULT_SETTINGS)

  for (const pair of pairs) {
    const settingKey = `${pair.category}.${pair.key}`
    await prisma.siteSettings.upsert({
      where: { key: settingKey },
      update: { value: pair.value, category: pair.category },
      create: { key: settingKey, value: pair.value, category: pair.category },
    })
  }
}

// Save settings to database
async function saveSettings(settings: Record<string, any>): Promise<boolean> {
  try {
    const pairs = nestedToFlat(settings)

    for (const pair of pairs) {
      const settingKey = `${pair.category}.${pair.key}`
      await prisma.siteSettings.upsert({
        where: { key: settingKey },
        update: { value: pair.value, category: pair.category },
        create: { key: settingKey, value: pair.value, category: pair.category },
      })
    }

    return true
  } catch (error) {
    console.error('Error saving settings to database:', error)
    return false
  }
}

// GET - Fetch all settings (public for frontend consumption)
export async function GET() {
  try {
    const settings = await loadSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// POST - Save all settings (requires auth)
export async function POST(request: NextRequest) {
  // Require admin authentication
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const newSettings = await request.json()
    const currentSettings = await loadSettings()

    // Merge new settings with current settings
    const mergedSettings = deepMerge(currentSettings, newSettings)

    const success = await saveSettings(mergedSettings)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save settings' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
      settings: mergedSettings,
    })
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    )
  }
}

// PUT - Update specific setting (requires auth)
export async function PUT(request: NextRequest) {
  // Require admin authentication
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const { category, key, value } = await request.json()

    if (!category || !key) {
      return NextResponse.json(
        { error: 'Category and key are required' },
        { status: 400 }
      )
    }

    const settingKey = `${category}.${key}`

    await prisma.siteSettings.upsert({
      where: { key: settingKey },
      update: { value: JSON.stringify(value), category },
      create: { key: settingKey, value: JSON.stringify(value), category },
    })

    return NextResponse.json({
      success: true,
      message: 'Setting updated successfully',
    })
  } catch (error) {
    console.error('Error updating setting:', error)
    return NextResponse.json(
      { error: 'Failed to update setting' },
      { status: 500 }
    )
  }
}
