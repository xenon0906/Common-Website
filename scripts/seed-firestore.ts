/**
 * Firestore Seed Script
 *
 * Seeds Firestore with default data from lib/constants.ts
 * Run with: npm run seed:firestore
 *
 * This script will:
 * 1. Clear all existing Firestore collections
 * 2. Seed fresh data from constants.ts (primary source of truth)
 * 3. Ensure all images, favicons, and content match the website
 */

import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  writeBatch
} from 'firebase/firestore'

// Import constants as source of truth
import {
  SITE_CONFIG,
  HERO_CONTENT,
  STATS,
  FEATURES,
  HOW_IT_WORKS,
  TESTIMONIALS,
  ABOUT_STORY,
  TEAM_MEMBERS,
  SAFETY_FEATURES,
  JOURNEY_TIMELINE,
  NAV_LINKS,
} from '../lib/constants'

import { DEFAULT_IMAGES } from '../lib/types/images'

// Firebase config from environment
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// App ID for path prefix
const APP_ID = process.env.NEXT_PUBLIC_APP_ID || 'default'

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Helper to get collection path with app ID
function getPath(...segments: string[]): string {
  return ['artifacts', APP_ID, 'public', 'data', ...segments].join('/')
}

// Helper to clear a collection
async function clearCollection(collectionPath: string): Promise<void> {
  const colRef = collection(db, collectionPath)
  const snapshot = await getDocs(colRef)

  const batch = writeBatch(db)
  snapshot.docs.forEach((docSnapshot) => {
    batch.delete(docSnapshot.ref)
  })

  if (snapshot.docs.length > 0) {
    await batch.commit()
    console.log(`  Cleared ${snapshot.docs.length} docs from ${collectionPath}`)
  }
}

// Seed data definitions
async function seedHeroContent(): Promise<void> {
  console.log('Seeding hero content...')
  const heroRef = doc(db, getPath('content'), 'hero')
  await setDoc(heroRef, {
    headline: HERO_CONTENT.headline,
    subtext: HERO_CONTENT.subtext,
    updatedAt: new Date().toISOString(),
  })
}

async function seedStats(): Promise<void> {
  console.log('Seeding stats...')
  const batch = writeBatch(db)

  STATS.forEach((stat, index) => {
    const statRef = doc(db, getPath('content', 'stats'), `stat_${index}`)
    batch.set(statRef, {
      ...stat,
      order: index,
      updatedAt: new Date().toISOString(),
    })
  })

  await batch.commit()
}

async function seedFeatures(): Promise<void> {
  console.log('Seeding features...')
  const batch = writeBatch(db)

  FEATURES.forEach((feature, index) => {
    const featureRef = doc(db, getPath('content', 'features'), `feature_${index}`)
    batch.set(featureRef, {
      ...feature,
      order: index,
      updatedAt: new Date().toISOString(),
    })
  })

  await batch.commit()
}

async function seedHowItWorks(): Promise<void> {
  console.log('Seeding how it works...')
  const batch = writeBatch(db)

  HOW_IT_WORKS.forEach((step, index) => {
    const stepRef = doc(db, getPath('content', 'howItWorks'), `step_${index}`)
    batch.set(stepRef, {
      ...step,
      order: index,
      updatedAt: new Date().toISOString(),
    })
  })

  await batch.commit()
}

async function seedTestimonials(): Promise<void> {
  console.log('Seeding testimonials...')
  const batch = writeBatch(db)

  TESTIMONIALS.forEach((testimonial, index) => {
    const testimonialRef = doc(db, getPath('content', 'testimonials'), `testimonial_${index}`)
    batch.set(testimonialRef, {
      ...testimonial,
      order: index,
      updatedAt: new Date().toISOString(),
    })
  })

  await batch.commit()
}

async function seedAbout(): Promise<void> {
  console.log('Seeding about content...')
  const aboutRef = doc(db, getPath('content'), 'about')
  await setDoc(aboutRef, {
    ...ABOUT_STORY,
    updatedAt: new Date().toISOString(),
  })
}

async function seedApps(): Promise<void> {
  console.log('Seeding app links...')
  const appsRef = doc(db, getPath('content'), 'apps')
  await setDoc(appsRef, {
    android: {
      url: 'https://play.google.com/store/apps/details?id=in.snapgo.app&hl=en_IN',
      isLive: true,
      qrCodeUrl: '/images/qr code/playstore-qr.png',
    },
    ios: {
      url: 'https://apps.apple.com/in/app/snapgo-connect-split-fare/id6748761741',
      isLive: true,
      qrCodeUrl: '/images/qr code/appstore-qr.png',
    },
    updatedAt: new Date().toISOString(),
  })
}

async function seedContact(): Promise<void> {
  console.log('Seeding contact info...')
  const contactRef = doc(db, getPath('content'), 'contact')
  await setDoc(contactRef, {
    email: SITE_CONFIG.email,
    phone: SITE_CONFIG.phone,
    address: SITE_CONFIG.address,
    updatedAt: new Date().toISOString(),
  })
}

async function seedSocial(): Promise<void> {
  console.log('Seeding social links...')
  const socialRef = doc(db, getPath('content'), 'social')
  await setDoc(socialRef, {
    ...SITE_CONFIG.social,
    updatedAt: new Date().toISOString(),
  })
}

async function seedImages(): Promise<void> {
  console.log('Seeding images config...')
  const imagesRef = doc(db, getPath('content'), 'images')
  await setDoc(imagesRef, {
    ...DEFAULT_IMAGES,
    updatedAt: new Date().toISOString(),
  })
}

async function seedTeam(): Promise<void> {
  console.log('Seeding team members...')
  const batch = writeBatch(db)

  TEAM_MEMBERS.forEach((member, index) => {
    const memberRef = doc(db, getPath('team'), `member_${index}`)
    batch.set(memberRef, {
      ...member,
      image: `/images/team/${member.name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
      updatedAt: new Date().toISOString(),
    })
  })

  await batch.commit()
}

async function seedSettings(): Promise<void> {
  console.log('Seeding site settings...')
  const settingsRef = doc(db, getPath('settings'), 'config')
  await setDoc(settingsRef, {
    siteName: SITE_CONFIG.name,
    legalName: SITE_CONFIG.legalName,
    tagline: SITE_CONFIG.tagline,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    email: SITE_CONFIG.email,
    phone: SITE_CONFIG.phone,
    address: SITE_CONFIG.address,
    social: SITE_CONFIG.social,
    founders: SITE_CONFIG.founders,
    // Image paths
    favicon: '/favicon.png',
    logoWhite: '/images/logo/Snapgo Logo White.png',
    logoBlue: '/images/logo/Snapgo Logo Blue.png',
    ogImage: '/images/og-image.png',
    updatedAt: new Date().toISOString(),
  })
}

async function seedSafetyFeatures(): Promise<void> {
  console.log('Seeding safety features...')
  const batch = writeBatch(db)

  SAFETY_FEATURES.forEach((feature, index) => {
    const featureRef = doc(db, getPath('safety'), `feature_${index}`)
    batch.set(featureRef, {
      ...feature,
      order: index,
      updatedAt: new Date().toISOString(),
    })
  })

  await batch.commit()
}

async function seedJourneyTimeline(): Promise<void> {
  console.log('Seeding journey timeline...')
  const batch = writeBatch(db)

  JOURNEY_TIMELINE.forEach((item, index) => {
    const itemRef = doc(db, getPath('journey'), `item_${index}`)
    batch.set(itemRef, {
      ...item,
      order: index,
      updatedAt: new Date().toISOString(),
    })
  })

  await batch.commit()
}

async function seedNavigation(): Promise<void> {
  console.log('Seeding navigation...')
  const batch = writeBatch(db)

  NAV_LINKS.forEach((link, index) => {
    const linkRef = doc(db, getPath('navigation'), `link_${index}`)
    batch.set(linkRef, {
      ...link,
      order: index,
      isActive: true,
      updatedAt: new Date().toISOString(),
    })
  })

  await batch.commit()
}

// Main seed function
async function seedFirestore(): Promise<void> {
  console.log('='.repeat(60))
  console.log('Snapgo Firestore Seed Script')
  console.log('='.repeat(60))
  console.log(`App ID: ${APP_ID}`)
  console.log(`Project ID: ${firebaseConfig.projectId}`)
  console.log('')

  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('Error: Firebase configuration not found!')
    console.error('Make sure you have set the following environment variables:')
    console.error('  - NEXT_PUBLIC_FIREBASE_API_KEY')
    console.error('  - NEXT_PUBLIC_FIREBASE_PROJECT_ID')
    console.error('  - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN')
    console.error('  - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET')
    console.error('  - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID')
    console.error('  - NEXT_PUBLIC_FIREBASE_APP_ID')
    process.exit(1)
  }

  try {
    // Clear existing collections
    console.log('Clearing existing data...')
    await clearCollection(getPath('content', 'stats'))
    await clearCollection(getPath('content', 'features'))
    await clearCollection(getPath('content', 'howItWorks'))
    await clearCollection(getPath('content', 'testimonials'))
    await clearCollection(getPath('team'))
    await clearCollection(getPath('safety'))
    await clearCollection(getPath('journey'))
    await clearCollection(getPath('navigation'))
    console.log('')

    // Seed all data
    console.log('Seeding new data...')
    await seedHeroContent()
    await seedStats()
    await seedFeatures()
    await seedHowItWorks()
    await seedTestimonials()
    await seedAbout()
    await seedApps()
    await seedContact()
    await seedSocial()
    await seedImages()
    await seedTeam()
    await seedSettings()
    await seedSafetyFeatures()
    await seedJourneyTimeline()
    await seedNavigation()

    console.log('')
    console.log('='.repeat(60))
    console.log('Firestore seeded successfully!')
    console.log('='.repeat(60))
    console.log('')
    console.log('Collections seeded:')
    console.log('  - content/hero')
    console.log('  - content/stats')
    console.log('  - content/features')
    console.log('  - content/howItWorks')
    console.log('  - content/testimonials')
    console.log('  - content/about')
    console.log('  - content/apps')
    console.log('  - content/contact')
    console.log('  - content/social')
    console.log('  - content/images')
    console.log('  - team/')
    console.log('  - settings/config')
    console.log('  - safety/')
    console.log('  - journey/')
    console.log('  - navigation/')

  } catch (error) {
    console.error('Error seeding Firestore:', error)
    process.exit(1)
  }
}

// Run the seed
seedFirestore().then(() => {
  console.log('')
  console.log('Done! You can now verify the data in the Firebase console.')
  process.exit(0)
})
