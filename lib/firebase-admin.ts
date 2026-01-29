import * as admin from 'firebase-admin'

let initialized = false

function getApp(): admin.app.App | null {
  if (initialized) {
    return admin.app()
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (!serviceAccountKey) {
    console.warn(
      '[firebase-admin] FIREBASE_SERVICE_ACCOUNT_KEY not configured. ' +
      'Server-side token verification is disabled. ' +
      'Set this env var to a JSON string of your Firebase service account key.'
    )
    return null
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountKey)
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
    initialized = true
    return admin.app()
  } catch (error) {
    console.error('[firebase-admin] Failed to initialize:', error)
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
