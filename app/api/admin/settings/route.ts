import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { getServerDb, getServerAppId, doc, getDoc } from '@/lib/firebase-server'
import { settingsSchema, updateSettingSchema, validateBody } from '@/lib/validations'

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
    androidUrl: 'https://play.google.com/store/apps/details?id=in.snapgo.app&hl=en_IN',
    iosUrl: 'https://apps.apple.com/in/app/snapgo-connect-split-fare/id6748761741',
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

async function loadSettings(): Promise<Record<string, any>> {
  try {
    const db = getServerDb()
    if (!db) return DEFAULT_SETTINGS

    const appId = getServerAppId()
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'config')
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return DEFAULT_SETTINGS
    }

    return deepMerge(DEFAULT_SETTINGS, docSnap.data())
  } catch {
    return DEFAULT_SETTINGS
  }
}

export async function GET() {
  try {
    const settings = await loadSettings()
    return NextResponse.json(settings)
  } catch {
    return NextResponse.json(DEFAULT_SETTINGS)
  }
}

export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, 'settings', { maxRequests: 10, windowMs: 10 * 60 * 1000 })
  if (rateLimited) return rateLimited

  const authError = await requireAuth()
  if (authError) return authError

  try {
    const newSettings = await request.json()
    const validation = validateBody(settingsSchema, newSettings)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }
    const db = getServerDb()
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 503 }
      )
    }

    const currentSettings = await loadSettings()
    const mergedSettings = deepMerge(currentSettings, newSettings)

    const { setDoc } = await import('firebase/firestore')
    const appId = getServerAppId()
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'config')

    await setDoc(docRef, mergedSettings, { merge: true })

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

export async function PUT(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const validation = validateBody(updateSettingSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }
    const { category, key, value } = validation.data

    const db = getServerDb()
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 503 }
      )
    }

    const { setDoc } = await import('firebase/firestore')
    const appId = getServerAppId()
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'config')

    await setDoc(docRef, { [category]: { [key]: value } }, { merge: true })

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
