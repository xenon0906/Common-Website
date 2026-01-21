// Firebase Configuration for Server-Side (API Routes)
// Uses environment variables only (no window globals)
//
// ==============================================================================
// FIRESTORE PATH STRUCTURE (matches Admin Panel navigation)
// ==============================================================================
// Base path: artifacts/{appId}/public/data/
//
// ┌─────────────────────────────────────────────────────────────────────────────┐
// │ CONTENT MANAGER (/admin/content/)                                           │
// ├─────────────────────────────────────────────────────────────────────────────┤
// │ content/hero              (document)   - Hero section                       │
// │ content/stats/            (collection) - Homepage statistics                │
// │ content/features/         (collection) - Feature cards                      │
// │ content/testimonials/     (collection) - User testimonials                  │
// │ content/howItWorks/       (collection) - How it works steps                 │
// │ content/about             (document)   - About page content                 │
// │ content/apps              (document)   - App store links                    │
// │ content/contact           (document)   - Contact information                │
// │ content/social            (document)   - Social media links                 │
// └─────────────────────────────────────────────────────────────────────────────┘
//
// ┌─────────────────────────────────────────────────────────────────────────────┐
// │ STANDALONE MANAGERS                                                         │
// ├─────────────────────────────────────────────────────────────────────────────┤
// │ blogs/                    (collection) - Blog posts (/admin/blogs/)         │
// │ team/                     (collection) - Team members (/admin/team/)        │
// │ faq/                      (collection) - FAQ items (/admin/faq/)            │
// │ achievements/             (collection) - Achievements (/admin/achievements/)│
// │ instagram/                (collection) - Instagram reels (/admin/instagram/)│
// │ media/                    (collection) - Media files (/admin/media/)        │
// │ navigation/               (collection) - Nav items (/admin/navigation/)     │
// │ seo/                      (document)   - SEO settings (/admin/seo/)         │
// └─────────────────────────────────────────────────────────────────────────────┘
//
// ┌─────────────────────────────────────────────────────────────────────────────┐
// │ SETTINGS                                                                    │
// ├─────────────────────────────────────────────────────────────────────────────┤
// │ settings/config           (document)   - Site settings (/admin/settings/)   │
// └─────────────────────────────────────────────────────────────────────────────┘
// ==============================================================================

import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore, doc, getDoc, collection, getDocs, query, orderBy, where } from 'firebase/firestore'

// Firebase config from environment variables
const serverConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
}

// Get app ID for Firestore path prefix
export function getServerAppId(): string {
  return process.env.NEXT_PUBLIC_APP_ID || 'default'
}

// Check if Firebase is configured
export function isFirebaseConfigured(): boolean {
  return !!(serverConfig.apiKey && serverConfig.projectId)
}

// Initialize Firebase for server
let serverApp: FirebaseApp | null = null
let serverDb: Firestore | null = null

function initializeServerFirebase(): FirebaseApp | null {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured for server-side use')
    return null
  }

  if (serverApp) return serverApp

  const existingApps = getApps()
  if (existingApps.length > 0) {
    serverApp = existingApps[0]
  } else {
    serverApp = initializeApp(serverConfig, 'server')
  }

  return serverApp
}

export function getServerDb(): Firestore | null {
  if (!serverDb) {
    const app = initializeServerFirebase()
    if (app) {
      serverDb = getFirestore(app)
    }
  }
  return serverDb
}

// Helper functions to fetch data from Firestore

export async function getFirestoreDocument<T>(
  collectionPath: string,
  documentId: string,
  defaultValue: T
): Promise<T> {
  try {
    const db = getServerDb()
    if (!db) return defaultValue

    const appId = getServerAppId()
    // Split the collection path to handle nested paths like 'content' properly
    const pathSegments = collectionPath.split('/').filter(Boolean)
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', ...pathSegments, documentId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { ...defaultValue, ...docSnap.data() } as T
    }
    return defaultValue
  } catch (error) {
    console.error(`Error fetching document ${collectionPath}/${documentId}:`, error)
    return defaultValue
  }
}

export async function getFirestoreCollection<T extends { id?: string }>(
  collectionPath: string,
  defaultValue: T[],
  orderByField?: string
): Promise<T[]> {
  try {
    const db = getServerDb()
    if (!db) return defaultValue

    const appId = getServerAppId()
    // Split the collection path to handle nested paths like 'content/stats'
    const pathSegments = collectionPath.split('/').filter(Boolean)
    const collRef = collection(db, 'artifacts', appId, 'public', 'data', ...pathSegments)

    let q = orderByField
      ? query(collRef, orderBy(orderByField))
      : query(collRef)

    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return defaultValue
    }

    return snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as T[]
  } catch (error) {
    console.error(`Error fetching collection ${collectionPath}:`, error)
    return defaultValue
  }
}

// Re-export Firestore functions
export { doc, getDoc, collection, getDocs, query, orderBy, where }
