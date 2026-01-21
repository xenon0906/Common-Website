// Firebase Configuration for Admin Dashboard
// Uses window globals with environment variable fallback

import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'

// Extend window type for Firebase globals
declare global {
  interface Window {
    __firebase_config?: string
    __app_id?: string
    __initial_auth_token?: string
  }
}

// Default Firebase config from environment variables
const defaultConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
}

// Get Firebase config from window globals or fallback to env vars
function getFirebaseConfig() {
  if (typeof window !== 'undefined' && window.__firebase_config) {
    try {
      return JSON.parse(window.__firebase_config)
    } catch (e) {
      console.error('Failed to parse __firebase_config:', e)
    }
  }
  return defaultConfig
}

// Get app ID for Firestore path prefix
export function getAppId(): string {
  if (typeof window !== 'undefined' && window.__app_id) {
    return window.__app_id
  }
  return process.env.NEXT_PUBLIC_APP_ID || 'default'
}

// Get initial auth token for auto-login
export function getInitialAuthToken(): string | null {
  if (typeof window !== 'undefined' && window.__initial_auth_token) {
    return window.__initial_auth_token
  }
  return null
}

// Initialize Firebase
let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null
let storage: FirebaseStorage | null = null

function initializeFirebase(): FirebaseApp {
  if (app) return app

  const existingApps = getApps()
  if (existingApps.length > 0) {
    app = existingApps[0]
  } else {
    const config = getFirebaseConfig()
    // Only initialize if we have valid config
    if (config.apiKey && config.projectId) {
      app = initializeApp(config)
    } else {
      // Create a minimal app for development/demo purposes
      console.warn('Firebase config not found, using demo mode')
      app = initializeApp({
        apiKey: 'demo-api-key',
        authDomain: 'demo.firebaseapp.com',
        projectId: 'demo-project',
        storageBucket: 'demo-project.appspot.com',
        messagingSenderId: '000000000000',
        appId: '1:000000000000:web:demo'
      }, 'demo')
    }
  }

  return app
}

// Get Firebase services
export function getFirebaseApp(): FirebaseApp {
  return initializeFirebase()
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(initializeFirebase())
  }
  return auth
}

export function getFirebaseDb(): Firestore {
  if (!db) {
    db = getFirestore(initializeFirebase())
  }
  return db
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) {
    storage = getStorage(initializeFirebase())
  }
  return storage
}

// Collection path helper - uses appId for multi-tenant support
export function getCollectionPath(collectionName: string): string {
  const appId = getAppId()
  return `artifacts/${appId}/public/data/${collectionName}`
}

// Re-export Firestore functions for convenience
export {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  where,
} from 'firebase/firestore'

// Export for convenience
export { app, auth, db, storage }
