import { doc, getDoc, setDoc, updateDoc, Firestore } from 'firebase/firestore'
import { getFirebaseDb, getAppId } from '@/lib/firebase'

export interface UserProfile {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  phone: string | null
  createdAt: string
  updatedAt: string
}

// Helper to safely get Firestore instance
function getDb(): Firestore | null {
  try {
    return getFirebaseDb()
  } catch (err) {
    console.error('Failed to get Firestore instance:', err)
    return null
  }
}

export async function createUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  const db = getDb()
  if (!db) {
    console.warn('Firestore not available, skipping profile creation')
    return
  }

  try {
    const appId = getAppId()
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', uid)

    await setDoc(docRef, {
      uid,
      email: data.email || null,
      displayName: data.displayName || null,
      photoURL: data.photoURL || null,
      phone: data.phone || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Failed to create user profile:', err)
    throw err
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const db = getDb()
  if (!db) {
    console.warn('Firestore not available, returning null profile')
    return null
  }

  try {
    const appId = getAppId()
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', uid)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) return null
    return docSnap.data() as UserProfile
  } catch (err) {
    console.error('Failed to get user profile:', err)
    return null
  }
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  const db = getDb()
  if (!db) {
    console.warn('Firestore not available, skipping profile update')
    return
  }

  try {
    const appId = getAppId()
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', uid)

    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Failed to update user profile:', err)
    throw err
  }
}
