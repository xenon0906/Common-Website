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

function validateFirebaseConfig(): void {
  const envVars = {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }

  const missing = Object.entries(envVars)
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    console.warn(
      `[firebase-server] Missing environment variables: ${missing.join(', ')}. ` +
      'Firebase features that depend on these will not work.'
    )
  }
}

function initializeServerFirebase(): FirebaseApp | null {
  validateFirebaseConfig()

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

// Admin Firestore access - returns a Firestore-like object for API routes
// This is a compatibility layer for routes that use Admin SDK patterns
export function getAdminFirestore() {
  const db = getServerDb()
  if (!db) {
    throw new Error('Firebase not configured')
  }

  return {
    collection: (path: string) => {
      const collRef = collection(db, path)
      return {
        doc: (docId: string) => {
          const docRef = doc(db, path, docId)
          return {
            get: async () => {
              const snap = await getDoc(docRef)
              return {
                exists: snap.exists(),
                id: snap.id,
                data: () => snap.data(),
              }
            },
            update: async (data: Record<string, unknown>) => {
              const { setDoc } = await import('firebase/firestore')
              await setDoc(docRef, data, { merge: true })
            },
            delete: async () => {
              const { deleteDoc } = await import('firebase/firestore')
              await deleteDoc(docRef)
            },
          }
        },
        add: async (data: Record<string, unknown>) => {
          const { addDoc } = await import('firebase/firestore')
          const newDoc = await addDoc(collRef, data)
          return { id: newDoc.id }
        },
        orderBy: (field: string, direction: 'asc' | 'desc' = 'asc') => {
          return {
            limit: (n: number) => {
              return {
                get: async () => {
                  const { query: firestoreQuery, orderBy: firestoreOrderBy, limit: firestoreLimit } = await import('firebase/firestore')
                  const q = firestoreQuery(collRef, firestoreOrderBy(field, direction), firestoreLimit(n))
                  const snapshot = await getDocs(q)
                  return {
                    empty: snapshot.empty,
                    docs: snapshot.docs.map(d => ({
                      id: d.id,
                      data: () => d.data(),
                    })),
                  }
                },
              }
            },
          }
        },
      }
    },
  }
}

// Get collection path with app ID prefix
export function getCollectionPath(collectionName: string): string {
  const appId = getServerAppId()
  return `artifacts/${appId}/public/data/${collectionName}`
}
