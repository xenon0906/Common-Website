import * as admin from 'firebase-admin'

let initialized = false

function getApp(): admin.app.App | null {
  if (initialized) {
    return admin.app()
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (!serviceAccountKey) {
    const errorMsg =
      '[firebase-admin] FIREBASE_SERVICE_ACCOUNT_KEY not configured. ' +
      'Server-side operations (uploads, token verification) are disabled. ' +
      'Run: npm run setup:service-account for instructions.'
    console.warn(errorMsg)
    return null
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountKey)
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: storageBucket,
    })
    initialized = true
    console.log('[firebase-admin] ✅ Initialized successfully with storage bucket:', storageBucket)
    return admin.app()
  } catch (error) {
    console.error('[firebase-admin] ❌ Failed to initialize:', error)
    return null
  }
}

export function getAdminAuth(): admin.auth.Auth | null {
  const app = getApp()
  return app ? app.auth() : null
}

/**
 * Returns true if the Firebase Admin SDK has the required env var configured.
 * Use this to distinguish "not configured" from "verification failed".
 */
export function isAdminConfigured(): boolean {
  return !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY
}

/**
 * Returns a Firestore instance from the Admin SDK.
 * Bypasses all Firestore security rules - use only in server-side API routes.
 */
export function getAdminDb(): admin.firestore.Firestore | null {
  const app = getApp()
  return app ? app.firestore() : null
}

/**
 * Returns a Storage instance from the Admin SDK.
 * Use for server-side file uploads/deletes - bypasses storage security rules.
 */
export function getAdminStorage(): admin.storage.Storage | null {
  const app = getApp()
  return app ? app.storage() : null
}

/**
 * Get the full Firestore collection path with app ID prefix.
 */
export function getAdminCollectionPath(collectionName: string): string {
  const appId = process.env.NEXT_PUBLIC_APP_ID || 'default'
  return `artifacts/${appId}/public/data/${collectionName}`
}

export async function verifyIdToken(token: string): Promise<admin.auth.DecodedIdToken | null> {
  const auth = getAdminAuth()
  if (!auth) {
    return null
  }

  try {
    return await auth.verifyIdToken(token)
  } catch (error) {
    console.error('[firebase-admin] Token verification failed:', error)
    return null
  }
}
